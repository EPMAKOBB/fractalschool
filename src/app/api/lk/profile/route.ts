// src/app/api/lk/profile/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET  /api/lk/profile — возвращает публичный профиль пользователя
 * POST /api/lk/profile — обновляет профиль (name, nickname, bio, avatar_url)
 */
export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError)
    return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!user)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = user.id;
  let { data: profile } = await supabase
    .schema("app")
    .from("user_profiles")
    .select("user_id, name, nickname, avatar_url, bio, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  // Если нет профиля — создать его (можно убрать, если есть триггер)
  if (!profile) {
    await supabase
      .schema("app")
      .from("user_profiles")
      .insert({
        user_id: userId,
        name: null,
        nickname: null,
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
      });
    // Повторно получить профиль
    profile = (
      await supabase
        .schema("app")
        .from("user_profiles")
        .select("user_id, name, nickname, avatar_url, bio, created_at")
        .eq("user_id", userId)
        .maybeSingle()
    ).data;
  }

  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError)
    return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!user)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = user.id;
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный формат данных" },
      { status: 400 }
    );
  }

  let { name, nickname, avatar_url, bio } = body ?? {};

  // Никнейм: только латиница, цифры, подчёркивание, длина 3–32, lower case
  if (nickname) {
    nickname = nickname.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(nickname)) {
      return NextResponse.json(
        {
          error:
            "Никнейм может содержать только латинские буквы, цифры и нижнее подчёркивание, 3–32 символа.",
        },
        { status: 400 }
      );
    }
  } else {
    nickname = null;
  }

  // Обновляем/создаём профиль (upsert)
  const { error } = await supabase
    .schema("app")
    .from("user_profiles")
    .upsert({
      user_id: userId,
      name,
      nickname,
      avatar_url,
      bio,
    });

  // Проверка ошибки уникальности nickname (Postgres code 23505)
  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "Этот никнейм уже занят." },
      { status: 409 }
    );
  }

  if (error) {
    console.error("profile upsert", error);
    return NextResponse.json(
      { error: "profile_update_failed" },
      { status: 500 }
    );
  }

  // Возвращаем обновлённый профиль
  const { data: profile } = await supabase
    .schema("app")
    .from("user_profiles")
    .select("user_id, name, nickname, avatar_url, bio, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json({ profile });
}
