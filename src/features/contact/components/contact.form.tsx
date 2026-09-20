"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema } from "@/features/contact/schemas/contact.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type { ContactInput, ContactValues } from "@/types/contact.type"

const EMPTY_CONTACT_FORM: Omit<ContactInput, "renderedAt"> = {
  name: "",
  email: "",
  message: "",
  website: "",
}

export function ContactForm() {
  const trpc = useTRPC()
  const [renderedAt] = useState(function captureRenderTime() {
    return Date.now()
  })

  const form = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...EMPTY_CONTACT_FORM, renderedAt },
    mode: "onBlur",
  })

  const submit = useMutation(trpc.contact.submit.mutationOptions())

  const { errors } = form.formState

  function onSubmit(values: ContactValues) {
    submit.mutate(values)
  }

  if (submit.isSuccess) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {submit.data.message}
      </p>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            {...form.register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            {...form.register("message")}
          />
          <FieldError errors={[errors.message]} />
        </Field>

        <div aria-hidden="true" className="sr-only">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>

        <input
          type="hidden"
          {...form.register("renderedAt", { valueAsNumber: true })}
        />

        {submit.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {submit.error.message}
          </p>
        ) : null}

        <Button type="submit" disabled={submit.isPending} className="w-fit">
          {submit.isPending ? "Sending…" : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  )
}
