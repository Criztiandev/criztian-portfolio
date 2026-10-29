import type { CmsColorChannels } from "@/type/cms.type"
import type { Theme } from "@/type/theme.type"

import { THEME_DEFAULTS } from "../data/theme.data.ts"

import { cmsColorChannels, cmsContrast } from "./cms.util.ts"

const readableContrast = 4.5
const softTextShares = [0.6, 0.7, 0.8, 0.9, 1]
const redTextShares = [0, 0.2, 0.4, 0.6, 0.8, 1]
const lineTextShare = 0.1
const black: CmsColorChannels = [0, 0, 0]
const white: CmsColorChannels = [255, 255, 255]
const reds: CmsColorChannels[] = [
  [231, 0, 11],
  [255, 100, 103],
]

function channelsOf(color: string, fallback: string): CmsColorChannels {
  let channels = cmsColorChannels(color)
  if (channels === null) {
    channels = cmsColorChannels(fallback)
  }
  if (channels === null) {
    return black
  }
  return channels
}

function mix(
  top: CmsColorChannels,
  base: CmsColorChannels,
  share: number
): CmsColorChannels {
  return [
    Math.round(top[0] * share + base[0] * (1 - share)),
    Math.round(top[1] * share + base[1] * (1 - share)),
    Math.round(top[2] * share + base[2] * (1 - share)),
  ]
}

function toHex(color: CmsColorChannels): string {
  const parts = color.map((channel) => channel.toString(16).padStart(2, "0"))
  return `#${parts.join("")}`
}

function isReadable(
  color: CmsColorChannels,
  surfaces: CmsColorChannels[]
): boolean {
  for (const surface of surfaces) {
    if (cmsContrast(color, surface) < readableContrast) {
      return false
    }
  }
  return true
}

function firstReadable(
  candidates: CmsColorChannels[],
  surfaces: CmsColorChannels[]
): CmsColorChannels {
  for (const candidate of candidates) {
    if (isReadable(candidate, surfaces)) {
      return candidate
    }
  }
  return candidates[candidates.length - 1]
}

function textOn(fill: CmsColorChannels): CmsColorChannels {
  if (cmsContrast(white, fill) >= cmsContrast(black, fill)) {
    return white
  }
  return black
}

export function themeCss(theme: Theme): string {
  const background = channelsOf(theme.background, THEME_DEFAULTS.background)
  const text = channelsOf(theme.text, THEME_DEFAULTS.text)
  const primary = channelsOf(theme.primary, THEME_DEFAULTS.primary)
  const accent = channelsOf(theme.accent, THEME_DEFAULTS.accent)
  const muted = channelsOf(theme.muted, THEME_DEFAULTS.muted)
  const softText = firstReadable(
    softTextShares.map((share) => mix(text, background, share)),
    [background, muted]
  )
  const redCandidates: CmsColorChannels[] = []
  for (const share of redTextShares) {
    for (const red of reds) {
      redCandidates.push(mix(text, red, share))
    }
  }
  const line = mix(text, background, lineTextShare)
  const tokens: [string, CmsColorChannels][] = [
    ["background", background],
    ["card", background],
    ["popover", background],
    ["foreground", text],
    ["card-foreground", text],
    ["popover-foreground", text],
    ["secondary-foreground", text],
    ["primary", primary],
    ["primary-foreground", textOn(primary)],
    ["accent", accent],
    ["accent-foreground", textOn(accent)],
    ["secondary", muted],
    ["muted", muted],
    ["muted-foreground", softText],
    ["ring", softText],
    ["border", line],
    ["input", line],
    ["destructive", firstReadable(redCandidates, [background])],
  ]
  const declarations = tokens.map(
    ([name, color]) => `--${name}:${toHex(color)}`
  )
  declarations.push(
    `--font-sans:var(--font-${theme.bodyFont})`,
    `--font-display:var(--font-${theme.headingFont})`
  )
  return `:root:root{${declarations.join(";")}}`
}
