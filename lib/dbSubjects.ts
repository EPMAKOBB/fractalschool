// lib/dbSubjects.ts
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types_db";

const cache = new Map<string, Database["public"]["Tables"]["subjects"]["Row"]>();

export async function getSubject(slug: string) {
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
