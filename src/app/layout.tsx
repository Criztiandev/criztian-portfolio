import type { Metadata } from "next"

import "./globals.css"
import { MotionProvider } from "@/providers/motion.provider"
import { ThemeProvider } from "@/providers/theme.provider"
import { fontDisplay, fontMono, fontSans } from "@/config/fonts.config"
import { publicEnv } from "@/config/env.public"
import { TRPCReactProvider } from "@/lib/trpc/trpc.client"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: "Criztian — Portfolio",
  description: "Personal portfolio and contact.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable,
        fontDisplay.variable
      )}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            <MotionProvider>{children}</MotionProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
