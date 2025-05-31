// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // автоматически подхватывать access_token & refresh_token из URL
      detectSessionInUrl: true,
      // автоматически обновлять токен и хранить в localStorage
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
