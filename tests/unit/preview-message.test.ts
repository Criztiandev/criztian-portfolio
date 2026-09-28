import { describe, expect, it } from "vitest"

import {
  DEFAULT_HERO_NAME,
  PREVIEW_CONTENT_MESSAGE,
  PREVIEW_SCROLL_MESSAGE,
} from "@/data/site-content.data"
import { readPreviewMessage } from "@/features/site-content/site-content.rules"

const ORIGIN = "http://localhost:3000"

describe("readPreviewMessage", () => {
  it("accepts a content message from the expected origin", () => {
    const message = readPreviewMessage(ORIGIN, ORIGIN, {
      type: PREVIEW_CONTENT_MESSAGE,
      payload: { hero: { name: "Ada" } },
    })

    expect(message?.type).toBe(PREVIEW_CONTENT_MESSAGE)

    if (message?.type !== PREVIEW_CONTENT_MESSAGE) {
      throw new Error("expected a content message")
    }

    expect(message.payload.hero.name).toBe("Ada")
    expect(message.payload.theme.heroDot).toBeTruthy()
  })

  it("fills defaults around a partial payload", () => {
    const message = readPreviewMessage(ORIGIN, ORIGIN, {
      type: PREVIEW_CONTENT_MESSAGE,
      payload: {},
    })

    if (message?.type !== PREVIEW_CONTENT_MESSAGE) {
      throw new Error("expected a content message")
    }

    expect(message.payload.hero.name).toBe(DEFAULT_HERO_NAME)
  })

  it("accepts a scroll message", () => {
    const message = readPreviewMessage(ORIGIN, ORIGIN, {
      type: PREVIEW_SCROLL_MESSAGE,
      sectionId: "home",
    })

    expect(message).toEqual({ type: PREVIEW_SCROLL_MESSAGE, sectionId: "home" })
  })

  it("rejects a message from another origin", () => {
    const message = readPreviewMessage("https://evil.test", ORIGIN, {
      type: PREVIEW_CONTENT_MESSAGE,
      payload: { hero: { name: "Ada" } },
    })

    expect(message).toBeNull()
  })

  it("rejects an unknown message type", () => {
    expect(readPreviewMessage(ORIGIN, ORIGIN, { type: "eval" })).toBeNull()
  })

  it("rejects a content message whose payload fails the schema", () => {
    const message = readPreviewMessage(ORIGIN, ORIGIN, {
      type: PREVIEW_CONTENT_MESSAGE,
      payload: { theme: { accent: "rebeccapurple" } },
    })

    expect(message).toBeNull()
  })

  it("rejects non-object data", () => {
    expect(readPreviewMessage(ORIGIN, ORIGIN, "content")).toBeNull()
    expect(readPreviewMessage(ORIGIN, ORIGIN, null)).toBeNull()
  })
})
