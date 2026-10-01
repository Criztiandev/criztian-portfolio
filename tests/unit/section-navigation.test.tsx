import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MOBILE_MENU_WIPE_CLASS } from "@/data/motion.data"
import {
  NAV_DOT_CLASS,
  PORTFOLIO_BRAND_LABEL,
  PORTFOLIO_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
  SCROLL_SPY_SECTION_IDS,
} from "@/data/navigation.data"
import { ContactForm } from "@/features/contact/components/contact.form"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { TRPCReactProvider } from "@/lib/trpc/trpc.client"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"
import type { PortfolioSection } from "@/types/portfolio.type"

const LANDING_TOP_PX = 90

const SECTION_HEIGHT_PX = 900

const VIEWPORT_WIDTH_PX = 1440

function renderShell() {
  return render(
    <TRPCReactProvider>
      <PortfolioStoreProvider>
        <SectionNavigation />
        <ContactForm />
      </PortfolioStoreProvider>
    </TRPCReactProvider>
  )
}

function renderPage() {
  return render(
    <PortfolioStoreProvider>
      <SectionNavigation />
      <main>
        {SCROLL_SPY_SECTION_IDS.map(function renderSection(sectionId) {
          return (
            <section
              key={sectionId}
              id={sectionId}
              style={{ scrollMarginTop: `${LANDING_TOP_PX}px` }}
            />
          )
        })}
      </main>
    </PortfolioStoreProvider>
  )
}

function getHeader(container: HTMLElement): HTMLElement {
  const header = container.querySelector("header")

  if (header === null) {
    throw new Error("header not found")
  }

  return header
}

function getMobilePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector("#portfolio-mobile-nav")

  if (panel === null) {
    throw new Error("mobile nav panel not found")
  }

  return panel as HTMLElement
}

function getMessageField(container: HTMLElement): HTMLTextAreaElement {
  const field = container.querySelector("textarea")

  if (field === null) {
    throw new Error("message field not found")
  }

  return field
}

function getLink(scope: HTMLElement, href: string): HTMLAnchorElement {
  const link = scope.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)

  if (link === null) {
    throw new Error(`link ${href} not found`)
  }

  return link
}

function readHrefs(links: NodeListOf<HTMLAnchorElement>): (string | null)[] {
  const hrefs: (string | null)[] = []

  for (const link of links) {
    hrefs.push(link.getAttribute("href"))
  }

  return hrefs
}

function readCurrentHrefs(container: HTMLElement): (string | null)[] {
  return readHrefs(
    getHeader(container).querySelectorAll<HTMLAnchorElement>(
      'a[aria-current="true"]'
    )
  )
}

function readDottedHrefs(scope: HTMLElement): (string | null)[] {
  const hrefs: (string | null)[] = []

  for (const link of scope.querySelectorAll("a")) {
    if (link.querySelector("span") !== null) {
      hrefs.push(link.getAttribute("href"))
    }
  }

  return hrefs
}

function findSectionIndex(id: PortfolioSection): number {
  for (const [index, sectionId] of SCROLL_SPY_SECTION_IDS.entries()) {
    if (sectionId === id) {
      return index
    }
  }

  throw new Error(`section ${id} is not watched by the scroll-spy`)
}

function stubSectionTops(landedId: PortfolioSection): void {
  const landedIndex = findSectionIndex(landedId)

  for (const [index, sectionId] of SCROLL_SPY_SECTION_IDS.entries()) {
    const section = document.getElementById(sectionId)

    if (section === null) {
      throw new Error(`section ${sectionId} not found`)
    }

    const top = LANDING_TOP_PX + (index - landedIndex) * SECTION_HEIGHT_PX

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, top, VIEWPORT_WIDTH_PX, SECTION_HEIGHT_PX)
    )
  }

  document.documentElement.scrollTop = (landedIndex + 1) * SECTION_HEIGHT_PX
}

function scrollOnto(landedId: PortfolioSection): void {
  stubSectionTops(landedId)
  fireEvent.scroll(window)
}

