import Image from "next/image"

import {
  COPY_DRIFT_CLASS,
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
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SHORT_SCREEN_COPY_GAP_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  SWEPT_LABEL_CLASS,
  SWEPT_LINE_CLASS,
  TESTIMONIAL_CLOSE_QUOTE,
  TESTIMONIAL_OPEN_QUOTE,
  TESTIMONIAL_PLATE_CLASS,
  TESTIMONIALS_SECTION,
} from "@/data/page-sections.data"
import { PLATE_IMAGE_SIZES } from "@/data/portfolio.data"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import {
  buildCopyDriftStyle,
  buildLineStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"

export function TestimonialsSection() {
  const { id, headingId, heading, sceneId, shapes, items, plate } =
    TESTIMONIALS_SECTION
  const testimonial = items[0]

  if (testimonial === undefined) {
    return null
  }

  const quotedText = `${TESTIMONIAL_OPEN_QUOTE}${testimonial.quote}${TESTIMONIAL_CLOSE_QUOTE}`
  const sceneStyle = {
    ...buildSceneCaptionStyle(2),
    ...buildCopyDriftStyle(),
  }

  return (
    <section
      id={id}
      data-dot-scene={sceneId}
      data-dot-shapes={shapes}
      aria-labelledby={headingId}
      style={sceneStyle as React.CSSProperties}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_TIMELINE_CLASS,
        "text-foreground"
      )}
    >
      <div className={cn(PINNED_FRAME_CLASS, SCREEN_CLASS)}>
        <h2
          id={headingId}
          className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
        >
          <span
            style={buildLineStyle(0) as React.CSSProperties}
            className={SWEPT_LABEL_CLASS}
          >
            {heading}
          </span>
          <span aria-hidden="true">
            {formatSectionPosition(0, items.length)}
          </span>
        </h2>

        <div className={SCREEN_CENTRED_GROUP_CLASS}>
          <div
            className={cn(
              PLATE_CLASS,
              SCREEN_OBJECT_CLASS,
              TESTIMONIAL_PLATE_CLASS,
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
              className="object-cover"
            />

            <span className={cn(PLATE_CHIP_CLASS, CUE_CLASS)}>
              {plate.label}
            </span>
          </div>

          <figure
            className={cn(
              SCREEN_COPY_CLASS,
              SHORT_SCREEN_COPY_GAP_CLASS,
              COPY_DRIFT_CLASS
            )}
          >
            <blockquote>
              <p
                style={buildLineStyle(1) as React.CSSProperties}
                className={cn(
                  STATEMENT_CLASS,
                  STATEMENT_SIZE_CLASSES.client,
                  SWEPT_LINE_CLASS
                )}
              >
                {quotedText}
              </p>
            </blockquote>

            <figcaption
              style={buildLineStyle(2) as React.CSSProperties}
              className={cn(CUE_CLASS, "mt-6 split:mt-8", SWEPT_LINE_CLASS)}
            >
              {testimonial.attribution}
            </figcaption>
          </figure>
        </div>
      </div>

      <div className={PIN_SPACER_CLASS} />
    </section>
  )
}
