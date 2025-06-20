export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/api/token";

if (!SIPAY_BASE_URL) {
  throw new Error('SIPAY_BASE_URL environment variable is not defined');
}

const sipayUrl = `${SIPAY_BASE_URL}${SIPAY_ENDPOINT}`;

export async function POST() {
  try {
    const response = await fetch(sipayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: process.env.SIPAY_APP_ID,
        app_secret: process.env.SIPAY_APP_SECRET
      })
    });

    if (!response.ok) {
      throw new Error(`Sipay API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate, max-age=0'
      }
    });
  } catch (error) {
    console.error("Sipay token error:", error);
    return NextResponse.json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 