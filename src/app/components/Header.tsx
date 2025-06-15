// src/app/components/Header.tsx

"use client"; // 👈 Должно быть первой строкой!

import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { tablesMeta } from "../config/tablesMeta";

export default function Header() {
  const subjects = tablesMeta.filter(t => t.category === "tasks");

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-700">
      <h1 className="text-xl font-bold">
        <Link href="/">[Ф]рактал - подготовка к ЕГЭ и ОГЭ</Link>
      </h1>
      <div className="flex-1 flex justify-center">
        <select
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
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
      </div>
      <nav className="space-x-4">
        <AuthNav />
      </nav>
    </header>
  );
}
