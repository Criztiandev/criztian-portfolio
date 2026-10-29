import type { CookieMethodsServer } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSupabaseEnv, hasSupabaseEnv } from "@/config/env.config"
import { siteConfig } from "@/config/site.config"
import type { Database } from "@/type/database.type"

function isProtectedPath(pathname: string): boolean {
  for (const prefix of siteConfig.protectedPathPrefixes) {
    if (pathname.startsWith(prefix)) {
      return true
    }
  }
  return false
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv() || !isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next({ request })
  }
  const env = getSupabaseEnv()
  let supabaseResponse = NextResponse.next({ request })
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet, headers) {
      for (const cookie of cookiesToSet) {
        request.cookies.set(cookie.name, cookie.value)
      }
      supabaseResponse = NextResponse.next({ request })
      for (const cookie of cookiesToSet) {
        supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
      }
      for (const [key, value] of Object.entries(headers)) {
        supabaseResponse.headers.set(key, value)
      }
    },
  }
  const supabase = createServerClient<Database>(env.url, env.publishableKey, {
    cookies: cookieMethods,
  })
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    const url = request.nextUrl.clone()
    url.pathname = siteConfig.loginPath
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}
