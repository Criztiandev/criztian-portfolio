import {
  FRAME_SCENE_SHAPES,
  SCENE_FLOW_SHAPES,
} from "@/data/page-sections.data"
import {
  PROJECT_IMAGE_PATH_PATTERN,
  PROJECT_LINK_PROTOCOL,
} from "@/data/portfolio.data"
import type { ProjectImage } from "@/types/portfolio.type"
import type { ProjectItem } from "@/types/site-content.type"

function readSecureUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim())

    if (url.protocol !== PROJECT_LINK_PROTOCOL) {
      return null
    }

    return url
  } catch {
    return null
  }
}

export function resolveProjectHref(link: string): string | null {
  const url = readSecureUrl(link)

  if (url === null) {
    return null
  }

  return url.href
}

export function resolveProjectImage(image: string): ProjectImage | null {
  const path = image.trim()

  if (PROJECT_IMAGE_PATH_PATTERN.test(path)) {
    return { src: path, isRemote: false }
  }

  const url = readSecureUrl(path)

  if (url === null) {
    return null
  }

  return { src: url.href, isRemote: true }
}

export function selectVisibleProjects(items: ProjectItem[]): ProjectItem[] {
  const visible: ProjectItem[] = []

  for (const item of items) {
    if (item.title.trim() === "") {
      continue
    }

    visible.push(item)
  }

  return visible
}

export function buildDeckShapes(projectCount: number): string {
  if (projectCount <= 0) {
    return SCENE_FLOW_SHAPES
  }

  const shapes: string[] = []

  for (let index = 0; index < projectCount; index += 1) {
    shapes.push(FRAME_SCENE_SHAPES)
  }

  return shapes.join(" ")
}
