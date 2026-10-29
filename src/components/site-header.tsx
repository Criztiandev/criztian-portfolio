"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"

import { IconClose, IconMenu, LogoMark } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HERO_TEXT_START_MS } from "@/config/motion.config"
import { BOOK_CALL, NAV_LINKS } from "@/data/nav-links.data"
import { useMobileNav } from "@/hooks/use-mobile-nav"
import { useNavHidden } from "@/hooks/use-nav-hidden"
import { useScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"

const NAV_START_MS = 200
const HOME_NAV_START_MS = HERO_TEXT_START_MS + 200
const NAV_STEP_MS = 120

function HomeMark({ onClick }: Pick<ComponentProps<typeof Link>, "onClick">) {
  return (
    <Link
      href="/"
      aria-label="Criztian, home"
      className="outline-none focus-visible:ring-2 focus-visible:ring-paper"
      onClick={onClick}
    >
      <LogoMark />
    </Link>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useMobileNav()
  const scrolled = useScrolled()
  const hidden = useNavHidden()
  const pathname = usePathname()

  let navStartMs = NAV_START_MS
  if (pathname === "/") {
    navStartMs = HOME_NAV_START_MS
  }

  function navDelay(index: number): React.CSSProperties {
    return { animationDelay: `${navStartMs + index * NAV_STEP_MS}ms` }
  }

  function closeNav() {
    setOpen(false)
  }

  let barClassName = "border-transparent"
  if (scrolled) {
    barClassName = "border-graphite bg-black"
  }

  let slideClassName = ""
  if (hidden) {
    slideClassName = "-translate-y-full has-focus-visible:translate-y-0"
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 border-b transition-transform duration-(--motion-base) ease-out motion-reduce:transition-none xl:h-20",
        barClassName,
        slideClassName
      )}
    >
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-4 md:px-8 xl:px-10">
        <div className="motion-safe:animate-nav-drop" style={navDelay(0)}>
          <HomeMark />
        </div>
        <nav aria-label="Main" className="hidden items-center gap-10 xl:flex">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "link", size: "link" }),
                "motion-safe:animate-nav-drop"
              )}
              style={navDelay(index + 1)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          className="flex items-center gap-2 motion-safe:animate-nav-drop"
          style={navDelay(NAV_LINKS.length + 1)}
        >
          <a
            href={BOOK_CALL.href}
            className={cn(buttonVariants({ size: "small" }))}
          >
            {BOOK_CALL.label}
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-large"
                  className="xl:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <IconMenu />
            </SheetTrigger>
            <SheetContent
              data-lenis-prevent
              side="top"
              showCloseButton={false}
              className="justify-between gap-0 bg-black px-4 pt-4 pb-8 data-[side=top]:h-dvh data-[side=top]:border-b-0 motion-reduce:transition-none md:px-8 xl:hidden"
            >
              <div className="flex items-center justify-between">
                <HomeMark onClick={closeNav} />
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-large"
                      aria-label="Close menu"
                    />
                  }
                >
                  <IconClose />
                </SheetClose>
              </div>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav
                aria-label="Menu"
                className="flex flex-col items-start gap-2"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeNav}
                    className="p-1 font-heading text-heading-h1 text-paper outline-none hover:underline focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-inset md:text-display-l"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <a
                href={BOOK_CALL.href}
                onClick={closeNav}
                className={cn(buttonVariants({ size: "large" }), "w-full")}
              >
                {BOOK_CALL.label}
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
