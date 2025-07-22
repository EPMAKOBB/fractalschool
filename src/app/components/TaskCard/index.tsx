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
    <div className="border rounded-xl p-4 shadow bg-[hsl(var(--card))]">

       <div className="mb-2 text-xs text-gray-400 border p-2 rounded bg-black/30">
      <b>DEBUG:</b>
      <pre>{JSON.stringify(task.source, null, 2)}</pre>
      <div>userAnswer: <b>{JSON.stringify(userAnswer)}</b></div>
      <div>showSolution: <b>{String(showSolution)}</b></div>
      <div>subject: <b>{subject}</b></div>
    </div>

      <TaskStatement {...{
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
        showSolution={showSolution}
        setShowSolution={setShowSolution}
      />

     <SolutionBlock
  show={showSolution}
  solution_md={task.solution_md}
  notes_text={task.notes_text}
/>
    </div>
  );
}
