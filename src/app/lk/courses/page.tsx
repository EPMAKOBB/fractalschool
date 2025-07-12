// src/app/lk/courses/page.tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ProgressBar from "../components/ProgressBar";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <p className="p-4">Необходимо войти.</p>;

  /* курсы + прогресс */
  const { data: rows } = await supabase
    .from("v_user_course_progress")
    .select("*")
    .eq("user_id", session.user.id);

  if (!rows?.length) return <p className="p-4">Курсов пока нет.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((c) => (
        <div key={c.course_id} className="rounded-xl border p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">{c.course_name}</h3>
          <ProgressBar
            value={Math.round((c.completed_percent ?? 0) * 100)}
            label="Завершено"
          />
          <Link
            href={`/lk/courses/${c.course_slug}`}
            className="mt-4 inline-block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Перейти к курсу
          </Link>
        </div>
      ))}
    </div>
  );
}
