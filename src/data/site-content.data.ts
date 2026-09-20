import type {
  RichTextDocument,
  SiteContentEntry,
} from "@/types/site-content.type"

export const HERO_NAME_MAX_LENGTH = 40

export const HERO_LABEL_MAX_LENGTH = 60

export const HERO_DISCIPLINE_MAX_LENGTH = 60

export const HERO_MAX_DISCIPLINES = 4

export const RICH_TEXT_MAX_DEPTH = 6

export const RICH_TEXT_MAX_LENGTH = 2000

export const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

export const DEFAULT_HERO_NAME = "Criztian"

export const DEFAULT_HERO_SCROLL_LABEL = "Scroll"

export const DEFAULT_HERO_WORKS_LABEL = "06 Selected Works"

export const DEFAULT_HERO_DISCIPLINES = ["Creative Direction", "Digital Design"]

export const DEFAULT_HERO_TAGLINE_TEXT =
  "Crafting timeless digital experiences through design, strategy, and code."

export const DEFAULT_HERO_TAGLINE: RichTextDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: DEFAULT_HERO_TAGLINE_TEXT,
        },
      ],
    },
  ],
}

export const DEFAULT_THEME_PAGE_BACKGROUND = "#ffffff"

export const DEFAULT_THEME_BODY_TEXT = "#252525"

export const DEFAULT_THEME_MUTED_TEXT = "#8e8e8e"

export const DEFAULT_THEME_ACCENT = "#343434"

export const DEFAULT_THEME_BORDER = "#ebebeb"

export const DEFAULT_THEME_HERO_DOT = "#ffffff"

export const SITE_CONTENT_ENTRIES: SiteContentEntry[] = [
  {
    id: "hero",
    label: "Hero",
    sectionId: "home",
  },
  {
    id: "theme",
    label: "Theme",
    sectionId: null,
  },
]

export const SITE_CONTENT_SAVE_FAILED_MESSAGE =
  "Could not save your changes. Please try again."

export const SITE_CONTENT_PUBLISH_FAILED_MESSAGE =
  "Could not publish. Please try again."
