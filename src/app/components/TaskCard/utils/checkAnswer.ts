// src/app/components/TaskCard/utils/checkAnswer.ts
//--------------------------------------------------
// Унифицированная проверка ответов разных типов
//--------------------------------------------------
import type { UserAnswer } from "./helpers";

type CheckArgs = {
  answerType: string;
  correctAnswer: any;
  userAnswer: UserAnswer;
  maxScore?: number;
};

export type CheckResult = {
  score: number;
  maxScore: number;
};

/**
 * Очень упрощённая проверка.
 * Для реального ЕГЭ-контента замените
 *   сравнение строк/массивов на более строгие правила.
 */
export function checkAnswer({
  answerType,
  correctAnswer,
  userAnswer,
  maxScore = 1,
}: CheckArgs): CheckResult {
  let score = 0;

  switch (answerType) {
    /* ---------------- single: строка ---------------- */
    case "single": {
      score = normalize(correctAnswer) === normalize(userAnswer) ? maxScore : 0;
      break;
    }

    /* ---------------- пары ---------------- */
    case "pair": {
      const ok =
        Array.isArray(userAnswer) &&
        userAnswer.length === 2 &&
        Array.isArray(correctAnswer) &&
        correctAnswer.length === 2 &&
        normalize(userAnswer[0]) === normalize(correctAnswer[0]) &&
        normalize(userAnswer[1]) === normalize(correctAnswer[1]);
      score = ok ? maxScore : 0;
      break;
    }
    case "pair_partial": {
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === 2 &&
        correctAnswer.length === 2
      ) {
        let part = 0;
        if (normalize(userAnswer[0]) === normalize(correctAnswer[0])) part += 0.5;
        if (normalize(userAnswer[1]) === normalize(correctAnswer[1])) part += 0.5;
        score = Math.round(part * maxScore); // 0, 0.5, 1 → 0,1 (если maxScore=1) или 0,2 (если 2)
      }
      break;
    }

    /* ---------------- таблицы 2×2 и 10×2 ---------------- */
    case "table_2x2":
    case "table_10x2": {
      const rows = answerType === "table_2x2" ? 2 : 10;
      const cols = 2;
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === rows &&
        correctAnswer.length === rows
      ) {
        let correctCells = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (
              normalize(userAnswer[r][c]) ===
              normalize(correctAnswer[r][c])
            ) {
              correctCells++;
            }
          }
        }
        score = Math.round((correctCells / (rows * cols)) * maxScore);
      }
      break;
    }

    /* ---------------- по умолчанию ---------------- */
    default: {
      // fallback: простое сравнение строк
      score = normalize(correctAnswer) === normalize(userAnswer) ? maxScore : 0;
    }
  }

  return { score, maxScore };
}

/* ---------- helper: нормализуем строки ---------- */
function normalize(val: any): string {
  if (val === null || val === undefined) return "";
  return String(val).trim().replace(/\s+/g, " ").toLowerCase();
}
