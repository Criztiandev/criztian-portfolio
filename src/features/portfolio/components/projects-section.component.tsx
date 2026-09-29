import Image from "next/image"

import {
  BODY_CLASS,
  CUE_CLASS,
  PLACEHOLDER_SCENE_SHAPES,
  PLATE_CHIP_CLASS,
  PLATE_CLASS,
  PROJECT_PLATE_CLASS,
  PROJECT_SCREEN_COLUMNS_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_HEIGHT_CLASS,
  SCREEN_LABEL_BOX_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SHORT_SCREEN_COPY_GAP_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
} from "@/data/page-sections.data"
import {
  PROJECT_IMAGE_PLACEHOLDER_LABEL,
  PROJECT_IMAGE_SIZES,
  PROJECT_NEW_TAB_LABEL,
  PROJECT_PLACEHOLDER_IMAGE,
  PROJECTS_HEADING_ID,
  PROJECTS_LABEL,
} from "@/data/portfolio.data"
import {
  resolveProjectHref,
  resolveProjectImage,
  selectVisibleProjects,
} from "@/features/portfolio/projects.rules"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import { cn } from "@/lib/utils"
import type { ProjectsSectionProps } from "@/types/portfolio.type"
import type { ProjectItem } from "@/types/site-content.type"

export function ProjectsSection({ projects }: Readonly<ProjectsSectionProps>) {
  const visibleProjects = selectVisibleProjects(projects.items)
  const screenClass = cn(SCREEN_CLASS, PROJECT_SCREEN_COLUMNS_CLASS)
  const plateClass = cn(PLATE_CLASS, SCREEN_OBJECT_CLASS, PROJECT_PLATE_CLASS)

  function renderLabel(index: number) {
    const position = formatSectionPosition(index, visibleProjects.length)
    const labelClass = cn(
      SECTION_LABEL_CLASS,
      SCREEN_LABEL_CLASS,
      SCREEN_LABEL_BOX_CLASS
    )

    if (index > 0) {
      return (
        <p aria-hidden="true" className={labelClass}>
          {PROJECTS_LABEL}
          {position}
        </p>
      )
    }

    return (
      <h2 id={PROJECTS_HEADING_ID} className={labelClass}>
        {PROJECTS_LABEL}
        <span aria-hidden="true">{position}</span>
      </h2>
    )
  }

  function renderPlate(project: ProjectItem) {
    const image = resolveProjectImage(project.image)

    if (image !== null) {
      return (
        <div className={cn(plateClass, "overflow-hidden")}>
          <Image
            src={image.src}
            alt={project.imageAlt}
            fill
            sizes={PROJECT_IMAGE_SIZES}
            unoptimized={image.isRemote}
            className="object-cover"
          />
        </div>
      )
    }

    return (
      <div className={cn(plateClass, "overflow-hidden")}>
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
        className={cn(
          "scroll-mt-18 outline-none after:absolute after:inset-0",
          "focus-visible:outline-hidden",
          "focus-visible:after:ring-[3px]",
          "focus-visible:after:ring-foreground/50"
        )}
      >
        {project.title} <span className="sr-only">{PROJECT_NEW_TAB_LABEL}</span>
      </a>
    )
  }

  function renderProject(project: ProjectItem, index: number) {
    return (
      <li key={index}>
        <article className={cn(screenClass, "relative", SCREEN_HEIGHT_CLASS)}>
          {renderLabel(index)}

          {renderPlate(project)}

          <div className={cn(SCREEN_COPY_CLASS, SHORT_SCREEN_COPY_GAP_CLASS)}>
            <h3 className={cn(STATEMENT_CLASS, STATEMENT_SIZE_CLASSES.default)}>
              {renderTitle(project)}
            </h3>

            <p
              hidden={project.summary === ""}
              className={cn(BODY_CLASS, "mt-4 split:mt-8")}
            >
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 split:mt-6 split:gap-5">
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
      id="project"
      data-dot-scene="project"
      data-dot-shapes={PLACEHOLDER_SCENE_SHAPES}
      aria-labelledby={PROJECTS_HEADING_ID}
      className={cn(SECTION_FRAME_CLASS, "grid text-foreground")}
    >
      <div
        className={cn(
          screenClass,
          "sticky top-18 h-[calc(100svh_-_4.5rem)] self-start [grid-area:1/1]"
        )}
      >
        <div className={cn(SCREEN_LABEL_CLASS, SCREEN_LABEL_BOX_CLASS)} />

        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            plateClass,
            "touch-pan-y touch-pinch-zoom",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />
      </div>

      <ol className="relative bg-background [grid-area:1/1] split:bg-transparent">
        {visibleProjects.length === 0
          ? renderEmptyScreen()
          : visibleProjects.map(renderProject)}
      </ol>
    </section>
  )
}
