"use client"

import { Menu, X } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  PORTFOLIO_ACTION_NAVIGATION,
  PORTFOLIO_LEADING_NAVIGATION,
  PORTFOLIO_NAVIGATION,
  PORTFOLIO_TRAILING_NAVIGATION,
} from "@/data/navigation.data"
import {
  useActiveSection,
  useIsMobileNavOpen,
  usePortfolioUiActions,
} from "@/features/portfolio/hooks/use-portfolio-ui.hook"
import { cn } from "@/lib/utils"
import type { PortfolioNavigationItem } from "@/types/portfolio.type"

const MOBILE_PANEL_ID = "portfolio-mobile-nav"

const SOLID_AFTER_SCROLL_PX = 120

const HEADER_VARIANTS = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
}

const GROUP_VARIANTS = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

function LogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[18px]"
      fill="currentColor"
    >
      <path d="M12 1.5 13.2 9l5.3-4.2-4.2 5.3L21.9 12l-7.6 1.9 4.2 5.3-5.3-4.2L12 22.5 10.8 15l-5.3 4.2 4.2-5.3L2.1 12l7.6-1.9-4.2-5.3L10.8 9z" />
    </svg>
  )
}

export function SectionNavigation() {
  const isOpen = useIsMobileNavOpen()
  const activeSection = useActiveSection()
  const actions = usePortfolioUiActions()
  const [isSolid, setIsSolid] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", function onScrollChange(value) {
    setIsSolid(value > SOLID_AFTER_SCROLL_PX)
  })

  useEffect(
    function closeOnEscape() {
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          actions.closeMobileNav()
        }
      }

      window.addEventListener("keydown", onKeyDown)

      return function cleanup() {
        window.removeEventListener("keydown", onKeyDown)
      }
    },
    [actions]
  )

  function renderLink(item: PortfolioNavigationItem) {
    const isActive = item.id === activeSection

    function onSelect() {
      actions.selectSection(item.id)
    }

    return (
      <a
        key={item.id}
        href={item.href}
        onClick={onSelect}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "rounded-sm px-3 py-2 text-xs tracking-wide uppercase transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSolid
            ? "text-muted-foreground hover:text-foreground"
            : "text-white/70 hover:text-white",
          isActive && (isSolid ? "text-foreground" : "text-white")
        )}
      >
        {item.label}
      </a>
    )
  }

  function renderActionLink() {
    const item = PORTFOLIO_ACTION_NAVIGATION

    function onSelect() {
      actions.selectSection(item.id)
    }

    return (
      <a
        href={item.href}
        onClick={onSelect}
        aria-current={item.id === activeSection ? "true" : undefined}
        className={cn(
          "border px-5 py-2 text-xs tracking-wide uppercase transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSolid
            ? "border-border text-foreground hover:bg-foreground hover:text-background"
            : "border-white/40 text-white hover:bg-white hover:text-black"
        )}
      >
        {item.label}
      </a>
    )
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={HEADER_VARIANTS}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid ? "border-b bg-background/80 backdrop-blur" : "bg-transparent"
      )}
    >
      <div className="relative flex h-18 items-center justify-between px-6 md:px-10">
        <div>HI</div>

        <motion.nav
          aria-label="Primary"
          variants={GROUP_VARIANTS}
          className="hidden items-center gap-1 md:flex"
        >
          {PORTFOLIO_LEADING_NAVIGATION.map(renderLink)}
        </motion.nav>

        <motion.nav
          aria-label="Secondary"
          variants={GROUP_VARIANTS}
          className="hidden items-center gap-1 md:flex"
        >
          {renderActionLink()}
        </motion.nav>

        <div className="flex-1 md:hidden" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("md:hidden", isSolid ? "" : "text-white")}
          aria-expanded={isOpen}
          aria-controls={MOBILE_PANEL_ID}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={actions.toggleMobileNav}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <nav
        id={MOBILE_PANEL_ID}
        aria-label="Sections"
        hidden={!isOpen}
        className={cn(
          "flex flex-col gap-1 border-t px-6 py-3 md:hidden",
          isSolid ? "bg-background" : "bg-black"
        )}
      >
        {PORTFOLIO_NAVIGATION.map(renderLink)}
      </nav>
    </motion.header>
  )
}
