// src/app/components/TaskCard/index.tsx

"use client";

import TaskStatement from "./TaskStatement";
import TaskInput from "./TaskInput";
import SolutionBlock from "./SolutionBlock";

import { useState } from "react";

// разбор task на составляющие
export interface Task {

  id: string | number; // id задачи в базе
  type_num: number;  // номер типа 
  subtype_text: string;  // подтип
  task_num_text: string;  // slug-номер для фронтенда
  source: string;  // источник задачи
  difficulty: number;  //  сложность

  body_md: string;  // тело условия

  answer_json: number | string | [number, number] | number[] | [number, number][] | null; // правильный ответ
  solution_md: string;  //  тело решения
  notes_text: string | null;   //  примечания
}

interface TaskCardProps {
  task: Task;
  subject: string;
}

export default function TaskCard({ task, subject }: TaskCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="border  p-4 shadow ">

   

      <TaskStatement {...{
        subject, 
        type_num: task.type_num,
        subtype_text: task.subtype_text,
        task_num_text: task.task_num_text,
        source: task.source,
        difficulty: task.difficulty,
        body_md: task.body_md,
      }} />

      <TaskInput
        type_num={task.type_num}
        subject={subject}
        answer_json={task.answer_json}
        value={userAnswer}
        onChange={setUserAnswer}
      />

     <div className="mt-4 text-sm text-right">
  <span
    className="text-blue-600 cursor-pointer border-b border-dashed border-blue-400 hover:border-b-2 transition"
    onClick={() => setShowSolution(v => !v)}
    tabIndex={0} // позволяет фокусироваться с клавиатуры
    role="button" // для доступности
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") setShowSolution(v => !v);
    }}
  >
    {showSolution ? "Свернуть ответ и решение" : "Показать ответ и решение"}
  </span>
</div>

<SolutionBlock
  show={showSolution}
  answer_json={task.answer_json}
  solution_md={task.solution_md}
  notes_text={task.notes_text}
/>
    </div>
  );
}
