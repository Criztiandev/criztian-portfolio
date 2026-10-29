import {
  IconChevronLeft,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
} from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import type { KeyboardEvent, ReactNode, SubmitEventHandler } from "react"

import { useWatch } from "react-hook-form"
import type { Control } from "react-hook-form"

import { buttonVariants } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { cmsCollections } from "@/config/cms.config"
import { useCmsGuardNavigation } from "@/hooks/use-cms-unsaved"
import { cn } from "@/lib/utils"
import { cmsCanvasMessageSchema } from "@/model/cms.model"
import type {
  CmsCanvasMessage,
  CmsCanvasSize,
  CmsCanvasWidth,
  CmsCard,
  CmsCollection,
  CmsEditorCollection,
  CmsValues,
} from "@/type/cms.type"

const loadingLimit = 10_000
const typingPause = 250

const widths: CmsCanvasWidth[] = [
  { label: "Desktop", width: 1280, icon: IconDeviceDesktop },
  { label: "Tablet", width: 768, icon: IconDeviceTablet },
  { label: "Phone", width: 390, icon: IconDeviceMobile },
]

const rowClass =
  "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden [&_svg]:size-4 [&_svg]:shrink-0"
const noteClass =
  "rounded-md bg-background px-3 py-2 text-sm text-muted-foreground"
const lineStep = 80

function keepValues(values: CmsValues) {
  return values
}

function postToFrame(
  frame: HTMLIFrameElement | null,
  message: CmsCanvasMessage
) {
  if (frame === null || frame.contentWindow === null) {
    return
  }
  frame.contentWindow.postMessage(message, window.location.origin)
}

