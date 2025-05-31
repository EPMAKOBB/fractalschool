// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        // email может быть undefined, поэтому даём fallback
        setUserEmail(session.user.email ?? "");
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // Пока статус ещё не определён
  if (userEmail === undefined) {
    return <p className="p-6">Загрузка…</p>;
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Добро пожаловать,</h1>
      <p className="mb-6">
        Вы вошли как <strong>{userEmail || "(no email)"}</strong>
      </p>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Выйти
      </button>
    </main>
  );
}
