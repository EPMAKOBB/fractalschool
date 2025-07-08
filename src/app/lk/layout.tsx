// src/app/lk/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

export default function LKLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-4 space-y-3">
        <nav className="flex flex-col gap-2">
          <Link href="/lk" className="hover:underline">
            Предметы
          </Link>
          <Link href="/lk/courses" className="hover:underline">
            Курсы
          </Link>
          <Link href="/lk/profile" className="hover:underline">
            Профиль
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
