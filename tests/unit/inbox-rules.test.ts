import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import {
  INBOX_MAX_SHOWN,
  INBOX_PAGE_SIZE,
  INBOX_PATH,
  INBOX_PREVIEW_MAX_CHARACTERS,
} from "@/data/inbox.data"
import {
  inboxArchiveSchema,
  inboxListSchema,
  inboxReadSchema,
} from "@/features/inbox/schemas/inbox.schema"
import {
  buildInboxHref,
  buildInboxListPage,
  buildInboxMessage,
  buildMessagePreview,
  buildReplyHref,
  formatCountLabel,
  formatDayKey,
  formatInboxDate,
  parseInboxLocation,
  readContactService,
  readDateParts,
  readNextShownCount,
  readShownCount,
  resolveNotification,
} from "@/features/inbox/inbox.rules"
import type {
  InboxCalendar,
  InboxListRow,
  InboxLocation,
  InboxMessageRow,
} from "@/types/inbox.type"

const RECEIVED_AT = "2026-10-02T06:32:00.000Z"

const MANILA = "Asia/Manila"

function buildCalendar(todayIso: string, timeZone: string): InboxCalendar {
  return {
    timeZone,
    today: formatDayKey(readDateParts(todayIso, timeZone)),
  }
}

function buildListRow(id: number, overrides: Partial<InboxListRow> = {}) {
  const row: InboxListRow = {
    id,
    name: `Sender ${id}`,
    service: "branding",
    message: `Message ${id}`,
    created_at: RECEIVED_AT,
    read_at: null,
    ...overrides,
  }

  return row
}

function buildMessageRow(overrides: Partial<InboxMessageRow> = {}) {
  const row: InboxMessageRow = {
    id: 7,
    name: "Ada",
    email: "ada@example.test",
    message: "Hello\nthere",
    service: "web_design",
    created_at: RECEIVED_AT,
    notified_at: null,
    notify_error: null,
    read_at: null,
    archived_at: null,
    ...overrides,
  }

  return row
}

describe("parseInboxLocation", () => {
  it("defaults to the first page of the inbox with nothing open", () => {
    expect(parseInboxLocation({})).toEqual({
      view: "inbox",
      messageId: null,
      shown: INBOX_PAGE_SIZE,
    })
  })

  it("reads the archived view, the open message and the count shown", () => {
    expect(
      parseInboxLocation({ view: "archived", message: "42", shown: "50" })
    ).toEqual({ view: "archived", messageId: 42, shown: 50 })
  })

  it("falls back to the inbox for an unknown view", () => {
    expect(parseInboxLocation({ view: "spam" }).view).toBe("inbox")
  })

  it("ignores a message id that is not a positive whole number", () => {
    for (const value of ["0", "-1", "abc", "1.5", "1e3", "", "9".repeat(20)]) {
      expect(parseInboxLocation({ message: value }).messageId).toBeNull()
    }
  })

  it("takes the first value when a parameter repeats", () => {
    expect(
      parseInboxLocation({ view: ["archived", "inbox"], message: ["3", "4"] })
    ).toEqual({ view: "archived", messageId: 3, shown: INBOX_PAGE_SIZE })
  })

  it("keeps the count shown between one page and the maximum", () => {
    expect(readShownCount("5")).toBe(INBOX_PAGE_SIZE)
    expect(readShownCount("75")).toBe(75)
    expect(readShownCount(String(INBOX_MAX_SHOWN + 1))).toBe(INBOX_MAX_SHOWN)
    expect(readShownCount("lots")).toBe(INBOX_PAGE_SIZE)
    expect(readShownCount(null)).toBe(INBOX_PAGE_SIZE)
  })

  it("shows one more page at a time, up to the maximum", () => {
    expect(readNextShownCount(INBOX_PAGE_SIZE)).toBe(INBOX_PAGE_SIZE * 2)
    expect(readNextShownCount(INBOX_MAX_SHOWN - 1)).toBe(INBOX_MAX_SHOWN)
    expect(readNextShownCount(INBOX_MAX_SHOWN)).toBe(INBOX_MAX_SHOWN)
  })

  it("never asks PostgREST for more rows than it returns", () => {
    const config = readFileSync("supabase/config.toml", "utf8")
    const maxRows = /^max_rows\s*=\s*(\d+)/m.exec(config)

    expect(maxRows).not.toBeNull()
    expect(INBOX_MAX_SHOWN + 1).toBeLessThanOrEqual(Number(maxRows?.[1]))
    expect(INBOX_MAX_SHOWN % INBOX_PAGE_SIZE).toBe(0)
  })
})

