"use client"

import { MotionConfig } from "motion/react"

import { usePrefersReducedMotion } from "@/features/portfolio/hooks/use-motion-preference.hook"

export function MotionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isReduced = usePrefersReducedMotion()

  return (
    <MotionConfig reducedMotion={isReduced ? "always" : "user"}>
      {children}
    </MotionConfig>
  )
}
