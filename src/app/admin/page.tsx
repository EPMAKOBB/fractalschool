// src/app/admin/page.tsx

import { createClient } from '@/utils/supabase/server';
import AdminDashboard from './components/AdminDashboard';
import { Task, Subject } from '@/app/admin/components/AdminTasksTable'; // Импортируем типы из одного места

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('id, title, slug');

  if (subjectsError) {
    console.error('Ошибка получения предметов:', subjectsError);
    return <main className="p-8 text-red-400">Ошибка загрузки предметов: {subjectsError.message}</main>;
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks_static')
    .select('*')
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('Ошибка получения задач:', tasksError);
    return <main className="p-8 text-red-400">Ошибка загрузки задач: {tasksError.message}</main>;
  }

  return (
    <main className="flex min-h-screen">
      <AdminDashboard initialTasks={tasks || []} subjects={subjects || []} />
    </main>
  );
}