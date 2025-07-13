// src/lib/getUserAccess.ts

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/db"; // импортируй тип, сгенерированный из Supabase

/** Роли из БД (возможно расширить, если появятся новые) */
export type UserRoleSlug =
  | "student"
  | "admin"
  | "moderator"
  | "teacher"
  | "assistant"
  | "creator";

interface UserAccessResult {
  role: UserRoleSlug | "guest";
  activeSubjects: string[];
  expiresAt: string | null;
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserAccess(userId: string): Promise<UserAccessResult> {
  // Получаем самую "старшую" роль пользователя
  const { data: userRole } = await supabase
    .schema("app")
    .from("user_roles_view")
    .select("role_slug")
    .eq("user_id", userId)
    .order("granted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Получаем все предметы, по которым есть прогресс
  const { data: subjectRows } = await supabase
    .schema("learner")
    .from("user_subject_progress")
    .select("subject_id")
    .eq("user_id", userId);

  // Получаем дату окончания подписки (если есть)
  const { data: sub } = await supabase
    .schema("billing")
    .from("subscriptions")
    .select("current_period_end, status")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    role: (userRole?.role_slug as UserRoleSlug) || "guest",
    activeSubjects: subjectRows?.map((row) => row.subject_id) ?? [],
    expiresAt:
      sub?.status === "active" && sub?.current_period_end
        ? sub.current_period_end
        : null,
  };
}
