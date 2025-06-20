import { NextResponse } from 'next/server';

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/payment/complete";

if (!SIPAY_BASE_URL) {
  throw new Error('SIPAY_BASE_URL environment variable is not defined');
}

const sipayUrl = `${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({
        message: "Authorization header is required"
      }, { status: 400 });
    }

    const body = await request.json();
    const { invoice_id, order_id, status, hash_key } = body;

    // Get merchant key from environment variable
    const merchant_key = process.env.SIPAY_MERCHANT_KEY;

    if (!merchant_key) {
      return NextResponse.json(
        { error: 'Merchant key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_key,
        invoice_id,
        order_id,
        status,
        hash_key
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment completion failed', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 