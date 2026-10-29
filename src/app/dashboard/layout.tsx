import { redirect } from "next/navigation"

import { CmsSidebar } from "@/components/cms-sidebar"
import { Toaster } from "@/components/ui/toast"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  return (
    <div className="flex min-h-svh">
      <CmsSidebar userEmail={String(data.claims.email)} />
      <main className="min-w-0 flex-1 px-10 py-8">{children}</main>
      <Toaster />
    </div>
  )
}
