import type { InboxView } from "@/types/inbox.type"

export const INBOX_PATH = "/dashboard/inbox"

export const INBOX_VIEWS = ["inbox", "archived"] as const

export const INBOX_DEFAULT_VIEW: InboxView = "inbox"

export const INBOX_PAGE_SIZE = 25

export const INBOX_MAX_SHOWN = 975

export const INBOX_PREVIEW_MAX_CHARACTERS = 160

export const INBOX_PREVIEW_ELLIPSIS = "…"

export const INBOX_SEARCH_PARAMS = {
  view: "view",
  message: "message",
  shown: "shown",
} as const

export const INBOX_LIST_COLUMNS =
  "id, name, service, message, created_at, read_at"

export const INBOX_MESSAGE_COLUMNS =
  "id, name, email, message, service, created_at, notified_at, notify_error, read_at, archived_at"

export const INBOX_REPLY_SUBJECT = "Re: Your message"

export const INBOX_DATE_LOCALE = "en-US"

export const INBOX_DATE_PARTS_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
}

export const INBOX_LIST_HEADING_ID = "inbox-list-heading"

export const INBOX_LIST_ID = "inbox-list"

export const INBOX_MESSAGE_HEADING_ID = "inbox-message-heading"

export const INBOX_COPY = {
  pageTitle: "Inbox",
  dashboardLink: "Open the inbox",
  backToDashboard: "Dashboard",
  viewTitles: {
    inbox: "Inbox",
    archived: "Archived",
  },
  separator: " · ",
  newCount: "new",
  emptyLists: {
    inbox: "No messages yet.",
    archived: "Nothing archived.",
  },
  noneSelected: "Select a message to read it.",
  showOlder: "Show older",
  newMarker: "New",
  reply: "Reply",
  markUnread: "Mark as unread",
  archive: "Archive",
  restore: "Move to inbox",
  delete: "Delete",
  deleteConfirm: "Delete this message for good?",
  missing: "This message no longer exists.",
  notifiedAt: "Notified at",
  notifyFailed: "Notification failed",
  notNotified: "Not notified",
  updateFailed: "Could not update the message. Try again.",
  deleteFailed: "Could not delete the message. Try again.",
} as const

export const INBOX_LOAD_FAILED_MESSAGE = "inbox_load_failed"
