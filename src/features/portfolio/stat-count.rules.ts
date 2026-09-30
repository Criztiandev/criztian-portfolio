import { STAT_COUNT_PATTERN } from "@/data/page-sections.data"
import type { StatCount, StepMotionStyle } from "@/types/page-sections.type"

export function parseStatCount(value: string): StatCount | null {
  const match = STAT_COUNT_PATTERN.exec(value)

  if (match === null) {
    return null
  }

  const target = Number(match[1])
  const suffix = match[2] ?? ""

  if (`${target}${suffix}` !== value) {
    return null
  }

  return { target, suffix }
}

export function buildStatCountStyle(count: StatCount): StepMotionStyle {
  return { "--stat-value": count.target }
}
