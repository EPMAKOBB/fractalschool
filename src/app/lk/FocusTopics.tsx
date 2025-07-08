// src/app/lk/FocusTopics.tsx
"use client";
import { FocusTopic } from "@/types/dashboard";

export default function FocusTopics({ topics }: { topics: FocusTopic[] }) {
  if (!topics.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Темы, требующие внимания</h2>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border p-3 hover:shadow transition"
          >
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-gray-600">Баллы: {t.score}/100</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
