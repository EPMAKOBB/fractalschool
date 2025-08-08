// /src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Создаём клиент для использования в браузерном окружении (в компонентах)
  // `!` в конце означает, что мы уверены, что эти переменные окружения существуют.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}