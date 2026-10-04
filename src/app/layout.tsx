import type { Metadata } from "next"
import Script from "next/script"

import "./globals.css"
import { MotionProvider } from "@/providers/motion.provider"
import { ThemeProvider } from "@/providers/theme.provider"
import { fontDisplay, fontSans } from "@/config/fonts.config"
import { publicEnv } from "@/config/env.public"
import {
  MOTION_RESTORE_SCRIPT,
  MOTION_RESTORE_SCRIPT_ID,
} from "@/data/motion.data"
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
        "font-sans",
        fontSans.variable,
        fontDisplay.variable
      )}
    >
      <body>
        <Script id={MOTION_RESTORE_SCRIPT_ID} strategy="beforeInteractive">
          {MOTION_RESTORE_SCRIPT}
        </Script>
        <TRPCReactProvider>
          <ThemeProvider>
            <MotionProvider>{children}</MotionProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
