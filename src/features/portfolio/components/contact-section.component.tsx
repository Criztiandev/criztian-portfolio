import {
  CONTACT_SECTION,
  COPY_DRIFT_CLASS,
  CUE_CLASS,
  FOCUS_RING_CLASS,
  OWNER_EMAIL_ADDRESS,
  OWNER_EMAIL_HREF,
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

export function ContactSection() {
  const { id, headingId, heading, sceneId, shapes } = CONTACT_SECTION
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
            {heading}
          </span>
        </h2>

        <div className={SCREEN_CENTRED_GROUP_CLASS}>
          <div className={cn(SCREEN_COPY_CLASS, COPY_DRIFT_CLASS)}>
            <p
              style={buildLineStyle(1) as React.CSSProperties}
              className={cn(
                STATEMENT_CLASS,
                STATEMENT_SIZE_CLASSES.contact,
                SWEPT_LINE_CLASS
              )}
            >
              {CONTACT_SECTION.statement}
            </p>

            <p
              style={buildLineStyle(2) as React.CSSProperties}
              className={cn(CUE_CLASS, "mt-3.5 split:mt-8", SWEPT_LINE_CLASS)}
            >
              {CONTACT_SECTION.emailPrompt}{" "}
              <a
                href={OWNER_EMAIL_HREF}
                className={cn(
                  "-my-3.5 inline-block py-3.5 text-foreground underline",
                  "decoration-1 underline-offset-3 split:my-0 split:py-0",
                  "split:underline-offset-4",
                  FOCUS_RING_CLASS
                )}
              >
                {OWNER_EMAIL_ADDRESS}
              </a>
            </p>
          </div>

          <div
            className={cn(
              SCREEN_OBJECT_CLASS,
              "relative mt-20 flex w-full flex-col justify-center bg-background",
              "split:mt-0 split:min-h-[27.5rem] split:max-w-[32.5rem] split:justify-self-center split:p-8"
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
