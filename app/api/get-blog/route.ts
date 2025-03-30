export const dynamic = "force-dynamic"; // API cache'i devre dışı bırak
export const revalidate = 0; // ISR'yi kapat

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// MySQL connection bilgileri
const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

export async function GET() {
  try {
    // MySQL bağlantısını oluştur
    const connection = await mysql.createConnection(dbConfig);

    // Blog verilerini getir
    const [rows]: any = await connection.execute(
      `SELECT id, title, content, cover_image, created_at FROM blogs ORDER BY created_at DESC`
    );

    await connection.end(); // Bağlantıyı kapat

    return NextResponse.json({ 
      message: "Blogs retrieved successfully", 
      blogs: rows 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate, max-age=0' // API'nin her seferinde yeni veri getirmesini sağla
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      message: "Server error", 
      error: "error.message "
    }, { status: 500 });
  }
}
