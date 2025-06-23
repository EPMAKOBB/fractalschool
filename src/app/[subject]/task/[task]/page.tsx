// src/app/[subject]/task/[task]/page.tsx

import { supabase } from "../../../../lib/supabase";
import { tablesMeta } from "../../../config/tablesMeta";
import TaskCard from "../../../components/TaskCard";

type Props = {
  params: Promise<{ subject: string; task: string }>;
};

export default async function TaskPage(props: Props) {
  const params = await props.params;
  const { subject, task } = params;

  // Найти метаданные предмета
  const meta = tablesMeta.find(t => t.name === subject);
  if (!meta) return <div className="p-8 text-red-400">Неизвестный предмет: {subject}</div>;

  // Получить задачу по task_id (task_id строка или число)
  const { data, error } = await supabase
    .from(meta.dbName)
    .select("*")
    .eq("task_id", task)
    .single(); // Ожидаем одну запись

  if (error) return <div className="p-8 text-red-400">Ошибка загрузки задачи: {error.message}</div>;
  if (!data) return <div className="p-8 text-gray-400">Задача не найдена</div>;

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {meta.label}: задача №{data.task_id}
      </h1>
      <TaskCard task={data} subject={subject} mode="single" />
    </main>
  );
}
