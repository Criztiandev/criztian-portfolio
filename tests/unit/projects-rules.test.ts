import { describe, expect, it } from "vitest"

import { NEW_PROJECT_ITEM, PROJECTS_MAX } from "@/data/site-content.data"
import { parseSceneShapes } from "@/features/portfolio/dot-field.rules"
import {
  buildDeckShapes,
  resolveProjectHref,
  resolveProjectImage,
  selectVisibleProjects,
} from "@/features/portfolio/projects.rules"

describe("resolveProjectHref", () => {
  it("accepts an https link", () => {
    expect(resolveProjectHref("https://example.com/shop")).toBe(
      "https://example.com/shop"
    )
  })

  it("trims the link before checking it", () => {
    expect(resolveProjectHref("  https://example.com  ")).toBe(
      "https://example.com/"
    )
  })

  it("rejects every other scheme", () => {
    expect(resolveProjectHref("javascript:alert(1)")).toBeNull()
    expect(resolveProjectHref("data:text/html,hi")).toBeNull()
    expect(resolveProjectHref("http://example.com")).toBeNull()
    expect(resolveProjectHref("mailto:owner@example.test")).toBeNull()
  })

  it("rejects blank, relative and malformed links", () => {
    expect(resolveProjectHref("")).toBeNull()
    expect(resolveProjectHref("/projects")).toBeNull()
    expect(resolveProjectHref("example.com")).toBeNull()
    expect(resolveProjectHref("https://")).toBeNull()
  })
})

describe("resolveProjectImage", () => {
  it("accepts a local project image path", () => {
    expect(resolveProjectImage("/projects/online-shop.webp")).toEqual({
      src: "/projects/online-shop.webp",
      isRemote: false,
    })
    expect(resolveProjectImage("/projects/a1.jpeg")).toEqual({
      src: "/projects/a1.jpeg",
      isRemote: false,
    })
  })

  it("accepts an https image as remote", () => {
    expect(resolveProjectImage("https://cdn.example.com/shot.png")).toEqual({
      src: "https://cdn.example.com/shot.png",
      isRemote: true,
    })
  })

  it("rejects paths outside the projects folder or with other types", () => {
    expect(resolveProjectImage("/projects/../secret.png")).toBeNull()
    expect(resolveProjectImage("/images/shot.png")).toBeNull()
    expect(resolveProjectImage("/projects/Shot.PNG")).toBeNull()
    expect(resolveProjectImage("/projects/shot.svg")).toBeNull()
    expect(resolveProjectImage("projects/shot.png")).toBeNull()
  })

  it("rejects other schemes and blanks", () => {
    expect(resolveProjectImage("")).toBeNull()
    expect(resolveProjectImage("http://example.com/shot.png")).toBeNull()
    expect(resolveProjectImage("data:image/png;base64,AAAA")).toBeNull()
    expect(resolveProjectImage("javascript:alert(1)")).toBeNull()
  })
})

describe("selectVisibleProjects", () => {
  it("skips projects with a blank title and keeps the order", () => {
    const first = { ...NEW_PROJECT_ITEM, title: "First" }
    const blank = { ...NEW_PROJECT_ITEM, title: "   " }
    const second = { ...NEW_PROJECT_ITEM, title: "Second" }

    expect(selectVisibleProjects([first, blank, second])).toEqual([
      first,
      second,
    ])
  })

  it("returns an empty list when nothing has a title", () => {
    expect(selectVisibleProjects([{ ...NEW_PROJECT_ITEM, title: "" }])).toEqual(
      []
    )
  })
})

describe("buildDeckShapes", () => {
  it("falls back to dust when no project is visible", () => {
    expect(buildDeckShapes(0)).toBe("dust")
  })

  it("frames each visible project once", () => {
    expect(buildDeckShapes(1)).toBe("frame")
    expect(buildDeckShapes(3)).toBe("frame frame frame")
  })

  it("parses back to one frame per project, up to the most projects", () => {
    for (let count = 1; count <= PROJECTS_MAX; count += 1) {
      const shapes = parseSceneShapes(buildDeckShapes(count))

      expect(shapes).toHaveLength(count)

      for (const shape of shapes) {
        expect(shape).toBe("frame")
      }
    }
  })
})
