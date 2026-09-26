import {
  PROJECT_COUNT_DIGITS,
  PROJECT_COUNT_PREFIX,
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

export function formatProjectCount(count: number): string {
  const digits = String(count).padStart(PROJECT_COUNT_DIGITS, "0")

  return `${PROJECT_COUNT_PREFIX}${digits}`
}
