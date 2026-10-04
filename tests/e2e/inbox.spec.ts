import type { Locator, Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

import { DASHBOARD_PATH, LOGIN_PATH } from "@/data/auth.data"
import { CONTACT_SERVICE_LABELS } from "@/data/contact.data"
import {
  INBOX_COPY,
  INBOX_LIST_HEADING_ID,
  INBOX_MESSAGE_HEADING_ID,
  INBOX_PAGE_SIZE,
  INBOX_PATH,
} from "@/data/inbox.data"
import {
  buildReplyHref,
  formatCountLabel,
  formatDayKey,
  formatInboxDate,
  readDateParts,
} from "@/features/inbox/inbox.rules"

import {
  countInboxMessages,
  countUnreadMessages,
  createRunMarker,
  deleteMessagesContaining,
  INBOX_RUN_PREFIX,
  insertTestMessages,
  readMessageState,
} from "./contact-messages"
import {
  createPublishableClient,
  createTestOwner,
  deleteTestOwner,
  TEST_OWNER_EMAIL,
  TEST_OWNER_PASSWORD,
} from "./owner-account"

const RUN_MARKER = createRunMarker(INBOX_RUN_PREFIX)

const SENDER_NAME = "Inbox Tester"

const SENDER_EMAIL = "inbox.tester@example.test"

const PHONE_VIEWPORT = { width: 390, height: 844 }

const READER_TIME_ZONE = "America/New_York"

const FUTURE_RECEIVED_AT = "2030-01-15T16:05:00.000Z"

const MISSING_MESSAGE_ID = 2147483647

const PERMISSION_DENIED = "42501"

const RESTORE_SETTLE_MS = 500

test.beforeAll(async function prepareRun() {
  await deleteMessagesContaining(`${INBOX_RUN_PREFIX}-`, SENDER_EMAIL)
  await createTestOwner()
})

test.afterEach(async function removeMessages() {
  await deleteMessagesContaining(RUN_MARKER, SENDER_EMAIL)
})

test.afterAll(async function removeOwner() {
  await deleteTestOwner()
})

function buildMessageText(label: string): string {
  return `${label} from the inbox spec.\nSecond line. ${RUN_MARKER}`
}

async function insertOne(label: string, createdAt?: string): Promise<number> {
  const [messageId] = await insertTestMessages([
    {
      name: SENDER_NAME,
      email: SENDER_EMAIL,
      message: buildMessageText(label),
      service: "branding",
      createdAt,
    },
  ])

  return messageId
}

async function signIn(page: Page, next: string): Promise<void> {
  await page.goto(`${LOGIN_PATH}?next=${encodeURIComponent(next)}`)
  await page.getByLabel("Email").fill(TEST_OWNER_EMAIL)
  await page.getByLabel("Password").fill(TEST_OWNER_PASSWORD)
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.waitForURL(function isNext(url) {
    return `${url.pathname}${url.search}` === next
  })
}

function findRow(page: Page, label: string): Locator {
  return page
    .getByRole("listitem")
    .filter({ hasText: `${label} from the inbox spec.` })
    .getByRole("link")
}

function messagePath(messageId: number, query = ""): string {
  return `${INBOX_PATH}?${query}message=${messageId}`
}

async function expectListPath(page: Page, query = ""): Promise<void> {
  await expect(page).toHaveURL(function isList(url) {
    return url.pathname === INBOX_PATH && url.search === query
  })
}

test("sends an anonymous visitor from the inbox to the login", async ({
  page,
}) => {
  await page.goto(INBOX_PATH)

  await expect(page).toHaveURL(function isLoginWithReturnPath(url) {
    return (
      url.pathname === LOGIN_PATH && url.searchParams.get("next") === INBOX_PATH
    )
  })
})

test("refuses the messages to the publishable key", async () => {
  await insertOne("Hidden")

  const visitor = createPublishableClient()
  const { data, error } = await visitor.from("contact_messages").select("id")

  expect(data).toBeNull()
  expect(error?.code).toBe(PERMISSION_DENIED)
})

test("lets the owner change a message's state but never its text or IP hash", async () => {
  const messageId = await insertOne("Guarded")
  const owner = createPublishableClient()
  const { error: signInError } = await owner.auth.signInWithPassword({
    email: TEST_OWNER_EMAIL,
    password: TEST_OWNER_PASSWORD,
  })

  expect(signInError).toBeNull()

  const hashRead = await owner
    .from("contact_messages")
    .select("ip_hash")
    .eq("id", messageId)
  const textEdit = await owner
    .from("contact_messages")
    .update({ message: `Rewritten ${RUN_MARKER}` })
    .eq("id", messageId)
  const stateEdit = await owner
    .from("contact_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", messageId)
  const visibleRead = await owner
    .from("contact_messages")
    .select("id, name, read_at")
    .eq("id", messageId)
    .single()

  expect(hashRead.error?.code).toBe(PERMISSION_DENIED)
  expect(textEdit.error?.code).toBe(PERMISSION_DENIED)
  expect(stateEdit.error).toBeNull()
  expect(visibleRead.data?.name).toBe(SENDER_NAME)
  expect(visibleRead.data?.read_at).not.toBeNull()

  await owner.auth.signOut()
})

test("counts new messages on the dashboard and in the inbox", async ({
  page,
}) => {
  await insertOne("First count")
  await insertOne("Second count")

  await signIn(page, DASHBOARD_PATH)

  const unread = await countUnreadMessages()
  const inboxLink = page.getByRole("link", {
    name: formatCountLabel(INBOX_COPY.dashboardLink, unread),
  })

  expect(unread).toBeGreaterThanOrEqual(2)
  await expect(inboxLink).toBeVisible()

  await inboxLink.click()
  await expectListPath(page)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: formatCountLabel(INBOX_COPY.viewTitles.inbox, unread),
    })
  ).toBeVisible()
})

