// src/app/components/TaskCard/TaskInput.tsx

"use client";

import { useState } from "react";
import AnswerFields from "@/app/components/AnswerFields";
import { Button } from "@/components/ui/button";
import { checkAnswer } from "@/utils/checkAnswer";
import type { AnswerType } from "@/utils/checkAnswer";

export interface TaskInputProps {
  type_num: number;
  subject: string;
  answer_json: any;
  value: any;
  onChange: (val: any) => void;
  disabled?: boolean; // теперь управление блокировкой только этим пропсом
}

export default function TaskInput(props: TaskInputProps) {
  const { type_num, subject, answer_json, value, onChange } = props;

  const [result, setResult] = useState<{ status: string; score: number } | null>(null);

  // Определяем тип ответа и максимальный балл
  let answerType: AnswerType = "single";
  let maxScore = 1;

  if (subject === "inf-ege") {
    switch (type_num) {
      case 17:
      case 18:
      case 20:
        answerType = "pair";
        maxScore = 2;
        break;
      case 25:
        answerType = "table_10x2";
        maxScore = 4;
        break;
      case 26:
        answerType = "pair_partial";
        maxScore = 2;
        break;
      case 27:
        answerType = "table_2x2";
        maxScore = 2;
        break;
      default:
        answerType = "single";
        maxScore = 1;
    }
  }

  // Обработчик проверки ответа
  const handleCheck = () => {
    const check = checkAnswer({
      answerType,
      userAnswer: value,
      correctAnswer: answer_json,
      maxScore
    });
    setResult(check);
  };

  return (
    <div>
      <AnswerFields
        answerType={answerType}
        value={value}
        onChange={onChange}
        // disabled убран!
      />

      <Button
        className="mt-2 cursor-pointer"
        onClick={handleCheck}
        // disabled убран!
      >
        Проверить
      </Button>

      {result && (
        <div className="mt-2 text-sm">
          {result.status === "correct" && (
            <span className="text-green-600">Верно! Баллов: {result.score}</span>
          )}
          {result.status === "partial" && (
            <span className="text-yellow-600">Частично верно, баллов: {result.score}</span>
          )}
          {result.status === "wrong" && (
            <span className="text-red-500">Неверно. Баллов: 0</span>
          )}
        </div>
      )}
    </div>
  );
}