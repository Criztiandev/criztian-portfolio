"use client"

import { ArrowUpRight, Menu, X } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  HEADER_GROUP_VARIANTS,
  HEADER_VARIANTS,
  INDICATOR_TRANSITION,
  MOBILE_MENU_WIPE_CLASS,
  NAV_DOT_LAYOUT_ID,
} from "@/data/motion.data"
import {
  BRAND_MARK,
  CLOSE_MENU_LABEL,
  HEADER_ACTIONS_CLASS,
  HEADER_ICON_BUTTON_CLASS,
  MOBILE_PANEL_ID,
  MOBILE_PANEL_LABEL,
  NAV_DOT_CLASS,
  OPEN_MENU_LABEL,
  PANEL_CURRENT_LINK_CLASS,
  PORTFOLIO_ACTION_NAVIGATION,
  PORTFOLIO_BRAND_LABEL,
  PORTFOLIO_HOME_NAVIGATION,
  PORTFOLIO_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
  PRIMARY_NAVIGATION_LABEL,
  SCROLL_PROGRESS_HAIRLINE_CLASS,
  SCROLL_SPY_TOLERANCE_PX,
  SECONDARY_NAVIGATION_LABEL,
  SOLID_AFTER_SCROLL_PX,
} from "@/data/navigation.data"
import { FOCUS_RING_CLASS } from "@/data/page-sections.data"
import { DEFAULT_PORTFOLIO_SECTION } from "@/data/portfolio.data"
import { MotionToggle } from "@/features/portfolio/components/motion-toggle.component"
import { parseCssPixels } from "@/features/portfolio/dot-field.rules"
import {
  useActiveSection,
  useIsMobileNavOpen,
  usePortfolioUiActions,
} from "@/features/portfolio/hooks/use-portfolio-ui.hook"
import { resolveActiveSection } from "@/features/portfolio/navigation.rules"
import { cn } from "@/lib/utils"
import type {
  PortfolioNavigationItem,
  SectionTop,
} from "@/types/portfolio.type"

function readSectionTops(): SectionTop[] {
  const tops: SectionTop[] = []

  for (const item of PORTFOLIO_NAVIGATION) {
    const section = document.getElementById(item.id)

    if (section === null) {
      continue
    }

    const landing = parseCssPixels(getComputedStyle(section).scrollMarginTop)

    tops.push({
      id: item.id,
      top: section.getBoundingClientRect().top - landing,
    })
  }

  return tops
}

