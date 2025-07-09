// src/app/api/lk/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/db";

/**
 * GET /api/lk — «личный кабинет».
 * Отдаёт:
 *   role        – "guest" | "subscriber" | "course"
 *   expiresAt   – ISO-строка или null
 *   subjects    – [{ id, name, slug, progress, lastActivity }]
 *   focusTopics – [{ id, name, score }]
 */
export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // -------- проверяем сессию --------
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // -------- роль + окончание подписки --------
  // Берем последнюю назначенную роль для пользователя и делаем join к roles для slug
  const { data: userRoleRow, error: userRoleErr } = await supabase
    .from("app.user_roles")
    .select(`
      role_id,
      granted_at,
      roles:role_id (
        slug
      )
    `)
    .eq("user_id", userId)
    .order("granted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // slug роли (например, "guest", "subscriber", "course"), если нет — по умолчанию guest
  const roleSlug =
    (userRoleRow?.roles?.slug as "guest" | "subscriber" | "course") ?? "guest";
  // Подписки и их окончания нет в user_roles — можно расширить при необходимости!
  const expiresAt = null; // пока нет отдельного поля для конца подписки

  // -------- прогресс по предметам --------
  // Явно указываем схему public
  const { data: subjRows } = await supabase.rpc("public.lk_subject_progress", {
    p_user_id: userId,
  });

  const subjects =
    subjRows?.map((r: any) => ({
      id: r.subject_id,
      name: r.subject_name,
      slug: r.subject_slug,
      progress: r.progress_percent,
      lastActivity: r.last_activity,
    })) ?? [];

  // -------- темы-аутсайдеры --------
  // Явно указываем схему public
  const { data: topicRows } = await supabase.rpc("public.lk_focus_topics", {
    p_user_id: userId,
  });

  const focusTopics =
    topicRows?.map((t: any) => ({
      id: t.topic_id,
      name: t.topic_name,
      score: t.score,
    })) ?? [];

  return NextResponse.json({
    role: roleSlug,
    expiresAt,
    subjects,
    focusTopics,
  });
}
