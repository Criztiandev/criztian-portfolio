import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DOT_FIELD_MORPH_TUNING } from "@/data/hero.data"
import {
  SCENE_FLOW_SHAPES,
  SCENE_LIT_CAPTION_CLASS,
  SWEPT_LABEL_CLASS,
} from "@/data/page-sections.data"
import {
  PROJECT_IMAGE_PLACEHOLDER_LABEL,
  PROJECTS_LABEL,
} from "@/data/portfolio.data"
import {
  DEFAULT_PROJECT_ITEMS,
  NEW_PROJECT_ITEM,
} from "@/data/site-content.data"
import { ProjectsSection } from "@/features/portfolio/components/projects-section.component"
import {
  buildSceneKeyframes,
  parseSceneShapes,
} from "@/features/portfolio/dot-field.rules"
import { buildDeckShapes } from "@/features/portfolio/projects.rules"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"
import type { ProjectItem } from "@/types/site-content.type"

const EXPECTED_LABELS = ["Work · 01 / 03", "Work · 02 / 03", "Work · 03 / 03"]

function renderProjects(items: ProjectItem[]) {
  const projects = { ...createDefaultSiteContent().projects, items }

  return render(<ProjectsSection projects={projects} />)
}

function buildProject(overrides: Partial<ProjectItem>): ProjectItem {
  return { ...NEW_PROJECT_ITEM, ...overrides }
}

function findScene(container: HTMLElement): HTMLElement {
  const section = container.querySelector<HTMLElement>(
    "section[data-dot-scene]"
  )

  if (section === null) {
    throw new Error("the projects scene is missing")
  }

  return section
}

