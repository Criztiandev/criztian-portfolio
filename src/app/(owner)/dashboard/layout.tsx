import { redirect } from "next/navigation"

import { LOGIN_PATH } from "@/data/auth.data"
import { createSupabaseServerClient } from "@/lib/supabase/supabase.server"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims == null) {
    redirect(LOGIN_PATH)
  }

  return <div className="mx-auto max-w-4xl px-4 py-12">{children}</div>
}
