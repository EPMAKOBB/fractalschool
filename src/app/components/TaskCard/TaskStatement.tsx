// src/app/components/TaskCard/TaskStatement.tsx

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

export interface TaskStatementProps {
  subject: string; 
  type_num: number;
  subtype_text: string;
  task_num_text: string;
  source: string;
  difficulty: number;
  body_md: string;
}

export default function TaskStatement(props: TaskStatementProps) {
  const { subject, type_num, subtype_text, task_num_text, source, difficulty, body_md } = props; // <- добавил subject

  return (
    <div className="mb-4">
      {/* Заголовок */}
      <div className="mb-2 font-semibold text-lg">
        <Link
          href={`/${subject}/task/${task_num_text}`}
          className="text-blue-600 hover:underline"
          prefetch={false}
        >
          Задача №{task_num_text}
        </Link>
        . Тип {type_num}
        {subtype_text ? `: ${subtype_text}` : ""}
      </div>
      {/* Доп. инфо */}
      <div className="text-xs text-muted-foreground mb-4">
        Источник: {source} · Сложность: {difficulty}
      </div>
      {/* Тело условия задачи */}
      <div className="border rounded-xl p-4 shadow bg-[hsl(var(--card))]">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {body_md}
        </ReactMarkdown>
      </div>
    </div>
  );
}
