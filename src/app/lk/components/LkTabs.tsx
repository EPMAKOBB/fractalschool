// src/app/lk/components/LkTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { href: "/lk/subjects", label: "Предметы" },
  { href: "/lk/courses", label: "Курсы" },
  { href: "/lk/profile", label: "Профиль" },
];

export default function LkTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-sm">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={clsx(
              "pb-2 transition-colors",
              active
                ? "border-b-2 border-primary font-medium text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}