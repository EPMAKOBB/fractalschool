// src/app/lk/subjects/[subjectSlug]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TypeProgress from "./components/TypeProgress";
import TopicProgress from "./components/TopicProgress";
import GenerateVariantButton from "../../components/GenerateVariantButton";

interface Props {
  params: { subjectSlug: string };
}

export default async function SubjectDetailPage({ params }: Props) {
  const { subjectSlug } = params;
  const supabase = await createClient();

  /* Находим сам предмет */
  const { data: subject } = await supabase
    .from("subjects")
    .select("id, title")
    .eq("slug", subjectSlug)
    .maybeSingle();

  if (!subject) notFound();

  /* 1. Прогресс по типам */
  const { data: typeRows } = await supabase
    .from("v_user_type_progress")
    .select("*")
    .eq("subject_id", subject.id);

  /* 2. Прогресс по темам */
  const { data: topicRows } = await supabase
    .from("v_user_topic_progress")
    .select("*")
    .eq("subject_id", subject.id);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold">{subject.title}</h1>
        <GenerateVariantButton
          variantName="вариант по предмету"
          onGenerate={async () => {
            "use server";
            // TODO: вызов action /api/lk/subjects/<id>/generate-variant
          }}
        />
      </header>

      {/* прогресс по типам */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Прогресс по типам</h2>
        {typeRows?.map((t) => (
          <TypeProgress
            key={t.type_num}
            typeNum={t.type_num}
            accuracy={t.accuracy}
            subtypeRows={
              topicRows?.filter((p) => p.type_num === t.type_num) ?? []
            }
          />
        )) ?? <p>Нет данных</p>}
      </section>

      {/* прогресс по темам */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Прогресс по темам</h2>
        {topicRows?.map((tp) => (
          <TopicProgress
            key={tp.topic_id}
            topicName={tp.topic_name}
            accuracy={tp.accuracy}
          />
        )) ?? <p>Нет данных</p>}
      </section>
    </div>
  );
}
