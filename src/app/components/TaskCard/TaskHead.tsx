// src/app/components/TaskCard/TaskHead.tsx

interface TaskHeadProps {
  task: any; // Лучше прописать тип задачи, если есть!
  subject: string;
}

export default function TaskHead({ task, subject }: TaskHeadProps) {
  return (
    <div className="mb-2 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {/* Название/тип задачи */}
        <span className="font-medium text-lg">
          {task?.task_num_text
            ? `№${task.task_num_text}`
            : `Задача`}
        </span>
        {/* Тип задачи (если есть) */}
        {task?.type_num && (
          <span className="text-xs bg-muted px-2 py-0.5 rounded">
            Тип {task.type_num}
          </span>
        )}
        {/* Подтип задачи (если есть) */}
        {task?.subtype_text && (
          <span className="text-xs text-muted-foreground italic">
            {task.subtype_text}
          </span>
        )}
        {/* Сложность */}
        {typeof task?.difficulty === "number" && (
          <span className="text-xs text-blue-600 dark:text-blue-300">
            Сложность: {task.difficulty}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {/* Предмет */}
        <span>Предмет: {subject}</span>
        {/* Источник */}
        {task?.source && <span>Источник: {task.source}</span>}
        {/* ID задачи (технический) */}
        <span>ID: {task.id}</span>
      </div>
    </div>
  );
}
