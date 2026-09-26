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
  margin: "0px 0px -40% 0px",
}

export const PROJECT_COUNT_PREFIX = "/ "

export const PROJECT_COUNT_DIGITS = 2

export const PROJECT_IMAGE_PATH_PATTERN =
  /^\/projects\/[a-z0-9-]+\.(avif|webp|png|jpe?g)$/

export const PROJECT_LINK_PROTOCOL = "https:"

export const PROJECT_IMAGE_SIZES = "(min-width: 768px) 48rem, 100vw"

export const PROJECT_IMAGE_PLACEHOLDER_LABEL = "Screenshot to come"

export const PROJECT_NEW_TAB_LABEL = "(opens in a new tab)"

export const PROJECTS_CUE_CLASS =
  "text-[0.75rem] tracking-[0.12em] text-white/60 uppercase md:text-[0.6875rem] md:tracking-[0.22em]"
