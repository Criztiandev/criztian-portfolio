import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  INBOX_COPY,
  INBOX_LIST_HEADING_ID,
  INBOX_LIST_ID,
  INBOX_MAX_SHOWN,
  INBOX_MESSAGE_HEADING_ID,
  INBOX_PAGE_SIZE,
  INBOX_PATH,
} from "@/data/inbox.data"
import { Inbox } from "@/features/inbox/components/inbox.component"
import { InboxFocus } from "@/features/inbox/components/inbox-focus.component"
import { InboxList } from "@/features/inbox/components/inbox-list.component"
import { InboxMessagePane } from "@/features/inbox/components/inbox-message.component"
import { InboxMessageActions } from "@/features/inbox/components/inbox-message-actions.component"
import type {
  InboxListItem,
  InboxListPage,
  InboxLocation,
  InboxMessage,
} from "@/types/inbox.type"

const routerStub = {
  replace: vi.fn(),
  refresh: vi.fn(),
}

const setReadStub = vi.fn()

const setArchivedStub = vi.fn()

const removeStub = vi.fn()

vi.mock("next/navigation", function mockNavigation() {
  return {
    useRouter: function useRouter() {
      return routerStub
    },
  }
})

vi.mock("@/lib/trpc/trpc.client", function mockTrpcClient() {
  return {
    useTRPC: function useTRPC() {
      return {
        inbox: {
          setRead: {
            mutationOptions: function mutationOptions(options: object) {
              return { ...options, mutationFn: setReadStub }
            },
          },
          setArchived: {
            mutationOptions: function mutationOptions(options: object) {
              return { ...options, mutationFn: setArchivedStub }
            },
          },
          remove: {
            mutationOptions: function mutationOptions(options: object) {
              return { ...options, mutationFn: removeStub }
            },
          },
        },
      }
    },
  }
})

const RECEIVED_AT = "2026-10-02T06:32:00.000Z"

const INBOX_HOME: InboxLocation = {
  view: "inbox",
  messageId: null,
  shown: INBOX_PAGE_SIZE,
}

const LIST_HREF = INBOX_PATH

function buildItem(id: number, overrides: Partial<InboxListItem> = {}) {
  const item: InboxListItem = {
    id,
    name: `Sender ${id}`,
    service: "branding",
    preview: `First line ${id}`,
    receivedAt: RECEIVED_AT,
    isRead: true,
    ...overrides,
  }

  return item
}

function buildPage(items: InboxListItem[], hasOlder = false): InboxListPage {
  return { items, hasOlder }
}

function buildMessage(overrides: Partial<InboxMessage> = {}) {
  const message: InboxMessage = {
    id: 7,
    name: "Ada",
    email: "ada@example.test",
    message: "Hello,\nI need a brand.",
    service: "web_design",
    receivedAt: RECEIVED_AT,
    notification: { status: "none" },
    isRead: true,
    isArchived: false,
    ...overrides,
  }

  return message
}

function renderWithClient(node: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={client}>{node}</QueryClientProvider>
  )
}

function renderActions(overrides: Partial<InboxMessage> = {}) {
  const message = buildMessage(overrides)

  return renderWithClient(
    <InboxMessageActions
      messageId={message.id}
      isRead={message.isRead}
      isArchived={message.isArchived}
      listHref={LIST_HREF}
    />
  )
}

