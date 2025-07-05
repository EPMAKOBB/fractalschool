// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { subjectsMeta } from "../config/subjectsMeta";

/**
 * Шапка сайта.
 * Показывает селектор предметов на основе `subjectsMeta`
 * (чисто UI-метаданные: slug, label, icon, порядок).
 */

export default function Header() {
  /* сортируем, если задано поле order */
  const subjects = [...subjectsMeta].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );

  return (
    <header className="border-b border-gray-700 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Логотип */}
        <h1 className="text-lg sm:text-xl font-bold whitespace-pre-line">
          <Link href="/">[Ф]рактал&nbsp;— подготовка{'\n'}к&nbsp;ЕГЭ&nbsp;и&nbsp;ОГЭ</Link>
        </h1>

        {/* Селектор предметов */}
        <select
          className="w-full sm:w-auto px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
          defaultValue=""
          onChange={e => {
            if (e.target.value) window.location.href = `/${e.target.value}`;
          }}
        >
          <option value="" disabled>
            Выберите предмет
          </option>
          {subjects.map(s => (
            <option key={s.slug} value={s.slug}>
              {s.icon ? `${s.icon} ` : ""}
              {s.label}
            </option>
          ))}
        </select>

        {/* Навигация: ЛК / Вход */}
        <nav className="flex justify-end w-full sm:w-auto">
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
