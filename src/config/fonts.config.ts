import { Antonio, Geist } from "next/font/google"

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontDisplay = Antonio({
  subsets: ["latin"],
  variable: "--font-display",
  display: "block",
})
