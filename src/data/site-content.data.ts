import type {
  EditorPreviewWidthOption,
  EditorSaveState,
  EditorUiState,
  HeroTextField,
  ProjectItem,
  ProjectItemField,
  RichTextDocument,
  SiteContentEntry,
  ThemeColorField,
} from "@/types/site-content.type"

export const HERO_NAME_MAX_LENGTH = 40

export const QUOTE_TEXT_MAX_LENGTH = 140

export const QUOTE_AUTHOR_MAX_LENGTH = 80

export const DEFAULT_QUOTE_TEXT = "Your quote about life goes here."

export const DEFAULT_QUOTE_AUTHOR = ""

export const PROJECTS_MAX = 6

export const PROJECTS_HEADING_MAX_LENGTH = 40

export const PROJECTS_LEDE_MAX_LENGTH = 160

export const PROJECT_TITLE_MAX_LENGTH = 60

export const PROJECT_TAG_MAX_LENGTH = 24

export const PROJECT_SUMMARY_MAX_LENGTH = 160

export const PROJECT_STACK_MAX_LENGTH = 80

export const PROJECT_LINK_MAX_LENGTH = 200

export const PROJECT_IMAGE_MAX_LENGTH = 200

export const PROJECT_IMAGE_ALT_MAX_LENGTH = 120

export const DEFAULT_PROJECTS_HEADING = "Projects"

export const DEFAULT_PROJECTS_LEDE = "A short intro to your projects goes here."

export const DEFAULT_PROJECT_TAG = "Tag"

export const DEFAULT_PROJECT_SUMMARY = "What you built and for whom goes here."

export const DEFAULT_PROJECT_ITEMS: ProjectItem[] = [
  {
    title: "Project one",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: "",
    link: "",
    image: "",
    imageAlt: "",
  },
  {
    title: "Project two",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: "",
    link: "",
    image: "",
    imageAlt: "",
  },
  {
    title: "Project three",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: "",
    link: "",
    image: "",
    imageAlt: "",
  },
]

export const NEW_PROJECT_ITEM: ProjectItem = {
  title: "New project",
  tag: "",
  summary: "",
  stack: "",
  link: "",
  image: "",
  imageAlt: "",
}

export const PROJECT_ITEM_FIELDS: ProjectItemField[] = [
  {
    key: "title",
    label: "title",
    maxLength: PROJECT_TITLE_MAX_LENGTH,
    multiline: false,
  },
  {
    key: "tag",
    label: "tag",
    maxLength: PROJECT_TAG_MAX_LENGTH,
    multiline: false,
  },
  {
    key: "summary",
    label: "summary",
    maxLength: PROJECT_SUMMARY_MAX_LENGTH,
    multiline: true,
  },
  {
    key: "stack",
    label: "stack",
    maxLength: PROJECT_STACK_MAX_LENGTH,
    multiline: false,
  },
  {
    key: "link",
    label: "link",
    maxLength: PROJECT_LINK_MAX_LENGTH,
    multiline: false,
  },
  {
    key: "image",
    label: "image",
    maxLength: PROJECT_IMAGE_MAX_LENGTH,
    multiline: false,
  },
  {
    key: "imageAlt",
    label: "alt text",
    maxLength: PROJECT_IMAGE_ALT_MAX_LENGTH,
    multiline: false,
  },
]

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

export const DEFAULT_THEME_PAGE_BACKGROUND = "#000000"

export const DEFAULT_THEME_BODY_TEXT = "#ffffff"

export const DEFAULT_THEME_MUTED_TEXT = "#999999"

export const DEFAULT_THEME_ACCENT = "#ffffff"

export const DEFAULT_THEME_BORDER = "#666666"

export const DEFAULT_THEME_HERO_DOT = "#ffffff"

export const SITE_CONTENT_ENTRIES: SiteContentEntry[] = [
  {
    id: "hero",
    label: "Hero",
    sectionId: "home",
  },
  {
    id: "quote",
    label: "Quote",
    sectionId: "quote",
  },
  {
    id: "projects",
    label: "Projects",
    sectionId: "project",
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

export const PREVIEW_READY_MESSAGE = "ready"

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
