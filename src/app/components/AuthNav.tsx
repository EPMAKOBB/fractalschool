// src/app/components/AuthNav.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function AuthNav() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setIsAuth(!!session),
    );
    return () => subscription.unsubscribe();
  }, []);

  if (isAuth === null) return <span className="text-gray-500">…</span>;

  return isAuth ? (
    <Link href="/lk" className="hover:underline">
      Личный кабинет
    </Link>
  ) : (
    <Link href="/login" className="hover:underline">
      Вход / Регистрация
    </Link>
  );
}
