// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/app/components/Header"; 
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans",
        inter.className
      )}>
        <Header />           {/* ← Вставка шапки */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
