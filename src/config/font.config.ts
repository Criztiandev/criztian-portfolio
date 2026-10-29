import { Anton, Inter } from "next/font/google"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const fontVariables = [anton.variable, inter.variable].join(" ")
