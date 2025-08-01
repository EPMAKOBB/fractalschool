// src/app/[subject]/page.tsx

import { subjectsMeta } from "@/app/config/subjectsMeta";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Динамическая страница предмета `/[subject]`
 * – показывает доступные варианты и список типов задач,
 *   беря данные из единых таблиц `subjects`, `variants`, `tasks_static`.
 */

type Props = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage(props: Props) {
  const supabase = await createClient();
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
              <Button
                asChild
                key={v.id}
                variant="outline"
                size="sm"

              >
                <Link href={`/${subject}/variant/${v.slug}`}>
                  {v.title || `Вариант ${i + 1}`}
                </Link>
              </Button>
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
              <Button asChild key={n} variant="outline" size="sm">
                <Link href={`/${subject}/type/${n}`}>Тип {n}</Link>
              </Button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
