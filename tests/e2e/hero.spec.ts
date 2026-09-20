import { expect, test } from "@playwright/test"

test.describe("hero dot field", () => {
  test("renders the name as an accessible heading exactly once", async ({
    page,
  }) => {
    await page.goto("/")

    const heading = page.getByRole("heading", { level: 1, name: "Criztian" })

    await expect(heading).toHaveCount(1)
    await expect(page.locator("h1")).toHaveCount(1)
  })

  test("starts the webgl field and samples the display font", async ({
    page,
  }) => {
    const consoleErrors: string[] = []

    page.on("pageerror", function onPageError(error) {
      consoleErrors.push(error.message)
    })

    page.on("console", function onConsole(message) {
      if (message.type() === "error") {
        consoleErrors.push(message.text())
      }
    })

    await page.goto("/")

    const stage = page.locator("[data-status]").first()

    await expect(stage).toHaveAttribute("data-status", "running", {
      timeout: 15000,
    })

    const canvas = page.locator("canvas")
    const pointCount = Number(await canvas.getAttribute("data-point-count"))

    expect(pointCount).toBeGreaterThan(500)

    const box = await canvas.boundingBox()

    expect(box?.width ?? 0).toBeGreaterThan(0)
    expect(box?.height ?? 0).toBeGreaterThan(0)

    expect(consoleErrors).toEqual([])
  })

  test("keeps the contact anchor reachable", async ({ page }) => {
    await page.goto("/#contact")

    await expect(page.locator("#contact")).toBeVisible()
  })
})
