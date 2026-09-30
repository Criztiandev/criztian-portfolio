import type { PortfolioSection, SectionTop } from "@/types/portfolio.type"

export function resolveActiveSection(
  tops: SectionTop[],
  offset: number,
  fallback: PortfolioSection
): PortfolioSection {
  let activeSection = fallback

  for (const section of tops) {
    if (section.top <= offset) {
      activeSection = section.id
    }
  }

  return activeSection
}
