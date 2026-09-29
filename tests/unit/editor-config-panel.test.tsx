import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  DEFAULT_PROJECT_ITEMS,
  HERO_NAME_MAX_LENGTH,
  HERO_TEXT_FIELDS,
  NEW_PROJECT_ITEM,
  PREVIEW_CONTENT_MESSAGE,
  PROJECT_ITEM_FIELDS,
  PROJECTS_MAX,
  THEME_COLOR_FIELDS,
} from "@/data/site-content.data"
import { EditorConfigPanel } from "@/features/site-content/components/editor-config-panel.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"
import { TRPCReactProvider } from "@/lib/trpc/trpc.client"
import { EditorStoreProvider } from "@/providers/editor-store.provider"
import type { SiteContent } from "@/types/site-content.type"

function renderPanel() {
  const postMessage = vi.fn()
  const frameRef = {
    current: { contentWindow: { postMessage } },
  } as unknown as React.RefObject<HTMLIFrameElement | null>

  const content = createDefaultSiteContent()
  const pendingContentRef: React.RefObject<SiteContent> = { current: content }

  render(
    <TRPCReactProvider>
      <EditorStoreProvider>
        <EditorConfigPanel
          initialContent={content}
          initialHasUnpublishedChanges={false}
          frameRef={frameRef}
          pendingContentRef={pendingContentRef}
        />
      </EditorStoreProvider>
    </TRPCReactProvider>
  )

  return { postMessage, pendingContentRef }
}

describe("EditorConfigPanel", () => {
  it("renders an input for every hero text field", () => {
    renderPanel()

    for (const textField of HERO_TEXT_FIELDS) {
      expect(screen.getByLabelText(textField.label)).toBeInTheDocument()
    }
  })

  it("renders a colour input for every theme field", () => {
    renderPanel()

    for (const colorField of THEME_COLOR_FIELDS) {
      expect(screen.getByLabelText(colorField.label)).toBeInTheDocument()
      expect(
        screen.getByLabelText(`${colorField.label} swatch`)
      ).toBeInTheDocument()
    }
  })

  it("shows the hero fields first and hides the theme fields", () => {
    renderPanel()

    const panel = screen.getByRole("complementary", { name: "Settings" })

    expect(panel).toHaveAttribute("data-selected-entry", "hero")
    expect(screen.getByLabelText("Name").closest("[hidden]")).toBeNull()
    expect(screen.getByLabelText("Accent").closest("[hidden]")).not.toBeNull()
  })

  it("posts the edited content to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada" },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].type).toBe(PREVIEW_CONTENT_MESSAGE)
    expect(lastCall[0].payload.hero.name).toBe("Ada")
    expect(lastCall[1]).toBe(window.location.origin)
  })

  it("renders hidden quote fields until the quote entry is selected", () => {
    renderPanel()

    expect(screen.getByLabelText("Quote").closest("[hidden]")).not.toBeNull()
    expect(screen.getByLabelText("Author").closest("[hidden]")).not.toBeNull()
  })

  it("posts an edited quote to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Quote"), {
      target: { value: "Keep going." },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.quote.text).toBe("Keep going.")
  })

  it("caps the name input at the schema limit", () => {
    renderPanel()

    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "maxLength",
      String(HERO_NAME_MAX_LENGTH)
    )
  })

  it("renders hidden project fields until the projects entry is selected", () => {
    renderPanel()

    expect(
      screen.getByLabelText("Project 1 title").closest("[hidden]")
    ).not.toBeNull()
    expect(
      screen.getByRole("button", { name: "Add project", hidden: true })
    ).toBeInTheDocument()
  })

  it("renders every project field with its schema limit", () => {
    renderPanel()

    for (const itemField of PROJECT_ITEM_FIELDS) {
      const input = screen.getByLabelText(`Project 1 ${itemField.label}`)

      expect(input).toHaveAttribute("maxLength", String(itemField.maxLength))
    }

    expect(screen.queryByLabelText("Heading")).toBeNull()
    expect(screen.queryByLabelText("Intro")).toBeNull()
  })

  it("posts an edited project title to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Project 2 title"), {
      target: { value: "Online shop" },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.projects.items[1].title).toBe("Online shop")
  })

  it("appends a new project and posts it to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.click(
      screen.getByRole("button", { name: "Add project", hidden: true })
    )

    expect(screen.getByLabelText("Project 4 title")).toHaveValue(
      NEW_PROJECT_ITEM.title
    )

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.projects.items).toHaveLength(4)
    expect(lastCall[0].payload.projects.items[3]).toEqual(NEW_PROJECT_ITEM)
  })

  it("removes a project", () => {
    renderPanel()

    fireEvent.click(
      screen.getByRole("button", { name: "Remove project 1", hidden: true })
    )

    expect(screen.queryByLabelText("Project 3 title")).toBeNull()
    expect(screen.getByLabelText("Project 1 title")).toHaveValue("Project two")
  })

  it("moves a project up and never moves the first", () => {
    renderPanel()

    expect(
      screen.getByRole("button", { name: "Move project 1 up", hidden: true })
    ).toBeDisabled()

    fireEvent.click(
      screen.getByRole("button", { name: "Move project 2 up", hidden: true })
    )

    expect(screen.getByLabelText("Project 1 title")).toHaveValue("Project two")
    expect(screen.getByLabelText("Project 2 title")).toHaveValue("Project one")
  })

  it("disables adding once the list is full", () => {
    renderPanel()

    const addButton = screen.getByRole("button", {
      name: "Add project",
      hidden: true,
    })

    for (
      let count = DEFAULT_PROJECT_ITEMS.length;
      count < PROJECTS_MAX;
      count += 1
    ) {
      expect(addButton).toBeEnabled()
      fireEvent.click(addButton)
    }

    expect(screen.getByLabelText(`Project ${PROJECTS_MAX} title`)).toBeTruthy()
    expect(addButton).toBeDisabled()
  })

  it("keeps the publish button disabled while the live site is current", () => {
    renderPanel()

    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled()
  })
})
