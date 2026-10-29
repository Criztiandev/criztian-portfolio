import { IconCalendar } from "@tabler/icons-react"
import { format, isValid, parseISO } from "date-fns"
import { useState } from "react"
import type { ChangeEvent, KeyboardEvent, ReactNode, Ref } from "react"
import type { RefCallBack } from "react-hook-form"

import { MarkdownEditor } from "@/components/markdown-editor"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { CmsField, CmsValue } from "@/type/cms.type"
import { cmsColorChannels } from "@/util/cms.util"

const controlClass = "h-9 px-3"
const noColor = "#000000"

function toColor(text: string): string | null {
  const color = text.trim().toLowerCase()
  if (cmsColorChannels(color) === null) {
    return null
  }
  return color
}

function toText(value: CmsValue): string {
  if (typeof value === "string") {
    return value
  }
  return ""
}

function toDay(value: string): Date | undefined {
  if (value === "") {
    return undefined
  }
  const day = parseISO(value)
  if (!isValid(day)) {
    return undefined
  }
  return day
}

function CmsDateControl({
  ref,
  id,
  labelId,
  describedBy,
  hidden,
  value,
  required,
  invalid,
  onChange,
  onBlur,
}: {
  ref: Ref<HTMLButtonElement>
  id: string
  labelId: string
  describedBy: string | undefined
  hidden: boolean
  value: string
  required: boolean
  invalid: boolean
  onChange: (value: string) => void
  onBlur: () => void
}) {
  const [open, setOpen] = useState(false)
  if (hidden && open) {
    setOpen(false)
  }
  const selected = toDay(value)
  let text = <span className="text-muted-foreground">Pick a date</span>
  if (selected !== undefined) {
    text = <span>{format(selected, "MMM d, yyyy")}</span>
  }

  function selectDay(day: Date | undefined) {
    if (day !== undefined) {
      onChange(format(day, "yyyy-MM-dd"))
      setOpen(false)
      return
    }
    if (!required) {
      onChange("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            size="lg"
            aria-labelledby={`${labelId} ${id}`}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className="w-full justify-between rounded-lg px-3 font-normal"
            onBlur={onBlur}
          />
        }
      >
        {text}
        <IconCalendar aria-hidden className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        aria-labelledby={labelId}
        align="start"
        className="w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={selectDay}
        />
      </PopoverContent>
    </Popover>
  )
}

function CmsColorControl({
  ref,
  id,
  name,
  label,
  describedBy,
  value,
  placeholder,
  invalid,
  onChange,
  onBlur,
}: {
  ref: Ref<HTMLInputElement>
  id: string
  name: string
  label: string
  describedBy: string | undefined
  value: string
  placeholder: string | undefined
  invalid: boolean
  onChange: (value: string) => void
  onBlur: () => void
}) {
  const [typing, setTyping] = useState<string | null>(null)
  let text = value
  if (typing !== null) {
    text = typing
  }
  let picked = toColor(value)
  if (picked === null) {
    picked = noColor
  }

  function pick(event: ChangeEvent<HTMLInputElement>) {
    setTyping(null)
    onChange(event.target.value)
  }

  function type(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    if (toColor(next) === null) {
      setTyping(next)
      return
    }
    setTyping(null)
    onChange(next)
  }

  function writeTyped() {
    if (typing !== null) {
      onChange(typing)
      setTyping(null)
    }
  }

  function leave() {
    writeTyped()
    onBlur()
  }

  function writeOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      writeTyped()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={picked}
        aria-label={`${label} color picker`}
        className="size-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        onChange={pick}
        onBlur={onBlur}
      />
      <Input
        ref={ref}
        id={id}
        name={name}
        value={text}
        placeholder={placeholder}
        autoCapitalize="none"
        spellCheck={false}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className={cn(controlClass, "font-mono")}
        onChange={type}
        onBlur={leave}
        onKeyDown={writeOnEnter}
      />
    </div>
  )
}

export function CmsEntryField({
  ref,
  config,
  value,
  error,
  hidden,
  onChange,
  onBlur,
}: {
  ref: RefCallBack
  config: CmsField
  value: CmsValue
  error: { message?: string } | undefined
  hidden: boolean
  onChange: (value: unknown) => void
  onBlur: () => void
}) {
  const id = `cms-field-${config.name}`
  const labelId = `${id}-label`
  const text = toText(value)
  const [startText] = useState(text)
  const invalid = error !== undefined
  let helperId: string | undefined
  let helper = null
  if (config.helper !== undefined) {
    helperId = `${id}-helper`
    helper = (
      <FieldDescription id={helperId} className="text-xs">
        {config.helper}
      </FieldDescription>
    )
  }
  const errorId = `${id}-error`
  let describedBy = helperId
  if (invalid) {
    describedBy = errorId
    if (helperId !== undefined) {
      describedBy = `${helperId} ${errorId}`
    }
  }

  if (config.type === "switch") {
    return (
      <Field
        orientation="horizontal"
        className="gap-3 has-[>[data-slot=field-content]]:items-center"
      >
        <FieldContent className="gap-1">
          <FieldLabel htmlFor={id}>{config.label}</FieldLabel>
          {helper}
        </FieldContent>
        <Switch
          ref={ref}
          id={id}
          checked={value === true}
          aria-describedby={helperId}
          onCheckedChange={onChange}
          onBlur={onBlur}
        />
      </Field>
    )
  }

  let labelFor: string | undefined = id
  let groupLabelId: string | undefined
  let control: ReactNode
  switch (config.type) {
    case "richtext":
      labelFor = undefined
      groupLabelId = labelId
      control = (
        <MarkdownEditor
          ref={ref}
          defaultValue={startText}
          labelId={labelId}
          describedBy={describedBy}
          hidden={hidden}
          placeholder={config.placeholder}
          compact={config.compact}
          invalid={invalid}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
      break
    case "date":
      control = (
        <CmsDateControl
          ref={ref}
          id={id}
          labelId={labelId}
          describedBy={describedBy}
          hidden={hidden}
          value={text}
          required={config.required === true}
          invalid={invalid}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
      break
    case "color":
      control = (
        <CmsColorControl
          ref={ref}
          id={id}
          name={config.name}
          label={config.label}
          describedBy={describedBy}
          value={text}
          placeholder={config.placeholder}
          invalid={invalid}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
      break
    case "select":
      control = (
        <NativeSelect
          ref={ref}
          id={id}
          name={config.name}
          value={text}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className="w-full *:data-[slot=native-select]:h-9 *:data-[slot=native-select]:pl-3"
          onChange={onChange}
          onBlur={onBlur}
        >
          {config.options.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )
      break
    case "textarea":
      control = (
        <Textarea
          ref={ref}
          id={id}
          name={config.name}
          value={text}
          placeholder={config.placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className="px-3"
          onChange={onChange}
          onBlur={onBlur}
        />
      )
      break
    case "slug":
      control = (
        <Input
          ref={ref}
          id={id}
          name={config.name}
          value={text}
          placeholder={config.placeholder}
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={controlClass}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
      break
    default:
      control = (
        <Input
          ref={ref}
          id={id}
          name={config.name}
          value={text}
          placeholder={config.placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={controlClass}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
  }

  return (
    <Field data-invalid={invalid} aria-labelledby={groupLabelId}>
      <FieldLabel id={labelId} htmlFor={labelFor}>
        {config.label}
      </FieldLabel>
      {control}
      {helper}
      <FieldError id={errorId} errors={[error]} />
    </Field>
  )
}
