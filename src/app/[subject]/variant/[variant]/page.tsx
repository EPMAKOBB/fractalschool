// src/app/[subject]/variant/[variant]/page.tsx

import { supabase } from "../../../../lib/supabase";
import { tablesMeta } from "../../../config/tablesMeta";
import { Suspense } from "react";
import VariantRunner from "../../../components/VariantRunner";

type Props = {
  params: Promise<{ subject: string; variant: string }>;
};

export default async function VariantPage(props: Props) {
  const params = await props.params;
  const { subject, variant } = params;

  // 1. Найти метаданные предмета
  const meta = tablesMeta.find(t => t.name === subject);
  if (!meta) return <div className="p-8 text-red-400">Неизвестный предмет: {subject}</div>;

  // 2. Найти таблицу вариантов для этого предмета
  const variantTable = tablesMeta.find(
    t => t.category === "variants" && t.sourceForVariants === subject
  );
  if (!variantTable) return <div className="p-8 text-red-400">Варианты для предмета не найдены</div>;

  // 3. Получить вариант по его slug
  const { data: variantData, error: variantError } = await supabase
    .from(variantTable.dbName)
    .select("*")
    .eq("slug", variant)
    .single();

  if (variantError) return <div className="p-8 text-red-400">Ошибка загрузки варианта: {variantError.message}</div>;
  if (!variantData) return <div className="p-8 text-gray-400">Вариант не найден</div>;

  // 4. Получить массив id задач этого варианта
  const taskIds: number[] = Array.isArray(variantData.task_ids)
    ? variantData.task_ids.map(Number)
    : [];

  if (taskIds.length === 0) return <div className="p-8 text-gray-400">Вариант пуст (нет задач)</div>;

  // 5. Получить задачи из таблицы предмета (по массиву id)
  const { data: tasks, error: tasksError } = await supabase
    .from(meta.dbName)
    .select("*")
    .in("id", taskIds); // Ищем по id

  if (tasksError) return <div className="p-8 text-red-400">Ошибка загрузки задач варианта: {tasksError.message}</div>;
  if (!tasks || tasks.length === 0) return <div className="p-8 text-gray-400">Нет задач в этом варианте</div>;

  // 6. Привести задачи к тому же порядку, что и в taskIds
  const orderedTasks = taskIds
    .map(id => tasks.find((t: any) => Number(t.id) === id))
    .filter(Boolean);

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {meta.label}: вариант {variantData.title || variantData.id}
      </h1>
      <Suspense fallback={<div>Загрузка задач...</div>}>
        <VariantRunner tasks={orderedTasks} />
      </Suspense>
    </main>
  );
}
