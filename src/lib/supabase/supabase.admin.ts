import "server-only"

import { createClient } from "@supabase/supabase-js"

import { publicEnv } from "@/config/env.public"
import { serverEnv } from "@/config/env.server"
import type { Database } from "@/types/database.type"

export function createSupabaseAdminClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
