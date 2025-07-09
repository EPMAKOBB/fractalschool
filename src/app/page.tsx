// src/app/page.tsx
"use client";

import Link from "next/link";
// import { useState } from "react"; // No longer needed for showMsg

export default function Home() {
  // const [showMsg, setShowMsg] = useState(false); // Removed placeholder state

  // Класс для кнопок (если будет использоваться для других кнопок)
  // const buttonClass =
  //   "px-4 py-2 border border-white rounded w-auto transition duration-200 hover:bg-white hover:text-gray-900";

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
          className="mx-auto my-6 w-auto h-32 md:h-40" // Adjusted size for better responsiveness
        />
      </section>

      {/* Placeholder for future content or call to action can go here */}
      {/*
      <section className="w-full max-w-xl text-center py-8">
        <h3 className="text-2xl font-semibold mb-4 text-teal-300">Готовы начать?</h3>
        <p className="mb-6 text-lg">
          Выберите предмет в шапке сайта или перейдите в ваш личный кабинет.
        </p>
        <Link href="/lk" className={buttonClass}>
          В личный кабинет
        </Link>
      </section>
      */}

      {/* ——— Footer ——— */}
      <footer className="flex space-x-4 text-sm mt-auto mb-4 pt-8"> {/* Added padding top for spacing */}
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
