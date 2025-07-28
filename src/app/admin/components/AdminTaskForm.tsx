// src/app/admin/components/AdminTaskForm.tsx

"use client";

import { useState, useEffect } from 'react';
import TaskCard from '@/app/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Task, Subject } from '@/app/admin/components/AdminTasksTable'; // Импортируем типы

interface AdminTaskFormProps {
    initialTask?: Task;
    subjects: Subject[];
    onSave: (task: Task) => void;
    onCancel: () => void;
}

export default function AdminTaskForm({ initialTask, subjects, onSave, onCancel }: AdminTaskFormProps) {
    const [taskData, setTaskData] = useState<Task>(
        initialTask || {
            id: '',
            type_num: 1,
            subtype_text: '',
            task_num_text: '',
            source: '',
            difficulty: 1,
            body_md: '### Новая задача',
            answer_json: null,
            solution_md: 'Решение...',
            notes_text: null,
            subject_id: subjects[0]?.id || '', // Убедимся, что предмет выбран, если есть
            status: 'draft',
        }
    );

    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!initialTask;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const method = isEditing ? 'PUT' : 'POST';
        const body = JSON.stringify(taskData);

        try {
            const response = await fetch('/api/admin/tasks', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body,
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Ошибка при сохранении задачи');
                } catch (e) {
                    throw new Error(errorText || 'Неизвестная ошибка при сохранении задачи');
                }
            }

            const result = await response.json();
            if (result && result.task) {
                onSave(result.task);
            } else {
                throw new Error('Ответ от сервера не содержит сохраненную задачу.');
            }

        } catch (error) {
            console.error('Не удалось сохранить задачу:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Редактирование задачи' : 'Создание новой задачи'}</h2>
            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ЛЕВАЯ КОЛОНКА: ФОРМА ДЛЯ ВВОДА ДАННЫХ */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Предмет</label>
                            <select
                                name="subject_id"
                                value={taskData.subject_id || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                {subjects.map(subj => (
                                    <option key={subj.id} value={subj.id}>{subj.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Тип задания (type_num)</label>
                            <input
                                type="number"
                                name="type_num"
                                value={taskData.type_num ?? ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Подтип (subtype_text)</label>
                            <input
                                type="text"
                                name="subtype_text"
                                value={taskData.subtype_text || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Например, 'Кодирование информации'"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Slug (task_num_text)</label>
                            <input
                                type="text"
                                name="task_num_text"
                                value={taskData.task_num_text || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Источник (source)</label>
                            <input
                                type="text"
                                name="source"
                                value={taskData.source || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Например, 'ЕГЭ 2024'"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Сложность (difficulty)</label>
                            <input
                                type="number"
                                name="difficulty"
                                value={taskData.difficulty ?? ''}
                                onChange={handleInputChange}
                                min="1"
                                max="10"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="1-10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Ответ (JSON)</label>
                            <textarea
                                name="answer_json"
                                value={
                                    typeof taskData.answer_json === 'object' && taskData.answer_json !== null
                                        ? JSON.stringify(taskData.answer_json)
                                        : String(taskData.answer_json ?? '') // Используем ?? для null/undefined
                                }
                                onChange={(e) => {
                                    try {
                                        setTaskData(prevData => ({ ...prevData, answer_json: JSON.parse(e.target.value) }));
                                    } catch (error) {
                                        console.error("Неверный формат JSON для ответа:", error);
                                        setTaskData(prevData => ({ ...prevData, answer_json: e.target.value as any }));
                                    }
                                }}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono text-sm"
                                placeholder='Например: "123" или [1,2] или {"x":1}'
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Введите ответ в формате JSON (строка, число, массив, объект).
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Тело условия (Markdown)</label>
                            <textarea
                                name="body_md"
                                value={taskData.body_md || ''}
                                onChange={handleInputChange}
                                rows={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Решение (Markdown)</label>
                            <textarea
                                name="solution_md"
                                value={taskData.solution_md || ''}
                                onChange={handleInputChange}
                                rows={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Примечания (notes_text)</label>
                            <textarea
                                name="notes_text"
                                value={taskData.notes_text || ''}
                                onChange={handleInputChange}
                                rows={5}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                    </div> {/* КОНЕЦ ЛЕВОЙ КОЛОНКИ */}

                    {/* ПРАВАЯ КОЛОНКА: ПРЕДПРОСМОТР */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Предпросмотр</h3>
                        {/* console.log('TaskData being passed to TaskCard for preview:', taskData); */} {/* Для отладки */}
                        <TaskCard
                            task={taskData}
                            subject={subjects.find(s => s.id === taskData.subject_id)?.slug || ''}
                        />
                    </div> {/* КОНЕЦ ПРАВОЙ КОЛОНКИ */}

                </div> {/* КОНЕЦ GRID */}

                {/* Кнопки действий */}
                <div className="mt-8 flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </div>
            </form>
        </div>
    );
}