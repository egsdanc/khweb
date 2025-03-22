import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "@codingwithmanny/iyzipay-js";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST || "your_host",
  user: process.env.MYSQL_USER || "your_user",
  password: process.env.MYSQL_PASSWORD || "your_password",
  database: process.env.MYSQL_DATABASE || "your_database",
};

async function createTableIfNotExists(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS cihaz_satis_website (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ad VARCHAR(100) NOT NULL,
      soyad VARCHAR(100) NOT NULL,
      telefon VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      adres TEXT NOT NULL,
      ilce VARCHAR(100),
      sehir VARCHAR(100) NOT NULL,
      ulke VARCHAR(100) NOT NULL,
      not_satici TEXT,
      cihaz_id VARCHAR(100) NOT NULL,
      fiyat DECIMAL(10,2) NOT NULL,
      adet DECIMAL(10,0) NOT NULL ,
      odeme_durumu VARCHAR(50) DEFAULT 'beklemede',
      buyer_id VARCHAR(100) NOT NULL,
      basket_id VARCHAR(100),
      conversationId VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function POST(request: NextRequest) {
  let connection;
  let paymentSuccessful = false;
  
  try {
    // Veritabanı bağlantısı oluştur
    connection = await mysql.createConnection(dbConfig);
    
    // Tablo yoksa oluştur
    await createTableIfNotExists(connection);
    
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    
    // Parametreleri doğru şekilde ayıkla
    const rawCihazId = queryParams.get('cihaz_id') || '';
    
    // Eğer cihaz_id, not_satici bilgisini içeriyorsa onu ayır
    let cihazId = rawCihazId;
    let notSatici = queryParams.get('not_satici') || null;
    
    if (rawCihazId.includes('¬_satici=')) {
      const parts = rawCihazId.split('¬_satici=');
      cihazId = parts[0];
      notSatici = parts[1] || notSatici;
    }
    
    // Diğer parametreleri ayıkla
    const userData = {
      ad: queryParams.get('ad'),
      soyad: queryParams.get('soyad'),
      telefon: queryParams.get('telefon'),
      email: queryParams.get('email'),
      adres: queryParams.get('adres') ? decodeURIComponent(queryParams.get('adres')!) : null,
      ilce: queryParams.get('ilce'),
      sehir: queryParams.get('sehir'),
      ulke: queryParams.get('ulke'),
      not_satici: notSatici,
      fiyat: queryParams.get('fiyat'),
      adet: queryParams.get('adet') ,
      cihaz_id: cihazId,
      buyer_id: queryParams.get('buyer_id'),
      basket_id: queryParams.get('basket_id'),
      conversation_id: queryParams.get('conversation_id')
    };

    const formData = await request.formData();
    const token = formData.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token bulunamadı" },
        { status: 400 }
      );
    }

    // Iyzipay client configuration
    const client = Iyzipay({
      apiKey: process.env.IYZIPAY_API_KEY!,
      secretKey: process.env.IYZIPAY_SECRET_KEY!,
    });

    // Verify payment result
    const checkoutForm = await client.payment.checkoutForm.retrieve({
      locale: "tr",
      conversationId: queryParams.get('conversation_id')?.toString(),
      token: token.toString(),
    });

    // On successful payment, redirect
    if (checkoutForm.status === "success" && checkoutForm.paymentStatus === "SUCCESS") {
      // Ödeme başarılı olduğunu işaretleyelim
      paymentSuccessful = true;
      
      try {
        // Veritabanına kaydet
        await connection.execute(
          `INSERT INTO cihaz_satis_website (
            ad, soyad, telefon, email, adres, ilce, sehir, ulke, not_satici, cihaz_id, fiyat, adet, odeme_durumu, buyer_id, basket_id, conversationId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userData.ad,
            userData.soyad,
            userData.telefon,
            userData.email,
            userData.adres,
            userData.ilce,
            userData.sehir,
            userData.ulke,
            userData.not_satici,
            userData.cihaz_id,
            userData.fiyat,
            userData.adet,
            "odendi",
            userData.buyer_id,
            userData.basket_id,
            userData.conversation_id
          ]
        );

        // Veritabanı işlemi başarılı - normal başarı sayfasına yönlendir
        const successUrl = new URL("/success", request.url);
        
        // Add all user data as query parameters, properly encoded
        for (const [key, value] of Object.entries(userData)) {
          if (value !== null) {
            successUrl.searchParams.append(key, value.toString());
          }
        }
        
        console.log("Redirecting to:", successUrl.toString());
        
        return new Response(null, {
          status: 303,
          headers: {
            Location: successUrl.toString(),
          },
        });
      } catch (dbError) {
        // Veritabanı işlemi başarısız oldu, ama ödeme başarılı
        console.error("Veritabanı kayıt hatası:", dbError);
        
        // Özel bir başarı sayfasına yönlendir - ödeme başarılı ama veri kaydedilemedi
        const partialSuccessUrl = new URL("/partial-success", request.url);
        
        for (const [key, value] of Object.entries(userData)) {
          if (value !== null) {
            partialSuccessUrl.searchParams.append(key, value.toString());
          }
        }
        
        // Hatayı da log olarak kaydet
        partialSuccessUrl.searchParams.append("error", "database_error");
        
        console.log("Redirecting to partial success:", partialSuccessUrl.toString());
        
        return new Response(null, {
          status: 303,
          headers: {
            Location: partialSuccessUrl.toString(),
          },
        });
      }
    } else {
      return NextResponse.json(
        {
          message: "Ödeme başarısız veya tamamlanmadı",
          status: false,
          paymentStatus: checkoutForm.paymentStatus,
          checkoutFormStatus: checkoutForm.status,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Ödeme doğrulama hatası:", error);
    
    if (paymentSuccessful) {
      // Ödeme başarılı ama işlem sırasında bir hata oluştu
      const errorUrl = new URL("/partial-success", request.url);
      errorUrl.searchParams.append("error", "processing_error");
      errorUrl.searchParams.append("payment_status", "success");
      
      return new Response(null, {
        status: 303,
        headers: {
          Location: errorUrl.toString(),
        },
      });
    } else {
      // Ödeme doğrulanamadı veya başarısız oldu
      return NextResponse.json(
        { error: "Ödeme doğrulama işlemi sırasında hata oluştu" },
        { status: 500 }
      );
    }
  } finally {
    // Bağlantıyı kapat
    if (connection) {
      await connection.end();
    }
  }
}