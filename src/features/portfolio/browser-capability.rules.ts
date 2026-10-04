import {
  CUSTOM_CURSOR_QUERY,
  FINE_POINTER_QUERY,
  MOTION_PAUSED_STORAGE_KEY,
  MOTION_PAUSED_VALUE,
  MOTION_PREFERENCE_EVENT,
  REDUCED_MOTION_QUERY,
} from "@/data/motion.data"

function matchesMediaQuery(query: string): boolean {
  if (typeof window === "undefined") {
    return false
  }

  if (typeof window.matchMedia !== "function") {
    return false
  }

  return window.matchMedia(query).matches
}

function readMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null
  }

  if (typeof window.matchMedia !== "function") {
    return null
  }

  return window.matchMedia(query)
}

function storeMotionPaused(isPaused: boolean): void {
  try {
    if (isPaused) {
      window.localStorage.setItem(
        MOTION_PAUSED_STORAGE_KEY,
        MOTION_PAUSED_VALUE
      )
      return
    }

    window.localStorage.removeItem(MOTION_PAUSED_STORAGE_KEY)
  } catch {
    return
  }
}

export function hasIntersectionObserver(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return typeof window.IntersectionObserver === "function"
}

export function hasResizeObserver(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return typeof window.ResizeObserver === "function"
}

export function hasFontLoadingApi(): boolean {
  if (typeof document === "undefined") {
    return false
  }

  return "fonts" in document && document.fonts != null
}

export function isMotionPaused(): boolean {
  if (typeof document === "undefined") {
    return false
  }

  return document.documentElement.dataset.motion === MOTION_PAUSED_VALUE
}

export function prefersReducedMotion(): boolean {
  return matchesMediaQuery(REDUCED_MOTION_QUERY) || isMotionPaused()
}

export function prefersFinePointer(): boolean {
  return matchesMediaQuery(FINE_POINTER_QUERY)
}

export function supportsCustomCursor(): boolean {
  return matchesMediaQuery(CUSTOM_CURSOR_QUERY)
}

export function setMotionPaused(isPaused: boolean): void {
  const root = document.documentElement

  if (isPaused) {
    root.dataset.motion = MOTION_PAUSED_VALUE
  } else {
    delete root.dataset.motion
  }

  storeMotionPaused(isPaused)
  window.dispatchEvent(new Event(MOTION_PREFERENCE_EVENT))
}

export function subscribeMotionPreference(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return function releaseNothing() {}
  }

  const query = readMediaQuery(REDUCED_MOTION_QUERY)

  query?.addEventListener("change", onChange)
  window.addEventListener(MOTION_PREFERENCE_EVENT, onChange)

  return function releaseMotionPreference() {
    query?.removeEventListener("change", onChange)
    window.removeEventListener(MOTION_PREFERENCE_EVENT, onChange)
  }
}
