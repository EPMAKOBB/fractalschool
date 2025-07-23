// src/app/[subject]/task/[task]/page.tsx

import { createClient } from "@/utils/supabase/server";
import TaskCard from "@/app/components/TaskCard";

type PageProps = {
  params: { subject: string; task: string };
};

export default async function Page({ params }: PageProps) {
  const supabase = await createClient();
  const { subject, task } = params;

  // 1. Найти id предмета
  const { data: subjRow, error: subjErr } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", subject)
    .single();

  if (subjErr || !subjRow) {
    return <div className="p-8 text-red-400">Неизвестный предмет</div>;
  }

  // 2. Найти задачу по subject_id и task_num_text (slug-номер)
  const { data: taskRow, error: taskErr } = await supabase
    .from("tasks_static")
    .select("*")
    .eq("subject_id", subjRow.id)
    .eq("task_num_text", task)
    .single();

  if (taskErr || !taskRow) {
    return <div className="p-8 text-red-400">Задача не найдена</div>;
  }

  // 3. Отрисовать TaskCard
  return (
    <main className="max-w-2xl mx-auto py-8">
      <TaskCard task={taskRow} subject={subject} />
    </main>
  );
}
