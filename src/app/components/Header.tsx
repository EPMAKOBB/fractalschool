// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import { AuthNav } from "./AuthNav";
// import { subjectsMeta } from "../config/subjectsMeta"; // Removed static import
import type { SubjectMeta } from "@/lib/dbSubjects"; // Import the type
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";


interface HeaderProps {
  subjects: SubjectMeta[]; // Accept subjects as a prop
}

/**
 * Шапка сайта.
 * Показывает селектор предметов на основе данных из БД.
 */
export default function Header({ subjects: initialSubjects }: HeaderProps) {
  const [subjects, setSubjects] = useState<SubjectMeta[]>(initialSubjects);
  const params = useParams();
  const pathname = usePathname();

  // Determine the current subject slug from URL params or pathname
  const currentSubjectSlug = params?.subject
    ? String(params.subject)
    : pathname?.split('/')[1] || "";


  useEffect(() => {
    // The subjects are already sorted by order in getAllSubjectsWithUITweaks
    // If client-side sorting or filtering were needed in the future, it could be done here.
    setSubjects(initialSubjects);
  }, [initialSubjects]);

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
          value={currentSubjectSlug} // Controlled component based on current route
          onChange={e => {
            if (e.target.value) window.location.href = `/${e.target.value}`;
          }}
        >
          <option value="" disabled={!!currentSubjectSlug}> {/* Disable default if a subject is selected */}
            Выберите предмет
          </option>
          {subjects.map(s => (
            <option key={s.slug} value={s.slug} className={s.color}>
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
