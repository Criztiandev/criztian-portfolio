import { getEmailEnv } from "@/config/email.config"
import { sendEmail } from "@/lib/resend"
import { insertContactMessage } from "@/repository/contact-message.repository"
import type { ContactInput } from "@/type/contact.type"
import type { Db } from "@/type/supabase.type"

export async function submitContact(
  db: Db,
  input: ContactInput
): Promise<void> {
  const email = getEmailEnv()
  await insertContactMessage(db, {
    name: input.name,
    email: input.email,
    message: input.message,
  })
  await sendEmail({
    to: email.to,
    replyTo: input.email,
    subject: `New contact message from ${input.name}`,
    text: `${input.name} <${input.email}> wrote:\n\n${input.message}`,
  })
}
