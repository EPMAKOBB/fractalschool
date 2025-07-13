// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { AuthNav } from "./AuthNav";
import { subjectsMeta } from "../config/subjectsMeta";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Header() {
  const subjects = [...subjectsMeta].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between px-3 py-2 sm:px-6 sm:py-3">
        {/* Логотип (слева) */}
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl hover:underline whitespace-nowrap"
        >
          [Ф]рактал&nbsp;— подготовка к ЕГЭ и ОГЭ
        </Link>

        {/* Селектор предмета (по центру) */}
        <div className="flex-1 flex justify-center">
          <Select
            onValueChange={(slug) => {
              if (slug) window.location.href = `/${slug}`;
            }}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Выберите предмет" />
            </SelectTrigger>
           <SelectContent className="bg-background !bg-background !bg-opacity-100">
  <SelectGroup>
    {subjects.map((s) => (
      <SelectItem key={s.slug} value={s.slug}>
        {s.icon && <span className="mr-1">{s.icon}</span>}
        {s.label}
      </SelectItem>
    ))}
  </SelectGroup>
</SelectContent>
          </Select>
        </div>

        {/* Личный кабинет + переключатель темы (справа) */}
        <div className="flex items-center gap-2">
          <AuthNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
