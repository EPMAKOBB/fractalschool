// src/app/components/TaskCard/SolutionBlock.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export interface SolutionBlockProps {
  show: boolean;              // Показывать ли решение
  solution_md: string;        // Текст решения (обычно markdown)
  answer_json?: any;
  notes_text?: string | null; // Доп. примечания (если есть)
}

export default function SolutionBlock({
  show,
  solution_md,
  answer_json,
  notes_text,
}: SolutionBlockProps) {
  if (!show) return null;

  return (
    <div className="border rounded-xl p-4">
      {/* Блок Ответ */}
{answer_json !== undefined && answer_json !== null && (
  <>
    {/* МАССИВ ПАР */}
    {Array.isArray(answer_json) && answer_json.length > 0 && Array.isArray(answer_json[0]) ? (
      <>
        <div className="font-bold mb-1">Ответ:</div>
        <div className="prose max-w-none mb-4">
          {answer_json.map((pair: any[], idx: number) => (
            <div key={idx}>{pair.join(" ")}</div>
          ))}
        </div>
      </>
    ) : (
      // ОДИНОЧНЫЙ ОТВЕТ или просто массив из одного значения
      <div className="font-bold mb-2">
        Ответ: {Array.isArray(answer_json) ? answer_json.join(" ") : String(answer_json)}
      </div>
    )}
  </>
)}

      {/* Блок Решение */}
      <div className="font-bold mb-2">Решение:</div>
      <div className="prose max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {solution_md}
        </ReactMarkdown>
      </div>
      {/* Примечания (если есть) */}
      {notes_text && (
        <div className="mt-2 text-xs text-muted-foreground italic">{notes_text}</div>
      )}
    </div>
  );
}

