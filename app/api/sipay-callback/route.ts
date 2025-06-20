import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    console.log('Sipay callback data:', data);

    // URL'i oluştur
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const redirectUrl = new URL(baseUrl);

    // Önemli parametreleri seç
    const importantParams = {
      status: data.sipay_status,
      invoice_id: data.invoice_id,
      error_code: data.error_code,
      error_message: data.error || data.status_description,
      amount: data.amount
    };

    // Başarılı ödeme durumunda success sayfasına yönlendir
    if (data.sipay_status === '1') {
      // Ödeme başarılıysa ve Pre-Authorization değilse status=1 yap
      if (data.transaction_type !== 'Pre-Authorization') {
        try {
          const connection = await mysql.createConnection(dbConfig);
          await connection.execute(
            'UPDATE sipay_payment SET status=1 WHERE invoice_id = ?',
            [data.invoice_id]
          );
          await connection.end();
        } catch (dbError) {
          console.error('sipayment status güncellenemedi:', dbError);
        }
      }
      redirectUrl.pathname = '/payment/success';
      // Sadece önemli parametreleri ekle
      Object.entries(importantParams).forEach(([key, value]) => {
        if (value) {
          redirectUrl.searchParams.append(key, value as string);
        }
      });
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    // Başarısız ödeme durumunda error sayfasına yönlendir
    redirectUrl.pathname = '/payment/error';
    // Sadece önemli parametreleri ekle
    Object.entries(importantParams).forEach(([key, value]) => {
      if (value) {
        redirectUrl.searchParams.append(key, value as string);
      }
    });
    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (error) {
    console.error('Sipay callback error:', error);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const redirectUrl = new URL(baseUrl);
    redirectUrl.pathname = '/payment/error';
    redirectUrl.searchParams.append('error_message', 'Bir hata oluştu');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const data = Object.fromEntries(searchParams.entries());
    
    console.log('Sipay callback data:', data);

    // URL'i oluştur
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const redirectUrl = new URL(baseUrl);

    // Önemli parametreleri seç
    const importantParams = {
      status: data.sipay_status,
      invoice_id: data.invoice_id,
      error_code: data.error_code,
      error_message: data.error || data.status_description,
      amount: data.amount
    };

    // Başarılı ödeme durumunda success sayfasına yönlendir
    if (data.sipay_status === '1') {
      // Ödeme başarılıysa ve Pre-Authorization değilse status=1 yap
      if (data.transaction_type !== 'Pre-Authorization') {
        try {
          const connection = await mysql.createConnection(dbConfig);
          await connection.execute(
            'UPDATE sipay_payment SET status=1 WHERE invoice_id = ?',
            [data.invoice_id]
          );
          await connection.end();
        } catch (dbError) {
          console.error('sipayment status güncellenemedi:', dbError);
        }
      }
      redirectUrl.pathname = '/payment/success';
      // Sadece önemli parametreleri ekle
      Object.entries(importantParams).forEach(([key, value]) => {
        if (value) {
          redirectUrl.searchParams.append(key, value as string);
        }
      });
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    // Başarısız ödeme durumunda error sayfasına yönlendir
    redirectUrl.pathname = '/payment/error';
    // Sadece önemli parametreleri ekle
    Object.entries(importantParams).forEach(([key, value]) => {
      if (value) {
        redirectUrl.searchParams.append(key, value as string);
      }
    });
    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (error) {
    console.error('Sipay callback error:', error);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const redirectUrl = new URL(baseUrl);
    redirectUrl.pathname = '/payment/error';
    redirectUrl.searchParams.append('error_message', 'Bir hata oluştu');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
} 