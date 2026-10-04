import {
  SECTION_LABEL_SEPARATOR,
  SECTION_POSITION_DIGITS,
  SECTION_POSITION_SEPARATOR,
} from "@/data/page-sections.data"

function padPosition(position: number): string {
  return String(position).padStart(SECTION_POSITION_DIGITS, "0")
}

export function formatSectionPosition(index: number, count: number): string {
  if (count <= 1) {
    return ""
  }

  const current = padPosition(index + 1)
  const total = padPosition(count)

  return `${SECTION_LABEL_SEPARATOR}${current}${SECTION_POSITION_SEPARATOR}${total}`
}
