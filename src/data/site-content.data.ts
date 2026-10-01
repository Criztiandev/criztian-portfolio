import type {
  ConnectTextField,
  ContactTextField,
  EditorPreviewWidthOption,
  EditorSaveState,
  EditorUiState,
  FaqItem,
  FaqItemField,
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

export const DEFAULT_QUOTE_TEXT = "[Your belief line, in your own words]"

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

export const DEFAULT_PROJECTS_HEADING = "Featured projects"

export const DEFAULT_PROJECTS_LEDE = "Showcasing my most impactful work."

export const DEFAULT_PROJECT_TAG = "[Tag]"

export const DEFAULT_PROJECT_SUMMARY = "[What you built, and for whom]"

export const DEFAULT_PROJECT_STACK = "[Stack]"

export const DEFAULT_PROJECT_ITEMS: ProjectItem[] = [
  {
    title: "Project one",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: DEFAULT_PROJECT_STACK,
    link: "",
    image: "",
    imageAlt: "",
  },
  {
    title: "Project two",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: DEFAULT_PROJECT_STACK,
    link: "",
    image: "",
    imageAlt: "",
  },
  {
    title: "Project three",
    tag: DEFAULT_PROJECT_TAG,
    summary: DEFAULT_PROJECT_SUMMARY,
    stack: DEFAULT_PROJECT_STACK,
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

export const PROJECT_LINK_HINT =
  "A full https:// link. Anything else is left off the card."

export const PROJECT_IMAGE_HINT =
  "A file in public/projects, like /projects/shop.webp, or an https:// image link. Anything else shows the placeholder."

export const PROJECT_ITEM_FIELDS: ProjectItemField[] = [
  {
    key: "title",
    label: "title",
    maxLength: PROJECT_TITLE_MAX_LENGTH,
    multiline: false,
    hint: null,
  },
  {
    key: "tag",
    label: "tag",
    maxLength: PROJECT_TAG_MAX_LENGTH,
    multiline: false,
    hint: null,
  },
  {
    key: "summary",
    label: "summary",
    maxLength: PROJECT_SUMMARY_MAX_LENGTH,
    multiline: true,
    hint: null,
  },
  {
    key: "stack",
    label: "stack",
    maxLength: PROJECT_STACK_MAX_LENGTH,
    multiline: false,
    hint: null,
  },
  {
    key: "link",
    label: "link",
    maxLength: PROJECT_LINK_MAX_LENGTH,
    multiline: false,
    hint: PROJECT_LINK_HINT,
  },
  {
    key: "image",
    label: "image",
    maxLength: PROJECT_IMAGE_MAX_LENGTH,
    multiline: false,
    hint: PROJECT_IMAGE_HINT,
  },
  {
    key: "imageAlt",
    label: "alt text",
    maxLength: PROJECT_IMAGE_ALT_MAX_LENGTH,
    multiline: false,
    hint: null,
  },
]

export const FAQ_MAX = 12

export const FAQ_QUESTION_MAX_LENGTH = 120

export const FAQ_ANSWER_MAX_LENGTH = 400

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is included in your branding services?",
    answer:
      "My branding services include logo design, visual identity development, color palette selection, typography guidance and brand messaging to create a cohesive and impactful identity for your business.",
  },
  {
    question: "How long does it take to complete a branding project?",
    answer:
      "The timeline varies depending on the scope, but a typical branding project takes 4–6 weeks from initial consultation to final delivery.",
  },
  {
    question: "Do you offer mobile-friendly designs?",
    answer:
      "Yes. All my web designs are fully responsive and optimized for desktops, tablets and mobile devices to ensure a seamless user experience.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Absolutely. I can revamp your current website to improve its functionality, aesthetics and performance while retaining key elements of your brand.",
  },
  {
    question: "Do you provide custom development solutions?",
    answer:
      "Yes. I specialize in creating custom web solutions tailored to your specific business needs, including e-commerce platforms, CMS integrations and more.",
  },
  {
    question: "Will I be able to update the website on my own?",
    answer:
      "Yes. I build websites on user-friendly platforms like Webflow or WordPress, so you can manage and update your site without technical expertise.",
  },
  {
    question: "How do you approach digital marketing campaigns?",
    answer:
      "I start with a deep understanding of your audience and goals, then craft data-driven strategies that include SEO, social media marketing and email campaigns.",
  },
  {
    question: "What are the payment methods and plans for a project?",
    answer:
      "I accept multiple payment methods, mostly PayPal, and can set up flexible payment plans based on the project's scale.",
  },
  {
    question: "Do you offer discounts for long-term collaboration?",
    answer:
      "Yes. I offer preferential pricing for clients in long-term collaborations. Contact me for details.",
  },
]

export const NEW_FAQ_ITEM: FaqItem = {
  question: "New question",
  answer: "",
}

export const FAQ_QUESTION_HINT =
  "Leave it blank to hide this question on the page."

export const FAQ_ITEM_FIELDS: FaqItemField[] = [
  {
    key: "question",
    label: "Question",
    maxLength: FAQ_QUESTION_MAX_LENGTH,
    multiline: false,
    hint: FAQ_QUESTION_HINT,
  },
  {
    key: "answer",
    label: "Answer",
    maxLength: FAQ_ANSWER_MAX_LENGTH,
    multiline: true,
    hint: null,
  },
]

export const CONNECT_STATEMENT_MAX_LENGTH = 60

export const CONNECT_EMAIL_PROMPT_MAX_LENGTH = 40

export const CONNECT_EMAIL_MAX_LENGTH = 120

export const DEFAULT_CONNECT_STATEMENT = "Let's connect."

export const DEFAULT_CONNECT_EMAIL_PROMPT = "Or email me:"

export const DEFAULT_CONNECT_EMAIL = "criztiandev@gmail.com"

export const CONTACT_LABEL_MAX_LENGTH = 16

export const CONTACT_STATEMENT_MAX_LENGTH = 60

export const DEFAULT_CONTACT_LABEL = "Get in touch"

export const DEFAULT_CONTACT_STATEMENT = "Let's start your project today."

export const CONNECT_TEXT_FIELDS: ConnectTextField[] = [
  {
    key: "statement",
    label: "Statement",
    maxLength: CONNECT_STATEMENT_MAX_LENGTH,
    inputType: "text",
  },
  {
    key: "emailPrompt",
    label: "Email line",
    maxLength: CONNECT_EMAIL_PROMPT_MAX_LENGTH,
    inputType: "text",
  },
  {
    key: "email",
    label: "Email address",
    maxLength: CONNECT_EMAIL_MAX_LENGTH,
    inputType: "email",
  },
]

export const CONTACT_TEXT_FIELDS: ContactTextField[] = [
  {
    key: "label",
    label: "Label",
    maxLength: CONTACT_LABEL_MAX_LENGTH,
    inputType: "text",
  },
  {
    key: "statement",
    label: "Statement",
    maxLength: CONTACT_STATEMENT_MAX_LENGTH,
    inputType: "text",
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
  "I build whole products. Brand, design and code."

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
    id: "faq",
    label: "FAQ",
    sectionId: "faq",
  },
  {
    id: "connect",
    label: "Let's connect",
    sectionId: "connect",
  },
  {
    id: "contact",
    label: "Get in touch",
    sectionId: "contact",
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
