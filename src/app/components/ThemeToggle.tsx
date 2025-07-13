// src/app/components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
    else setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      className="
        inline-flex items-center justify-center
        rounded-md border border-border bg-background
        p-2 text-xl transition
        hover:bg-muted hover:border-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        cursor-pointer
      "
      aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={dark ? "Сменить на светлую тему" : "Сменить на тёмную тему"}
      style={{ minWidth: "2.5rem" }}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
