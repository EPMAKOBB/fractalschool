// src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showMsg, setShowMsg] = useState(false);

  // Класс для кнопок
  const buttonClass =
    "px-4 py-2 border border-white rounded w-32 transition duration-200 hover:bg-white hover:text-gray-900";

  return (
    <main className="flex flex-col items-center mt-4 text-white bg-gray-900 min-h-screen">
      


      {/* ——— Блок приветствия и миссии проекта ——— */}
      <section className="w-full max-w-2xl flex flex-col items-center text-center px-4 py-6 mb-6">
        <h2 className="text-3xl font-bold mb-4 text-blue-300">
          Пока ты учишься — он тоже учится!
        </h2>
        <p className="mb-3 text-lg">
          <span className="font-semibold text-blue-200">Фрактал</span> — это образовательный проект, который подстраивается под тебя. Это как если бы у каждого ученика был свой персональный учитель, который запоминает все твои успехи и выстраивает индивидуальную образовательную программу.
        </p>
        <p className="mb-3 text-lg">
          Никогда еще образование не было таким эффективным.
        </p>
        <p className="mb-4 text-base text-gray-300">
          Проект основан Виктором Ермаковым с целью использовать самые передовые технологии в области нейросетей для создания нового поколения образовательных сервисов.
        </p>
        {/* ——— SVG-портрет ——— */}
        <img
          src="/viktor-portrait.svg"
          alt="Портрет Виктора Ермакова"
          className="mx-auto my-6 w-100 h-32 md:w-100 md:h-100  "
        />
      </section>

      {/* ——— Остальной функционал страницы ——— */}
      
      <div className="mb-2">вы можете задать вопрос нейросети:</div>
      <input
        type="text"
        placeholder="вы можете написать сюда свой вопрос"
        className="w-full max-w-lg p-2 mb-4 border rounded placeholder:text-gray-300 text-white bg-gray-900 focus:outline-none focus:border-blue-400"
      />
      <button
        className={buttonClass + " mb-8"}
        onClick={() => setShowMsg(true)}
      >
        задать свой вопрос
      </button>

      {/* Сообщение после нажатия */}
      {showMsg && (
        <div className="mb-4 text-yellow-400">
          наш индус в отпуске, попробуйте потом
        </div>
      )}

      {/* ——— Footer ——— */}
      <footer className="flex space-x-4 text-sm mt-auto mb-4">
        <Link href="/about" className="hover:underline">
          о проекте
        </Link>
        <Link href="/contacts" className="hover:underline">
          контакты
        </Link>
      </footer>
    </main>
  );
}
