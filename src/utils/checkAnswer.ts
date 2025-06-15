// src/utils/checkAnswer.ts

export type CheckResult = {
  isCorrect: boolean;    // Полностью верно
  score: number;         // Сколько баллов набрано за задачу
  maxScore: number;      // Максимально возможный балл (по умолчанию 1 или 2)
  details?: any;         // Для подробной информации (опционально)
};

type CheckAnswerParams = {
  answerType: string;     // single, pair, table_2x2, ...
  correctAnswer: any;     // Правильный ответ (json/строка/массив)
  userAnswer: any;        // Введённый пользователем ответ
  maxScore?: number;      // ← В будущем можно передавать!
};

/**
 * Универсальная проверка ответов.
 * Баллы можно задавать явно через maxScore (например, task.maxScore)
 */
export function checkAnswer({ answerType, correctAnswer, userAnswer, maxScore }: CheckAnswerParams): CheckResult {
  switch (answerType) {
    case "single": {
      const ok = String(correctAnswer).trim() === String(userAnswer).trim();
      const max = maxScore ?? 1;
      return { isCorrect: ok, score: ok ? max : 0, maxScore: max };
    }

    case "pair": {
      if (!Array.isArray(userAnswer) || userAnswer.length !== 2) {
        return { isCorrect: false, score: 0, maxScore: maxScore ?? 1 };
      }
      const ok =
        String(correctAnswer[0]).trim() === String(userAnswer[0]).trim() &&
        String(correctAnswer[1]).trim() === String(userAnswer[1]).trim();
      const max = maxScore ?? 1;
      return { isCorrect: ok, score: ok ? max : 0, maxScore: max };
    }

    case "pair_partial": {
      if (!Array.isArray(userAnswer) || userAnswer.length !== 2) {
        return { isCorrect: false, score: 0, maxScore: maxScore ?? 2 };
      }
      let partial = 0;
      if (String(correctAnswer[0]).trim() === String(userAnswer[0]).trim()) partial++;
      if (String(correctAnswer[1]).trim() === String(userAnswer[1]).trim()) partial++;
      const max = maxScore ?? 2;
      // Рекомендуется делать maxScore = 2, но если maxScore будет 4 — баллы будут частичные
      return { isCorrect: partial === max, score: partial, maxScore: max };
    }

    case "table_2x2": {
      if (
        !Array.isArray(userAnswer) || userAnswer.length !== 2 ||
        !Array.isArray(userAnswer[0]) || userAnswer[0].length !== 2 ||
        !Array.isArray(userAnswer[1]) || userAnswer[1].length !== 2
      ) {
        return { isCorrect: false, score: 0, maxScore: maxScore ?? 2 };
      }

      let matched = 0;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          if (
            String(userAnswer[row][col]).trim() === String(correctAnswer[row][col]).trim()
          ) {
            matched++;
          }
        }
      }

      const max = maxScore ?? 2;
      let score = 0;
      if (matched === 4) score = max;
      else if (matched === 2 || matched === 3) score = Math.round(max / 2);
      // 0 — если менее двух совпадений

      return { isCorrect: score === max, score, maxScore: max };
    }

    case "table_10x2": {
      // Здесь maxScore = длина correctAnswer, либо maxScore
      if (!Array.isArray(userAnswer) || userAnswer.length !== 10) {
        return { isCorrect: false, score: 0, maxScore: maxScore ?? (correctAnswer?.length ?? 0) };
      }
      let correctCount = 0;
      for (let i = 0; i < 10; i++) {
        const correct = correctAnswer[i];
        const user = userAnswer[i];
        if (!correct && (!user || (!user[0] && !user[1]))) {
          continue;
        }
        if (
          correct &&
          user &&
          String(user[0]).trim() === String(correct[0]).trim() &&
          String(user[1]).trim() === String(correct[1]).trim()
        ) {
          correctCount++;
        }
      }
      const max = maxScore ?? (correctAnswer?.length ?? 0);
      const isFull =
        correctCount === (correctAnswer?.length ?? 0) &&
        userAnswer.filter((r: any) => r && (r[0] || r[1])).length === (correctAnswer?.length ?? 0);

      return { isCorrect: isFull, score: isFull ? max : 0, maxScore: max };
    }

    // В будущем можно добавить кейсы "multi", "formula", и т.д.

    default:
      return { isCorrect: false, score: 0, maxScore: maxScore ?? 1 };
  }
}
