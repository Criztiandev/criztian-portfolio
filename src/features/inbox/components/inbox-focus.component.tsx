"use client"

import { useEffect, useRef } from "react"

import {
  INBOX_LIST_HEADING_ID,
  INBOX_LIST_ID,
  INBOX_MESSAGE_HEADING_ID,
} from "@/data/inbox.data"

function focusFirstOlderRow(previousShown: number): void {
  const firstOlderLink = document.querySelector<HTMLElement>(
    `#${INBOX_LIST_ID} > li:nth-child(${previousShown + 1}) a`
  )

  if (firstOlderLink !== null) {
    firstOlderLink.focus()
    return
  }

  document.getElementById(INBOX_LIST_HEADING_ID)?.focus()
}

export function InboxFocus({
  messageId,
  shown,
}: Readonly<{ messageId: number | null; shown: number }>) {
  const previousMessageIdRef = useRef(messageId)
  const previousShownRef = useRef(shown)

  useEffect(
    function moveFocusWithTheOpenMessage() {
      const previousMessageId = previousMessageIdRef.current
      previousMessageIdRef.current = messageId

      if (previousMessageId === messageId) {
        return
      }

      const targetId =
        messageId === null ? INBOX_LIST_HEADING_ID : INBOX_MESSAGE_HEADING_ID

      document.getElementById(targetId)?.focus()
    },
    [messageId]
  )

  useEffect(
    function keepFocusWhenOlderMessagesLoad() {
      const previousShown = previousShownRef.current
      previousShownRef.current = shown

      if (shown <= previousShown) {
        return
      }

      if (document.activeElement !== document.body) {
        return
      }

      focusFirstOlderRow(previousShown)
    },
    [shown]
  )

  return null
}
