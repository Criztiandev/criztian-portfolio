import type { ReactNode } from "react"

import { SiteHeader } from "@/components/site-header"
import type { Theme } from "@/type/theme.type"
import { themeCss } from "@/util/theme.util"

export function SiteShell({
  theme,
  children,
}: {
  theme: Theme
  children: ReactNode
}) {
  return (
    <>
      <style>{themeCss(theme)}</style>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">{children}</main>
    </>
  )
}
