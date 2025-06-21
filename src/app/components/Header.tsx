// src/app/components/Header.tsx

"use client";

import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { tablesMeta } from "../config/tablesMeta";

export default function Header() {
  const subjects = tablesMeta.filter(t => t.category === "tasks");

  return (
    <header className="border-b border-gray-700 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Логотип и заголовок */}
        <h1 className="text-lg sm:text-xl font-bold whitespace-pre-line">
          <Link href="/">[Ф]рактал - подготовка{'\n'}к ЕГЭ и ОГЭ</Link>
        </h1>
        
        {/* Селектор предметов */}
        <select
          className="w-full sm:w-auto px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
          defaultValue=""
          onChange={e => {
            if (e.target.value) window.location.href = `/${e.target.value}`;
          }}
        >
          <option value="" disabled>Выберите предмет</option>
          {subjects.map(subject => (
            <option key={subject.name} value={subject.name}>
              {subject.label}
            </option>
          ))}
        </select>

        {/* Навигация (Личный кабинет/Вход) */}
        <nav className="flex justify-end w-full sm:w-auto">
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
