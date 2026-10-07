import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const mariadb = await import("mariadb");
  const url = new URL(process.env.DATABASE_URL || "mysql://x:x@localhost/x");

  try {
    const conn = await mariadb.createConnection({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      connectTimeout: 8000,
      ssl: { rejectUnauthorized: false },
    });
    const rows = await conn.query("SELECT 1 AS ok");
    await conn.end();
    return NextResponse.json({ ok: true, host: url.hostname, rows });
  } catch (e) {
    return NextResponse.json(
      { ok: false, host: url.hostname, code: e.code, message: e.message },
      { status: 500 }
    );
  }
}