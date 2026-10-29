import type { Metadata } from "next"
import Link from "next/link"

import {
  IconArrowDown,
  IconArrowUpRight,
  IconClose,
  IconMenu,
  LogoMark,
} from "@/components/icons"
import { PageFrame } from "@/components/page-frame"
import { Button, buttonVariants } from "@/components/ui/button"
import { BOOK_CALL } from "@/data/nav-links.data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Kit",
  robots: { index: false, follow: false },
}

export default function KitPage() {
  const linkClassName = cn(buttonVariants({ variant: "link", size: "link" }))
  return (
    <PageFrame>
      <div className="flex flex-col gap-16">
        <h1 className="font-heading text-heading-h1">Kit</h1>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-heading-h2">Button</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Button size="large">Book a call</Button>
            <Button size="small">Book a call</Button>
            <a
              href={BOOK_CALL.href}
              className={cn(buttonVariants({ size: "large" }))}
            >
              Book a call
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-heading-h2">Link</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/#work" className={linkClassName}>
              See the work
              <IconArrowDown />
            </Link>
            <a href={BOOK_CALL.href} className={linkClassName}>
              {BOOK_CALL.label}
              <IconArrowUpRight />
            </a>
            <Link href="/#prices" className={linkClassName}>
              Prices
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-heading-h2">Icon button</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="ghost" size="icon-large" aria-label="Open menu">
              <IconMenu />
            </Button>
            <Button variant="ghost" size="icon-large" aria-label="Close menu">
              <IconClose />
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-heading-h2">Icons and mark</h2>
          <div className="flex flex-wrap items-center gap-6 text-paper">
            <IconArrowDown />
            <IconArrowUpRight />
            <IconMenu />
            <IconClose />
            <LogoMark />
          </div>
        </section>

        <div className="h-screen" />
      </div>
    </PageFrame>
  )
}
