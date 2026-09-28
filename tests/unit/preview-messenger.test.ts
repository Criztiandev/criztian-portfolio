import { describe, expect, it, vi } from "vitest"

import {
  PREVIEW_CONTENT_MESSAGE,
  PREVIEW_SCROLL_MESSAGE,
} from "@/data/site-content.data"
import { postPreviewMessage } from "@/features/site-content/services/preview-messenger.service"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"

function createFrame(contentWindow: unknown): HTMLIFrameElement {
  return { contentWindow } as unknown as HTMLIFrameElement
}

describe("postPreviewMessage", () => {
  it("posts a content message to the frame with an explicit origin", () => {
    const postMessage = vi.fn()
    const content = createDefaultSiteContent()

    postPreviewMessage(createFrame({ postMessage }), {
      type: PREVIEW_CONTENT_MESSAGE,
      payload: content,
    })

    expect(postMessage).toHaveBeenCalledTimes(1)
    expect(postMessage).toHaveBeenCalledWith(
      { type: PREVIEW_CONTENT_MESSAGE, payload: content },
      window.location.origin
    )
  })

  it("never posts to a wildcard origin", () => {
    const postMessage = vi.fn()

    postPreviewMessage(createFrame({ postMessage }), {
      type: PREVIEW_SCROLL_MESSAGE,
      sectionId: "home",
    })

    expect(postMessage.mock.calls[0][1]).not.toBe("*")
  })

  it("posts a scroll message with the section id", () => {
    const postMessage = vi.fn()

    postPreviewMessage(createFrame({ postMessage }), {
      type: PREVIEW_SCROLL_MESSAGE,
      sectionId: "home",
    })

    expect(postMessage).toHaveBeenCalledWith(
      { type: PREVIEW_SCROLL_MESSAGE, sectionId: "home" },
      window.location.origin
    )
  })

  it("does nothing when the frame is missing", () => {
    expect(function postToNothing() {
      postPreviewMessage(null, {
        type: PREVIEW_SCROLL_MESSAGE,
        sectionId: "home",
      })
    }).not.toThrow()
  })

  it("does nothing when the frame has no content window", () => {
    expect(function postToDetachedFrame() {
      postPreviewMessage(createFrame(null), {
        type: PREVIEW_SCROLL_MESSAGE,
        sectionId: "home",
      })
    }).not.toThrow()
  })
})
