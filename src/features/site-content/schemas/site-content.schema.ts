import { z } from "zod"

import {
  CONNECT_EMAIL_MAX_LENGTH,
  CONNECT_EMAIL_PROMPT_MAX_LENGTH,
  CONNECT_STATEMENT_MAX_LENGTH,
  CONTACT_LABEL_MAX_LENGTH,
  CONTACT_STATEMENT_MAX_LENGTH,
  DEFAULT_CONNECT_EMAIL,
  DEFAULT_CONNECT_EMAIL_PROMPT,
  DEFAULT_CONNECT_STATEMENT,
  DEFAULT_CONTACT_LABEL,
  DEFAULT_CONTACT_STATEMENT,
  DEFAULT_FAQ_ITEMS,
  DEFAULT_HERO_NAME,
  DEFAULT_HERO_TAGLINE,
  DEFAULT_PROJECT_ITEMS,
  DEFAULT_PROJECTS_HEADING,
  DEFAULT_PROJECTS_LEDE,
  DEFAULT_QUOTE_AUTHOR,
  DEFAULT_QUOTE_TEXT,
  DEFAULT_THEME_ACCENT,
  DEFAULT_THEME_BODY_TEXT,
  DEFAULT_THEME_BORDER,
  DEFAULT_THEME_HERO_DOT,
  DEFAULT_THEME_MUTED_TEXT,
  DEFAULT_THEME_PAGE_BACKGROUND,
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_MAX,
  FAQ_QUESTION_MAX_LENGTH,
  HERO_NAME_MAX_LENGTH,
  HEX_COLOR_PATTERN,
  PROJECT_IMAGE_ALT_MAX_LENGTH,
  PROJECT_IMAGE_MAX_LENGTH,
  PROJECT_LINK_MAX_LENGTH,
  PROJECT_STACK_MAX_LENGTH,
  PROJECT_SUMMARY_MAX_LENGTH,
  PROJECT_TAG_MAX_LENGTH,
  PROJECT_TITLE_MAX_LENGTH,
  PROJECTS_HEADING_MAX_LENGTH,
  PROJECTS_LEDE_MAX_LENGTH,
  PROJECTS_MAX,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_TEXT_MAX_LENGTH,
  RICH_TEXT_MARK_TYPES,
  RICH_TEXT_NODE_TYPES,
} from "@/data/site-content.data"

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function normalizeHexColor(value: string): string {
  return value.trim().toLowerCase()
}

const richTextMarkSchema = z.object({
  type: z.enum(RICH_TEXT_MARK_TYPES),
})

const richTextNodeSchema = z.object({
  type: z.enum(RICH_TEXT_NODE_TYPES),
  text: z.string().optional(),
  marks: z.array(richTextMarkSchema).optional(),
  get content() {
    return z.array(richTextNodeSchema).optional()
  },
})

const richTextDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(richTextNodeSchema).optional(),
})

const hexColorSchema = z
  .string()
  .transform(normalizeHexColor)
  .pipe(z.string().regex(HEX_COLOR_PATTERN, "Enter a colour like #1a1a1a"))

export const heroContentSchema = z.object({
  name: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, "Enter a name")
        .max(
          HERO_NAME_MAX_LENGTH,
          `Must be ${HERO_NAME_MAX_LENGTH} characters or fewer`
        )
    )
    .default(DEFAULT_HERO_NAME),
  tagline: richTextDocumentSchema.default(DEFAULT_HERO_TAGLINE),
})

export const quoteContentSchema = z.object({
  text: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, "Enter a quote")
        .max(
          QUOTE_TEXT_MAX_LENGTH,
          `Must be ${QUOTE_TEXT_MAX_LENGTH} characters or fewer`
        )
    )
    .default(DEFAULT_QUOTE_TEXT),
  author: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .max(
          QUOTE_AUTHOR_MAX_LENGTH,
          `Must be ${QUOTE_AUTHOR_MAX_LENGTH} characters or fewer`
        )
    )
    .default(DEFAULT_QUOTE_AUTHOR),
})

function boundedTextSchema(maxLength: number) {
  return z
    .string()
    .transform(collapseWhitespace)
    .pipe(z.string().max(maxLength, `Must be ${maxLength} characters or fewer`))
}

