import type { Store } from "@tanstack/react-store"

import type { SiteHeaderPlacement } from "@/types/hero.type"

export type PortfolioSection =
  "home" | "project" | "about" | "services" | "blog" | "contact"

export type PortfolioNavigationItem = {
  id: PortfolioSection
  label: string
  href: string
  placement: SiteHeaderPlacement
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
