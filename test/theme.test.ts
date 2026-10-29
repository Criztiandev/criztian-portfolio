import assert from "node:assert/strict"
import { test } from "node:test"

import { THEME_DEFAULTS } from "../src/data/theme.data.ts"
import { themeSchema } from "../src/model/theme.model.ts"
import type { CmsColorChannels } from "../src/type/cms.type.ts"
import { cmsColorChannels, cmsContrast } from "../src/util/cms.util.ts"
import { themeCss } from "../src/util/theme.util.ts"

const oneRule = /^:root:root\{([^{}]*)\}$/

function readTokens(css: string): Record<string, string> {
  const rule = oneRule.exec(css)
  assert.ok(rule !== null, css)
  const tokens: Record<string, string> = {}
  for (const declaration of rule[1].split(";")) {
    const [name, value] = declaration.split(":")
    tokens[name] = value
  }
  return tokens
}

function channels(
  tokens: Record<string, string>,
  name: string
): CmsColorChannels {
  const color = cmsColorChannels(tokens[name])
  assert.ok(color !== null, `${name} is ${tokens[name]}`)
  return color
}

test("prints the default palette as one rule", () => {
  assert.deepEqual(readTokens(themeCss(themeSchema.parse({}))), {
    "--background": "#ffffff",
    "--card": "#ffffff",
    "--popover": "#ffffff",
    "--foreground": "#0a0a0a",
    "--card-foreground": "#0a0a0a",
    "--popover-foreground": "#0a0a0a",
    "--secondary-foreground": "#0a0a0a",
    "--primary": "#171717",
    "--primary-foreground": "#ffffff",
    "--accent": "#171717",
    "--accent-foreground": "#ffffff",
    "--secondary": "#f5f5f5",
    "--muted": "#f5f5f5",
    "--muted-foreground": "#6c6c6c",
    "--ring": "#6c6c6c",
    "--border": "#e7e7e7",
    "--input": "#e7e7e7",
    "--destructive": "#e7000b",
    "--font-sans": "var(--font-inter)",
    "--font-display": "var(--font-anton)",
  })
})

test("keeps soft text, the error red and fill text readable", () => {
  const palettes = [
    { background: "#767676", text: "#ffffff", muted: "#767676" },
    { background: "#767676", text: "#000000", muted: "#808080" },
    { background: "#1d4ed8", text: "#ffffff", muted: "#1e40af" },
    { background: "#0a0a0a", text: "#fafafa", muted: "#262626" },
  ]
  for (const palette of palettes) {
    const tokens = readTokens(
      themeCss({
        ...THEME_DEFAULTS,
        ...palette,
        primary: "#757575",
        accent: "#ffff00",
      })
    )
    const pairs = [
      ["--muted-foreground", "--background"],
      ["--muted-foreground", "--muted"],
      ["--destructive", "--background"],
      ["--primary-foreground", "--primary"],
      ["--accent-foreground", "--accent"],
    ]
    for (const [text, surface] of pairs) {
      const ratio = cmsContrast(
        channels(tokens, text),
        channels(tokens, surface)
      )
      assert.ok(
        ratio >= 4.5,
        `${text} on ${surface} is ${ratio.toFixed(2)} for ${palette.background}`
      )
    }
  }
})

test("keeps a light red on a dark background", () => {
  const tokens = readTokens(
    themeCss({ ...THEME_DEFAULTS, background: "#0a0a0a", text: "#fafafa" })
  )
  assert.equal(tokens["--destructive"], "#ff6467")
  assert.equal(tokens["--primary-foreground"], "#ffffff")
})

test("never prints a stored value that is not a color", () => {
  const hostile = "red;}body{display:none"
  const defaults = themeCss(themeSchema.parse({}))
  const stored = themeSchema.parse({
    primary: hostile,
    text: true,
    muted: "#FFF",
    accent: "#1D4ED8",
  })
  assert.deepEqual(stored, { ...THEME_DEFAULTS, accent: "#1d4ed8" })
  assert.equal(themeCss({ ...THEME_DEFAULTS, primary: hostile }), defaults)
  assert.equal(themeCss({ ...THEME_DEFAULTS, primary: "#FFFFFF" }), defaults)
})

test("prints the two fonts by their variables", () => {
  const tokens = readTokens(
    themeCss(themeSchema.parse({ headingFont: "inter", bodyFont: "anton" }))
  )
  assert.equal(tokens["--font-display"], "var(--font-inter)")
  assert.equal(tokens["--font-sans"], "var(--font-anton)")
})

test("never prints a stored font that is not an option", () => {
  const defaults = themeCss(themeSchema.parse({}))
  const fonts = ["red;}body{display:none", "Lora", "constructor", "", true]
  for (const font of fonts) {
    const stored = themeSchema.parse({ headingFont: font, bodyFont: font })
    assert.deepEqual(stored, THEME_DEFAULTS, String(font))
    assert.equal(themeCss(stored), defaults, String(font))
  }
})
