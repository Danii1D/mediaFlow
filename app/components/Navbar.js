"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Перевіряємо, чи є користувач в localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Видаляємо дані користувача з localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link href="/">Мій сайт</Link>
      </div>
      <div className={styles.navbarLinks}>
        <Link href="/">Головна</Link>
        {/* Інші посилання на сторінки сайту */}
      </div>
      <div className={styles.navbarAuth}>
        {user ? (
          <>
            <span className={styles.welcomeMessage}>Вітаємо, {user.username}!</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginButton}>
              Увійти
            </Link>
            <Link href="/register" className={styles.registerButton}>
              Зареєструватися
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
