// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  // Общий класс для кнопок с эффектом наведения
  const buttonClass =
    "px-4 py-2 border border-white rounded w-32 transition duration-200 hover:bg-white hover:text-gray-900";

  return (
    <main className="flex flex-col items-center mt-4 text-white bg-gray-900">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Link href="/oge-inf">
          <button className={buttonClass}>ОГЭ И</button>
        </Link>
        <Link href="/oge-math">
          <button className={buttonClass}>ОГЭ М</button>
        </Link>
        <Link href="/oge-phys">
          <button className={buttonClass}>ОГЭ Ф</button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link href="/ege-inf">
          <button className={buttonClass}>ЕГЭ И</button>
        </Link>
        <Link href="/ege-math">
          <button className={buttonClass}>ЕГЭ М</button>
        </Link>
        <Link href="/ege-phys">
          <button className={buttonClass}>ЕГЭ Ф</button>
        </Link>
      </div>

      <div className="mb-2">вы можете задать вопрос нейросети:</div>
      <input
        type="text"
        placeholder="вы можете написать сюда свой вопрос"
        className="w-full max-w-lg p-2 mb-4 border rounded placeholder:text-gray-300 text-white bg-gray-900 focus:outline-none focus:border-blue-400"
      />
      <button className="px-4 py-2 border border-white rounded mb-8 transition duration-200 hover:bg-white hover:text-gray-900">
        задать свой вопрос
      </button>

      <footer className="flex space-x-4 text-sm">
        <Link href="/about" className="hover:underline">
          о проекте
        </Link>
        <Link href="/contacts" className="hover:underline">
          контакты
        </Link>
      </footer>
    </main>
  );
}
