import "server-only"

import type { CookieMethodsServer } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabaseEnv } from "@/config/env.config"
import type { Database } from "@/type/database.type"

export async function createServerSupabase() {
  const cookieStore = await cookies()
  const env = getSupabaseEnv()
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      try {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options)
        }
      } catch {}
    },
  }
  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: cookieMethods,
  })
}
