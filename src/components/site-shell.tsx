import type { ReactNode } from "react"

import { BookingDialog } from "@/components/booking-dialog"
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
      <main>{children}</main>
      <BookingDialog />
    </>
  )
}
