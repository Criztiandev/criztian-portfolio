import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  DEFAULT_PROJECT_ITEMS,
  NEW_PROJECT_ITEM,
} from "@/data/site-content.data"
import { ProjectsSection } from "@/features/portfolio/components/projects-section.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"
import type { ProjectItem } from "@/types/site-content.type"

function renderProjects(items: ProjectItem[]) {
  const sectionRef = { current: null }
  const projects = { ...createDefaultSiteContent().projects, items }

  return render(<ProjectsSection projects={projects} sectionRef={sectionRef} />)
}

function buildProject(overrides: Partial<ProjectItem>): ProjectItem {
  return { ...NEW_PROJECT_ITEM, ...overrides }
}

describe("ProjectsSection", () => {
  it("labels the section with an h2 and titles each project with an h3", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(screen.getByRole("region", { name: "Projects" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Projects"
    )
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    expect(container.querySelector("h1")).toBeNull()
    expect(container.querySelector("h4")).toBeNull()
  })

  it("renders the section under the project anchor", () => {
    const { container } = renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(container.querySelector("section#project")).not.toBeNull()
  })

  it("counts the visible projects in the eyebrow", () => {
    renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(screen.getByText("/ 03")).toBeInTheDocument()
  })

  it("points the call to action at the contact form", () => {
    renderProjects(DEFAULT_PROJECT_ITEMS)

    expect(screen.getByRole("link", { name: "Let's talk" })).toHaveAttribute(
      "href",
      "#contact"
    )
  })

  it("skips projects with a blank title", () => {
    const { container } = renderProjects([
      buildProject({ title: "Shop" }),
      buildProject({ title: "" }),
    ])

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1)
    expect(container.querySelectorAll("li")).toHaveLength(1)
    expect(screen.getByText("/ 01")).toBeInTheDocument()
  })

  it("draws one dot frame per visible project", () => {
    const { container } = renderProjects([
      buildProject({ title: "One" }),
      buildProject({ title: "" }),
      buildProject({ title: "Two" }),
    ])

    expect(container.querySelectorAll("[data-dot-frame]")).toHaveLength(2)
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

  it("renders no link for unsafe or plain http links", () => {
    renderProjects([
      buildProject({ title: "Script", link: "javascript:alert(1)" }),
      buildProject({ title: "Data", link: "data:text/html,hi" }),
      buildProject({ title: "Plain", link: "http://plain.test" }),
    ])

    expect(screen.getAllByRole("link")).toHaveLength(1)
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

    expect(screen.getAllByText("Screenshot to come")).toHaveLength(1)
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
