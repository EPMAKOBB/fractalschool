// src/lib/getUserAccess.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/db"; // сгенерируйте через Supabase CLI
import { UserRole } from "@/types/dashboard";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getUserAccess(userId: string) {
  /** 1) Читаем последнюю актуальную оплату */
  const { data: payment } = await supabase
    .from("payments")
    .select("plan, expires_at")
    .eq("user_id", userId)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let role: UserRole = "guest";
  if (payment?.plan === "sub_monthly" && payment.expires_at > new Date().toISOString())
    role = "subscriber";
  if (payment?.plan?.startsWith("course") && payment.expires_at > new Date().toISOString())
    role = "course";

  /** 2) Предметы, которые показываем в кабинете */
  const { data: subjects } = await supabase
    .from("user_subjects")
    .select("subject_id")
    .eq("user_id", userId)
    .eq("is_active", true);

  return {
    role,
    expiresAt: payment?.expires_at ?? null,
    activeSubjects: subjects?.map((s) => s.subject_id) ?? [],
  };
}
