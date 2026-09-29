import type { PortfolioSection, PortfolioUiState } from "@/types/portfolio.type"

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSection = "home"

export const INITIAL_PORTFOLIO_UI_STATE: PortfolioUiState = {
  isMobileNavOpen: false,
  activeSection: DEFAULT_PORTFOLIO_SECTION,
}

export const PROJECTS_HEADING_ID = "project-heading"

export const PROJECTS_LABEL = "Work"

export const PROJECT_IMAGE_PATH_PATTERN =
  /^\/projects\/[a-z0-9-]+\.(avif|webp|png|jpe?g)$/

export const PROJECT_LINK_PROTOCOL = "https:"

export const PROJECT_IMAGE_SIZES = "(min-width: 48rem) 50vw, 100vw"

export const PLATE_IMAGE_SIZES = "(min-width: 48rem) 36vw, 100vw"

export const PROJECT_PLACEHOLDER_IMAGE = "/projects/placeholder.webp"

export const PROJECT_IMAGE_PLACEHOLDER_LABEL = "Image placeholder"

export const PROJECT_NEW_TAB_LABEL = "(opens in a new tab)"

export const FOOTER_BACK_TO_TOP_LABEL = "Back to top"

export const FOOTER_NAVIGATION_LABEL = "Footer"

export const FOOTER_LINK_CLASS =
  "inline-flex min-h-11 scroll-mt-18 items-center gap-2 px-2 transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:outline-hidden focus-visible:ring-foreground/50 lg:min-h-0 lg:py-2"

export const FOOTER_YEAR = new Date().getFullYear()

export const PUBLIC_TOKEN_OVERRIDES: Record<string, string> = {
  "--destructive": "var(--foreground)",
  "--input": "var(--border)",
  "--ring": "var(--foreground)",
  "--rule": "color-mix(in srgb, var(--foreground) 12%, transparent)",
}
