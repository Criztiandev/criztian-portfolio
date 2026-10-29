import { buttonVariants } from "@/components/ui/button"
import { BOOK_CALL } from "@/data/nav-links.data"
import { cn } from "@/lib/utils"

export function BookCallLink({ className }: { className?: string }) {
  return (
    <a
      href={BOOK_CALL.href}
      className={cn(buttonVariants({ size: "large" }), className)}
    >
      {BOOK_CALL.label}
    </a>
  )
}
