// src/app/admin/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/client";

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

const SORT_OPTIONS = [
  { label: "Сначала новые", field: "created_at", asc: false },
  { label: "Сначала старые", field: "created_at", asc: true },
];

const FILTER_FIELDS = ["task_type", "difficulty", "status", "theme"];

const STATUS_ENUM = ["draft", "published", "archived"];


export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState<string>(TABLES[0].name);
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [allRows, setAllRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRow, setNewRow] = useState<any>({});
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<any>({});
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);

  // Состояния фильтров
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<Record<string, boolean>>({});

  // Для закрытия фильтра по клику вне
  const filterDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- Загружаем колонки
  useEffect(() => {
    async function loadColumns() {
      const { data, error } = await supabase.rpc("get_table_columns", { tbl: selectedTable });
      setColumns(error ? [] : data ?? []);
    }
    loadColumns();
    setNewRow({});
    setEditRowId(null);
    setEditRow({});
  }, [selectedTable]);

  // --- Загружаем все строки для фильтрации
  useEffect(() => {
    async function fetchAllRows() {
      setLoading(true);
      let query = supabase.from(selectedTable).select("*");
      if (sortOption.field) {
        query = query.order(sortOption.field, { ascending: sortOption.asc });
      }
      const { data, error } = await query;
      setAllRows(error ? [] : data ?? []);
      setLoading(false);
    }
    fetchAllRows();
  }, [selectedTable, sortOption]);

  // --- Автоматическое определение вариантов для фильтров
  useEffect(() => {
    const options: Record<string, string[]> = {};
    FILTER_FIELDS.forEach(field => {
      const values = Array.from(
        new Set(
          allRows
            .map(row => (row[field] !== null && row[field] !== undefined ? String(row[field]) : ""))
            .filter(v => v !== "")
        )
      );
      options[field] = values.sort((a, b) => {
        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
          return Number(a) - Number(b);
        }
        return a.localeCompare(b, "ru");
      });
    });
    setFilterOptions(options);
  }, [allRows]);

  // --- Применяем фильтры
  useEffect(() => {
    let filteredRows = [...allRows];
    FILTER_FIELDS.forEach(field => {
      const selected = selectedFilters[field] || [];
      if (selected.length > 0) {
        filteredRows = filteredRows.filter(row =>
          selected.includes(String(row[field]))
        );
      }
    });
    setRows(filteredRows);
  }, [allRows, selectedFilters]);

  // --- CRUD
  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredRow = Object.fromEntries(
      Object.entries(newRow).filter(([key, v]) => v !== "" && key !== "id" && key !== "created_at")
    );
    const { error } = await supabase.from(selectedTable).insert([filteredRow]);
    if (!error) {
      setNewRow({});
      let query = supabase.from(selectedTable).select("*");
      if (sortOption.field) {
        query = query.order(sortOption.field, { ascending: sortOption.asc });
      }
      const { data } = await query;
      setAllRows(data ?? []);
    } else {
      alert(error.message);
    }
  };

  const handleDeleteRow = async (id: number) => {
    await supabase.from(selectedTable).delete().eq("id", id);
    let query = supabase.from(selectedTable).select("*");
    if (sortOption.field) {
      query = query.order(sortOption.field, { ascending: sortOption.asc });
    }
    const { data } = await query;
    setAllRows(data ?? []);
  };

  const handleEditStart = (row: any) => {
    setEditRowId(row.id);
    setEditRow(row);
  };

  const handleEditSave = async (id: number) => {
    const filteredRow = Object.fromEntries(
      Object.entries(editRow).filter(([_, v]) => v !== "")
    );
    await supabase.from(selectedTable).update(filteredRow).eq("id", id);
    setEditRowId(null);
    setEditRow({});
    let query = supabase.from(selectedTable).select("*");
    if (sortOption.field) {
      query = query.order(sortOption.field, { ascending: sortOption.asc });
    }
    const { data } = await query;
    setAllRows(data ?? []);
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditRow({});
  };

  // --- Фильтры чекбоксы
  function handleFilterChange(field: string, value: string) {
    setSelectedFilters(prev => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  }

  // Закрытие дропдауна фильтра при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(filterDropdownRefs.current).forEach(field => {
        if (
          filterDropdownRefs.current[field] &&
          !filterDropdownRefs.current[field]!.contains(event.target as Node)
        ) {
          setFilterDropdownOpen(prev => ({ ...prev, [field]: false }));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Рендер
  return (
    <>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Админ-панель</h2>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="mr-2 font-semibold">Таблица:</label>
            <select
              className="border rounded p-2"
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
            >
              {TABLES.map(t => (
                <option key={t.name} value={t.name}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2 font-semibold">Сортировка:</label>
            <select
              className="border rounded p-2"
              value={sortOption.label}
              onChange={e =>
                setSortOption(
                  SORT_OPTIONS.find(opt => opt.label === e.target.value) || SORT_OPTIONS[0]
                )
              }
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Фильтры таблицы */}
        <div className="flex flex-wrap gap-4 mb-6">
          {FILTER_FIELDS.map(field => (
            <div
              className="relative"
              key={field}
              ref={el => { filterDropdownRefs.current[field] = el; }}
            >
              <button
                type="button"
                className="border rounded px-3 py-1 bg-gray-800"
                onClick={() => setFilterDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }))}
              >
                {field} {selectedFilters[field]?.length ? `(${selectedFilters[field].length})` : ""}
                <span className="ml-1">▼</span>
              </button>
              {filterDropdownOpen[field] && (
                <div className="absolute z-10 bg-gray-900 border border-gray-700 rounded shadow-lg mt-1 min-w-[160px] max-h-64 overflow-y-auto p-2">
                  {filterOptions[field]?.length ? (
                    filterOptions[field].map(value => (
                      <label key={value} className="flex items-center px-1 py-0.5 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={selectedFilters[field]?.includes(value) || false}
                          onChange={() => handleFilterChange(field, value)}
                          className="mr-2"
                        />
                        {value}
                      </label>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 px-2">Нет значений</div>
                  )}
                  <button
                    className="mt-2 text-blue-400 text-xs hover:underline"
                    onClick={() =>
                      setSelectedFilters(prev => ({ ...prev, [field]: [] }))
                    }
                  >
                    Сбросить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Форма для добавления новой записи */}
        <form onSubmit={handleAddRow} className="mb-6 flex flex-wrap gap-2 items-end">
          {columns.map(col => (
            <div key={col.column_name} className="flex flex-col">
              <label className="text-xs">{col.column_name}</label>
              {col.column_name === "statement" || col.column_name === "solution" ? (
                <textarea
                  className="border rounded p-1 resize-y min-h-[80px]"
                  value={newRow[col.column_name] || ""}
                  onChange={e => setNewRow({ ...newRow, [col.column_name]: e.target.value })}
                  placeholder={col.column_name}
                />
              ) : col.column_name === "status" ? (
                <select
                  className="border rounded p-1"
                  value={newRow[col.column_name] || STATUS_ENUM[0]}
                  onChange={e => setNewRow({ ...newRow, [col.column_name]: e.target.value })}

                >
                  {STATUS_ENUM.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="border rounded p-1"
                  type="text"
                  value={newRow[col.column_name] || ""}
                  onChange={e => setNewRow({ ...newRow, [col.column_name]: e.target.value })}
                  placeholder={col.column_name}
                  disabled={col.column_name === "id" || col.column_name === "created_at"}
                />
              )}

            </div>
          ))}
          <button type="submit" className="px-3 py-1 rounded bg-green-700 text-white hover:bg-green-800">
            Добавить
          </button>
        </form>
      </main>

      {/* Таблица */}
      <div
        className="w-screen px-6 mt-6"
        style={{
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw"
        }}
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.column_name} className="p-2 border">
                      {col.column_name}
                    </th>
                  ))}
                  <th className="p-2 border">Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id || i} className="border-b">
                    {columns.map(col => (
                      <td key={col.column_name} className="p-2 border">
                        {editRowId === row.id ? (
                          col.column_name === "statement" || col.column_name === "solution" ? (
                            <textarea
                              className="border rounded p-1 w-full resize-y min-h-[80px]"
                              value={editRow[col.column_name] ?? ""}
                              onChange={e =>
                                setEditRow({ ...editRow, [col.column_name]: e.target.value })
                              }
                              placeholder={col.column_name}
                            />
                          ) : col.column_name === "status" ? (
                            <select
                              className="border rounded p-1 w-full"
                              value={editRow[col.column_name] ?? STATUS_ENUM[0]}
                              onChange={e =>
                                setEditRow({ ...editRow, [col.column_name]: e.target.value })
                              }
                            >
                              {STATUS_ENUM.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="border rounded p-1 w-full"
                              type="text"
                              value={editRow[col.column_name] ?? ""}
                              onChange={e =>
                                setEditRow({ ...editRow, [col.column_name]: e.target.value })
                              }
                              placeholder={col.column_name}
                              disabled={col.column_name === "id"}
                            />
                          )
                        ) : typeof row[col.column_name] === "object" ? (
                          JSON.stringify(row[col.column_name])
                        ) : (
                          String(row[col.column_name] ?? "")
                        )}
                      </td>
                    ))}
                    <td className="p-2 border whitespace-nowrap">
                      {editRowId === row.id ? (
                        <>
                          <button
                            className="text-green-700 hover:underline mr-2"
                            onClick={() => handleEditSave(row.id)}
                          >
                            Сохранить
                          </button>
                          <button
                            className="text-gray-500 hover:underline"
                            onClick={handleEditCancel}
                          >
                            Отмена
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-blue-700 hover:underline mr-2"
                            onClick={() => handleEditStart(row)}
                          >
                            Редактировать
                          </button>
                          <button
                            className="text-red-700 hover:underline"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            Удалить
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
