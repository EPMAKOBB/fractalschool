// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  const { templateId } = await request.json();

  // Проверяем, что шаблон существует
  const { data: meta, error: metaErr } = await supabase
    .from("tasks_meta")
    .select("id, template_name")
    .eq("id", templateId)
    .single();

  if (metaErr || !meta) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Генерируем примерный вариант
  const x = Math.floor(Math.random() * 10) + 1;
  const statement = `Вычислите 2 × ${x}`;
  const solution = { answer: 2 * x };
  const solution_text = `2 умножить на ${x} равно ${2 * x}.`;

  // Сохраняем в базу
  const { data: variant, error: insertErr } = await supabase
    .from("variants")
    .insert([
      {
        task_meta_id: templateId,
        params: { x },
        statement,
        solution,
        solution_text,
      },
    ])
    .select("*")
    .single();

  if (insertErr || !variant) {
    return NextResponse.json({ error: insertErr?.message }, { status: 500 });
  }

  // Возвращаем созданный вариант
  return NextResponse.json(variant);
}
