// src/app/lk/layout.tsx
import { ReactNode } from "react";
import LkTabs from "./components/LkTabs";

export const metadata = {
  title: "Личный кабинет",
};

export default function LkLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-2">
        <LkTabs />
      </header>

      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