function CmsCanvasStage({
  slug,
  control,
  card,
  device,
  pause,
  onSelect,
}: {
  slug: string
  control: Control<CmsValues>
  card: string
  device: number
  pause: number
  onSelect: (card: string | null, field: string | null) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const served = useRef(0)
  const hintId = useId()
  const [size, setSize] = useState<CmsCanvasSize | null>(null)
  const [ready, setReady] = useState(0)
  const [late, setLate] = useState(false)
  const [blank, setBlank] = useState(false)
  const values = useWatch({ control, compute: keepValues })

  useEffect(() => {
    const element = box.current
    if (element === null) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    function receive(event: MessageEvent) {
      const target = frame.current
      if (
        target === null ||
        event.origin !== window.location.origin ||
        event.source !== target.contentWindow
      ) {
        return
      }
      const parsed = cmsCanvasMessageSchema.safeParse(event.data)
      if (!parsed.success) {
        return
      }
      if (parsed.data.type === "ready") {
        setReady((count) => count + 1)
      }
      if (parsed.data.type === "select") {
        onSelect(parsed.data.card, parsed.data.field)
      }
      if (parsed.data.type === "blank") {
        setBlank(parsed.data.blank)
      }
    }
    window.addEventListener("message", receive)
    return () => {
      window.removeEventListener("message", receive)
    }
  }, [onSelect])

  useEffect(() => {
    if (ready > 0) {
      return
    }
    const timer = window.setTimeout(() => {
      setLate(true)
    }, loadingLimit)
    return () => {
      window.clearTimeout(timer)
    }
  }, [ready])

  useEffect(() => {
    if (ready === 0) {
      return
    }
    if (pause === 0 || served.current !== ready) {
      served.current = ready
      postToFrame(frame.current, { type: "values", values })
      return
    }
    const timer = window.setTimeout(() => {
      postToFrame(frame.current, { type: "values", values })
    }, pause)
    return () => {
      window.clearTimeout(timer)
    }
  }, [ready, values, pause])

  useEffect(() => {
    if (ready > 0) {
      postToFrame(frame.current, { type: "card", card })
    }
  }, [ready, card])

  function scrollPage(event: KeyboardEvent<HTMLDivElement>) {
    const target = frame.current
    if (target === null || target.contentWindow === null) {
      return
    }
    const page = target.contentWindow
    switch (event.key) {
      case "ArrowDown":
        page.scrollBy({ top: lineStep })
        break
      case "ArrowUp":
        page.scrollBy({ top: -lineStep })
        break
      case "PageDown":
        page.scrollBy({ top: page.innerHeight - lineStep })
        break
      case "PageUp":
        page.scrollBy({ top: lineStep - page.innerHeight })
        break
      case "Home":
        page.scrollTo({ top: 0 })
        break
      case "End":
        page.scrollTo({ top: page.document.documentElement.scrollHeight })
        break
      default:
        return
    }
    event.preventDefault()
  }

  let note = null
  let frameClass = "block bg-background"
  if (ready > 0 && blank) {
    note = (
      <p role="status" className={noteClass}>
        This cannot be previewed yet. Save draft to see what needs fixing.
      </p>
    )
  }
  if (ready === 0) {
    frameClass = "pointer-events-none block bg-background"
    note = (
      <p role="status" className={noteClass}>
        Loading preview...
      </p>
    )
    if (late) {
      note = (
        <p
          role="alert"
          className="rounded-md bg-background px-3 py-2 text-sm text-destructive"
        >
          The preview could not load. Save your draft, then reload the page.
        </p>
      )
    }
  }
  let page = null
  if (size !== null && size.width > 0) {
    const scale = Math.min(1, size.width / device)
    page = (
      <div
        className="mx-auto overflow-hidden rounded-lg bg-background ring-1 ring-foreground/10"
        style={{ width: device * scale, height: size.height }}
      >
        <iframe
          ref={frame}
          src={`/preview/${slug}/canvas`}
          title="Page preview"
          aria-hidden
          tabIndex={-1}
          className={frameClass}
          style={{
            width: device,
            height: size.height / scale,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label="Page preview"
      aria-describedby={hintId}
      tabIndex={0}
      className="relative min-h-0 min-w-0 bg-muted p-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden focus-visible:ring-inset"
      onKeyDown={scrollPage}
    >
      <p id={hintId} className="sr-only">
        The preview is visual only. The arrow keys, Page Up, Page Down, Home and
        End scroll it.
      </p>
      <div ref={box} className="size-full">
        {page}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center">
        {note}
      </div>
    </div>
  )
}

function CmsCanvasSectionRow({
  card,
  selected,
  onCard,
}: {
  card: CmsCard
  selected: boolean
  onCard: (card: string) => void
}) {
  let current: "true" | undefined
  if (selected) {
    current = "true"
  }
  return (
    <li>
      <button
        type="button"
        aria-current={current}
        className={cn(
          rowClass,
          "text-muted-foreground hover:text-foreground aria-[current=true]:bg-muted aria-[current=true]:font-medium aria-[current=true]:text-foreground"
        )}
        onClick={() => {
          onCard(card.name)
        }}
      >
        <span className="truncate">{card.name}</span>
      </button>
    </li>
  )
}

function CmsCanvasPageRow({
  page,
  open,
  children,
}: {
  page: CmsCollection
  open: boolean
  children: ReactNode
}) {
  const guardNavigation = useCmsGuardNavigation()
  let current: "page" | undefined
  let sections = null
  if (open) {
    current = "page"
    sections = (
      <ul className="ml-4 flex flex-col gap-1 border-l pl-2">{children}</ul>
    )
  }
  return (
    <li className="flex flex-col gap-1">
      <Link
        href={`/editor/${page.slug}`}
        aria-current={current}
        onNavigate={guardNavigation}
        className={cn(rowClass, "aria-[current=page]:font-medium")}
      >
        <page.icon aria-hidden />
        <span className="truncate">{page.label}</span>
      </Link>
      {sections}
    </li>
  )
}

export function CmsEntryCanvas({
  collection,
  canvas,
  control,
  card,
  onCard,
  onSelect,
  onSubmit,
  heading,
  chip,
  actions,
  error,
  children,
}: {
  collection: CmsEditorCollection
  canvas: boolean
  control: Control<CmsValues>
  card: string
  onCard: (card: string) => void
  onSelect: (card: string | null, field: string | null) => void
  onSubmit: SubmitEventHandler<HTMLFormElement>
  heading: ReactNode
  chip: ReactNode
  actions: ReactNode
  error: ReactNode
  children: ReactNode
}) {
  const guardNavigation = useCmsGuardNavigation()
  const [device, setDevice] = useState(widths[0].width)
  let backHref = `/dashboard/${collection.slug}`
  let backLabel = collection.label
  if (collection.single === true) {
    backHref = "/dashboard"
    backLabel = "Dashboard"
  }
  const pages = cmsCollections.filter(
    (page) => page.single === true || page.slug === collection.slug
  )
  let pause = 0
  for (const field of collection.fields) {
    if (field.type === "richtext") {
      pause = typingPause
    }
  }
  let widthGroup = null
  let stage = (
    <div className="flex min-h-0 min-w-0 items-center justify-center bg-muted p-8 text-center">
      <p className="text-sm">This collection has no page view yet.</p>
    </div>
  )
  if (canvas) {
    widthGroup = (
      <div
        role="group"
        aria-label="Preview width"
        className="flex shrink-0 items-center gap-1"
      >
        {widths.map((item) => (
          <Toggle
            key={item.label}
            aria-label={item.label}
            title={item.label}
            className="aria-pressed:bg-foreground aria-pressed:text-background"
            pressed={device === item.width}
            onPressedChange={() => {
              setDevice(item.width)
            }}
          >
            <item.icon aria-hidden />
          </Toggle>
        ))}
      </div>
    )
    stage = (
      <CmsCanvasStage
        slug={collection.slug}
        control={control}
        card={card}
        device={device}
        pause={pause}
        onSelect={onSelect}
      />
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid h-full min-w-256 grid-cols-[14rem_minmax(0,1fr)_26rem] grid-rows-[auto_minmax(0,1fr)]"
    >
      <div className="col-span-3 flex h-14 items-center gap-4 border-b px-3">
        <Link
          href={backHref}
          onNavigate={guardNavigation}
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "gap-2 px-3"
          )}
        >
          <IconChevronLeft aria-hidden />
          <span>
            <span className="sr-only">Back to </span>
            {backLabel}
          </span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h1 className="truncate text-base font-semibold">{heading}</h1>
          {chip}
        </div>
        {widthGroup}
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
      <nav
        aria-label="Pages"
        className="min-h-0 overflow-y-auto border-r bg-sidebar p-3 text-sidebar-foreground"
      >
        <ul className="flex flex-col gap-1">
          {pages.map((page) => (
            <CmsCanvasPageRow
              key={page.slug}
              page={page}
              open={page.slug === collection.slug}
            >
              {collection.cards.map((item) => (
                <CmsCanvasSectionRow
                  key={item.name}
                  card={item}
                  selected={item.name === card}
                  onCard={onCard}
                />
              ))}
            </CmsCanvasPageRow>
          ))}
        </ul>
      </nav>
      {stage}
      <div className="flex min-h-0 flex-col border-l">
        {error}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </form>
  )
}
