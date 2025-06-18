// src/app/ege-inf/page.tsx

import Link from "next/link";

const taskTypes = Array.from({ length: 27 }, (_, i) => i + 1);

export default function EgeInfPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">ЕГЭ по информатике</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Варианты:</h2>
        <div className="flex flex-col items-center space-y-4">
          {/* Здесь позже будут реальные данные из базы */}
          <Link href="#">
            <button className="w-full px-4 py-3 border border-white rounded hover:bg-white hover:text-gray-900 transition">
              Вариант 1 (демо)
            </button>
          </Link>
          <Link href="#">
            <button className="w-full px-4 py-3 border border-white rounded hover:bg-white hover:text-gray-900 transition">
              Вариант 2 (демо)
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Задания по типам:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {taskTypes.map((type) => (
            <Link
              key={type}
              href={`/ege-inf/type${type}`}
              className="hover:underline text-white bg-gray-800 rounded px-4 py-2 transition hover:bg-white hover:text-gray-900 text-center"
            >
              Тип {type}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        <Link href="/dashboard" className="hover:underline mr-2">
          Личный кабинет
        </Link>
        <Link href="/about" className="hover:underline mr-2">
          О проекте
        </Link>
        <Link href="/contacts" className="hover:underline">
          Контакты
        </Link>
      </div>
    </main>
  );
}
