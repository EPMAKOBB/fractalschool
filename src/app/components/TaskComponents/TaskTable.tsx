// src/app/components/TaskComponents/TaskTable.tsx

import React from "react";
import clsx from "clsx";

type TableCell =
  | string
  | number
  | {
      value: React.ReactNode;
      colspan?: number;
      rowspan?: number;
      width?: number | string;
      height?: number | string;
      className?: string;
      style?: React.CSSProperties;
      bg?: string; // <--- добавили поддержку bg
    };

interface TaskTableProps {
  table: {
    header?: TableCell[];
    subheader?: TableCell[];
    rows: TableCell[][];
  };
  caption?: string;
  className?: string;
}

// Функция для формирования итогового класса ячейки
function getCellClass(cell: any) {
  let classes = cell.className ?? "";
  if (cell.bg) {
    classes += ` ${cell.bg}`; // просто добавляем Tailwind класс заливки
  }
  return classes;
}

export default function TaskTable({ table, caption, className }: TaskTableProps) {
  // Рендер ячейки (универсально)
  const renderCell = (
    cell: TableCell,
    i: number,
    tag: "td" | "th" = "td",
    forceRotate?: boolean
  ) => {
    if (typeof cell === "object" && cell !== null) {
      const {
        value,
        colspan,
        rowspan,
        width,
        height,
        style,
      } = cell;
      const Tag = tag;
      // Добавим поворот текста для subheader
      const rotateStyle = forceRotate
        ? {
            writingMode: "vertical-lr" as const,
            transform: "rotate(180deg)",
            ...style,
          }
        : style;
      return (
        <Tag
          key={i}
          colSpan={colspan}
          rowSpan={rowspan}
          width={width}
          height={height}
          className={clsx("border px-2 py-1 text-center", getCellClass(cell))}
          style={rotateStyle}
        >
          {value}
        </Tag>
      );
    }
    const Tag = tag;
    return (
      <Tag
        key={i}
        className={clsx(
          "border px-2 py-1 text-center",
          forceRotate && "rotate-180 writing-mode-vertical-lr"
        )}
        style={
          forceRotate
            ? { writingMode: "vertical-lr", transform: "rotate(180deg)" }
            : undefined
        }
      >
        {cell}
      </Tag>
    );
  };

  if (!table || !Array.isArray(table.rows)) {
    return <div className="text-red-500">Нет данных для таблицы</div>;
  }
  return (
    <table className={className ?? "border-collapse border w-full my-2"}>
      {caption && (
        <caption className="text-xs text-muted-foreground pb-1">{caption}</caption>
      )}
      {table.header && (
        <thead>
          <tr>
            {table.header.map((cell, i) => renderCell(cell, i, "th"))}
          </tr>
          {table.subheader && (
            <tr>
              {table.subheader.map((cell, i) => renderCell(cell, i, "th", true))}
            </tr>
          )}
        </thead>
      )}
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => renderCell(cell, j, "td"))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
