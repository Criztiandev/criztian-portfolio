import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseEnv } from "@/config/env.config"
import type { Database } from "@/type/database.type"

export function createBrowserSupabase() {
  const env = getSupabaseEnv()
  return createBrowserClient<Database>(env.url, env.publishableKey)
}
