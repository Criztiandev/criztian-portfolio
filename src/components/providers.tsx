"use client"

import { Provider as JotaiProvider } from "jotai"
import { MotionConfig } from "motion/react"
import { usePathname } from "next/navigation"

import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/lib/trpc/client"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  let forcedTheme: string | undefined = "light"
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/editor")) {
    forcedTheme = undefined
  }
  return (
    <JotaiProvider>
      <ThemeProvider forcedTheme={forcedTheme}>
        <MotionConfig reducedMotion="user">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MotionConfig>
      </ThemeProvider>
    </JotaiProvider>
  )
}
