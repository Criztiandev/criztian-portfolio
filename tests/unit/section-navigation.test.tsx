import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ContactForm } from "@/features/contact/components/contact.form"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { TRPCReactProvider } from "@/lib/trpc/trpc.client"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"

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

function readHrefs(links: NodeListOf<HTMLAnchorElement>): (string | null)[] {
  const hrefs: (string | null)[] = []

  for (const link of links) {
    hrefs.push(link.getAttribute("href"))
  }

  return hrefs
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

    const panelLinks = panel.querySelectorAll("a")
    let contactLink: HTMLAnchorElement | null = null

    for (const link of panelLinks) {
      if (link.getAttribute("href") === "#contact") {
        contactLink = link
      }
    }

    if (contactLink === null) {
      throw new Error("contact link not found in mobile panel")
    }

    fireEvent.click(contactLink)

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
    expect(getMessageField(container)).toHaveValue("A message in progress")
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

  it("marks the chosen section as current", () => {
    const { container } = renderShell()

    const panel = getMobilePanel(container)
    const links = panel.querySelectorAll("a")

    for (const link of links) {
      if (link.getAttribute("href") === "#about") {
        fireEvent.click(link)
      }
    }

    const desktopLinks = container.querySelectorAll('a[href="#about"]')
    let marked = false

    for (const link of desktopLinks) {
      if (link.getAttribute("aria-current") === "true") {
        marked = true
      }
    }

    expect(marked).toBe(true)
  })
})
