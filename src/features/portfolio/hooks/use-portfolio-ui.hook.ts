"use client"

import { useSelector } from "@tanstack/react-store"

import { usePortfolioStoreContext } from "@/providers/portfolio-store.provider"
import type {
  PortfolioSection,
  PortfolioUiActions,
} from "@/types/portfolio.type"

export function usePortfolioUiActions(): PortfolioUiActions {
  const { portfolioUi } = usePortfolioStoreContext()

  return portfolioUi.actions
}

export function useIsMobileNavOpen(): boolean {
  const { portfolioUi } = usePortfolioStoreContext()

  return useSelector(portfolioUi, function selectIsOpen(state) {
    return state.isMobileNavOpen
  })
}

export function useActiveSection(): PortfolioSection {
  const { portfolioUi } = usePortfolioStoreContext()

  return useSelector(portfolioUi, function selectActiveSection(state) {
    return state.activeSection
  })
}
