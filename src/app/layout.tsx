// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import { AuthNav } from "./components/AuthNav"; // <-- добавили импорт

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fractal School",
  description: "Подготовка к ОГЭ и ЕГЭ по информатике, математике, физике",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {/* Шапка с навигацией */}
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            <Link href="/">[Ф]рактал - подготовка к ЕГЭ и ОГЭ</Link>
          </h1>
          <nav className="space-x-4">
            <AuthNav /> {/* вот тут теперь динамика */}
          </nav>
        </header>

        {/* Основной контент */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
