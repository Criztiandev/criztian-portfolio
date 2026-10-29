const WORDS_PER_MINUTE = 200

const postDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter((word) => word !== "")
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE))
}

export function formatPostDate(isoDate: string): string {
  return postDateFormat.format(new Date(`${isoDate}T00:00:00Z`))
}

export function findNextPost<Item extends { slug: string }>(
  newestFirst: Item[],
  slug: string
): Item | null {
  let passedCurrent = false
  for (const post of newestFirst) {
    if (passedCurrent) {
      return post
    }
    if (post.slug === slug) {
      passedCurrent = true
    }
  }
  return null
}
