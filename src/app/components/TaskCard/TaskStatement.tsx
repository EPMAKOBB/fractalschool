// src/app/components/TaskCard/TaskStatement.tsx

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export interface TaskStatementProps {
  type_num: number;
  subtype_text: string;
  task_num_text: string;
  source: string;
  difficulty: number;
  body_md: string;
}

export default function TaskStatement(props: TaskStatementProps) {
  const { type_num, subtype_text, task_num_text, source, difficulty, body_md } = props;

  return (
    <div className="mb-4">
      {/* Заголовок */}
      <div className="mb-2 font-semibold text-lg">
        Задача №{task_num_text} (тип {type_num}
        {subtype_text ? `, подтип: ${subtype_text}` : ""}
        )
      </div>
      {/* Доп. инфо */}
      <div className="text-xs text-muted-foreground mb-2">
        Источник: {source} · Сложность: {difficulty}
      </div>
      {/* Тело условия задачи */}
      <div className="prose max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {body_md}
        </ReactMarkdown>
      </div>
    </div>
  );
}
