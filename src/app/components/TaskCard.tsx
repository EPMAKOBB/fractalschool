// src/app/components/TaskCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { checkAnswer, CheckResult } from "@/utils/checkAnswer";
import clsx from "clsx";
import ClientTaskStatement from "./ClientTaskStatement";

/* ---------- Типы ---------- */
type UserAnswer = string | string[] | string[][];

type Task = {
  id: number | string;
  task_id: string | number;
  task_type?: string | number;
  statement: string;
  answer: any;
  solution: string;
  answer_type?: string;
  maxScore?: number;
};

type SingleModeProps = {
  task: Task;
  mode: "single";
  subject: string;
};

type VariantModeProps = {
  task: Task;
  mode: "variant";
  value: UserAnswer;
  onChange: (answer: UserAnswer) => void;
  disabled?: boolean;
  subject: string;
};

type TaskCardProps = SingleModeProps | VariantModeProps;

/* ---------- Вспомогательные функции ---------- */
function getInitialAnswer(answerType?: string): UserAnswer {
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

function formatAnswer(answer: any) {
  if (Array.isArray(answer)) {
    if (Array.isArray(answer[0])) {
      return (
        <table className="border border-gray-500 rounded my-2">
          <tbody>
            {answer.map((row: any[], i: number) => (
              <tr key={i}>
                {row.map((cell: any, j: number) => (
                  <td key={j} className="px-2 py-1 border border-gray-400">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return answer.join(", ");
  }
  return String(answer);
}

/* ---------- Компонент ---------- */
export default function TaskCard(props: TaskCardProps) {
  const { task, subject } = props;
  const answerType = task.answer_type || "single";

  /* ===== SINGLE MODE STATE ===== */
  const [userAnswer, setUserAnswer] = useState<UserAnswer>(
    props.mode === "single" ? getInitialAnswer(answerType) : ""
  );
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  /* ===== Общий рендер ввода ===== */
  function renderInput(
    answer: UserAnswer,
    onChange: (val: string, row?: number, col?: number) => void,
    disabled?: boolean
  ) {
    switch (answerType) {
      case "single":
        return (
          <input
            className="border rounded px-2 py-1 w-full"
            value={answer as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ваш ответ"
            disabled={disabled}
          />
        );

      case "pair":
      case "pair_partial":
        return (
          <div className="flex gap-2">
            {[0, 1].map((idx) => (
              <input
                key={idx}
                className="border rounded px-2 py-1"
                value={(answer as string[])[idx]}
                onChange={(e) => onChange(e.target.value, idx)}
                placeholder={`Ответ ${idx + 1}`}
                disabled={disabled}
              />
            ))}
          </div>
        );

      case "table_2x2":
      case "table_10x2": {
        const rows = answerType === "table_2x2" ? 2 : 10;
        const cols = 2;

        return (
          <table className="border border-gray-500 rounded mb-2">
            <tbody>
              {Array.from({ length: rows }).map((_, row) => (
                <tr key={row}>
                  {answerType === "table_10x2" && (
                    <td className="pr-1 text-xs text-gray-400">{row + 1}</td>
                  )}
                  {Array.from({ length: cols }).map((__, col) => (
                    <td key={col} className="p-1">
                      <input
                        className="border rounded px-2 py-1 w-16"
                        value={(answer as string[][])[row][col]}
                        onChange={(e) => onChange(e.target.value, row, col)}
                        placeholder={`[${row + 1},${col + 1}]`}
                        disabled={disabled}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      default:
        return (
          <input
            className="border rounded px-2 py-1 w-full"
            value={answer as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ваш ответ"
            disabled={disabled}
          />
        );
    }
  }

  /* ===== SINGLE MODE HANDLERS ===== */
  function onChangeAnswerSingle(val: string, row?: number, col?: number) {
    setUserAnswer((prev) => {
      let next: UserAnswer = prev;

      if (answerType === "single") {
        next = val;
      } else if (answerType === "pair" || answerType === "pair_partial") {
        const arr = Array.isArray(prev) ? [...(prev as string[])] : ["", ""];
        arr[row!] = val;
        next = arr;
      } else if (answerType === "table_2x2" || answerType === "table_10x2") {
        const arr = Array.isArray(prev)
          ? (prev as string[][]).map((r) => [...r])
          : (getInitialAnswer(answerType) as string[][]);
        arr[row!][col!] = val;
        next = arr;
      }

      return next;
    });
    setResult(null);
  }

  function handleCheckSingle() {
    const checkRes = checkAnswer({
      answerType,
      correctAnswer: task.answer,
      userAnswer,
    });
    setResult(checkRes);
  }

  /* ---------- Заголовок ---------- */
  function renderHeader() {
    return (
      <div className="mb-2 font-semibold flex items-center gap-2 flex-wrap">
        <span>Задача №</span>
        <Link
          href={`/${subject}/task/${task.task_id}`}
          className="text-blue-400 underline hover:text-blue-600"
        >
          {task.task_id}
        </Link>
        <span>,</span>
        <Link
          href={`/${subject}/type/${task.task_type ?? ""}`}
          className="text-blue-400 underline hover:text-blue-600"
        >
          тип {task.task_type}
        </Link>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* ---------------------------- RENDER ------------------------------- */
  /* ------------------------------------------------------------------ */

  /* ---------- SINGLE MODE ---------- */
  if (props.mode === "single") {
    return (
      <div className="border rounded-lg bg-gray-800 p-4 mb-4">
        {renderHeader()}

        {/* Условие задачи */}
        <ClientTaskStatement html={task.statement} />

        {/* Ввод и кнопка проверки */}
        <div className="flex flex-col gap-2 mb-2">
          {renderInput(userAnswer, onChangeAnswerSingle)}
          <button
            className={clsx(
              "px-3 py-1 rounded text-white mt-2 w-fit",
              "bg-blue-700 hover:bg-blue-800"
            )}
            onClick={handleCheckSingle}
          >
            Проверить ответ
          </button>

          {result && (
            <span
              className={clsx(
                result.score === result.maxScore
                  ? "text-green-400"
                  : result.score > 0
                  ? "text-yellow-300"
                  : "text-red-400"
              )}
            >
              {result.score === result.maxScore
                ? `Верно! (${result.score} балл${result.maxScore > 1 ? "а" : ""})`
                : result.score > 0
                ? `Частично верно (${result.score} из ${result.maxScore})`
                : "Неверно, 0 баллов"}
            </span>
          )}
        </div>

        {/* Решение / ответ */}
        <button
          className="text-blue-400 underline text-sm"
          onClick={() => setShowSolution((s) => !s)}
        >
          {showSolution ? "Скрыть решение и ответ" : "Показать решение и ответ"}
        </button>

        {showSolution && (
          <div className="mt-3 bg-gray-900 rounded p-3 text-sm">
            <div>
              <b>Ответ:</b> {formatAnswer(task.answer)}
            </div>
            <div className="mt-2">
              <b>Решение:</b>
              <div className="whitespace-pre-line">{task.solution}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- VARIANT MODE ---------- */
  if (props.mode === "variant") {
    const { value, onChange, disabled } = props;

    function onChangeAnswerVariant(val: string, row?: number, col?: number) {
      let next: UserAnswer;

      if (answerType === "single") {
        next = val;
      } else if (answerType === "pair" || answerType === "pair_partial") {
        const arr = Array.isArray(value) ? [...(value as string[])] : ["", ""];
        arr[row!] = val;
        next = arr;
      } else if (answerType === "table_2x2" || answerType === "table_10x2") {
        const arr = Array.isArray(value)
          ? (value as string[][]).map((r) => [...r])
          : (getInitialAnswer(answerType) as string[][]);
        arr[row!][col!] = val;
        next = arr;
      } else {
        next = val;
      }

      onChange(next);
    }

    return (
      <div
        className={clsx(
          "border rounded-lg bg-gray-800 p-4 mb-4",
          disabled && "opacity-60 pointer-events-none"
        )}
      >
        {renderHeader()}
        <ClientTaskStatement html={task.statement} />
        <div className="flex flex-col gap-2 mb-2">
          {renderInput(value, onChangeAnswerVariant, disabled)}
        </div>
      </div>
    );
  }

  return null;
}
