// src/app/components/TaskCard/TaskStatement.tsx
"use client";

import MdxRender from "@/app/components/MdxRender";

/** Рендерит условие задачи из строки MDX/Markdown. */
export default function TaskStatement({ mdx }: { mdx: string }) {
  return <MdxRender source={mdx} />;
}

