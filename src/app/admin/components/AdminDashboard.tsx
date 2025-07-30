// src/app/admin/components/AdminDashboard.tsx

"use client";

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTasksTable, { Task, Subject } from './AdminTasksTable'; // Импортируем типы из AdminTasksTable

interface AdminDashboardProps {
    initialTasks: Task[];
    subjects: Subject[];
}

export default function AdminDashboard({ initialTasks, subjects }: AdminDashboardProps) {
    const [filters, setFilters] = useState({
        subjectId: null as string | null,
        typeNum: null as number | null,
        status: null as string | null,
    });

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col min-h-screen w-full"> {/* Изменено: flex-col и w-full */}
            {/* Верхняя панель с фильтрами */}
            <AdminSidebar subjects={subjects} onFilterChange={handleFilterChange} />

            {/* Основная рабочая область */}
            <div className="flex-1 p-8"> {/* flex-1 чтобы занимал оставшееся пространство */}
                <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
                <AdminTasksTable initialTasks={initialTasks} subjects={subjects} filters={filters} />
            </div>
        </div>
    );
}