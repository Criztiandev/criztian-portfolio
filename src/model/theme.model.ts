import * as z from "zod"

import { FONT_OPTIONS } from "../data/font.data.ts"
import { THEME_DEFAULTS } from "../data/theme.data.ts"

import { cmsColorSchema } from "./cms.model.ts"

const fontSchema = z.enum(FONT_OPTIONS.map((font) => font.value))

export const themeSchema = z.object({
  background: cmsColorSchema.catch(THEME_DEFAULTS.background),
  text: cmsColorSchema.catch(THEME_DEFAULTS.text),
  primary: cmsColorSchema.catch(THEME_DEFAULTS.primary),
  accent: cmsColorSchema.catch(THEME_DEFAULTS.accent),
  muted: cmsColorSchema.catch(THEME_DEFAULTS.muted),
  headingFont: fontSchema.catch(THEME_DEFAULTS.headingFont),
  bodyFont: fontSchema.catch(THEME_DEFAULTS.bodyFont),
})
