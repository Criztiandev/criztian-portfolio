import type { PortfolioNavigationItem } from "@/types/portfolio.type"

export const PORTFOLIO_BRAND_LABEL = "Criztian"

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
