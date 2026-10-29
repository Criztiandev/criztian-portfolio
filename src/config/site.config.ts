function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return "http://localhost:3000"
}

export const siteConfig = {
  name: "Criztian",
  description: "Custom websites for small businesses.",
  url: resolveSiteUrl(),
  loginPath: "/login",
  afterLoginPath: "/dashboard",
  protectedPathPrefixes: ["/dashboard", "/editor", "/preview"],
} as const
