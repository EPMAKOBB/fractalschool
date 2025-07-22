// src/utils/checkAnswer.ts

// Строгий тип для типов ответов
export type AnswerType =
  | "single"
  | "pair"
  | "pair_partial"
  | "table_10x2"
  | "table_2x2";

// Тип результата проверки
export type CheckResult = {
  status: "correct" | "partial" | "wrong";
  score: number;
  maxScore: number;
};

// Тип параметров для функции проверки
export type CheckAnswerParams = {
  answerType: AnswerType;
  userAnswer: any;
  correctAnswer: any;
  maxScore: number;
};

export function checkAnswer({
  answerType,
  userAnswer,
  correctAnswer,
  maxScore
}: CheckAnswerParams): CheckResult {
  switch (answerType) {
    case "single":
      if (
        typeof correctAnswer === "number" &&
        Number(userAnswer) === correctAnswer
      )
        return { status: "correct", score: maxScore, maxScore };
      if (
        typeof correctAnswer === "string" &&
        String(userAnswer).trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      )
        return { status: "correct", score: maxScore, maxScore };
      return { status: "wrong", score: 0, maxScore };

    case "pair":
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === 2 &&
        correctAnswer.length === 2 &&
        String(userAnswer[0]).trim().toLowerCase() === String(correctAnswer[0]).trim().toLowerCase() &&
        String(userAnswer[1]).trim().toLowerCase() === String(correctAnswer[1]).trim().toLowerCase()
      )
        return { status: "correct", score: maxScore, maxScore };
      return { status: "wrong", score: 0, maxScore };

    case "pair_partial":
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === 2 &&
        correctAnswer.length === 2
      ) {
        let correctCount = 0;
        for (let i = 0; i < 2; i++) {
          if (
            String(userAnswer[i]).trim().toLowerCase() ===
            String(correctAnswer[i]).trim().toLowerCase()
          ) {
            correctCount++;
          }
        }
        if (correctCount === 2)
          return { status: "correct", score: maxScore, maxScore };
        if (correctCount === 1)
          return { status: "partial", score: Math.floor(maxScore / 2), maxScore };
        return { status: "wrong", score: 0, maxScore };
      }
      return { status: "wrong", score: 0, maxScore };

    case "table_10x2":
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === 10 &&
        correctAnswer.length === 10
      ) {
        let correctCount = 0;
        for (let i = 0; i < 10; i++) {
          if (
            Array.isArray(userAnswer[i]) &&
            Array.isArray(correctAnswer[i]) &&
            String(userAnswer[i][0]).trim().toLowerCase() === String(correctAnswer[i][0]).trim().toLowerCase() &&
            String(userAnswer[i][1]).trim().toLowerCase() === String(correctAnswer[i][1]).trim().toLowerCase()
          ) {
            correctCount++;
          }
        }
        if (correctCount === 10)
          return { status: "correct", score: maxScore, maxScore };
        if (correctCount > 0)
          return { status: "partial", score: Math.round((correctCount / 10) * maxScore), maxScore };
        return { status: "wrong", score: 0, maxScore };
      }
      return { status: "wrong", score: 0, maxScore };

    case "table_2x2":
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === 2 &&
        correctAnswer.length === 2
      ) {
        let correctCount = 0;
        for (let i = 0; i < 2; i++) {
          if (
            Array.isArray(userAnswer[i]) &&
            Array.isArray(correctAnswer[i]) &&
            String(userAnswer[i][0]).trim().toLowerCase() === String(correctAnswer[i][0]).trim().toLowerCase() &&
            String(userAnswer[i][1]).trim().toLowerCase() === String(correctAnswer[i][1]).trim().toLowerCase()
          ) {
            correctCount++;
          }
        }
        if (correctCount === 2)
          return { status: "correct", score: maxScore, maxScore };
        if (correctCount === 1)
          return { status: "partial", score: Math.floor(maxScore / 2), maxScore };
        return { status: "wrong", score: 0, maxScore };
      }
      return { status: "wrong", score: 0, maxScore };

    default:
      return { status: "wrong", score: 0, maxScore };
  }
}
