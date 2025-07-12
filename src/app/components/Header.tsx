// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { subjectsMeta } from "../config/subjectsMeta";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const subjects = [...subjectsMeta].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2 p-3 sm:p-4">
        {/* Логотип */}
        <Link href="/" className="font-bold text-lg sm:text-xl whitespace-pre-line hover:underline">
          [Ф]рактал&nbsp;— подготовка{'\n'}к&nbsp;ЕГЭ&nbsp;и&nbsp;ОГЭ
        </Link>

        {/* Селектор предметов */}
        <select
          className="w-full sm:w-auto px-3 py-1 rounded-md border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

        {/* Навигация и ThemeToggle */}
        <nav className="flex gap-2 items-center w-full sm:w-auto justify-end">
          <ThemeToggle />
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
