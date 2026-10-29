import { atom, useAtom } from "jotai"

const mobileNavOpenAtom = atom(false)

export function useMobileNav() {
  return useAtom(mobileNavOpenAtom)
}
