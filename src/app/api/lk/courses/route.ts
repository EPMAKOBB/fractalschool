// src/app/api/lk/courses/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/lk/courses
 * Возвращает список приобретённых/доступных курсов и прогресс по ним
 */
export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  if (sessErr) return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = session.user.id;

  const { data: rows, error } = await supabase
    .schema("learner")
    .from("user_course_progress")
    .select("course_id, completed_units, total_units, grade, certified, last_activity")
    .eq("user_id", userId);

  if (error) {
    console.error("user_course_progress", error);
    return NextResponse.json({ error: "progress_failed" }, { status: 500 });
  }

  // Мета‑данные курсов
  const ids = rows?.map((r) => r.course_id).filter(Boolean) as string[];
  const { data: metaRows } = await supabase
    .schema("billing")
    .from("courses")
    .select("id, title, slug, price_cents")
    .in("id", ids);

  const courses = (rows ?? []).map((c) => {
    const meta = metaRows?.find((m) => m.id === c.course_id);
    const completed = c.total_units ? c.completed_units ?? 0 : 0;
    const progress = c.total_units ? completed / (c.total_units ?? 1) : null;
    return {
      id: c.course_id,
      title: meta?.title ?? "Курс",
      slug: meta?.slug ?? "",
      priceCents: meta?.price_cents,
      progress,
      grade: c.grade,
      certified: c.certified,
      lastActivity: c.last_activity,
    };
  });

  return NextResponse.json({ courses });
}