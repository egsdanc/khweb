 // app/api/get-blog/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

const pool = mysql.createPool(dbConfig);

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `SELECT id, title, content, cover_image, created_at FROM blogs ORDER BY created_at DESC`
      );
      connection.release(); // Bağlantıyı geri bırak

      return NextResponse.json({ 
        message: "Blogs retrieved successfully", 
        blogs: rows 
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate, max-age=0'
        }
      });

    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      message: "Server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { 
      status: 500
    });
  }
}
