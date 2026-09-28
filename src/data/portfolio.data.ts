import type { PortfolioSection, PortfolioUiState } from "@/types/portfolio.type"

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSection = "home"

export const INITIAL_PORTFOLIO_UI_STATE: PortfolioUiState = {
  isMobileNavOpen: false,
  activeSection: DEFAULT_PORTFOLIO_SECTION,
}

export const PROJECTS_HEADING_ID = "project-heading"

export const PROJECTS_HEADING_VIEWPORT = {
  once: true,
  amount: 0,
  margin: "0px 0px -10% 0px",
}

export const PROJECT_COUNT_PREFIX = "/ "

export const PROJECT_COUNT_DIGITS = 2

export const PROJECT_IMAGE_PATH_PATTERN =
  /^\/projects\/[a-z0-9-]+\.(avif|webp|png|jpe?g)$/

export const PROJECT_LINK_PROTOCOL = "https:"

export const PROJECT_IMAGE_SIZES = "(min-width: 768px) 48rem, 100vw"

export const PROJECT_IMAGE_PLACEHOLDER_LABEL = "Screenshot to come"

export const PROJECT_NEW_TAB_LABEL = "(opens in a new tab)"

export const FOOTER_BACK_TO_TOP_LABEL = "Back to top"

export const PROJECTS_CUE_CLASS =
  "text-[0.75rem] tracking-[0.12em] text-muted-foreground uppercase md:text-[0.6875rem] md:tracking-[0.22em]"

export const FOOTER_NAVIGATION_LABEL = "Footer"

export const FOOTER_LINK_CLASS =
  "inline-flex scroll-mt-18 items-center gap-2 py-1 transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:outline-hidden focus-visible:ring-foreground/50"

export const FOOTER_YEAR = new Date().getFullYear()

export const PUBLIC_TOKEN_OVERRIDES: Record<string, string> = {
  "--destructive": "var(--foreground)",
  "--input": "var(--border)",
}
