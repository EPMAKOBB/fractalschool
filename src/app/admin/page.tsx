// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
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
  { name: "variants", label: "Варианты (сгенерированные)" },
  { name: "subjects", label: "Предметы" },
  { name: "tags", label: "Теги" },
  // Add other tables as needed
];

const SORT_OPTIONS = [
  { label: "Сначала новые", field: "created_at", asc: false },
  { label: "Сначала старые", field: "created_at", asc: true },
  { label: "По ID (возр.)", field: "id", asc: true },
  { label: "По ID (убыв.)", field: "id", asc: false },
];

const FILTER_FIELDS = ["task_type", "type_num", "difficulty", "status", "theme", "subject_id", "exam_type"];
const STATUS_ENUM = ["draft", "published", "archived", "pending", "approved", "rejected"]; // Combined statuses

// Columns that should use a textarea for easier editing
const TEXTAREA_COLUMNS: Record<string, string[]> = {
  "default": ["statement", "solution", "body_md", "solution_md", "notes_text", "description"],
  "tasks_meta": ["body_template", "solution_text_template"],
};
// Columns that are expected to be JSON and should use ValidatedTextarea
const JSON_COLUMNS:  Record<string, string[]> = {
  "default": ["answer_json", "params", "solution", "choices", "tags", "skill_ids"], // 'solution' can be JSON in variants
  "tasks_meta": ["param_definitions", "solution_logic", "answer_json", "choices", "default_tags", "skill_ids"],
  "inf-ege": ["answer", "tags"], // Example, adjust based on actual table structure if 'answer' is JSON
  "variants": ["params", "solution"],
};

interface ValidatedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  disabled?: boolean;
  columnType: string; // 'json' or 'text' essentially
}

const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({ value, onChange, placeholder, rows = 3, disabled, columnType }) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (columnType.includes("json")) { // Check if column is of JSON type
        try {
            if (e.target.value.trim() !== "") {
                 JSON.parse(e.target.value);
            }
            setJsonError(null);
        } catch (err) {
            setJsonError("Невалидный JSON");
        }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (jsonError && columnType.includes("json")) { // Clear error on change if it was a JSON error
        try {
            if (e.target.value.trim() !== "") {
                JSON.parse(e.target.value);
            }
            setJsonError(null);
        } catch (err) {
            // Keep error until valid or blurred again
        }
    }
  };

  return (
    <div className="flex flex-col">
      <textarea
        className={`border rounded p-1 resize-y min-h-[80px] w-full ${jsonError ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder-gray-500`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
      {jsonError && <small className="text-red-500 mt-1">{jsonError}</small>}
    </div>
  );
};


