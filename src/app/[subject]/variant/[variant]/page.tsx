// src/app/[subject]/variant/[variant]/page.tsx

import { supabase } from "../../../../lib/supabase";
// import { subjectsMeta } from "../../../config/subjectsMeta"; // Removed
import { getSubject, type SubjectMeta } from "@/lib/dbSubjects"; // Using new data fetching
import { Suspense } from "react";
import Link from "next/link"; // Added for linking to individual tasks
import TaskCard from "../../../components/TaskCard"; // Added TaskCard for displaying tasks


type Props = {
  params: { subject: string; variant: string }; // No longer a Promise
};

// Interface for the task data we expect from tasks_static via variant_task_map
interface StaticTask {
  id: string; // UUID
  body_md: string;
  type_num?: number | null;
  answer_json?: any | null;
  solution_md?: string | null;
  subject_id: string;
  difficulty?: number | null;
  task_id?: string | null; // Custom task_id if available
  // Add any other fields TaskCard might need or that are present in tasks_static
}

interface VariantTaskMapRow {
  position: number | null;
  tasks_static: StaticTask | null; // This is how Supabase returns joined data
}


export default async function VariantPage({ params }: Props) {
  /* ---------- параметры маршрута ---------- */
  const { subject: subjectSlug, variant: variantSlug } = params; // No await needed

  /* ---------- предмет (включая UI метаданные) ---------- */
  const subjectInfo = await getSubject(subjectSlug);

  if (!subjectInfo) {
    return (
      <main className="p-8 text-red-400">
        Неизвестный предмет: {subjectSlug}
      </main>
    );
  }

  /* ---------- вариант ---------- */
  const { data: variantRow, error: varErr } = await supabase
    .from("variants")
    .select("*") // Select all needed fields for the variant display
    .eq("subject_id", subjectInfo.id) // Use id from subjectInfo
    .eq("slug", variantSlug) // Assuming variants are identified by a slug
    .single();

  if (varErr) {
    return (
      <main className="p-8 text-red-400">
        Ошибка загрузки варианта: {varErr.message}
      </main>
    );
  }

  if (!variantRow) {
    return <main className="p-8 text-gray-400">Вариант не найден</main>;
  }

  /* ---------- задачи через variant_task_map ---------- */
  const { data: taskMapRows, error: mapErr } = await supabase
    .from("variant_task_map")
    .select(
      `
        position,
        tasks_static:task_id ( * )
      `
    ) // task_id in variant_task_map refers to id in tasks_static
    .eq("variant_id", variantRow.id)
    .order("position");

  if (mapErr) {
    return (
      <main className="p-8 text-red-400">
        Ошибка загрузки задач варианта: {mapErr.message}
      </main>
    );
  }

  if (!taskMapRows || taskMapRows.length === 0) {
    return (
      <main className="p-8 text-gray-400">
        Нет задач в этом варианте
      </main>
    );
  }

  // Extract and filter tasks, ensuring they are valid StaticTask objects
  const orderedTasks: StaticTask[] = taskMapRows
    .map(r => (r as VariantTaskMapRow).tasks_static)
    .filter((task): task is StaticTask => task !== null && typeof task === 'object');


  /* ---------- UI ---------- */
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className={`text-2xl font-bold mb-6 ${subjectInfo.color}`}>
        {subjectInfo.icon} {subjectInfo.label}: вариант&nbsp;
        {variantRow.title ?? variantRow.slug ?? variantSlug}
      </h1>

      <div className="text-sm mb-2">ID варианта: {variantRow.id}</div>

      <Suspense fallback={<div>Загрузка задач…</div>}>
        <div className="flex flex-col gap-6">
          {orderedTasks.map((task, index) => (
            <div key={task.id || index}>
              <h2 className="text-lg font-semibold mt-4 mb-2">
                Задание {index + 1} (Тип {task.type_num ?? task.task_type ?? 'N/A'})
              </h2>
              {/*
                TaskCard expects a 'subjectSlug' prop as well.
                The task object passed to TaskCard should match its expected props.
              */}
              <TaskCard
                task={task as any} // Cast as any if task structure from join isn't perfectly matching TaskCard's specific prop type
                subjectSlug={subjectSlug}
                mode="variant" // or "single" depending on how TaskCard should behave here
              />
               <Link href={`/${subjectSlug}/task/${task.id}`} className="text-blue-400 hover:underline text-sm mt-2 inline-block">
                Открыть задачу отдельно
              </Link>
            </div>
          ))}
        </div>
      </Suspense>
    </main>
  );
}
