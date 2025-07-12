// src/app/components/ThemeToggle.tsx

"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== "undefined")
      return document.documentElement.classList.contains("dark");
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    // При инициализации, если есть сохранённая тема — применить её
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  return (
    <button
      className="rounded px-3 py-1 border text-sm"
      onClick={() => setDark((v) => !v)}
    >
      {dark ? "🌙 Тёмная" : "☀️ Светлая"}
    </button>
  );
}
