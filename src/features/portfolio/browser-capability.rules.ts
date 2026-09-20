const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

function matchesMediaQuery(query: string): boolean {
  if (typeof window === "undefined") {
    return false
  }

  if (typeof window.matchMedia !== "function") {
    return false
  }

  return window.matchMedia(query).matches
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

export function prefersReducedMotion(): boolean {
  return matchesMediaQuery(REDUCED_MOTION_QUERY)
}

export function prefersFinePointer(): boolean {
  return matchesMediaQuery(FINE_POINTER_QUERY)
}

export function readReducedMotionQuery(): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null
  }

  if (typeof window.matchMedia !== "function") {
    return null
  }

  return window.matchMedia(REDUCED_MOTION_QUERY)
}
