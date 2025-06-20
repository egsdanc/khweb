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
    const body = await request.json();
    const { invoice_id, status } = body;

    if (!invoice_id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE sipay_payment SET status = ? WHERE invoice_id = ?',
      [status, invoice_id]
    );
    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 