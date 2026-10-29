"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { cmsCanvasViews } from "@/config/cms-canvas.config"
import { cmsCanvasMessageSchema } from "@/model/cms.model"
import type {
  CmsCanvasMessage,
  CmsSiteValues,
  CmsValues,
} from "@/type/cms.type"

function postToEditor(message: CmsCanvasMessage) {
  window.parent.postMessage(message, window.location.origin)
}

function readAttribute(target: Element, name: string): string | null {
  const marked = target.closest(`[${name}]`)
  if (marked === null) {
    return null
  }
  return marked.getAttribute(name)
}

function scrollToCard(card: string) {
  for (const section of document.querySelectorAll("[data-cms-card]")) {
    if (section.getAttribute("data-cms-card") === card) {
      section.scrollIntoView({ block: "nearest" })
      return
    }
  }
}

function cardSelector(card: string): string {
  return `[data-cms-card="${CSS.escape(card)}"]`
}

function outlineCss(card: string | null, cards: string[]): string {
  if (cards.length === 0) {
    return ""
  }
  const own = cards.map(cardSelector)
  const hovered = own.map((selector) => `${selector}:hover`)
  const css = `${own.join(",")}{cursor:pointer}${hovered.join(",")}{outline:1px dashed var(--info);outline-offset:4px}`
  if (card === null || !cards.includes(card)) {
    return css
  }
  const active = cardSelector(card)
  return `${css}${active},${active}:hover{outline:2px solid var(--info);outline-offset:4px}`
}

export function CmsCanvasFrame({
  collection,
  cards,
  site,
}: {
  collection: string
  cards: string[]
  site: CmsSiteValues
}) {
  const [values, setValues] = useState<CmsValues | null>(null)
  const [card, setCard] = useState<string | null>(null)
  const clickedCard = useRef<string | null>(null)
  const scrollTarget = useRef<string | null>(null)
  const drawn = values !== null
  const view = cmsCanvasViews.get(collection)
  let page: ReactNode = null
  if (values !== null && view !== undefined) {
    page = view(values, site)
  }
  const blank = drawn && page === null

  useEffect(() => {
    function block(event: Event) {
      event.preventDefault()
      event.stopPropagation()
    }

    function select(event: MouseEvent) {
      block(event)
      if (!(event.target instanceof Element)) {
        return
      }
      const clicked = readAttribute(event.target, "data-cms-card")
      const field = readAttribute(event.target, "data-cms-field")
      if (clicked === null && field === null) {
        return
      }
      clickedCard.current = clicked
      postToEditor({ type: "select", card: clicked, field })
    }

    function receive(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent
      ) {
        return
      }
      const parsed = cmsCanvasMessageSchema.safeParse(event.data)
      if (!parsed.success) {
        return
      }
      const message = parsed.data
      if (message.type === "values") {
        setValues(message.values)
      }
      if (message.type === "card") {
        scrollTarget.current = message.card
        if (clickedCard.current === message.card) {
          scrollTarget.current = null
        }
        clickedCard.current = null
        setCard(message.card)
      }
    }

    window.addEventListener("mousedown", block, true)
    window.addEventListener("click", select, true)
    window.addEventListener("auxclick", block, true)
    window.addEventListener("submit", block, true)
    window.addEventListener("message", receive)
    postToEditor({ type: "ready" })
    return () => {
      window.removeEventListener("mousedown", block, true)
      window.removeEventListener("click", select, true)
      window.removeEventListener("auxclick", block, true)
      window.removeEventListener("submit", block, true)
      window.removeEventListener("message", receive)
    }
  }, [])

  useEffect(() => {
    if (drawn && scrollTarget.current !== null) {
      scrollToCard(scrollTarget.current)
      scrollTarget.current = null
    }
  }, [card, drawn])

  useEffect(() => {
    postToEditor({ type: "blank", blank })
  }, [blank])

  if (page === null) {
    return null
  }
  return (
    <>
      <style>{outlineCss(card, cards)}</style>
      {page}
    </>
  )
}
