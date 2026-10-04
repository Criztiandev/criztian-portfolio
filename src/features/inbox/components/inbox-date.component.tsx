"use client"

import { useBrowserCalendar } from "@/features/inbox/hooks/use-browser-calendar.hook"
import { formatInboxDate } from "@/features/inbox/inbox.rules"
import type { InboxDateFormat } from "@/types/inbox.type"

export function InboxDate({
  iso,
  format,
}: Readonly<{ iso: string; format: InboxDateFormat }>) {
  const calendar = useBrowserCalendar()
  const label = calendar === null ? "" : formatInboxDate(iso, format, calendar)

  return <time dateTime={iso}>{label}</time>
}
