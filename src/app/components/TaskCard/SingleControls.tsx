// src/app/components/TaskCard/SingleControls.tsx
import clsx from "clsx";
import { Button } from "@/components/ui/button";

export default function SingleControls({
  onCheck,
  score,
  maxScore,
}: {
  onCheck: () => void;
  score: number | null;
  maxScore: number;
}) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <Button
        onClick={onCheck}
        className="px-3 py-1 w-fit bg-blue-700 text-white hover:bg-blue-800"
      >
        Проверить ответ
      </Button>

      {score !== null && (
        <span
          className={clsx(
            score === maxScore
              ? "text-green-400"
              : score > 0
              ? "text-yellow-300"
              : "text-red-400",
          )}
        >
          {score === maxScore
            ? `Верно! (${score} балл${maxScore > 1 ? "а" : ""})`
            : score > 0
            ? `Частично верно (${score} из ${maxScore})`
            : "Неверно, 0 баллов"}
        </span>
      )}
    </div>
  );
}
