// src/app/config/tablesMeta.ts

export type ColumnMeta = {
  name: string;
  type: string;
  filterable?: boolean;
  editable?: boolean;
};

export type TableMeta = {
  name: string;
  dbName: string;
  label: string;
  category: "tasks" | "variants" | "meta";
  sourceForVariants?: string;
  columns: ColumnMeta[];
  taskTypesCount?: number;
};

export const tablesMeta: TableMeta[] = [
  // === ЗАДАЧИ ===
  {
    name: "inf-ege",
    dbName: "inf_ege",
    label: "ЕГЭ Информатика",
    category: "tasks",
    taskTypesCount: 27,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },
  {
    name: "mathp-ege",
    dbName: "mathp_ege",
    label: "ЕГЭ Математика (профиль)",
    category: "tasks",
    taskTypesCount: 19,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },
  {
    name: "math-oge",
    dbName: "math_oge",
    label: "ОГЭ Математика",
    category: "tasks",
    taskTypesCount: 25,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },
  {
    name: "phys-ege",
    dbName: "phys_ege",
    label: "ЕГЭ Физика",
    category: "tasks",
    taskTypesCount: 26,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },
  {
    name: "phys-oge",
    dbName: "phys_oge",
    label: "ОГЭ Физика",
    category: "tasks",
    taskTypesCount: 22,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },
  {
    name: "inf-oge",
    dbName: "inf_oge",
    label: "ОГЭ Информатика",
    category: "tasks",
    taskTypesCount: 16,
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "created_at", type: "timestamp", editable: false },
      { name: "task_id", type: "text" },
      { name: "task_type", type: "smallint", filterable: true },
      { name: "difficulty", type: "smallint", filterable: true },
      { name: "status", type: "text", filterable: true },
      { name: "statement", type: "text" },
      { name: "answer", type: "json" },
      { name: "solution", type: "text" },
      { name: "theme", type: "text", filterable: true },
    ],
  },

  // === ВАРИАНТЫ ===
  {
    name: "inf-ege-variants",
    dbName: "inf_ege_variants",
    label: "Варианты ЕГЭ Информатика",
    category: "variants",
    sourceForVariants: "inf-ege",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },
  {
    name: "mathp-ege-variants",
    dbName: "mathp-ege-variants",
    label: "Варианты ЕГЭ Математика (профиль)",
    category: "variants",
    sourceForVariants: "mathp-ege",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },
  {
    name: "math-oge-variants",
    dbName: "math_oge_variants",
    label: "Варианты ОГЭ Математика",
    category: "variants",
    sourceForVariants: "math-oge",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },
  {
    name: "phys-ege-variants",
    dbName: "phys_ege_variants",
    label: "Варианты ЕГЭ Физика",
    category: "variants",
    sourceForVariants: "phys-ege",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },
  {
    name: "phys-oge-variants",
    dbName: "phys_oge_variants",
    label: "Варианты ОГЭ Физика",
    category: "variants",
    sourceForVariants: "phys-oge",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },
  {
    name: "inf-oge-variants",
    dbName: "inf_oge_variants",
    label: "Варианты ОГЭ Информатика",
    category: "variants",
    sourceForVariants: "inf-oge",
    columns: [
      { name: "id", type: "uuid", editable: false },
      { name: "task_ids", type: "jsonb" },
      { name: "created_at", type: "timestamp" },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
    ],
  },

  // === META ===
  {
    name: "tasks-meta",
    dbName: "tasks_meta",
    label: "Шаблоны задач",
    category: "meta",
    columns: [
      { name: "id", type: "integer", editable: false },
      { name: "title", type: "text" },
      { name: "description", type: "text" },
      { name: "script", type: "text" },
      { name: "example_params", type: "jsonb" },
    ],
  },
];
