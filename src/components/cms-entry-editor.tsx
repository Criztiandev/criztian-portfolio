"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconInfoCircle } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react"
import type { ReactNode } from "react"
import { flushSync } from "react-dom"
import { Controller, useForm, useWatch } from "react-hook-form"
import type { Control, FieldErrors } from "react-hook-form"

import { CmsEntryCanvas } from "@/components/cms-entry-canvas"
import { CmsEntryField } from "@/components/cms-entry-field"
import { CmsPublishCheck } from "@/components/cms-publish-check"
import { CmsPublishStateLabel } from "@/components/cms-publish-state"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useSetCmsUnsaved } from "@/hooks/use-cms-unsaved"
import { useTRPC } from "@/lib/trpc/client"
import { buildCmsValuesSchema } from "@/model/cms.model"
import type {
  CmsCard,
  CmsChange,
  CmsEditorCollection,
  CmsEditorEntry,
  CmsField,
  CmsPublishTarget,
  CmsValues,
} from "@/type/cms.type"
import { cmsChanges, cmsInitialValues, findCmsField } from "@/util/cms.util"

function subscribeToNothing() {
  return function unsubscribe() {}
}

function readToday(): string | null {
  return format(new Date(), "yyyy-MM-dd")
}

function readNoDay(): string | null {
  return null
}

function CmsEntryTitle({
  control,
  name,
  fallback,
}: {
  control: Control<CmsValues>
  name: string
  fallback: string
}) {
  const title = useWatch({ control, name })
  if (typeof title === "string" && title.trim() !== "") {
    return title
  }
  return fallback
}

function firstCardName(cards: CmsCard[]): string {
  if (cards.length === 0) {
    return ""
  }
  return cards[0].name
}

function CmsEntryCard({
  card,
  hidden,
  children,
}: {
  card: CmsCard
  hidden: boolean
  children: ReactNode
}) {
  const headingId = useId()
  let description = null
  if (card.description !== undefined) {
    description = (
      <p className="text-sm text-muted-foreground">{card.description}</p>
    )
  }
  return (
    <section
      aria-labelledby={headingId}
      hidden={hidden}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="text-base font-semibold">
          {card.name}
        </h2>
        {description}
      </div>
      {children}
    </section>
  )
}

