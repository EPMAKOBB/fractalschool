// src/app/components/TaskResultView.tsx

"use client";

import { useState } from "react";
import { formatAnswer } from "@/utils/formatAnswer";

// Типы для props (расширяй под свои нужды)
type TaskResultViewProps = {
  task: any;
  userAnswer: any;
  result: {
    isCorrect: boolean;
    score: number;
    maxScore: number;
    details?: any;
  };
};


// Основной компонент
export default function TaskResultView({ task, userAnswer, result }: TaskResultViewProps) {
  const [showSolution, setShowSolution] = useState(false);

  let mark = "";
  let color = "";
  if (result.score === result.maxScore) {
    mark = `Верно (${result.score} балл${result.maxScore > 1 ? "а" : ""})`;
    color = "text-green-400";
  } else if (result.score > 0) {
    mark = `Частично верно (${result.score} из ${result.maxScore})`;
    color = "text-yellow-300";
  } else {
    mark = "Неверно (0 баллов)";
    color = "text-red-400";
  }

  return (
    <div className="border rounded-lg bg-gray-900 p-4 mb-4">
      <div className="mb-2 font-semibold">
        <span className="text-blue-400">№ {task.task_id}</span>
        <span className={`ml-4 font-semibold ${color}`}>{mark}</span>
      </div>
      <div className="mb-4 whitespace-pre-line">{task.statement}</div>

      <div className="mb-2">
        <span className="text-gray-400">Ваш ответ: </span>
        <span>{formatAnswer(userAnswer)}</span>
      </div>

      <div className="mb-2">
        <span className="text-gray-400">Правильный ответ: </span>
        <span>{formatAnswer(task.answer)}</span>
      </div>

      <button
        className="text-blue-400 underline text-sm mt-2"
        onClick={() => setShowSolution(s => !s)}
      >
        {showSolution ? "Скрыть решение" : "Показать решение"}
      </button>

      {showSolution && (
        <div className="mt-3 bg-gray-800 rounded p-3 text-sm">
          <b>Решение:</b>
          <div className="whitespace-pre-line">{task.solution}</div>
        </div>
      )}
    </div>
  );
}
