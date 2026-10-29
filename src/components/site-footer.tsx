import Link from "next/link"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowUpRight } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { FOOTER } from "@/data/home.data"
import { cn } from "@/lib/utils"

const quietLinkClassName =
  "outline-none hover:underline focus-visible:ring-2 focus-visible:ring-paper"

export function SiteFooter() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-page px-4 pt-20 pb-6 md:px-8 md:pt-24 md:pb-8 xl:px-10 xl:pt-30 xl:pb-10">
        <h2 className="font-heading text-heading-h1 text-paper md:text-display-xl xl:w-275">
          {FOOTER.heading}
        </h2>
        <div className="mt-12 flex flex-col gap-8 md:mt-20 xl:mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <BookCallLink className="w-full md:w-auto" />
            <p className="text-body-base text-smoke">
              {FOOTER.emailLead}{" "}
              <a href={`mailto:${FOOTER.email}`} className={quietLinkClassName}>
                {FOOTER.email}
              </a>
            </p>
          </div>
          <ul className="flex flex-col items-start gap-4 md:flex-row md:gap-8">
            {FOOTER.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "link", size: "link" }),
                    "text-smoke"
                  )}
                >
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <IconArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex justify-between border-t border-graphite pt-6 text-body-small text-smoke md:mt-20 xl:mt-24">
          <p>{FOOTER.copyright}</p>
          <Link href={FOOTER.privacy.href} className={quietLinkClassName}>
            {FOOTER.privacy.label}
          </Link>
        </div>
      </div>
    </footer>
  )
}
