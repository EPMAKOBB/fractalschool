// src/app/lk/page.tsx
"use client";
import { useDashboardData } from "./hooks/useDashboardData";
import SubjectCard from "./SubjectCard";
import SubscriptionStatus from "./SubscriptionStatus";
import FocusTopics from "./FocusTopics";

export default function LKPage() {
  const { data, error, isLoading } = useDashboardData();

  if (isLoading) return <p>Загрузка...</p>;
  if (error || !data) return <p>Ошибка загрузки данных</p>;

  return (
    <>
      <SubscriptionStatus role={data.role} expiresAt={data.expiresAt} />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </section>

      <FocusTopics topics={data.focusTopics} />
    </>
  );
}
