// src/app/[subject]/variant/[variant]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { subjectsMeta } from "@/app/config/subjectsMeta";
import VariantCard from "@/app/components/VariantCard";

export interface Task {
  id: string | number;
  type_num: number;
  subtype_text: string;
  task_num_text: string;
  source: string;
  difficulty: number;
  body_md: string;
  answer_json: any;
  solution_md: string;
  notes_text: string | null;
}

type Props = {
  params: Promise<{ subject: string; variant: string }>;
};

export default async function VariantPage({ params }: Props) {
  const supabase = await createClient();

  // Ждём params (если это промис)
  const { subject, variant } = await params;

  // Получаем сам subject
  const { data: subjRow, error: subjErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subject)
    .single();

  if (subjErr || !subjRow) {
    return <div className="p-8 text-red-400">Неизвестный предмет: {subject}</div>;
  }

  // Получаем задачи из variant_task_map + tasks_static (join!)
  // Сначала получаем id задач этого варианта, затем сами задачи
  const { data: mappings, error: mapErr } = await supabase
    .from("variant_task_map")
    .select("task_id, position")
    .eq("variant_id", variant)
    .order("position", { ascending: true });

  if (mapErr || !mappings || mappings.length === 0) {
    return <div className="p-8 text-gray-400">Нет задач в этом варианте</div>;
  }

  // Собираем массив id задач
  const taskIds = mappings.map(m => m.task_id);

  // Получаем все задачи по этим id (сразу все опубликованные)
  const { data: tasks, error: tasksErr } = await supabase
    .from("tasks_static")
    .select("*")
    .in("id", taskIds)
    //.eq("status", "published");

  if (tasksErr || !tasks || tasks.length === 0) {
    return <div className="p-8 text-gray-400">Задачи варианта не найдены</div>;
  }

  // Опционально — сортируем задачи по position
  const tasksOrdered = mappings
    .map(m => tasks.find(t => t.id === m.task_id))
    .filter(Boolean);

  // Можно найти метаданные варианта, если нужно (title, year и т.д.)

  const uiMeta = subjectsMeta.find(s => s.slug === subject);

  // Передаём в VariantCard все задачи, subject и опционально meta
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {uiMeta?.label ?? subjRow.title}: вариант {variant}
      </h1>
      <VariantCard
        tasks={tasksOrdered}
        subject={subject}
        // можно пробросить метаданные варианта при желании
      />
    </main>
  );
}
