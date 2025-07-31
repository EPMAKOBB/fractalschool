// src/app/auth/callback/page.tsx (ИСПРАВЛЕННАЯ ВЕРСИЯ)

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

// 1. Логика вынесена в отдельный компонент
function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error_description");
    if (error) {
      router.replace(`/login?error=Ссылка для входа недействительна или истекла.`);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/lk");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, searchParams]);

  return <p>Подтверждение… Пожалуйста, подождите.</p>;
}

// 2. Основная страница теперь оборачивает клиентский компонент в <Suspense>
export default function AuthCallbackPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <Suspense fallback={<p>Загрузка...</p>}>
        <AuthCallbackClient />
      </Suspense>
    </main>
  );
}