import { createBrowserClient } from "@supabase/ssr"

import { publicEnv } from "@/config/env.public"
import type { Database } from "@/types/database.type"

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}