describe("ProjectsSection", () => {
  it("labels the section Work with an h2 and titles each project with an h3", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(
      screen.getByRole("region", { name: PROJECTS_LABEL })
    ).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    expect(container.querySelector("h1")).toBeNull()
    expect(container.querySelector("h4")).toBeNull()
  })

  it("renders the section under the project anchor", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(container.querySelector("section#project")).not.toBeNull()
  })

  it("counts each project in its own screen label", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)
    const labels: string[] = []

    for (const article of container.querySelectorAll("article")) {
      labels.push(article.firstElementChild?.textContent ?? "")
    }

    expect(labels).toEqual(EXPECTED_LABELS)
    expect(container.querySelector("article h2")).toHaveAccessibleName(
      PROJECTS_LABEL
    )
    expect(
      container.querySelector("article h2 > [aria-hidden='true']")
    ).toHaveTextContent("· 01 / 03")

    for (const label of container.querySelectorAll("article > p:first-child")) {
      expect(label).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("sweeps every label's Work with the scene, never with its card", () => {
    const itemSets = [DEFAULT_PROJECT_ITEMS, [buildProject({ title: "Shop" })]]

    for (const items of itemSets) {
      const { container, unmount } = renderProjects(items)
      const words = container.querySelectorAll<HTMLElement>(
        "article > :first-child > :first-child"
      )

      expect(words).toHaveLength(items.length)

      for (const [index, word] of words.entries()) {
        expect(word.textContent).toBe(PROJECTS_LABEL)
        expect(word).toHaveClass(SWEPT_LABEL_CLASS, SCENE_LIT_CAPTION_CLASS)
        expect(word).not.toHaveAttribute("aria-hidden")
        expect(word.style.getPropertyValue("--line")).toBe("0")

        if (index > 0) {
          expect(word).toHaveClass("inline-block", "staged:invisible")
        } else {
          expect(word).not.toHaveClass("staged:invisible")
        }
      }

      unmount()
    }
  })

  it("retires the heading, the intro and the in-section call to action", () => {
    const projects = createDefaultSiteContent().projects

    renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(screen.queryByText(projects.heading)).toBeNull()
    expect(screen.queryByText(projects.lede)).toBeNull()
    expect(screen.queryByRole("link", { name: "Let's talk" })).toBeNull()
  })

  it("skips projects with a blank title", () => {
    const { container } = renderProjects([
      buildProject({ title: "Shop" }),
      buildProject({ title: "" }),
    ])

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1)
    expect(container.querySelectorAll("li")).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      new RegExp(`^${PROJECTS_LABEL}$`)
    )
  })

  it("keeps its label when no project is visible", () => {
    renderProjects([buildProject({ title: "" })])

    expect(
      screen.getByRole("region", { name: PROJECTS_LABEL })
    ).toBeInTheDocument()
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0)
  })

  it("is a dot scene with one hidden slot, pinned in its first child", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)
    const section = container.querySelector("section[data-dot-scene]")
    const slots = container.querySelectorAll("[data-dot-slot]")

    expect(section).not.toBeNull()
    expect(slots).toHaveLength(1)
    expect(slots[0]).toHaveAttribute("aria-hidden", "true")
    expect(slots[0]).toBeEmptyDOMElement()
    expect(section?.firstElementChild?.contains(slots[0] ?? null)).toBe(true)
    expect(section).toHaveAttribute("data-dot-shapes", buildDeckShapes(3))
  })

  it("is one frame per visible project, and one with none", () => {
    const blank = buildProject({ title: "" })
    const cases = [
      { items: DEFAULT_PROJECT_ITEMS, count: 3, steps: "3" },
      {
        items: [
          buildProject({ title: "Shop" }),
          blank,
          buildProject({ title: "Docs" }),
        ],
        count: 2,
        steps: "2",
      },
      { items: [blank], count: 0, steps: "1" },
    ]

    for (const scene of cases) {
      const section = findScene(renderProjects(scene.items).container)

      expect(section).toHaveAttribute(
        "data-dot-shapes",
        buildDeckShapes(scene.count)
      )
      expect(section.style.getPropertyValue("--steps")).toBe(scene.steps)
    }
  })

  it("stacks the cards on a board between the pinned frame and the fit gate", () => {
    const section = findScene(renderProjects(DEFAULT_PROJECT_ITEMS).container)
    const board = section.children[1]
    const gate = section.lastElementChild

    expect(section.children).toHaveLength(3)
    expect(board?.tagName).toBe("OL")
    expect(board).toHaveAttribute("data-deck")
    expect(gate?.tagName).toBe("SPAN")
    expect(gate).toHaveAttribute("hidden")
  })

  it("makes every card a fit box", () => {
    const section = findScene(renderProjects(DEFAULT_PROJECT_ITEMS).container)
    const cards = section.querySelectorAll("[data-deck] > li")

    expect(cards).toHaveLength(3)
    expect(section.querySelectorAll("[data-fit-box]")).toHaveLength(3)

    for (const card of cards) {
      expect(card.firstElementChild?.tagName).toBe("ARTICLE")
      expect(card.firstElementChild).toHaveAttribute("data-fit-box")
    }
  })

  it("keys each card to the step the engine gives its project", () => {
    const section = findScene(renderProjects(DEFAULT_PROJECT_ITEMS).container)
    const keyframes = buildSceneKeyframes(
      [
        {
          id: section.dataset.dotScene ?? "",
          shapes: parseSceneShapes(section.dataset.dotShapes),
          containerTop: 1000,
          containerBottom: 4000,
          stickyTop: 72,
          frameHeight: 828,
          slot: { x: 700, y: 237, width: 700, height: 490 },
        },
      ],
      900,
      DOT_FIELD_MORPH_TUNING
    )
    const captions: string[] = []
    const steps: string[] = []

    for (const card of section.querySelectorAll<HTMLElement>(
      "[data-deck] > li"
    )) {
      captions.push(card.dataset.caption ?? "")
      expect(card.style.getPropertyValue("--caption-reveal")).toBe("")
    }

    for (const keyframe of keyframes) {
      steps.push(keyframe.id)
      expect(keyframe.isThread).toBe(true)
    }

    expect(captions).toHaveLength(3)
    expect(captions).toEqual(steps)
  })

  it("sweeps a lone project's card with its scene, with no step to key it to", () => {
    const section = findScene(
      renderProjects([buildProject({ title: "Shop" })]).container
    )
    const card = section.querySelector<HTMLElement>("[data-deck] > li")

    expect(card).not.toHaveAttribute("data-caption")
    expect(card?.style.getPropertyValue("--caption-reveal")).toBe("")
  })

  it("draws no frame round an empty plate when no project is visible", () => {
    const { container } = renderProjects([buildProject({ title: "" })])
    const section = container.querySelector("section[data-dot-scene]")

    expect(container.querySelectorAll("[data-dot-slot]")).toHaveLength(0)
    expect(section).toHaveAttribute("data-dot-shapes", SCENE_FLOW_SHAPES)
  })

  it("keeps an emptied deck on dust when the editor hides every project", () => {
    const projects = createDefaultSiteContent().projects
    const { container, rerender } = render(
      <ProjectsSection
        projects={{ ...projects, items: DEFAULT_PROJECT_ITEMS }}
      />
    )

    rerender(
      <ProjectsSection
        projects={{ ...projects, items: [buildProject({ title: "" })] }}
      />
    )

    const section = findScene(container)

    expect(section).toHaveAttribute("data-dot-shapes", SCENE_FLOW_SHAPES)
    expect(section).not.toHaveAttribute("data-fit")
    expect(container.querySelectorAll("[data-dot-slot]")).toHaveLength(0)
  })

  it("links the title to an https project in a new tab", () => {
    renderProjects([buildProject({ title: "Shop", link: "https://shop.test" })])

    const link = screen.getByRole("link", { name: /Shop/ })

    expect(link).toHaveAttribute("href", "https://shop.test/")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(link).toHaveAccessibleName("Shop (opens in a new tab)")
    expect(link.closest("h3")).not.toBeNull()
  })

  it("links each https title once, in reading order", () => {
    const { container } = renderProjects([
      buildProject({ title: "Shop", link: "https://shop.test" }),
      buildProject({ title: "Blog", link: "http://blog.test" }),
      buildProject({ title: "Docs", link: "https://docs.test" }),
    ])
    const links = screen.getAllByRole("link")
    const linksPerCard: number[] = []

    for (const article of container.querySelectorAll("article")) {
      linksPerCard.push(article.querySelectorAll("a").length)
    }

    expect(linksPerCard).toEqual([1, 0, 1])
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAccessibleName("Shop (opens in a new tab)")
    expect(links[1]).toHaveAccessibleName("Docs (opens in a new tab)")
  })

  it("renders no link for unsafe or plain http links", () => {
    renderProjects([
      buildProject({ title: "Script", link: "javascript:alert(1)" }),
      buildProject({ title: "Data", link: "data:text/html,hi" }),
      buildProject({ title: "Plain", link: "http://plain.test" }),
    ])

    expect(screen.queryAllByRole("link")).toHaveLength(0)
    expect(screen.getByRole("heading", { name: "Script" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Script|Data|Plain/ })).toBeNull()
  })

  it("renders an image only for a project path or an https url", () => {
    renderProjects([
      buildProject({
        title: "Local",
        image: "/projects/local-shot.webp",
        imageAlt: "Local screenshot",
      }),
      buildProject({
        title: "Remote",
        image: "https://cdn.example.com/shot.png",
        imageAlt: "Remote screenshot",
      }),
      buildProject({
        title: "Rejected",
        image: "http://cdn.example.com/shot.png",
        imageAlt: "Rejected screenshot",
      }),
    ])

    const images = screen.getAllByRole("img")

    expect(images).toHaveLength(2)
    expect(screen.getByAltText("Local screenshot")).toBeInTheDocument()
    expect(screen.getByAltText("Remote screenshot")).toHaveAttribute(
      "src",
      "https://cdn.example.com/shot.png"
    )
    expect(screen.queryByAltText("Rejected screenshot")).toBeNull()
  })

  it("shows the placeholder plate when a project has no image", () => {
    renderProjects([
      buildProject({ title: "One" }),
      buildProject({ title: "Two", image: "/projects/two.png" }),
    ])

    expect(screen.getAllByText(PROJECT_IMAGE_PLACEHOLDER_LABEL)).toHaveLength(1)
  })

  it("hides the tag, summary and stack when they are blank", () => {
    renderProjects([
      buildProject({ title: "Shop", tag: "Web app", stack: "Next.js" }),
    ])

    expect(screen.getByText("Web app")).not.toHaveAttribute("hidden")
    expect(screen.getByText("Next.js")).not.toHaveAttribute("hidden")

    const { container } = renderProjects([buildProject({ title: "Bare" })])
    const article = container.querySelector("article")
    const hiddenParts = article?.querySelectorAll("[hidden]")

    expect(hiddenParts).toHaveLength(3)
  })

  it("never labels anything with the word name", () => {
    const { container } = renderProjects([
      buildProject({ title: "Shop", link: "https://shop.test" }),
    ])

    for (const element of container.querySelectorAll("[aria-label]")) {
      expect(element.getAttribute("aria-label")?.toLowerCase()).not.toContain(
        "name"
      )
    }

    expect(container.querySelectorAll("label")).toHaveLength(0)
  })
})
