// src/app/[subject]/page.tsx

// import { subjectsMeta } from "../config/subjectsMeta"; // Removed
import { getSubject, type SubjectMeta } from "@/lib/dbSubjects"; // Using new data fetching
import { supabase } from "../../lib/supabase";
import Link from "next/link";

/**
 * Динамическая страница предмета `/[subject]`
 * – показывает доступные варианты и список типов задач,
 *   беря данные из единых таблиц `subjects`, `variants`, `tasks_static`.
 */

type Props = {
  params: { subject: string }; // No longer a Promise, Next.js handles this for async components
};

export default async function SubjectPage({ params }: Props) { // Added params type directly
  /* ---------- slug из маршрута ---------- */
  const { subject } = params; // No await needed for params

  /* ---------- предмет из БД (теперь включает UI метаданные) ---------- */
  const subjectInfo = await getSubject(subject); // Using the new function

  if (!subjectInfo) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </main>
    );
  }

  /* ---------- UI-метаданные (иконка/цвет/порядок) - теперь часть subjectInfo ---------- */
  // const uiMeta = subjectsMeta.find(s => s.slug === subject); // Removed

  /* ---------- Варианты ---------- */
  const { data: rawVariants, error: varErr } = await supabase
    .from("variants")
    .select("id,title,slug") // Assuming 'slug' exists on variants for linking, or use 'id'
    .eq("subject_id", subjectInfo.id) // Use id from subjectInfo
    .order("created_at", { ascending: false }); // Example ordering, adjust if needed

  if (varErr) {
    console.error("Error fetching variants:", varErr);
    // Optionally return an error message or handle gracefully
  }

  const variants = rawVariants ?? [];

  /* ---------- Список уникальных типов задач ---------- */
 const { data: typesRaw, error: typesErr } = await supabase
  .from("tasks_static") // Assuming tasks_static is the correct table for task types for a subject
  .select("type_num")
  .eq("subject_id", subjectInfo.id); // Use id from subjectInfo

if (typesErr) {
    console.error("Error fetching task types:", typesErr);
    // Optionally return an error message or handle gracefully
}

const typeNums = Array.from(
  new Set((typesRaw ?? []).map(t => t.type_num).filter(Boolean)),
).sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure nulls are handled for sorting

  /* ---------- Рендер ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className={`text-3xl font-bold mb-6 ${subjectInfo.color}`}>
        {subjectInfo.icon} {subjectInfo.label}
      </h1>

      {/* Варианты экзамена */}
      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Варианты</h2>
        {variants.length === 0 ? (
          <div className="text-gray-400">Нет доступных вариантов</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <Link
                key={v.id}
                href={`/${subject}/variant/${v.slug || v.id}`} // Use slug if available, else id
                className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
              >
                {v.title || `Вариант ${i + 1}`}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Типы заданий */}
      <section>
        <h2 className="mb-2 font-semibold">Задания по типам</h2>
        {typeNums.length === 0 ? (
          <div className="text-gray-400">Типы заданий отсутствуют</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {typeNums.map(n => (
              <Link
                key={n}
                href={`/${subject}/type/${n}`}
                className="px-3 py-1 border rounded bg-gray-800 hover:bg-gray-700"
              >
                Тип {n}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
