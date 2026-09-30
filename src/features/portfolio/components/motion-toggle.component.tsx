"use client"

import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HEADER_ICON_BUTTON_CLASS,
  MOTION_TOGGLE_CLASS,
  PAUSE_MOTION_LABEL,
  PLAY_MOTION_LABEL,
} from "@/data/navigation.data"
import { setMotionPaused } from "@/features/portfolio/browser-capability.rules"
import { useIsMotionPaused } from "@/features/portfolio/hooks/use-motion-preference.hook"
import { cn } from "@/lib/utils"

export function MotionToggle() {
  const isPaused = useIsMotionPaused()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isPaused ? PLAY_MOTION_LABEL : PAUSE_MOTION_LABEL}
      onClick={function toggleMotion() {
        setMotionPaused(!isPaused)
      }}
      className={cn(HEADER_ICON_BUTTON_CLASS, MOTION_TOGGLE_CLASS)}
    >
      {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </Button>
  )
}