describe("buildInboxHref", () => {
  it("leaves the defaults out of the address", () => {
    expect(
      buildInboxHref({
        view: "inbox",
        messageId: null,
        shown: INBOX_PAGE_SIZE,
      })
    ).toBe(INBOX_PATH)
  })

  it("names the view, the count shown and the open message", () => {
    expect(buildInboxHref({ view: "archived", messageId: 12, shown: 50 })).toBe(
      `${INBOX_PATH}?view=archived&shown=50&message=12`
    )
  })

  it("parses back to the same location", () => {
    const locations: InboxLocation[] = [
      { view: "inbox", messageId: null, shown: INBOX_PAGE_SIZE },
      { view: "inbox", messageId: 5, shown: 75 },
      { view: "archived", messageId: null, shown: INBOX_PAGE_SIZE },
      { view: "archived", messageId: 9, shown: 50 },
    ]

    for (const location of locations) {
      const query = buildInboxHref(location).split("?")[1] ?? ""
      const params: Record<string, string> = {}

      for (const [key, value] of new URLSearchParams(query)) {
        params[key] = value
      }

      expect(parseInboxLocation(params)).toEqual(location)
    }
  })
})

describe("buildMessagePreview", () => {
  it("shows the first line that has text, with its spaces collapsed", () => {
    expect(
      buildMessagePreview("\n  \r\n  Hi   there,\tfriend  \nLine two")
    ).toBe("Hi there, friend")
  })

  it("is empty for a message of only blank lines", () => {
    expect(buildMessagePreview(" \n\t\n")).toBe("")
  })

  it("cuts a long first line with an ellipsis, never inside a character", () => {
    const longLine = `${"🙂".repeat(INBOX_PREVIEW_MAX_CHARACTERS)}tail`
    const preview = buildMessagePreview(longLine)

    expect(Array.from(preview)).toHaveLength(INBOX_PREVIEW_MAX_CHARACTERS + 1)
    expect(preview.endsWith("🙂…")).toBe(true)
  })

  it("keeps a first line that is exactly the limit whole", () => {
    const exact = "a".repeat(INBOX_PREVIEW_MAX_CHARACTERS)

    expect(buildMessagePreview(exact)).toBe(exact)
  })
})

describe("the list page", () => {
  it("shows the limit and offers older messages when one more came back", () => {
    const rows = [buildListRow(3), buildListRow(2), buildListRow(1)]
    const page = buildInboxListPage(rows, 2)
    const shownIds: number[] = []

    for (const item of page.items) {
      shownIds.push(item.id)
    }

    expect(page.hasOlder).toBe(true)
    expect(shownIds).toEqual([3, 2])
  })

  it("offers nothing older when every row fits", () => {
    const page = buildInboxListPage([buildListRow(2), buildListRow(1)], 2)

    expect(page.hasOlder).toBe(false)
    expect(page.items).toHaveLength(2)
  })

  it("marks read rows, previews the text and drops an unknown service", () => {
    const page = buildInboxListPage(
      [
        buildListRow(1, {
          read_at: RECEIVED_AT,
          service: "legacy",
          message: "First\nSecond",
        }),
      ],
      INBOX_PAGE_SIZE
    )

    expect(page.items[0]).toEqual({
      id: 1,
      name: "Sender 1",
      service: null,
      preview: "First",
      receivedAt: RECEIVED_AT,
      isRead: true,
    })
  })

  it("accepts only the four services", () => {
    expect(readContactService("development")).toBe("development")
    expect(readContactService("Development")).toBeNull()
    expect(readContactService(null)).toBeNull()
  })
})

describe("one message", () => {
  it("maps the stored row and its states", () => {
    const message = buildInboxMessage(
      buildMessageRow({ read_at: RECEIVED_AT, archived_at: RECEIVED_AT })
    )

    expect(message).toEqual({
      id: 7,
      name: "Ada",
      email: "ada@example.test",
      message: "Hello\nthere",
      service: "web_design",
      receivedAt: RECEIVED_AT,
      notification: { status: "none" },
      isRead: true,
      isArchived: true,
    })
  })

  it("reports the notification as sent, failed or not recorded", () => {
    expect(resolveNotification(RECEIVED_AT, null)).toEqual({
      status: "notified",
      notifiedAt: RECEIVED_AT,
    })
    expect(resolveNotification(null, "disk full")).toEqual({
      status: "failed",
    })
    expect(resolveNotification(null, null)).toEqual({ status: "none" })
    expect(resolveNotification(RECEIVED_AT, "old error")).toEqual({
      status: "notified",
      notifiedAt: RECEIVED_AT,
    })
  })

  it("replies to the sender with the approved subject", () => {
    expect(buildReplyHref("ada@example.test")).toBe(
      "mailto:ada@example.test?subject=Re%3A%20Your%20message"
    )
  })

  it("encodes anything in the address that would break the link", () => {
    expect(buildReplyHref("a+b&c?d@example.test")).toBe(
      "mailto:a%2Bb%26c%3Fd@example.test?subject=Re%3A%20Your%20message"
    )
  })
})

