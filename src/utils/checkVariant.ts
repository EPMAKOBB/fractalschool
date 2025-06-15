// src/utils/checkVariant.ts

import { checkAnswer, CheckResult } from "./checkAnswer";

// Тип одной задачи (можешь расширить, если у тебя есть дополнительные поля)
export type VariantTask = {
  id: number | string;
  answerType: string;
  correctAnswer: any;
  userAnswer: any;
  maxScore?: number;
};

// Тип возврата функции
export type VariantCheckSummary = {
  results: CheckResult[]; // массив по каждой задаче
  totalPrimary: number;   // сумма набранных первичных баллов
  totalMax: number;       // максимум за весь вариант
};

/**
 * Проверяет вариант: массив задач и массив ответов пользователя.
 * Возвращает массив результатов + суммы баллов.
 */
export function checkVariant(
  tasks: VariantTask[],
  userAnswers: any[] // массив ответов пользователя (в том же порядке, что задачи)
): VariantCheckSummary {
  const results: CheckResult[] = [];
  let totalPrimary = 0;
  let totalMax = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const userAnswer = userAnswers[i];
    // Запускаем проверку для каждой задачи
    const result = checkAnswer({
      answerType: task.answerType,
      correctAnswer: task.correctAnswer,
      userAnswer,
      maxScore: task.maxScore,
    });
    results.push(result);
    totalPrimary += result.score;
    totalMax += result.maxScore;
  }

  return { results, totalPrimary, totalMax };
}
