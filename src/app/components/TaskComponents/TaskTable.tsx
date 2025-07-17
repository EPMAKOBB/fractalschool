// src/app/components/TaskComponents/TaskTable.tsx

import React from "react";

/**
 * Render a table described by `tables_data`.
 *
 * `tables_data` maps keys to arrays of rows:
 * ```ts
 * {
 *   [key: string]: TableRow[];
 * }
 * ```
 * where `TableRow` is `TableCell[]` and each cell can have:
 * `text`, `rowspan`, `colspan`, `align`, and `highlighted`.
 */

export type TableCell = {
  text: string;
  rowspan?: number;
  colspan?: number;
  align?: "left" | "center" | "right";
  highlighted?: boolean;
};

export type TableRow = TableCell[];

export default function TaskTable({ rows }: { rows: TableRow[] }) {
  return (
    <table className="border-collapse my-2">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((cell, j) => (
              <td
                key={j}
                rowSpan={cell.rowspan}
                colSpan={cell.colspan}
                className={`border px-2 py-1 text-${cell.align ?? "center"} ${
                  cell.highlighted ? "bg-yellow-200" : ""
                }`}
              >
                {cell.text}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

