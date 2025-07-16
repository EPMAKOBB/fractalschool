// src/app/components/TaskCard/TaskHead.tsx

import Link from "next/link";
import type { Task } from "./utils/helpers";

export default function TaskHead({
  task,
  subject,
}: {
  task: Task;
  subject: string;
}) {
  return (
    
    <div className="mb-2 font-semibold flex items-center gap-2 flex-wrap">
      <span>Задача №</span>
      <Link
        href={`/${subject}/task/${task.id}`}
        className="text-blue-400 underline hover:text-blue-600"
      >
        {task.task_num_text ?? task.id}
      </Link>
      {task.type_num !== null && task.type_num !== undefined && (
        <>
          <span>,</span>
          <Link
            href={`/${subject}/type/${task.type_num}`}
            className="text-blue-400 underline hover:text-blue-600"
          >
            тип {task.type_num}
          </Link>
        </>
      )}
    </div>
  );
}
