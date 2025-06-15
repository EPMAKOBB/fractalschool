// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 1) Слушаем события изменения статуса авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session);
      if (event === "SIGNED_IN" && session) {
        // Как только пользователь залогинился — уходим на dashboard
        router.replace("/dashboard");
      }
      if (event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    // 2) На случай, если сессия уже есть в localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Session already exists:", session);
        router.replace("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <p>Подтверждение… Пожалуйста, подождите.</p>
    </main>
  );
}
