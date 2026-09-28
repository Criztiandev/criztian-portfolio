"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ChevronDown, TriangleAlert } from "lucide-react"
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
import {
  CONTACT_SERVICE_LABELS,
  CONTACT_SERVICE_PROMPT,
  CONTACT_SERVICES,
  EMPTY_CONTACT_FORM,
} from "@/data/contact.data"
import { contactSchema } from "@/features/contact/schemas/contact.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type {
  ContactFieldErrorProps,
  ContactInput,
  ContactValues,
} from "@/types/contact.type"

function ContactFieldError({ message }: ContactFieldErrorProps) {
  if (message === undefined) {
    return null
  }

  return (
    <FieldError className="flex items-start gap-1.5">
      <TriangleAlert aria-hidden="true" className="mt-0.75 size-3.5 shrink-0" />
      <span>{message}</span>
    </FieldError>
  )
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
            className="scroll-mt-18 dark:bg-transparent"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            {...form.register("name")}
          />
          <ContactFieldError message={errors.name?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            className="scroll-mt-18 dark:bg-transparent"
            required
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            {...form.register("email")}
          />
          <ContactFieldError message={errors.email?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-service">Service needed</FieldLabel>
          <div className="relative">
            <select
              id="contact-service"
              required
              defaultValue=""
              aria-invalid={errors.service ? true : undefined}
              className="h-8 w-full min-w-0 scroll-mt-18 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none *:bg-background *:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 has-[option[value='']:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
              {...form.register("service")}
            >
              <option value="" disabled>
                {CONTACT_SERVICE_PROMPT}
              </option>
              {CONTACT_SERVICES.map(function renderServiceOption(service) {
                return (
                  <option key={service} value={service}>
                    {CONTACT_SERVICE_LABELS[service]}
                  </option>
                )
              })}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-2.5 my-auto size-4 text-muted-foreground"
            />
          </div>
          <ContactFieldError message={errors.service?.message} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">
            What can I help you with?
          </FieldLabel>
          <Textarea
            id="contact-message"
            data-lenis-prevent=""
            className="scroll-mt-18 dark:bg-transparent"
            required
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            {...form.register("message")}
          />
          <ContactFieldError message={errors.message?.message} />
        </Field>

        <div aria-hidden="true" className="sr-only">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            className="scroll-mt-18"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>

        <input
          type="hidden"
          {...form.register("renderedAt", { valueAsNumber: true })}
        />

        <ContactFieldError
          message={submit.isError ? submit.error.message : undefined}
        />

        <Button
          type="submit"
          disabled={submit.isPending}
          className="w-fit scroll-mt-18"
        >
          {submit.isPending ? "Sending…" : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  )
}