beforeEach(() => {
  setReadStub.mockResolvedValue({ ok: true })
  setArchivedStub.mockResolvedValue({ ok: true })
  removeStub.mockResolvedValue({ ok: true })
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe("the message list", () => {
  it("heads the inbox with its unread count and offers the archive", () => {
    renderWithClient(
      <InboxList location={INBOX_HOME} page={buildPage([])} unreadCount={2} />
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Inbox · 2 new" })
    ).toHaveAttribute("id", INBOX_LIST_HEADING_ID)
    expect(screen.getByRole("link", { name: "Archived" })).toHaveAttribute(
      "href",
      `${INBOX_PATH}?view=archived`
    )
    expect(screen.getByText(INBOX_COPY.emptyLists.inbox)).toBeInTheDocument()
  })

  it("heads the archive without a count and links back to the inbox", () => {
    renderWithClient(
      <InboxList
        location={{ ...INBOX_HOME, view: "archived" }}
        page={buildPage([])}
        unreadCount={2}
      />
    )

    expect(
      screen.getByRole("heading", { level: 1, name: "Archived" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Inbox" })).toHaveAttribute(
      "href",
      INBOX_PATH
    )
    expect(screen.getByText(INBOX_COPY.emptyLists.archived)).toBeInTheDocument()
  })

  it("names a new message first and marks the open one", () => {
    renderWithClient(
      <InboxList
        location={{ view: "archived", messageId: 2, shown: 50 }}
        page={buildPage([buildItem(3, { isRead: false }), buildItem(2)])}
        unreadCount={0}
      />
    )

    const rows = screen.getAllByRole("listitem")
    const newLink = within(rows[0]).getByRole("link")
    const openLink = within(rows[1]).getByRole("link")

    expect(newLink).toHaveAccessibleName(
      expect.stringMatching(/^New Sender 3 Branding/)
    )
    expect(newLink).toHaveAttribute(
      "href",
      `${INBOX_PATH}?view=archived&shown=50&message=3`
    )
    expect(newLink).toHaveAttribute("data-unread")
    expect(newLink).not.toHaveAttribute("aria-current")
    expect(openLink).toHaveAccessibleName(
      expect.not.stringContaining(INBOX_COPY.newMarker)
    )
    expect(openLink).toHaveAttribute("aria-current", "page")
    expect(within(rows[1]).getByText("First line 2")).toBeInTheDocument()
  })

  it("offers older messages only when there are more", () => {
    const { rerender } = renderWithClient(
      <InboxList
        location={INBOX_HOME}
        page={buildPage([buildItem(1)], true)}
        unreadCount={null}
      />
    )

    expect(
      screen.getByRole("link", { name: INBOX_COPY.showOlder })
    ).toHaveAttribute("href", `${INBOX_PATH}?shown=${INBOX_PAGE_SIZE * 2}`)

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <InboxList
          location={INBOX_HOME}
          page={buildPage([buildItem(1)], false)}
          unreadCount={null}
        />
      </QueryClientProvider>
    )

    expect(
      screen.queryByRole("link", { name: INBOX_COPY.showOlder })
    ).not.toBeInTheDocument()
  })

  it("never offers a Show older that cannot grow the list", () => {
    renderWithClient(
      <InboxList
        location={{ ...INBOX_HOME, shown: INBOX_MAX_SHOWN }}
        page={buildPage([buildItem(1)], true)}
        unreadCount={null}
      />
    )

    expect(
      screen.queryByRole("link", { name: INBOX_COPY.showOlder })
    ).not.toBeInTheDocument()
  })

  it("keeps the open row's quiet text dark on its highlight", () => {
    renderWithClient(
      <InboxList
        location={{ ...INBOX_HOME, messageId: 2 }}
        page={buildPage([buildItem(2), buildItem(1)])}
        unreadCount={null}
      />
    )

    const rows = screen.getAllByRole("listitem")

    expect(within(rows[0]).getByText("First line 2")).toHaveClass(
      "text-accent-foreground"
    )
    expect(within(rows[0]).getByText("Branding").parentElement).toHaveClass(
      "text-accent-foreground"
    )
    expect(within(rows[1]).getByText("First line 1")).toHaveClass(
      "text-muted-foreground"
    )
  })
})

describe("the message pane", () => {
  it("asks for a choice when nothing is open", () => {
    renderWithClient(<InboxMessagePane location={INBOX_HOME} message={null} />)

    expect(screen.getByText(INBOX_COPY.noneSelected)).toBeInTheDocument()
  })

  it("says so when the open message is gone", () => {
    renderWithClient(
      <InboxMessagePane
        location={{ ...INBOX_HOME, messageId: 9 }}
        message={null}
      />
    )

    expect(screen.getByText(INBOX_COPY.missing)).toHaveAttribute(
      "id",
      INBOX_MESSAGE_HEADING_ID
    )
  })

  it("shows the whole message, who sent it and how to reply", () => {
    renderWithClient(
      <InboxMessagePane
        location={{ ...INBOX_HOME, messageId: 7 }}
        message={buildMessage({
          notification: { status: "notified", notifiedAt: RECEIVED_AT },
        })}
      />
    )

    const article = screen.getByRole("article", { name: "Ada" })

    expect(within(article).getByText("ada@example.test")).toBeInTheDocument()
    expect(within(article).getByText(/^Web design/)).toBeInTheDocument()
    expect(within(article).getByText(/^Notified at/)).toBeInTheDocument()
    expect(
      article.querySelectorAll(`time[datetime="${RECEIVED_AT}"]`)
    ).toHaveLength(2)
    expect(
      within(article).getByText("Hello, I need a brand.", {
        normalizer: function keepText(text) {
          return text.replace(/\s+/g, " ").trim()
        },
      }).textContent
    ).toBe("Hello,\nI need a brand.")
    expect(
      within(article).getByRole("link", { name: INBOX_COPY.reply })
    ).toHaveAttribute(
      "href",
      "mailto:ada@example.test?subject=Re%3A%20Your%20message"
    )
  })

  it("names a failed or missing notification", () => {
    const { rerender } = renderWithClient(
      <InboxMessagePane
        location={{ ...INBOX_HOME, messageId: 7 }}
        message={buildMessage({ notification: { status: "failed" } })}
      />
    )

    expect(screen.getByText(INBOX_COPY.notifyFailed)).toBeInTheDocument()

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <InboxMessagePane
          location={{ ...INBOX_HOME, messageId: 7 }}
          message={buildMessage({ notification: { status: "none" } })}
        />
      </QueryClientProvider>
    )

    expect(screen.getByText(INBOX_COPY.notNotified)).toBeInTheDocument()
  })
})

describe("the message actions", () => {
  it("marks a new message read when it opens, then refreshes the list", async () => {
    renderActions({ isRead: false })

    await waitFor(() => {
      expect(routerStub.refresh).toHaveBeenCalledTimes(1)
    })
    expect(setReadStub).toHaveBeenCalledTimes(1)
    expect(setReadStub.mock.calls[0][0]).toEqual({ id: 7, isRead: true })
  })

  it("holds the actions until the message is marked read", async () => {
    let finishMarkRead: (value: { ok: true }) => void = function idle() {
      return
    }

    setReadStub.mockReturnValue(
      new Promise(function holdMarkRead(resolve) {
        finishMarkRead = resolve
      })
    )

    renderActions({ isRead: false })

    const markUnread = screen.getByRole("button", {
      name: INBOX_COPY.markUnread,
    })

    await waitFor(() => {
      expect(markUnread).toBeDisabled()
    })

    await act(async () => {
      finishMarkRead({ ok: true })
    })

    await waitFor(() => {
      expect(markUnread).toBeEnabled()
    })
  })

  it("starts each opened message afresh", async () => {
    setArchivedStub.mockRejectedValue(new Error("network"))

    const { rerender } = renderWithClient(
      <InboxMessagePane
        location={{ ...INBOX_HOME, messageId: 7 }}
        message={buildMessage()}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.archive }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        INBOX_COPY.updateFailed
      )
    })

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <InboxMessagePane
          location={{ ...INBOX_HOME, messageId: 8 }}
          message={buildMessage({ id: 8, name: "Grace" })}
        />
      </QueryClientProvider>
    )

    expect(screen.getByRole("article", { name: "Grace" })).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent("")
  })

  it("leaves a read message alone when it opens", async () => {
    renderActions({ isRead: true })

    await act(async () => {
      await Promise.resolve()
    })

    expect(setReadStub).not.toHaveBeenCalled()
  })

  it("marks the message unread and returns to the list", async () => {
    renderActions()

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.markUnread }))

    await waitFor(() => {
      expect(routerStub.replace).toHaveBeenCalledWith(LIST_HREF)
    })
    expect(routerStub.refresh).toHaveBeenCalledTimes(1)
    expect(setReadStub.mock.calls[0][0]).toEqual({ id: 7, isRead: false })
  })

  it("archives a message, and moves an archived one back", async () => {
    const { unmount } = renderActions()

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.archive }))

    await waitFor(() => {
      expect(routerStub.replace).toHaveBeenCalledTimes(1)
    })
    expect(routerStub.refresh).toHaveBeenCalledTimes(1)
    expect(setArchivedStub.mock.calls[0][0]).toEqual({
      id: 7,
      isArchived: true,
    })

    unmount()
    renderActions({ isArchived: true })

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.restore }))

    await waitFor(() => {
      expect(routerStub.replace).toHaveBeenCalledTimes(2)
    })
    expect(routerStub.refresh).toHaveBeenCalledTimes(2)
    expect(setArchivedStub.mock.calls[1][0]).toEqual({
      id: 7,
      isArchived: false,
    })
  })

  it("deletes only after the owner confirms", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false)

    renderActions()

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.delete }))

    expect(confirm).toHaveBeenCalledWith(INBOX_COPY.deleteConfirm)
    expect(removeStub).not.toHaveBeenCalled()

    confirm.mockReturnValue(true)
    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.delete }))

    await waitFor(() => {
      expect(routerStub.replace).toHaveBeenCalledWith(LIST_HREF)
    })
    expect(routerStub.refresh).toHaveBeenCalledTimes(1)
    expect(removeStub.mock.calls[0][0]).toEqual({ id: 7 })
  })

  it("refreshes the inbox even when the message closed before the change landed", async () => {
    let finishArchive: (value: { ok: true }) => void = function idle() {
      return
    }

    setArchivedStub.mockReturnValue(
      new Promise(function holdArchive(resolve) {
        finishArchive = resolve
      })
    )

    const { unmount } = renderActions()

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.archive }))

    await waitFor(() => {
      expect(setArchivedStub).toHaveBeenCalledTimes(1)
    })

    unmount()

    await act(async () => {
      finishArchive({ ok: true })
    })

    await waitFor(() => {
      expect(routerStub.refresh).toHaveBeenCalledTimes(1)
    })
    expect(routerStub.replace).not.toHaveBeenCalled()
  })

  it("holds the buttons while a change is on its way", async () => {
    let finishArchive: (value: { ok: true }) => void = function idle() {
      return
    }

    setArchivedStub.mockReturnValue(
      new Promise(function holdArchive(resolve) {
        finishArchive = resolve
      })
    )

    renderActions()

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.archive }))

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: INBOX_COPY.delete })
      ).toBeDisabled()
    })

    await act(async () => {
      finishArchive({ ok: true })
    })
  })

  it("says what failed, in the approved words", async () => {
    setArchivedStub.mockRejectedValue(new Error("network"))
    removeStub.mockRejectedValue(new Error("network"))
    vi.spyOn(window, "confirm").mockReturnValue(true)

    renderActions()

    const alert = screen.getByRole("alert")

    expect(alert).toHaveTextContent("")

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.archive }))

    await waitFor(() => {
      expect(alert).toHaveTextContent(INBOX_COPY.updateFailed)
    })

    fireEvent.click(screen.getByRole("button", { name: INBOX_COPY.delete }))

    await waitFor(() => {
      expect(alert).toHaveTextContent(INBOX_COPY.deleteFailed)
    })
    expect(routerStub.replace).not.toHaveBeenCalled()
  })
})

