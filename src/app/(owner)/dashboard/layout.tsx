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

  return <>{children}</>
}
