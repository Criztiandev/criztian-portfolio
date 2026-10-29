import type {
  FooterLink,
  HomeImage,
  PricePackage,
  Stat,
  Step,
  WorkRow,
  WorkScreens,
} from "@/type/home.type"

export const HOME_DEFAULTS = {
  heroHeading: "Your place deserves a website as good as it is.",
  heroText:
    "I design and build custom websites for your business, so more people book, call or walk in.",
  stakesHeading: "Your customers check your website before they walk in.",
  stakesText:
    "If it looks like a template, so does your place. A custom site shows them what makes you different, and makes it easy to book.",
}

export const HERO = {
  nameStart: "CRIZ",
  nameEnd: "TIAN",
  portrait: {
    src: "/images/hero/criztian-portrait.png",
    alt: "Portrait of Criztian",
  } satisfies HomeImage,
  workLink: { href: "#work", label: "See the work" },
  callNote: "Free 20-minute video call. No pressure.",
}

const ROUDON_SMITH_SCREENS: WorkScreens = {
  desktop: {
    src: "/images/work/roudon-smith-home-desktop.jpg",
    alt: "Roudon-Smith Winery concept: home page on desktop",
  },
  detail: {
    src: "/images/work/roudon-smith-wine-detail.png",
    alt: "Roudon-Smith Winery concept: wine page on desktop",
  },
  phone: {
    src: "/images/work/roudon-smith-home-phone.png",
    alt: "Roudon-Smith Winery concept: home page on a phone",
  },
  phoneDetail: {
    src: "/images/work/roudon-smith-wine-phone.png",
    alt: "Roudon-Smith Winery concept: wine page on a phone",
  },
}

export const WORK = {
  stage: ROUDON_SMITH_SCREENS,
  heading: "WORK",
  label:
    "Concept redesigns: what I'd build for real businesses. Not paid projects yet.",
  rows: [
    {
      name: "Roudon-Smith Winery",
      meta: "Concept redesign · Winery · Saratoga, CA",
      line: "A quiet, classic site built around one action: join the wine club. The online shop stays where it already works.",
      tag: "Design only",
      screens: ROUDON_SMITH_SCREENS,
    },
    {
      name: "J&T Express",
      meta: "Concept redesign · Parcel delivery",
      line: "A parcel company's site rebuilt so tracking your package is the first thing you see.",
      link: {
        href: "https://criztian-jnt-express-concept.vercel.app",
        label: "Visit the live site",
      },
      screens: {
        desktop: {
          src: "/images/work/jnt-home-desktop.png",
          alt: "J&T Express concept: home page on desktop",
        },
        detail: {
          src: "/images/work/jnt-help-detail.png",
          alt: "J&T Express concept: help page on desktop",
        },
        phone: {
          src: "/images/work/jnt-home-phone.png",
          alt: "J&T Express concept: home page on a phone",
        },
        phoneDetail: {
          src: "/images/work/jnt-help-phone.png",
          alt: "J&T Express concept: help page on a phone",
        },
      },
    },
    {
      name: "Your place",
      meta: "Next project",
      line: "This spot is for your business.",
      bookCall: true,
    },
  ] satisfies WorkRow[],
}

export const STEPS = {
  heading: "How it works",
  steps: [
    {
      number: "1",
      title: "Book a call.",
      body: "20 minutes. Tell me about your place and what you want more of: bookings, calls or visits.",
    },
    {
      number: "2",
      title: "Get a fixed price.",
      body: "You'll know the price and how many rounds of changes you get before we start. No surprise bills.",
    },
    {
      number: "3",
      title: "I research, design, build.",
      body: "I study your place and your competitors, so your site shows what only you have. You approve the design before I build it. Most sites go live in 3–6 weeks, and I'm still here after launch.",
    },
  ] satisfies Step[],
}

export const ABOUT = {
  heading: "Hi, I'm Criztian.",
  body: "I'm a full-stack developer. I've built for the web for 4+ years, including 2+ years of websites and apps for healthcare and finance teams. Now I bring that same engineering to small businesses: I design your site, build it myself, and look after it once it's live. You talk to one person the whole way.",
  photo: {
    src: "/images/about/criztian-about.png",
    alt: "Criztian working at a laptop",
  } satisfies HomeImage,
  stats: [
    { value: "4+", label: "years building for the web" },
    { value: "24h", label: "the longest you'll wait for my reply" },
    { value: "1", label: "person you talk to" },
  ] satisfies Stat[],
}

export const PRICES = {
  heading: "PRICES",
  sub: "Starting prices. Your exact price is fixed after our call, before any work starts.",
  from: "From",
  packages: [
    {
      name: "Starter",
      price: "$1,500",
      summary: "A small, sharp site for one location, built for phones first.",
      includes: ["Up to 3 pages", "2 rounds of changes", "You own every file"],
    },
    {
      name: "Standard",
      price: "$2,500",
      summary: "A fuller site you can update yourself.",
      includes: [
        "Up to 5 pages",
        "3 rounds of changes",
        "An easy editor for your menu, hours and photos",
      ],
    },
    {
      name: "Premium",
      price: "$4,000",
      summary: "Your full site plus a brand refresh.",
      includes: [
        "Up to 7 pages, deeper design and motion",
        "4 rounds of changes",
        "An easy editor for your menu, hours and photos",
        "A blog",
        "A brand refresh: logo, colors, fonts",
      ],
    },
  ] satisfies PricePackage[],
  note: "Every package: built for phones first, you own every file, and hosting and domain are in your name.",
  smallNotes: [
    "Extra changes after your rounds are billed at a rate we agree upfront.",
    "Care plan: from $150/month, optional.",
  ],
}

export const FOOTER = {
  heading: "Let's talk about your place.",
  emailLead: "Or email",
  email: "hello@criztian.dev",
  socials: [
    {
      href: "https://www.linkedin.com/in/criztian-jade-tuplano-036b85258/",
      label: "LinkedIn",
    },
    { href: "https://www.instagram.com/criztiandev", label: "Instagram" },
    { href: "https://www.facebook.com/criztiandev", label: "Facebook" },
  ] satisfies FooterLink[],
  copyright: "© 2026 Criztian.",
  privacy: { href: "/privacy", label: "Privacy" } satisfies FooterLink,
}
