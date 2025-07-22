// // src/app/components/TaskComponents/MDX.tsx

// import * as React from "react";
// import { MDXProvider } from "@mdx-js/react";
// import { useMemo } from "react";

// // Нужно будет установить пакет: npm install @mdx-js/react @mdx-js/runtime

// import { MDXRuntime } from "@mdx-js/runtime";

// interface MDXProps {
//   code: string; // MDX-текст задачи или решения
//   components?: Record<string, React.ComponentType<any>>; // Встраиваемые компоненты
//   scope?: Record<string, any>; // Данные, доступные внутри MDX
// }

// export default function MDX({ code, components = {}, scope = {} }: MDXProps) {
//   // Используем @mdx-js/runtime для динамического рендеринга
//   // (если нужен только статический импорт — можно использовать next-mdx-remote, но этот способ проще и гибче)
//   return (
//     <MDXProvider components={components}>
//       <MDXRuntime components={components} scope={scope}>
//         {code}
//       </MDXRuntime>
//     </MDXProvider>
//   );
// }
