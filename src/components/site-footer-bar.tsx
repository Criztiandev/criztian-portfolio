import Link from "next/link"

import { FOOTER } from "@/data/home.data"
import { cn } from "@/lib/utils"

export function SiteFooterBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex justify-between border-t border-graphite pt-6 text-body-small text-smoke",
        className
      )}
    >
      <p>{FOOTER.copyright}</p>
      <ul className="flex gap-6">
        {FOOTER.legalLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-paper"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
