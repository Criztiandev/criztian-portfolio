import type { PortfolioNavigationItem } from "@/types/portfolio.type"

export const PORTFOLIO_LEADING_NAVIGATION: PortfolioNavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "#home",
    placement: "leading",
  },
  {
    id: "project",
    label: "Project",
    href: "#project",
    placement: "leading",
  },
  {
    id: "about",
    label: "About",
    href: "#about",
    placement: "leading",
  },
]

export const PORTFOLIO_TRAILING_NAVIGATION: PortfolioNavigationItem[] = [
  {
    id: "services",
    label: "Services",
    href: "#services",
    placement: "trailing",
  },
  {
    id: "blog",
    label: "Blog",
    href: "#blog",
    placement: "trailing",
  },
]

export const PORTFOLIO_ACTION_NAVIGATION: PortfolioNavigationItem = {
  id: "contact",
  label: "Contact",
  href: "#contact",
  placement: "action",
}

export const PORTFOLIO_NAVIGATION: PortfolioNavigationItem[] = [
  ...PORTFOLIO_LEADING_NAVIGATION,
  ...PORTFOLIO_TRAILING_NAVIGATION,
  PORTFOLIO_ACTION_NAVIGATION,
]
