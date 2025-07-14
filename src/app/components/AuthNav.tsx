// src/app/components/AuthNav.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import useUserProfile from "@/app/lk/components/useUserProfile";

export function AuthNav() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Подписка на изменения сессии
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setIsAuth(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (mounted) setIsAuth(!!session);
      }
    );
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Получаем профиль только если авторизованы
  const { profile, isLoading } = useUserProfile();

  if (isAuth === null) return <span className="text-gray-500">…</span>;

  if (!isAuth) {
    return (
      <Link href="/login" className="hover:underline">
        Вход / Регистрация
      </Link>
    );
  }

  // Показываем имя, если оно заполнено
  const label =
    (profile?.name && profile.name.trim().length > 0)
      ? profile.name
      : "Личный кабинет";

  return (
    <Link href="/lk" className="hover:underline">
      {isLoading ? "…" : label}
    </Link>
  );
}

export default AuthNav;
