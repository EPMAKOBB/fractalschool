// src/app/lk/layout.tsx (ОБНОВЛЕННАЯ ВЕРСИЯ)
"use client"; // 👈 1. Превращаем в клиентский компонент

import { ReactNode, useEffect } from "react"; // 👈 2. Импортируем useEffect
import LkTabs from "./components/LkTabs";

export default function LkLayout({ children }: { children: ReactNode }) {
  // 3. Добавляем логику сохранения профиля
  useEffect(() => {
    // Эта функция будет вызвана только один раз при заходе в личный кабинет
    async function savePendingProfile() {
      const pendingProfileJSON = localStorage.getItem("pending_profile");

      if (pendingProfileJSON) {
        try {
          // Отправляем данные. К этому моменту сессия уже точно установлена.
          await fetch("/api/lk/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: pendingProfileJSON,
          });
        } catch (error) {
          console.error("Не удалось сохранить отложенный профиль:", error);
        } finally {
          // Очищаем localStorage независимо от результата
          localStorage.removeItem("pending_profile");
        }
      }
    }

    savePendingProfile();
  }, []); // 👈 Пустой массив зависимостей гарантирует вызов только один раз

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-2">
        <LkTabs />
      </header>

      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}