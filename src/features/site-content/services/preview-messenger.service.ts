import type { PreviewMessage } from "@/types/site-content.type"

export function postPreviewMessage(
  frame: HTMLIFrameElement | null,
  message: PreviewMessage
): void {
  if (frame === null) {
    return
  }

  const target = frame.contentWindow

  if (target === null) {
    return
  }

  target.postMessage(message, window.location.origin)
}
