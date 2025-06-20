export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();
const SIPAY_MERCHANT_KEY = process.env.SIPAY_MERCHANT_KEY || dotenv.config().parsed.SIPAY_MERCHANT_KEY;
const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL as string;
const SIPAY_ENDPOINT = '/ccpayment/api/paySmart3D';
const SIPAY_APP_SECRET = process.env.SIPAY_APP_SECRET as string;

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

if (!SIPAY_BASE_URL || !SIPAY_MERCHANT_KEY || !SIPAY_APP_SECRET) {
  throw new Error('SiPay environment variables are not defined');
}

// Hash key oluşturma fonksiyonu (Node.js'de çalıştığı belirtilen versiyon)
function generateHashKey(total: string | number, installment: string | number, currency_code: string, merchant_key: string, invoice_id: string, app_secret: string): string | null {
    try {
        const data = total + '|' + installment + '|' + currency_code + '|' + merchant_key + '|' + invoice_id;

        const iv = crypto.createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 16); // 16 hex chars IV

        const password = crypto.createHash('sha1').update(app_secret).digest('hex');

        const salt = crypto.createHash('sha1').update(String(Math.random())).digest('hex').slice(0, 4); // 4 hex chars salt

        const salt_with_password = crypto.createHash('sha256').update(password + salt).digest('hex').slice(0, 32); // 32 hex chars key

        // createCipheriv hex stringleri kabul ediyor (any type assertion needed)
        const cipher = crypto.createCipheriv('aes-256-cbc', salt_with_password as any, iv as any);

        const padded_data = data; // Sizin kodunuzda padded_data = data;

        let encrypted = cipher.update(padded_data, 'binary', 'base64'); // 'binary' encoding
        encrypted += cipher.final('base64');

        const msg_encrypted_bundle = iv + ':' + salt + ':' + encrypted;

        const msg_encrypted_bundle_replaced = msg_encrypted_bundle.replace(/\//g, '__'); // Regex kullanarak tüm / leri değiştirir

        console.log('Generated hash key:', msg_encrypted_bundle_replaced);

        return msg_encrypted_bundle_replaced;
    } catch (error: any) {
        console.error("Hata (generateHashKey):", error.message || error);
        return null;
    }
}

