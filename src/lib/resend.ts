import "server-only"

import { Resend } from "resend"

import { getEmailEnv } from "@/config/email.config"
import { AppError } from "@/error/app.error"
import type { EmailInput } from "@/type/email.type"

export async function sendEmail(input: EmailInput): Promise<void> {
  const env = getEmailEnv()
  const result = await new Resend(env.apiKey).emails.send({
    from: env.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  })
  if (result.error !== null) {
    throw new AppError(
      "EMAIL_SEND_FAILED",
      "Could not send the notification email",
      { cause: result.error }
    )
  }
}
