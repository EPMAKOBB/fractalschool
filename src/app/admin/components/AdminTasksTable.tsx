// src/app/admin/components/AdminTasksTable.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import AdminTaskForm from './AdminTaskForm';

// Интерфейсы, чтобы не было дублирования
export interface Task {
    id: string | number;
    type_num: number;
    subtype_text: string;
    task_num_text: string;
    source: string;
    difficulty: number;
    body_md: string;
    answer_json: number | string | [number, number] | number[] | [number, number][] | null;
    solution_md: string;
    notes_text: string | null;
    subject_id: string;
    status: 'draft' | 'published';
}

export interface Subject {
    id: string;
    title: string;
    slug: string;
}

interface AdminTasksTableProps {
    initialTasks?: Task[];
    subjects: Subject[];
    filters: { subjectId: string | null; typeNum: number | null; status: string | null };
}

export default function AdminTasksTable({ initialTasks = [], subjects, filters }: AdminTasksTableProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    useEffect(() => {
        async function fetchTasks() {
            setIsLoading(true);

            const params = new URLSearchParams();
            if (filters.subjectId) params.append('subject_id', filters.subjectId);
            if (filters.typeNum) params.append('type_num', filters.typeNum.toString());
            if (filters.status) params.append('status', filters.status);

            try {
                const response = await fetch(`/api/admin/tasks?${params.toString()}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке задач');
                }
                const data: Task[] = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Не удалось получить задачи:', error);
                setTasks([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTasks();
    }, [filters]);

    const handleAddNewTask = () => {
        setEditingTask(undefined);
        setIsFormVisible(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormVisible(true);
    };

    const handleFormSave = (savedTask: Task) => {
        // Убедимся, что savedTask существует и имеет ID
        if (!savedTask || !savedTask.id) {
            console.error('Ошибка: Сохраненная задача не имеет ID');
            setIsFormVisible(false);
            return;
        }

        const isNewTask = initialTasks?.some(task => task.id === savedTask.id);

        if (isNewTask) {
            setTasks(prevTasks => prevTasks.map(task =>
                task.id === savedTask.id ? savedTask : task
            ));
        } else {
            setTasks(prevTasks => [savedTask, ...prevTasks]);
        }

        setIsFormVisible(false);
    };

    const handleFormCancel = () => {
        setIsFormVisible(false);
        setEditingTask(undefined);
    };

    const handleDelete = async (id: string | number) => {
        if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
            try {
                const response = await fetch('/api/admin/tasks', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении задачи');
                }

                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                console.log(`Задача с ID ${id} успешно удалена.`);
            } catch (error) {
                console.error('Не удалось удалить задачу:', error);
            }
        }
    };

    const handleToggleStatus = async (task: Task) => {
        const newStatus = task.status === 'published' ? 'draft' : 'published';
        try {
            const response = await fetch('/api/admin/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при смене статуса');
            }

            setTasks(prevTasks => prevTasks.map(t => (t.id === task.id ? { ...t, status: newStatus } : t)));
            console.log(`Статус задачи с ID ${task.id} изменён на ${newStatus}.`);
        } catch (error) {
            console.error('Не удалось изменить статус:', error);
        }
    };

    const getSubjectTitle = (subjectId: string) => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject ? subject.title : 'Неизвестный';
    };

    if (isFormVisible) {
        return (
            <AdminTaskForm
                initialTask={editingTask}
                subjects={subjects}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
            />
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Список задач</h2>
                <Button onClick={handleAddNewTask}>Создать задачу</Button>
            </div>
            {isLoading ? (
                <div className="p-4 text-center">Загрузка задач...</div>
            ) : tasks.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Нет задач, удовлетворяющих фильтрам</div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Слаг</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{task.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getSubjectTitle(task.subject_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.type_num}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.task_num_text}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button onClick={() => handleEdit(task)} className="mr-2">Редактировать</Button>
                                    <Button onClick={() => handleToggleStatus(task)} variant="outline" className="mr-2">
                                        {task.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                                    </Button>
                                    <Button onClick={() => handleDelete(task.id)} variant="destructive">Удалить</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}