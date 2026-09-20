import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { LOGIN_PATH } from "@/data/auth.data"
import { ResetPasswordForm } from "@/features/auth/components/reset-password.form"
import { createSupabaseServerClient } from "@/lib/supabase/supabase.server"

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims == null) {
    redirect(`${LOGIN_PATH}?error=expired_link`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Choose a new password</h1>
      </div>

      <ResetPasswordForm />
    </div>
  )
}
