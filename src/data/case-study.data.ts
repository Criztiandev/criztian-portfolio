import type { CaseStudy } from "@/type/case-study.type"
import type { FooterLink } from "@/type/home.type"

export const ALL_WORK_LINK: FooterLink = { href: "/#work", label: "All work" }

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "roudon-smith",
    title: "Roudon-Smith Winery: the wine club first.",
    sub: "A concept redesign of a Saratoga winery's website, built around one action: joining the wine club. Not a paid project, and not affiliated with Roudon-Smith Winery.",
    meta: "Concept redesign · Winery · Saratoga, CA · Design only",
    image: {
      src: "/images/work/roudon-smith-home-desktop.jpg",
      alt: "Roudon-Smith Winery concept: home page on desktop",
      aspectRatio: "16 / 10",
    },
    business: {
      heading: "The business",
      paragraphs: [
        "Roudon-Smith has poured wine in Saratoga, California, since 1972. Two Silicon Valley engineer families started it. Today it's a small winery with a tasting room on Big Basin Way, an online shop, and a wine club that releases wine three times a year.",
        "The goal I set: get more Bay Area locals to join the club. The current site doesn't make that easy.",
      ],
    },
    before: {
      heading: "BEFORE",
      intro: "Their site has served them for years. Here's what I'd change.",
      shots: [
        {
          image: {
            src: "/images/work/roudon-smith-before-home.png",
            alt: "Roudon-Smith Winery's current home page",
            aspectRatio: "16 / 10",
          },
          caption: "Their home page today.",
        },
        {
          image: {
            src: "/images/work/roudon-smith-before-club.png",
            alt: "Roudon-Smith Winery's current wine club page",
            aspectRatio: "16 / 10",
          },
          caption: "Their wine club page today.",
        },
      ],
      notes: [
        {
          title: "Nothing leads.",
          body: "Three links share the first screen: events, wholesale and the club.",
        },
        {
          title: "The club has no price.",
          body: "The club page lists the perks but no price. It also asks for a comment and an address, even if you pick up.",
        },
        {
          title: "Hard to tell what's for sale.",
          body: "The wine list goes back to 2013 and uses shop codes, and some of those wines aren't in the shop anymore.",
        },
      ],
    },
    after: {
      heading: "AFTER",
      intro: "Each change answers one of the notes above.",
      changes: [
        {
          title: "One action per screen.",
          body: "Before, three links shared the first screen. Now there's one button, “Join the wine club”, with the tasting room hours under it. The menu went from 8 links to 3.",
          screen: {
            src: "/images/work/roudon-smith-after-one-button.png",
            alt: "Redesigned first screen with one button",
            aspectRatio: "16 / 10",
          },
          phoneScreen: {
            src: "/images/work/roudon-smith-home-phone.png",
            alt: "Redesigned first screen with one button",
            aspectRatio: "4 / 5",
            objectPosition: "50% 47%",
          },
        },
        {
          title: "Real numbers.",
          body: "Before, the club page showed no price. Now each size shows the bottles a year and an estimated price per release, worked out from their real bottle prices ($25 to $35, members $20 to $28) and labeled as an estimate.",
          screen: {
            src: "/images/work/roudon-smith-club-desktop.png",
            alt: "Redesigned club sizes with estimated prices",
            aspectRatio: "9 / 4",
          },
          phoneScreen: {
            src: "/images/work/roudon-smith-after-sizes-phone.png",
            alt: "Redesigned club sizes with estimated prices",
            aspectRatio: "13 / 12",
          },
        },
        {
          title: "Only wines you can buy.",
          body: "Now only the 5 wines in their shop today show, each with its price and member price. Their label sets the look: paper white, the gold amphora, label-style capitals, and their real bottle rebuilt in 3D from shop photos.",
          screen: {
            src: "/images/work/roudon-smith-wine-detail.png",
            alt: "Redesigned wine slider with current wines",
            aspectRatio: "4 / 3",
          },
          phoneScreen: {
            src: "/images/work/roudon-smith-wine-phone.png",
            alt: "Redesigned wine slider with current wines",
            aspectRatio: "4 / 5",
          },
        },
      ],
    },
    measure: {
      heading: "What I'd measure",
      intro:
        "It's a concept, so there are no results yet. If it went live, I'd track these 3 things.",
      items: [
        "Club sign-ups a month",
        "Taps on directions and hours",
        "Clicks through to their shop",
      ],
    },
  },
]
