// src/app/[subject]/type/[type]/page.tsx

import { supabase } from "../../../../lib/supabase";
// import { subjectsMeta } from "../../../config/subjectsMeta"; // Removed
import { getSubject, type SubjectMeta } from "@/lib/dbSubjects"; // Using new data fetching
import TaskCard from "../../../components/TaskCard";

type Props = {
  params: { subject: string; type: string }; // No longer a Promise
};

// Align with tasks_static structure + TaskCard needs
interface StaticTask {
  id: string; // UUID
  body_md: string;
  type_num?: number | null;
  answer_json?: any | null;
  solution_md?: string | null;
  subject_id: string;
  difficulty?: number | null;
  answer_type?: string | null; // For TaskCard
  maxScore?: number | null;    // For TaskCard
  // Add any other fields TaskCard might need or that are present in tasks_static
}

export default async function TypeTasksPage({ params }: Props) {
  // --- параметры маршрута ---
  const { subject: subjectSlug, type } = params; // No await needed
  const typeNum = Number(type);

  if (Number.isNaN(typeNum) || typeNum <= 0) {
    return (
      <main className="p-8 text-red-400">Некорректный номер типа: {type}</main>
    );
  }

  // --- предмет (включая UI метаданные) ---
  const subjectInfo = await getSubject(subjectSlug);

  if (!subjectInfo) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subjectSlug}
      </main>
    );
  }

  // --- задачи этого типа ---
  const { data: tasks, error: taskErr } = await supabase
    .from("tasks_static")
    .select("*") // Select all necessary fields for TaskCard
    .eq("subject_id", subjectInfo.id) // Use id from subjectInfo
    .eq("type_num", typeNum)
    .order("difficulty", { ascending: true });

  if (taskErr) {
    return (
      <main className="p-8 text-red-400">
        Ошибка загрузки задач: {taskErr.message}
      </main>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <main className="p-8 text-gray-400">
        Нет задач этого типа
      </main>
    );
  }

  // --- UI ---
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className={`text-2xl font-bold mb-6 ${subjectInfo.color}`}>
        {subjectInfo.icon} {subjectInfo.label}: задания&nbsp;типа&nbsp;{typeNum}
      </h1>

      <div className="flex flex-col gap-6">
        {(tasks as StaticTask[]).map(task => (
          <TaskCard
            key={task.id}
            subjectSlug={subjectSlug} // Keep original slug for TaskCard if it uses it for links/etc.
            task={{
              ...task,
              answer_type: task.answer_type ?? "single", // Defaulting if not present
              maxScore: task.maxScore ?? 1,             // Defaulting if not present
            }}
            mode="single"
          />
        ))}
      </div>
    </main>
  );
}
