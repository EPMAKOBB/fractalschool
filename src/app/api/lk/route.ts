// // src/app/api/lk/route.ts

// import { NextResponse, type NextRequest } from "next/server";
// import { createClient } from "@/utils/supabase/server"; // Используем новый SSR-клиент!
// import type { Database } from "@/types/db";

// export const dynamic = "force-dynamic";

// /* ─────────── Локальные типы ─────────── */
// type Role = "guest" | "subscriber" | "course";

// /* ───────────────────────── GET ───────────────────────── */
// export async function GET(_req: NextRequest) {
//   // 1. Создаём Supabase SSR-клиент
//   const supabase = await createClient();

//   // 2. Получаем сессию пользователя
//   const {
//     data: { session },
//     error: sessionErr,
//   } = await supabase.auth.getSession();

//   if (sessionErr) {
//     console.error("Session error:", sessionErr);
//     return NextResponse.json({ error: "session_failed" }, { status: 500 });
//   }
//   if (!session) {
//     return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
//   }
//   const userId = session.user.id;

//   // 3. Роль пользователя
//   const { data: roleRow, error: roleErr } = await supabase
//     .schema("app")
//     .from("user_roles_view")
//     .select("role_slug, granted_at")
//     .eq("user_id", userId)
//     .order("granted_at", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   if (roleErr) console.error("Role view error:", roleErr);
//   const role: Role = (roleRow?.role_slug as Role) ?? "guest";

//   // 4. Активная подписка (billing)
//   const { data: subRow, error: subErr } = await supabase
//     .schema("billing")
//     .from("subscriptions")
//     .select("current_period_end")
//     .eq("user_id", userId)
//     .eq("status", "active")
//     .order("current_period_end", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   if (subErr) console.error("Subscription error:", subErr);
//   const expiresAt: string | null = subRow?.current_period_end ?? null;

//   // 5. Прогресс по предметам
//   const { data: progRows, error: progErr } = await supabase
//     .schema("learner")
//     .from("user_subject_progress")
//     .select("subject_id, progress, last_activity")
//     .eq("user_id", userId);

//   if (progErr) console.error("Subject progress error:", progErr);

//   let subjects: {
//     id: string;
//     name: string;
//     slug: string;
//     progress: number | null;
//     lastActivity: string | null;
//   }[] = [];

//   if (progRows?.length) {
//     const ids = progRows.map((r) => r.subject_id);

//     const { data: metaRows, error: metaErr } = await supabase
//       .from("subjects")
//       .select("id, title, slug")
//       .in("id", ids);

//     if (metaErr) console.error("Subjects meta error:", metaErr);

//     subjects = progRows.map((p) => {
//       const meta = metaRows?.find((m) => m.id === p.subject_id);
//       return {
//         id: p.subject_id,
//         name: meta?.title ?? "Предмет",
//         slug: meta?.slug ?? "",
//         progress: p.progress ?? 0,
//         lastActivity: p.last_activity,
//       };
//     });
//   }

//   // 6. Типы с самой низкой точностью (темы, требующие внимания)
//   const { data: weakRows, error: weakErr } = await supabase
//     .schema("learner")
//     .from("user_type_progress")
//     .select("subject_id, type_num, accuracy")
//     .eq("user_id", userId)
//     .order("accuracy", { ascending: true })
//     .limit(6);

//   if (weakErr) console.error("Focus topics error:", weakErr);

//   const focusTopics =
//     weakRows?.map((w) => ({
//       id: `${w.subject_id}-${w.type_num}`,
//       name: `Тип ${w.type_num}`,
//       score: Math.round((w.accuracy ?? 0) * 100),
//     })) ?? [];

//   // 7. Возвращаем данные
//   return NextResponse.json({
//     role,
//     expiresAt,
//     subjects,
//     focusTopics,
//   });
// }
