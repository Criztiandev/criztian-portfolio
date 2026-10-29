import { AppError } from "@/error/app.error"

function readSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }
}

export function hasSupabaseEnv(): boolean {
  const env = readSupabaseEnv()
  if (!env.url || !env.publishableKey) {
    return false
  }
  return true
}

export function getSupabaseEnv() {
  const env = readSupabaseEnv()
  if (!env.url || !env.publishableKey) {
    throw new AppError(
      "CONFIG_MISSING",
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    )
  }
  return { url: env.url, publishableKey: env.publishableKey }
}
