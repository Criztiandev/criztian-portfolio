import { SiteShell } from "@/components/site-shell"
import { hasSupabaseEnv } from "@/config/env.config"
import { createPublicSupabase } from "@/lib/supabase/public"
import { themeSchema } from "@/model/theme.model"
import { listLiveEntriesIfReachable } from "@/service/cms.service"
import type { Theme } from "@/type/theme.type"

export const dynamic = "error"

export const revalidate = 3600

async function loadTheme(): Promise<Theme> {
  if (!hasSupabaseEnv()) {
    return themeSchema.parse({})
  }
  const entries = await listLiveEntriesIfReachable(
    createPublicSupabase(),
    "theme"
  )
  if (entries.length === 0) {
    return themeSchema.parse({})
  }
  return themeSchema.parse(entries[0].values)
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = await loadTheme()
  return <SiteShell theme={theme}>{children}</SiteShell>
}
