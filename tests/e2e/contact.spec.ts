import { expect, test } from "@playwright/test"

import {
  CONTACT_ACKNOWLEDGEMENT,
  MIN_SECONDS_BEFORE_SUBMIT,
} from "@/data/contact.data"

const SETTLE_MARGIN_MS = 500

const WAIT_BEFORE_SUBMIT_MS =
  MIN_SECONDS_BEFORE_SUBMIT * 1000 + SETTLE_MARGIN_MS

const ADDRESS_UNIQUE_TO_THIS_RUN = `2001:db8::${Date.now().toString(16)}`

test("accepts a message sent from the public contact section", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": ADDRESS_UNIQUE_TO_THIS_RUN,
  })

  await page.goto("/#contact")

  await page.getByLabel("Name").fill("Playwright Tester")
  await page.getByLabel("Email").fill("playwright.tester@example.test")
  await page
    .getByLabel("Message")
    .fill("Sent by the end-to-end suite to verify the contact pipeline.")

  await page.waitForTimeout(WAIT_BEFORE_SUBMIT_MS)

  await page.getByRole("button", { name: "Send message" }).click()

  await expect(page.getByRole("status")).toHaveText(CONTACT_ACKNOWLEDGEMENT)
})
