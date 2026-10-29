import { createClient } from "@supabase/supabase-js"

import { getSupabaseEnv } from "@/config/env.config"
import type { Database } from "@/type/database.type"

export function createPublicSupabase() {
  const env = getSupabaseEnv()
  return createClient<Database>(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { retry: false },
  })
}
