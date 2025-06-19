"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signInWithVk = async () => {
    await supabase.auth.signInWithOAuth({ provider: "vk" });
  };

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Используем переменную окружения для редиректа:
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      console.log("Ошибка авторизации:", error); // Для отладки
    } else {
      setMessage(
        "Ссылка для входа отправлена на почту. Проверьте почту и перейдите по ссылке."
      );
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Вход / Регистрация</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Отправка..." : "Получить ссылку для входа"}
        </button>
      </form>
      <div className="mt-6 space-y-2">
        <button
          onClick={signInWithGoogle}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
        >
          Войти через Google
        </button>
        <button
          onClick={signInWithVk}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Войти через VK
        </button>
        <button
          onClick={signInWithGithub}
          className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition"
        >
          Войти через GitHub
        </button>
      </div>
      {message && <p className="mt-4 text-center">{message}</p>}
    </main>
  );
}
