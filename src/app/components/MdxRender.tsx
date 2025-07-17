'use client';
import { evaluateSync } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import mdxComponents from './TaskComponents/mdxComponents';
import { useMemo } from 'react';

export default function MdxRender({ source }: { source: string }) {
  const Content = useMemo(() => {
    try {
      return evaluateSync(source, { Fragment: runtime.Fragment, jsx: runtime.jsx, jsxs: runtime.jsxs, baseUrl: 'file://' }).default as any;
    } catch (err) {
      console.error('MDX evaluate error', err);
      return null;
    }
  }, [source]);

  if (!Content) {
    return <div className="prose prose-invert max-w-none mb-4">{source}</div>;
  }
  return (
    <div className="prose prose-invert max-w-none mb-4">
      <Content components={mdxComponents} />
    </div>
  );
}
