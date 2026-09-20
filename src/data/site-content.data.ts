import type {
  EditorPreviewWidthOption,
  EditorSaveState,
  EditorUiState,
  HeroTextField,
  RichTextDocument,
  SiteContentEntry,
  ThemeColorField,
} from "@/types/site-content.type"

export const HERO_NAME_MAX_LENGTH = 40

export const HERO_LABEL_MAX_LENGTH = 60

export const HERO_DISCIPLINE_MAX_LENGTH = 60

export const HERO_MAX_DISCIPLINES = 4

export const RICH_TEXT_NODE_TYPES = [
  "doc",
  "paragraph",
  "text",
  "hardBreak",
] as const

export const RICH_TEXT_MARK_TYPES = ["bold", "italic"] as const

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

export const SITE_CONTENT_READ_FAILED_MESSAGE =
  "Could not load your draft. Please reload the page."

export const SITE_CONTENT_PUBLIC_PATH = "/"

export const EDITOR_PATH = "/dashboard/editor"

export const EDITOR_PREVIEW_PATH = "/dashboard/editor/preview"

export const PREVIEW_CONTENT_MESSAGE = "content"

export const PREVIEW_SCROLL_MESSAGE = "scroll"

export const PREVIEW_CONTENT_DEBOUNCE_MS = 80

export const DRAFT_SAVE_DEBOUNCE_MS = 800

export const FULL_PREVIEW_WIDTH = "100%"

export const PREVIEW_WIDTHS: EditorPreviewWidthOption[] = [
  { id: "desktop", label: "Desktop", width: FULL_PREVIEW_WIDTH },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "390px" },
]

export const INITIAL_EDITOR_UI_STATE: EditorUiState = {
  selectedEntry: "hero",
  previewWidth: "desktop",
  saveState: "idle",
}

export const HERO_TEXT_FIELDS: HeroTextField[] = [
  { key: "name", label: "Name" },
  { key: "scrollLabel", label: "Scroll label" },
  { key: "worksLabel", label: "Selected works label" },
]

export const THEME_COLOR_FIELDS: ThemeColorField[] = [
  { key: "pageBackground", label: "Page background" },
  { key: "bodyText", label: "Body text" },
  { key: "mutedText", label: "Muted text" },
  { key: "accent", label: "Accent" },
  { key: "border", label: "Border" },
  { key: "heroDot", label: "Hero dots" },
]

export const SITE_CONTENT_PUBLISH_CONFIRMATION =
  "Publish these changes to the live site?"

export const SAVE_STATE_LABELS: Record<EditorSaveState, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Not saved",
}
