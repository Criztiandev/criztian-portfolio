import "server-only"

import { randomUUID } from "node:crypto"

import { describeError, redactDetails } from "@/server/logging/logger.rules"
import type { LogEntry, LogInput, LogLevel } from "@/types/logging.type"

export function createRequestId(): string {
  return randomUUID()
}

function buildEntry(level: LogLevel, input: LogInput): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    event: input.event,
    requestId: input.requestId,
    details: redactDetails(input.details ?? {}),
    error: describeError(input.error),
  }
}

function write(entry: LogEntry): void {
  const line = JSON.stringify(entry)

  if (entry.level === "error") {
    console.error(line)
    return
  }

  if (entry.level === "warn") {
    console.warn(line)
    return
  }

  console.info(line)
}

export function logError(input: LogInput): void {
  write(buildEntry("error", input))
}

export function logWarn(input: LogInput): void {
  write(buildEntry("warn", input))
}

export function logInfo(input: LogInput): void {
  write(buildEntry("info", input))
}
