// src/server/db/tasks.ts

import { createClient } from "@/utils/supabase/server";

/**
 * Список всех используемых полей задачи.
 * Добавляй сюда новые поля по мере необходимости.
 */
export const TASK_FIELDS = `
  id,
  subject_id,
  answer_json,
  scoring_schema,
  max_score,
  status,
  difficulty,
  type_num,
  subtype_text,
  skill_ids,
  created_at,
  task_num_text,
  notes_text,
  source,
  body_mdx,
  solution_mdx,
  tables_data,
  svg_data,
  img_urls
`;

/**
 * Универсальная функция для выборки задач.
 * @param args фильтры (subjectId, typeNum, ids, status)
 * @returns массив задач
 */
export async function fetchTasks(args: {
  subjectId?: string;
  typeNum?: number;
  ids?: (string | number)[];
  taskNumText?: string[];
  status?: string;
  limit?: number;
  table?: "tasks_static" | "tasks_generated"; // имя таблицы (по умолчанию "tasks_static")
}) {
  const supabase = await createClient();
  const {
    subjectId,
    typeNum,
    ids,
    taskNumText,
    status = "published",
    limit,
    table = "tasks_static",
  } = args;

  let query = supabase
    .from(table)
    .select(TASK_FIELDS);

  if (subjectId) query = query.eq("subject_id", subjectId);
  if (typeNum) query = query.eq("type_num", typeNum);
  if (ids && ids.length) query = query.in("id", ids);
  if (taskNumText && taskNumText.length)
    query = query.in("task_num_text", taskNumText);
  if (status) query = query.eq("status", status);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw new Error("fetchTasks error: " + error.message);

  return data || [];
}
