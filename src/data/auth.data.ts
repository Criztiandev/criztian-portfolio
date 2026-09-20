export const PROTECTED_PATH_PREFIXES = ["/dashboard"]

export const LOGIN_PATH = "/login"

export const DASHBOARD_PATH = "/dashboard"

export const RESET_PASSWORD_PATH = "/reset-password"

export const AUTH_CONFIRM_PATH = "/auth/confirm"

export const PASSWORD_MIN_LENGTH = 8

export const GENERIC_LOGIN_ERROR = "Incorrect email or password."

export const GENERIC_RECOVERY_MESSAGE =
  "If that address has an account, a reset link is on its way."

export function isProtectedPath(pathname: string): boolean {
  for (const prefix of PROTECTED_PATH_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return true
    }
  }

  return false
}
