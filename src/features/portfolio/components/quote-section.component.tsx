import {
  COPY_DRIFT_CLASS,
  CUE_CLASS,
  PIN_SPACER_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import {
  buildCopyDriftStyle,
  buildLineStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/types/site-content.type"

export function QuoteSection({
  quote,
}: Readonly<{
  quote: SiteContent["quote"]
}>) {
  const sceneStyle = {
    ...buildSceneCaptionStyle(1),
    ...buildCopyDriftStyle(),
  }

  return (
    <section
      id="quote"
      data-dot-scene="cube"
      data-dot-shapes="cube"
      style={sceneStyle as React.CSSProperties}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_TIMELINE_CLASS,
        "text-foreground"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col justify-center-safe gap-8",
          "pt-7 pb-6 short:gap-4 short:pt-4 short:pb-4",
          "split:grid split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:items-center",
          "split:gap-x-10 split:pt-14 split:pb-16"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "size-[min(74vw,40svh)] shrink-0 touch-pan-y touch-pinch-zoom self-center",
            "short:size-[min(74vw,34svh)]",
            "split:col-start-2 split:row-start-1 split:size-[min(32vw,56svh)]",
            "split:justify-self-center",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <figure
          className={cn(
            "@container split:col-start-1 split:row-start-1",
            COPY_DRIFT_CLASS
          )}
        >
          <blockquote>
            <p
              style={buildLineStyle(0) as React.CSSProperties}
              className={cn(
                STATEMENT_CLASS,
                STATEMENT_SIZE_CLASSES.belief,
                "max-w-[11ch]",
                SWEPT_LINE_CLASS
              )}
            >
              {quote.text}
            </p>
          </blockquote>

          <figcaption
            hidden={quote.author === ""}
            style={buildLineStyle(1) as React.CSSProperties}
            className={cn(CUE_CLASS, "mt-6", SWEPT_LINE_CLASS)}
          >
            <span aria-hidden="true">— </span>
            {quote.author}
          </figcaption>
        </figure>
      </div>

      <div className={cn(PIN_SPACER_CLASS, "h-[60svh]")} />
    </section>
  )
}
