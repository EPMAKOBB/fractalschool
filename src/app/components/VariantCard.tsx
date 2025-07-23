// src/app/components/VariantCard.tsx
"use client";

import { useState } from "react";
import TaskStatement from "@/app/components/TaskCard/TaskStatement";
import TaskInput from "@/app/components/TaskCard/TaskInput";
import SolutionBlock from "@/app/components/TaskCard/SolutionBlock";
// import { checkAnswer } from "@/utils/checkAnswer"; // если нужен подсчет баллов

export interface Task {
  id: string | number;
  type_num: number;
  subtype_text: string;
  task_num_text: string;
  source: string;
  difficulty: number;
  body_md: string;
  answer_json: any;
  solution_md: string;
  notes_text: string | null;
}

interface VariantCardProps {
  tasks: Task[];
  subject: string;
  // Можно добавить: variantMeta, variantTitle и т.д.
}

export default function VariantCard({ tasks, subject }: VariantCardProps) {
  // userAnswers — массив с ответами пользователя для каждой задачи
  const [userAnswers, setUserAnswers] = useState<any[]>(tasks.map(() => ""));
  // Стейт: решен ли вариант
  const [variantFinished, setVariantFinished] = useState(false);

  // Можно добавить расчет баллов:
  // const [scores, setScores] = useState<number[]>(tasks.map(() => 0));

  // Обработка изменения ответа
  const handleChange = (idx: number, val: any) => {
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  // Можно добавить обработку финального подсчета (если надо баллы и checkAnswer):
  // const handleFinish = () => {
  //   const results = tasks.map((task, idx) =>
  //     checkAnswer({
  //       answerType: ...,
  //       userAnswer: userAnswers[idx],
  //       correctAnswer: task.answer_json,
  //       maxScore: ...
  //     })
  //   );
  //   setScores(results.map(r => r.score));
  //   setVariantFinished(true);
  // };

  return (
    <div>
      {tasks.map((task, idx) => (
        <div key={task.id} className="mb-8 border rounded-xl shadow p-4 bg-[hsl(var(--card))]">
          <TaskStatement
            subject={subject}
            type_num={task.type_num}
            subtype_text={task.subtype_text}
            task_num_text={task.task_num_text}
            source={task.source}
            difficulty={task.difficulty}
            body_md={task.body_md}
          />
          <TaskInput
            type_num={task.type_num}
            subject={subject}
            answer_json={task.answer_json}
            value={userAnswers[idx]}
            onChange={val => handleChange(idx, val)}
            disabled={variantFinished}
          />
          {/* Решение и ответ показываем только если вариант завершён */}
          <SolutionBlock
            show={variantFinished}
            answer_json={task.answer_json}
            solution_md={task.solution_md}
            notes_text={task.notes_text}
          />
        </div>
      ))}

      {/* Кнопка завершения решения варианта */}
      {!variantFinished && (
        <div className="text-center mt-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition"
            onClick={() => setVariantFinished(true)}
          >
            Завершить вариант и посмотреть решения
          </button>
        </div>
      )}
    </div>
  );
}
