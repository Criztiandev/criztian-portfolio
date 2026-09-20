import { describe, expect, it } from "vitest"

import {
  DEFAULT_HERO_DISCIPLINES,
  DEFAULT_HERO_NAME,
  DEFAULT_HERO_SCROLL_LABEL,
  DEFAULT_HERO_TAGLINE_TEXT,
  DEFAULT_HERO_WORKS_LABEL,
  DEFAULT_THEME_HERO_DOT,
  DEFAULT_THEME_PAGE_BACKGROUND,
  HERO_MAX_DISCIPLINES,
} from "@/data/site-content.data"
import {
  buildEditorFormValues,
  createDefaultSiteContent,
  hasUnpublishedChanges,
  isPreviewReadyMessage,
  padDisciplineSlots,
  parseSiteContent,
  readPreviewWidthValue,
} from "@/features/site-content/site-content.rules"

describe("createDefaultSiteContent", () => {
  it("fills every hero field from an empty document", () => {
    const content = createDefaultSiteContent()

    expect(content.hero.name).toBe(DEFAULT_HERO_NAME)
    expect(content.hero.scrollLabel).toBe(DEFAULT_HERO_SCROLL_LABEL)
    expect(content.hero.worksLabel).toBe(DEFAULT_HERO_WORKS_LABEL)
    expect(content.hero.disciplines).toEqual(DEFAULT_HERO_DISCIPLINES)
  })

  it("fills the tagline as a rich text document", () => {
    const content = createDefaultSiteContent()

    expect(content.hero.tagline.type).toBe("doc")
    expect(JSON.stringify(content.hero.tagline)).toContain(
      DEFAULT_HERO_TAGLINE_TEXT
    )
  })

  it("fills every theme colour", () => {
    const content = createDefaultSiteContent()

    expect(content.theme.pageBackground).toBe(DEFAULT_THEME_PAGE_BACKGROUND)
    expect(content.theme.heroDot).toBe(DEFAULT_THEME_HERO_DOT)
    expect(Object.keys(content.theme)).toHaveLength(6)
  })
})

describe("parseSiteContent", () => {
  it("fills missing fields around a partial document", () => {
    const result = parseSiteContent({ hero: { name: "Ada" } })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.hero.name).toBe("Ada")
    expect(result.content.hero.worksLabel).toBe(DEFAULT_HERO_WORKS_LABEL)
    expect(result.content.theme.heroDot).toBe(DEFAULT_THEME_HERO_DOT)
  })

  it("collapses whitespace in text fields", () => {
    const result = parseSiteContent({ hero: { name: "  Ada   Lovelace  " } })

    expect(result.content.hero.name).toBe("Ada Lovelace")
  })

  it("normalises hex colours to lowercase", () => {
    const result = parseSiteContent({ theme: { heroDot: "#AABBCC" } })

    expect(result.content.theme.heroDot).toBe("#aabbcc")
  })

  it("falls back to defaults when the document is null", () => {
    const result = parseSiteContent(null)

    expect(result.usedDefaults).toBe(true)
    expect(result.content.hero.name).toBe(DEFAULT_HERO_NAME)
  })

  it("falls back to defaults when a colour is not a hex value", () => {
    const result = parseSiteContent({ theme: { accent: "rebeccapurple" } })

    expect(result.usedDefaults).toBe(true)
    expect(result.content.hero.name).toBe(DEFAULT_HERO_NAME)
  })

  it("falls back to defaults when the document is the wrong shape", () => {
    const result = parseSiteContent("not a document")

    expect(result.usedDefaults).toBe(true)
  })
})

describe("hasUnpublishedChanges", () => {
  it("reports changes when nothing has been published", () => {
    expect(hasUnpublishedChanges("2026-09-20T10:00:00Z", null)).toBe(true)
  })

  it("reports changes when the draft is newer than the publish", () => {
    expect(
      hasUnpublishedChanges("2026-09-20T12:00:00Z", "2026-09-20T10:00:00Z")
    ).toBe(true)
  })

  it("reports no changes when the publish is newer than the draft", () => {
    expect(
      hasUnpublishedChanges("2026-09-20T10:00:00Z", "2026-09-20T12:00:00Z")
    ).toBe(false)
  })
})

describe("readPreviewWidthValue", () => {
  it("returns the configured width for each option", () => {
    expect(readPreviewWidthValue("desktop")).toBe("100%")
    expect(readPreviewWidthValue("tablet")).toBe("768px")
    expect(readPreviewWidthValue("mobile")).toBe("390px")
  })
})

describe("padDisciplineSlots", () => {
  it("pads short lists to the maximum with empty strings", () => {
    const slots = padDisciplineSlots(["One"])

    expect(slots).toHaveLength(HERO_MAX_DISCIPLINES)
    expect(slots[0]).toBe("One")
    expect(slots[1]).toBe("")
  })

  it("truncates lists longer than the maximum", () => {
    const slots = padDisciplineSlots(["a", "b", "c", "d", "e", "f"])

    expect(slots).toHaveLength(HERO_MAX_DISCIPLINES)
  })
})

describe("buildEditorFormValues", () => {
  it("produces discipline slots the schema accepts", () => {
    const values = buildEditorFormValues(createDefaultSiteContent())

    expect(values.hero.disciplines).toHaveLength(HERO_MAX_DISCIPLINES)

    const parsed = parseSiteContent(values)

    expect(parsed.usedDefaults).toBe(false)
    expect(parsed.content.hero.disciplines).toEqual(DEFAULT_HERO_DISCIPLINES)
  })
})

describe("isPreviewReadyMessage", () => {
  const origin = "http://localhost:3000"

  it("accepts a ready message from the expected origin", () => {
    expect(isPreviewReadyMessage(origin, origin, { type: "ready" })).toBe(true)
  })

  it("rejects a ready message from another origin", () => {
    expect(
      isPreviewReadyMessage("https://evil.test", origin, { type: "ready" })
    ).toBe(false)
  })

  it("rejects other message types", () => {
    expect(isPreviewReadyMessage(origin, origin, { type: "content" })).toBe(
      false
    )
    expect(isPreviewReadyMessage(origin, origin, null)).toBe(false)
  })
})
