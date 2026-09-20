import {
  MAX_SUBMISSIONS_PER_HOUR,
  MIN_SECONDS_BEFORE_SUBMIT,
} from "@/data/contact.data"

export function isHoneypotFilled(website: string | undefined): boolean {
  if (typeof website !== "string") {
    return false
  }

  return website.trim().length > 0
}

export function isTooFast(renderedAt: unknown, now: number): boolean {
  if (typeof renderedAt !== "number" || !Number.isFinite(renderedAt)) {
    return true
  }

  const elapsedSeconds = (now - renderedAt) / 1000

  if (!Number.isFinite(elapsedSeconds)) {
    return true
  }

  return elapsedSeconds < MIN_SECONDS_BEFORE_SUBMIT
}

export function isOverSubmissionCount(count: number | null): boolean {
  if (count === null) {
    return false
  }

  return count >= MAX_SUBMISSIONS_PER_HOUR
}

export function readClientAddress(requestHeaders: Headers): string | null {
  const forwarded = requestHeaders.get("x-forwarded-for")

  if (forwarded !== null && forwarded.length > 0) {
    const [first] = forwarded.split(",")
    return first.trim()
  }

  const realAddress = requestHeaders.get("x-real-ip")

  if (realAddress !== null && realAddress.length > 0) {
    return realAddress.trim()
  }

  return null
}