describe("SectionNavigation", () => {
  it("starts with the mobile panel hidden", () => {
    const { container } = renderShell()

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
  })

  it("opens the mobile panel from the toggle", () => {
    const { container } = renderShell()

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))

    expect(getMobilePanel(container)).not.toHaveAttribute("hidden")
  })

  it("wipes the mobile panel open without delaying its hidden toggle", () => {
    const { container } = renderShell()
    const panel = getMobilePanel(container)

    expect(panel).toHaveClass(...MOBILE_MENU_WIPE_CLASS.split(" "))
    expect(panel).toHaveAttribute("aria-label", "Sections")
    expect(panel).toHaveAttribute("data-lenis-prevent")

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))

    expect(panel).not.toHaveAttribute("hidden")
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("links the five centre sections and the talk action", () => {
    renderShell()

    const primary = screen.getByRole("navigation", { name: "Primary" })
    const labels: string[] = []

    for (const link of within(primary).getAllByRole("link")) {
      labels.push(link.textContent ?? "")
    }

    expect(labels).toEqual(["Work", "Services", "Process", "About", "FAQ"])
    expect(within(primary).getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "#project"
    )

    const secondary = screen.getByRole("navigation", { name: "Secondary" })

    expect(
      within(secondary).getByRole("link", { name: "Let's talk" })
    ).toHaveAttribute("href", "#contact")
  })

  it("lists every section anchor in the mobile panel", () => {
    const { container } = renderShell()

    const panel = getMobilePanel(container)

    expect(readHrefs(panel.querySelectorAll("a"))).toEqual([
      "#home",
      "#project",
      "#services",
      "#process",
      "#about",
      "#testimonials",
      "#faq",
      "#contact",
    ])
  })

  it("closes the mobile panel when a section is chosen, preserving form input", () => {
    const { container } = renderShell()

    fireEvent.change(getMessageField(container), {
      target: { value: "A message in progress" },
    })

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const panel = getMobilePanel(container)
    expect(panel).not.toHaveAttribute("hidden")

    fireEvent.click(getLink(panel, "#contact"))

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
    expect(getMessageField(container)).toHaveValue("A message in progress")
  })

  it("closes the open menu from every header link", () => {
    const { container } = renderShell()
    const menuButton = screen.getByRole("button", { name: "Open menu" })
    const links = getHeader(container).querySelectorAll("a")

    expect(links).toHaveLength(
      2 + PORTFOLIO_PRIMARY_NAVIGATION.length + PORTFOLIO_NAVIGATION.length
    )

    for (const link of links) {
      fireEvent.click(menuButton)
      expect(getMobilePanel(container)).not.toHaveAttribute("hidden")

      fireEvent.click(link)
      expect(getMobilePanel(container)).toHaveAttribute("hidden")
    }
  })

  it("leaves the current section to the scroll-spy when a link is clicked", () => {
    const { container } = renderShell()
    const primary = screen.getByRole("navigation", { name: "Primary" })

    expect(readCurrentHrefs(container)).toEqual(["#home"])

    fireEvent.click(getLink(getMobilePanel(container), "#about"))
    fireEvent.click(getLink(primary, "#services"))
    fireEvent.click(screen.getByRole("link", { name: "Let's talk" }))

    expect(readCurrentHrefs(container)).toEqual(["#home"])
    expect(readDottedHrefs(primary)).toEqual([])
  })

  it("closes the mobile panel on Escape", () => {
    const { container } = renderShell()

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    fireEvent.keyDown(window, { key: "Escape" })

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
  })

  it("returns focus to the menu button when Escape closes the panel", () => {
    const { container } = renderShell()
    const menuButton = screen.getByRole("button", { name: "Open menu" })

    fireEvent.click(menuButton)

    const firstLink = getMobilePanel(container).querySelector("a")

    if (firstLink === null) {
      throw new Error("mobile panel link not found")
    }

    firstLink.focus()
    fireEvent.keyDown(window, { key: "Escape" })

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
    expect(menuButton).toHaveFocus()
  })

  it("leaves focus outside the panel where it is on Escape", () => {
    const { container } = renderShell()
    const messageField = getMessageField(container)

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    messageField.focus()
    fireEvent.keyDown(window, { key: "Escape" })

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
    expect(messageField).toHaveFocus()
  })

  it("draws the scroll progress hairline along the bar's bottom edge", () => {
    const { container } = renderShell()
    const header = getHeader(container)
    const hairlines = header.querySelectorAll(".scroll-progress")

    expect(hairlines).toHaveLength(1)

    const hairline = hairlines[0]

    expect(hairline?.tagName).toBe("SPAN")
    expect(hairline).toHaveAttribute("aria-hidden", "true")
    expect(hairline).toBeEmptyDOMElement()
    expect(hairline).toHaveClass(
      "pointer-events-none",
      "absolute",
      "-bottom-px",
      "z-10",
      "h-px",
      "origin-left",
      "bg-foreground/40",
      "hidden",
      "supports-[animation-timeline:scroll()]:block"
    )
    expect(hairline?.parentElement).toHaveClass("relative", "h-18")
    expect(hairline?.parentElement?.parentElement).toBe(header)
  })

  it("tags the header and its three groups for the no-JavaScript reveal", () => {
    const { container } = renderShell()
    const header = getHeader(container)
    const brandLink = screen.getByRole("link", { name: PORTFOLIO_BRAND_LABEL })

    expect(header).toHaveAttribute("data-reveal", "")
    expect(header.querySelectorAll("[data-reveal]")).toHaveLength(3)
    expect(brandLink.parentElement).toHaveAttribute("data-reveal", "")
    expect(screen.getByRole("navigation", { name: "Primary" })).toHaveAttribute(
      "data-reveal",
      ""
    )
    expect(
      screen.getByRole("navigation", { name: "Secondary" })
    ).toHaveAttribute("data-reveal", "")
  })
})

