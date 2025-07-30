// src/app/auth/callback/page.tsx (ИСПРАВЛЕННАЯ ВЕРСИЯ)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // 1. Читаем профиль, который сохранили на странице логина
        const pendingProfileJSON = localStorage.getItem("pending_profile");

        // 2. Если данные есть, отправляем их в API для сохранения
        if (pendingProfileJSON) {
          try {
            // Используем ваш существующий API для обновления профиля
            await fetch("/api/lk/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: pendingProfileJSON,
            });
          } catch (error) {
            console.error("Failed to save pending profile:", error);
          } finally {
            // 3. Очищаем localStorage в любом случае, чтобы не отправить данные повторно
            localStorage.removeItem("pending_profile");
          }
        }

        // 4. Переходим в личный кабинет
        router.replace("/lk");
      }

      if (event === "SIGNED_OUT") {
        router.replace("/login");
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