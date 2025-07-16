// src/app/components/TaskCard/utils/helpers.tsx

import React from "react";
import { formatAnswer } from "@/utils/formatAnswer";

/* ---------- Типы данных ---------- */
export type UserAnswer = string | string[] | string[][];

export type Task = {
  id: string;
  body_md: string;
  answer_json: any;
  solution_md: string | null;
  type_num: number | null;
  answer_type?: string;
  maxScore?: number;
  // Добавить эти поля:
  task_num_text?: string | null;
  notes_text?: string | null;
  source?: string | null;
  // ... если будут ещё новые поля — добавь их сюда
};


/* Props для двух режимов карточки */
export type SingleModeProps = {
  task: Task;
  mode: "single";
  subject: string;
};

export type VariantModeProps = {
  task: Task;
  mode: "variant";
  subject: string;
  value: UserAnswer;
  onChange: (a: UserAnswer) => void;
  disabled?: boolean;
};

export type TaskCardProps = SingleModeProps | VariantModeProps;

/* ---------- getInitialAnswer ---------- */
export function getInitialAnswer(answerType: string = "single"): UserAnswer {
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

/* ---------- formatAnswer (для SolutionBlock) ---------- */
export { formatAnswer };
