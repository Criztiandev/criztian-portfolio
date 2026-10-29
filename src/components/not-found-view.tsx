import Link from "next/link"

import { BookCallLink } from "@/components/book-call-link"
import { buttonVariants } from "@/components/ui/button"
import { NOT_FOUND } from "@/data/not-found.data"
import { cn } from "@/lib/utils"

export function NotFoundView() {
  return (
    <section className="bg-black">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-page flex-col justify-end gap-10 px-4 pt-10 pb-6 md:px-8 md:pb-8 xl:min-h-[calc(100svh-5rem)] xl:px-10 xl:pb-10">
        <p className="font-heading text-display-giant-phone text-paper md:text-display-giant-tablet xl:text-display-giant-desktop">
          {NOT_FOUND.code}
        </p>
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <h1 className="font-heading text-heading-h2 text-paper md:text-heading-h1">
            {NOT_FOUND.message}
          </h1>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <BookCallLink className="w-full md:w-auto" />
            <Link
              href={NOT_FOUND.home.href}
              className={cn(buttonVariants({ variant: "link", size: "link" }))}
            >
              {NOT_FOUND.home.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
