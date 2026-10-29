import type { PostgrestError } from "@supabase/supabase-js"

import type { AppErrorCode } from "@/type/error.type"

const UNIQUE_VIOLATION = "23505"
const NO_RESPONSE = ""

export const APP_ERRORS = {
  UNAUTHORIZED: "UNAUTHORIZED",
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  CONFIG_MISSING: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "INTERNAL_SERVER_ERROR",
  UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "AppError"
    this.code = code
  }
}

export function fromPostgrestError(
  error: PostgrestError,
  message: string
): AppError {
  if (error.code === UNIQUE_VIOLATION) {
    return new AppError("CONFLICT", message, { cause: error })
  }
  if (error.code === NO_RESPONSE) {
    return new AppError("UNAVAILABLE", message, { cause: error })
  }
  return new AppError("DATABASE_ERROR", message, { cause: error })
}

export function isUnavailable(error: unknown): boolean {
  if (error instanceof AppError && error.code === "UNAVAILABLE") {
    return true
  }
  return false
}