function requiredTextSchema(maxLength: number, emptyMessage: string) {
  return z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, emptyMessage)
        .max(maxLength, `Must be ${maxLength} characters or fewer`)
    )
}

export const projectItemSchema = z.object({
  title: boundedTextSchema(PROJECT_TITLE_MAX_LENGTH).default(""),
  tag: boundedTextSchema(PROJECT_TAG_MAX_LENGTH).default(""),
  summary: boundedTextSchema(PROJECT_SUMMARY_MAX_LENGTH).default(""),
  stack: boundedTextSchema(PROJECT_STACK_MAX_LENGTH).default(""),
  link: boundedTextSchema(PROJECT_LINK_MAX_LENGTH).default(""),
  image: boundedTextSchema(PROJECT_IMAGE_MAX_LENGTH).default(""),
  imageAlt: boundedTextSchema(PROJECT_IMAGE_ALT_MAX_LENGTH).default(""),
})

export const projectsContentSchema = z.object({
  heading: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, "Enter a heading")
        .max(
          PROJECTS_HEADING_MAX_LENGTH,
          `Must be ${PROJECTS_HEADING_MAX_LENGTH} characters or fewer`
        )
    )
    .default(DEFAULT_PROJECTS_HEADING),
  lede: boundedTextSchema(PROJECTS_LEDE_MAX_LENGTH).default(
    DEFAULT_PROJECTS_LEDE
  ),
  items: z
    .array(projectItemSchema)
    .max(PROJECTS_MAX, `Add ${PROJECTS_MAX} projects or fewer`)
    .default(DEFAULT_PROJECT_ITEMS),
})

export const faqItemSchema = z.object({
  question: boundedTextSchema(FAQ_QUESTION_MAX_LENGTH).default(""),
  answer: boundedTextSchema(FAQ_ANSWER_MAX_LENGTH).default(""),
})

export const faqContentSchema = z.object({
  items: z
    .array(faqItemSchema)
    .max(FAQ_MAX, `Add ${FAQ_MAX} questions or fewer`)
    .default(DEFAULT_FAQ_ITEMS),
})

export const connectContentSchema = z.object({
  statement: requiredTextSchema(
    CONNECT_STATEMENT_MAX_LENGTH,
    "Enter a statement"
  ).default(DEFAULT_CONNECT_STATEMENT),
  emailPrompt: boundedTextSchema(CONNECT_EMAIL_PROMPT_MAX_LENGTH).default(
    DEFAULT_CONNECT_EMAIL_PROMPT
  ),
  email: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .email("Enter an email address")
        .max(
          CONNECT_EMAIL_MAX_LENGTH,
          `Must be ${CONNECT_EMAIL_MAX_LENGTH} characters or fewer`
        )
    )
    .default(DEFAULT_CONNECT_EMAIL),
})

export const contactContentSchema = z.object({
  label: requiredTextSchema(CONTACT_LABEL_MAX_LENGTH, "Enter a label").default(
    DEFAULT_CONTACT_LABEL
  ),
  statement: requiredTextSchema(
    CONTACT_STATEMENT_MAX_LENGTH,
    "Enter a statement"
  ).default(DEFAULT_CONTACT_STATEMENT),
})

export const themeContentSchema = z.object({
  pageBackground: hexColorSchema.default(DEFAULT_THEME_PAGE_BACKGROUND),
  bodyText: hexColorSchema.default(DEFAULT_THEME_BODY_TEXT),
  mutedText: hexColorSchema.default(DEFAULT_THEME_MUTED_TEXT),
  accent: hexColorSchema.default(DEFAULT_THEME_ACCENT),
  border: hexColorSchema.default(DEFAULT_THEME_BORDER),
  heroDot: hexColorSchema.default(DEFAULT_THEME_HERO_DOT),
})

export const siteContentSchema = z.object({
  hero: heroContentSchema.prefault({}),
  quote: quoteContentSchema.prefault({}),
  projects: projectsContentSchema.prefault({}),
  faq: faqContentSchema.prefault({}),
  connect: connectContentSchema.prefault({}),
  contact: contactContentSchema.prefault({}),
  theme: themeContentSchema.prefault({}),
})
