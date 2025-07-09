// lib/dbSubjects.ts
import { cache } from 'react'; // Import React's cache function
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types_db";
import { subjectUiOverridesMap } from "@/app/config/subjectUiOverrides";

export type SubjectMeta = {
  id: string;
  slug: string;
  label: string;
  exam_type: string;
  year: number;
  icon?: string;
  color?: string;
  order?: number;
};

// Helper function remains the same
function applyUiOverrides(subjectData: Database["public"]["Tables"]["subjects"]["Row"]): SubjectMeta {
  const override = subjectUiOverridesMap.get(subjectData.slug);
  return {
    id: subjectData.id,
    slug: subjectData.slug,
    label: subjectData.title,
    exam_type: subjectData.exam_type,
    year: subjectData.year,
    icon: override?.icon || "📚",
    color: override?.color || "text-gray-400",
    order: override?.order || 99,
  };
}

// Cached function to get all subjects
export const getAllSubjectsWithUITweaks = cache(async (): Promise<SubjectMeta[]> => {
  console.log("Fetching all subjects from DB (cache miss or revalidation)");
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, title, exam_type, year");

  if (error || !data) {
    console.error("Error fetching subjects:", error);
    return [];
  }

  const subjectsWithMeta = data.map(applyUiOverrides).sort((a, b) => (a.order || 99) - (b.order || 99));
  return subjectsWithMeta;
});


// Cached function to get a single subject by slug
export const getSubject = cache(async (slug: string): Promise<SubjectMeta | null> => {
  console.log(`Fetching subject ${slug} from DB (cache miss or revalidation)`);
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, title, exam_type, year")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(`Error fetching subject ${slug}:`, error);
    return null;
  }

  return applyUiOverrides(data);
});

/*
Note on Next.js Caching with React `cache`:
The `cache` function from `react` (used by Next.js) memoizes the result of the async function.
By default, in Next.js App Router, data fetched this way is cached indefinitely until a revalidation occurs.
Revalidation can be configured via:
1. Time-based revalidation: Using Route Segment Config options like `export const revalidate = 3600;` in page/layout files.
   This would apply to all data fetches within that segment.
2. On-demand revalidation: Using `revalidateTag` or `revalidatePath` (more complex, involves API routes and tagging data fetches).

For this step, we are replacing the manual in-memory cache with `React.cache`.
The actual revalidation strategy (time-based or on-demand) would typically be set in the page/layout components
that consume these data-fetching functions or globally in the Next.js config if applicable.
The `console.log` statements are added to help observe caching behavior during development/testing.
The manual TTL logic has been removed as `React.cache` and Next.js's data cache handle this.
*/
