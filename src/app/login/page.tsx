// src/app/login/page.tsx

"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { isValidNickname } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация email (обязательное поле)
    if (!email.trim()) {
      setError("Введите email.");
      return;
    }

    // Валидация nickname (если не пустой)
    const trimmedNickname = nickname.trim();
    if (trimmedNickname && !isValidNickname(trimmedNickname)) {
      setError(
        "Никнейм может содержать только латинские буквы, цифры и нижнее подчёркивание, 3–32 символа."
      );
      return;
    }

    setLoading(true);

    // Сохраняем профиль в localStorage для /auth/callback (никнейм приводим к lower case)
    if (name || trimmedNickname) {
      localStorage.setItem(
        "pending_profile",
        JSON.stringify({
          name: name.trim(),
          nickname: trimmedNickname ? trimmedNickname.toLowerCase() : undefined,
        })
      );
    } else {
      localStorage.removeItem("pending_profile");
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      setMessage(null);
    } else {
      setMessage(
        "Ссылка для входа отправлена на почту. Проверьте почту и перейдите по ссылке."
      );
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Вход / регистрация</h1>
      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="email"
          />
          <div className="text-xs text-muted-foreground mt-1">* Обязательное поле</div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Ермаков Виктор"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            autoComplete="name"
            maxLength={64}
          />
          <div className="text-xs text-muted-foreground mt-1">
            Ваши Фамилия Имя в любом формате (необязательно, можно изменить потом)
          </div>
        </div>

        <div>
         <input
  type="text"
  placeholder="Super_Victor"
  value={nickname}
  onChange={(e) => setNickname(e.target.value)}
  className="w-full p-2 border rounded"
  autoComplete="username"
  maxLength={32}
  pattern="^[a-zA-Z0-9_]{3,32}$"
  title="Никнейм может содержать только латинские буквы, цифры и нижнее подчёркивание, 3–32 символа."
/>
          <div className="text-xs text-muted-foreground mt-1">
            Ваш уникальный nickname (необязательно, можно изменить потом)
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Отправка..." : "Получить ссылку для входа"}
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      {message && <p className="mt-4 text-center">{message}</p>}
    </main>
  );
}
