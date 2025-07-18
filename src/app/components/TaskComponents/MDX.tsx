// src/app/components/TaskComponents/MDX.tsx
"use client";

import React, { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";

export default function MDX({
  code,
  components,
  scope = {},
}: {
  code: string;
  components?: MDXComponents;
  scope?: Record<string, any>;
}) {
  const Component = useMemo(() => {
    try {
      const argNames = ["React", "_runtime", ...Object.keys(scope)];
      const argValues = [React, runtime, ...Object.values(scope)];
      const fn = new Function(...argNames, `${code}; return MDXContent;`);
      return fn(...argValues);
    } catch (e) {
      console.error("Failed to compile MDX", e);
      return () => <pre className="text-red-400">MDX error</pre>;
    }
  }, [code, scope]);

  return (
    <MDXProvider components={components}>{React.createElement(Component)}</MDXProvider>
  );
}
