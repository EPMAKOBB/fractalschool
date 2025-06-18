// src/app/ege-inf/[type]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

type Task = {
  id: number;
  statement: string;
  solution: string;
  answer: any;
  difficulty?: number;
  created_at?: string;
};

export default function EgeInfTypePage() {
  const { type } = useParams<{ type: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [checkResult, setCheckResult] = useState<{ [key: number]: string }>({});
  const [sortBy, setSortBy] = useState<"date" | "difficulty">("date");
  const [filterDiff, setFilterDiff] = useState<number | null>(null);

  // Загрузка задач
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      let query = supabase
        .from("inf-ege")
        .select("*")
        .eq("task_type", Number(type.replace("type", "")));

      if (filterDiff) query = query.eq("difficulty", filterDiff);
      if (sortBy === "date") query = query.order("created_at", { ascending: false });
      if (sortBy === "difficulty") query = query.order("difficulty", { ascending: true });

      const { data, error } = await query;
      if (!error && data) setTasks(data as Task[]);
      setLoading(false);
    }
    fetchTasks();
  }, [type, sortBy, filterDiff]);

  function handleInput(taskId: number, value: string) {
    setUserAnswers((prev) => ({ ...prev, [taskId]: value }));
  }

  function handleCheck(task: Task) {
    // Простейшая проверка (ответ текст/число, массив — можно доработать)
    const correct = typeof task.answer === "string"
      ? task.answer.trim().toLowerCase()
      : JSON.stringify(task.answer);
    const user = userAnswers[task.id]?.trim().toLowerCase();
    setCheckResult((prev) => ({
      ...prev,
      [task.id]: user === correct ? "✅ Верно!" : "❌ Неверно",
    }));
  }

  function toggleSolution(taskId: number) {
    setExpanded((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Задания {type.replace('type', 'типа ')}</h1>
      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <label className="flex items-center gap-2">
          Сложность:
          <select
            className="border rounded px-2 py-1 bg-gray-900 text-white"
            value={filterDiff ?? ""}
            onChange={e => setFilterDiff(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Все</option>
            <option value={1}>Лёгкие</option>
            <option value={2}>Средние</option>
            <option value={3}>Сложные</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Сортировка:
          <select
            className="border rounded px-2 py-1 bg-gray-900 text-white"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "date" | "difficulty")}
          >
            <option value="date">По дате</option>
            <option value="difficulty">По сложности</option>
          </select>
        </label>
      </div>
      {loading && <p className="mb-4">Загрузка задач…</p>}
      {!loading && tasks.length === 0 && (
        <p className="mb-4">Нет задач для выбранного типа.</p>
      )}
      <div className="space-y-8">
        {tasks.map((task) => (
          <div key={task.id} className="border border-white rounded-lg p-4 bg-gray-900 shadow">
            <div className="mb-3">
              <div className="mb-1 text-lg font-medium">Задача:</div>
              <div className="whitespace-pre-line">{task.statement}</div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Ваш ответ"
                className="border border-white rounded px-3 py-1 bg-gray-900 text-white w-48"
                value={userAnswers[task.id] || ""}
                onChange={e => handleInput(task.id, e.target.value)}
              />
              <button
                className="px-3 py-1 border border-white rounded hover:bg-white hover:text-gray-900 transition"
                onClick={() => handleCheck(task)}
              >
                Проверить ответ
              </button>
              {checkResult[task.id] && (
                <span className="ml-2">{checkResult[task.id]}</span>
              )}
            </div>
            <button
              className="text-blue-400 hover:underline text-sm mb-2"
              onClick={() => toggleSolution(task.id)}
            >
              {expanded[task.id] ? "Скрыть решение" : "Показать решение и ответ"}
            </button>
            {expanded[task.id] && (
              <div className="bg-gray-800 rounded p-3 mt-2 text-sm">
                <div>
                  <span className="font-semibold">Решение: </span>
                  {task.solution || "—"}
                </div>
                <div>
                  <span className="font-semibold">Ответ: </span>
                  {typeof task.answer === "string"
                    ? task.answer
                    : JSON.stringify(task.answer)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/ege-inf" className="text-blue-400 hover:underline">
          ← Назад к выбору типов
        </Link>
      </div>
    </main>
  );
}
