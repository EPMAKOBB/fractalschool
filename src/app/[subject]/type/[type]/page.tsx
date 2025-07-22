// src/app/[subject]/type/[type]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { subjectsMeta } from "@/app/config/subjectsMeta";
import TaskCard from "@/app/components/TaskCard";

type Props = {
  params: Promise<{ subject: string; type: string }>; // <-- исправлено!
};

export default async function TypeTasksPage({ params }: Props) {
  const supabase = await createClient();

  // Ждём params (важно!)
  const { subject, type } = await params;
  const typeNum = Number(type);

  if (Number.isNaN(typeNum) || typeNum <= 0) {
    return <div className="p-8 text-red-400">Некорректный номер типа: {type}</div>;
  }

  const { data: subjRow, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subjRow) {
    return <div className="p-8 text-red-400">Неизвестный предмет: {subject}</div>;
  }

  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  const { data: tasks, error: taskErr } = await supabase
    .from("tasks_static")
    .select("*")
    .eq("subject_id", subjRow.id)
    .eq("type_num", typeNum)
    .eq("status", "published")
    .order("difficulty", { ascending: true });

  if (taskErr) {
    return <div className="p-8 text-red-400">Ошибка загрузки задач: {taskErr.message}</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="p-8 text-gray-400">Нет задач этого типа</div>;
  }

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {uiMeta?.label ?? subjRow.title}: задания&nbsp;типа&nbsp;{typeNum}
      </h1>
      <div className="flex flex-col gap-6">
        {tasks.map(task => (
          <div key={task.id} className="border p-2">
            <pre className="text-xs text-gray-400">
              
            </pre>
            <TaskCard subject={subject} task={task} />
          </div>
        ))}
      </div>
    </main>
  );
}

//{JSON.stringify(task, null, 2)}