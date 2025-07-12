// src/app/api/lk/subjects/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

/* ─────────── Локальные типы ─────────── */
type SubjectProgressRow = {
  subject_id: string;
  subject_name: string;
  total_tasks: number;
  solved_tasks: number;
  accuracy: number;
};

type FocusTopicRow = {
  topic_id: string;
  topic_name: string;
  accuracy: number;
};

type RecommendTaskRow = {
  task_id: string;
  score: number;
};

/* ─────────── GET /api/lk/subjects ─────────── */
export async function GET(_req: NextRequest) {
  // 1. SSR-клиент Supabase
  const supabase = await createClient();

  // 2. Авторизация через getSession (корректно для SSR)
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  if (sessErr) return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = session.user.id;

  // 3. Прогресс по предметам
  const { data: subjRows, error: subjErr } = await supabase
    .from("v_user_subject_progress")
    .select("*")
    .eq("user_id", userId);

  if (subjErr) {
    console.error(subjErr);
    return NextResponse.json({ error: subjErr.message }, { status: 500 });
  }

  const subjects: SubjectProgressRow[] =
    subjRows?.map((r: any) => ({
      subject_id: r.subject_id,
      subject_name: r.subject_name,
      total_tasks: r.total_tasks,
      solved_tasks: r.solved_tasks,
      accuracy: r.accuracy,
    })) ?? [];

  // 4. Три слабые темы
  const { data: topicRows, error: topicErr } = await supabase
    .from("v_user_topic_progress")
    .select("*")
    .eq("user_id", userId)
    .order("accuracy", { ascending: true })
    .limit(3);

  if (topicErr) {
    console.error(topicErr);
    return NextResponse.json({ error: topicErr.message }, { status: 500 });
  }

  const focusTopics: FocusTopicRow[] =
    topicRows?.map((r: any) => ({
      topic_id: r.topic_id,
      topic_name: r.topic_name,
      accuracy: r.accuracy,
    })) ?? [];

  // 5. Персональные задачи-рекомендации
  const { data: recRows, error: recErr } = await supabase.rpc(
    "fn_recommend_tasks",
    { _user_id: userId, _limit: 5 }
  );

  if (recErr) {
    console.error(recErr);
    return NextResponse.json({ error: recErr.message }, { status: 500 });
  }

  const recommendations: RecommendTaskRow[] =
    recRows?.map((r: RecommendTaskRow) => ({
      task_id: r.task_id,
      score: r.score,
    })) ?? [];

  // 6. Ответ
  return NextResponse.json({ subjects, focusTopics, recommendations });
}
