// src/app/components/ClientTaskStatement.tsx
"use client";

type Props = {
  html: string;
};

export default function ClientTaskStatement({ html }: Props) {
  return (
    <div className="mb-4" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
