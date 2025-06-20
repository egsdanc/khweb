export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/api/commissions";

if (!SIPAY_BASE_URL) {
  throw new Error('SIPAY_BASE_URL environment variable is not defined');
}

const sipayUrl = `${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({
        message: "Authorization header is required"
      }, { status: 400 });
    }

    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        currency_code: body.currency_code,
        commission_by: process.env.SIPAY_COMMISSION_BY
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
    console.error("Sipay commissions error:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message
    }, { status: 500 });
  }
} 