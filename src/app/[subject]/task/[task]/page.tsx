// src/app/[subject]/task/[task]/page.tsx

import { supabase } from "../../../../lib/supabase";
// import { subjectsMeta } from "../../../config/subjectsMeta"; // Removed
import { getSubject, type SubjectMeta } from "@/lib/dbSubjects"; // Using new data fetching
import TaskCard from "../../../components/TaskCard";

type Props = {
  params: { subject: string; task: string }; // No longer a Promise
};

// Interface for the task data we expect from tasks_static
// This should align with the structure of your tasks_static table + what TaskCard expects
interface StaticTask {
  id: string; // UUID
  body_md: string;
  type_num?: number | null;
  answer_json?: any | null;
  solution_md?: string | null;
  subject_id: string;
  difficulty?: number | null;
  // Add any other fields TaskCard might need or that are present in tasks_static
}


export default async function TaskPage({ params }: Props) {
  /* ---------- Маршрут ---------- */
  const { subject: subjectSlug, task: taskId } = params; // task is the UUID primary key

  /* ---------- Предмет (включая UI метаданные) ---------- */
  const subjectInfo = await getSubject(subjectSlug);

  if (!subjectInfo) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subjectSlug}
      </main>
    );
  }

  /* ---------- Задача ---------- */
  const { data: taskRow, error: taskErr } = await supabase
    .from("tasks_static") // Assuming tasks are from tasks_static for this page
    .select("*") // Select all needed fields for TaskCard and display
    .eq("subject_id", subjectInfo.id) // Filter by the fetched subject's ID
    .eq("id", taskId)            // id — primary key UUID
    .single<StaticTask>();

  if (taskErr) {
    return (
      <main className="p-8 text-red-400">
        Ошибка загрузки задачи: {taskErr.message}
      </main>
    );
  }

  if (!taskRow) {
    return <main className="p-8 text-gray-400">Задача не найдена</main>;
  }

  /* ---------- UI ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className={`text-2xl font-bold mb-6 ${subjectInfo.color}`}>
        {subjectInfo.icon} {subjectInfo.label}: задача №{taskRow.type_num ?? "?"}
      </h1>

      {/*
        Ensure TaskCard props are correctly mapped.
        The 'task' prop for TaskCard might expect a specific structure.
        We are passing the whole taskRow which should be compatible if TaskCard
        is designed to take fields from tasks_static.
        The 'subject' prop for TaskCard was 'subjectSlug', which is correct.
      */}
      <TaskCard task={taskRow as any} subjectSlug={subjectSlug} mode="single" />
    </main>
  );
}
