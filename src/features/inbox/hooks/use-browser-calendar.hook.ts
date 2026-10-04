import { useSyncExternalStore } from "react"

import { formatDayKey, readDateParts } from "@/features/inbox/inbox.rules"
import type { InboxCalendar } from "@/types/inbox.type"

function subscribeToNothing(): () => void {
  return function unsubscribe() {
    return
  }
}

function readBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function readBrowserToday(): string {
  const todayParts = readDateParts(
    new Date().toISOString(),
    readBrowserTimeZone()
  )

  return formatDayKey(todayParts)
}

function readServerValue(): string | null {
  return null
}

export function useBrowserCalendar(): InboxCalendar | null {
  const timeZone = useSyncExternalStore<string | null>(
    subscribeToNothing,
    readBrowserTimeZone,
    readServerValue
  )
  const today = useSyncExternalStore<string | null>(
    subscribeToNothing,
    readBrowserToday,
    readServerValue
  )

  if (timeZone === null || today === null) {
    return null
  }

  return { timeZone, today }
}
