import type { Store } from "@tanstack/react-store"

import type { SiteContentProjects } from "@/types/site-content.type"

export type PortfolioSection =
  "home" | "project" | "about" | "services" | "blog" | "contact"

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

export type ProjectImage = {
  src: string
  isRemote: boolean
}

export type ProjectsSectionProps = {
  projects: SiteContentProjects
}
