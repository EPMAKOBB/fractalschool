// src/app/components/TaskCard/utils/helpers.ts

/* Тип для пользовательского ответа */
export type UserAnswer =
  | string
  | [string, string]
  | string[][];

/* Возвращает начальное значение ответа для разных типов */
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
