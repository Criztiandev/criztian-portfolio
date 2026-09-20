import type { PortfolioSection, PortfolioUiState } from "@/types/portfolio.type"

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSection = "home"

export const INITIAL_PORTFOLIO_UI_STATE: PortfolioUiState = {
  isMobileNavOpen: false,
  activeSection: DEFAULT_PORTFOLIO_SECTION,
}
