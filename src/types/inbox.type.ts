import type { SupabaseClient } from "@supabase/supabase-js"
import type { z } from "zod"

import type { INBOX_VIEWS } from "@/data/inbox.data"
import type {
  inboxArchiveSchema,
  inboxListSchema,
  inboxMessageIdSchema,
  inboxReadSchema,
} from "@/features/inbox/schemas/inbox.schema"
import type { ContactService } from "@/types/contact.type"
import type { Database } from "@/types/database.type"

export type InboxView = (typeof INBOX_VIEWS)[number]

export type InboxSupabaseClient = SupabaseClient<Database>

export type InboxListInput = z.output<typeof inboxListSchema>

export type InboxMessageIdInput = z.output<typeof inboxMessageIdSchema>

export type InboxReadInput = z.output<typeof inboxReadSchema>

export type InboxArchiveInput = z.output<typeof inboxArchiveSchema>

export type InboxSearchParams = Record<string, string | string[] | undefined>

export type InboxLocation = {
  view: InboxView
  messageId: number | null
  shown: number
}

export type InboxListRow = {
  id: number
  name: string
  service: string | null
  message: string
  created_at: string
  read_at: string | null
}

export type InboxMessageRow = {
  id: number
  name: string
  email: string
  message: string
  service: string | null
  created_at: string
  notified_at: string | null
  notify_error: string | null
  read_at: string | null
  archived_at: string | null
}

export type InboxListItem = {
  id: number
  name: string
  service: ContactService | null
  preview: string
  receivedAt: string
  isRead: boolean
}

export type InboxListPage = {
  items: InboxListItem[]
  hasOlder: boolean
}

export type InboxNotification =
  | { status: "notified"; notifiedAt: string }
  | { status: "failed" }
  | { status: "none" }

export type InboxMessage = {
  id: number
  name: string
  email: string
  message: string
  service: ContactService | null
  receivedAt: string
  notification: InboxNotification
  isRead: boolean
  isArchived: boolean
}

export type InboxDateFormat = "list" | "full" | "time"

export type InboxDateParts = {
  weekday: string
  day: string
  month: string
  year: string
  hour: string
  minute: string
}

export type InboxCalendar = {
  timeZone: string
  today: string
}
