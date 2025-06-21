// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import ClientHeader from "./components/ClientHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="...">
        <ClientHeader />
        <main className="p-3 sm:p-6">{children}</main>
      </body>
    </html>
  );
}