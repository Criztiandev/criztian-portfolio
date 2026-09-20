import type { Store } from "@tanstack/react-store"

export type PortfolioSection = "work" | "about" | "contact"

export type PortfolioNavigationItem = {
  id: PortfolioSection
  label: string
  href: string
}

export type PortfolioUiState = {
  isMobileNavOpen: boolean
  activeSection: PortfolioSection
}

export type PortfolioUiActions = {
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
  selectSection: (section: PortfolioSection) => void
}

export type PortfolioUiStore = Store<PortfolioUiState, PortfolioUiActions>
