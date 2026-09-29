import Image from "next/image"

import {
  ABOUT_PLATE_CLASS,
  ABOUT_SECTION,
  BODY_CLASS,
  CUE_CLASS,
  PINNED_FRAME_CLASS,
  PLATE_CHIP_CLASS,
  PLATE_CLASS,
  PIN_SPACER_CLASS,
  PLATE_SLOT_CLASS,
  SCREEN_CENTRED_GROUP_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SHORT_SCREEN_COPY_GAP_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  TITLE_CLASS,
} from "@/data/page-sections.data"
import { PLATE_IMAGE_SIZES } from "@/data/portfolio.data"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const { id, headingId, heading, sceneId, shapes, plate } = ABOUT_SECTION

  return (
    <section
      id={id}
      data-dot-scene={sceneId}
      data-dot-shapes={shapes}
      aria-labelledby={headingId}
      className={cn(SECTION_FRAME_CLASS, "text-foreground")}
    >
      <div className={cn(PINNED_FRAME_CLASS, SCREEN_CLASS)}>
        <h2
          id={headingId}
          className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
        >
          {heading}
        </h2>

        <div className={SCREEN_CENTRED_GROUP_CLASS}>
          <div
            className={cn(
              PLATE_CLASS,
              SCREEN_OBJECT_CLASS,
              ABOUT_PLATE_CLASS,
              "overflow-hidden"
            )}
          >
            <div
              data-dot-slot=""
              aria-hidden="true"
              className={PLATE_SLOT_CLASS}
            />

            <Image
              src={plate.src}
              alt=""
              fill
              sizes={PLATE_IMAGE_SIZES}
              className="object-cover grayscale"
            />

            <span className={cn(PLATE_CHIP_CLASS, CUE_CLASS)}>
              {plate.label}
            </span>
          </div>

          <div className={cn(SCREEN_COPY_CLASS, SHORT_SCREEN_COPY_GAP_CLASS)}>
            <p className={cn(STATEMENT_CLASS, STATEMENT_SIZE_CLASSES.default)}>
              {ABOUT_SECTION.statement}
            </p>

            <p className={cn(BODY_CLASS, "mt-4 split:mt-[min(2rem,4svh)]")}>
              {ABOUT_SECTION.body}
            </p>

            <p className={cn(BODY_CLASS, "mt-2 split:mt-3")}>
              {ABOUT_SECTION.story}
            </p>

            <dl
              className={cn(
                "mt-7 grid max-w-[35rem] grid-cols-3 gap-4 border-t border-rule pt-4",
                "split:mt-[min(3rem,4svh)] split:gap-x-8 split:pt-[min(1.5rem,2.5svh)] short:mt-4"
              )}
            >
              {ABOUT_SECTION.stats.map(function renderStat(stat) {
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse justify-end gap-2 split:gap-2.5"
                  >
                    <dt className={CUE_CLASS}>{stat.label}</dt>
                    <dd className={cn(TITLE_CLASS, "text-foreground")}>
                      {stat.value}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>
      </div>

      <div className={PIN_SPACER_CLASS} />
    </section>
  )
}
