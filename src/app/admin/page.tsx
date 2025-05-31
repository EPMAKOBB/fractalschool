// src/app/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Column = {
  column_name: string;
  data_type: string;
  is_nullable?: string;
  column_default?: string;
};

const TABLES = [
  { name: "inf-ege", label: "Задачи ЕГЭ Информатика" },
  { name: "tasks_meta", label: "Шаблоны задач" },
];

export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState<string>(TABLES[0].name);
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Получить структуру выбранной таблицы
  useEffect(() => {
    async function loadColumns() {
      const { data, error } = await supabase.rpc("get_table_columns", { tbl: selectedTable });
      setColumns(error ? [] : data ?? []);
    }
    loadColumns();
  }, [selectedTable]);

  // Получить данные выбранной таблицы
  useEffect(() => {
    async function fetchRows() {
      setLoading(true);
      const { data, error } = await supabase.from(selectedTable).select("*");
      setRows(error ? [] : data ?? []);
      setLoading(false);
    }
    fetchRows();
  }, [selectedTable]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Админ-панель</h2>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Выберите таблицу:</label>
        <select
          className="p-2 border rounded"
          value={selectedTable}
          onChange={e => setSelectedTable(e.target.value)}
        >
          {TABLES.map(t => (
            <option key={t.name} value={t.name}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-gray-700">
              {columns.map(col => (
                <th key={col.column_name} className="p-2 border">
                  {col.column_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id || i} className="border-b">
                {columns.map(col => (
                  <td key={col.column_name} className="p-2 border">
                    {typeof row[col.column_name] === "object"
                      ? JSON.stringify(row[col.column_name])
                      : String(row[col.column_name] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
