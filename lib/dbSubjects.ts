// lib/dbSubjects.ts
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/db";

const cache = new Map<string, Database["public"]["Tables"]["subjects"]["Row"]>();

export async function getSubject(slug: string) {
  const supabase = await createClient();
  if (cache.has(slug)) return cache.get(slug)!;
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) throw new Error("Unknown subject");
  cache.set(slug, data);
  return data;
}
