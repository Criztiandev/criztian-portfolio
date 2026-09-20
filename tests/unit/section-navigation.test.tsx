import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ContactForm } from "@/features/contact/components/contact.form"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"

function renderShell() {
  return render(
    <PortfolioStoreProvider>
      <SectionNavigation />
      <ContactForm />
    </PortfolioStoreProvider>
  )
}

function getMobilePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector("#portfolio-mobile-nav")

  if (panel === null) {
    throw new Error("mobile nav panel not found")
  }

  return panel as HTMLElement
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

  it("closes the mobile panel when a section is chosen, preserving form input", () => {
    const { container } = renderShell()

    const message = screen.getByLabelText("Message")
    fireEvent.change(message, { target: { value: "A message in progress" } })

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
    expect(screen.getByLabelText("Message")).toHaveValue(
      "A message in progress"
    )
  })

  it("closes the mobile panel on Escape", () => {
    const { container } = renderShell()

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    fireEvent.keyDown(window, { key: "Escape" })

    expect(getMobilePanel(container)).toHaveAttribute("hidden")
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
