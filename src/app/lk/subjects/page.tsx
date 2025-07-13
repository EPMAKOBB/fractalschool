// src/app/lk/subjects/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

import SubjectCard from "./SubjectCard";
import RecommendationCard from "../components/RecommendationCard";

export const metadata: Metadata = { title: "Мои предметы" };

export default async function SubjectsPage() {
  /* 1. Supabase + пользователь */
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <p className="p-4">Необходимо войти.</p>;

  /* 2. Прогресс по предметам */
  const { data: subjRows } = await supabase
    .from("v_user_subject_progress")
    .select("*")
    .eq("user_id", session.user.id);

  /* 3. «Слабые» темы + рекомендации */
  const { data: topicRows } = await supabase
    .from("v_user_topic_progress")
    .select("*")
    .eq("user_id", session.user.id)
    .order("accuracy", { ascending: true })
    .limit(3);

  const { data: recRows } = await supabase.rpc("fn_recommend_tasks", {
    _user_id: session.user.id,
    _limit: 5,
  });

  return (
    <div className="space-y-8">
      {/* предметы */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjRows?.map((s) => (
          <SubjectCard
            key={s.subject_id}
            id={s.subject_id}
            name={s.subject_name}
            slug={s.subject_slug}
            accuracy={s.accuracy}
          />
        )) ?? <p>Нет предметов</p>}
      </section>

      {/* рекомендации */}
      {topicRows?.length ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Рекомендуем сфокусироваться</h2>
          <div className="flex flex-wrap gap-6">
            {topicRows.map((t) => (
              <RecommendationCard
                key={t.topic_id}
                topicName={t.topic_name}
                accuracy={t.accuracy}
                onGenerate={() => {
                  /* TODO: вызвать action для генерации задачи по теме */
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* персональные задачи */}
      {recRows?.length ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Персональные задачи-рекомендации</h2>
          <ul className="list-disc pl-6">
            {recRows.map((r: any) => (
              <li key={r.task_id}>
                <Link href={`/tasks/${r.task_id}`} className="text-primary hover:underline">
                  Задача #{r.task_id}
                </Link>{" "}
                (score: {r.score})
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
