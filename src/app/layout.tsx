// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Header from "./components/Header"; // Header is now used within ClientHeader which is passed props
import { getAllSubjectsWithUITweaks, type SubjectMeta } from "@/lib/dbSubjects";
import ClientHeader from "./components/ClientHeader";


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


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const allSubjects = await getAllSubjectsWithUITweaks();
  return (
    <html lang="ru">
      <body className="bg-gray-900 text-white"> {/* Applied base styles from old page.tsx, can be fine-tuned */}
        <ClientHeader subjects={allSubjects} />
        <main className="p-3 sm:p-6">{children}</main>
      </body>
    </html>
  );
}