"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useEffect, useRef, useState } from "react"

import { IconArrowUpRight, IconClose } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { BOOKING } from "@/data/booking.data"
import { BOOK_CALL } from "@/data/nav-links.data"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/type/booking.type"

function isPlainClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) {
    return false
  }
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false
  }
  return true
}

function isReadyMessage(event: MessageEvent<unknown>) {
  if (event.origin !== BOOKING.embedOrigin) {
    return false
  }
  const data = event.data
  if (typeof data !== "object" || data === null || !("type" in data)) {
    return false
  }
  return data.type === BOOKING.readyMessage
}

export function BookingDialog() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<BookingStatus>("loading")
  const linkRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!isPlainClick(event) || !(event.target instanceof Element)) {
        return
      }
      const link = event.target.closest(`a[href="${BOOK_CALL.href}"]`)
      if (!(link instanceof HTMLElement)) {
        return
      }
      event.preventDefault()
      linkRef.current = link
      setStatus("loading")
      setOpen(true)
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    function handleMessage(event: MessageEvent<unknown>) {
      if (isReadyMessage(event)) {
        setStatus("ready")
      }
    }

    function failIfStillLoading(current: BookingStatus): BookingStatus {
      if (current === "loading") {
        return "error"
      }
      return current
    }

    window.addEventListener("message", handleMessage)
    const timer = window.setTimeout(() => {
      setStatus(failIfStillLoading)
    }, BOOKING.timeoutMs)
    return () => {
      window.removeEventListener("message", handleMessage)
      window.clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 supports-backdrop-filter:backdrop-blur-none motion-reduce:animate-none" />
        <DialogPrimitive.Popup
          finalFocus={linkRef}
          className="fixed inset-0 z-50 flex flex-col bg-graphite shadow-overlay outline-none md:inset-x-0 md:inset-y-10 md:m-auto md:max-h-200 md:w-180"
        >
          <div className="flex items-center justify-between border-b border-black px-4 py-6 md:pr-6 md:pl-10">
            <DialogPrimitive.Title className="font-heading text-heading-h2 text-paper">
              {BOOKING.title}
            </DialogPrimitive.Title>
            <DialogClose
              render={
                <Button variant="ghost" size="icon-large" aria-label="Close" />
              }
            >
              <IconClose />
            </DialogClose>
          </div>
          <div className="relative flex-1">
            {status !== "error" && (
              <iframe
                src={BOOKING.embedUrl}
                title={BOOKING.frameTitle}
                className="block size-full border-0"
              />
            )}
            <div aria-live="polite">
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-graphite px-4 py-10 md:p-10">
                  <p className="text-body-base text-smoke">{BOOKING.loading}</p>
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 flex flex-col justify-center gap-6 px-4 py-10 md:p-10">
                  <h3 className="font-heading text-heading-h2 text-paper">
                    {BOOKING.errorHeading}
                  </h3>
                  <p className="text-body-base text-paper md:max-w-130">
                    {BOOKING.errorText}
                  </p>
                  <a
                    href={BOOKING.errorLink.href}
                    className={cn(
                      buttonVariants({ variant: "link", size: "link" }),
                      "self-start"
                    )}
                  >
                    {BOOKING.errorLink.label}
                    <IconArrowUpRight />
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
