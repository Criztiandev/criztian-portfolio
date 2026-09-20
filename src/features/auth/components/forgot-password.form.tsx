"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GENERIC_RECOVERY_MESSAGE } from "@/data/auth.data"
import { forgotPasswordSchema } from "@/features/auth/schemas/auth.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type {
  ForgotPasswordInput,
  ForgotPasswordValues,
} from "@/types/auth.type"

const EMPTY_FORGOT: ForgotPasswordInput = {
  email: "",
}

export function ForgotPasswordForm() {
  const trpc = useTRPC()

  const form = useForm<ForgotPasswordInput, unknown, ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: EMPTY_FORGOT,
  })

  const request = useMutation(trpc.auth.forgotPassword.mutationOptions())

  const { errors } = form.formState

  function onSubmit(values: ForgotPasswordValues) {
    request.mutate(values)
  }

  if (request.isSuccess) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {GENERIC_RECOVERY_MESSAGE}
      </p>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Button type="submit" disabled={request.isPending} className="w-fit">
          {request.isPending ? "Sending…" : "Send reset link"}
        </Button>
      </FieldGroup>
    </form>
  )
}
