import { describe, expect, it } from "vitest"

import {
  DEFAULT_HERO_NAME,
  DEFAULT_HERO_TAGLINE_TEXT,
  DEFAULT_PROJECT_ITEMS,
  DEFAULT_PROJECTS_HEADING,
  DEFAULT_PROJECTS_LEDE,
  DEFAULT_QUOTE_AUTHOR,
  DEFAULT_QUOTE_TEXT,
  DEFAULT_THEME_HERO_DOT,
  DEFAULT_THEME_PAGE_BACKGROUND,
  NEW_PROJECT_ITEM,
  PROJECT_TITLE_MAX_LENGTH,
  PROJECTS_HEADING_MAX_LENGTH,
  PROJECTS_MAX,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_TEXT_MAX_LENGTH,
} from "@/data/site-content.data"
import {
  createDefaultSiteContent,
  hasUnpublishedChanges,
  isPreviewReadyMessage,
  parseSiteContent,
  readPreviewWidthValue,
} from "@/features/site-content/site-content.rules"
import type { ProjectItem } from "@/types/site-content.type"

describe("createDefaultSiteContent", () => {
  it("fills every hero field from an empty document", () => {
    const content = createDefaultSiteContent()

    expect(content.hero.name).toBe(DEFAULT_HERO_NAME)
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

  it("seeds the dark signal board theme", () => {
    const content = createDefaultSiteContent()

    expect(content.theme).toEqual({
      pageBackground: "#000000",
      bodyText: "#ffffff",
      mutedText: "#999999",
      accent: "#ffffff",
      border: "#666666",
      heroDot: "#ffffff",
    })
  })
})

describe("parseSiteContent", () => {
  it("fills missing fields around a partial document", () => {
    const result = parseSiteContent({ hero: { name: "Ada" } })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.hero.name).toBe("Ada")
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

describe("quote content", () => {
  it("seeds the placeholder quote with no author", () => {
    const content = createDefaultSiteContent()

    expect(content.quote.text).toBe(DEFAULT_QUOTE_TEXT)
    expect(content.quote.author).toBe(DEFAULT_QUOTE_AUTHOR)
  })

  it("fills the quote for a document saved before the quote existed", () => {
    const result = parseSiteContent({ hero: { name: "Ada" }, theme: {} })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.quote.text).toBe(DEFAULT_QUOTE_TEXT)
  })

  it("collapses whitespace in the quote and the author", () => {
    const result = parseSiteContent({
      quote: { text: "  Keep   going  ", author: " Ada   Lovelace " },
    })

    expect(result.content.quote.text).toBe("Keep going")
    expect(result.content.quote.author).toBe("Ada Lovelace")
  })

  it("rejects a blank quote", () => {
    const result = parseSiteContent({ quote: { text: "   " } })

    expect(result.usedDefaults).toBe(true)
  })

  it("resets the whole document when the quote is over the limit", () => {
    const result = parseSiteContent({
      hero: { name: "Ada" },
      quote: { text: "a".repeat(QUOTE_TEXT_MAX_LENGTH + 1) },
    })

    expect(result.usedDefaults).toBe(true)
    expect(result.content.hero.name).toBe(DEFAULT_HERO_NAME)
  })

  it("rejects an author over the limit", () => {
    const result = parseSiteContent({
      quote: { author: "a".repeat(QUOTE_AUTHOR_MAX_LENGTH + 1) },
    })

    expect(result.usedDefaults).toBe(true)
  })
})

describe("projects content", () => {
  it("seeds the placeholder heading, intro and three projects", () => {
    const content = createDefaultSiteContent()

    expect(content.projects.heading).toBe(DEFAULT_PROJECTS_HEADING)
    expect(content.projects.lede).toBe(DEFAULT_PROJECTS_LEDE)
    expect(content.projects.items).toEqual(DEFAULT_PROJECT_ITEMS)
    expect(content.projects.items).toHaveLength(3)
  })

  it("fills the projects for a document saved before projects existed", () => {
    const result = parseSiteContent({
      hero: { name: "Ada" },
      quote: { text: "Keep going." },
      theme: {},
    })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.hero.name).toBe("Ada")
    expect(result.content.projects.items).toEqual(DEFAULT_PROJECT_ITEMS)
  })

  it("fills every missing item field with a blank", () => {
    const result = parseSiteContent({
      projects: { items: [{ title: "Shop" }] },
    })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.projects.items).toEqual([
      {
        title: "Shop",
        tag: "",
        summary: "",
        stack: "",
        link: "",
        image: "",
        imageAlt: "",
      },
    ])
  })

  it("allows blank fields and an empty list", () => {
    const blankItem = parseSiteContent({
      projects: { heading: "", lede: "", items: [NEW_PROJECT_ITEM, {}] },
    })
    const emptyList = parseSiteContent({ projects: { items: [] } })

    expect(blankItem.usedDefaults).toBe(false)
    expect(blankItem.content.projects.items[1].title).toBe("")
    expect(emptyList.usedDefaults).toBe(false)
    expect(emptyList.content.projects.items).toEqual([])
  })

  it("keeps links and images as plain text for the renderer to check", () => {
    const result = parseSiteContent({
      projects: {
        items: [{ title: "Shop", link: "javascript:alert(1)", image: "x" }],
      },
    })

    expect(result.usedDefaults).toBe(false)
    expect(result.content.projects.items[0].link).toBe("javascript:alert(1)")
  })

  it("collapses whitespace in project fields", () => {
    const result = parseSiteContent({
      projects: { items: [{ title: "  Online   shop  " }] },
    })

    expect(result.content.projects.items[0].title).toBe("Online shop")
  })

  it("rejects a project field over the limit", () => {
    const result = parseSiteContent({
      projects: {
        items: [{ title: "a".repeat(PROJECT_TITLE_MAX_LENGTH + 1) }],
      },
    })

    expect(result.usedDefaults).toBe(true)
  })

  it("rejects a heading over the limit", () => {
    const result = parseSiteContent({
      projects: { heading: "a".repeat(PROJECTS_HEADING_MAX_LENGTH + 1) },
    })

    expect(result.usedDefaults).toBe(true)
  })

  it("rejects more projects than the maximum", () => {
    const items: ProjectItem[] = []

    for (let position = 0; position <= PROJECTS_MAX; position += 1) {
      items.push(NEW_PROJECT_ITEM)
    }

    const result = parseSiteContent({ projects: { items } })

    expect(items).toHaveLength(7)
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
