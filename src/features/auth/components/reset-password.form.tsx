"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DASHBOARD_PATH } from "@/data/auth.data"
import { resetPasswordSchema } from "@/features/auth/schemas/auth.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type { ResetPasswordInput, ResetPasswordValues } from "@/types/auth.type"

const EMPTY_RESET: ResetPasswordInput = {
  password: "",
  confirmPassword: "",
}

export function ResetPasswordForm() {
  const router = useRouter()
  const trpc = useTRPC()

  const form = useForm<ResetPasswordInput, unknown, ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: EMPTY_RESET,
  })

  const reset = useMutation(
    trpc.auth.resetPassword.mutationOptions({
      onSuccess: function onSuccess() {
        router.replace(DASHBOARD_PATH)
        router.refresh()
      },
    })
  )

  const { errors } = form.formState

  function onSubmit(values: ResetPasswordValues) {
    reset.mutate(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="reset-confirm">Confirm new password</FieldLabel>
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...form.register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        {reset.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {reset.error.message}
          </p>
        ) : null}

        <Button type="submit" disabled={reset.isPending} className="w-fit">
          {reset.isPending ? "Updating…" : "Update password"}
        </Button>
      </FieldGroup>
    </form>
  )
}
