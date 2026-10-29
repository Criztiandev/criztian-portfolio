import * as z from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Enter your name" })
    .max(100, { error: "Keep your name under 100 characters" }),
  email: z.email({ error: "Enter a valid email address" }).max(254),
  message: z
    .string()
    .trim()
    .min(10, { error: "Write at least 10 characters" })
    .max(2000, { error: "Keep your message under 2000 characters" }),
  website: z.string().max(0),
})
