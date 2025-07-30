// src/app/auth/callback/page.tsx (НОВАЯ ВЕРСИЯ)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Просто ждем события входа и перенаправляем. Никаких других действий.
        if (event === "SIGNED_IN" && session) {
          router.replace("/lk");
        }
      },
    );

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