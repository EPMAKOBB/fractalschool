// src/app/components/TaskComponents/TaskImage.tsx
"use client";

import React from "react";

export default function TaskImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  return <img src={src} alt={alt ?? ""} className={className ?? "max-w-full"} />;
}
