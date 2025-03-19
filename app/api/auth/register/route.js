import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Валідація даних
    if (!username || !email || !password) {
      return Response.json({ error: "Всі поля обов'язкові" }, { status: 400 });
    }

    // Перевірка, чи існує користувач з таким email
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return Response.json(
        { error: "Користувач з таким email вже існує" },
        { status: 400 }
      );
    }

    // Хешування пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Збереження користувача в БД
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    return Response.json({
      message: "Користувач успішно зареєстрований",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    return Response.json(
      { error: "Помилка при реєстрації користувача" },
      { status: 500 }
    );
  }
}
