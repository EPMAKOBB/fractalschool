// src/types/answer.ts
export type UserAnswer =
  | string         // одиночный ответ
  | [string, string] // пара
  | string[]       // массив строк (для массива или свободных N ответов)
  | string[][]     // для таблиц
  | null;          // пустое состояние
