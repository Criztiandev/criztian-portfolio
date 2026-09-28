"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { FieldError as FieldErrorValue } from "react-hook-form"

export function ColorField({
  id,
  label,
  value,
  error,
  onChange,
}: Readonly<{
  id: string
  label: string
  value: string
  error: FieldErrorValue | undefined
  onChange: (value: string) => void
}>) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          aria-label={`${label} swatch`}
          onChange={handleChange}
          className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
        />

        <Input
          id={id}
          value={value}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
        />
      </div>

      <FieldError errors={[error]} />
    </Field>
  )
}
