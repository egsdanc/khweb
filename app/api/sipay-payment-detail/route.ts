import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

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
      payment_status INT DEFAULT 1,
      transaction_type VARCHAR(50) DEFAULT 'Auth',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const invoice_id = url.searchParams.get('invoice_id');
  if (!invoice_id) {
    return NextResponse.json({ error: 'invoice_id parametresi gerekli' }, { status: 400 });
  }
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await createTableIfNotExists(connection);
    const [rows]: any = await connection.execute(
      'SELECT * FROM sipay_payment WHERE invoice_id = ?',
      [invoice_id]
    );
    await connection.end();
    if (!rows.length) {
      return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: 'Veritabanı hatası', detail: error?.message }, { status: 500 });
  }
} 