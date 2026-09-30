import type { PortfolioNavigationItem } from "@/types/portfolio.type"

export const PORTFOLIO_BRAND_LABEL = "Criztian"

export const SCROLL_SPY_TOLERANCE_PX = 1

export const SOLID_AFTER_SCROLL_PX = 120

export const MOBILE_PANEL_ID = "portfolio-mobile-nav"

export const PRIMARY_NAVIGATION_LABEL = "Primary"

export const SECONDARY_NAVIGATION_LABEL = "Secondary"

export const MOBILE_PANEL_LABEL = "Sections"

export const OPEN_MENU_LABEL = "Open menu"

export const CLOSE_MENU_LABEL = "Close menu"

export const BRAND_MARK = "©"

export const PAUSE_MOTION_LABEL = "Pause motion"

export const PLAY_MOTION_LABEL = "Play motion"

export const HEADER_ACTIONS_CLASS =
  "flex items-center gap-2 justify-self-end lg:gap-3"

export const HEADER_ICON_BUTTON_CLASS =
  "size-8 focus-visible:outline-hidden lg:size-10"

export const PANEL_CURRENT_LINK_CLASS =
  "decoration-1 underline-offset-[6px] aria-[current=true]:underline"

export const MOTION_TOGGLE_CLASS =
  "[@media(prefers-reduced-motion:reduce)]:hidden [@media(scripting:none)]:hidden"

export const NAV_DOT_CLASS =
  "pointer-events-none absolute top-full left-1/2 mt-0.5 -ml-0.75 size-1.5 rounded-full bg-foreground forced-colors:bg-[CanvasText]"

export const SCROLL_PROGRESS_HAIRLINE_CLASS =
  "pointer-events-none absolute inset-x-0 -bottom-px z-10 hidden h-px origin-left bg-foreground/40 supports-[animation-timeline:scroll()]:block scroll-progress"

const HOME_ITEM: PortfolioNavigationItem = {
  id: "home",
  label: "Home",
  href: "#home",
}

const SERVICES_ITEM: PortfolioNavigationItem = {
  id: "services",
  label: "Services",
  href: "#services",
}

const ABOUT_ITEM: PortfolioNavigationItem = {
  id: "about",
  label: "About",
  href: "#about",
}

const WORK_ITEM: PortfolioNavigationItem = {
  id: "project",
  label: "Work",
  href: "#project",
}

const PROCESS_ITEM: PortfolioNavigationItem = {
  id: "process",
  label: "Process",
  href: "#process",
}

const TESTIMONIALS_ITEM: PortfolioNavigationItem = {
  id: "testimonials",
  label: "Testimonials",
  href: "#testimonials",
}

const FAQ_ITEM: PortfolioNavigationItem = {
  id: "faq",
  label: "FAQ",
  href: "#faq",
}

const CONTACT_ITEM: PortfolioNavigationItem = {
  id: "contact",
  label: "Contact",
  href: "#contact",
}

export const PORTFOLIO_HOME_NAVIGATION = HOME_ITEM

export const PORTFOLIO_PRIMARY_NAVIGATION: PortfolioNavigationItem[] = [
  WORK_ITEM,
  SERVICES_ITEM,
  PROCESS_ITEM,
  ABOUT_ITEM,
  FAQ_ITEM,
]

export const PORTFOLIO_ACTION_NAVIGATION: PortfolioNavigationItem = {
  id: "contact",
  label: "Let's talk",
  href: "#contact",
}

export const PORTFOLIO_NAVIGATION: PortfolioNavigationItem[] = [
  HOME_ITEM,
  WORK_ITEM,
  SERVICES_ITEM,
  PROCESS_ITEM,
  ABOUT_ITEM,
  TESTIMONIALS_ITEM,
  FAQ_ITEM,
  CONTACT_ITEM,
]
