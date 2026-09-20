import {
  MAX_LOGGED_STACK_LENGTH,
  MAX_LOGGED_STRING_LENGTH,
  MAX_REDACTION_DEPTH,
  REDACTED_PLACEHOLDER,
  SENSITIVE_KEY_FRAGMENTS,
  SENSITIVE_VALUE_PATTERNS,
} from "@/data/logging.data"
import type { LogDetails, LoggedError, LogLevel } from "@/types/logging.type"

export function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase()

  for (const fragment of SENSITIVE_KEY_FRAGMENTS) {
    if (normalized.includes(fragment)) {
      return true
    }
  }

  return false
}

export function maskSensitiveText(
  value: string,
  maxLength: number = MAX_LOGGED_STRING_LENGTH
): string {
  let masked = value

  for (const pattern of SENSITIVE_VALUE_PATTERNS) {
    masked = masked.replace(pattern, REDACTED_PLACEHOLDER)
  }

  if (masked.length > maxLength) {
    return `${masked.slice(0, maxLength)}…`
  }

  return masked
}

function redactObject(source: LogDetails, depth: number): LogDetails {
  const result: LogDetails = {}

  for (const key of Object.keys(source)) {
    if (isSensitiveKey(key)) {
      result[key] = REDACTED_PLACEHOLDER
      continue
    }

    result[key] = redactValue(source[key], depth + 1)
  }

  return result
}

function redactValue(value: unknown, depth: number): unknown {
  if (typeof value === "string") {
    return maskSensitiveText(value)
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (depth >= MAX_REDACTION_DEPTH) {
    return REDACTED_PLACEHOLDER
  }

  if (Array.isArray(value)) {
    const items: unknown[] = []

    for (const item of value) {
      items.push(redactValue(item, depth + 1))
    }

    return items
  }

  return redactObject(value as LogDetails, depth)
}

export function redactDetails(details: LogDetails): LogDetails {
  return redactObject(details, 0)
}

export function describeError(error: unknown): LoggedError | null {
  if (error === null || error === undefined) {
    return null
  }

  if (error instanceof Error) {
    const stack =
      typeof error.stack === "string"
        ? maskSensitiveText(error.stack, MAX_LOGGED_STACK_LENGTH)
        : null

    return {
      name: error.name,
      message: maskSensitiveText(error.message),
      stack,
    }
  }

  return {
    name: "UnknownError",
    message: maskSensitiveText(String(error)),
    stack: null,
  }
}

export function describeErrorForLevel(
  level: LogLevel,
  error: unknown
): LoggedError | null {
  const described = describeError(error)

  if (described === null || level === "error") {
    return described
  }

  return { ...described, stack: null }
}
