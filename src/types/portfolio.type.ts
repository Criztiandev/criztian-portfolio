import type { Store } from "@tanstack/react-store"

import type { SiteContentProjects } from "@/types/site-content.type"

export type PortfolioSection =
  | "home"
  | "services"
  | "about"
  | "project"
  | "process"
  | "testimonials"
  | "faq"
  | "blog"
  | "contact"

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
  closeMobileNav: () => void
  toggleMobileNav: () => void
  setActiveSection: (section: PortfolioSection) => void
}

export type PortfolioUiStore = Store<PortfolioUiState, PortfolioUiActions>

export type SectionTop = {
  id: PortfolioSection
  top: number
}

export type CursorState = "hidden" | "field" | "action" | "idle"

export type CursorStateRequest = {
  element: Element | null
  pointerType: string
  isPointerInside: boolean
}

export type CursorSpringTuning = {
  stiffness: number
  damping: number
  mass: number
  restDelta: number
  restSpeed: number
}

export type CursorTuning = {
  dotSize: number
  ringSize: number
  actionSize: number
  ringOpacity: number
  spring: CursorSpringTuning
  stretchSpring: CursorSpringTuning
  stretchVelocity: number
  stretchScale: number
}

export type ProjectImage = {
  src: string
  isRemote: boolean
}

export type ProjectsSectionProps = {
  projects: SiteContentProjects
}
