// src/app/[subject]/type/[type]/page.tsx


import { createClient } from "@/utils/supabase/server";
import { subjectsMeta } from "@/app/config/subjectsMeta";
import TaskCard from "@/app/components/TaskCard";

type Props = {
  params: Promise<{ subject: string; type: string }>;
};

export default async function TypeTasksPage(props: Props) {
  // --- параметры маршрута ---

  const supabase = await createClient();


  const { subject, type } = await props.params;
  const typeNum = Number(type);

  if (Number.isNaN(typeNum) || typeNum <= 0) {
    return (
      <div className="p-8 text-red-400">Некорректный номер типа: {type}</div>
    );
  }

  // --- предмет ---
  const { data: subjRow, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subjRow) {
    return (
      <div className="p-8 text-red-400">
        Неизвестный предмет: {subject}
      </div>
    );
  }

  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  // --- задачи этого типа ---
  const { data: tasks, error: taskErr } = await supabase
    .from("tasks_static")
    .select(
      `id, type_num, body_mdx, solution_mdx, tables_data, svg_data, img_urls,
       answer_json, answer_type, maxScore, task_num_text, notes_text, source,
       difficulty`
    )
    .eq("subject_id", subjRow.id)
    .eq("type_num", typeNum)
    .order("difficulty", { ascending: true });



  if (taskErr) {
    return (
      <div className="p-8 text-red-400">
        Ошибка загрузки задач: {taskErr.message}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-8 text-gray-400">
        Нет задач этого типа
        <pre className="text-xs text-gray-600 mt-4">
         // {JSON.stringify(tasks, null, 2)}
        </pre>
      </div>
    );
  }

  // --- UI ---
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {uiMeta?.label ?? subjRow.title}: задания&nbsp;типа&nbsp;{typeNum}
      </h1>

      {/* --- ОТЛАДОЧНЫЙ ВЫВОД ---
      <pre className="text-xs text-gray-600 mb-8 bg-gray-950 rounded p-2">
        {JSON.stringify(tasks, null, 2)}
      </pre> */}

      <div className="flex flex-col gap-6">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            subject={subject}
            task={{
              ...task,
              answer_type: task.answer_type ?? "single",
              maxScore: task.maxScore ?? 1,
            }}
            mode="single"
          />
        ))}
      </div>
    </main>
  );
}
