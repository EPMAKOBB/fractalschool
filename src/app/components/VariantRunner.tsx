// src/app/components/VariantRunner.tsx
"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import { checkVariant } from "@/utils/checkVariant";
import TaskResultView from "./TaskResultView";

type Task = {
  id: number | string;
  task_id: string | number;
  task_type?: string | number; // важно для TaskCard заголовка!
  answer_type?: string;
  answer: any;
  maxScore?: number;
  statement: string;
  solution: string;
};

type Props = {
  tasks: Task[];
  subject: string; // <--- теперь обязателен!
};

// инициализируем «пустой» ответ под нужный тип
function getBlankAnswer(answerType?: string) {
  switch (answerType) {
    case "pair":
    case "pair_partial":
      return ["", ""];
    case "table_2x2":
      return [
        ["", ""],
        ["", ""],
      ];
    case "table_10x2":
      return Array.from({ length: 10 }, () => ["", ""]);
    default:
      return "";
  }
}

export default function VariantRunner({ tasks, subject }: Props) {
  /** все ответы пользователя */
  const [answers, setAnswers] = useState<any[]>(
    tasks.map(t => getBlankAnswer(t.answer_type))
  );

  /** был ли уже выполнен подсчёт результатов */
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof checkVariant> | null>(
    null
  );

  /** меняем ответ по индексу задачи */
  function onChangeAnswer(idx: number, value: any) {
    setAnswers(prev => {
      const next = [...prev];
      next[idx] = value; // всегда сохраняем *полный* объект ответа
      return next;
    });
  }

  /** проверяем весь вариант */
  function handleCheckVariant() {
    const preparedTasks = tasks.map((task, idx) => ({
      id: task.id,
      answerType: task.answer_type || "single",
      correctAnswer: task.answer,
      userAnswer: answers[idx],
      maxScore: task.maxScore,
    }));

    //  ⬇️ второй аргумент – массив введённых ответов
    const res = checkVariant(preparedTasks, answers);
    setResults(res);
    setChecked(true);
  }

  /* ---------- Этап ввода ответов ---------- */
  if (!checked) {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          handleCheckVariant();
        }}
        className="flex flex-col gap-6"
      >
        {tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            mode="variant"
            value={answers[idx]}
            onChange={val => onChangeAnswer(idx, val)}
            subject={subject}
          />
        ))}

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 self-start"
        >
          Проверить вариант
        </button>
      </form>
    );
  }

  /* ---------- Этап показа результатов ---------- */
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4 font-bold text-lg">
        Ваш результат: {results?.totalPrimary} из {results?.totalMax} баллов
      </div>

      {tasks.map((task, idx) => (
        <TaskResultView
          key={task.id}
          task={task}
          userAnswer={answers[idx]}
          result={results!.results[idx]}
        />
      ))}
    </div>
  );
}
