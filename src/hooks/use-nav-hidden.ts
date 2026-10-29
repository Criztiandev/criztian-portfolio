import { useEffect, useState } from "react"

const SHOW_NEAR_TOP_PX = 80

export function useNavHidden() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    function handleScroll() {
      const scrollY = window.scrollY
      if (scrollY <= SHOW_NEAR_TOP_PX) {
        setHidden(false)
      } else if (scrollY > lastScrollY) {
        setHidden(true)
      } else if (scrollY < lastScrollY) {
        setHidden(false)
      }
      lastScrollY = scrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return hidden
}
