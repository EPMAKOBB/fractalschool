// src/app/api/admin/tasks/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Task } from '@/app/components/TaskCard';

// GET-запрос для получения задач
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const subjectId = searchParams.get('subject_id');
    const typeNum = searchParams.get('type_num');

    let query = supabase.from('tasks_static').select('*');

    if (subjectId) {
        query = query.eq('subject_id', subjectId);
    }

    if (typeNum) {
        query = query.eq('type_num', typeNum);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Ошибка получения задач:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}


// POST-запрос для СОЗДАНИЯ новой задачи
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const taskData: Task = await request.json();

    // Создание новой задачи
    const { data, error } = await supabase.from('tasks_static').insert([taskData]).select();

    if (error) {
        console.error('Ошибка создания задачи:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, task: data[0] });
}


// PUT-запрос для ОБНОВЛЕНИЯ существующей задачи
export async function PUT(request: NextRequest) {
    const supabase = await createClient();
    const taskData: Task = await request.json();

    if (!taskData.id) {
        return NextResponse.json({ error: 'ID задачи не указан для обновления' }, { status: 400 });

    }


    const { data, error } = await supabase
        .from('tasks_static')
        .update(taskData)
        .eq('id', taskData.id)
        .select();

    if (error) {
        console.error('Ошибка обновления задачи:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, task: data[0] });
}

// DELETE-запрос для удаления задачи
export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'ID задачи не указан' }, { status: 400 });
    }

    const { error } = await supabase.from('tasks_static').delete().eq('id', id);

    if (error) {
        console.error('Ошибка удаления задачи:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Задача успешно удалена' });
}