import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  HERO_TEXT_FIELDS,
  PREVIEW_CONTENT_MESSAGE,
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

  it("keeps the publish button disabled while the live site is current", () => {
    renderPanel()

    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled()
  })
})
