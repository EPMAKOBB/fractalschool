// src/app/lk/SubscriptionStatus.tsx
"use client";

interface Props {
  role: "guest" | "subscriber" | "course";
  expiresAt?: string | null;
}

export default function SubscriptionStatus({ role, expiresAt }: Props) {
  const label = {
    guest: "Бесплатный доступ",
    subscriber: "Подписка 299 ₽ / мес",
    course: "Полный курс",
  }[role];

  return (
    <header className="mb-6 rounded-lg border p-4 flex items-center justify-between">
      <div>
        <p className="font-semibold">{label}</p>
        {expiresAt && (
          <p className="text-sm text-gray-600">
            До {new Date(expiresAt).toLocaleDateString("ru-RU")}
          </p>
        )}
      </div>

      {role === "guest" && (
        <a
          href="/pricing"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Открыть все задания
        </a>
      )}
    </header>
  );
}
