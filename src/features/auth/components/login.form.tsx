"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { DASHBOARD_PATH, GENERIC_LOGIN_ERROR } from "@/data/auth.data"
import { loginSchema } from "@/features/auth/schemas/auth.schema"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type { LoginInput, LoginValues } from "@/types/auth.type"

const EMPTY_LOGIN: LoginInput = {
  email: "",
  password: "",
}

export function LoginForm({ next }: Readonly<{ next?: string }>) {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<LoginInput, unknown, LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: EMPTY_LOGIN,
  })

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async function onSuccess() {
        await queryClient.invalidateQueries()
        router.replace(next ?? DASHBOARD_PATH)
        router.refresh()
      },
    })
  )

  const { errors } = form.formState

  function onSubmit(values: LoginValues) {
    login.mutate(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        {login.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {GENERIC_LOGIN_ERROR}
          </p>
        ) : null}

        <Button type="submit" disabled={login.isPending} className="w-fit">
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  )
}
