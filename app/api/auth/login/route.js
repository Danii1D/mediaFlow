import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Валідація даних
    if (!email || !password) {
      return Response.json(
        { error: "Email та пароль обов'язкові" },
        { status: 400 }
      );
    }

    // Пошук користувача за email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Користувача з таким email не знайдено" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Перевірка пароля
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ error: "Невірний пароль" }, { status: 401 });
    }

    // Створення JWT токена
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return Response.json({
      message: "Авторизація успішна",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Помилка авторизації:", error);
    return Response.json(
      { error: "Помилка при авторизації" },
      { status: 500 }
    );
  }
}