describe("formatCountLabel", () => {
  it("adds the unread count only when there is one", () => {
    expect(formatCountLabel("Inbox", 2)).toBe("Inbox · 2 new")
    expect(formatCountLabel("Open the inbox", 1)).toBe("Open the inbox · 1 new")
    expect(formatCountLabel("Inbox", 0)).toBe("Inbox")
    expect(formatCountLabel("Inbox", null)).toBe("Inbox")
  })
})

describe("formatInboxDate", () => {
  it("shows the time on the 24-hour clock in the reader's time zone", () => {
    const calendar = buildCalendar(RECEIVED_AT, MANILA)

    expect(formatInboxDate(RECEIVED_AT, "time", calendar)).toBe("14:32")
    expect(
      formatInboxDate(RECEIVED_AT, "time", buildCalendar(RECEIVED_AT, "UTC"))
    ).toBe("06:32")
  })

  it("writes the full date the way the owner approved", () => {
    expect(
      formatInboxDate(RECEIVED_AT, "full", buildCalendar(RECEIVED_AT, MANILA))
    ).toBe("Fri 2 Oct 2026, 14:32")
  })

  it("lists today's messages by time, this year's by day, older by year", () => {
    const calendar = buildCalendar(RECEIVED_AT, MANILA)

    expect(formatInboxDate("2026-10-01T23:30:00.000Z", "list", calendar)).toBe(
      "07:30"
    )
    expect(formatInboxDate("2026-10-01T06:32:00.000Z", "list", calendar)).toBe(
      "1 Oct"
    )
    expect(formatInboxDate("2025-09-28T06:32:00.000Z", "list", calendar)).toBe(
      "28 Sep 2025"
    )
  })

  it("decides today in the reader's time zone, not the server's", () => {
    const lateEvening = "2026-10-01T15:30:00.000Z"

    expect(
      formatInboxDate(lateEvening, "list", buildCalendar(RECEIVED_AT, MANILA))
    ).toBe("1 Oct")
    expect(
      formatInboxDate(lateEvening, "list", buildCalendar(RECEIVED_AT, "UTC"))
    ).toBe("1 Oct")
    expect(
      formatInboxDate(
        lateEvening,
        "list",
        buildCalendar("2026-10-01T20:00:00.000Z", "UTC")
      )
    ).toBe("15:30")
  })

  it("never writes midnight as 24 or September as Sept", () => {
    const midnight = "2026-09-14T16:05:00.000Z"
    const calendar = buildCalendar(RECEIVED_AT, MANILA)

    expect(formatInboxDate(midnight, "time", calendar)).toBe("00:05")
    expect(formatInboxDate(midnight, "list", calendar)).toBe("15 Sep")
  })
})

describe("the inbox inputs", () => {
  it("accepts a page within the maximum and rejects anything else", () => {
    expect(
      inboxListSchema.safeParse({ view: "inbox", limit: INBOX_PAGE_SIZE })
        .success
    ).toBe(true)
    expect(
      inboxListSchema.safeParse({ view: "inbox", limit: INBOX_MAX_SHOWN + 1 })
        .success
    ).toBe(false)
    expect(
      inboxListSchema.safeParse({ view: "trash", limit: INBOX_PAGE_SIZE })
        .success
    ).toBe(false)
  })

  it("needs a positive whole message id and a flag", () => {
    expect(inboxReadSchema.safeParse({ id: 3, isRead: true }).success).toBe(
      true
    )
    expect(inboxReadSchema.safeParse({ id: 0, isRead: true }).success).toBe(
      false
    )
    expect(
      inboxArchiveSchema.safeParse({ id: 2.5, isArchived: true }).success
    ).toBe(false)
    expect(inboxArchiveSchema.safeParse({ id: 2 }).success).toBe(false)
  })
})
