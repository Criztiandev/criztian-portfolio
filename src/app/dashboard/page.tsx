import { redirect } from "next/navigation"

import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  for (const collection of cmsCollections) {
    if (collection.single !== true) {
      redirect(`/dashboard/${collection.slug}`)
    }
  }
  redirect("/dashboard/messages")
}
