// src/app/components/TaskCard/SolutionBlock.tsx

import React from "react";
import ReactMarkdown from "react-markdown";

export interface SolutionBlockProps {
  show: boolean;              // Показывать ли решение
  solution_md: string;        // Текст решения (обычно markdown)
  notes_text?: string | null; // Доп. примечания (если есть)
}

export default function SolutionBlock({
  show,
  solution_md,
  notes_text,
}: SolutionBlockProps) {
  if (!show) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-[hsl(var(--secondary))]">
      <div className="font-bold mb-2">Решение</div>
      <div className="prose max-w-none">
        <ReactMarkdown>{solution_md}</ReactMarkdown>
      </div>
      {notes_text && (
        <div className="mt-2 text-xs text-muted-foreground italic">{notes_text}</div>
      )}
    </div>
  );
}
