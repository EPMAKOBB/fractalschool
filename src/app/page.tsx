// src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [showMsg, setShowMsg] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground px-4">
      {/* Блок приветствия и миссии проекта */}
      <section className="w-full max-w-2xl flex flex-col items-center text-center px-4 py-6 mb-6">
        <h2 className="text-3xl font-bold mb-4 text-primary">
          Пока ты учишься — он тоже учится!
        </h2>
        <p className="mb-3 text-lg">
          <span className="font-semibold text-primary/80">Фрактал</span> — это образовательный проект, который подстраивается под тебя. Это как если бы у каждого ученика был свой персональный учитель, который запоминает все твои успехи и выстраивает индивидуальную образовательную программу.
        </p>
        <p className="mb-3 text-lg">
          Никогда еще образование не было таким эффективным.
        </p>
        <p className="mb-4 text-base text-muted-foreground">
          Проект основан Виктором Ермаковым с целью использовать самые передовые технологии в области нейросетей для создания нового поколения образовательных сервисов.
        </p>
        {/* SVG-портрет */}
        <img
          src="/viktor-portrait.svg"
          alt="Портрет Виктора Ермакова"
          className="mx-auto my-6 w-32 h-32 object-cover rounded-full shadow"
        />
      </section>

      {/* Остальной функционал страницы */}
      <div className="mb-2 text-base">Вы можете задать вопрос нейросети:</div>
      <Input
        type="text"
        placeholder="Вы можете написать сюда свой вопрос"
        className="w-full max-w-lg mb-4"
      />
      <Button className="mb-8 w-40" onClick={() => setShowMsg(true)}>
        Задать свой вопрос
      </Button>

      {/* Сообщение после нажатия */}
      {showMsg && (
        <div className="mb-4 text-yellow-400">
          наш индус в отпуске, попробуйте потом
        </div>
      )}

      {/* Footer */}
      <footer className="flex space-x-4 text-sm mt-auto mb-4">
        <Link href="/about" className="hover:underline">
          О проекте
        </Link>
        <Link href="/contacts" className="hover:underline">
          Контакты
        </Link>
      </footer>
    </main>
  );
}
