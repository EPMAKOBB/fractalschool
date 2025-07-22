// src/app/config/taskAnswerTypes.ts

export const answerTypesMap = {
  "inf-ege": {
    17: "pair",
    18: "pair",
    20: "pair",
    25: "table_10x2",
    26: "pair_partial",            
    27: "table_2x2",
    // остальные — по умолчанию single
  },

} as const;

export type AnswerType =
  | "single"
  | "pair"
  | "table_10x2"
  | "pair_partial"
  | "table_2x2";