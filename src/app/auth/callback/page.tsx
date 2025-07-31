// src/app/auth/callback/page.tsx (НОВАЯ ВЕРСИЯ)


"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error_description"); // Supabase передает ошибку в этом параметре
    if (error) {
      router.replace(`/login?error=Ссылка для входа недействительна или истекла.`);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.replace("/lk");
        }
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <p>Подтверждение… Пожалуйста, подождите.</p>
    </main>
  );
}