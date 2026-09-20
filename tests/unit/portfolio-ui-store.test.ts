import { describe, expect, it } from "vitest"

import { createPortfolioUiStore } from "@/features/portfolio/stores/portfolio-ui.store"

describe("portfolio UI store", () => {
  it("starts closed and deterministic, so server and client agree", () => {
    expect(createPortfolioUiStore().state).toEqual({
      isMobileNavOpen: false,
      activeSection: "home",
    })
  })

  it("opens, closes and toggles the mobile nav", () => {
    const store = createPortfolioUiStore()
    store.actions.openMobileNav()
    expect(store.state.isMobileNavOpen).toBe(true)
    store.actions.closeMobileNav()
    expect(store.state.isMobileNavOpen).toBe(false)
    store.actions.toggleMobileNav()
    expect(store.state.isMobileNavOpen).toBe(true)
  })

  it("closes the panel when a section is selected", () => {
    const store = createPortfolioUiStore()
    store.actions.openMobileNav()
    store.actions.selectSection("contact")
    expect(store.state).toEqual({
      isMobileNavOpen: false,
      activeSection: "contact",
    })
  })

  it("gives each instance independent state", () => {
    const firstStore = createPortfolioUiStore()
    const secondStore = createPortfolioUiStore()
    firstStore.actions.openMobileNav()
    expect(secondStore.state.isMobileNavOpen).toBe(false)
  })

  it("notifies subscribers synchronously, with no network round trip", () => {
    const store = createPortfolioUiStore()
    const seen: boolean[] = []
    const sub = store.subscribe(() => seen.push(store.state.isMobileNavOpen))
    store.actions.openMobileNav()
    sub.unsubscribe()
    expect(seen).toContain(true)
  })
})
