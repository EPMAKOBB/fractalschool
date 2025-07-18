
// src/app/components/TaskComponents/TaskTable.tsx

import React from "react";

/** Table cell description used by `tables_data` */
export type TableCell = {
  text: string;
  rowspan?: number;
  colspan?: number;
  align?: "left" | "center" | "right";
  highlighted?: boolean;
};

/** A table is represented as an array of rows */
export type TableRow = TableCell[];
export type Table = TableRow[];


export default function TaskTable({children}: {children: React.ReactNode}) {
  return <table className="my-4">{children}</table>;
}

