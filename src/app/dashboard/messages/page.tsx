import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ContactMessageList } from "@/components/contact-message-list"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Messages" }

export default async function CmsMessagesPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Messages from the contact form on your site, newest first.
        </p>
      </div>
      <ContactMessageList />
    </div>
  )
}
