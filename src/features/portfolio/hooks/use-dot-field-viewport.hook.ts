"use client"

import { useSyncExternalStore } from "react"

import {
  matchesDotFieldViewport,
  readDotFieldViewportQuery,
} from "@/features/portfolio/browser-capability.rules"

function subscribeToDotFieldViewport(onChange: () => void): () => void {
  const query = readDotFieldViewportQuery()

  if (query === null) {
    return function unsubscribeNothing() {
      return
    }
  }

  query.addEventListener("change", onChange)

  return function unsubscribe() {
    query.removeEventListener("change", onChange)
  }
}

function readUnknownViewport(): boolean | null {
  return null
}

export function useDotFieldViewport(): boolean | null {
  return useSyncExternalStore(
    subscribeToDotFieldViewport,
    matchesDotFieldViewport,
    readUnknownViewport
  )
}
