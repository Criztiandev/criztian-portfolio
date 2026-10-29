import type { Metadata } from "next"

import "./globals.css"
import { Providers } from "@/components/providers"
import { fontVariables } from "@/config/font.config"
import { siteConfig } from "@/config/site.config"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
      className={cn("antialiased", "font-sans", fontVariables)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
