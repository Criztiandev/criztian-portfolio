import { redirect } from "next/navigation"

import { Toaster } from "@/components/ui/toast"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"

export default async function EditorLayout({
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
    <>
      <main className="h-svh overflow-x-auto overflow-y-hidden">
        {children}
      </main>
      <Toaster />
    </>
  )
}