export function SectionNavigation() {
  const isOpen = useIsMobileNavOpen()
  const activeSection = useActiveSection()
  const actions = usePortfolioUiActions()
  const [isSolid, setIsSolid] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const mobilePanelRef = useRef<HTMLElement | null>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", function onScrollChange(value) {
    setIsSolid(value > SOLID_AFTER_SCROLL_PX)

    const section = resolveActiveSection(
      readSectionTops(),
      SCROLL_SPY_TOLERANCE_PX,
      DEFAULT_PORTFOLIO_SECTION
    )

    if (section !== activeSection) {
      actions.setActiveSection(section)
    }
  })

  useEffect(
    function closeOnEscape() {
      function onKeyDown(event: KeyboardEvent) {
        if (event.key !== "Escape") {
          return
        }

        const panel = mobilePanelRef.current

        if (panel !== null && panel.contains(document.activeElement)) {
          menuButtonRef.current?.focus()
        }

        actions.closeMobileNav()
      }

      window.addEventListener("keydown", onKeyDown)

      return function cleanup() {
        window.removeEventListener("keydown", onKeyDown)
      }
    },
    [actions]
  )

  function renderLink(item: PortfolioNavigationItem, isPrimary: boolean) {
    const isActive = item.id === activeSection

    return (
      <a
        key={item.id}
        href={item.href}
        onClick={actions.closeMobileNav}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "px-3 py-2 text-sm tracking-wide uppercase transition-colors",
          "text-foreground/75 hover:text-foreground",
          FOCUS_RING_CLASS,
          isPrimary && "relative",
          !isPrimary && PANEL_CURRENT_LINK_CLASS,
          isActive && "text-foreground"
        )}
      >
        {item.label}
        {isPrimary && isActive && (
          <motion.span
            layoutId={NAV_DOT_LAYOUT_ID}
            transition={{ layout: INDICATOR_TRANSITION }}
            aria-hidden="true"
            className={NAV_DOT_CLASS}
          />
        )}
      </a>
    )
  }

  function renderPrimaryLink(item: PortfolioNavigationItem) {
    return renderLink(item, true)
  }

  function renderPanelLink(item: PortfolioNavigationItem) {
    return renderLink(item, false)
  }

  function renderBrandLink() {
    const item = PORTFOLIO_HOME_NAVIGATION

    return (
      <a
        href={item.href}
        onClick={actions.closeMobileNav}
        className={cn(
          "inline-flex items-start gap-0.5 justify-self-start",
          "text-foreground transition-colors",
          FOCUS_RING_CLASS
        )}
      >
        <span className="font-display text-[1.75rem] leading-none font-bold uppercase">
          {PORTFOLIO_BRAND_LABEL}
        </span>
        <span
          aria-hidden="true"
          className="text-[0.625rem] leading-none text-muted-foreground"
        >
          {BRAND_MARK}
        </span>
      </a>
    )
  }

  function renderActionLink() {
    const item = PORTFOLIO_ACTION_NAVIGATION

    return (
      <a
        href={item.href}
        onClick={actions.closeMobileNav}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5",
          "text-sm tracking-wide uppercase transition-colors",
          "bg-foreground text-background hover:bg-foreground/80",
          FOCUS_RING_CLASS
        )}
      >
        {item.label}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    )
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={HEADER_VARIANTS}
      data-reveal=""
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid
          ? "border-b border-rule bg-background/80 backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "relative flex h-18 items-center justify-between px-6 md:px-10",
          "lg:grid lg:grid-cols-[1fr_auto_1fr]"
        )}
      >
        <motion.div
          variants={HEADER_GROUP_VARIANTS}
          data-reveal=""
          className="justify-self-start"
        >
          {renderBrandLink()}
        </motion.div>

        <motion.nav
          aria-label={PRIMARY_NAVIGATION_LABEL}
          variants={HEADER_GROUP_VARIANTS}
          data-reveal=""
          className="hidden items-center gap-4 lg:flex"
        >
          {PORTFOLIO_PRIMARY_NAVIGATION.map(renderPrimaryLink)}
        </motion.nav>

        <div className={HEADER_ACTIONS_CLASS}>
          <MotionToggle />

          <motion.nav
            aria-label={SECONDARY_NAVIGATION_LABEL}
            variants={HEADER_GROUP_VARIANTS}
            data-reveal=""
            className="hidden items-center lg:flex"
          >
            {renderActionLink()}
          </motion.nav>

          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(HEADER_ICON_BUTTON_CLASS, "lg:hidden")}
            aria-expanded={isOpen}
            aria-controls={MOBILE_PANEL_ID}
            aria-label={isOpen ? CLOSE_MENU_LABEL : OPEN_MENU_LABEL}
            onClick={actions.toggleMobileNav}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        <span aria-hidden="true" className={SCROLL_PROGRESS_HAIRLINE_CLASS} />
      </div>

      <nav
        ref={mobilePanelRef}
        id={MOBILE_PANEL_ID}
        aria-label={MOBILE_PANEL_LABEL}
        hidden={!isOpen}
        data-lenis-prevent=""
        className={cn(
          "flex max-h-[calc(100svh_-_4.5rem)] flex-col gap-1 overflow-y-auto",
          "overscroll-contain",
          "border-t border-rule bg-background px-6 py-3 md:px-10 lg:hidden",
          MOBILE_MENU_WIPE_CLASS
        )}
      >
        {PORTFOLIO_NAVIGATION.map(renderPanelLink)}
      </nav>
    </motion.header>
  )
}
