import { Antonio, Geist, Geist_Mono } from "next/font/google"

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontDisplay = Antonio({
  subsets: ["latin"],
  variable: "--font-display",
  display: "block",
})
