import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL as string;
const SIPAY_ENDPOINT = '/ccpayment/api/confirmPayment';
// const SIPAY_MERCHANT_KEY = "$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO";
const SIPAY_MERCHANT_KEY = process.env.SIPAY_MERCHANT_KEY || dotenv.config().parsed.SIPAY_MERCHANT_KEY;
const SIPAY_APP_SECRET = process.env.SIPAY_APP_SECRET as string;

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('ConfirmPayment Request body:', body);

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
    const requiredFields = ['invoice_id', 'total'];
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
    console.log('generateHashKey parameters:', {
      total: body.total,
      installments_number: '1',
      currency_code: 'TRY',
      merchant_key: SIPAY_MERCHANT_KEY,
      invoice_id: body.invoice_id,
      app_secret: SIPAY_APP_SECRET
    });

    const hashKey = generateHashKey(
      body.total,
      '1', // installments_number
      'TRY', // currency_code
      SIPAY_MERCHANT_KEY,
      body.invoice_id,
      SIPAY_APP_SECRET
    );

    if (!hashKey) {
      throw new Error('Failed to generate hash key');
    }

    console.log('Generated hash key:', hashKey);

    const requestBody = {
      invoice_id: body.invoice_id,
      status: body.status || 1,
      total: body.total,
      merchant_key: SIPAY_MERCHANT_KEY,
      hash_key: hashKey
    };

    console.log('Sending request to Sipay:', {
      url: `${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`,
      body: requestBody,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const response = await fetch(`${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const sipayData = await response.json();
    console.log("Sipay ConfirmPayment Response:", sipayData);

    if (!response.ok || sipayData.status_code !== 100) {
      return NextResponse.json({
        message: "Sipay API error",
        details: sipayData
      }, { status: response.ok ? 400 : response.status });
    }

    return NextResponse.json(sipayData);

  } catch (error: any) {
    console.error('SiPay ConfirmPayment Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Payment confirmation failed',
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