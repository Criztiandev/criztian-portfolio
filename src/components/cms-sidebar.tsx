"use client"

import { IconEdit, IconExternalLink } from "@tabler/icons-react"
import type { TablerIcon } from "@tabler/icons-react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { LogoutButton } from "@/components/logout-button"
import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { cn } from "@/lib/utils"

const navItemClass =
  "flex h-8 items-center gap-2 rounded-md px-2 text-sm hover:bg-muted focus-visible:ring-3 focus-visible:outline-hidden focus-visible:ring-ring/50 aria-[current=page]:bg-muted aria-[current=page]:font-medium [&_svg]:size-4 [&_svg]:shrink-0"
const groupClass = "flex flex-col gap-1"
const groupLabelClass = "px-2 py-1 text-xs text-muted-foreground"
const identityClass = "flex items-center gap-2 p-2"
const initialClass =
  "flex size-8 shrink-0 items-center justify-center text-sm font-medium"

function CmsNavItem({
  segment,
  label,
  icon: Icon,
}: {
  segment: string
  label: string
  icon: TablerIcon
}) {
  const selected = useSelectedLayoutSegment()
  let current: "page" | undefined
  if (selected === segment) {
    current = "page"
  }
  return (
    <li>
      <Link
        href={`/dashboard/${segment}`}
        aria-current={current}
        className={navItemClass}
      >
        <Icon aria-hidden />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  )
}

export function CmsSidebar({ userEmail }: { userEmail: string }) {
  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col justify-between gap-6 overflow-y-auto border-r bg-sidebar p-3 text-sidebar-foreground">
      <div className="flex flex-col gap-6">
        <div className={identityClass}>
          <span
            aria-hidden
            className={cn(
              initialClass,
              "rounded-md bg-primary text-primary-foreground"
            )}
          >
            {siteConfig.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">Website</p>
          </div>
        </div>
        <nav aria-label="Dashboard" className="flex flex-col gap-6">
          <div className={groupClass}>
            <p id="cms-nav-pages" className={groupLabelClass}>
              Pages
            </p>
            <ul aria-labelledby="cms-nav-pages" className={groupClass}>
              <li>
                <Link href="/editor" className={navItemClass}>
                  <IconEdit aria-hidden />
                  <span className="truncate">Editor</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className={groupClass}>
            <p id="cms-nav-content" className={groupLabelClass}>
              Content
            </p>
            <ul aria-labelledby="cms-nav-content" className={groupClass}>
              {cmsCollections
                .filter((collection) => collection.single !== true)
                .map((collection) => (
                  <CmsNavItem
                    key={collection.slug}
                    segment={collection.slug}
                    label={collection.label}
                    icon={collection.icon}
                  />
                ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/" target="_blank" className={navItemClass}>
          <IconExternalLink aria-hidden />
          <span className="truncate">
            View site<span className="sr-only"> (opens in a new tab)</span>
          </span>
        </Link>
        <LogoutButton />
        <div className={identityClass}>
          <span
            aria-hidden
            className={cn(initialClass, "rounded-full bg-muted")}
          >
            {userEmail.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={userEmail}>
              {userEmail}
            </p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
