 // Imports
import Iyzipay from "@codingwithmanny/iyzipay-js";
import mysql from "mysql2/promise";

// Config
const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

// Iyzipay Client
const client = Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY!,
  secretKey: process.env.IYZIPAY_SECRET_KEY!,
});

// Rastgele ID üretme fonksiyonu
function generateRandomId(prefix: string, length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Gelen veri:", body); // Hata olup olmadığını görmek için

    const { ad, soyad, telefon, email, adres, ilce, sehir, ulke, not_satici, cihaz_id,adet } = body;

    // Veritabanına bağlan
    const connection = await mysql.createConnection(dbConfig);

    // Cihaz fiyatını getir
    const [rows] = await connection.execute(
      "SELECT cihaz_fiyat FROM cihazlar WHERE id = ?",
      [cihaz_id]
    );

    await connection.end(); // Bağlantıyı kapat

    // Eğer cihaz bulunamazsa hata döndür
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cihaz bulunamadı" }),
        { status: 404 }
      );
    }

    const cihazFiyat = (rows[0] as any).cihaz_fiyat; // Tip dönüşümü ile
    const totalPrice = parseFloat(cihazFiyat) ; // Ödemeye ek fiyat ekle

    // Rastgele ID'ler oluştur
    const conversationId = generateRandomId("conv_");
    const basketId = generateRandomId("basket_");
    const buyerId = generateRandomId("buyer_");
    const basketItemId = generateRandomId("item_");
    const identityNumber = generateRandomId("identity_");

    // Callback URL'sine query parametreleri ekle
    const baseCallbackUrl = `${process.env.BASE_URL}/api/payment-callback`;
    const callbackUrl = new URL(baseCallbackUrl);
    
    // Body'den gelen tüm verileri URL'ye ekle
    callbackUrl.searchParams.append("ad", ad);
    callbackUrl.searchParams.append("soyad", soyad);
    callbackUrl.searchParams.append("telefon", telefon);
    callbackUrl.searchParams.append("email", email);
    callbackUrl.searchParams.append("adres", encodeURIComponent(adres));
    callbackUrl.searchParams.append("ilce", ilce);
    callbackUrl.searchParams.append("sehir", sehir);
    callbackUrl.searchParams.append("fiyat", (totalPrice  * adet).toString());
    callbackUrl.searchParams.append("adet", adet.toString()); 
    callbackUrl.searchParams.append("ulke", ulke);
    callbackUrl.searchParams.append("cihaz_id", cihaz_id.toString());
    
    // Ek bilgiler de ekle
    if (not_satici) {
      callbackUrl.searchParams.append("not_satici", encodeURIComponent(not_satici));
    }
    
    // Alıcı ID'si ve sepet bilgilerini de ekle
    callbackUrl.searchParams.append("buyer_id", buyerId);
    callbackUrl.searchParams.append("basket_id", basketId);
    callbackUrl.searchParams.append("conversation_id", conversationId);

    // Iyzipay ödeme isteğini oluştur
    const response = await client.payment.checkoutForm.create({
      locale: "tr",
      conversationId: conversationId, // Rastgele conversationId
      price: cihazFiyat * adet, // DB'den alınan fiyatı kullan
      basketId: basketId, // Rastgele basketId
      paymentGroup: "PRODUCT",
      buyer: {
        id: buyerId, // Rastgele buyerId
        name: ad, // Gelen ad
        surname: soyad, // Gelen soyad
        identityNumber: identityNumber, // Kullanıcı kimlik numarası sabit
        email: email, // Gelen email
        gsmNumber: telefon, // Gelen telefon
        registrationDate: "2013-04-21 15:12:09", // Sabit tarihler
        lastLoginDate: "2015-10-05 12:43:35", // Sabit tarihler
        registrationAddress: adres, // Gelen adres
        city: sehir, // Gelen şehir
        country: ulke, // Gelen ülke
        zipCode: "38000", // Sabit posta kodu
        ip: "149.202.76.5", // Sabit IP
      },
      shippingAddress: {
        address: adres, // Gelen adres
        zipCode: "34742", // Sabit posta kodu
        contactName: `${ad} ${soyad}`, // Alıcı adı ve soyadı
        city: sehir, // Gelen şehir
        country: ulke, // Gelen ülke
      },
      billingAddress: {
        address: adres, // Gelen adres
        zipCode: "34742", // Sabit posta kodu
        contactName: `${ad} ${soyad}`, // Fatura alıcı adı ve soyadı
        city: sehir, // Gelen şehir
        country: ulke, // Gelen ülke
      },
      basketItems: [
        {
          id: basketItemId, // Rastgele basketItemId
          price: cihazFiyat  * adet, // Cihaz fiyatı
          name: "Seçilen Cihaz",
          category1: "Elektronik",
          itemType: "PHYSICAL",
        },
      ],
      enabledInstallments: [1, 2, 3, 6, 9],
      callbackUrl: callbackUrl.toString(), // Parametreli URL'yi kullan
      currency: "TRY",
      paidPrice: totalPrice  * adet, // Toplam fiyat
    });

    return new Response(JSON.stringify({ data: response }));
  } catch (error) {
    console.error("Hata:", error);
    return new Response(
      JSON.stringify({ error: "Ödeme işlemi sırasında hata oluştu" }),
      { status: 500 }
    );
  }
}