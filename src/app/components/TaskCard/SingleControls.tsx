// src/app/components/TaskCard/SingleControls.tsx

import clsx from "clsx";
import { Button } from "@/components/ui/button";

interface SingleControlsProps {
  onCheck: () => void;
  score: number | null;
  maxScore: number;
}

export default function SingleControls({
  onCheck,
  score,
  maxScore,
}: SingleControlsProps) {
  // Сообщение в зависимости от результата
  let message = "";
  if (score !== null) {
    if (score === maxScore && maxScore > 0) {
      message = `Верно! (${score} балл${maxScore > 1 ? "а" : ""})`;
    } else if (score > 0) {
      message = `Частично верно (${score} из ${maxScore})`;
    } else {
      message = "Неверно, 0 баллов";
    }
  }
  

  return (
    <div className="flex flex-col gap-2 mb-2">
      <Button
        onClick={onCheck}
        className="w-fit"
        type="button"
      >
        Проверить ответ
      </Button>
      {score !== null && (
        <span
          className={clsx(
            "font-semibold",
            score === maxScore && maxScore > 0
              ? "text-green-600 dark:text-green-400"
              : score > 0
              ? "text-yellow-600 dark:text-yellow-300"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}
