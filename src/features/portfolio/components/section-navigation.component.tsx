"use client"

import { Menu, X } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { PORTFOLIO_NAVIGATION } from "@/data/navigation.data"
import {
  useActiveSection,
  useIsMobileNavOpen,
  usePortfolioUiActions,
} from "@/features/portfolio/hooks/use-portfolio-ui.hook"
import { cn } from "@/lib/utils"
import type { PortfolioNavigationItem } from "@/types/portfolio.type"

const MOBILE_PANEL_ID = "portfolio-mobile-nav"

export function SectionNavigation() {
  const isOpen = useIsMobileNavOpen()
  const activeSection = useActiveSection()
  const actions = usePortfolioUiActions()

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
          "rounded-md px-3 py-2 text-sm transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {item.label}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <a href="#work" className="text-sm font-semibold">
          Criztian
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-1 sm:flex"
        >
          {PORTFOLIO_NAVIGATION.map(renderLink)}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="sm:hidden"
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
        className="flex flex-col gap-1 border-t px-4 py-2 sm:hidden"
      >
        {PORTFOLIO_NAVIGATION.map(renderLink)}
      </nav>
    </header>
  )
}
