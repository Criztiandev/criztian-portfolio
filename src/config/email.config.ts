import "server-only"

import { AppError } from "@/error/app.error"

export function getEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const to = process.env.EMAIL_TO
  if (!apiKey || !from || !to) {
    throw new AppError(
      "CONFIG_MISSING",
      "Set RESEND_API_KEY, EMAIL_FROM and EMAIL_TO"
    )
  }
  return { apiKey, from, to }
}
