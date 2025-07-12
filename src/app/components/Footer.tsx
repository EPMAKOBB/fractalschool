// src/app/components/Footer.tsx

"use client";

import Link from "next/link";
import { ArrowUpIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/95 mt-12">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4 text-sm">
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline transition">
            О проекте
          </Link>
          <Link href="/contacts" className="hover:underline transition">
            Контакты
          </Link>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Наверх"
        >
          Наверх
          <ArrowUpIcon className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
