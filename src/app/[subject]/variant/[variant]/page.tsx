// src/app/[subject]/variant/[variant]/page.tsx

import { supabase } from "../../../../lib/supabase";
import { subjectsMeta } from "../../../config/subjectsMeta";
import { Suspense } from "react";


type Props = {
  params: { subject: string; variant: string }; // No longer a Promise
};

export default async function VariantPage(props: Props) {
  /* ---------- параметры маршрута ---------- */
  const { subject, variant } = await props.params;

  /* ---------- предмет ---------- */
  const { data: subj, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subj) {
    return (
      <div className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </div>
    );
  }

  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  /* ---------- вариант ---------- */
  const { data: variantRow, error: varErr } = await supabase
    .from("variants")
    .select("*")
    .eq("subject_id", subj.id)
    .eq("slug", variant)
    .single();

  if (varErr) {
    return (
      <div className="p-8 text-red-400">
        Ошибка загрузки варианта: {varErr.message}
      </div>
    );
  }

  if (!variantRow) {
    return <div className="p-8 text-gray-400">Вариант не найден</div>;
  }

  /* ---------- задачи через variant_task_map ---------- */
  const { data: taskMapRows, error: mapErr } = await supabase
    .from("variant_task_map")
    .select(
      `
        position,
        tasks_static:task_id ( * )
      `
    )
    .eq("variant_id", variantRow.id)
    .order("position");               // сохраняем порядок, заданный в бланке

  if (mapErr) {
    return (
      <div className="p-8 text-red-400">
        Ошибка загрузки задач варианта: {mapErr.message}
      </div>
    );
  }

  if (!taskMapRows || taskMapRows.length === 0) {
    return (
      <div className="p-8 text-gray-400">
        Нет задач в этом варианте
      </div>
    );
  }

  const orderedTasks = taskMapRows
    .map(r => (r as any).tasks_static)   // вытаскиваем вложенный объект
    .filter(Boolean);

  /* ---------- UI ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {uiMeta?.label ?? subj.title}: вариант&nbsp;
        {variantRow.title ?? variantRow.slug}
      </h1>

      <Suspense fallback={<div>Загрузка задач…</div>}>

      </Suspense>
    </main>
  );
}
