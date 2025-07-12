// src/app/lk/subjects/SubjectCard.tsx
import Link from "next/link";
import ProgressBar from "../components/ProgressBar";

interface Props {
  id: string;
  name: string;
  slug: string;
  accuracy: number; // 0–1
}

export default function SubjectCard({ slug, name, accuracy }: Props) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">{name}</h3>
      <ProgressBar value={Math.round(accuracy * 100)} label="Точность" />
      <Link
        href={`/lk/subjects/${slug}`}
        className="mt-4 inline-block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary/90"
      >
        Перейти к предмету
      </Link>
    </div>
  );
}
