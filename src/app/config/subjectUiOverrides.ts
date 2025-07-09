// src/app/config/subjectUiOverrides.ts
export type SubjectUIOverride = {
  slug: string;
  icon?: string;
  color?: string; // Tailwind color class e.g., "text-blue-400"
  order?: number;
};

export const subjectUiOverrides: SubjectUIOverride[] = [
  { slug: "inf-ege", icon: "🖥️", order: 1, color: "text-blue-400" },
  { slug: "mathp-ege", icon: "📈", order: 2, color: "text-green-400" },
  { slug: "phys-ege", icon: "⚛️", order: 3, color: "text-purple-400" },
  // Add other subjects that were in subjectsMeta.ts or new ones
  // Example:
  // { slug: "inf-oge", icon: "💻", order: 4, color: "text-sky-400" },
  // { slug: "math-oge", icon: "📊", order: 5, color: "text-lime-400" },
];

// It might be more efficient to have this as a map for easier lookup
export const subjectUiOverridesMap: Map<string, SubjectUIOverride> = new Map(
  subjectUiOverrides.map(item => [item.slug, item])
);
