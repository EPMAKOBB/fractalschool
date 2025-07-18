
// src/app/components/TaskComponents/TaskTable.tsx
"use client";

import React from "react";

export type TaskTableData = (string | number)[][];

export default function TaskTable({
  data,
  className,
}: {
  data: TaskTableData;
  className?: string;
}) {
  return (
    <table className={className ?? "border border-gray-500 rounded"}>
      <tbody>
        {data.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c} className="p-1 text-center border border-gray-600">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

}

