// src/app/page.tsx

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { supabase } from "../lib/supabase";

interface TaskMeta {
  id: string;
  template_name: string;
  subject: string;
  tags: string[];
  created_at: string;
}

export default async function HomePage() {
  const { data: tasks, error } = await supabase
    .from("tasks_meta")
    .select("id, template_name, subject, tags, created_at");

  if (error) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-red-600">Ошибка загрузки шаблонов: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Шаблоны задач</h1>
      <ul className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task: TaskMeta) => (
            <li key={task.id}>
              <Link
                href={`/tasks_meta/${task.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-1">
                  {task.template_name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Предмет: <span className="font-medium">{task.subject}</span>{" "}
                  | Теги: <span className="font-medium">{task.tags.join(", ")}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Создано:{" "}
                  {format(new Date(task.created_at), "dd MMMM yyyy, HH:mm", {
                    locale: ru,
                  })}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-700">Шаблонов ещё нет.</p>
        )}
      </ul>
    </main>
  );
}
