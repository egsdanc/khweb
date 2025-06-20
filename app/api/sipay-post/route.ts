export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

import * as dotenv from 'dotenv';
dotenv.config();
// Veya


console.log('dotenv result:', dotenv?.config()?.parsed?.SIPAY_MERCHANT_KEY);
const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/api/getpos";
const SIPAY_MERCHANT_KEY = process.env.SIPAY_MERCHANT_KEY || dotenv?.config()?.parsed?.SIPAY_MERCHANT_KEY;

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
console.log(" cccc",body.credit_card)
console.log(" dddd",SIPAY_MERCHANT_KEY)
console.log(" eeee",  process.env.SIPAY_COMMISSION_BY)

    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        credit_card: body.credit_card,
        amount: body.amount,
        currency_code: body.currency_code,
        // merchant_key: "$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO",
        merchant_key:  SIPAY_MERCHANT_KEY,
        commission_by: process.env.SIPAY_COMMISSION_BY,
        is_recurring: body.is_recurring,
        is_2d: body.is_2d
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
    console.error("Sipay post error:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error.message
    }, { status: 500 });
  }
}



// const response = await fetch('/api/sipay-post', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer your-token-here'
//     },
//     body: JSON.stringify({
//       credit_card: "534261",
//       amount: 248.5,
//       currency_code: "TRY",
//       is_recurring: 0,
//       is_2d: 0
//     })
//   });