import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import {
  CONTACT_ACKNOWLEDGEMENT,
  MIN_SECONDS_BEFORE_SUBMIT,
} from "@/data/contact.data"
import { CONTACT_SECTION } from "@/data/page-sections.data"

const SETTLE_MARGIN_MS = 500

const WAIT_BEFORE_SUBMIT_MS =
  MIN_SECONDS_BEFORE_SUBMIT * 1000 + SETTLE_MARGIN_MS

const BORDER_TRANSITION_MS = 400

const GATE_SETTLE_MS = 500

const PHONE_VIEWPORT = { width: 390, height: 844 }

const ADDRESS_UNIQUE_TO_THIS_RUN = `2001:db8::${Date.now().toString(16)}`

function readBorderColor(element: Element) {
  return getComputedStyle(element).borderTopColor
}

async function openContactSection(page: Page) {
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": ADDRESS_UNIQUE_TO_THIS_RUN,
  })

  await page.goto("/#contact")
}

async function fillMessage(page: Page) {
  await page.getByLabel("Name").fill("Playwright Tester")
  await page.getByLabel("Email").fill("playwright.tester@example.test")
  await page.getByLabel("Service needed").selectOption("development")
  await page
    .getByLabel("What can I help you with?")
    .fill("Sent by the end-to-end suite to verify the contact pipeline.")

  await page.waitForTimeout(WAIT_BEFORE_SUBMIT_MS)
}

async function sendMessage(page: Page) {
  await page.getByRole("button", { name: "Send message" }).click()

  await expect(
    page.getByText(CONTACT_ACKNOWLEDGEMENT, { exact: true })
  ).toBeFocused()
}

async function readContactFrame(page: Page) {
  return page.evaluate(function measureContactFrame(sectionId) {
    const section = document.getElementById(sectionId)
    const slot = section?.querySelector("[data-dot-slot]")

    return {
      sectionHeight: section?.getBoundingClientRect().height ?? 0,
      slotHeight: slot?.getBoundingClientRect().height ?? 0,
      fit: section?.getAttribute("data-fit") ?? null,
      shapes: section?.getAttribute("data-dot-shapes") ?? null,
    }
  }, CONTACT_SECTION.id)
}

test("accepts a message sent from the public contact section", async ({
  page,
}) => {
  await openContactSection(page)
  await fillMessage(page)
  await sendMessage(page)
})

test("brightens an invalid field when the keyboard reaches it", async ({
  page,
}) => {
  await page.goto("/#contact")
  await page.getByRole("button", { name: "Send message" }).click()

  const email = page.getByLabel("Email")

  await expect(email).toHaveAttribute("aria-invalid", "true")
  await page.waitForTimeout(BORDER_TRANSITION_MS)

  const restingBorder = await email.evaluate(readBorderColor)

  await page.getByLabel("Name").focus()
  await page.keyboard.press("Tab")
  await expect(email).toBeFocused()
  await page.waitForTimeout(BORDER_TRANSITION_MS)

  expect(await email.evaluate(readBorderColor)).not.toBe(restingBorder)
})

test.describe("contact on a phone", () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("acknowledges a message inside the pinned frame without resizing it", async ({
    page,
  }) => {
    await openContactSection(page)
    await expect(page.locator("[data-status]")).toHaveAttribute(
      "data-status",
      "running",
      { timeout: 15000 }
    )
    await fillMessage(page)

    const pinned = await readContactFrame(page)

    expect(pinned).toMatchObject({ fit: null, shapes: CONTACT_SECTION.shapes })

    await sendMessage(page)
    await page.waitForTimeout(GATE_SETTLE_MS)

    expect(await readContactFrame(page)).toEqual(pinned)
  })
})
