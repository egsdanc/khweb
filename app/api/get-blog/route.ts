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

export async function GET() {
  try {
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch all blogs with full details
      const [rows]: any = await connection.execute(
        `SELECT 
          id, 
          title, 
          content, 
          cover_image, 
          created_at 
        FROM blogs 
        ORDER BY created_at DESC`
      );

      // If no results found
      if (!rows.length) {
        return NextResponse.json({ 
          message: "No blogs found", 
          blogs: [] 
        }, { status: 404 });
      }

      // Return blogs
      return NextResponse.json({ 
        message: "Blogs retrieved successfully", 
        blogs: rows 
      }, { status: 200 });

    } finally {
      // Always close the connection
      await connection.end();
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      message: "Server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}