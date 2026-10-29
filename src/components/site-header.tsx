"use client"

import { IconMenu2, IconX } from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site.config"
import { NAV_LINKS } from "@/data/nav-links.data"
import { useMobileNav } from "@/hooks/use-mobile-nav"

export function SiteHeader() {
  const [open, setOpen] = useMobileNav()

  function closeNav() {
    setOpen(false)
  }

  function toggleNav() {
    setOpen(!open)
  }

  let toggleIcon = <IconMenu2 />
  if (open) {
    toggleIcon = <IconX />
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold" onClick={closeNav}>
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={toggleNav}
        >
          {toggleIcon}
        </Button>
      </div>
      <nav
        id="mobile-nav"
        hidden={!open}
        className="flex flex-col gap-3 border-t px-4 py-4 text-sm md:hidden"
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={closeNav}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
