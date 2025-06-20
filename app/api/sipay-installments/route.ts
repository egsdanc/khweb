import { NextResponse } from 'next/server';


import * as dotenv from 'dotenv';
dotenv.config();
const SIPAY_MERCHANT_KEY = process.env.SIPAY_MERCHANT_KEY || dotenv?.config()?.parsed?.SIPAY_MERCHANT_KEY;
const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL;
const SIPAY_ENDPOINT = "/ccpayment/api/installments";

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
    
       console.log("mmmm",SIPAY_MERCHANT_KEY)
        if (!SIPAY_MERCHANT_KEY) {
            return NextResponse.json(
                { error: 'Merchant key is not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(sipayUrl, {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({
       //         merchant_key: "$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO"
            merchant_key: SIPAY_MERCHANT_KEY

            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch installments data' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in sipay-installments:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 