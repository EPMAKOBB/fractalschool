// src/app/components/AuthNav.tsx

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Проверяем наличие сессии при монтировании
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <span className="text-gray-500">...</span>;
  }

  return isAuthenticated ? (
    <Link href="/dashboard" className="hover:underline">
      Личный кабинет
    </Link>
  ) : (
    <Link href="/login" className="hover:underline">
      Вход / Регистрация
    </Link>
  );
}
