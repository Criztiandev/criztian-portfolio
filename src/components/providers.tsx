"use client"

import { Provider as JotaiProvider } from "jotai"

import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/lib/trpc/client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider forcedTheme="dark">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </JotaiProvider>
  )
}
