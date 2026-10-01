import { STEP_NUMBER_DIGITS } from "@/data/page-sections.data"
import type { FaqItem } from "@/types/site-content.type"

export function selectVisibleFaqItems(items: FaqItem[]): FaqItem[] {
  const visible: FaqItem[] = []

  for (const item of items) {
    if (item.question.trim() === "") {
      continue
    }

    visible.push(item)
  }

  return visible
}

export function formatFaqNumber(itemIndex: number): string {
  return String(itemIndex + 1).padStart(STEP_NUMBER_DIGITS, "0")
}
