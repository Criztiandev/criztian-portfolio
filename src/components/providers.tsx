"use client"

import { Provider as JotaiProvider } from "jotai"
import { MotionConfig } from "motion/react"

import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/lib/trpc/client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider forcedTheme="dark">
        <MotionConfig reducedMotion="user">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MotionConfig>
      </ThemeProvider>
    </JotaiProvider>
  )
}
