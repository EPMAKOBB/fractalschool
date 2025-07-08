// src/app/lk/SubjectCard/index.tsx
"use client";
import Link from "next/link";
import { SubjectStat } from "@/types/dashboard";

export default function SubjectCard({ subject }: { subject: SubjectStat }) {
  return (
    <Link
      href={`/subject/${subject.slug}`}
      className="block rounded-xl border p-4 shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{subject.name}</h3>
        <span className="text-sm text-gray-500">{subject.progress}%</span>
      </div>

      <div className="mt-2 h-2 w-full bg-gray-200 rounded">
        <div
          style={{ width: `${subject.progress}%` }}
          className="h-full bg-blue-500 rounded"
        />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Последняя активность: {subject.lastActivity}
      </p>
    </Link>
  );
}