function CmsEntryForm({
  collection,
  entry,
  canvas,
  today,
}: {
  collection: CmsEditorCollection
  entry: CmsEditorEntry | null
  canvas: boolean
  today: string
}) {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()
  const setUnsaved = useSetCmsUnsaved()
  const [selected, setSelected] = useState(() =>
    firstCardName(collection.cards)
  )
  const [createdId, setCreatedId] = useState<number | null>(null)
  const [initialValues] = useState(() => {
    let stored: CmsValues | null = null
    if (entry !== null) {
      stored = entry.values
    }
    return cmsInitialValues(collection.fields, stored, today)
  })
  const [resolver] = useState(() =>
    zodResolver(buildCmsValuesSchema(collection.fields))
  )
  const form = useForm<CmsValues>({ resolver, defaultValues: initialValues })
  const dirty = form.formState.isDirty
  const [refreshing, startRefresh] = useTransition()

  function openCard(name: string) {
    flushSync(() => {
      setSelected(name)
    })
  }

  function selectFromCanvas(cardName: string | null, fieldName: string | null) {
    let config: CmsField | null = null
    if (fieldName !== null) {
      config = findCmsField(collection.fields, fieldName)
    }
    if (config !== null) {
      openCard(config.card)
      form.setFocus(config.name)
      return
    }
    for (const item of collection.cards) {
      if (item.name === cardName) {
        openCard(item.name)
      }
    }
  }

  function showSaved(values: CmsValues) {
    toast.add({ title: "Draft saved", type: "success" })
    form.reset(values)
  }

  function refreshPage() {
    startRefresh(() => {
      router.refresh()
    })
  }

  function refreshList() {
    return queryClient.invalidateQueries(
      trpc.cms.list.queryFilter({ collection: collection.slug })
    )
  }

  function showEntry(id: number) {
    if (entry === null) {
      router.replace(`/editor/${collection.slug}/${id}`)
    }
  }

  function refreshAfterPublish(id: number) {
    showEntry(id)
    if (entry !== null) {
      refreshPage()
    }
    return refreshList()
  }

  function showSaveError(error: {
    message: string
    data?: { code: string } | null
  }) {
    if (error.data?.code === "CONFLICT") {
      const slugField = findCmsField(collection.fields, "slug")
      if (slugField === null) {
        form.setError("root.server", {
          type: "server",
          message: `${collection.label} already exists. Reload the page to edit it.`,
        })
        return
      }
      openCard(slugField.card)
      form.setError(
        "slug",
        { type: "server", message: error.message },
        { shouldFocus: true }
      )
      return
    }
    form.setError("root.server", { type: "server", message: error.message })
  }

  const create = useMutation(
    trpc.cms.create.mutationOptions({
      onSuccess(created, variables) {
        setCreatedId(created.id)
        showSaved(variables.values)
        return refreshList()
      },
      onError: showSaveError,
    })
  )
  const save = useMutation(
    trpc.cms.saveDraft.mutationOptions({
      onSuccess(_saved, variables) {
        showSaved(variables.values)
        refreshPage()
        return refreshList()
      },
      onError: showSaveError,
    })
  )

  useEffect(() => {
    setUnsaved(dirty)
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    if (dirty) {
      window.addEventListener("beforeunload", warnBeforeUnload)
    }
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload)
      setUnsaved(false)
    }
  }, [dirty, setUnsaved])

  const saving = create.isPending || save.isPending
  let entryId = createdId
  if (entry !== null) {
    entryId = entry.id
  }

  async function saveValues(values: CmsValues): Promise<number | null> {
    try {
      if (entryId === null) {
        const created = await create.mutateAsync({
          collection: collection.slug,
          values,
        })
        return created.id
      }
      await save.mutateAsync({
        id: entryId,
        collection: collection.slug,
        values,
      })
      return entryId
    } catch {
      return null
    }
  }

  function openFailedCard(errors: FieldErrors<CmsValues>) {
    for (const item of collection.cards) {
      for (const config of collection.fields) {
        if (config.card === item.name && errors[config.name] !== undefined) {
          openCard(item.name)
          return
        }
      }
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (saving) {
      return
    }
    const id = await saveValues(values)
    if (id !== null) {
      showEntry(id)
    }
  }, openFailedCard)

  async function saveForPublish(): Promise<number | null> {
    const saved: { id: number | null } = { id: null }
    await form.handleSubmit(async (values) => {
      saved.id = await saveValues(values)
    }, openFailedCard)()
    return saved.id
  }

  async function readPublishTarget(
    id: number
  ): Promise<CmsPublishTarget | null> {
    let changes: CmsChange[] | null = null
    try {
      const fresh = await queryClient.fetchQuery(
        trpc.cms.get.queryOptions({ id }, { staleTime: 0 })
      )
      if (fresh !== null && fresh.draft !== null) {
        changes = cmsChanges(collection.fields, fresh.published, fresh.draft)
      }
    } catch {
      form.setError("root.server", {
        type: "server",
        message: "Could not load the changes. Press Publish again.",
      })
      return null
    }
    if (changes === null || changes.length === 0) {
      toast.add({
        title: "Nothing to publish",
        description: "The saved draft matches what is on the site.",
        type: "info",
      })
      return null
    }
    return { id, changes }
  }

  async function preparePublish(): Promise<CmsPublishTarget | null> {
    form.clearErrors("root.server")
    let id = entryId
    if (id === null || dirty) {
      id = await saveForPublish()
    }
    if (id === null) {
      return null
    }
    const target = await readPublishTarget(id)
    if (target === null) {
      showEntry(id)
    }
    return target
  }

  function contrastDeps(name: string): string[] {
    return collection.fields
      .filter((other) => other.contrast?.field === name)
      .map((other) => other.name)
  }

  function fieldsOf(card: CmsCard, hidden: boolean) {
    return collection.fields
      .filter((config) => config.card === card.name)
      .map((config) => (
        <Controller
          key={config.name}
          name={config.name}
          control={form.control}
          rules={{ deps: contrastDeps(config.name) }}
          render={({ field, fieldState }) => (
            <CmsEntryField
              ref={field.ref}
              config={config}
              value={field.value}
              error={fieldState.error}
              hidden={hidden}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ))
  }

  const noun = collection.singular.toLowerCase()
  let untitled = "Untitled"
  if (entry === null) {
    untitled = `New ${noun}`
  }
  let heading: ReactNode = collection.label
  if (collection.titleField !== undefined) {
    heading = (
      <CmsEntryTitle
        control={form.control}
        name={collection.titleField}
        fallback={untitled}
      />
    )
  }
  let chip = null
  if (entry !== null) {
    chip = <CmsPublishStateLabel state={entry.state} />
  }
  let saveLabel = "Save draft"
  if (saving) {
    saveLabel = "Saving..."
  }
  let published = false
  if (entry !== null && entry.state === "published") {
    published = true
  }

  return (
    <CmsEntryCanvas
      collection={collection}
      canvas={canvas}
      control={form.control}
      card={selected}
      onCard={setSelected}
      onSelect={selectFromCanvas}
      onSubmit={onSubmit}
      heading={heading}
      chip={chip}
      actions={
        <>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="gap-2 px-4 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            disabled={saving || create.isSuccess}
            focusableWhenDisabled
          >
            {saveLabel}
          </Button>
          <CmsPublishCheck
            noun={noun}
            disabled={saving || refreshing || (published && !dirty)}
            onCheck={preparePublish}
            onClosed={showEntry}
            onPublished={refreshAfterPublish}
          />
        </>
      }
      error={
        <FieldError
          className="border-b p-4"
          errors={[form.formState.errors.root?.server]}
        />
      }
    >
      {collection.cards.map((item) => (
        <CmsEntryCard
          key={item.name}
          card={item}
          hidden={item.name !== selected}
        >
          {fieldsOf(item, item.name !== selected)}
        </CmsEntryCard>
      ))}
      <p className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
        <IconInfoCircle aria-hidden className="size-4 shrink-0" />
        <span>Changes stay in this draft until you publish.</span>
      </p>
    </CmsEntryCanvas>
  )
}

export function CmsEntryEditor({
  collection,
  entry,
  canvas,
}: {
  collection: CmsEditorCollection
  entry: CmsEditorEntry | null
  canvas: boolean
}) {
  const today = useSyncExternalStore(subscribeToNothing, readToday, readNoDay)
  if (today === null) {
    return (
      <p role="status" className="p-4 text-sm text-muted-foreground">
        Loading...
      </p>
    )
  }
  return (
    <CmsEntryForm
      collection={collection}
      entry={entry}
      canvas={canvas}
      today={today}
    />
  )
}
