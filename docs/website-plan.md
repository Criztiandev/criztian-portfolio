# Website plan — Criztian portfolio

Copy below was pulled from the Figma text layers (file `SBq7maOIwqSa2V8MRCVSXz`, page Design `39:2`) on 2026-10-29. Use it word for word. Text in `[brackets]` is a labeled placeholder waiting on Criztian: keep them visible and labeled, never invent the value.

## Setup

| Question        | Answer                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Experience type | **Mix:** scroll-driven on the hero and Work only (desktop; tablet and phone have no pin), light motion everywhere else                   |
| Page max        | 1440 px, centered. Black bands and lines stay full-bleed above that. Drawn frames: Phone 390, Tablet 768, Desktop 1440 (no Large frames) |
| Live or demo    | Live, for real prospects                                                                                                                 |
| Main action     | "Book a call" opens Cal.com over the page: https://cal.com/criztian/discovery (free, 20 minutes, Cal Video). No contact form             |
| Proof           | Concept redesigns only. No testimonials until a real client gives one                                                                    |
| Prices          | "From" price per package: Starter $1,500 · Standard $2,500 · Premium $4,000 (pricing step, 2026-10-29)                                   |
| Roudon-Smith    | Screens on the site, labeled concept, no live link                                                                                       |
| Page title      | Criztian — Custom websites for small businesses.                                                                                         |

Pages: Home (one page), 404, Privacy. Nav anchors: `#work`, `#how-it-works`, `#prices`.

## Sections, in page order

### 0 · Nav (sticky)

- Left: short mark **C.** (red period) → top of page.
- Middle: **Work** · **How it works** · **Prices**.
- Right: small red button **Book a call**.
- Tablet / phone: **C.** + **Book a call** + menu button (44 px). The menu is full-screen black with Work, How it works, Prices and a red **Book a call**, plus a close button.

### 1 · Hero

- Behind: **CRIZTIAN** (giant). Phone: **CRIZ / TIAN** stacked, head under CRIZ.
- Image: `public/images/hero/criztian-portrait.png` (B&W cut-out, 1024 × 1536, 2:3) in front of the name, with a fade to black at the bottom.
- Promise (h1): **Your place deserves a website as good as it is.**
- Sub: I design and build custom websites for restaurants, cafés, wineries, shops and salons, so more people book, call or walk in.
- Button (red): **Book a call** · Link: **See the work** (arrow down) → `#work`.
- Under the buttons: **Free 20-minute video call. No pressure.**
- Desktop layout: name and portrait centered as a poster; promise bottom-left; sub + buttons + call note bottom-right.

### 2 · Stakes (the one Paper White band)

- h2: **Your customers check your website before they walk in.**
- Body: If it looks like a template, so does your place. A custom site shows them what makes you different, and makes it easy to book.

### 3 · Work (`#work`)

- h2: **WORK**
- Label line: Concept redesigns: what I'd build for real businesses. Not paid projects yet.
- **Row 1 — Roudon-Smith Winery**
  - Meta: Concept redesign · Winery · Saratoga, CA
  - Line: A quiet, classic site built around one action: join the wine club. The online shop stays where it already works.
  - Tag: Design only
  - Screens: `work/roudon-smith-home-desktop.jpg` (16:10) · `work/roudon-smith-wine-detail.png` (4:3) · `work/roudon-smith-home-phone.png` (9:19.5). Phone frame detail: `work/roudon-smith-wine-phone.png`.
- **Row 2 — J&T Express**
  - Meta: Concept redesign · Parcel delivery
  - Line: A parcel company's site rebuilt so tracking your package is the first thing you see.
  - Link: **Visit the live site** (arrow up-right) → https://criztian-jnt-express-concept.vercel.app (new tab)
  - Screens: `work/jnt-home-desktop.png` (16:10) · `work/jnt-help-detail.png` (4:3) · `work/jnt-home-phone.png` (9:19.5). Phone frame detail: `work/jnt-help-phone.png`.
- **Row 3 — Your place**
  - Meta: Next project
  - Line: This spot is for your business.
  - Button: **Book a call**
  - Screens: desktop only, 3 empty dashed frames labeled "your site" (drawn in code, no image). Tablet and phone: no frames, just the line and the button.
  - Rule: never "see your redesign for free" here. That stays an outreach move.

### 4 · How it works (`#how-it-works`)

