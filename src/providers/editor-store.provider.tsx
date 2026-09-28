"use client"

import { createStoreContext } from "@tanstack/react-store"
import { useState } from "react"

import { createEditorUiStore } from "@/features/site-content/stores/editor-ui.store"
import type { EditorUiStore } from "@/types/site-content.type"

type EditorStoreContextValue = {
  editorUi: EditorUiStore
}

const { StoreProvider, useStoreContext } =
  createStoreContext<EditorStoreContextValue>()

export function EditorStoreProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [editorUi] = useState(createEditorUiStore)

  return <StoreProvider value={{ editorUi }}>{children}</StoreProvider>
}

export { useStoreContext as useEditorStoreContext }
