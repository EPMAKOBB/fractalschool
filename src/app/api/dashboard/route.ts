// src/app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"; // ВАЖНО: именно эта функция!
import { getUserAccess } from "@/lib/getUserAccess";
import { DashboardData } from "@/types/dashboard";

export async function GET() {
  const supabase = createServerComponentClient({ cookies }); // Исправлено
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /** Гость → отдаём минимальный JSON */
  if (!user) {
    const guest: DashboardData = {
      role: "guest",
      expiresAt: null,
      subjects: [],
      focusTopics: [],
    };
    return NextResponse.json(guest);
  }

  /** Данные доступа + активные предметы */
  const access = await getUserAccess(user.id);

  /** Статистика по предметам */
  const { data: stats } = await supabase.rpc("dashboard_stats", {
    p_user_id: user.id,
  });

  const resp: DashboardData = {
    role: access.role,
    expiresAt: access.expiresAt,
    subjects: stats?.subjects ?? [],
    focusTopics: stats?.focus_topics ?? [],
  };

  return NextResponse.json(resp);
}
