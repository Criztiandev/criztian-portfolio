"use client"

import { ArrowUpRight, Menu, X } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  PORTFOLIO_ACTION_NAVIGATION,
  PORTFOLIO_BRAND_LABEL,
  PORTFOLIO_HOME_NAVIGATION,
  PORTFOLIO_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
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
          "rounded-sm px-3 py-2 text-sm tracking-wide uppercase transition-colors",
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

  function renderBrandLink() {
    const item = PORTFOLIO_HOME_NAVIGATION

    function onSelect() {
      actions.selectSection(item.id)
    }

    return (
      <a
        href={item.href}
        onClick={onSelect}
        className={cn(
          "inline-flex items-start gap-0.5 justify-self-start transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSolid ? "text-foreground" : "text-white"
        )}
      >
        <span className="font-display text-[1.75rem] leading-none font-bold uppercase">
          {PORTFOLIO_BRAND_LABEL}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[0.625rem] leading-none",
            isSolid ? "text-muted-foreground" : "text-white/45"
          )}
        >
          ©
        </span>
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
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2",
          "text-sm tracking-wide uppercase transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSolid
            ? "bg-foreground text-background hover:bg-foreground/80"
            : "bg-white text-black hover:bg-white/80"
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid ? "border-b bg-background/80 backdrop-blur" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "relative flex h-18 items-center justify-between px-6",
          "md:grid md:grid-cols-[1fr_auto_1fr] md:px-10"
        )}
      >
        <motion.div variants={GROUP_VARIANTS} className="justify-self-start">
          {renderBrandLink()}
        </motion.div>

        <motion.nav
          aria-label="Primary"
          variants={GROUP_VARIANTS}
          className="hidden items-center gap-4 md:flex"
        >
          {PORTFOLIO_PRIMARY_NAVIGATION.map(renderLink)}
        </motion.nav>

        <motion.nav
          aria-label="Secondary"
          variants={GROUP_VARIANTS}
          className="hidden items-center justify-self-end md:flex"
        >
          {renderActionLink()}
        </motion.nav>

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
