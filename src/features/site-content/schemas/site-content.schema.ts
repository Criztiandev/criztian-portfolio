import { z } from "zod"

import {
  DEFAULT_HERO_NAME,
  DEFAULT_HERO_TAGLINE,
  DEFAULT_QUOTE_AUTHOR,
  DEFAULT_QUOTE_TEXT,
  DEFAULT_THEME_ACCENT,
  DEFAULT_THEME_BODY_TEXT,
  DEFAULT_THEME_BORDER,
  DEFAULT_THEME_HERO_DOT,
  DEFAULT_THEME_MUTED_TEXT,
  DEFAULT_THEME_PAGE_BACKGROUND,
  HERO_NAME_MAX_LENGTH,
  HEX_COLOR_PATTERN,
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
  theme: themeContentSchema.prefault({}),
})
