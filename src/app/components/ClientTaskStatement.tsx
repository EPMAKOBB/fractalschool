// src/app/components/ClientTaskStatement.tsx
"use client";

import MdxRender from "./MdxRender";

type Props = {
  mdx: string;
};

export default function ClientTaskStatement({ mdx }: Props) {
  return <MdxRender source={mdx} />;
}
