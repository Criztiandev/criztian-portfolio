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

Density is low and contrast is high. Sections are full-bleed bands with hard edges, separated by changes in scale, not by boxes. Exactly one section breaks the pattern on purpose: the Paper White Stakes band. Motion follows one idea, "Lights up": each thing waits dim and lights as the scroll reaches it, never decoration (see Motion).

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

Mobile-first with three drawn sizes: Phone 390 (works 360–767), Tablet 768 (768–1279), Desktop 1440 (1280 and up). Large 1920 is drawn too (1536 and up). Page max **1920**, content max **1840** (40 px gutters), centered above 1920; black bands stay full-bleed. The big parts stretch to 1840 (the hero name, giant section words, screenshots, grids); reading text stays at most 720 px wide.

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

## Motion

**Thesis: "Lights up."** The page opens in the dark. The scroll lights things up one at a time, in reading order: each thing waits dim and lights as the visitor reaches it, and dims again on the way back up. The last light on the page is Book a call. Approved by Criztian part by part on 2026-10-29.

Why this idea: the moves already shipped speak it (the hero lights up from black, the Stakes headline inks with the scroll, the name letters dim under the cursor), and on a black page light is the natural material. Every section uses light but does something different with it, so the page never reads as one reveal repeated.

**Focal moment:** the hero load (shipped). It is the only timed sequence on the page; everything after it follows the scroll.

### Scroll story

Story sections are beats in the scroll story and get 3 concepts at their `/wmotion` run. Small sections use the vocabulary and get 1 proposal (3 on request).

| #   | Section                        | Type              | Beat                                                                                                                                                                                                                                           |
| --- | ------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Nav                            | small, shipped    | Drops in after the hero lights up. Hides on the way down, returns on the way up.                                                                                                                                                               |
| 1   | Hero                           | story, shipped    | Load: lights up from black. Exit ("Layers", no hold): as the visitor leaves, the name slides behind the sinking portrait and the copy rises out, dennissnellenberg.com's layers. Nothing dims.                                               |
| 2   | Stakes                         | story, shipped    | The page turns Paper White; the headline inks word by word.                                                                                                                                                                                    |
| 3   | Work                           | story, the peak, shipped | "Long road": desktop with a mouse or trackpad, 1 screen of scroll per row (the row 1 beat plays as the section enters, then a 2-screen hold). The projects' screens ride one column that never stops; each set lights as it reaches its place and the matching row lights and opens; "Your place" lights last, its frames drawn empty, then Book a call rises. Rows follow the scroll both ways, not Figma's timed swap. |
| 4   | How it works                   | small, shipped    | "Stairs": the 3 steps climb in at different heights and land in order; each step's parts close up and light as it lands, then its line draws in Smoke. Stacked under 1280, one step at a time.                                                  |
| 5   | About                          | small, shipped    | "Echo": the hero load, replayed by the scroll. "Criztian." rises letter by letter like the hero name, the photo rises from its clip and lights, the 3 red numbers rise one by one. Touch: the photo stays still.                                 |
| 5b  | Blog                           | small, shipped    | "Write": each title is written letter by letter, like the hero and About names, then its date and summary rise. Touch: the titles rise word by word.                                                                                          |
| 6   | Prices                         | small             | The 3 cards open top-down, one after another; each price rises last.                                                                                                                                                                           |
| 7   | Footer                         | story, the ending | The headline inks word by word, like Stakes. Then Book a call rises: the last light on the page.                                                                                                                                               |
| —   | Case study, blog, 404, Privacy | small             | The vocabulary only, no holds. Criztian directs them later.                                                                                                                                                                                    |

Every section title rises from its mask and lights as it enters; each section adds its own beat on top. Stakes and the footer share the ink on purpose: the problem and the answer.

### Vocabulary

| Move       | What it does                                      | Numbers                                                                                     | Source                                                           |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Light      | Waits dim, then lights                            | Text opacity 20% → 100%; photos brightness 0.3 → 1                                          | shipped: `hero-light-up`, `hero-portrait-light`                  |
| Ink        | Light, word by word in reading order              | 150 px of scroll per word, about 30 px apart (Stakes: 32.5 px for its 9 words)              | shipped: Stakes                                                  |
| Mask rise  | Rises from below its own clip                     | Translate 110% → 0. Titles go word by word; WORK and PRICES letter by letter, like the name | shipped: `hero-mask-rise`                                        |
| Photo rise | A photo rises from below its clip while it lights | TranslateY 100% → 0, with Light                                                             | shipped: hero portrait                                           |
| Small rise | Body text                                         | 24 px up, opacity 0 → 100%, over 200 px                                                     | shipped: Stakes body                                             |
| Draw       | A hairline draws left to right                    | `clip-path: inset(0 100% 0 0)` → `inset(0)`, both keyframes written; Smoke over a Graphite track | Lurais's line draw; shipped: `steps-line`                        |
| Stair      | Parts of an item rise from below its clip at growing depths and land together | Number, title, body from 160 / 200 / 240 px over 300 px; items 120 px apart | shipped: `steps-rise` (How it works)                             |
| Open       | A card is uncovered top-down; nothing stretches   | `clip-path: inset(0 0 100% 0)` → `inset(0)`                                                 | rule: clip, never scaleY                                         |
| Slide      | The hero name moves sideways as the hero leaves; the portrait sinks behind it | Name 0.4 px left per px of scroll, portrait 0.3 px down per px (−400 / +300 px over 1000 px) | shipped: `hero-exit-slide`, `hero-exit-sink`; dennissnellenberg.com's code |
| Rise out   | Leaving text rises out instead of fading          | Words to −140% inside their mask, 150 px each, 30 px apart; body 24 px up while it fades, 200 px each, 100 px apart | shipped: `hero-exit-rise`, `hero-exit-copy`                      |
| Spotlight  | One row lit Paper White, the rest Smoke           | Work rows, desktop                                                                          | Figma plan                                                       |

