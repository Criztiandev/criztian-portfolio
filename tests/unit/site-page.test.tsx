import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FAQ_SECTION } from "@/data/page-sections.data"
import { DEFAULT_HERO_NAME } from "@/data/site-content.data"
import { SitePage } from "@/features/portfolio/components/site-page.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"

vi.mock(
  "@/features/contact/components/contact.form",
  function mockContactForm() {
    return {
      ContactForm: function ContactFormStub() {
        return <form data-testid="contact-form" />
      },
    }
  }
)

const DISPLAY_FONT_FAMILY = `"Antonio", "Antonio Fallback"`

const UNLABELLED_SECTION_IDS = ["home", "quote"]

const LINKED_PROJECT_URL = "https://example.com/project"

const IN_SCENE_FOCUSABLE_SELECTOR = `[data-dot-scene] :is(a[href], button, summary, input, textarea, select):not([tabindex="-1"]):not([aria-hidden="true"])`

const SCENE_ORDER = [
  "name",
  "cube",
  "services",
  "about",
  "project",
  "process",
  "dust",
  "footer",
]

function renderPage() {
  return render(
    <SitePage
      content={createDefaultSiteContent()}
      displayFontFamily={DISPLAY_FONT_FAMILY}
    />
  )
}

function readScenes(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-dot-scene]"))
}

describe("SitePage", () => {
  it("renders one stage, one canvas and one level one heading", () => {
    const { container } = renderPage()

    expect(container.querySelectorAll("[data-status]")).toHaveLength(1)
    expect(container.querySelectorAll("canvas")).toHaveLength(1)
    expect(container.querySelectorAll("h1")).toHaveLength(1)
  })

  it("orders the dot scenes down the page", () => {
    const { container } = renderPage()
    const order: string[] = []

    for (const scene of readScenes(container)) {
      order.push(scene.dataset.dotScene ?? "")
    }

    expect(order).toEqual(SCENE_ORDER)
  })

  it("gives every pinned scene one empty slot inside its first child", () => {
    const { container } = renderPage()

    for (const scene of readScenes(container)) {
      const slots = scene.querySelectorAll("[data-dot-slot]")

      if (scene.dataset.dotScene === "dust") {
        expect(slots).toHaveLength(0)
        continue
      }

      expect(slots).toHaveLength(1)
      expect(slots[0]).toBeEmptyDOMElement()
      expect(scene.firstElementChild?.contains(slots[0] ?? null)).toBe(true)
    }
  })

  it("hides every section slot from assistive tech", () => {
    const { container } = renderPage()
    const slots = container.querySelectorAll(
      "[data-dot-scene]:not([data-dot-scene='name']) [data-dot-slot]"
    )

    expect(slots.length).toBeGreaterThan(0)

    for (const slot of slots) {
      expect(slot).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("keeps every id inside a scene at the header scroll margin", () => {
    const { container } = renderPage()
    const elements = container.querySelectorAll(
      "[data-dot-scene][id], [data-dot-scene] [id]"
    )

    expect(elements.length).toBeGreaterThan(0)

    for (const element of elements) {
      if (element.id === "home") {
        continue
      }

      expect(element.className, element.id).toContain("scroll-mt-18")
    }
  })

  it("keeps every focusable inside a scene clear of the fixed header", () => {
    const content = createDefaultSiteContent()
    const firstProject = content.projects.items[0]

    if (firstProject === undefined) {
      throw new Error("the default content has no project")
    }

    firstProject.link = LINKED_PROJECT_URL

    const { container } = render(
      <SitePage content={content} displayFontFamily={DISPLAY_FONT_FAMILY} />
    )
    const focusables = container.querySelectorAll(IN_SCENE_FOCUSABLE_SELECTOR)

    expect(focusables.length).toBeGreaterThan(0)
    expect(
      container.querySelector(`a[href="${LINKED_PROJECT_URL}"]`)
    ).not.toBeNull()

    for (const focusable of focusables) {
      expect(focusable.className, focusable.outerHTML.slice(0, 80)).toContain(
        "scroll-mt-18"
      )
    }
  })

  it("labels every section except the hero and the quote with its own h2", () => {
    const { container } = renderPage()
    let labelledCount = 0

    for (const section of container.querySelectorAll("section")) {
      if (UNLABELLED_SECTION_IDS.includes(section.id)) {
        continue
      }

      const headingId = section.getAttribute("aria-labelledby") ?? ""

      expect(document.getElementById(headingId)?.tagName, section.id).toBe("H2")
      labelledCount += 1
    }

    expect(labelledCount).toBe(9)
  })

  it("resolves every in-page link to exactly one element", () => {
    const { container } = renderPage()
    const anchors =
      container.querySelectorAll<HTMLAnchorElement>("a[href^='#']")

    expect(anchors.length).toBeGreaterThan(0)

    for (const anchor of anchors) {
      const id = anchor.getAttribute("href")?.slice(1) ?? ""

      expect(container.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1)
    }
  })

  it("answers every question in a native disclosure", () => {
    const { container } = renderPage()

    expect(container.querySelectorAll("#faq details")).toHaveLength(
      FAQ_SECTION.items.length
    )
    expect(container.querySelectorAll("#faq details > summary")).toHaveLength(
      FAQ_SECTION.items.length
    )
  })

  it("renders the contact form inside the contact section", () => {
    renderPage()

    expect(
      screen.getByTestId("contact-form").closest("#contact")
    ).not.toBeNull()
  })

  it("gives the dark stage monochrome errors and border-coloured fields", () => {
    const { container } = renderPage()
    const stage = container.querySelector<HTMLElement>("[data-status]")

    expect(stage).toHaveClass("dark", "scheme-dark", "isolate", "group/stage")
    expect(stage?.style.getPropertyValue("--destructive")).toBe(
      "var(--foreground)"
    )
    expect(stage?.style.getPropertyValue("--input")).toBe("var(--border)")
  })

  it("names the footer as text, never as a second heading", () => {
    const { container } = renderPage()
    const footer = container.querySelector("footer")

    if (footer === null) {
      throw new Error("footer not found")
    }

    expect(footer.querySelector("h1, h2")).toBeNull()
    expect(within(footer).getByText(DEFAULT_HERO_NAME).tagName).toBe("P")
    expect(
      screen.getByRole("navigation", { name: "Footer" })
    ).toBeInTheDocument()
  })
})
