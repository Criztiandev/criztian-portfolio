import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  CONNECT_SCENE_SHAPES,
  COPY_DRIFT_CLASS,
  CUE_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_TITLE_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import {
  DEFAULT_CONNECT_EMAIL,
  DEFAULT_CONNECT_EMAIL_PROMPT,
  DEFAULT_CONNECT_STATEMENT,
} from "@/data/site-content.data"
import { ConnectSection } from "@/features/portfolio/components/connect-section.component"
import {
  buildCopyDriftStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import type { SiteContentConnect } from "@/types/site-content.type"

const OWNER_CONNECT: SiteContentConnect = {
  statement: DEFAULT_CONNECT_STATEMENT,
  emailPrompt: DEFAULT_CONNECT_EMAIL_PROMPT,
  email: DEFAULT_CONNECT_EMAIL,
}

const EDITED_CONNECT: SiteContentConnect = {
  statement: "Say hello.",
  emailPrompt: "Write to me:",
  email: "hello@example.test",
}

function renderConnect(connect: SiteContentConnect) {
  return render(<ConnectSection connect={connect} />)
}

function findElement(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector)

  if (element === null) {
    throw new Error(`${selector} is missing`)
  }

  return element
}

function readSweptLines(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[class*='caption-line']")
  )
}

describe("ConnectSection", () => {
  it("renders the owner's statement and email line", () => {
    const { container } = renderConnect(OWNER_CONNECT)
    const [statement, emailLine] = readSweptLines(container)

    expect(statement).toHaveTextContent(DEFAULT_CONNECT_STATEMENT)
    expect(emailLine?.textContent).toBe(
      `${DEFAULT_CONNECT_EMAIL_PROMPT} ${DEFAULT_CONNECT_EMAIL}`
    )
    expect(emailLine).toHaveClass(...CUE_CLASS.split(" "))
  })

  it("links the address as a mailto link that clears the fixed header", () => {
    renderConnect(OWNER_CONNECT)
    const link = screen.getByRole("link", { name: DEFAULT_CONNECT_EMAIL })

    expect(link).toHaveAttribute("href", `mailto:${DEFAULT_CONNECT_EMAIL}`)
    expect(link).toHaveClass("text-foreground", "underline", "scroll-mt-18")
  })

  it("renders what the editor saved", () => {
    renderConnect(EDITED_CONNECT)

    expect(screen.getByText(EDITED_CONNECT.statement)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: EDITED_CONNECT.email })
    ).toHaveAttribute("href", `mailto:${EDITED_CONNECT.email}`)
    expect(screen.queryByText(DEFAULT_CONNECT_STATEMENT)).toBeNull()
  })

  it("shows just the link when the email line is blank", () => {
    const { container } = renderConnect({ ...OWNER_CONNECT, emailPrompt: "" })
    const emailLine = readSweptLines(container)[1]

    expect(emailLine?.textContent).toBe(DEFAULT_CONNECT_EMAIL)
    expect(emailLine?.firstChild?.nodeName).toBe("A")
  })

  it("adds no label, arrival title or heading, like the quote", () => {
    const { container } = renderConnect(OWNER_CONNECT)
    const section = findElement(container, "section")

    expect(screen.queryByRole("heading")).toBeNull()
    expect(section).not.toHaveAttribute("aria-labelledby")
    expect(section).not.toHaveClass(SECTION_TITLE_CLASS)
  })

  it("draws the handshake in one empty slot, hidden from assistive tech and without WebGL", () => {
    const { container } = renderConnect(OWNER_CONNECT)
    const section = findElement(container, "section")
    const slots = container.querySelectorAll("[data-dot-slot]")

    expect(section).toHaveAttribute("id", "connect")
    expect(section).toHaveAttribute("data-dot-scene", "connect")
    expect(section).toHaveAttribute("data-dot-shapes", CONNECT_SCENE_SHAPES)
    expect(section).toHaveClass("scroll-mt-18")
    expect(slots).toHaveLength(1)
    expect(slots[0]).toHaveAttribute("aria-hidden", "true")
    expect(slots[0]).toHaveClass("group-data-[status=unsupported]/stage:hidden")
    expect(slots[0]).toBeEmptyDOMElement()
    expect(section.firstElementChild?.contains(slots[0] ?? null)).toBe(true)
  })

  it("sweeps the statement and then the email line with the handshake", () => {
    const { container } = renderConnect(OWNER_CONNECT)
    const lines = readSweptLines(container)
    const numbers: string[] = []

    for (const line of lines) {
      expect(line).toHaveClass(SWEPT_LINE_CLASS)
      numbers.push(line.style.getPropertyValue("--line"))
    }

    expect(numbers).toEqual(["0", "1"])
    expect(lines[0]?.closest("[aria-hidden]")).toBeNull()
  })

  it("drifts the copy column on the section's own screen timeline", () => {
    const { container } = renderConnect(OWNER_CONNECT)
    const section = findElement(container, "section")
    const statement = readSweptLines(container)[0]
    const sceneStyle = {
      ...buildSceneCaptionStyle(1),
      ...buildCopyDriftStyle(),
    }

    expect(section).toHaveClass(SCREEN_TIMELINE_CLASS)
    expect(statement?.parentElement).toHaveClass(COPY_DRIFT_CLASS)

    for (const [property, value] of Object.entries(sceneStyle)) {
      expect(section.style.getPropertyValue(property), property).toBe(
        String(value)
      )
    }
  })
})
