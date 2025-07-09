// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    /* слушаем события авторизации */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.replace("/lk");       // 👈 переходим в новый кабинет
        }
        if (event === "SIGNED_OUT") {
          router.replace("/login");
        }
      },
    );

    /* проверяем localStorage */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/lk");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <p>Подтверждение… Пожалуйста, подождите.</p>
    </main>
  );
}
