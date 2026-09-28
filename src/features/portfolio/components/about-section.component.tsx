import {
  ABOUT_SECTION,
  SECTION_BODY_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/data/page-sections.data"
import { PROJECTS_CUE_CLASS } from "@/data/portfolio.data"
import { cn } from "@/lib/utils"

export function AboutSection() {
  return (
    <section
      id={ABOUT_SECTION.id}
      data-dot-scene={ABOUT_SECTION.sceneId}
      data-dot-shapes={ABOUT_SECTION.shapes}
      aria-labelledby={ABOUT_SECTION.headingId}
      className={cn(
        "mx-auto min-h-[calc(150svh_-_4.5rem)] max-w-[80rem] scroll-mt-18 px-6 md:px-10",
        "group-data-[status=unsupported]/stage:min-h-0"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col justify-center-safe gap-6",
          "split:grid split:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] split:items-center-safe",
          "split:gap-x-16"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "aspect-square w-full max-w-[min(100%,40svh,max(4rem,calc(100svh_-_27rem)))] shrink-0",
            "touch-pan-y touch-pinch-zoom self-center justify-self-center",
            "split:max-w-[min(100%,34rem,calc(100svh_-_8.5rem))]",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <div className="flex flex-col">
          <h2 id={ABOUT_SECTION.headingId} className={SECTION_HEADLINE_CLASS}>
            {ABOUT_SECTION.heading}
          </h2>

          <p className={cn(SECTION_TITLE_CLASS, "mt-3 text-foreground")}>
            {ABOUT_SECTION.intro}
          </p>

          <p
            className={cn(
              SECTION_BODY_CLASS,
              "mt-3 max-w-[60ch] md:text-lg",
              "[@media(max-height:30rem)]:text-sm"
            )}
          >
            {ABOUT_SECTION.body}
          </p>

          <dl
            className={cn(
              "mt-6 grid grid-cols-3 gap-x-4 border-t border-border",
              "[@media(max-height:30rem)]:mt-4"
            )}
          >
            {ABOUT_SECTION.stats.map(function renderStat(stat) {
              return (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col-reverse gap-2 pt-5",
                    "[@media(max-height:30rem)]:pt-3"
                  )}
                >
                  <dt className={PROJECTS_CUE_CLASS}>{stat.label}</dt>
                  <dd className={cn(SECTION_TITLE_CLASS, "text-foreground")}>
                    {stat.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
