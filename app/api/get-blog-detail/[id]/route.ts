import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const blogId = params.id;

      if (!blogId) {
        return NextResponse.json({ 
          message: "Blog ID is required" 
        }, { status: 400 });
      }

      const [rows]: any = await connection.execute(
        `SELECT 
          id, 
          title, 
          content, 
          cover_image, 
          created_at 
        FROM blogs 
        WHERE id = ?`,
        [blogId]
      );

      if (!rows.length) {
        return NextResponse.json({ 
          message: "Blog not found" 
        }, { status: 404 });
      }

      return NextResponse.json({ 
        message: "Blog retrieved successfully", 
        blog: rows[0] 
      }, { status: 200 });

    } finally {
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