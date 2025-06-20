import { NextResponse } from 'next/server';

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/api/refund";

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

    const merchantKey = process.env.SIPAY_MERCHANT_KEY;
    const appId = process.env.SIPAY_APP_ID;
    const appSecret = process.env.SIPAY_APP_SECRET;

    if (!merchantKey || !appId || !appSecret) {
      return NextResponse.json(
        { error: 'Required environment variables are not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Gerekli alanların kontrolü
    if (!body.invoice_id || !body.amount || !body.hash_key) {
      return NextResponse.json({
        message: "Required fields are missing: invoice_id, amount, and hash_key are required"
      }, { status: 400 });
    }

    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        merchant_key: merchantKey,
        app_id: appId,
        app_secret: appSecret
      })
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("JSON olmayan cevap geldi:", text);
      return NextResponse.json({
        message: "API'den beklenmeyen formatta cevap geldi",
        rawResponse: text
      }, { status: 500 });
    }

    const sipayData = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        message: "Sipay API error",
        details: sipayData
      }, { status: response.status });
    }

    return NextResponse.json(sipayData);

  } catch (error: any) {
    console.error("Sipay refund error:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message
    }, { status: 500 });
  }
} 