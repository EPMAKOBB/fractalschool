// src/app/components/TaskCard/TaskStatement.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Рендерит условие задачи как HTML или Markdown (автоопределение).
 */
export default function TaskStatement({ html }: { html: string }) {
  // Если в строке есть хотя бы один HTML-тег — считаем это HTML.
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(html);

  if (looksLikeHtml) {
    return (
      <div
        className="prose prose-invert max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Иначе — Markdown
  return (
    <div className="prose prose-invert max-w-none mb-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {html}
      </ReactMarkdown>
    </div>
  );
}
