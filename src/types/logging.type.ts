export type LogLevel = "error" | "warn" | "info"

export type LogDetails = Record<string, unknown>

export type LoggedError = {
  name: string
  message: string
  stack: string | null
}

export type LogEntry = {
  timestamp: string
  level: LogLevel
  event: string
  requestId: string | null
  details: LogDetails
  error: LoggedError | null
}

export type LogInput = {
  event: string
  requestId: string | null
  details?: LogDetails
  error?: unknown
}
