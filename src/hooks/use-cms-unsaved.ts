import { atom, useAtomValue, useSetAtom } from "jotai"

const cmsUnsavedAtom = atom(false)

export function useSetCmsUnsaved() {
  return useSetAtom(cmsUnsavedAtom)
}

export function useCmsGuardNavigation() {
  const unsaved = useAtomValue(cmsUnsavedAtom)
  return function guardNavigation(event: { preventDefault: () => void }) {
    if (!unsaved) {
      return
    }
    if (!window.confirm("You have unsaved changes. Leave without saving?")) {
      event.preventDefault()
    }
  }
}
