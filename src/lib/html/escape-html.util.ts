const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

export function escapeHtml(value: string): string {
  let escaped = ""

  for (const character of value) {
    const replacement = HTML_ESCAPES[character]

    if (replacement === undefined) {
      escaped += character
      continue
    }

    escaped += replacement
  }

  return escaped
}
