// src/app/components/ClientHeader.tsx
"use client";
import Header from "./Header";
import type { SubjectMeta } from "@/lib/dbSubjects"; // Import the type

interface ClientHeaderProps {
  subjects: SubjectMeta[];
}

export default function ClientHeader({ subjects }: ClientHeaderProps) {
  return <Header subjects={subjects} />;
}
