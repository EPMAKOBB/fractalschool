// src/app/[subject]/type/[type]/page.tsx

import { supabase } from "../../../../lib/supabase";
import { tablesMeta } from "../../../config/tablesMeta";
import TaskCard from "../../../components/TaskCard";

type Props = {
  params: Promise<{ subject: string; type: string }>;
};

export default async function TypeTasksPage(props: Props) {
  const params = await props.params;
  const { subject, type } = params;

  // Находим метаданные предмета по "name"
  const meta = tablesMeta.find(t => t.name === subject);
  if (!meta) return <div className="p-8 text-red-400">Неизвестный предмет: {subject}</div>;

  // Получаем задачи из таблицы предмета, фильтруем по типу
  const { data: tasks, error } = await supabase
    .from(meta.dbName)
    .select("*")
    .eq("task_type", Number(type));

  if (error) return <div className="p-8 text-red-400">Ошибка загрузки задач: {error.message}</div>;
  if (!tasks || tasks.length === 0) return <div className="p-8 text-gray-400">Нет задач этого типа</div>;

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {meta.label}: задания типа {type}
      </h1>
      <div className="flex flex-col gap-6">
        {tasks.map((task: any) => (
          <TaskCard key={task.id} task={task} mode="single" />
        ))}
      </div>
    </main>
  );
}
