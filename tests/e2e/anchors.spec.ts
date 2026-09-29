import { expect, test } from "@playwright/test"

import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"

const HEADER_OFFSET = "72px"

const SCENE_DEEP_LINKS = [
  { hash: "#project", scene: formatSceneStepId(PROJECTS_SCENE_ID, 0) },
  { hash: "#services", scene: "branding" },
  { hash: "#process", scene: "listening" },
  { hash: "#about", scene: "about" },
  { hash: "#testimonials", scene: "testimonials" },
  { hash: "#faq", scene: "dust" },
  { hash: "#contact", scene: "contact" },
]

test.describe("in-page anchors", () => {
  test("every in-page link resolves to exactly one element", async ({
    page,
  }) => {
    await page.goto("/")

    const targets = await page.evaluate(function countAnchorTargets() {
      const counts: { hash: string; count: number }[] = []
      const anchors =
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')

      for (const anchor of anchors) {
        const id = decodeURIComponent(anchor.hash.slice(1))

        counts.push({
          hash: anchor.hash,
          count: document.querySelectorAll(`[id="${CSS.escape(id)}"]`).length,
        })
      }

      return counts
    })

    expect(targets.length).toBeGreaterThan(0)

    for (const target of targets) {
      expect(target.count, target.hash).toBe(1)
    }
  })

  test("lands every anchor below the fixed header", async ({ page }) => {
    await page.goto("/")

    const margins = await page.evaluate(function readScrollMargins() {
      const found: { id: string; margin: string }[] = []
      const seen = new Set<string>()
      const anchors =
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')

      for (const anchor of anchors) {
        const id = decodeURIComponent(anchor.hash.slice(1))
        const target = document.getElementById(id)

        if (target === null || id === "home" || seen.has(id)) {
          continue
        }

        seen.add(id)
        found.push({ id, margin: getComputedStyle(target).scrollMarginTop })
      }

      return found
    })

    expect(margins.length).toBeGreaterThan(0)

    for (const entry of margins) {
      expect(entry.margin, entry.id).toBe(HEADER_OFFSET)
    }
  })

  test("keeps one canvas, one stage and one level one heading", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.locator("canvas")).toHaveCount(1)
    await expect(page.locator("[data-status]")).toHaveCount(1)
    await expect(page.locator("h1")).toHaveCount(1)
  })

  for (const link of SCENE_DEEP_LINKS) {
    test(`lands on the ${link.scene} scene when opened at ${link.hash}`, async ({
      page,
    }) => {
      await page.goto(`/${link.hash}`)

      const stage = page.locator("[data-status]")

      await expect(stage).toHaveAttribute("data-status", "running", {
        timeout: 15000,
      })
      await expect(stage).toHaveAttribute("data-scene", link.scene, {
        timeout: 10000,
      })
    })
  }
})
