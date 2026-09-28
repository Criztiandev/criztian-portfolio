"use client"

import { useSelector } from "@tanstack/react-store"

import { useEditorStoreContext } from "@/providers/editor-store.provider"
import type {
  EditorPreviewWidthId,
  EditorSaveState,
  EditorUiActions,
  SiteContentEntryId,
} from "@/types/site-content.type"

export function useEditorUiActions(): EditorUiActions {
  const { editorUi } = useEditorStoreContext()

  return editorUi.actions
}

export function useSelectedEntry(): SiteContentEntryId {
  const { editorUi } = useEditorStoreContext()

  return useSelector(editorUi, function selectEntry(state) {
    return state.selectedEntry
  })
}

export function usePreviewWidth(): EditorPreviewWidthId {
  const { editorUi } = useEditorStoreContext()

  return useSelector(editorUi, function selectWidth(state) {
    return state.previewWidth
  })
}

export function useSaveState(): EditorSaveState {
  const { editorUi } = useEditorStoreContext()

  return useSelector(editorUi, function selectSaveState(state) {
    return state.saveState
  })
}
