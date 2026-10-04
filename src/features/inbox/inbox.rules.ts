import { CONTACT_SERVICES } from "@/data/contact.data"
import {
  INBOX_COPY,
  INBOX_DATE_LOCALE,
  INBOX_DATE_PARTS_FORMAT,
  INBOX_DEFAULT_VIEW,
  INBOX_MAX_SHOWN,
  INBOX_PAGE_SIZE,
  INBOX_PATH,
  INBOX_PREVIEW_ELLIPSIS,
  INBOX_PREVIEW_MAX_CHARACTERS,
  INBOX_REPLY_SUBJECT,
  INBOX_SEARCH_PARAMS,
  INBOX_VIEWS,
} from "@/data/inbox.data"
import { MAILTO_PREFIX } from "@/data/page-sections.data"
import type { ContactService } from "@/types/contact.type"
import type {
  InboxCalendar,
  InboxDateFormat,
  InboxDateParts,
  InboxListItem,
  InboxListPage,
  InboxListRow,
  InboxLocation,
  InboxMessage,
  InboxMessageRow,
  InboxNotification,
  InboxSearchParams,
  InboxView,
} from "@/types/inbox.type"

function readSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0]
  }

  return null
}

function readPositiveInteger(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export function readInboxView(value: string | null): InboxView {
  for (const view of INBOX_VIEWS) {
    if (view === value) {
      return view
    }
  }

  return INBOX_DEFAULT_VIEW
}

export function readShownCount(value: string | null): number {
  const requested = readPositiveInteger(value)

  if (requested === null) {
    return INBOX_PAGE_SIZE
  }

  return Math.min(Math.max(requested, INBOX_PAGE_SIZE), INBOX_MAX_SHOWN)
}

export function readNextShownCount(shown: number): number {
  return Math.min(shown + INBOX_PAGE_SIZE, INBOX_MAX_SHOWN)
}

export function parseInboxLocation(params: InboxSearchParams): InboxLocation {
  const view = readSingleParam(params[INBOX_SEARCH_PARAMS.view])
  const messageId = readSingleParam(params[INBOX_SEARCH_PARAMS.message])
  const shown = readSingleParam(params[INBOX_SEARCH_PARAMS.shown])

  return {
    view: readInboxView(view),
    messageId: readPositiveInteger(messageId),
    shown: readShownCount(shown),
  }
}

export function buildInboxHref(location: InboxLocation): string {
  const params = new URLSearchParams()

  if (location.view !== INBOX_DEFAULT_VIEW) {
    params.set(INBOX_SEARCH_PARAMS.view, location.view)
  }

  if (location.shown !== INBOX_PAGE_SIZE) {
    params.set(INBOX_SEARCH_PARAMS.shown, String(location.shown))
  }

  if (location.messageId !== null) {
    params.set(INBOX_SEARCH_PARAMS.message, String(location.messageId))
  }

  const query = params.toString()

  if (query === "") {
    return INBOX_PATH
  }

  return `${INBOX_PATH}?${query}`
}

function truncateCharacters(text: string, limit: number): string {
  let truncated = ""
  let count = 0

  for (const character of text) {
    if (count === limit) {
      return `${truncated}${INBOX_PREVIEW_ELLIPSIS}`
    }

    truncated += character
    count += 1
  }

  return truncated
}

export function buildMessagePreview(message: string): string {
  for (const line of message.split("\n")) {
    const collapsed = line.replace(/\s+/g, " ").trim()

    if (collapsed.length > 0) {
      return truncateCharacters(collapsed, INBOX_PREVIEW_MAX_CHARACTERS)
    }
  }

  return ""
}

export function readContactService(
  value: string | null
): ContactService | null {
  for (const service of CONTACT_SERVICES) {
    if (service === value) {
      return service
    }
  }

  return null
}

export function buildInboxListPage(
  rows: InboxListRow[],
  limit: number
): InboxListPage {
  const items: InboxListItem[] = []

  for (const row of rows) {
    if (items.length === limit) {
      break
    }

    items.push({
      id: row.id,
      name: row.name,
      service: readContactService(row.service),
      preview: buildMessagePreview(row.message),
      receivedAt: row.created_at,
      isRead: row.read_at !== null,
    })
  }

  return { items, hasOlder: rows.length > limit }
}

export function resolveNotification(
  notifiedAt: string | null,
  notifyError: string | null
): InboxNotification {
  if (notifiedAt !== null) {
    return { status: "notified", notifiedAt }
  }

  if (notifyError !== null) {
    return { status: "failed" }
  }

  return { status: "none" }
}

export function buildInboxMessage(row: InboxMessageRow): InboxMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    service: readContactService(row.service),
    receivedAt: row.created_at,
    notification: resolveNotification(row.notified_at, row.notify_error),
    isRead: row.read_at !== null,
    isArchived: row.archived_at !== null,
  }
}

export function buildReplyHref(email: string): string {
  const encodedParts: string[] = []

  for (const part of email.split("@")) {
    encodedParts.push(encodeURIComponent(part))
  }

  const address = encodedParts.join("@")
  const subject = encodeURIComponent(INBOX_REPLY_SUBJECT)

  return `${MAILTO_PREFIX}${address}?subject=${subject}`
}

export function formatCountLabel(
  label: string,
  unreadCount: number | null
): string {
  if (unreadCount === null || unreadCount <= 0) {
    return label
  }

  return `${label}${INBOX_COPY.separator}${unreadCount} ${INBOX_COPY.newCount}`
}

export function readDateParts(iso: string, timeZone: string): InboxDateParts {
  const formatter = new Intl.DateTimeFormat(INBOX_DATE_LOCALE, {
    ...INBOX_DATE_PARTS_FORMAT,
    timeZone,
  })
  const parts: InboxDateParts = {
    weekday: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
  }

  for (const part of formatter.formatToParts(new Date(iso))) {
    switch (part.type) {
      case "weekday":
        parts.weekday = part.value
        break
      case "day":
        parts.day = part.value
        break
      case "month":
        parts.month = part.value
        break
      case "year":
        parts.year = part.value
        break
      case "hour":
        parts.hour = part.value
        break
      case "minute":
        parts.minute = part.value
        break
      default:
        break
    }
  }

  return parts
}

export function formatDayKey(parts: InboxDateParts): string {
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function formatInboxDate(
  iso: string,
  format: InboxDateFormat,
  calendar: InboxCalendar
): string {
  const parts = readDateParts(iso, calendar.timeZone)
  const time = `${parts.hour}:${parts.minute}`

  if (format === "time") {
    return time
  }

  if (format === "full") {
    return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}, ${time}`
  }

  if (formatDayKey(parts) === calendar.today) {
    return time
  }

  if (calendar.today.startsWith(`${parts.year}-`)) {
    return `${parts.day} ${parts.month}`
  }

  return `${parts.day} ${parts.month} ${parts.year}`
}
