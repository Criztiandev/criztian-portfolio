import Image from "next/image"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowDown } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { HERO } from "@/data/home.data"
import { cn } from "@/lib/utils"
import type { Home } from "@/type/home.type"

export function HeroSection({ home }: { home: Home }) {
  return (
    <section
      data-cms-card="Hero"
      className="-mt-16 overflow-hidden bg-black xl:-mt-20"
    >
      <div className="relative mx-auto max-w-page xl:h-225">
        <div className="relative h-130 overflow-hidden md:h-190 xl:absolute xl:inset-0 xl:h-auto">
          <p
            aria-hidden="true"
            className="absolute inset-x-0 top-20 text-center font-heading text-display-giant-phone text-paper md:top-70 md:text-display-giant-tablet xl:top-61.5 xl:text-display-giant-desktop"
          >
            <span className="block md:inline">{HERO.nameStart}</span>
            <span className="block md:inline">{HERO.nameEnd}</span>
          </p>
          <div className="absolute top-57.5 left-1/2 h-112.5 w-75 -translate-x-1/2 md:top-25 md:h-165 md:w-110 xl:top-0 xl:h-225 xl:w-150">
            <Image
              src={HERO.portrait.src}
              alt={HERO.portrait.alt}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 440px, 300px"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-1/2 h-15 w-75 -translate-x-1/2 bg-linear-to-b from-black/0 to-black md:h-44.5 md:w-110 xl:h-60 xl:w-150" />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-8 pb-12 md:flex-row md:gap-8 md:px-8 xl:absolute xl:inset-x-0 xl:bottom-10 xl:items-end xl:justify-between xl:px-10 xl:py-0">
          <h1
            data-cms-field="heroHeading"
            className="font-heading text-heading-h2 text-paper md:flex-1 xl:w-99.5 xl:flex-none"
          >
            {home.heroHeading}
          </h1>
          <div className="flex flex-col gap-6 md:flex-1 xl:w-85 xl:flex-none">
            <p data-cms-field="heroText" className="text-body-base text-smoke">
              {home.heroText}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-8">
                <BookCallLink />
                <a
                  href={HERO.workLink.href}
                  className={cn(
                    buttonVariants({ variant: "link", size: "link" })
                  )}
                >
                  {HERO.workLink.label}
                  <IconArrowDown />
                </a>
              </div>
              <p className="text-body-base text-smoke md:whitespace-nowrap">
                {HERO.callNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
