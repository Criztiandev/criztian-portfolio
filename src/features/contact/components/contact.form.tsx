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
  CONTACT_ACKNOWLEDGEMENT_CLASS,
  CONTACT_ERROR_IDS,
  CONTACT_FIELD_CLASS,
  CONTACT_SELECT_CLASS,
  CONTACT_SEND_LABEL,
  CONTACT_SENDING_LABEL,
  CONTACT_SERVICE_LABELS,
  CONTACT_SERVICE_PROMPT,
  CONTACT_SERVICES,
  CONTACT_SUBMIT_CLASS,
  EMPTY_CONTACT_FORM,
} from "@/data/contact.data"
import { FOCUS_RING_CLASS } from "@/data/page-sections.data"
import { contactSchema } from "@/features/contact/schemas/contact.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import { cn } from "@/lib/utils"
import type {
  ContactFieldErrorProps,
  ContactInput,
  ContactValues,
} from "@/types/contact.type"

function ContactFieldError({ id, message }: ContactFieldErrorProps) {
  if (message === undefined) {
    return null
  }

  return (
    <FieldError id={id} className="flex items-start gap-1.5">
      <TriangleAlert aria-hidden="true" className="mt-0.75 size-3.5 shrink-0" />
      <span>{message}</span>
    </FieldError>
  )
}

function focusOnAttach(element: HTMLParagraphElement | null): void {
  if (element !== null) {
    element.focus()
  }
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
    if (submit.isPending) {
      return
    }

    submit.mutate(values)
  }

  return (
    <div className="grid">
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className={cn("[grid-area:1/1]", submit.isSuccess && "invisible")}
      >
        <FieldGroup className="gap-4">
          <div className="grid gap-4 @md/field-group:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input
                id="contact-name"
                className={CONTACT_FIELD_CLASS}
                required
                autoComplete="name"
                aria-invalid={errors.name !== undefined}
                aria-describedby={
                  errors.name ? CONTACT_ERROR_IDS.name : undefined
                }
                {...form.register("name")}
              />
              <ContactFieldError
                id={CONTACT_ERROR_IDS.name}
                message={errors.name?.message}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                className={CONTACT_FIELD_CLASS}
                required
                type="email"
                autoComplete="email"
                aria-invalid={errors.email !== undefined}
                aria-describedby={
                  errors.email ? CONTACT_ERROR_IDS.email : undefined
                }
                {...form.register("email")}
              />
              <ContactFieldError
                id={CONTACT_ERROR_IDS.email}
                message={errors.email?.message}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="contact-service">Service needed</FieldLabel>
            <div className="relative">
              <select
                id="contact-service"
                required
                defaultValue=""
                aria-invalid={errors.service !== undefined}
                aria-describedby={
                  errors.service ? CONTACT_ERROR_IDS.service : undefined
                }
                className={CONTACT_SELECT_CLASS}
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
                className="pointer-events-none absolute inset-y-0 right-3 my-auto size-3 text-foreground/75 forced-colors:text-[CanvasText] split:right-4"
              />
            </div>
            <ContactFieldError
              id={CONTACT_ERROR_IDS.service}
              message={errors.service?.message}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-message">
              What can I help you with?
            </FieldLabel>
            <Textarea
              id="contact-message"
              data-lenis-prevent=""
              className={cn(CONTACT_FIELD_CLASS, "h-auto min-h-28 py-2.5")}
              required
              aria-invalid={errors.message !== undefined}
              aria-describedby={
                errors.message ? CONTACT_ERROR_IDS.message : undefined
              }
              {...form.register("message")}
            />
            <ContactFieldError
              id={CONTACT_ERROR_IDS.message}
              message={errors.message?.message}
            />
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
            id={CONTACT_ERROR_IDS.submit}
            message={submit.isError ? submit.error.message : undefined}
          />

          <Button
            type="submit"
            disabled={submit.isPending}
            focusableWhenDisabled
            aria-describedby={
              submit.isError ? CONTACT_ERROR_IDS.submit : undefined
            }
            className={CONTACT_SUBMIT_CLASS}
          >
            {submit.isPending ? CONTACT_SENDING_LABEL : CONTACT_SEND_LABEL}
          </Button>

          <p role="status" className="sr-only">
            {submit.isPending ? CONTACT_SENDING_LABEL : ""}
          </p>
        </FieldGroup>
      </form>

      {submit.isSuccess ? (
        <p
          ref={focusOnAttach}
          tabIndex={-1}
          className={cn(FOCUS_RING_CLASS, CONTACT_ACKNOWLEDGEMENT_CLASS)}
        >
          {submit.data.message}
        </p>
      ) : null}
    </div>
  )
}
