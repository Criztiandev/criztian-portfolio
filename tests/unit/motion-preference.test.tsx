import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  MOTION_PAUSED_STORAGE_KEY,
  MOTION_PAUSED_VALUE,
  MOTION_PREFERENCE_EVENT,
  MOTION_RESTORE_SCRIPT,
  REDUCED_MOTION_QUERY,
} from "@/data/motion.data"
import {
  HEADER_ACTIONS_CLASS,
  MOTION_TOGGLE_CLASS,
  OPEN_MENU_LABEL,
  PAUSE_MOTION_LABEL,
  PLAY_MOTION_LABEL,
  PORTFOLIO_ACTION_NAVIGATION,
  SECONDARY_NAVIGATION_LABEL,
} from "@/data/navigation.data"
import {
  isMotionPaused,
  prefersReducedMotion,
  setMotionPaused,
  subscribeMotionPreference,
} from "@/features/portfolio/browser-capability.rules"
import { MotionToggle } from "@/features/portfolio/components/motion-toggle.component"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"

type QueryListener = () => void

function stubReducedMotionQuery(matches: boolean) {
  const listeners = new Set<QueryListener>()

  vi.spyOn(window, "matchMedia").mockImplementation(function matchMedia(
    query: string
  ) {
    return {
      matches: query === REDUCED_MOTION_QUERY && matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: function addListener(
        _type: string,
        listener: QueryListener
      ) {
        listeners.add(listener)
      },
      removeEventListener: function removeListener(
        _type: string,
        listener: QueryListener
      ) {
        listeners.delete(listener)
      },
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })

  return listeners
}

function runRestoreScript() {
  const restore = new Function(MOTION_RESTORE_SCRIPT)

  restore()
}

afterEach(function resetMotion() {
  delete document.documentElement.dataset.motion
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe("the motion preference", () => {
  it("prefers reduced motion when the system asks or the page is paused", () => {
    stubReducedMotionQuery(false)
    expect(prefersReducedMotion()).toBe(false)

    document.documentElement.dataset.motion = MOTION_PAUSED_VALUE
    expect(isMotionPaused()).toBe(true)
    expect(prefersReducedMotion()).toBe(true)

    delete document.documentElement.dataset.motion
    stubReducedMotionQuery(true)
    expect(isMotionPaused()).toBe(false)
    expect(prefersReducedMotion()).toBe(true)
  })

  it("pauses on the root, remembers it and tells every listener", () => {
    const listener = vi.fn()

    window.addEventListener(MOTION_PREFERENCE_EVENT, listener)
    setMotionPaused(true)

    expect(document.documentElement.dataset.motion).toBe(MOTION_PAUSED_VALUE)
    expect(window.localStorage.getItem(MOTION_PAUSED_STORAGE_KEY)).toBe(
      MOTION_PAUSED_VALUE
    )
    expect(listener).toHaveBeenCalledOnce()

    setMotionPaused(false)

    expect(document.documentElement.dataset.motion).toBeUndefined()
    expect(window.localStorage.getItem(MOTION_PAUSED_STORAGE_KEY)).toBeNull()
    expect(listener).toHaveBeenCalledTimes(2)
    window.removeEventListener(MOTION_PREFERENCE_EVENT, listener)
  })

  it("still pauses the page when the browser refuses storage", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      function refuseStorage() {
        throw new Error("blocked")
      }
    )

    setMotionPaused(true)

    expect(isMotionPaused()).toBe(true)
  })

  it("hears the system setting and the page's pause until released", () => {
    const queryListeners = stubReducedMotionQuery(false)
    const onChange = vi.fn()
    const release = subscribeMotionPreference(onChange)

    for (const listener of queryListeners) {
      listener()
    }

    window.dispatchEvent(new Event(MOTION_PREFERENCE_EVENT))
    expect(onChange).toHaveBeenCalledTimes(2)

    release()
    window.dispatchEvent(new Event(MOTION_PREFERENCE_EVENT))

    expect(queryListeners.size).toBe(0)
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it("restores a remembered pause before the page runs, and nothing else", () => {
    runRestoreScript()
    expect(isMotionPaused()).toBe(false)

    window.localStorage.setItem(MOTION_PAUSED_STORAGE_KEY, MOTION_PAUSED_VALUE)
    runRestoreScript()
    expect(isMotionPaused()).toBe(true)
  })

  it("restores without throwing when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      function refuseStorage() {
        throw new Error("blocked")
      }
    )

    expect(runRestoreScript).not.toThrow()
    expect(isMotionPaused()).toBe(false)
  })
})

describe("MotionToggle", () => {
  it("pauses and plays the page's motion, naming what it will do", () => {
    render(<MotionToggle />)

    fireEvent.click(screen.getByRole("button", { name: PAUSE_MOTION_LABEL }))

    expect(isMotionPaused()).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: PLAY_MOTION_LABEL }))

    expect(isMotionPaused()).toBe(false)
    expect(
      screen.getByRole("button", { name: PAUSE_MOTION_LABEL })
    ).toBeInTheDocument()
  })

  it("follows a pause made elsewhere on the page", () => {
    render(<MotionToggle />)

    fireEvent.click(screen.getByRole("button", { name: PAUSE_MOTION_LABEL }))
    act(function playElsewhere() {
      setMotionPaused(false)
    })

    expect(
      screen.getByRole("button", { name: PAUSE_MOTION_LABEL })
    ).toBeInTheDocument()
  })

  it("hides where the system already stills the page or scripts can't run", () => {
    render(<MotionToggle />)

    for (const token of MOTION_TOGGLE_CLASS.split(" ")) {
      expect(
        screen.getByRole("button", { name: PAUSE_MOTION_LABEL })
      ).toHaveClass(token)
    }
  })

  it("sits in the header's right zone, before the call to action and the menu", () => {
    render(
      <PortfolioStoreProvider>
        <SectionNavigation />
      </PortfolioStoreProvider>
    )

    const toggle = screen.getByRole("button", { name: PAUSE_MOTION_LABEL })
    const actions = toggle.parentElement
    const secondary = screen.getByRole("navigation", {
      name: SECONDARY_NAVIGATION_LABEL,
    })

    expect(actions).toHaveClass(HEADER_ACTIONS_CLASS.split(" ")[0])
    expect(actions?.firstElementChild).toBe(toggle)
    expect(toggle.nextElementSibling).toBe(secondary)
    expect(
      within(secondary).getByRole("link", {
        name: PORTFOLIO_ACTION_NAVIGATION.label,
      })
    ).toBeInTheDocument()
    expect(secondary.nextElementSibling).toBe(
      screen.getByRole("button", { name: OPEN_MENU_LABEL })
    )
    expect(
      screen.getAllByRole("button", { name: PAUSE_MOTION_LABEL })
    ).toHaveLength(1)
  })
})
