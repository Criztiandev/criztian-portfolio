import { createStore } from "@tanstack/react-store"

import { INITIAL_EDITOR_UI_STATE } from "@/data/site-content.data"
import type {
  EditorPreviewWidthId,
  EditorSaveState,
  EditorUiState,
  EditorUiStore,
  SiteContentEntryId,
} from "@/types/site-content.type"

export function createEditorUiStore(
  initialState: EditorUiState = INITIAL_EDITOR_UI_STATE
): EditorUiStore {
  return createStore(initialState, ({ setState }) => {
    function selectEntry(entry: SiteContentEntryId) {
      setState(function select(state) {
        return { ...state, selectedEntry: entry }
      })
    }

    function selectPreviewWidth(previewWidth: EditorPreviewWidthId) {
      setState(function select(state) {
        return { ...state, previewWidth }
      })
    }

    function setSaveState(saveState: EditorSaveState) {
      setState(function apply(state) {
        return { ...state, saveState }
      })
    }

    return {
      selectEntry,
      selectPreviewWidth,
      setSaveState,
    }
  })
}
