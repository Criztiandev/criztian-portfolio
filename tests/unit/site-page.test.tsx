import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  ABOUT_SECTION,
  FAQ_SECTION,
  OWNER_EMAIL_HREF,
  PROCESS_SCENE,
  SERVICES_SCENE,
} from "@/data/page-sections.data"
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
  "project",
  "services",
  "process",
  "about",
  "testimonials",
  "dust",
  "contact",
  "footer",
]

const SECTION_ORDER = [
  "home",
  "quote",
  "project",
  "services",
  "process",
  "about",
  "testimonials",
  "faq",
  "contact",
]

const RETIRED_SECTION_IDS = ["connect", "blog"]

const PLACEHOLDER_PLATE_SECTION_IDS = ["project", "about", "testimonials"]

const PLATE_SLOT_SECTION_IDS = ["about", "testimonials"]

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

    expect(labelledCount).toBe(7)
  })

  it("orders the sections as the locked design does, with Connect and Blog gone", () => {
    const { container } = renderPage()
    const order: string[] = []

    for (const section of container.querySelectorAll("section")) {
      order.push(section.id)
    }

    expect(order).toEqual(SECTION_ORDER)

    for (const id of RETIRED_SECTION_IDS) {
      expect(container.querySelector(`[id="${id}"]`), id).toBeNull()
      expect(container.querySelector(`a[href="#${id}"]`), id).toBeNull()
    }
  })

  it("gives every placeholder plate a decorative image", () => {
    const { container } = renderPage()

    for (const id of PLACEHOLDER_PLATE_SECTION_IDS) {
      const images = container.querySelectorAll(`#${id} img`)

      expect(images.length, id).toBeGreaterThan(0)

      for (const image of images) {
        expect(image, id).toHaveAttribute("alt", "")
      }
    }
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
    expect(stage?.style.getPropertyValue("--ring")).toBe("var(--foreground)")
    expect(stage?.style.getPropertyValue("--rule")).toContain(
      "var(--foreground)"
    )
  })

  it("merges the email line into contact and lists the stats as a dl", () => {
    const { container } = renderPage()
    const stats = container.querySelectorAll("#about dl > div")

    expect(
      container.querySelector(`#contact a[href="${OWNER_EMAIL_HREF}"]`)
    ).not.toBeNull()
    expect(stats).toHaveLength(ABOUT_SECTION.stats.length)

    for (const stat of stats) {
      expect(stat.querySelector("dt")).not.toBeNull()
      expect(stat.querySelector("dd")).not.toBeNull()
    }
  })

  it("sets the About and Testimonials slots on their plates", () => {
    const { container } = renderPage()

    for (const id of PLATE_SLOT_SECTION_IDS) {
      const slot = container.querySelector(`#${id} [data-dot-slot]`)

      expect(slot?.parentElement?.querySelector("img"), id).not.toBeNull()
    }
  })

  it("gathers the contact dots round the form box behind the form", () => {
    const { container } = renderPage()
    const slot = container.querySelector<HTMLElement>(
      "#contact [data-dot-slot]"
    )

    if (slot === null) {
      throw new Error("the contact slot is missing")
    }

    expect(slot.nextElementSibling?.tagName).toBe("FORM")
    expect(slot.className).toContain("pointer-events-none")
  })

  it("gates the contact frame so a form that cannot fit flows", () => {
    const { container } = renderPage()
    const contact = container.querySelector("#contact")

    expect(contact?.firstElementChild).toHaveAttribute("data-fit-box")
    expect(contact?.lastElementChild?.tagName).toBe("SPAN")
    expect(contact?.lastElementChild).toHaveAttribute("hidden")
  })

  it("keeps the step copy in reading order inside each scene's board", () => {
    const { container } = renderPage()

    for (const scene of [SERVICES_SCENE, PROCESS_SCENE]) {
      const section = container.querySelector(`#${scene.id}`)
      const titles: string[] = []
      const expected: string[] = []

      for (const title of section?.querySelectorAll("h3") ?? []) {
        titles.push(title.textContent ?? "")
      }

      for (const step of scene.steps) {
        expected.push(step.title)
      }

      expect(titles).toEqual(expected)
    }
  })

  it("gates the services board and every orbit step, never the orbit board", () => {
    const { container } = renderPage()
    const services = container.querySelector("#services")
    const process = container.querySelector("#process")
    const steps = container.querySelectorAll("#process [data-orbit-step]")

    expect(services?.children[1]).toHaveAttribute("data-fit-box")
    expect(process?.children[1]).not.toHaveAttribute("data-fit-box")
    expect(steps).toHaveLength(PROCESS_SCENE.steps.length)

    for (const step of steps) {
      expect(step).toHaveAttribute("data-fit-box")
    }
  })

  it("keys every service caption to its shape", () => {
    const { container } = renderPage()
    const captions: string[] = []

    for (const caption of container.querySelectorAll<HTMLElement>(
      "#services [data-caption]"
    )) {
      captions.push(caption.dataset.caption ?? "")
      expect(caption.querySelectorAll("[data-caption-line]")).toHaveLength(3)
    }

    expect(captions.join(" ")).toBe(SERVICES_SCENE.shapes)
  })

  it("puts one orbit step on the rim for every process shape, in order", () => {
    const { container } = renderPage()
    const shapes: string[] = []

    for (const step of container.querySelectorAll<HTMLElement>(
      "#process [data-orbit-step]"
    )) {
      shapes.push(step.dataset.orbitStep ?? "")
    }

    expect(shapes.join(" ")).toBe(PROCESS_SCENE.shapes)
  })

  it("hides only the decorative orbit leaves from assistive tech", () => {
    const { container } = renderPage()
    const ring = container.querySelector("#process svg")
    const numerals: string[] = []

    expect(ring).toHaveAttribute("aria-hidden", "true")

    for (const step of container.querySelectorAll(
      "#process [data-orbit-step]"
    )) {
      const numeral = step.firstElementChild

      expect(numeral).toHaveAttribute("aria-hidden", "true")
      numerals.push(numeral?.textContent ?? "")
      expect(step.querySelector("h3")).not.toHaveAttribute("aria-hidden")
      expect(step.querySelector("p")).not.toHaveAttribute("aria-hidden")
    }

    expect(numerals).toEqual(["01", "02", "03", "04", "05"])
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
