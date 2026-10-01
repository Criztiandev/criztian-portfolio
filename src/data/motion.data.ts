import type { Transition, Variants } from "motion/react"

import { SIGNAL_EASE } from "@/data/hero.data"
import type { CursorTuning } from "@/types/portfolio.type"

export const SMOOTH_SCROLL_LERP = 0.1

export const SMOOTH_SCROLL_REST_VELOCITY = 0.001

export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export const MOTION_PAUSED_VALUE = "paused"

export const MOTION_PAUSED_STORAGE_KEY = "criztian:motion"

export const MOTION_PREFERENCE_EVENT = "criztian:motion-preference"

export const MOTION_RESTORE_SCRIPT_ID = "motion-restore"

export const MOTION_RESTORE_SCRIPT = `try{if(localStorage.getItem("${MOTION_PAUSED_STORAGE_KEY}")==="${MOTION_PAUSED_VALUE}"){document.documentElement.dataset.motion="${MOTION_PAUSED_VALUE}"}}catch{}`

export const CAPTION_LINE_STAGGER = 0.15

export const CAPTION_CASCADE_SPREAD = 0.6

export const COPY_DRIFT_PX = 40

export const ORBIT_RING_SPIN_RATIO = 0.8

export const ORBIT_DIGIT_TILTS_DEGREES = [
  6, 26, 14, -8, -17, 24, 11, -21, 19, -12,
]

export const NAV_DOT_LAYOUT_ID = "nav-dot"

export const INDICATOR_TRANSITION: Transition = {
  duration: 0.3,
  ease: SIGNAL_EASE,
}

export const HEADER_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
}

export const HEADER_GROUP_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export const MOBILE_MENU_WIPE_CLASS =
  "[clip-path:inset(0)] transition-[clip-path] duration-300 ease-signal starting:[clip-path:inset(0_0_100%_0)] motion-reduce:transition-none"

export const CURSOR_TUNING: CursorTuning = {
  dotSize: 6,
  ringSize: 36,
  actionSize: 56,
  ringOpacity: 0.4,
  spring: {
    stiffness: 200,
    damping: 28,
    mass: 1,
    restDelta: 0.5,
    restSpeed: 2,
  },
  stretchSpring: {
    stiffness: 200,
    damping: 28,
    mass: 1,
    restDelta: 0.001,
    restSpeed: 0.01,
  },
  stretchVelocity: 2400,
  stretchScale: 1.3,
}

export const CURSOR_ACTION_SELECTOR =
  "a[href], button:not(:disabled), summary, label:has(> input[type='radio'])"

export const CURSOR_FIELD_SELECTOR = "input, textarea, select"

export const CUSTOM_CURSOR_QUERY = `${FINE_POINTER_QUERY} and (forced-colors: none)`
