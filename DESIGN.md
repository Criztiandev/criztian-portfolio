---
name: Criztian
description: Big-brand design and real engineering for US small businesses. Black, bold, one red.
colors:
  black: "#0A0A0A"
  graphite: "#232323"
  paper: "#F4F4F1"
  smoke: "#8A8A86"
  red: "#E1251B"
  white: "#FFFFFF"
typography:
  giant-desktop:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "425px"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "0"
  giant-tablet:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "220px"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "0"
  giant-phone:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "222px"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "0"
  display-xl:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "160px"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0"
  display-l:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  h1:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"
  h2:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.005em"
  body-large:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0"
  body-small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
rounded:
  none: "0px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
  "30": "120px"
  "40": "160px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
  button-small:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  link:
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    padding: "4px"
  icon-button:
    textColor: "{colors.paper}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.graphite}"
  nav:
    height: "80px"
    padding: "0 40px"
  nav-compact:
    height: "64px"
    padding: "0 16px"
  nav-scrolled:
    backgroundColor: "{colors.black}"
  price-card:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "40px"
---

# Design System: Criztian

## Overview

**Creative North Star: "The Name Behind"**

A giant CRIZTIAN in Anton sits behind a black-and-white portrait on a black page, the way a poster puts the star in front of the title. The look is bold; the words are calm. Everything else stays out of the way so one red button can do its job: "Book a call".

Density is low and contrast is high. Sections are full-bleed bands with hard edges, separated by changes in scale, not by boxes. Exactly one section breaks the pattern on purpose: the Paper White Stakes band. Motion is one big move per scroll section (the name slides, the screens rise), never decoration.

The Figma file `SBq7maOIwqSa2V8MRCVSXz` is the single source of truth. This file mirrors it; docs/brand.md holds the full token table.

**Key Characteristics:**

- Black page, Paper White type, one Signal Red for the action and big numbers.
- Anton at poster scale against small Inter body text.
- Hard edges everywhere: no radius, no glow, no gradients.
- Black-and-white photos of him; real screenshots of real work.

## Colors

Near-monochrome: black and paper, with one red that means "act" or "count".

### Primary

