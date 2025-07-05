// /src/app/config/subjectsMeta.ts
export type SubjectMeta = {
  slug: string;           // 'inf-ege'
  label: string;          // 'ЕГЭ Информатика'
  icon?: string;          // '🖥️'
  color?: string;         // Tailwind / hex
  order?: number;         // сортировка в селекте
};

export const subjectsMeta: SubjectMeta[] = [
  { slug: "inf-ege",  label: "ЕГЭ Информатика", icon: "🖥️", order: 1 },
  { slug: "mathp-ege", label: "ЕГЭ Математика (профиль)", icon: "📈", order: 2 },
  // …
];