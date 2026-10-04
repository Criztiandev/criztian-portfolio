import { createStore } from "@tanstack/react-store"

import { INITIAL_PORTFOLIO_UI_STATE } from "@/data/portfolio.data"
import type {
  PortfolioSection,
  PortfolioUiState,
  PortfolioUiStore,
} from "@/types/portfolio.type"

export function createPortfolioUiStore(
  initialState: PortfolioUiState = INITIAL_PORTFOLIO_UI_STATE
): PortfolioUiStore {
  return createStore(initialState, function defineActions({ setState }) {
    function closeMobileNav() {
      setState(function close(state) {
        return { ...state, isMobileNavOpen: false }
      })
    }

    function toggleMobileNav() {
      setState(function toggle(state) {
        return { ...state, isMobileNavOpen: !state.isMobileNavOpen }
      })
    }

    function setActiveSection(section: PortfolioSection) {
      setState(function setActive(state) {
        return { ...state, activeSection: section }
      })
    }

    return {
      closeMobileNav,
      toggleMobileNav,
      setActiveSection,
    }
  })
}