test("opens, marks, archives, restores and deletes a message", async ({
  page,
}) => {
  const messageId = await insertOne("Lifecycle")

  await signIn(page, INBOX_PATH)

  const row = findRow(page, "Lifecycle")

  await expect(row).toHaveAttribute("data-unread", "")
  await expect(row).toHaveAccessibleName(
    new RegExp(`^${INBOX_COPY.newMarker} ${SENDER_NAME} `)
  )

  await row.click()
  await expect(page).toHaveURL(messagePath(messageId))

  const article = page.getByRole("article", { name: SENDER_NAME })

  await expect(page.locator(`#${INBOX_MESSAGE_HEADING_ID}`)).toBeFocused()
  await expect(article.getByText(SENDER_EMAIL)).toBeVisible()
  await expect(
    article.getByText(new RegExp(`^${CONTACT_SERVICE_LABELS.branding} · `))
  ).toBeVisible()
  await expect(article.getByText(INBOX_COPY.notNotified)).toBeVisible()
  const messageBody = article.getByText(`Lifecycle from the inbox spec.`, {
    exact: false,
  })

  await expect(messageBody).toBeVisible()
  expect(await messageBody.innerText()).toBe(buildMessageText("Lifecycle"))
  await expect(
    article.getByRole("link", { name: INBOX_COPY.reply })
  ).toHaveAttribute("href", buildReplyHref(SENDER_EMAIL))

  await expect(row).not.toHaveAttribute("data-unread")
  await expect(row).toHaveAttribute("aria-current", "page")
  expect((await readMessageState(messageId))?.read_at).not.toBeNull()

  await article.getByRole("button", { name: INBOX_COPY.markUnread }).click()
  await expectListPath(page)
  await expect(row).toHaveAttribute("data-unread", "")
  await expect(page.locator(`#${INBOX_LIST_HEADING_ID}`)).toBeFocused()
  expect((await readMessageState(messageId))?.read_at).toBeNull()

  await row.click()
  await expect(row).not.toHaveAttribute("data-unread")
  await article.getByRole("button", { name: INBOX_COPY.archive }).click()
  await expectListPath(page)
  await expect(row).toHaveCount(0)
  expect((await readMessageState(messageId))?.archived_at).not.toBeNull()

  await page.goBack()
  await expectListPath(page)
  await page.waitForTimeout(RESTORE_SETTLE_MS)
  await expect(row).toHaveCount(0)
  await expect(page.getByRole("article")).toHaveCount(0)

  await page
    .getByRole("link", { name: INBOX_COPY.viewTitles.archived, exact: true })
    .click()
  await expectListPath(page, "?view=archived")
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: INBOX_COPY.viewTitles.archived,
    })
  ).toBeVisible()

  await row.click()
  await expect(page).toHaveURL(messagePath(messageId, "view=archived&"))
  await article.getByRole("button", { name: INBOX_COPY.restore }).click()
  await expectListPath(page, "?view=archived")
  await expect(row).toHaveCount(0)
  expect((await readMessageState(messageId))?.archived_at).toBeNull()

  await page
    .getByRole("link", { name: INBOX_COPY.viewTitles.inbox, exact: true })
    .click()
  await expectListPath(page)
  await row.click()

  page.once("dialog", function keepMessage(dialog) {
    expect(dialog.message()).toBe(INBOX_COPY.deleteConfirm)
    void dialog.dismiss()
  })
  await article.getByRole("button", { name: INBOX_COPY.delete }).click()
  await expect(page).toHaveURL(messagePath(messageId))
  expect(await readMessageState(messageId)).not.toBeNull()

  page.once("dialog", function confirmDelete(dialog) {
    void dialog.accept()
  })
  await article.getByRole("button", { name: INBOX_COPY.delete }).click()
  await expectListPath(page)
  await expect(row).toHaveCount(0)
  expect(await readMessageState(messageId)).toBeNull()
})