describe("SectionNavigation scroll-spy", () => {
  beforeEach(() => {
    Object.defineProperty(document, "scrollingElement", {
      configurable: true,
      value: document.documentElement,
    })
  })

  afterEach(() => {
    cleanup()
    Reflect.deleteProperty(document, "scrollingElement")
    document.documentElement.scrollTop = 0
    vi.restoreAllMocks()
  })

  it("marks the section scrolled to as current in both navs", async () => {
    const { container } = renderPage()

    scrollOnto("about")

    await waitFor(function expectAboutCurrent() {
      expect(readCurrentHrefs(container)).toEqual(["#about", "#about"])
    })
  })

  it("marks a deep-linked section without waiting for a scroll event", async () => {
    const { container } = renderPage()

    stubSectionTops("process")

    await waitFor(function expectProcessCurrent() {
      expect(readCurrentHrefs(container)).toEqual(["#process", "#process"])
    })
  })

  it("steps the nav dot under each primary link the page passes", async () => {
    const { container } = renderPage()
    const primary = screen.getByRole("navigation", { name: "Primary" })

    expect(readDottedHrefs(primary)).toEqual([])

    for (const item of PORTFOLIO_PRIMARY_NAVIGATION) {
      scrollOnto(item.id)

      await waitFor(function expectDotUnderLink() {
        expect(readDottedHrefs(primary)).toEqual([item.href])
      })

      const link = within(primary).getByRole("link", { name: item.label })

      expect(link.textContent).toBe(item.label)
      expect(readDottedHrefs(getMobilePanel(container))).toEqual([])
    }
  })

  it("draws the nav dot as an empty decorative leaf placed without transforms", async () => {
    renderPage()
    const primary = screen.getByRole("navigation", { name: "Primary" })

    scrollOnto("services")

    await waitFor(function expectServicesDot() {
      expect(readDottedHrefs(primary)).toEqual(["#services"])
    })

    const link = getLink(primary, "#services")
    const dot = link.querySelector("span")

    expect(link).toHaveClass("relative")
    expect(dot).toHaveAttribute("aria-hidden", "true")
    expect(dot).toBeEmptyDOMElement()
    expect(dot).toHaveClass(...NAV_DOT_CLASS.split(" "))
    expect(dot).toHaveClass("size-1.5", "rounded-full", "bg-foreground")
    expect(dot?.className).not.toMatch(/translate/)
  })

  it("hides the nav dot on a section without a primary link", async () => {
    const { container } = renderPage()
    const primary = screen.getByRole("navigation", { name: "Primary" })

    scrollOnto("about")

    await waitFor(function expectAboutDot() {
      expect(readDottedHrefs(primary)).toEqual(["#about"])
    })

    scrollOnto("testimonials")

    await waitFor(function expectTestimonialsCurrent() {
      expect(readCurrentHrefs(container)).toEqual(["#testimonials"])
    })
    expect(readDottedHrefs(primary)).toEqual([])
    expect(readDottedHrefs(getMobilePanel(container))).toEqual([])
  })

  it("hides the nav dot on Let's connect, between FAQ and Contact", async () => {
    const { container } = renderPage()
    const primary = screen.getByRole("navigation", { name: "Primary" })

    scrollOnto("faq")

    await waitFor(function expectFaqDot() {
      expect(readDottedHrefs(primary)).toEqual(["#faq"])
    })

    scrollOnto("connect")

    await waitFor(function expectNothingCurrent() {
      expect(readCurrentHrefs(container)).toEqual([])
    })
    expect(readDottedHrefs(primary)).toEqual([])
    expect(readDottedHrefs(getMobilePanel(container))).toEqual([])

    scrollOnto("contact")

    await waitFor(function expectContactCurrent() {
      expect(readCurrentHrefs(container)).toEqual(["#contact"])
    })
  })

  it("watches every section in page order, Let's connect included", () => {
    const navigationIds: string[] = []
    const watchedIds: string[] = []

    for (const item of PORTFOLIO_NAVIGATION) {
      navigationIds.push(item.id)
    }

    for (const sectionId of SCROLL_SPY_SECTION_IDS) {
      if (sectionId !== "connect") {
        watchedIds.push(sectionId)
      }
    }

    expect(SCROLL_SPY_SECTION_IDS.indexOf("connect")).toBe(
      SCROLL_SPY_SECTION_IDS.indexOf("faq") + 1
    )
    expect(SCROLL_SPY_SECTION_IDS.indexOf("contact")).toBe(
      SCROLL_SPY_SECTION_IDS.indexOf("connect") + 1
    )
    expect(watchedIds).toEqual(navigationIds)
  })

  it("keeps an open menu open while the page scrolls", async () => {
    const { container } = renderPage()

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    scrollOnto("contact")

    await waitFor(function expectContactCurrent() {
      expect(readCurrentHrefs(container)).toEqual(["#contact"])
    })
    expect(getMobilePanel(container)).not.toHaveAttribute("hidden")
  })
})
