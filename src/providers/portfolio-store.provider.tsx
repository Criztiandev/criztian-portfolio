"use client"

import { createStoreContext } from "@tanstack/react-store"
import { useState } from "react"

import { createPortfolioUiStore } from "@/features/portfolio/stores/portfolio-ui.store"
import type { PortfolioUiStore } from "@/types/portfolio.type"

type PortfolioStoreContextValue = {
  portfolioUi: PortfolioUiStore
}

const { StoreProvider, useStoreContext } =
  createStoreContext<PortfolioStoreContextValue>()

export { useStoreContext as usePortfolioStoreContext }

export function PortfolioStoreProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [portfolioUi] = useState(createPortfolioUiStore)

  return <StoreProvider value={{ portfolioUi }}>{children}</StoreProvider>
}
