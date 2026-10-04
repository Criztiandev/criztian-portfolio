"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowUpRight, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CONTACT_ACKNOWLEDGEMENT_CLASS,
  CONTACT_CHIP_CLASS,
  CONTACT_CHIP_DOT_CLASS,
  CONTACT_CHIP_INPUT_CLASS,
  CONTACT_ERROR_IDS,
  CONTACT_FIELD_CLASS,
  CONTACT_FIELD_NUMBERS,
  CONTACT_LABEL_CLASS,
  CONTACT_LABEL_LINE_CLASS,
  CONTACT_MESSAGE_CLASS,
  CONTACT_NUMBER_CLASS,
  CONTACT_SEND_LABEL,
  CONTACT_SENDING_LABEL,
  CONTACT_SERVICE_LABELS,
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

function movesWithinGroup(event: React.FocusEvent<HTMLInputElement>): boolean {
  const nextFocus = event.relatedTarget

  return (
    nextFocus instanceof HTMLInputElement &&
    nextFocus.name === event.currentTarget.name
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
        <FieldGroup className="gap-3.5 split:gap-7">
          <div className="grid gap-3.5 @md/field-group:grid-cols-2 @md/field-group:gap-x-6">
            <Field className="gap-1.5 split:gap-2">
              <div className={CONTACT_LABEL_LINE_CLASS}>
                <span aria-hidden="true" className={CONTACT_NUMBER_CLASS}>
                  {CONTACT_FIELD_NUMBERS.name}
                </span>
                <label htmlFor="contact-name" className={CONTACT_LABEL_CLASS}>
                  Name
                </label>
              </div>
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

            <Field className="gap-1.5 split:gap-2">
              <div className={CONTACT_LABEL_LINE_CLASS}>
                <span aria-hidden="true" className={CONTACT_NUMBER_CLASS}>
                  {CONTACT_FIELD_NUMBERS.email}
                </span>
                <label htmlFor="contact-email" className={CONTACT_LABEL_CLASS}>
                  Email
                </label>
              </div>
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

          <fieldset
            role="radiogroup"
            aria-required="true"
            aria-invalid={errors.service !== undefined}
            aria-describedby={
              errors.service ? CONTACT_ERROR_IDS.service : undefined
            }
            className="group/service min-w-0"
          >
            <legend className={CONTACT_LABEL_LINE_CLASS}>
              <span aria-hidden="true" className={CONTACT_NUMBER_CLASS}>
                {CONTACT_FIELD_NUMBERS.service}
              </span>
              <span className={CONTACT_LABEL_CLASS}>Service needed</span>
            </legend>
            <div className="mt-2 grid gap-1.5 split:mt-3 split:gap-2">
              <div className="flex max-w-80 flex-wrap gap-1.5 split:max-w-none">
                {CONTACT_SERVICES.map(function renderServiceChip(service) {
                  const serviceField = form.register("service")

                  return (
                    <label key={service} className={CONTACT_CHIP_CLASS}>
                      <input
                        type="radio"
                        value={service}
                        className={CONTACT_CHIP_INPUT_CLASS}
                        {...serviceField}
                        onBlur={function leaveServiceChoice(event) {
                          if (movesWithinGroup(event)) {
                            return
                          }

                          serviceField.onBlur(event)
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className={CONTACT_CHIP_DOT_CLASS}
                      />
                      {CONTACT_SERVICE_LABELS[service]}
                    </label>
                  )
                })}
              </div>
              <ContactFieldError
                id={CONTACT_ERROR_IDS.service}
                message={errors.service?.message}
              />
            </div>
          </fieldset>

          <Field className="gap-1.5 split:gap-2">
            <div className={CONTACT_LABEL_LINE_CLASS}>
              <span aria-hidden="true" className={CONTACT_NUMBER_CLASS}>
                {CONTACT_FIELD_NUMBERS.message}
              </span>
              <label htmlFor="contact-message" className={CONTACT_LABEL_CLASS}>
                What can I help you with?
              </label>
            </div>
            <Textarea
              id="contact-message"
              data-lenis-prevent=""
              className={cn(CONTACT_FIELD_CLASS, CONTACT_MESSAGE_CLASS)}
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
            <ArrowUpRight aria-hidden="true" className="size-4" />
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
