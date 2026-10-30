import { buttonVariants } from "@/components/ui/button"
import { BOOK_CALL } from "@/data/nav-links.data"
import { cn } from "@/lib/utils"

export function BookCallLink({
  className,
  size = "large",
  onClick,
}: {
  className?: string
  size?: "small" | "large"
  onClick?: () => void
}) {
  return (
    <a
      href={BOOK_CALL.href}
      className={cn(buttonVariants({ variant: "fill", size }), className)}
      onClick={onClick}
    >
      {BOOK_CALL.label}
      <span aria-hidden="true" className="button-fill">
        {BOOK_CALL.label}
      </span>
    </a>
  )
}
