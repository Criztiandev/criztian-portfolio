import type { PortfolioNavigationItem } from "@/types/portfolio.type"

export const PORTFOLIO_BRAND_LABEL = "Criztian"

const HOME_ITEM: PortfolioNavigationItem = {
  id: "home",
  label: "Home",
  href: "#home",
}

const PROJECT_ITEM: PortfolioNavigationItem = {
  id: "project",
  label: "Project",
  href: "#project",
}

const ABOUT_ITEM: PortfolioNavigationItem = {
  id: "about",
  label: "About",
  href: "#about",
}

const SERVICES_ITEM: PortfolioNavigationItem = {
  id: "services",
  label: "Services",
  href: "#services",
}

const BLOG_ITEM: PortfolioNavigationItem = {
  id: "blog",
  label: "Blog",
  href: "#blog",
}

const CONTACT_ITEM: PortfolioNavigationItem = {
  id: "contact",
  label: "Contact",
  href: "#contact",
}

export const PORTFOLIO_HOME_NAVIGATION = HOME_ITEM

export const PORTFOLIO_PRIMARY_NAVIGATION: PortfolioNavigationItem[] = [
  PROJECT_ITEM,
  BLOG_ITEM,
  ABOUT_ITEM,
  CONTACT_ITEM,
]

export const PORTFOLIO_ACTION_NAVIGATION: PortfolioNavigationItem = {
  id: "contact",
  label: "Let's talk",
  href: "#contact",
}

export const PORTFOLIO_NAVIGATION: PortfolioNavigationItem[] = [
  HOME_ITEM,
  PROJECT_ITEM,
  ABOUT_ITEM,
  SERVICES_ITEM,
  BLOG_ITEM,
  CONTACT_ITEM,
]
