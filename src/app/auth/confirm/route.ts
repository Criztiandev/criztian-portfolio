import type { EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { LOGIN_PATH, RESET_PASSWORD_PATH } from "@/data/auth.data"
import { createSupabaseServerClient } from "@/lib/supabase/supabase.server"

const ALLOWED_NEXT_PATHS = [RESET_PASSWORD_PATH]

function resolveNextPath(requested: string | null): string {
  for (const allowed of ALLOWED_NEXT_PATHS) {
    if (requested === allowed) {
      return allowed
    }
  }

  return RESET_PASSWORD_PATH
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null
  const next = resolveNextPath(request.nextUrl.searchParams.get("next"))

  if (tokenHash === null || type === null) {
    redirect(`${LOGIN_PATH}?error=invalid_link`)
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error !== null) {
    redirect(`${LOGIN_PATH}?error=expired_link`)
  }

  redirect(next)
}
