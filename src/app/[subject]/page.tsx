// src/app/[subject]/page.tsx

import { tablesMeta } from "../config/tablesMeta";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  params: { subject: string };
};

export default async function SubjectPage({ params }: Props) {
  const { subject } = await params;

  // Находим meta по красивому URL (например, inf-ege)
  const meta = tablesMeta.find(t => t.name === subject);
  if (!meta) return <div>Неизвестный предмет: {subject}</div>;

  // Находим таблицу вариантов по ссылке на subject
  const variantTable = tablesMeta.find(
    t => t.category === "variants" && t.sourceForVariants === subject
  );

  let variants: any[] | null = null;
  if (variantTable) {
    // ВАЖНО: для запроса к БД используем dbName!
    const { data } = await supabase.from(variantTable.dbName).select("*");
    variants = data || [];
  }

  const taskTypesCount = meta.taskTypesCount || 0;

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{meta.label}</h1>

      {/* --- Варианты --- */}
     <div className="mb-2 font-semibold">Варианты:</div>
{variants === null ? (
  <div className="mb-8 text-gray-400">загрузка вариантов...</div>
) : variants.length === 0 ? (
  <div className="mb-8 text-gray-400">Нет доступных вариантов</div>
) : (
  <div className="flex flex-wrap gap-2 mb-8">
    {variants
      .filter(variant => variant.slug) // Только те, у кого есть slug
      .map((variant, idx) => (
        <Link
          href={`/${subject}/variant/${variant.slug}`}
          key={variant.id}
          className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
        >
          {variant.title || `Вариант ${idx + 1}`}
        </Link>
      ))}
  </div>
)}

      {/* --- Список типов задач --- */}
      <div className="mb-2 font-semibold">Задания по типам:</div>
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: taskTypesCount }, (_, i) => (
          <Link
            href={`/${subject}/type/${i + 1}`}
            key={i}
            className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
          >
            Тип {i + 1}
          </Link>
        ))}
      </div>
    </main>
  );
}
