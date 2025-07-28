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
        // Эта функция теперь отправляет состояние фильтров в родительский компонент
        onFilterChange({ subjectId, typeNum, status });
    };



    return (
        <div className="w-64 p-4 border-r bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4">Фильтры</h2>
            <div className="space-y-4">
                {/* Фильтр по предмету */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Предмет
                    </label>
                    <select
                        id="subject"
                        value={subjectId || ''}
                        onChange={(e) => setSubjectId(e.target.value || null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                <div>
                    <label htmlFor="typeNum" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Тип задания
                    </label>
                    <input
                        id="typeNum"
                        type="number"
                        value={typeNum || ''}
                        onChange={(e) => setTypeNum(e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        placeholder="Например, 17"
                    />
                </div>

                {/* Фильтр по статусу */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Статус
                    </label>
                    <select
                        id="status"
                        value={status || ''}
                        onChange={(e) => setStatus(e.target.value || null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">Все</option>
                        <option value="published">Опубликовано</option>
                        <option value="draft">Черновик</option>
                    </select>
                </div>

                {/* Кнопка "Применить" */}
                <Button onClick={handleApplyFilters} className="w-full">
                    Применить фильтры
                </Button>
            </div>
        </div>
    );
}