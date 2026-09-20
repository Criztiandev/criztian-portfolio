"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  DRAFT_SAVE_DEBOUNCE_MS,
  HERO_TEXT_FIELDS,
  PREVIEW_CONTENT_DEBOUNCE_MS,
  PREVIEW_CONTENT_MESSAGE,
  SAVE_STATE_LABELS,
  SITE_CONTENT_PUBLISH_CONFIRMATION,
  SITE_CONTENT_PUBLISH_FAILED_MESSAGE,
  SITE_CONTENT_SAVE_FAILED_MESSAGE,
  THEME_COLOR_FIELDS,
} from "@/data/site-content.data"
import { ColorField } from "@/features/site-content/components/color-field.component"
import { RichTextField } from "@/features/site-content/components/rich-text-field.component"
import {
  useEditorUiActions,
  useSaveState,
  useSelectedEntry,
} from "@/features/site-content/hooks/use-editor-ui.hook"
import { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import { postPreviewMessage } from "@/features/site-content/services/preview-messenger.service"
import { useTRPC } from "@/lib/trpc/trpc.client"
import type {
  RichTextDocument,
  SiteContent,
  SiteContentInput,
} from "@/types/site-content.type"

export function EditorConfigPanel({
  initialContent,
  initialHasUnpublishedChanges,
  frameRef,
  pendingContentRef,
}: Readonly<{
  initialContent: SiteContent
  initialHasUnpublishedChanges: boolean
  frameRef: React.RefObject<HTMLIFrameElement | null>
  pendingContentRef: React.RefObject<SiteContent>
}>) {
  const trpc = useTRPC()
  const selectedEntry = useSelectedEntry()
  const saveState = useSaveState()
  const { setSaveState } = useEditorUiActions()

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(
    initialHasUnpublishedChanges
  )

  const previewTimerRef = useRef<number | null>(null)
  const saveTimerRef = useRef<number | null>(null)

  const form = useForm<SiteContentInput, unknown, SiteContent>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: initialContent,
    mode: "onBlur",
  })

  const saveDraft = useMutation(
    trpc.siteContent.saveDraft.mutationOptions({
      onMutate: function onMutate() {
        setSaveState("saving")
      },
      onSuccess: function onSuccess(result) {
        setSaveState("saved")
        setHasUnpublishedChanges(result.hasUnpublishedChanges)
      },
      onError: function onError() {
        setSaveState("error")
      },
    })
  )

  const publish = useMutation(
    trpc.siteContent.publish.mutationOptions({
      onSuccess: function onSuccess(result) {
        setHasUnpublishedChanges(result.hasUnpublishedChanges)
      },
    })
  )

  const saveDraftMutate = saveDraft.mutate
  const subscribeToForm = form.subscribe

  useEffect(
    function subscribeToFormChanges() {
      const unsubscribe = subscribeToForm({
        formState: { values: true },
        callback: function handleFormChange({ values }) {
          const parsed = siteContentSchema.safeParse(values)

          if (!parsed.success) {
            return
          }

          const content = parsed.data
          pendingContentRef.current = content

          if (previewTimerRef.current !== null) {
            window.clearTimeout(previewTimerRef.current)
          }

          previewTimerRef.current = window.setTimeout(function pushToPreview() {
            previewTimerRef.current = null

            postPreviewMessage(frameRef.current, {
              type: PREVIEW_CONTENT_MESSAGE,
              payload: content,
            })
          }, PREVIEW_CONTENT_DEBOUNCE_MS)

          if (saveTimerRef.current !== null) {
            window.clearTimeout(saveTimerRef.current)
          }

          saveTimerRef.current = window.setTimeout(function persistDraft() {
            saveTimerRef.current = null
            saveDraftMutate(content)
          }, DRAFT_SAVE_DEBOUNCE_MS)
        },
      })

      return function cleanUp() {
        unsubscribe()

        if (previewTimerRef.current !== null) {
          window.clearTimeout(previewTimerRef.current)
        }

        if (saveTimerRef.current !== null) {
          window.clearTimeout(saveTimerRef.current)
        }
      }
    },
    [subscribeToForm, frameRef, pendingContentRef, saveDraftMutate]
  )

  const { errors } = form.formState
  const theme = useWatch({ control: form.control, name: "theme" })

  function onSubmit(values: SiteContent) {
    saveDraftMutate(values)
  }

  function handleTaglineChange(document: RichTextDocument) {
    form.setValue("hero.tagline", document, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function handlePublish() {
    if (!window.confirm(SITE_CONTENT_PUBLISH_CONFIRMATION)) {
      return
    }

    publish.mutate()
  }

  return (
    <aside
      aria-label="Settings"
      data-selected-entry={selectedEntry}
      className="flex w-80 shrink-0 flex-col border-l"
    >
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Settings
        </p>
        <span
          data-save-state={saveState}
          className="text-xs text-muted-foreground"
        >
          {SAVE_STATE_LABELS[saveState]}
        </span>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="min-h-0 flex-1 overflow-y-auto p-4"
      >
        <div hidden={selectedEntry !== "hero"}>
          <FieldGroup>
            {HERO_TEXT_FIELDS.map(function renderTextField(textField) {
              return (
                <Field key={textField.key}>
                  <FieldLabel htmlFor={`hero-${textField.key}`}>
                    {textField.label}
                  </FieldLabel>
                  <Input
                    id={`hero-${textField.key}`}
                    autoComplete="off"
                    aria-invalid={
                      errors.hero?.[textField.key] ? true : undefined
                    }
                    {...form.register(`hero.${textField.key}`)}
                  />
                  <FieldError errors={[errors.hero?.[textField.key]]} />
                </Field>
              )
            })}

            <Field>
              <FieldLabel htmlFor="hero-tagline">Tagline</FieldLabel>
              <RichTextField
                id="hero-tagline"
                initialValue={initialContent.hero.tagline}
                onChange={handleTaglineChange}
              />
              <FieldError errors={[errors.hero?.tagline]} />
            </Field>
          </FieldGroup>
        </div>

        <div hidden={selectedEntry !== "theme"}>
          <FieldGroup>
            {THEME_COLOR_FIELDS.map(function renderColorField(colorField) {
              return (
                <ColorField
                  key={colorField.key}
                  id={`theme-${colorField.key}`}
                  label={colorField.label}
                  value={theme?.[colorField.key] ?? ""}
                  error={errors.theme?.[colorField.key]}
                  onChange={function handleColorChange(value) {
                    form.setValue(`theme.${colorField.key}`, value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                />
              )
            })}
          </FieldGroup>
        </div>

        {saveDraft.isError ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {SITE_CONTENT_SAVE_FAILED_MESSAGE}
          </p>
        ) : null}

        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>

      <div className="flex shrink-0 flex-col gap-2 border-t p-4">
        <p
          data-unpublished={hasUnpublishedChanges ? "true" : "false"}
          className="text-xs text-muted-foreground"
        >
          {hasUnpublishedChanges
            ? "You have unpublished changes."
            : "The live site is up to date."}
        </p>

        {publish.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {SITE_CONTENT_PUBLISH_FAILED_MESSAGE}
          </p>
        ) : null}

        <Button
          type="button"
          onClick={handlePublish}
          disabled={!hasUnpublishedChanges || publish.isPending}
        >
          {publish.isPending ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </aside>
  )
}
