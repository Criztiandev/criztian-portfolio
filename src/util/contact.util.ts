export function contactReplyHref(email: string): string {
  return `mailto:${encodeURIComponent(email).replace("%40", "@")}`
}
