import {
  CONTACT_SECTION,
  COPY_DRIFT_CLASS,
  PIN_SPACER_CLASS,
  PLATE_SLOT_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_TITLE_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  SWEPT_LABEL_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import { ContactForm } from "@/features/contact/components/contact.form"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import {
  buildCopyDriftStyle,
  buildLineStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { ContactSectionProps } from "@/types/page-sections.type"

export function ContactSection({ contact }: Readonly<ContactSectionProps>) {
  const { id, headingId, sceneId, shapes } = CONTACT_SECTION
  const sceneStyle = {
    ...buildSceneCaptionStyle(1),
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
        SECTION_TITLE_CLASS,
        "text-foreground"
      )}
    >
      <div
        data-fit-box=""
        className={cn(
          SCREEN_CLASS,
          "sticky top-18 h-[calc(100svh_-_4.5rem)]",
          "unpinned:static unpinned:h-auto unpinned:min-h-[calc(100svh_-_4.5rem)]"
        )}
      >
        <h2
          id={headingId}
          className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
        >
          <span
            style={buildLineStyle(0) as React.CSSProperties}
            className={SWEPT_LABEL_CLASS}
          >
            {contact.label}
          </span>
        </h2>

        <div className="flex flex-col pt-4 split:contents">
          <div className={cn(SCREEN_COPY_CLASS, COPY_DRIFT_CLASS)}>
            <p
              style={buildLineStyle(1) as React.CSSProperties}
              className={cn(
                STATEMENT_CLASS,
                STATEMENT_SIZE_CLASSES.contact,
                SWEPT_LINE_CLASS
              )}
            >
              {contact.statement}
            </p>
          </div>

          <div
            className={cn(
              SCREEN_OBJECT_CLASS,
              "relative mt-17.5 flex w-full flex-col justify-center bg-background",
              "split:mt-0 split:min-h-[29.5rem] split:max-w-[35rem] split:justify-self-center split:p-8"
            )}
          >
            <div
              data-dot-slot=""
              aria-hidden="true"
              className={cn(PLATE_SLOT_CLASS, "pointer-events-none")}
            />

            <ContactForm />
          </div>
        </div>
      </div>

      <div className={cn(PIN_SPACER_CLASS, "unpinned:hidden")} />

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