- **Signal Red** (#E1251B): the action (every "Book a call" button) and the big numbers (About stats, prices). Never fills large areas. Red text only at 24 px and up (4.2:1 on black). White on red is 4.7:1.

### Neutral

- **Black** (#0A0A0A): the page, every band except Stakes, the nav once scrolled.
- **Graphite** (#232323): panels, the booking popup, hairlines, icon-button hover.
- **Paper White** (#F4F4F1): all main text and the giant name (18:1 on black). Also the Stakes band background.
- **Smoke** (#8A8A86): second text, labels, inactive Work rows (5.7:1 on black).
- **Pure White** (#FFFFFF): text on red only.

### Named Rules

**The One Red Rule.** About 80% black, 15% paper, under 5% red on any screen. Red is never decoration.

## Typography

**Display Font:** Anton (with Impact, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)

**Character:** a condensed poster face for names and headlines, a neutral workhorse for everything people read. The contrast between them is the whole system.

### Hierarchy

- **Giant** (Anton 400, 425 / 220 / 222 px for desktop / tablet / phone, line height 0.85): the hero name only. It fills the screen width: desktop scales 375 px at 1280 → 425 px at 1440+, tablet 220 px at 768 → 379 px at 1279, phone stacks CRIZ / TIAN at 203 px at 360 → 456 px at 767.
- **Display XL** (Anton 400, 160 px, 0.9): the giant section words WORK and PRICES on desktop.
- **Display L** (Anton 400, 96 px, 0.95): other section titles on desktop; WORK / PRICES on phone.
- **H1** (Anton 400, 64 px, 1): Stakes headline, footer headline, About numbers on tablet and phone, prices.
- **H2** (Anton 400, 40 px, 1.05, +0.5%): hero promise, Work row names, package names.
- **Body Large** (Inter 400, 20 px, 1.5): About intro.
- **Body** (Inter 400, 18 px / 28 px): all reading text, including trust lines. Max about 65 characters per line.
- **Body Small** (Inter 400, 14 px, 1.5): footer bottom bar and board notes only. Never for anything that answers a buyer's worry.
- **Label** (Inter 600, 12 px, +8%, uppercase): the meta line under a Work row name ("CONCEPT REDESIGN · WINERY").
- **Button** (Inter 600, 16 px, 1): buttons and links.

### Named Rules

**The No Anton Body Rule.** Anton never sets anything longer than a headline.

## Layout

Mobile-first with three drawn sizes: Phone 390 (works 360–767), Tablet 768 (768–1279), Desktop 1440 (1280 and up). The page stops at 1440 px and centers; black bands and lines stay full-bleed above that. Side gutters: 16 / 32 / 40 px. Content max inside the gutters: 1360 px.

Spacing follows the Tailwind 4 px scale (tokens 1–40 = 4–160 px). Sections breathe: 120 px top and bottom on desktop, 96 on tablet, 80 on phone. Desktop right-hand copy columns start on one line (x 1060 in the 1440 frame).

## Elevation & Depth

Flat. Depth comes from the portrait sitting in front of the giant name and from the bottom fade on the portrait, not from shadows. The one shadow is the booking popup overlay.

### Shadow Vocabulary

- **Overlay** (`box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5)`): the booking popup panel only, over a black 80% backdrop.

## Shapes

Hard edges everywhere: radius 0 on buttons, cards, images and popups. Price cards and Work dividers use a 1 px Graphite hairline. The only rounded shape is the app icon tile (12 px), which lives outside the page.

## Components

### Buttons

- **Shape:** square corners (0).
- **Primary:** Signal Red with white Inter 600 16 px label, 52 px tall, 24 px side padding. Small size: 44 px tall, 16 px padding (nav).
- **Hover:** turns Paper White with black text, 150 ms.
- **Focus:** 2 px Paper White ring with a 2 px gap.

### Links

- Paper White Inter 600 16 px, optional 24 px drawn arrow icon (down or up-right) 8 px after the label. Hover: underline, arrow moves 4 px. Focus: the same ring as buttons. Footer social links are Smoke. Tap area at least 44 px in code.

### Cards / Containers

- **Price cards:** black, 1 px Graphite hairline, square corners, 40 px padding. "From" sits beside the price, not above it.

### Navigation

- Desktop: 80 px, short mark "C." left, Work · How it works · Prices in the middle, small red "Book a call" right. Over the hero: no bar. After scroll: black bar with a Graphite bottom hairline; hides on scroll down, returns on scroll up.
- Tablet and phone: 64 px, "C." + "Book a call" + a 44 px menu button opening a full-screen black menu.

### Work stage (signature component)

- Desktop: a pinned stage. Left, the list of 3 rows (active row Paper White with its line and link; others Smoke). Right, the active project's 3 screens: desktop 16:10, detail 4:3, phone 9:19.5. Tablet and phone: rows stacked, no pin.

## Do's and Don'ts

### Do:

- **Do** keep the hero headline and "Book a call" visible on the first phone screen.
- **Do** use real screenshots in plain frames drawn with brand tokens.
- **Do** keep red for the action and big numbers only.
- **Do** keep every section a full-bleed band with one centered container.

### Don't:

- **Don't** use radius, glow, gradients, glass or gradient text.
- **Don't** put eyebrow labels above headings.
- **Don't** use typed symbols (→ ↗ ✓) as icons; use the drawn SVG icons.
- **Don't** use cream grounds, serif titles over food photos, pill buttons, stock smiles or centered hero copy (the competitor look).
- **Don't** add a loader or intro screen.
- **Don't** set body text below 18 px for anything that answers a buyer's worry.
