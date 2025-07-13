// src/app/components/AuthNav.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export function AuthNav() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

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