test("says when an open message no longer exists", async ({ page }) => {
  await signIn(page, INBOX_PATH)
  await page.goto(messagePath(MISSING_MESSAGE_ID))

  await expect(page.getByText(INBOX_COPY.missing)).toBeVisible()
})

test("shows older messages a page at a time", async ({ page }) => {
  const labels: string[] = []

  for (let index = 0; index <= INBOX_PAGE_SIZE; index += 1) {
    labels.push(`Paged ${index}`)
  }

  const messages = []

  for (const label of labels) {
    messages.push({
      name: SENDER_NAME,
      email: SENDER_EMAIL,
      message: buildMessageText(label),
      service: "development" as const,
    })
  }

  await insertTestMessages(messages)
  await signIn(page, INBOX_PATH)

  const rows = page.getByRole("main").getByRole("listitem")

  await expect(rows).toHaveCount(INBOX_PAGE_SIZE)

  await page
    .getByRole("link", { name: INBOX_COPY.showOlder, exact: true })
    .click()
  await expectListPath(page, `?shown=${INBOX_PAGE_SIZE * 2}`)
  await expect(rows).toHaveCount(
    Math.min(INBOX_PAGE_SIZE * 2, await countInboxMessages())
  )
})

test.describe("in the reader's time zone", () => {
  test.use({ timezoneId: READER_TIME_ZONE })

  test("dates each message where the owner is", async ({ page }) => {
    const messageId = await insertOne("Dated", FUTURE_RECEIVED_AT)
    const calendar = {
      timeZone: READER_TIME_ZONE,
      today: formatDayKey(
        readDateParts(new Date().toISOString(), READER_TIME_ZONE)
      ),
    }

    await signIn(page, INBOX_PATH)

    await expect(findRow(page, "Dated").locator("time")).toHaveText(
      formatInboxDate(FUTURE_RECEIVED_AT, "list", calendar)
    )

    await findRow(page, "Dated").click()
    await expect(page).toHaveURL(messagePath(messageId))
    await expect(page.getByRole("article").locator("time").first()).toHaveText(
      formatInboxDate(FUTURE_RECEIVED_AT, "full", calendar)
    )
  })
})

test.describe("on a phone", () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("reads one message per screen", async ({ page }) => {
    const messageId = await insertOne("Phone")

    await signIn(page, INBOX_PATH)

    const listHeading = page.getByRole("heading", { level: 1 })
    const dashboardLink = page.getByRole("link", {
      name: INBOX_COPY.backToDashboard,
      exact: true,
    })

    await expect(listHeading).toBeVisible()
    await expect(dashboardLink).toBeVisible()
    await expect(page.getByText(INBOX_COPY.noneSelected)).toBeHidden()

    await findRow(page, "Phone").click()
    await expect(page).toHaveURL(messagePath(messageId))
    await expect(
      page.getByRole("heading", { level: 2, name: SENDER_NAME })
    ).toBeVisible()
    await expect(listHeading).toBeHidden()
    await expect(dashboardLink).toBeHidden()

    await page
      .getByRole("link", { name: INBOX_COPY.viewTitles.inbox, exact: true })
      .click()
    await expectListPath(page)
    await expect(listHeading).toBeVisible()
    await expect(listHeading).toBeFocused()
  })
})