- h2: **How it works**
- 1 · **Book a call.** 20 minutes. Tell me about your place and what you want more of: bookings, calls or visits.
- 2 · **Get a fixed price.** You'll know the price and how many rounds of changes you get before we start. No surprise bills.
- 3 · **I research, design, build.** I study your place and your competitors, so your site shows what only you have. You approve the design before I build it. Most sites go live in 3–6 weeks, and I'm still here after launch.

### 5 · About

- Image: `public/images/about/criztian-about.png` (B&W, 4:5).
- h2: **Hi, I'm Criztian.**
- Body: I'm a full-stack developer. I've built for the web for 4+ years, including 2+ years of websites and apps for healthcare and finance teams. Now I bring that same engineering to small businesses: I design your site, build it myself, and look after it once it's live. You talk to one person the whole way.
- Numbers (Signal Red): **4+** years building for the web · **24h** the longest you'll wait for my reply · **1** person you talk to.

### 6 · Prices (`#prices`)

- h2: **PRICES**
- Sub: Starting prices. Your exact price is fixed after our call, before any work starts.
- **Starter** · From **$1,500** · A small, sharp site for one location, built for phones first. · Up to 3 pages · 2 rounds of changes · You own every file
- **Standard** · From **$2,500** · A fuller site you can update yourself. · Up to 5 pages · 3 rounds of changes · An easy editor for your menu, hours and photos
- **Premium** · From **$4,000** · Your full site plus a brand refresh. · Up to 7 pages, deeper design and motion · 4 rounds of changes · An easy editor for your menu, hours and photos · A blog · A brand refresh: logo, colors, fonts
- Notes: **Every package: built for phones first, you own every file, and hosting and domain are in your name.** (Paper White) · Extra changes after your rounds are billed at a rate we agree upfront. · Care plan: from $150/month, optional.
- No "View details" button or popup: everything a package includes stays visible on its card.
- Never on the site: the founding price ($800 Starter for the first 3 clients). It is offered only in cold emails and on calls.
- Button (red): **Book a call**

### 7 · Footer (the final call to action)

- h2: **Let's talk about your place.**
- Button (red): **Book a call** · Or email hello@criztian.dev (live once the domain is bought).
- Socials (Smoke, arrow up-right, new tab): **LinkedIn** → https://www.linkedin.com/in/criztian-jade-tuplano-036b85258/ · **Instagram** → https://www.instagram.com/criztiandev · **Facebook** → https://www.facebook.com/criztiandev
- Bottom bar: © 2026 Criztian. · **Privacy** → `/privacy`

## States and other pages (Figma States board `44:33`)

- **Phone / tablet menu** (`44:38`, `44:62`): see Nav.
- **Nav** (`44:84`): over the hero = no bar; after scroll = black bar with a Graphite hairline. Desktop: hides on scroll down, comes back on scroll up.
- **Hover + focus** (`44:165`): red button → Paper White with black text (150 ms); links underline, arrow moves 4 px; focus = 2 px Paper White ring, 2 px gap.
- **Booking popup** (`45:123`): opens over the page from any Book a call button. Desktop = 720 px panel over a black 80% backdrop; phone = full screen (`67:309`, `67:322`). Close = 44 px icon button.
  - Loading: **Book a call** · Loading times…
  - Error: **The calendar didn't load.** Email me at hello@criztian.dev and I'll reply within 24 hours. · Link: **Email hello@criztian.dev**
  - The Cal.com screens themselves are not drawn.
- **404** (`45:191`): **404** · This page doesn't exist. · Buttons: **Book a call** · **Back to home**
- **Privacy** (`45:220`): Privacy · Last updated: [launch date] · **What I collect** — When you book a call, the booking tool asks for your name, your email and any notes you add. I use them only to hold the call and reply to you. I don't sell your data. · **Visit counts** — This site counts visits with [analytics tool, named before launch]. [What it collects, filled in once the tool is picked.] · **Questions** — Email me at hello@criztian.dev with any question about your data.
- Not drawn, on purpose: form states (no form), empty states (nothing can be empty), Terms (sells nothing directly), age check.

## Motion (from the Motion states board `58:221`)

