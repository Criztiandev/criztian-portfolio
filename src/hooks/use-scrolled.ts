import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => {
    window.removeEventListener("scroll", onChange)
  }
}

function isScrolled() {
  return window.scrollY > 0
}

function isScrolledOnServer() {
  return false
}

export function useScrolled() {
  return useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer)
}
