import {
  CONNECT_SECTION,
  COPY_DRIFT_CLASS,
  CUE_CLASS,
  FOCUS_RING_CLASS,
  MAILTO_PREFIX,
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
import type { ConnectSectionProps } from "@/types/page-sections.type"

export function ConnectSection({ connect }: Readonly<ConnectSectionProps>) {
  const { id, sceneId, shapes } = CONNECT_SECTION
  const emailPrompt =
    connect.emailPrompt === "" ? null : `${connect.emailPrompt} `
  const sceneStyle = {
    ...buildSceneCaptionStyle(1),
    ...buildCopyDriftStyle(),
  }

  return (
    <section
      id={id}
      data-dot-scene={sceneId}
      data-dot-shapes={shapes}
      style={sceneStyle as React.CSSProperties}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_TIMELINE_CLASS,
        "text-foreground"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col justify-center-safe gap-8 pb-6",
          "short:gap-4 short:pt-4 short:pb-4",
          "split:grid split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:items-center",
          "split:gap-x-10 split:py-14"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "aspect-[5/4] max-h-[34svh] w-full shrink-0 touch-pan-y touch-pinch-zoom",
            "split:col-start-2 split:row-start-1 split:max-h-[calc(100svh_-_11.5rem)]",
            "short:max-h-[calc(100svh_-_6.5rem)]",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <div
          className={cn(
            "@container split:col-start-1 split:row-start-1",
            COPY_DRIFT_CLASS
          )}
        >
          <p
            style={buildLineStyle(0) as React.CSSProperties}
            className={cn(
              STATEMENT_CLASS,
              STATEMENT_SIZE_CLASSES.default,
              SWEPT_LINE_CLASS
            )}
          >
            {connect.statement}
          </p>

          <p
            style={buildLineStyle(1) as React.CSSProperties}
            className={cn(CUE_CLASS, "mt-4 split:mt-8", SWEPT_LINE_CLASS)}
          >
            {emailPrompt}
            <a
              href={`${MAILTO_PREFIX}${connect.email}`}
              className={cn(
                "-my-3.5 inline-block py-3.5 text-foreground underline",
                "decoration-1 underline-offset-3 split:my-0 split:py-0",
                "split:underline-offset-4",
                FOCUS_RING_CLASS
              )}
            >
              {connect.email}
            </a>
          </p>
        </div>
      </div>

      <div className={PIN_SPACER_CLASS} />
    </section>
  )
}
