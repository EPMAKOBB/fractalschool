// src/app/admin/components/AdminSidebar.tsx

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface Subject {
    id: string;
    title: string;
    slug: string;
}

interface AdminSidebarProps {
    subjects: Subject[];
    onFilterChange: (filters: { subjectId: string | null; typeNum: number | null; status: string | null }) => void;
}

export default function AdminSidebar({ subjects, onFilterChange }: AdminSidebarProps) {
    const [subjectId, setSubjectId] = useState<string | null>(null);
    const [typeNum, setTypeNum] = useState<number | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleApplyFilters = () => {
        onFilterChange({ subjectId, typeNum, status });
    };

    return (
        // Изменено: теперь это верхняя панель
        <div className="w-full p-4 border-b bg-gray-50 dark:bg-gray-900 flex flex-wrap items-center gap-4"> {/* Изменено: w-full, border-b, flex flex-wrap items-center gap-4 */}
            <h2 className="text-xl font-bold">Фильтры:</h2>

            {/* Фильтр по предмету */}
            <div className="flex items-center gap-2"> {/* Добавим flex для inline элементов */}
                <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Предмет:
                </label>
                <select
                    id="subject"
                    value={subjectId || ''}
                    onChange={(e) => setSubjectId(e.target.value || null)}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Все</option>
                    {subjects.map((subj) => (
                        <option key={subj.id} value={subj.id}>
                            {subj.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Фильтр по типу */}
            <div className="flex items-center gap-2"> {/* Добавим flex для inline элементов */}
                <label htmlFor="typeNum" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Тип:
                </label>
                <input
                    id="typeNum"
                    type="number"
                    value={typeNum || ''}
                    onChange={(e) => setTypeNum(e.target.value ? Number(e.target.value) : null)}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md w-24"
                    placeholder="Напр., 17"
                />
            </div>

            {/* Фильтр по статусу */}
            <div className="flex items-center gap-2"> {/* Добавим flex для inline элементов */}
                <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Статус:
                </label>
                <select
                    id="status"
                    value={status || ''}
                    onChange={(e) => setStatus(e.target.value || null)}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Все</option>
                    <option value="published">Опубликовано</option>
                    <option value="draft">Черновик</option>
                </select>
            </div>

            {/* Кнопка "Применить" */}
            <Button onClick={handleApplyFilters}>
                Применить
            </Button>
        </div>
    );
}