export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState<string>(TABLES[0].name);
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [allRows, setAllRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRow, setNewRow] = useState<any>({});
  const [editRowId, setEditRowId] = useState<string | number | null>(null); // ID can be string (uuid) or number
  const [editRow, setEditRow] = useState<any>({});
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [jsonParseErrors, setJsonParseErrors] = useState<Record<string, string | null>>({});


  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<Record<string, boolean>>({});
  const filterDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isJsonColumn = (colName: string, colType: string) =>
    colType.includes("json") || JSON_COLUMNS["default"].includes(colName) || (JSON_COLUMNS[selectedTable] && JSON_COLUMNS[selectedTable].includes(colName));

  const isTextareaColumn = (colName: string) =>
    TEXTAREA_COLUMNS["default"].includes(colName) || (TEXTAREA_COLUMNS[selectedTable] && TEXTAREA_COLUMNS[selectedTable].includes(colName));


  useEffect(() => {
    async function loadColumns() {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_table_columns", { tbl: selectedTable });
      setColumns(error ? [] : data ?? []);
      setLoading(false);
    }
    loadColumns();
    setNewRow({});
    setEditRowId(null);
    setEditRow({});
    setJsonParseErrors({});
  }, [selectedTable]);

  useEffect(() => {
    async function fetchAllRows() {
      setLoading(true);
      let query = supabase.from(selectedTable).select("*");
      if (sortOption.field && columns.find(c => c.column_name === sortOption.field)) { // Check if sort field exists
        query = query.order(sortOption.field, { ascending: sortOption.asc });
      } else if (columns.find(c => c.column_name === "created_at")) { // Default sort by created_at if exists
        query = query.order("created_at", { ascending: false });
      } else if (columns.find(c => c.column_name === "id")) { // Fallback to id
         query = query.order("id", { ascending: true });
      }
      const { data, error } = await query;
      setAllRows(error ? [] : data ?? []);
      setLoading(false);
    }
    if (columns.length > 0) { // Fetch rows only after columns are loaded
        fetchAllRows();
    }
  }, [selectedTable, sortOption, columns]);

  useEffect(() => {
    const options: Record<string, string[]> = {};
    FILTER_FIELDS.forEach(field => {
      if (columns.find(c => c.column_name === field)) {
        const values = Array.from(
          new Set(allRows.map(row => (row[field] !== null && row[field] !== undefined ? String(row[field]) : "")).filter(v => v !== ""))
        );
        options[field] = values.sort((a, b) => {
          if (!isNaN(Number(a)) && !isNaN(Number(b))) return Number(a) - Number(b);
          return a.localeCompare(b, "ru");
        });
      }
    });
    setFilterOptions(options);
  }, [allRows, columns]);

  useEffect(() => {
    let filteredRows = [...allRows];
    Object.entries(selectedFilters).forEach(([field, selectedValues]) => {
      if (selectedValues.length > 0) {
        filteredRows = filteredRows.filter(row => selectedValues.includes(String(row[field])));
      }
    });
    setRows(filteredRows);
  }, [allRows, selectedFilters]);

  const parseValue = (value: string, dataType: string): any => {
    if (value.trim() === "") return null;
    if (dataType.includes("json")) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // Error will be handled by validation, for submission we might want to prevent or allow as string
        console.error("JSON parse error on submit:", e);
        throw new Error(`Невалидный JSON для поля.`); // Throw to prevent submission
      }
    }
    if (dataType.includes("int") || dataType.includes("numeric")) return Number(value);
    if (dataType.includes("bool")) return value.toLowerCase() === 'true';
    return value;
  };

  const handleInputChange = (form: 'new' | 'edit', colName: string, value: string) => {
    const col = columns.find(c => c.column_name === colName);
    if (!col) return;

    if (form === 'new') {
      setNewRow({ ...newRow, [colName]: value });
    } else {
      setEditRow({ ...editRow, [colName]: value });
    }

    // Live JSON validation if needed, or rely on ValidatedTextarea's onBlur
    if (isJsonColumn(colName, col.data_type)) {
      try {
        if (value.trim() !== "") JSON.parse(value);
        setJsonParseErrors(prev => ({ ...prev, [colName]: null }));
      } catch (e) {
        setJsonParseErrors(prev => ({ ...prev, [colName]: "Невалидный JSON" }));
      }
    }
  };

  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    let processedRow: any = {};
    try {
      for (const key in newRow) {
        if (newRow[key] === "" || key === "id" || key === "created_at") continue;
        const col = columns.find(c => c.column_name === key);
        if (col) {
          processedRow[key] = parseValue(newRow[key], col.data_type);
        } else {
          processedRow[key] = newRow[key]; // Keep as is if column not found (should not happen)
        }
      }
    } catch (err: any) {
      alert(`Ошибка преобразования данных: ${err.message}`);
      return;
    }

    const { error } = await supabase.from(selectedTable).insert([processedRow]);
    if (!error) {
      setNewRow({});
      setJsonParseErrors({});
      const { data } = await supabase.from(selectedTable).select("*").order(sortOption.field || (columns.find(c=>c.column_name === "created_at") ? "created_at" : "id"), { ascending: sortOption.asc });
      setAllRows(data ?? []);
    } else {
      alert(error.message);
    }
  };

  const handleDeleteRow = async (id: string | number) => {
    await supabase.from(selectedTable).delete().eq("id", id);
    const { data } = await supabase.from(selectedTable).select("*").order(sortOption.field || (columns.find(c=>c.column_name === "created_at") ? "created_at" : "id"), { ascending: sortOption.asc });
    setAllRows(data ?? []);
  };

  const handleEditStart = (row: any) => {
    setEditRowId(row.id);
    // Convert objects/arrays to JSON strings for editing in textareas
    const stringifiedRow = { ...row };
    columns.forEach(col => {
      if (isJsonColumn(col.column_name, col.data_type) && typeof row[col.column_name] === 'object' && row[col.column_name] !== null) {
        stringifiedRow[col.column_name] = JSON.stringify(row[col.column_name], null, 2);
      }
    });
    setEditRow(stringifiedRow);
    setJsonParseErrors({});
  };

  const handleEditSave = async (id: string | number) => {
    let processedRow: any = {};
     try {
      for (const key in editRow) {
        if (key === "id" || key === "created_at") continue; // Don't update these
        if (editRow[key] === "") { // Allow clearing optional fields
            processedRow[key] = null;
            continue;
        };
        const col = columns.find(c => c.column_name === key);
        if (col) {
          processedRow[key] = parseValue(editRow[key], col.data_type);
        } else {
           processedRow[key] = editRow[key];
        }
      }
    } catch (err: any) {
      alert(`Ошибка преобразования данных: ${err.message}`);
      return;
    }

    const { error } = await supabase.from(selectedTable).update(processedRow).eq("id", id);
    if (!error) {
      setEditRowId(null);
      setEditRow({});
      setJsonParseErrors({});
      const { data } = await supabase.from(selectedTable).select("*").order(sortOption.field || (columns.find(c=>c.column_name === "created_at") ? "created_at" : "id"), { ascending: sortOption.asc });
      setAllRows(data ?? []);
    } else {
      alert(error.message);
    }
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditRow({});
    setJsonParseErrors({});
  };

  function handleFilterChange(field: string, value: string) {
    setSelectedFilters(prev => {
      const current = prev[field] || [];
      return { ...prev, [field]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(filterDropdownRefs.current).forEach(field => {
        if (filterDropdownRefs.current[field] && !filterDropdownRefs.current[field]!.contains(event.target as Node)) {
          setFilterDropdownOpen(prev => ({ ...prev, [field]: false }));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderInputField = (col: Column, value: any, onChange: (val: string) => void, formType: 'new' | 'edit') => {
    const isDisabled = (col.column_name === "id" && formType === 'edit') || col.column_name === "created_at" || col.column_name === "updated_at";
    const placeholder = `${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "*" : ""}`;
    const currentValue = value ?? (col.column_default ?? "");

    if (isJsonColumn(col.column_name, col.data_type) || isTextareaColumn(col.column_name)) {
      return (
        <ValidatedTextarea
          value={currentValue}
          onChange={onChange}
          placeholder={placeholder}
          rows={isJsonColumn(col.column_name, col.data_type) ? 5 : 3}
          disabled={isDisabled}
          columnType={col.data_type}
        />
      );
    }
    if (col.column_name === "status" && STATUS_ENUM.length > 0) { // Assuming 'status' is a common field
        return (
            <select
              className="border rounded p-1 bg-gray-800 text-white border-gray-600 placeholder-gray-500"
              value={currentValue || ""}
              onChange={e => onChange(e.target.value)}
              disabled={isDisabled}
            >
              <option value="">-- нет --</option>
              {STATUS_ENUM.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
        );
    }
     if (col.data_type.includes("bool")) {
      return (
        <select
          className="border rounded p-1 bg-gray-800 text-white border-gray-600 placeholder-gray-500"
          value={String(currentValue)}
          onChange={e => onChange(e.target.value)}
          disabled={isDisabled}
        >
          <option value="true">Да</option>
          <option value="false">Нет</option>
          {col.is_nullable === "YES" && <option value="">-- нет --</option>}
        </select>
      );
    }

    return (
      <input
        className="border rounded p-1 bg-gray-800 text-white border-gray-600 placeholder-gray-500"
        type="text"
        value={currentValue}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isDisabled}
      />
    );
  };


  return (
    <>
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Админ-панель</h2>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="mr-2 font-semibold">Таблица:</label>
            <select className="border rounded p-2 bg-gray-800 text-white border-gray-600" value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
              {TABLES.map(t => <option key={t.name} value={t.name}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mr-2 font-semibold">Сортировка:</label>
            <select className="border rounded p-2 bg-gray-800 text-white border-gray-600" value={sortOption.label} onChange={e => setSortOption(SORT_OPTIONS.find(opt => opt.label === e.target.value) || SORT_OPTIONS[0])}>
              {SORT_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_FIELDS.filter(f => columns.find(c => c.column_name === f)).map(field => (
            <div className="relative" key={field} ref={el => { filterDropdownRefs.current[field] = el; }}>
              <button type="button" className="border rounded px-3 py-1 bg-gray-700 hover:bg-gray-600" onClick={() => setFilterDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }))}>
                {field} {selectedFilters[field]?.length ? `(${selectedFilters[field].length})` : ""} <span className="ml-1 text-xs">▼</span>
              </button>
              {filterDropdownOpen[field] && (
                <div className="absolute z-20 bg-gray-800 border border-gray-700 rounded shadow-lg mt-1 min-w-[180px] max-h-72 overflow-y-auto p-2">
                  {filterOptions[field]?.length ? filterOptions[field].map(value => (
                    <label key={value} className="flex items-center px-1 py-0.5 cursor-pointer text-sm hover:bg-gray-700 rounded">
                      <input type="checkbox" checked={selectedFilters[field]?.includes(value) || false} onChange={() => handleFilterChange(field, value)} className="mr-2"/>
                      {value}
                    </label>
                  )) : <div className="text-xs text-gray-400 px-2">Нет значений</div>}
                  {filterOptions[field]?.length > 0 &&
                    <button className="mt-2 text-blue-400 text-xs hover:underline w-full text-left px-1" onClick={() => setSelectedFilters(prev => ({ ...prev, [field]: [] }))}>Сбросить</button>
                  }
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Добавить новую запись</h3>
        <form onSubmit={handleAddRow} className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
          {columns.filter(c => c.column_name !== "id" && c.column_name !== "created_at" && c.column_name !== "updated_at").map(col => (
            <div key={`new-${col.column_name}`} className="flex flex-col">
              <label className="text-xs mb-0.5 capitalize">{col.column_name}{col.is_nullable === "NO" ? " *" : ""}</label>
              {renderInputField(col, newRow[col.column_name], (value) => handleInputChange('new', col.column_name, value), 'new')}
               {jsonParseErrors[col.column_name] && <small className="text-red-500 mt-1">{jsonParseErrors[col.column_name]}</small>}
            </div>
          ))}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition">Добавить</button>
          </div>
        </form>
      </main>

      <div className="w-full px-2 md:px-6 mt-6">
        <div className="overflow-x-auto shadow-md rounded-lg">
          {loading ? <div>Загрузка...</div> : (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  {columns.map(col => <th key={col.column_name} className="p-2 border border-gray-600 font-semibold text-left">{col.column_name}</th>)}
                  <th className="p-2 border border-gray-600 font-semibold text-left">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {rows.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-gray-700 hover:bg-gray-700/50">
                    {columns.map(col => (
                      <td key={col.column_name} className="p-2 border border-gray-600 align-top max-w-[200px] overflow-x-auto">
                        {editRowId === row.id ? (
                          renderInputField(col, editRow[col.column_name], (value) => handleInputChange('edit', col.column_name, value), 'edit')
                        ) : typeof row[col.column_name] === "object" && row[col.column_name] !== null ? (
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(row[col.column_name], null, 2)}</pre>
                        ) : (
                          String(row[col.column_name] ?? "")
                        )}
                         {editRowId === row.id && jsonParseErrors[col.column_name] && <small className="text-red-500 mt-1">{jsonParseErrors[col.column_name]}</small>}
                      </td>
                    ))}
                    <td className="p-2 border border-gray-600 whitespace-nowrap align-top">
                      {editRowId === row.id ? (
                        <div className="flex flex-col gap-1">
                          <button className="text-xs px-2 py-1 rounded bg-green-600 hover:bg-green-700" onClick={() => handleEditSave(row.id)}>Сохранить</button>
                          <button className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500" onClick={handleEditCancel}>Отмена</button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <button className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700" onClick={() => handleEditStart(row)}>Редакт.</button>
                          <button className="text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-700" onClick={() => handleDeleteRow(row.id)}>Удалить</button>
                        </div>
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