**Scroll rules** (every reveal below the hero):

- Linear. Lenis's glide does the easing; ease-out on a 150 px scrub put 80% of the change in 50–55 px.
- At least 150 px of scroll per item, so 10–90% takes 120 px or more. Under 100 px is a pop. Ramp-probe every move before showing it.
- Words and letters start 30–50 px apart. List items (steps, numbers, cards, rows) start at least 100 px apart, so a group never moves at once.
- Ranges count from when the section's top enters the screen (`animation-range: cover …`, like Stakes) and end before the page's last scroll position, so the footer always finishes lit.
- Both ways: scrolling back up dims things again.
- Holds: Work only, on a desktop width with a mouse or trackpad, 1 screen of scroll per row.

**Timed rules** (load and hover only):

- Ease-out `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`).
- Load: entrances 1000–1400 ms, lights 900 ms, all done by about 3.2 s.
- Feedback: buttons 150 ms, dims and the nav 300 ms, photo color 600 ms, relight 900 ms ease-in-out. Leaving is faster than arriving.

**Triggers:** page load (hero and nav only) · scroll, both ways (every reveal below the hero) · hold (Work on desktop only; the hero exit has none) · hover and keyboard focus (devices with hover and a fine pointer). Never "plays once when it comes into view".

**Hover:**

- Shipped: the name letters dim and relight; the portrait shows its color; buttons turn Paper White; links underline and their arrow moves 4 px.
- Clickable images and rows lift: Work screens to 1.02, blog rows to 1.01. They settle with Lurais's spring (0.4 s, bounce 0.2) built as a CSS `linear()` curve, starting within 100 ms; older browsers get `--ease-out`.
- Things that can't be clicked never answer the pointer (price cards, numbers): a hover there promises a click that never comes.
- No ambient loops. The voice stays calm, and a loop over 5 s next to content needs a pause control (WCAG 2.2.2). The page stays alive through the scroll and the pointer.

### Touch, reduced motion, old browsers

**Touch screens** (phones and tablets, any width):

- The same light scroll moves as desktop, one moving on screen at a time. The Stakes ink proved the cost: 2, 0 and 0 frames over 34 ms in about 424, against 1, 1 and 1 with it off.
- No holds and no hover moves; a tap goes straight to the link.
- Hero: the load only, no slide. Work: rows stacked, each row's screens rise as the visitor reaches them, no spotlight. About: the numbers rise, the photo stays still (brightening a big photo can cost phone frames). The rest: as desktop, stacked.
- Every move is measured on the phone profile; a move that drops frames is cut.

**Reduced motion, and browsers without scroll timelines:**

- Nothing moves: everything shows fully lit and in place. Desktop Work shows the stacked layout.
- No scroll glide (a wheel step settles in 117 ms); links jump.
- Hover color changes stay, instantly; no lift and no letter dim.

### Banned moves

1. Plain fade-ins and fade-ups, or one reveal copied onto every section.
2. Anything that plays once when it comes into view.
3. Pops (done in under 100 px of scroll) and eased timing on scroll moves.
4. Fighting the scroll: speed limits, snapping, holds on touch, a hold where nothing moves, taking over touch scrolling.
5. Stretching or squashing a card (`scaleX`, `scaleY`), growing from `scale(0)`, bouncy entrances. Bounce lives only in the hover settle.
6. Eye pain: flashes, flicker, a bright line sweeping over text, strong grain.
7. Off-brand: glow, gradients, blurred text, glass, color shifts (except the hero photo on hover), red that moves for show.
8. Gimmicks: cursor blobs, sparkles, confetti, particles, 3D or WebGL, loops without a pause control, a loader, a scroll progress bar.
9. Hidden or jumping content: text that needs JavaScript to show, layout shift, animating `width`, `height`, `top` or `left`.
10. Two sections' text fighting for the screen on a fast scroll.
11. Moving one element and calling the section done.

### Budget

- CSS runs every move: scroll timelines for the reveals, `position: sticky` for the Work hold, transitions for hover. New JavaScript planned: 0 KB; any JavaScript goes to Criztian with its size first.
- Lenis stays, the only motion JavaScript (2 s glide, mouse and trackpad only).
- The Motion library is gone (hero run, 2026-10-29). Only `MotionConfig` in `providers.tsx` used it; removing it saved 0.5 KB decoded (809.5 → 809.0 KB), and transferred stayed flat (237.5 → 237.7 KB), because tree-shaking had already dropped the rest.
- No GSAP and no 3D. If the Work hold can't be built in CSS, GSAP comes back to Criztian with its size.
- JS on `/` stays at or under 237.9 KB (transferred, phone 390, after Lenis). LCP and CLS can't get worse (last, hero exit run: 1136 ms and 0.031 median on the phone profile, JS 237.7 KB). Every run reports JS before and after.
- Support (MDN browser-compat-data, read 2026-10-29): `animation-timeline` in Chrome 115, Safari and iOS 26, Firefox 159; `linear()` easing in Chrome 113, Safari 17.2, Firefox 112.

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
