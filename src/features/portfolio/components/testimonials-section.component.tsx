import Image from "next/image"

import {
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
  TESTIMONIAL_CLOSE_QUOTE,
  TESTIMONIAL_OPEN_QUOTE,
  TESTIMONIAL_PLATE_CLASS,
  TESTIMONIALS_SECTION,
} from "@/data/page-sections.data"
import { PLATE_IMAGE_SIZES } from "@/data/portfolio.data"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import { cn } from "@/lib/utils"

export function TestimonialsSection() {
  const { id, headingId, heading, sceneId, shapes, items, plate } =
    TESTIMONIALS_SECTION
  const testimonial = items[0]

  if (testimonial === undefined) {
    return null
  }

  const quotedText = `${TESTIMONIAL_OPEN_QUOTE}${testimonial.quote}${TESTIMONIAL_CLOSE_QUOTE}`

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
            className={cn(SCREEN_COPY_CLASS, SHORT_SCREEN_COPY_GAP_CLASS)}
          >
            <blockquote>
              <p className={cn(STATEMENT_CLASS, STATEMENT_SIZE_CLASSES.client)}>
                {quotedText}
              </p>
            </blockquote>

            <figcaption className={cn(CUE_CLASS, "mt-6 split:mt-8")}>
              {testimonial.attribution}
            </figcaption>
          </figure>
        </div>
      </div>

      <div className={PIN_SPACER_CLASS} />
    </section>
  )
}
