import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: "Помилка отримання користувачів" }, { status: 500 });
  }
}
