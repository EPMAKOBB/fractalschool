// src/app/lk/components/GenerateVariantButton.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onGenerate: () => Promise<void>;
  variantName?: string;
}

export default function GenerateVariantButton({ onGenerate, variantName = "вариант" }: Props) {
  const [isPending, start] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => start(() => onGenerate())}
      className="w-full"
    >
      {isPending ? "Генерирую…" : `Сгенерировать ${variantName}`}
    </Button>
  );
}
