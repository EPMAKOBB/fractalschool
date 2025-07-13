// src/app/[subject]/page.tsx

import { subjectsMeta } from "../config/subjectsMeta";
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

export default async function SubjectPage(props: Props) {
  /* ---------- slug из маршрута ---------- */
  const { subject } = await props.params;

  /* ---------- предмет из БД ---------- */
  const { data: subjRow, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subjRow) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </main>
    );
  }

  /* ---------- UI-метаданные (иконка/цвет/порядок) ---------- */
  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  /* ---------- Варианты ---------- */
const { data: rawVariants, error: varErr } = await supabase
  .from("variants")
  .select("id,title,slug")
  .eq("subject_id", subjRow.id)
  .order("year", { ascending: false });

if (varErr) console.error(varErr);

const variants = rawVariants ?? []; 

  /* ---------- Список уникальных типов задач ---------- */
 const { data: typesRaw, error: typesErr } = await supabase
  .from("tasks_static")
  .select("type_num")
  .eq("subject_id", subjRow.id);

if (typesErr) console.error(typesErr);

const typeNums = Array.from(
  new Set((typesRaw ?? []).map(t => t.type_num).filter(Boolean)),
).sort((a, b) => a! - b!);// 1, 2, 3 …

  /* ---------- Рендер ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {uiMeta?.label ?? subjRow.title}
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
                href={`/${subject}/variant/${v.slug}`}
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
