// src/app/components/TaskComponents/SideBySide.tsx

import React from "react";

export default function SideBySide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8 my-6 w-full">
      {children}
    </div>
  );
}