async function createTableIfNotExists(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS sipay_payment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoice_id VARCHAR(100) NOT NULL UNIQUE,
      cc_holder_name VARCHAR(100),
      cc_no VARCHAR(30),
      expiry_month VARCHAR(10),
      expiry_year VARCHAR(10),
      cvv VARCHAR(10),
      total VARCHAR(20),
      unit_price VARCHAR(20),
      quantity INT DEFAULT 1,
      name VARCHAR(100),
      surname VARCHAR(100),
      currency_code VARCHAR(10),
      installments_number VARCHAR(10),
      invoice_description TEXT,
      bill_email VARCHAR(100),
      bill_phone VARCHAR(30),
      bill_address1 TEXT,
      bill_address2 TEXT,
      bill_city VARCHAR(100),
      bill_postcode VARCHAR(20),
      bill_state VARCHAR(100),
      bill_country VARCHAR(100),
      ip VARCHAR(50),
      status INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function POST(request: Request) {
  try {
    console.log('Sipay 3D Payment API called');
    const body = await request.json();
    // Veritabanına kaydet
    try {
      const connection = await mysql.createConnection(dbConfig);
      await createTableIfNotExists(connection);
      await connection.execute(
        `INSERT INTO sipay_payment (
          invoice_id, cc_holder_name, cc_no, expiry_month, expiry_year, cvv, total, unit_price, quantity, name, surname, currency_code, installments_number, invoice_description, bill_email, bill_phone, bill_address1, bill_address2, bill_city, bill_postcode, bill_state, bill_country, ip, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        ON DUPLICATE KEY UPDATE
          cc_holder_name=VALUES(cc_holder_name), cc_no=VALUES(cc_no), expiry_month=VALUES(expiry_month), expiry_year=VALUES(expiry_year), cvv=VALUES(cvv), total=VALUES(total), unit_price=VALUES(unit_price), quantity=VALUES(quantity), name=VALUES(name), surname=VALUES(surname), currency_code=VALUES(currency_code), installments_number=VALUES(installments_number), invoice_description=VALUES(invoice_description), bill_email=VALUES(bill_email), bill_phone=VALUES(bill_phone), bill_address1=VALUES(bill_address1), bill_address2=VALUES(bill_address2), bill_city=VALUES(bill_city), bill_postcode=VALUES(bill_postcode), bill_state=VALUES(bill_state), bill_country=VALUES(bill_country), ip=VALUES(ip)
        `,
        [
          body.invoice_id ?? null,
          body.cc_holder_name ?? null,
          body.cc_no ?? null,
          body.expiry_month ?? null,
          body.expiry_year ?? null,
          body.cvv ?? null,
          body.total ?? null,
          body.unit_price ?? null,
          body.quantity ?? 1,
          body.name ?? null,
          body.surname ?? null,
          body.currency_code ?? null,
          body.installments_number ?? null,
          body.invoice_description ?? null,
          body.bill_email ?? null,
          body.bill_phone ?? null,
          body.bill_address1 ?? null,
          body.bill_address2 ?? null,
          body.bill_city ?? null,
          body.bill_postcode ?? null,
          body.bill_state ?? null,
          body.bill_country ?? null,
          body.ip ?? null
        ]
      );
      await connection.end();
    } catch (dbError) {
      console.error('sipay_payment tablosuna kayıt eklenemedi:', dbError);
    }
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const token = request.headers.get('Authorization')?.split(' ')[1];
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.error('Token is missing');
      return new NextResponse(
        JSON.stringify({ error: 'Token is required' }),
        { status: 401 }
      );
    }

    // Gerekli alanları kontrol et
    const requiredFields = [
      'cc_holder_name', 'cc_no', 'expiry_month', 'expiry_year', 'cvv', 
      'total', 'invoice_id', 'name', 'surname', 'currency_code', 
      'installments_number', 'invoice_description',
      'bill_email', 'bill_phone', 'cancel_url', 'return_url'
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`);
        return new NextResponse(
          JSON.stringify({ error: `${field} is required` }),
          { status: 400 }
        );
      }
    }

    // Hash key oluştur
    if (!SIPAY_APP_SECRET) {
      throw new Error('SIPAY_APP_SECRET is required');
    }
     //     merchant_key: "$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO",

    console.log('generateHashKey parameters:', {
      total: body.total,
      installments_number: body.installments_number || '1',
      currency_code: body.currency_code || 'TRY',
      merchant_key: SIPAY_MERCHANT_KEY ,
      invoice_id: body.invoice_id,
      app_secret: SIPAY_APP_SECRET
    });
  //    "$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO",

    const hashKey = generateHashKey(
      body.total,
      body.installments_number || '1',
      body.currency_code || 'TRY',
      SIPAY_MERCHANT_KEY,
      body.invoice_id,
      SIPAY_APP_SECRET
    );
    console.log('Generated hash key:', hashKey);

    // Base URL'den cancel ve return URL'lerini oluştur
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/sipay-callback`;

    // HTML form oluştur
    const html = `
      <!doctype html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Ödeme Sayfasına Yönlendiriliyor...</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj"
              crossorigin="anonymous"></script>
      </head>

      <body>
          <div class="container my-5">
              <form action="${SIPAY_BASE_URL}${SIPAY_ENDPOINT}" method="POST" id="paymentForm" target="_self">
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>Bearer</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" class="form-control" name="authorization" value="Bearer ${token}">
                      </div>
                  </div>
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>merchant_key</label>
                      </div>
                      <div class="col-md-10">
<input type="text" name="merchant_key" class="form-control" value="${SIPAY_MERCHANT_KEY}">                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>cc_holder_name</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" class="form-control" name="cc_holder_name" value="${body.cc_holder_name}">
                      </div>
                      <div class="col-md-2">
                          <label>cc_no</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" class="form-control" name="cc_no" value="${body.cc_no}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>expiry_month</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" class="form-control" name="expiry_month" value="${body.expiry_month}">
                      </div>
                      <div class="col-md-2">
                          <label>expiry_year</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" class="form-control" name="expiry_year" value="${body.expiry_year}">
                      </div>
                      <div class="col-md-2">
                          <label>cvv</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" class="form-control" name="cvv" value="${body.cvv}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>currency_code</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" class="form-control" name="currency_code" value="${body.currency_code || 'TRY'}">
                      </div>
                      <div class="col-md-2">
                          <label>installments_number</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" name="installments_number" class="form-control"
                              value="${body.installments_number || '1'}">
                      </div>
                      <div class="col-md-2">
                          <label>invoice_id</label>
                      </div>
                      <div class="col-md-2">
                          <input type="text" name="invoice_id" class="form-control" value="${body.invoice_id}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>invoice_description</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" name="invoice_description" class="form-control"
                              value="${body.invoice_description}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>name</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="name" class="form-control" value="${body.name}">
                      </div>
                      <div class="col-md-2">
                          <label>surname</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="surname" class="form-control" value="${body.surname}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>total</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="total" class="form-control" value="${body.total}">
                      </div>
                      <div class="col-md-2">
                          <label>items</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="items" class="form-control" value='${typeof body.items === 'string' ? body.items : JSON.stringify(body.items)}'>
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>cancel_url</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="cancel_url" class="form-control" value="${callbackUrl}">
                      </div>
                      <div class="col-md-2">
                          <label>return_url</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="return_url" class="form-control" value="${callbackUrl}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>hash_key</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" name="hash_key" class="form-control" value="${hashKey}">
                      </div>
                  </div>

                  <!-- Address Fields -->
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>bill_address1</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" name="bill_address1" class="form-control" value="${body.bill_address1 || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>bill_address2</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" name="bill_address2" class="form-control" value="${body.bill_address2 || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>bill_city</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_city" class="form-control" value="${body.bill_city || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>bill_postcode</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_postcode" class="form-control" value="${body.bill_postcode || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>bill_state</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_state" class="form-control" value="${body.bill_state || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>bill_country</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_country" class="form-control" value="${body.bill_country || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>bill_email</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_email" class="form-control" value="${body.bill_email || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>bill_phone</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="bill_phone" class="form-control" value="${body.bill_phone || ''}">
                      </div>
                  </div>

                  <!-- Additional Fields -->
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>ip</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="ip" class="form-control" value="${body.ip || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>transaction_type</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="transaction_type" class="form-control"
                              value="${body.transaction_type || 'Auth'}">
                      </div>
                      <div class="col-md-2">
                          <label>sale_web_hook_key</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="sale_web_hook_key" class="form-control"
                              value="${body.sale_web_hook_key || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>payment_completed_by</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="payment_completed_by" class="form-control"
                              value="${body.payment_completed_by || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>response_method</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="response_method" class="form-control"
                              value="${body.response_method || ''}">
                      </div>
                  </div>

                  <!-- Recurring Payment Fields -->
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>order_type</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="order_type" class="form-control" value="${body.order_type || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>recurring_payment_number</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="recurring_payment_number" class="form-control"
                              value="${body.recurring_payment_number || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>recurring_payment_cycle</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="recurring_payment_cycle" class="form-control"
                              value="${body.recurring_payment_cycle || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>recurring_payment_interval</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="recurring_payment_interval" class="form-control"
                              value="${body.recurring_payment_interval || ''}">
                      </div>
                  </div>

                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>recurring_web_hook_key</label>
                      </div>
                      <div class="col-md-10">
                          <input type="text" name="recurring_web_hook_key" class="form-control"
                              value="${body.recurring_web_hook_key || ''}">
                      </div>
                  </div>

                  <!-- Agricultural Card Fields -->
                  <div class="row mt-2 justify-content-md-center">
                      <div class="col-md-2">
                          <label>maturity_period</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="maturity_period" class="form-control"
                              value="${body.maturity_period || ''}">
                      </div>
                      <div class="col-md-2">
                          <label>payment_frequency</label>
                      </div>
                      <div class="col-md-4">
                          <input type="text" name="payment_frequency" class="form-control"
                              value="${body.payment_frequency || ''}">
                      </div>
                  </div>

                  <div class="row mt-4 justify-content-md-center mb-5">
                      <div class="col-md-8">
                          <button type="submit" value="SEND" class="btn btn-primary" style="width: 100%">Submit</button>
                      </div>
                  </div>
              </form>
          </div>
          <script>
              document.getElementById('paymentForm').submit();
          </script>
      </body>

      </html>
    `;

    console.log('Generated HTML form length:', html.length);
    console.log('Generated HTML form:', html);
    console.log('Form action URL:', `${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error: any) {
    console.error('SiPay 3D Payment Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Payment processing failed',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}