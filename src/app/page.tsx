// src/app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center n bg-background text-foreground px-4">
      {/* Приветствие и портрет */}
      <section className="w-full max-w-md flex flex-col items-center text-center px-4 py-12 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Представляю вам проект&nbsp;
          <span className="text-primary">Фрактал</span>
        </h1>
        <p className="mb-6 text-base sm:text-lg">
          Это уникальная система, которая генерирует индивидуальные задания для подготовки с помощью нейросетевых алгоритмов.
        </p>
        <img
          src="/viktor-portrait.svg"
          alt="Портрет Виктора Ермакова"
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto mb-4 shadow"
        />
        <div className="font-semibold text-lg mb-1">Виктор Ермаков</div>
        <div className="text-sm text-muted-foreground">
          преподаватель информатики и математики,<br />
          исследователь нейронных сетей
        </div>
      </section>

      {/*
      // --- Блок с вопросом к нейросети (пока закомментирован) ---
      <div className="mb-2 text-base">Вы можете задать вопрос нейросети:</div>
      <Input
        type="text"
        placeholder="Вы можете написать сюда свой вопрос"
        className="w-full max-w-lg mb-4"
      />
      <Button className="mb-8 w-40" onClick={() => setShowMsg(true)}>
        Задать свой вопрос
      </Button>
      {showMsg && (
        <div className="mb-4 text-yellow-400">
          наш индус в отпуске, попробуйте потом
        </div>
      )}
      */}

    </main>
  );
}
