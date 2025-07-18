

// src/app/components/TaskComponents/TaskTable.tsx
"use client";


import React from "react";
import tables_data from "./tables_data";

// Тип ячейки таблицы. Если нужно объединение ячеек,
// передай объект { content, rowSpan?, colSpan? }
export type TableCell =
  | React.ReactNode
  | {
      content: React.ReactNode;
      rowSpan?: number;
      colSpan?: number;
    };

export type TableRow = TableCell[];
export type Table = TableRow[];

export type TaskTableProps = {
  /** Ключ внутри tables_data (если там объект таблиц) */
  dataKey?: string;
  /** Заголовок(и) таблицы */
  head?: TableRow | TableRow[];
  /** Подпись таблицы */
  caption?: string | string[];
  /** CSS-класс обёртки */
  className?: string;
};

/**
 * Универсальный компонент рендера таблицы.
 * Данные берутся из tables_data, а meta-инфо передаётся через props.
 */
export default function TaskTable({
  dataKey,
  head,
  caption,
  className,
}: TaskTableProps) {
  let data: any = tables_data;
  if (dataKey && data && typeof data === "object") {
    data = data[dataKey];
  }
  if (!data) return null;

  const tables: Table[] = Array.isArray(data) && Array.isArray(data[0])
    ? [data as Table]
    : Object.values(data as Record<string, Table>);

  const headRows: TableRow[] = !head
    ? []
    : Array.isArray(head[0])
    ? (head as TableRow[])
    : [head as TableRow];

  const captions: (string | undefined)[] = Array.isArray(caption)
    ? caption
    : tables.map(() => caption);

  const renderCell = (cell: TableCell, key: number) => {
    if (
      cell &&
      typeof cell === "object" &&
      !React.isValidElement(cell) &&
      "content" in cell
    ) {
      const { content, rowSpan, colSpan } = cell as any;
      return (
        <td
          key={key}
          rowSpan={rowSpan}
          colSpan={colSpan}
          className="border border-gray-400 px-2 py-1 text-center"
        >
          {content}
        </td>
      );
    }
    return (
      <td key={key} className="border border-gray-400 px-2 py-1 text-center">
        {cell as any}
      </td>
    );
  };



  );


}

