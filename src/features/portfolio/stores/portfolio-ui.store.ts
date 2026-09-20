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
  return createStore(initialState, ({ setState }) => {
    function openMobileNav() {
      setState(function open(state) {
        return { ...state, isMobileNavOpen: true }
      })
    }

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

    function selectSection(section: PortfolioSection) {
      setState(function select() {
        return { isMobileNavOpen: false, activeSection: section }
      })
    }

    return {
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      selectSection,
    }
  })
}
