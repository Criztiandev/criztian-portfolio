"use client"

import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"

import {
  QUOTE_REVEAL_TRANSITION,
  QUOTE_REVEAL_VARIANTS,
} from "@/data/hero.data"
import { PORTFOLIO_ACTION_NAVIGATION } from "@/data/navigation.data"
import {
  PROJECT_IMAGE_PLACEHOLDER_LABEL,
  PROJECT_IMAGE_SIZES,
  PROJECT_NEW_TAB_LABEL,
  PROJECTS_CUE_CLASS,
  PROJECTS_HEADING_ID,
  PROJECTS_HEADING_VIEWPORT,
} from "@/data/portfolio.data"
import {
  formatProjectCount,
  resolveProjectHref,
  resolveProjectImage,
  selectVisibleProjects,
} from "@/features/portfolio/projects.rules"
import { resolveMotionTransition } from "@/features/portfolio/motion.rules"
import { cn } from "@/lib/utils"
import type { ProjectsSectionProps } from "@/types/portfolio.type"
import type { ProjectItem } from "@/types/site-content.type"

export function ProjectsSection({ projects }: Readonly<ProjectsSectionProps>) {
  const shouldReduceMotion = useReducedMotion() === true
  const visibleProjects = selectVisibleProjects(projects.items)

  function renderProject(project: ProjectItem, index: number) {
    const href = resolveProjectHref(project.link)
    const image = resolveProjectImage(project.image)

    return (
      <li key={index}>
        <article className="group/card relative">
          <div
            className={cn(
              "relative aspect-[10/7] w-full overflow-hidden bg-background",
              "border border-border"
            )}
          >
            {image !== null ? (
              <Image
                src={image.src}
                alt={project.imageAlt}
                fill
                sizes={PROJECT_IMAGE_SIZES}
                unoptimized={image.isRemote}
                className={cn(
                  "object-cover transition-transform duration-700",
                  "ease-[cubic-bezier(0.65,0,0.35,1)]",
                  "motion-safe:group-hover/card:scale-[1.04]"
                )}
              />
            ) : (
              <span className={cn("absolute top-4 left-4", PROJECTS_CUE_CLASS)}>
                {PROJECT_IMAGE_PLACEHOLDER_LABEL}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <h3
              className={cn(
                "font-display font-bold text-foreground/75 uppercase",
                "text-[clamp(1.5rem,1rem+1.5vw,2.25rem)] leading-[1.05]",
                "transition-colors group-focus-within/card:text-foreground",
                "group-hover/card:text-foreground"
              )}
            >
              {href !== null ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "outline-none after:absolute after:inset-0",
                    "focus-visible:outline-hidden",
                    "focus-visible:after:ring-[3px]",
                    "focus-visible:after:ring-foreground/50"
                  )}
                >
                  {project.title}{" "}
                  <span className="sr-only">{PROJECT_NEW_TAB_LABEL}</span>
                </a>
              ) : (
                project.title
              )}
            </h3>

            <span
              hidden={project.tag === ""}
              className={cn(
                "shrink-0 border border-border px-3 py-1.5",
                "text-xs tracking-[0.025em] text-muted-foreground uppercase"
              )}
            >
              {project.tag}
            </span>
          </div>

          <p
            hidden={project.summary === ""}
            className="mt-3 max-w-[60ch] text-foreground/75"
          >
            {project.summary}
          </p>

          <p
            hidden={project.stack === ""}
            className={cn("mt-3", PROJECTS_CUE_CLASS)}
          >
            {project.stack}
          </p>
        </article>
      </li>
    )
  }

  return (
    <section
      id="project"
      data-dot-scene="project"
      data-dot-shapes="sphere"
      aria-labelledby={PROJECTS_HEADING_ID}
      className={cn(
        "mx-auto flex max-w-[80rem] scroll-mt-18 flex-col px-6 text-foreground",
        "md:grid md:grid-cols-[minmax(16rem,22.5rem)_minmax(0,48rem)]",
        "md:justify-between md:gap-x-16 md:px-10"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col gap-8",
          "pt-[max(2rem,10svh)] pb-8 md:self-start",
          "[@media(max-height:30rem)]:gap-4 [@media(max-height:30rem)]:pt-4"
        )}
      >
        <header
          className={cn(
            "flex flex-col gap-6",
            "[@media(max-height:30rem)]:gap-3"
          )}
        >
          <motion.h2
            id={PROJECTS_HEADING_ID}
            initial="hidden"
            whileInView="visible"
            viewport={PROJECTS_HEADING_VIEWPORT}
            variants={QUOTE_REVEAL_VARIANTS}
            transition={resolveMotionTransition(
              QUOTE_REVEAL_TRANSITION,
              shouldReduceMotion
            )}
            className={cn(
              "scroll-mt-18 font-display font-bold text-foreground uppercase",
              "text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05]",
              "wrap-break-word"
            )}
          >
            {projects.heading}
          </motion.h2>

          <p
            className={cn(
              "max-w-[34rem] text-foreground/75 uppercase",
              "[@media(max-height:30rem)]:hidden",
              "text-[0.8125rem] leading-[1.7] tracking-[0.05em]",
              "md:text-sm md:leading-relaxed md:tracking-[0.14em]"
            )}
          >
            {projects.lede}
          </p>

          <p className={PROJECTS_CUE_CLASS}>
            {formatProjectCount(visibleProjects.length)}
          </p>

          <a
            href={PORTFOLIO_ACTION_NAVIGATION.href}
            className={cn(
              "hidden h-10 items-center gap-2 self-start px-5 md:inline-flex",
              "border border-border text-foreground outline-none",
              "text-xs tracking-[0.025em] uppercase transition-colors",
              "hover:border-foreground focus-visible:border-foreground",
              "focus-visible:ring-[3px] focus-visible:ring-foreground/50",
              "focus-visible:outline-hidden"
            )}
          >
            {PORTFOLIO_ACTION_NAVIGATION.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </header>

        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "order-first aspect-square w-full max-w-[min(22.5rem,36svh)] shrink-0",
            "md:order-none md:mt-auto [@media(max-height:30rem)]:max-w-[24svh]",
            "touch-pan-y touch-pinch-zoom",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />
      </div>

      <ol
        className={cn(
          "relative z-[1] flex flex-col gap-10 bg-background pb-[max(5rem,12svh)]",
          "md:z-auto md:gap-15 md:bg-transparent md:pt-[max(6rem,16svh)]"
        )}
      >
        {visibleProjects.map(renderProject)}
      </ol>
    </section>
  )
}
