// src/app/api/attempts/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // 1) Разбираем тело запроса
  const { variantId, answer } = await request.json();

  // 2) Получаем правильный ответ из таблицы variants
  const { data: variant, error: varErr } = await supabase
    .from("variants")
    .select("solution")
    .eq("id", variantId)
    .single();

  if (varErr || !variant) {
    return NextResponse.json(
      { error: varErr?.message || "Variant not found" },
      { status: 404 },
    );
  }

  const correctAnswer = variant.solution.answer;
  const isCorrect =
    answer?.toString().trim() === correctAnswer?.toString().trim();

  // 3) Сохраняем попытку в таблицу attempts
  const { data: attempt, error: insertErr } = await supabase
    .from("attempts")
    .insert([
      {
        variant_id: variantId,
        user_id: session.user.id,
        answer: answer.toString(),
        is_correct: isCorrect,
      },
    ])
    .select("*")
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // 4) Отдаём клиенту результат
  return NextResponse.json({
    is_correct: isCorrect,
    correct_answer: correctAnswer,
    attempt,
  });
}
