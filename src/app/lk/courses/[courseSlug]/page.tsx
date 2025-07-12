// src/app/lk/courses/[courseSlug]/page.tsx

import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProgressBar from "../../components/ProgressBar";
import GenerateVariantButton from "../../components/GenerateVariantButton";

// Типизация params строго по Next.js 13/14 app router
interface PageProps {
  params: { courseSlug: string };
}

export default async function Page({ params }: PageProps) {
  const supabase = await createClient();
  const { courseSlug } = params;

  // Получить курс
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (!course) return notFound();

  // Прогресс по модулям
  const { data: moduleRows } = await supabase
    .from("v_user_module_progress")
    .select("*")
    .eq("course_id", course.id);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <GenerateVariantButton
          variantName="тренировочный модуль"
          onGenerate={async () => {
            "use server";
            // TODO: вызвать action генерации модуля
          }}
        />
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Прогресс по модулям</h2>
        {moduleRows?.length ? (
          <ul className="space-y-4">
            {moduleRows.map((m) => (
              <li key={m.module_id}>
                <ProgressBar
                  value={Math.round((m.completed_percent ?? 0) * 100)}
                  label={m.module_title}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет данных.</p>
        )}
      </section>
    </div>
  );
}
