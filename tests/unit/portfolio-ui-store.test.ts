import { describe, expect, it } from "vitest"

import { createPortfolioUiStore } from "@/features/portfolio/stores/portfolio-ui.store"

describe("portfolio UI store", () => {
  it("starts closed and deterministic, so server and client agree", () => {
    expect(createPortfolioUiStore().state).toEqual({
      isMobileNavOpen: false,
      activeSection: "home",
    })
  })

  it("toggles and closes the mobile nav", () => {
    const store = createPortfolioUiStore()
    store.actions.toggleMobileNav()
    expect(store.state.isMobileNavOpen).toBe(true)
    store.actions.closeMobileNav()
    expect(store.state.isMobileNavOpen).toBe(false)
    store.actions.toggleMobileNav()
    expect(store.state.isMobileNavOpen).toBe(true)
    store.actions.toggleMobileNav()
    expect(store.state.isMobileNavOpen).toBe(false)
  })

  it("keeps an open menu open when the active section changes", () => {
    const store = createPortfolioUiStore()
    store.actions.toggleMobileNav()
    store.actions.setActiveSection("contact")
    expect(store.state).toEqual({
      isMobileNavOpen: true,
      activeSection: "contact",
    })
  })

  it("keeps a closed menu closed when the active section changes", () => {
    const store = createPortfolioUiStore()
    store.actions.setActiveSection("testimonials")
    expect(store.state).toEqual({
      isMobileNavOpen: false,
      activeSection: "testimonials",
    })
  })

  it("gives each instance independent state", () => {
    const firstStore = createPortfolioUiStore()
    const secondStore = createPortfolioUiStore()
    firstStore.actions.toggleMobileNav()
    expect(secondStore.state.isMobileNavOpen).toBe(false)
  })

  it("notifies subscribers synchronously, with no network round trip", () => {
    const store = createPortfolioUiStore()
    const seen: boolean[] = []
    const sub = store.subscribe(() => seen.push(store.state.isMobileNavOpen))
    store.actions.toggleMobileNav()
    sub.unsubscribe()
    expect(seen).toContain(true)
  })
})
