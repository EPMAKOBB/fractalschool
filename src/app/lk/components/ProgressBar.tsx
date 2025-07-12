// src/app/lk/components/ProgressBar.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
}

export default function ProgressBar({ value, label, className, ...rest }: ProgressBarProps) {
  return (
    <div className={clsx("space-y-1", className)} {...rest}>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="h-2 w-full overflow-hidden rounded bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
