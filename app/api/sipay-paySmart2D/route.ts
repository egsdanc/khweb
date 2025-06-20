import { NextResponse } from 'next/server';

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/payment/paySmart2D";

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

    if (!merchantKey) {
      return NextResponse.json(
        { error: 'Merchant key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        ...body,
        merchant_key: merchantKey
      }])
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
    console.error("Sipay PaySmart2D error:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message
    }, { status: 500 });
  }
} 