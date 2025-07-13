// src/app/[subject]/task/[task]/page.tsx

import { supabase } from "../../../../lib/supabase";
import { subjectsMeta } from "../../../config/subjectsMeta";
import TaskCard from "../../../components/TaskCard";

type Props = {
  params: { subject: string; task: string }; // No longer a Promise
};

export default async function TaskPage(props: Props) {
  /* ---------- Маршрут ---------- */
  const { subject, task } = await props.params; // task — uuid-строка

  /* ---------- Предмет ---------- */
  const { data: subj, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subj)
    return (
      <div className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </div>
    );

  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  /* ---------- Задача ---------- */
  const { data: taskRow, error: taskErr } = await supabase
    .from("tasks_static")
    .select("*")
    .eq("subject_id", subj.id)
    .eq("id", task)            // id — primary key UUID
    .single();

  if (taskErr)
    return (
      <div className="p-8 text-red-400">
        Ошибка загрузки задачи: {taskErr.message}
      </div>
    );

  if (!taskRow)
    return <div className="p-8 text-gray-400">Задача не найдена</div>;

  /* ---------- UI ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {uiMeta?.label ?? subj.title}: задача №{taskRow.type_num ?? "?"}
      </h1>

      <TaskCard task={taskRow} subject={subject} mode="single" />
    </main>
  );
}
