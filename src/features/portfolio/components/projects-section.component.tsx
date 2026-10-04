import Image from "next/image"

import {
  BODY_CLASS,
  CUE_CLASS,
  PLATE_CHIP_CLASS,
  PLATE_CLASS,
  PROJECT_CARD_CLASS,
  PROJECT_PLATE_CLASS,
  PROJECT_PLATE_WINDOW_CLASS,
  PROJECT_SCREEN_COLUMNS_CLASS,
  PROJECT_SCREEN_WINDOW_CLASS,
  PROJECT_TITLE_LINK_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_HEIGHT_CLASS,
  SCREEN_LABEL_BOX_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_TITLE_CLASS,
  SECTION_TITLE_COUNT_CLASS,
  SHORT_SCREEN_COPY_GAP_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  SWEPT_LABEL_CLASS,
} from "@/data/page-sections.data"
import {
  PROJECT_IMAGE_PLACEHOLDER_LABEL,
  PROJECT_IMAGE_SIZES,
  PROJECT_NEW_TAB_LABEL,
  PROJECT_PLACEHOLDER_IMAGE,
  PROJECTS_HEADING_ID,
  PROJECTS_LABEL,
  PROJECTS_SCENE_ID,
} from "@/data/portfolio.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"
import {
  buildDeckShapes,
  resolveProjectHref,
  resolveProjectImage,
  selectVisibleProjects,
} from "@/features/portfolio/projects.rules"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import {
  buildLineStyle,
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { ProjectsSectionProps } from "@/types/portfolio.type"
import type { ProjectItem } from "@/types/site-content.type"

export function ProjectsSection({ projects }: Readonly<ProjectsSectionProps>) {
  const visibleProjects = selectVisibleProjects(projects.items)
  const projectCount = visibleProjects.length
  const hasProjects = projectCount > 0
  const isDeck = projectCount > 1
  const shapes = buildDeckShapes(projectCount)
  const screenClass = cn(SCREEN_CLASS, PROJECT_SCREEN_COLUMNS_CLASS)
  const plateClass = cn(PLATE_CLASS, SCREEN_OBJECT_CLASS, PROJECT_PLATE_CLASS)
  const sceneStyle = {
    ...buildStepSceneStyle(Math.max(projectCount, 1)),
    ...buildThreadCaptionStyle(),
  }

  function renderPosition(index: number) {
    return (
      <span
        aria-hidden="true"
        style={buildLineStyle(0) as React.CSSProperties}
        className={cn(
          "inline-block whitespace-pre staged:pointer-events-auto staged:caption-line",
          SECTION_TITLE_COUNT_CLASS
        )}
      >
        {formatSectionPosition(index, projectCount)}
      </span>
    )
  }

  function renderLabel(index: number) {
    const labelClass = cn(
      SECTION_LABEL_CLASS,
      SCREEN_LABEL_CLASS,
      SCREEN_LABEL_BOX_CLASS
    )

    if (index > 0) {
      return (
        <p aria-hidden="true" className={labelClass}>
          <span
            style={buildLineStyle(0) as React.CSSProperties}
            className={cn(SWEPT_LABEL_CLASS, "staged:invisible")}
          >
            {PROJECTS_LABEL}
          </span>
          {renderPosition(index)}
        </p>
      )
    }

    return (
      <h2 id={PROJECTS_HEADING_ID} className={labelClass}>
        <span
          style={buildLineStyle(0) as React.CSSProperties}
          className={SWEPT_LABEL_CLASS}
        >
          {PROJECTS_LABEL}
        </span>
        {renderPosition(index)}
      </h2>
    )
  }

  function renderPlateImage(project: ProjectItem) {
    const image = resolveProjectImage(project.image)

    if (image !== null) {
      return (
        <Image
          src={image.src}
          alt={project.imageAlt}
          fill
          sizes={PROJECT_IMAGE_SIZES}
          unoptimized={image.isRemote}
          className="object-cover"
        />
      )
    }

    return (
      <>
        <Image
          src={PROJECT_PLACEHOLDER_IMAGE}
          alt=""
          fill
          sizes={PROJECT_IMAGE_SIZES}
          className="object-cover"
        />

        <span className={cn(PLATE_CHIP_CLASS, CUE_CLASS)}>
          {PROJECT_IMAGE_PLACEHOLDER_LABEL}
        </span>
      </>
    )
  }

  function renderPlate(project: ProjectItem) {
    return (
      <div
        style={buildLineStyle(0) as React.CSSProperties}
        className={cn(
          plateClass,
          "staged:pointer-events-auto staged:plate-sweep"
        )}
      >
        <span aria-hidden="true" className={PROJECT_PLATE_WINDOW_CLASS} />

        <div className="absolute inset-0 overflow-hidden">
          {renderPlateImage(project)}
        </div>
      </div>
    )
  }

  function renderTitle(project: ProjectItem) {
    const href = resolveProjectHref(project.link)

    if (href === null) {
      return project.title
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={PROJECT_TITLE_LINK_CLASS}
      >
        {project.title} <span className="sr-only">{PROJECT_NEW_TAB_LABEL}</span>
      </a>
    )
  }

  function renderProject(project: ProjectItem, index: number) {
    const captionId = isDeck
      ? formatSceneStepId(PROJECTS_SCENE_ID, index)
      : undefined

    return (
      <li
        key={index}
        data-caption={captionId}
        className={cn(PROJECT_SCREEN_WINDOW_CLASS, "staged:[grid-area:1/1]")}
      >
        <article
          data-fit-box=""
          className={cn(screenClass, SCREEN_HEIGHT_CLASS, PROJECT_CARD_CLASS)}
        >
          {renderLabel(index)}

          {renderPlate(project)}

          <div className={cn(SCREEN_COPY_CLASS, SHORT_SCREEN_COPY_GAP_CLASS)}>
            <h3
              style={buildLineStyle(0) as React.CSSProperties}
              className={cn(
                STATEMENT_CLASS,
                STATEMENT_SIZE_CLASSES.default,
                "staged:pointer-events-auto staged:relative staged:caption-line"
              )}
            >
              {renderTitle(project)}
            </h3>

            <p
              hidden={project.summary === ""}
              style={buildLineStyle(1) as React.CSSProperties}
              className={cn(
                BODY_CLASS,
                "mt-4 split:mt-8 staged:pointer-events-auto staged:caption-line"
              )}
            >
              {project.summary}
            </p>

            <div
              style={buildLineStyle(2) as React.CSSProperties}
              className={cn(
                "mt-5 flex flex-wrap items-center gap-4 split:mt-6 split:gap-5",
                "staged:pointer-events-auto staged:caption-line"
              )}
            >
              <span
                hidden={project.tag === ""}
                className={cn(
                  "border border-border px-2.5 py-1",
                  "text-xs leading-4 tracking-[0.025em] text-muted-foreground uppercase"
                )}
              >
                {project.tag}
              </span>

              <span hidden={project.stack === ""} className={CUE_CLASS}>
                {project.stack}
              </span>
            </div>
          </div>
        </article>
      </li>
    )
  }

  function renderEmptyScreen() {
    return (
      <li>
        <div className={cn(screenClass, SCREEN_HEIGHT_CLASS)}>
          {renderLabel(0)}
        </div>
      </li>
    )
  }

  return (
    <section
      id={PROJECTS_SCENE_ID}
      data-dot-scene={PROJECTS_SCENE_ID}
      data-dot-shapes={shapes}
      aria-labelledby={PROJECTS_HEADING_ID}
      style={sceneStyle as React.CSSProperties}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_TIMELINE_CLASS,
        SECTION_TITLE_CLASS,
        "grid text-foreground",
        "h-[calc(var(--steps)_*_(100svh_-_4.5rem))] unpinned:h-auto [@media(scripting:none)]:h-auto"
      )}
    >
      <div
        className={cn(
          screenClass,
          "sticky top-18 h-[calc(100svh_-_4.5rem)] self-start [grid-area:1/1]"
        )}
      >
        <div className={cn(SCREEN_LABEL_CLASS, SCREEN_LABEL_BOX_CLASS)} />

        {hasProjects ? (
          <div
            data-dot-slot=""
            aria-hidden="true"
            className={cn(
              plateClass,
              "pointer-events-none group-data-[status=unsupported]/stage:hidden"
            )}
          />
        ) : null}
      </div>

      <ol
        data-deck=""
        className={cn(
          "relative [grid-area:1/1]",
          "staged:pointer-events-none staged:sticky staged:top-18 staged:grid staged:h-[calc(100svh_-_4.5rem)] staged:self-start"
        )}
      >
        {hasProjects ? visibleProjects.map(renderProject) : renderEmptyScreen()}
      </ol>

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
