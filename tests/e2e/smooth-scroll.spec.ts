import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const WHEEL_DELTA = 400

const HALF_PIXEL_WHEEL_DELTA = 100.5

const SETTLE_BEFORE_COUNT_MS = 1000

const IDLE_WINDOW_MS = 2000

type WheelFlight = {
  start: number
  landing: number
  deltaY: number
  distinctFrames: number
  sawSmoothClass: boolean
}

async function waitForSmoothScroll(page: Page) {
  await expect(page.locator("[data-status]").first()).toHaveAttribute(
    "data-status",
    "running",
    { timeout: 15000 }
  )
  await expect(page.locator("html")).toHaveClass(/\blenis\b/)
}

async function wheelOnceAndRecord(
  page: Page,
  delta: number = WHEEL_DELTA
): Promise<WheelFlight> {
  const viewport = page.viewportSize()

  if (viewport === null) {
    throw new Error("the page has no viewport")
  }

  await page.evaluate(function startRecording() {
    const recording = {
      start: window.scrollY,
      deltaY: 0,
      samples: [] as number[],
      sawSmoothClass: false,
      ended: false,
    }

    Object.assign(window, { wheelRecording: recording })

    window.addEventListener(
      "wheel",
      function recordDelta(event) {
        recording.deltaY += event.deltaY
      },
      { passive: true }
    )

    window.addEventListener("scrollend", function recordEnd(event) {
      if (event instanceof CustomEvent && event.detail?.lenisScrollEnd) {
        recording.ended = true
      }
    })

    function sample() {
      recording.samples.push(window.scrollY)

      const isSmoothing =
        document.documentElement.classList.contains("lenis-smooth")

      if (isSmoothing) {
        recording.sawSmoothClass = true
      }

      if (recording.sawSmoothClass && !isSmoothing) {
        recording.ended = true
      }

      if (!recording.ended) {
        window.requestAnimationFrame(sample)
      }
    }

    window.requestAnimationFrame(sample)
  })

  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(0, delta)

  await expect
    .poll(
      async function readEnded() {
        return page.evaluate(function isEnded() {
          const recording = Reflect.get(window, "wheelRecording")

          return recording.ended
        })
      },
      { timeout: 5000 }
    )
    .toBe(true)

  return page.evaluate(function summarise() {
    const recording = Reflect.get(window, "wheelRecording")
    const distinct = new Set<number>()

    for (const sample of recording.samples) {
      distinct.add(sample)
    }

    return {
      start: recording.start,
      landing: window.scrollY,
      deltaY: recording.deltaY,
      distinctFrames: distinct.size,
      sawSmoothClass: recording.sawSmoothClass,
    }
  })
}

async function countAnimationFrames(page: Page, durationMs: number) {
  return page.evaluate(function countFrames(windowMs) {
    return new Promise<number>(function measure(resolve) {
      const original = window.requestAnimationFrame
      let calls = 0

      window.requestAnimationFrame = function countedFrame(callback) {
        calls += 1

        return original.call(window, callback)
      }

      window.setTimeout(function finish() {
        window.requestAnimationFrame = original
        resolve(calls)
      }, windowMs)
    })
  }, durationMs)
}

async function readWheelDefaultPrevented(page: Page) {
  await page.evaluate(function listenLast() {
    const probe = { prevented: null as boolean | null, before: window.scrollY }

    Object.assign(window, { wheelProbe: probe })

    window.addEventListener(
      "wheel",
      function recordPrevented(event) {
        probe.prevented = event.defaultPrevented
      },
      { passive: true }
    )
  })

  await page.mouse.wheel(0, WHEEL_DELTA)

  return page.evaluate(function readProbe() {
    return new Promise<{ prevented: boolean | null; moved: number }>(
      function afterFrame(resolve) {
        window.requestAnimationFrame(function readAfterOneFrame() {
          const probe = Reflect.get(window, "wheelProbe")

          resolve({
            prevented: probe.prevented,
            moved: window.scrollY - probe.before,
          })
        })
      }
    )
  })
}

test.describe("smooth scroll on a fine pointer", () => {
  test("glides one wheel notch over many frames and lands on its delta", async ({
    page,
  }) => {
    await page.goto("/#faq")
    await waitForSmoothScroll(page)

    const flight = await wheelOnceAndRecord(page)

    expect(flight.distinctFrames).toBeGreaterThan(10)
    expect(flight.sawSmoothClass).toBe(true)
    expect(flight.landing).toBe(flight.start + flight.deltaY)
    await expect(page.locator("html")).not.toHaveClass(/\blenis-smooth\b/)
  })

  test("requests no animation frame at rest after a wheel", async ({
    page,
  }) => {
    await page.goto("/#faq")
    await waitForSmoothScroll(page)
    await wheelOnceAndRecord(page)
    await page.waitForTimeout(SETTLE_BEFORE_COUNT_MS)

    expect(await countAnimationFrames(page, IDLE_WINDOW_MS)).toBe(0)
  })

  test("hands the wheel back to the browser when reduced motion turns on", async ({
    page,
  }) => {
    await page.goto("/#faq")
    await waitForSmoothScroll(page)

    const smooth = await readWheelDefaultPrevented(page)

    expect(smooth.prevented).toBe(true)

    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.waitForTimeout(SETTLE_BEFORE_COUNT_MS)

    const native = await readWheelDefaultPrevented(page)

    expect(native.prevented).toBe(false)
    expect(native.moved).toBe(WHEEL_DELTA)
  })

  test("lets the open menu panel scroll under the wheel", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 400 })
    await page.goto("/")
    await waitForSmoothScroll(page)
    await page.getByRole("button", { name: "Open menu" }).click()

    const panel = page.locator("#portfolio-mobile-nav")
    const box = await panel.boundingBox()

    if (box === null) {
      throw new Error("the menu panel did not open")
    }

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.wheel(0, 200)

    await expect
      .poll(async function readPanelScroll() {
        return panel.evaluate(function panelScrollTop(element) {
          return element.scrollTop
        })
      })
      .toBeGreaterThan(0)
    expect(
      await page.evaluate(function readScrollY() {
        return window.scrollY
      })
    ).toBe(0)
  })
})

test.describe("smooth scroll with a touchpad delta", () => {
  test("settles a wheel aimed at a half-pixel position", async ({ page }) => {
    await page.goto("/#faq")
    await waitForSmoothScroll(page)
    await wheelOnceAndRecord(page, HALF_PIXEL_WHEEL_DELTA)
    await page.waitForTimeout(SETTLE_BEFORE_COUNT_MS)

    await expect(page.locator("html")).not.toHaveClass(/\blenis-smooth\b/)
    expect(await countAnimationFrames(page, IDLE_WINDOW_MS)).toBe(0)
  })
})

test.describe("smooth scroll under reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("never constructs Lenis", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("[data-status]").first()).toHaveAttribute(
      "data-status",
      "running",
      { timeout: 15000 }
    )
    await page.waitForTimeout(SETTLE_BEFORE_COUNT_MS)

    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/)
  })
})
