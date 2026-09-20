import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { publicEnv } from "@/config/env.public"
import { isProtectedPath, LOGIN_PATH } from "@/data/auth.data"
import type { Database } from "@/types/database.type"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          for (const item of cookiesToSet) {
            request.cookies.set(item.name, item.value)
          }

          supabaseResponse = NextResponse.next({ request })

          for (const item of cookiesToSet) {
            supabaseResponse.cookies.set(item.name, item.value, item.options)
          }

          for (const headerName of Object.keys(headers)) {
            supabaseResponse.headers.set(headerName, headers[headerName])
          }
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  if (claims === null && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = LOGIN_PATH
    redirectUrl.search = ""
    redirectUrl.searchParams.set("next", request.nextUrl.pathname)

    const redirectResponse = NextResponse.redirect(redirectUrl)

    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie)
    }

    for (const headerName of ["cache-control", "expires", "pragma"]) {
      const value = supabaseResponse.headers.get(headerName)

      if (value !== null) {
        redirectResponse.headers.set(headerName, value)
      }
    }

    return redirectResponse
  }

  return supabaseResponse
}