Claude Code builds motion from these notes (Figma prototype interactions can't be read by code).

| Moment                      | Trigger                               | What moves                                                                                                                                                                                                                                                                              | Duration · easing                                                       | Board frames                    |
| --------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| Load                        | page load                             | Name rises 40 px into place and fades in. Portrait fades in. Headline, sub, buttons and nav are there from the first frame. No loader.                                                                                                                                                  | name 600 ms, portrait 400 ms · ease-out                                 | `59:285` → `59:311`             |
| Hero pin (desktop + tablet) | scroll                                | Hero pins for 1 screen of scroll. CRIZTIAN slides left 340 px (25% of its width), scrubbed 1:1 with scroll. Portrait and words stay still. Nav hides on scroll down. Pin lets go into Stakes.                                                                                           | tied to scroll, no easing                                               | `59:311` → `59:337`             |
| Hero, phone                 | load                                  | No pin, name still, 300 ms fade only.                                                                                                                                                                                                                                                   | 300 ms · ease-out                                                       | Phone frame                     |
| Stakes reveal               | band 30% in view, once                | Headline words go from 15% to full opacity one at a time; body fades up after the last word. Never replays.                                                                                                                                                                             | ~60 ms per word (~900 ms), body 300 ms · ease-out                       | `58:296` → `58:299`             |
| Work pin (desktop only)     | scroll                                | List pins for 3 screens of scroll, 1 per row. Active row: name Smoke → Paper White, its line and link/button open; other rows close and dim to Smoke. Screens swap: old fade out, new rise 40 px and fade in (desktop, detail, phone, 80 ms apart). Clicking a row scrolls to its spot. | rows 300 ms · screens out 150 / in 600 ms · ease-out · row click 500 ms | `58:310` → `58:333` → `58:356`  |
| Work, tablet + phone        | enters view                           | No pin; rows stacked; screens fade up.                                                                                                                                                                                                                                                  | 300 ms · ease-out                                                       | Tablet `48:196`, Phone `49:217` |
| Reduced motion              | the visitor's "reduce motion" setting | No pins, no slides, no fades. Hero = the scroll-0 still. Stakes fully lit. Desktop Work = the stacked layout (same as tablet). The stacked layout is also the fallback when the scroll script fails.                                                                                    | —                                                                       | `59:311`, `58:412`              |
| Everything else             | enters view, once                     | Fade up. Hover per the States board. Nav hides on scroll down, returns on scroll up (desktop).                                                                                                                                                                                          | fade 300 ms, hover 150 ms · ease-out                                    | `44:33`                         |

Easing (judgment): ease-out = `cubic-bezier(0.22, 1, 0.36, 1)`.
Rule (value #1): if the motion slows the phone page, the motion goes, not the speed.
Keyboard: the pinned Work section must never trap focus.

## Awwwards references (Figma Moodboard page, board `29:2`)

| Site                  | Award                           | Adopt                                                                     | Improve                                              | Skip                                            |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| dennissnellenberg.com | Site of the Day, Apr 4, 2022    | Giant name behind the portrait that slides on scroll                      | A plain promise and red "Book a call" above the fold | Grey ground, location pill, lowercase name      |
| codebyjesse.com       | Honorable Mention, May 12, 2026 | Dark page, one accent, project button always top right, short proof strip | Only true numbers; plain headline                    | Autoplay video hero, serif italics, award badge |
| lamalama.com          | Site of the Month, Jul 2026     | Work as rows: name, what was done, 3 screens                              | Plain labels, 14 px+                                 | Grain video hero, agency hype line              |

Tried and dropped: raviklaassens.com (long loader). Lesson: no loader.

## Cut list (don't build these)

1. ~~Blog~~ back in, live at launch (2026-10-29), with 3 posts Criztian writes; being designed in the Claude app. 2. ~~Case-study pages~~ back in (2026-10-29): one template for both projects, being designed in the Claude app. 3. Testimonials (none real yet). 4. Contact form (booking link only). 5. FAQ (How it works + Prices answer the worries). 6. "Why me" section (merged into How it works). 7. About page (one section). 8. Closing CTA section (the footer is the CTA). 9. Terms page. 10. Giant name in the footer. 11. Loader / intro screen. 12. Location badge (the Philippines is kept quiet). 13. The "43 sites" stat (NDA). 14. A "Let's connect" section (socials are a footer row). 15. Work "Skip to How it works" link (the nav already jumps there).

## Giant type check

- Hero name: CRIZTIAN (8 letters, one line, full width). Phone: CRIZ / TIAN. Check at 390 and 360.
- Hero promise: 47 characters, max 3 lines on phone.
- Longest big number: 24h / 4+ (About), longest price $1,500 / $2,500 / $4,000 (6 characters).
- Footer h2: 28 characters, max 3 lines on phone.
