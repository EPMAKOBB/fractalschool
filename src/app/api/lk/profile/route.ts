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
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  if (sessErr) return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = session.user.id;
  const { data: profile, error } = await supabase
    .schema("app") // user_profiles находится в схеме app
    .from("user_profiles")
    .select("user_id, name, nickname, avatar_url, bio, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("user_profiles", error);
    return NextResponse.json({ error: "profile_failed" }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();

  if (sessErr) return NextResponse.json({ error: "session_failed" }, { status: 500 });
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userId = session.user.id;
  const body = await req.json();
  const { name, nickname, avatar_url, bio } = body ?? {};

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

  if (error) {
    console.error("profile upsert", error);
    return NextResponse.json({ error: "profile_update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}