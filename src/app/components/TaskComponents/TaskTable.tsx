
// src/app/components/TaskComponents/TaskTable.tsx

import React from "react";


export default function TaskTable({children}: {children: React.ReactNode}) {
  return <table className="my-4">{children}</table>;
}

