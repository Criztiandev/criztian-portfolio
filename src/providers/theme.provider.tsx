"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import * as React from "react"

import { THEME_TOGGLE_KEY, TYPING_TARGET_SELECTOR } from "@/data/theme.data"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.closest(TYPING_TARGET_SELECTOR)) {
    return true
  }

  return target.isContentEditable
}

export function shouldToggleTheme(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.repeat) {
    return false
  }

  if (event.metaKey || event.ctrlKey || event.altKey) {
    return false
  }

  if (typeof event.key !== "string") {
    return false
  }

  if (event.key.toLowerCase() !== THEME_TOGGLE_KEY) {
    return false
  }

  return !isTypingTarget(event.target)
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!shouldToggleTheme(event)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
