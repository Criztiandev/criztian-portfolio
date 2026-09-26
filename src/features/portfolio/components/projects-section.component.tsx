"use client"

import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Transition } from "motion/react"
import Image from "next/image"

import {
  INSTANT_TRANSITION,
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
import { cn } from "@/lib/utils"
import type { ProjectsSectionProps } from "@/types/portfolio.type"
import type { ProjectItem } from "@/types/site-content.type"

export function ProjectsSection({
  projects,
  sectionRef,
}: Readonly<ProjectsSectionProps>) {
  const shouldReduceMotion = useReducedMotion() === true
  const visibleProjects = selectVisibleProjects(projects.items)

  function resolveTransition(transition: Transition): Transition {
    if (shouldReduceMotion) {
      return INSTANT_TRANSITION
    }

    return transition
  }

  function renderProject(project: ProjectItem, index: number) {
    const href = resolveProjectHref(project.link)
    const image = resolveProjectImage(project.image)

    return (
      <li key={index}>
        <article className="group/card relative">
          <div
            data-dot-frame=""
            className={cn(
              "relative aspect-[10/7] w-full overflow-hidden bg-black",
              "border border-white/40 transition-colors duration-700",
              "group-data-[burst=open]:border-transparent"
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
                "font-display font-bold text-white/75 uppercase",
                "text-[clamp(1.5rem,1rem+1.5vw,2.25rem)] leading-[1.05]",
                "transition-colors group-focus-within/card:text-white",
                "group-hover/card:text-white"
              )}
            >
              {href !== null ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "outline-none after:absolute after:inset-0",
                    "focus-visible:after:ring-[3px]",
                    "focus-visible:after:ring-white/50"
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
                "shrink-0 border border-white/40 px-3 py-1.5",
                "text-xs tracking-[0.025em] text-white/60 uppercase"
              )}
            >
              {project.tag}
            </span>
          </div>

          <p
            hidden={project.summary === ""}
            className="mt-3 max-w-[60ch] text-white/75"
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
      ref={sectionRef}
      id="project"
      aria-labelledby={PROJECTS_HEADING_ID}
      className={cn(
        "scroll-mt-20 px-6 md:px-10",
        "pt-[max(6rem,16svh)] pb-[max(5rem,12svh)]"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[80rem] flex-col gap-15",
          "md:grid md:grid-cols-[minmax(16rem,22.5rem)_minmax(0,48rem)]",
          "md:justify-between md:gap-x-16"
        )}
      >
        <header className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
          <p className={PROJECTS_CUE_CLASS}>
            {formatProjectCount(visibleProjects.length)}
          </p>

          <motion.h2
            id={PROJECTS_HEADING_ID}
            initial="hidden"
            whileInView="visible"
            viewport={PROJECTS_HEADING_VIEWPORT}
            variants={QUOTE_REVEAL_VARIANTS}
            transition={resolveTransition(QUOTE_REVEAL_TRANSITION)}
            className={cn(
              "font-display font-bold text-white uppercase",
              "text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05]",
              "wrap-break-word"
            )}
          >
            {projects.heading}
          </motion.h2>

          <p
            className={cn(
              "max-w-[34rem] text-white/75 uppercase",
              "text-[0.8125rem] leading-[1.7] tracking-[0.05em]",
              "md:text-sm md:leading-relaxed md:tracking-[0.14em]"
            )}
          >
            {projects.lede}
          </p>

          <a
            href={PORTFOLIO_ACTION_NAVIGATION.href}
            className={cn(
              "inline-flex h-10 items-center gap-2 self-start px-5",
              "border border-white/40 text-white outline-none",
              "text-xs tracking-[0.025em] uppercase transition-colors",
              "hover:border-white focus-visible:border-white",
              "focus-visible:ring-[3px] focus-visible:ring-white/50"
            )}
          >
            {PORTFOLIO_ACTION_NAVIGATION.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </header>

        <ol className="flex flex-col gap-10 md:gap-15">
          {visibleProjects.map(renderProject)}
        </ol>
      </div>
    </section>
  )
}
