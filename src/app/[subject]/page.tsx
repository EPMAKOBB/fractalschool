// src/app/[subject]/page.tsx

import { tablesMeta } from "../config/tablesMeta";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { Suspense } from "react";

/**
 * Динамическая страница предмета `/[subject]`
 * Показывает доступные варианты и список типов задач.
 * Next.js 15: `params` приходит как Promise, поэтому **нужно await**.
 */

type Props = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage(props: Props) {
  /* ---------- Распаковываем параметры ---------- */
  const { subject } = await props.params;

  /* ---------- Метаданные предмета ---------- */
  const meta = tablesMeta.find(t => t.name === subject);
  if (!meta) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </main>
    );
  }

  /* ---------- Список доступных вариантов ---------- */
  const variantTable = tablesMeta.find(
    t => t.category === "variants" && t.sourceForVariants === subject,
  );

  let variants: any[] = [];
  if (variantTable) {
    const { data, error } = await supabase.from(variantTable.dbName).select("*");
    if (!error && data) variants = data;
  }

  /* ---------- Кол‑во типов задач ---------- */
  const taskTypesCount = meta.taskTypesCount ?? 0;

  /* ------------------------------------------------------------------ */
  /* ------------------------------ UI --------------------------------- */
  /* ------------------------------------------------------------------ */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{meta.label}</h1>

      {/* Варианты */}
      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Варианты</h2>
        {variants.length === 0 ? (
          <div className="text-gray-400">Нет доступных вариантов</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variants
              .filter(v => v.slug)
              .map((variant, idx) => (
                <Link
                  key={variant.id}
                  href={`/${subject}/variant/${variant.slug}`}
                  className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
                >
                  {variant.title || `Вариант ${idx + 1}`}
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* Типы задач */}
      <section>
        <h2 className="mb-2 font-semibold">Задания по типам</h2>
        {taskTypesCount === 0 ? (
          <div className="text-gray-400">Типы заданий отсутствуют</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: taskTypesCount }, (_, i) => (
              <Link
                key={i}
                href={`/${subject}/type/${i + 1}`}
                className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
              >
                Тип {i + 1}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