describe("focus", () => {
  function renderTargets(messageId: number | null, shown = INBOX_PAGE_SIZE) {
    return (
      <>
        <h1 id={INBOX_LIST_HEADING_ID} tabIndex={-1}>
          Inbox
        </h1>
        <h2 id={INBOX_MESSAGE_HEADING_ID} tabIndex={-1}>
          Ada
        </h2>
        <InboxFocus messageId={messageId} shown={shown} />
      </>
    )
  }

  it("stays put on load and follows the open message after", () => {
    const { rerender } = render(renderTargets(null))

    expect(document.body).toHaveFocus()

    rerender(renderTargets(7))
    expect(document.getElementById(INBOX_MESSAGE_HEADING_ID)).toHaveFocus()

    rerender(renderTargets(8))
    expect(document.getElementById(INBOX_MESSAGE_HEADING_ID)).toHaveFocus()

    rerender(renderTargets(null))
    expect(document.getElementById(INBOX_LIST_HEADING_ID)).toHaveFocus()
  })

  it("leaves focus alone on load with a message open", () => {
    render(renderTargets(7))

    expect(document.body).toHaveFocus()
  })

  function renderRows(rowCount: number, shown: number) {
    const rows: number[] = []

    for (let rowNumber = 1; rowNumber <= rowCount; rowNumber += 1) {
      rows.push(rowNumber)
    }

    return (
      <>
        <h1 id={INBOX_LIST_HEADING_ID} tabIndex={-1}>
          Inbox
        </h1>
        <ul id={INBOX_LIST_ID}>
          {rows.map(function renderRow(rowNumber) {
            return (
              <li key={rowNumber}>
                <a href={`#row-${rowNumber}`}>Row {rowNumber}</a>
              </li>
            )
          })}
        </ul>
        <button type="button">Elsewhere</button>
        <InboxFocus messageId={null} shown={shown} />
      </>
    )
  }

  it("moves focus to the first older message when the last page loads", () => {
    const { rerender } = render(renderRows(2, 2))

    rerender(renderRows(3, 3))

    expect(screen.getByRole("link", { name: "Row 3" })).toHaveFocus()
  })

  it("leaves focus where it is when it was not lost", () => {
    const { rerender } = render(renderRows(2, 2))
    const elsewhere = screen.getByRole("button", { name: "Elsewhere" })

    elsewhere.focus()
    rerender(renderRows(3, 3))

    expect(elsewhere).toHaveFocus()
  })
})

describe("the inbox page", () => {
  it("shows the list or the open message on a phone, never both", () => {
    const { rerender } = renderWithClient(
      <Inbox
        location={INBOX_HOME}
        page={buildPage([buildItem(7)])}
        unreadCount={null}
        message={null}
      />
    )

    const listSection = screen
      .getByRole("heading", { level: 1 })
      .closest("section")

    expect(listSection).not.toHaveClass("max-md:hidden")
    expect(
      screen.getByRole("link", { name: INBOX_COPY.backToDashboard })
    ).not.toHaveClass("max-md:hidden")

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <Inbox
          location={{ ...INBOX_HOME, messageId: 7 }}
          page={buildPage([buildItem(7)])}
          unreadCount={null}
          message={buildMessage()}
        />
      </QueryClientProvider>
    )

    expect(listSection).toHaveClass("max-md:hidden")
    expect(
      screen.getByRole("link", { name: INBOX_COPY.backToDashboard })
    ).toHaveClass("max-md:hidden")

    const backToList = screen.getByRole("link", {
      name: INBOX_COPY.viewTitles.inbox,
    })

    expect(backToList).toHaveAttribute("href", INBOX_PATH)
    expect(backToList).toHaveClass("md:hidden")
  })
})
