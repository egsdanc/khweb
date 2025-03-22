import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// MySQL bağlantı bilgileri
const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

export async function POST(req: Request) {
  try {
    const { cihaz_id } = await req.json(); // Gelen body'den cihaz_id al

    if (!cihaz_id) {
      return NextResponse.json({ error: "cihaz_id gerekli!" }, { status: 400 });
    }

    // Veritabanına bağlan
    const connection = await mysql.createConnection(dbConfig);

    // Cihaz fiyatını sorgula
    const [rows]: any = await connection.execute(
      "SELECT cihaz_fiyat FROM cihazlar WHERE id = ?",
      [cihaz_id]
    );

    await connection.end(); // Bağlantıyı kapat

    // Eğer sonuç yoksa hata dön
    if (rows.length === 0) {
      return NextResponse.json({ error: "Cihaz bulunamadı!" }, { status: 404 });
    }

    // Cihaz fiyatını döndür
    return NextResponse.json({ fiyat: rows[0].cihaz_fiyat }, { status: 200 });

  } catch (error) {
    console.error("Veritabanı hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
