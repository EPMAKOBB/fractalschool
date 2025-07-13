"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Variant {
  id: string;
  params: Record<string, any>;
  statement: string;
  solution_text: string;
}

export default function VariantPage() {
  const { templateId } = useParams();

  // Состояния генерации и отправки
  const [variant, setVariant] = useState<Variant | null>(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния ответа и результата
  const [userAnswer, setUserAnswer] = useState("");
  const [submissionResult, setSubmissionResult] = useState<{ is_correct: boolean; correct_answer: any } | null>(null);

  // Состояния авторизации
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Проверяем сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
  }, []);

  const generate = async () => {
    setLoadingGenerate(true);
    setError(null);
    setVariant(null);
    setSubmissionResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setVariant(data as Variant);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleSubmit = async () => {
    if (!variant || !session) return;
    setLoadingSubmit(true);
    setError(null);
    setSubmissionResult(null);

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: variant.id, answer: userAnswer, userId: session.user.id }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ошибка при отправке ответа");
      setSubmissionResult({ is_correct: result.is_correct, correct_answer: result.correct_answer });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      {/* Авторизация */}
      {!authLoading && !session && (
        <p className="text-red-600">
          Генерация вариантов доступна только авторизованным пользователям
        </p>
      )}
      {authLoading && <p>Проверяем авторизацию…</p>}

      {/* Кнопка генерации */}
      <button
        onClick={generate}
        disabled={loadingGenerate || !session}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loadingGenerate ? "Генерируем…" : "Сгенерировать вариант"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {variant && (
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Условие</h2>
            <p>{variant.statement}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <textarea
              rows={3}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Ваш ответ"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSubmit}
              disabled={loadingSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingSubmit ? "Отправляем…" : "Отправить ответ"}
            </button>
          </div>

          {submissionResult && (
            <p
              className={
                submissionResult.is_correct
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {submissionResult.is_correct
                ? "Верно!"
                : `Неверно, правильный ответ: ${submissionResult.correct_answer}`}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
