// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header"; // Импортируем отдельный компонент

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
        {/* Глобальный заголовок вынесен в Header */}
        <Header />

        {/* Основной контент */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
