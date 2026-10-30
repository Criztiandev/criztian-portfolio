# Website plan — Criztian portfolio

Copy below was pulled from the Figma text layers (file `SBq7maOIwqSa2V8MRCVSXz`, page Design `39:2`) on 2026-10-29. Use it word for word. Text in `[brackets]` is a labeled placeholder waiting on Criztian: keep them visible and labeled, never invent the value.

## Setup

| Question        | Answer                                                                                                                                                                                                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Experience type | **Mix:** scroll-driven on the hero and Work only (desktop; tablet and phone have no pin), light motion everywhere else                                                                                                                                                                                                              |
| Page max        | Page max **1920**, content max **1840** (40 px gutters), centered above 1920; black bands stay full-bleed. The big parts stretch to 1840 (the hero name, giant section words, screenshots, grids); reading text stays at most 720 px wide. Drawn frames: Phone 390, Tablet 768, Desktop 1440, Large 1920 (fourth pack, 2026-10-29). |
| Live or demo    | Live, for real prospects                                                                                                                                                                                                                                                                                                            |
| Main action     | "Book a call" opens Cal.com over the page: https://cal.com/criztian/discovery (free, 20 minutes, Cal Video). No contact form                                                                                                                                                                                                        |
| Proof           | Concept redesigns only. No testimonials until a real client gives one                                                                                                                                                                                                                                                               |
| Prices          | "From" price per package: Starter $1,500 · Standard $2,500 · Premium $4,000 (pricing step, 2026-10-29)                                                                                                                                                                                                                              |
| Roudon-Smith    | Screens on the site, labeled concept, no live link                                                                                                                                                                                                                                                                                  |
| Page title      | Criztian — Custom websites for small businesses.                                                                                                                                                                                                                                                                                    |

Pages: Home, case studies (`/work/[slug]`), Blog (`/blog`, `/blog/[slug]`), 404, Privacy. Nav anchors: `#work`, `#how-it-works`, `#prices`.

## Sections, in page order

### 0 · Nav (sticky)

- Left: short mark **C.** (red period) → top of page.
- Middle: **Work** · **Prices** → `/#prices` · **Blog** → `/blog` (fourth pack: 3 links, "How it works" stays on the page but leaves the nav). The phone and tablet menus list the same 3.
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
  - Link: **Read the case study** → `/work/roudon-smith` (added 2026-10-29, third pack)
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

### 5b · Blog (latest 3, fourth pack)

- h2: **Blog** (Display/L desktop + tablet, H1 phone) + intro: Straight answers about your website: what it costs, what it should show, and how to keep it yours.
- The 3 newest posts from the CMS as rows (same row as the blog list: title H2 + date · reading time, summary on the right on desktop, stacked on tablet + phone; hairline above each; whole row is one link).
- Link **All posts** → `/blog`.
- Rule: the section is hidden until at least 3 real posts are published.

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
- Button (red): **Book a call** · Or email criztiandev@gmail.com.
- Socials (Smoke, arrow up-right, new tab): **LinkedIn** → https://www.linkedin.com/in/criztian-jade-tuplano-036b85258/ · **Instagram** → https://www.instagram.com/criztiandev · **Facebook** → https://www.facebook.com/criztiandev
- Bottom bar: © 2026 Criztian. · **Blog** → `/blog` · **Privacy** → `/privacy`

## Case study pages (`/work/[slug]`)

Figma: see docs/build-plan.md, "New pages (third pack)". One template, filled per project from `src/data/*.data.ts`. Roudon-Smith first (`/work/roudon-smith`). J&T (`/work/jnt-express`) gets the same template once Criztian writes its copy. Tone: respectful, "what I'd change and why", never trashing the business.

1. **Header** — h1: **Roudon-Smith Winery: the wine club first.** Sub (Body/Large): A concept redesign of a Saratoga winery's website, built around one action: joining the wine club. Not a paid project, and not affiliated with Roudon-Smith Winery. Meta (Label, Smoke): Concept redesign · Winery · Saratoga, CA · Design only. Image: `work/roudon-smith-home-desktop.jpg` (16:10).
2. **The business** — h2: The business. Body: Roudon-Smith has poured wine in Saratoga, California, since 1972. Two Silicon Valley engineer families started it. Today it's a small winery with a tasting room on Big Basin Way, an online shop, and a wine club that releases wine three times a year. / The goal I set: get more Bay Area locals to join the club. The current site doesn't make that easy.
3. **Before** (the page's one Paper White band, black text) — h2: **BEFORE** (Display/XL on desktop + tablet, Display/L on phone). Intro: Their site has served them for years. Here's what I'd change. Screens (their live site, captured 2026-10-29): `work/roudon-smith-before-home.png` "Their home page today." · `work/roudon-smith-before-club.png` "Their wine club page today." (16:10, side by side on desktop, stacked on tablet + phone). 3 notes (H2 + Body, hairline above each): **Nothing leads.** Three links share the first screen: events, wholesale and the club. · **The club has no price.** The club page lists the perks but no price. It also asks for a comment and an address, even if you pick up. · **Hard to tell what's for sale.** The wine list goes back to 2013 and uses shop codes, and some of those wines aren't in the shop anymore.
4. **After** — h2: **AFTER** (Display/XL on desktop + tablet, Display/L on phone). Intro: Each change answers one of the notes above. Then 3 rows, one per BEFORE note, in the same order (hairline above each). Desktop: text column 440 px on the left, screen on the right (fills the rest). Tablet + phone: text, then the screen, full width. The rows are the page's signature moment and replace the old separate "Why" section.
   - **One action per screen.** Before, three links shared the first screen. Now there's one button, "Join the wine club", with the tasting room hours under it. The menu went from 8 links to 3. Screen: `work/roudon-smith-after-one-button.png` (16:10). Phone: `work/roudon-smith-home-phone.png` cropped to 4:5, starting 20% down, so the headline and the button show.
   - **Real numbers.** Before, the club page showed no price. Now each size shows the bottles a year and an estimated price per release, worked out from their real bottle prices ($25 to $35, members $20 to $28) and labeled as an estimate. Screen: `work/roudon-smith-club-desktop.png` (9:4, the full size row, nothing cut). Phone: `work/roudon-smith-after-sizes-phone.png` (13:12, the 2-bottle box). "Most members pick this." in the screen comes from their own site ("#1 choice for club members").
   - **Only wines you can buy.** Now only the 5 wines in their shop today show, each with its price and member price. Their label sets the look: paper white, the gold amphora, label-style capitals, and their real bottle rebuilt in 3D from shop photos. Screen: `work/roudon-smith-wine-detail.png` (4:3). Phone: `work/roudon-smith-wine-phone.png` cropped to 4:5 from the top.
5. **What I'd measure** — h2: What I'd measure. Intro: It's a concept, so there are no results yet. If it went live, I'd track these 3 things. Items (H2 size, hairline above each): Club sign-ups a month · Taps on directions and hours · Clicks through to their shop.
6. **Next case study** — h2: **Next: J&T Express, tracking first.** + Links **Read the case study** · **All work** → `/#work`. Until the J&T page is live, the band hides its heading and "Read the case study" and shows only "All work".
7. **Footer** — same as Home.

Alt text: "Roudon-Smith Winery's current home page", "Roudon-Smith Winery's current wine club page", "Redesigned first screen with one button", "Redesigned club sizes with estimated prices", "Redesigned wine slider with current wines".

## Blog (`/blog`, `/blog/[slug]`)

Data: the CMS post collection (title, slug, summary, body, publishDate, visible). Reading time is worked out from the body (about 200 words a minute). Posts have no images (the collection has no image field). The Figma copy is a sample: real posts come from the CMS. The 3 titles in Figma are working titles (planner drafts): "What a small business website really costs", "How to keep your website if your designer disappears", "What your website should show on the first screen".

- **Blog list** — h1: **BLOG** (Display/XL desktop + tablet, Display/L phone) + intro: Straight answers about your website: what it costs, what it should show, and how to keep it yours. The newest post is big: title Display/L (H1 on phone), summary Body/Large, meta "Nov 16, 2026 · 4 min read" (Body, Smoke), Link **Read the post**. Older posts are rows: title H2 with the meta under it, summary on the right (desktop), stacked on tablet + phone. Hairline above each post. Whole post is one link. No pagination, categories, tags or search until there are 10+ posts.
- **Blog post** — h1: the title (Display/L, H1 on phone). Meta (Smoke): date · N min read · By Criztian, as a left rail on desktop, one line on tablet + phone. Body column max 720 px: summary as the lead (Body/Large); p = Body/Base; h2 = Heading/H2 with 24 px extra space above; h3 and smaller = Body/Large, Semi Bold (not drawn); ul = 6 px Paper White squares; ol = numbers; blockquote = a big Anton line (Heading/H1 at every size), 24 px of space above and below (40 px on phone), no side line (the post's one big moment); table = hairline rows, header row in Label (Smoke); on phone each table row stacks (cells one under another) and the header row hides; links underlined. End of post: hairline, the About photo (80 × 100) and "Written by Criztian. I design and build websites for small businesses, and I write here about what works." Then a **Next post** band (h2 title + Links **Read the next post** · **All posts** → `/blog`), then the footer. No extra call-to-action band (the footer is the call to action).
- Headings everywhere use `text-wrap: balance`, so no last word sits alone on its line.

## States and other pages (Figma States board `44:33`)

- **Phone / tablet menu** (`44:38`, `44:62`): see Nav.
- **Nav** (`44:84`): over the hero = no bar; after scroll = black bar with a Graphite hairline. Desktop: hides on scroll down, comes back on scroll up.
- **Hover + focus** (`44:165`): red button → Paper White with black text (150 ms); links underline, arrow moves 4 px; focus = 2 px Paper White ring, 2 px gap.
- **Booking popup** (`45:123`): opens over the page from any Book a call button. Desktop = 720 px panel over a black 80% backdrop; phone = full screen (`67:309`, `67:322`). Close = 44 px icon button.
  - Loading: **Book a call** · Loading times…
  - Error: **The calendar didn't load.** Email me at criztiandev@gmail.com and I'll reply within 24 hours. · Link: **Email criztiandev@gmail.com**
  - The Cal.com screens themselves are not drawn.
- **404** (`45:191`): **404** · This page doesn't exist. · Buttons: **Book a call** · **Back to home**
- **Privacy** (`45:220`, updated 2026-10-29): Privacy · Last updated: [launch date]. If this page changes, this date changes too. If something big changes, I'll also say so at the top of this page. · **What I collect** — When you book a call, the booking tool asks for your name, your email and any notes you add. I use them only to hold the call and reply to you. I don't sell your data. · **Who else sees it** — Cal.com runs the booking, so it keeps your booking details under its own privacy policy. The company that hosts this site keeps basic server logs, like any website. If you email me, your message stays in my inbox. No one else gets your details. · **Visit counts and cookies** — This site counts visits with [analytics tool, named before launch], which doesn't use cookies. There are no ad or tracking cookies, and nothing here follows you to other sites, so a "Do Not Track" setting changes nothing. The booking popup comes from Cal.com, which may set its own cookies so booking works. · **Your choices** — Email me to see, fix or delete the details I have about you. I'll reply within 24 hours. · **Questions** — Email me at criztiandev@gmail.com with any question about your data. Rule: the analytics tool must not use cookies, or this page is wrong.
- Not drawn, on purpose: form states (no form), empty states (nothing can be empty), Terms (sells nothing directly), age check.

## Motion (from the Motion states board `58:221`)

Claude Code builds motion from these notes (Figma prototype interactions can't be read by code).

The motion thesis in DESIGN.md "Motion" (approved 2026-10-29) wins wherever this table differs. Each row is updated to what shipped when its section's run is done.

| Moment                      | Trigger                               | What moves                                                                                                                                                                                                                                                                              | Duration · easing                                                       | Board frames                    |
| --------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| Load                        | page load                             | Frame 1 is all black. The portrait rises from below its clip, dim (30%), and CRIZTIAN rises letter by letter, dim (20%); both light up from 1.1 s, the name from the center out. From 1.4 s the headline words rise, then the nav drops in and the sub, buttons and note rise.          | letters 1.2 s · light 0.9 s · portrait 1.4 s · words 1.1 s · copy 1.0 s | `59:285` → `59:311`             |
| Hero portrait hover         | hover (devices with hover only)       | The photo is black and white at rest and shows its real color on hover.                                                                                                                                                                                                                 | 600 ms · ease-out                                                       | —                               |
| Hero name hover             | hover (devices with hover only)       | The letter under the cursor dims to 20%, then lights back up when the cursor leaves.                                                                                                                                                                                                    | dim 300 ms · ease-out · relight 900 ms · ease-in-out                    | —                               |
| Nav, load                   | page load, every page                 | Logo, links, then Book a call drop 24 px from above and fade in, 120 ms apart. Home: from 1.6 s, after the lights. Other pages: from 200 ms.                                                                                                                                            | 1000 ms · ease-out                                                      | —                               |
| Hero exit (mouse or trackpad) | scroll, scrubbed both ways          | No pin. As the hero scrolls away, CRIZTIAN slides left 0.16 px per px of scroll behind the portrait, which scrolls with the page. The headline words rise out of their masks in reading order, then the sub, buttons and note rise out, all gone by 460 px while Stakes inks from 250. Nothing dims. Was Figma's 1-screen pin; Criztian picked "Layers" of 3 lab concepts (2026-10-29), then calmed it with "Soft" (2026-10-30): the name slid 0.4 px per px and the portrait sank 0.3, dennissnellenberg.com's numbers, and the two layers moving against each other are the likeliest to make a visitor dizzy. | tied to scroll, linear: name −160 px over 0–1000 px; words 150 px each, 30 px apart from 0; copy 200 px each, 100 px apart from 60 | `59:311` → `59:337`             |
| Hero, phone and touch       | load                                  | Same load as desktop, on the stacked CRIZ / TIAN. No pin, no exit.                                                                                                                                                                                                                      | same as Load                                                            | Phone frame                     |
| Stakes reveal               | scroll, scrubbed both ways            | Headline words wait at 20% and ink to full black in reading order as the band scrolls in, about 5 mid-ink at once; the body rises 24 px and fades in after the last word. Scrolling back up un-inks them. Was "30% in view, once" (Criztian, 2026-10-29: "when I scroll").             | tied to scroll, linear: words 250–660 px after the band's top enters, 150 px each; body 600–800 px | `58:296` → `58:299`             |
| Work hold "Long road" (mouse or trackpad, 1280 × 720 and up) | scroll, scrubbed both ways | WORK rises letter by letter and lights, the label rises. The section holds for 2 screens (the story is 3 screens, 1 per row). The 3 projects' screens ride one column that climbs without stopping. Each set lights (brightness 0.3 → 1) as it reaches its Figma place, desktop, phone, then detail, and dims as it leaves. The phone column moves at 0.9×. The matching row lights from Smoke and its detail opens with a clip while the rows below slide down. "Your place"'s dashed frames draw in, then Book a call rises last (lamalama.com's clip reveal). Screens in a link lift to 1.02 on hover. Was Figma's timed swap. Criztian picked concept 3 of 3 on the lab (2026-10-29). | tied to scroll, linear, % of the story (300svh): sets in place at 34 / 62 / 90%; lights 7% each, 4% apart; rows switch 40–56% and 68–84%; frames draw 66–82%; Book a call 84–94%; letters 200 px each, 40 px apart, from 120 px | `58:310` → `58:333` → `58:356` |
| Work, touch and every other screen | scroll, scrubbed both ways     | No hold; rows stacked, all lit. WORK rises letter by letter, the label rises, and each screen rises from below its own clip as it comes fully on screen (no brightness change).                                                                                                          | tied to scroll, linear: letters as desktop; each screen 250 px after it is fully on screen | Tablet `48:196`, Phone `49:217` |
| How it works "Stairs"       | scroll, scrubbed both ways            | "How it works" rises word by word from its mask and lights. Desktop (1280 and up): the 3 steps climb in at different heights, like stairs, and land in order; in each step the number, title and body rise from 48 / 64 / 80 px below the step's clip, so they close up as they land, and the step lights from 20% as it lands. Then its line draws left to right in Smoke over the Graphite track. Under 1280 (touch included): stacked, each step makes the same move as it comes on screen, one at a time. Criztian picked concept 2 of 3 on the lab (2026-10-30); the depths were 160 / 200 / 240 px until the calm pass "Soft" (2026-10-30). | tied to scroll, linear: words 150 px each, 40 px apart, from 180 px; steps 300 px each, 120 px apart from 300 px (desktop) or from each step's own entry (stacked); light the last 150 px; line 60 px before landing → 90 px after | —                               |
| About "Echo"                | scroll, scrubbed both ways            | The hero load, replayed by the scroll. "Hi, I'm" rises word by word from its masks and "Criztian." letter by letter, like the hero name, each lighting from 20%. The photo rises 25% of its height inside its frame (the whole height until the calm pass "Soft", 2026-10-30) and lights from 30%. The body rises 24 px. The 3 red numbers rise from their masks one by one and light; each label rises after its number. Touch and under 1280: the photo stays still, the text moves the same way as each block comes on screen. Criztian picked concept 1 of 3 on the lab (2026-10-30). | tied to scroll, linear: words 150 px each, 40 px apart, from 180 px; letters 30 px apart; photo 300–700 px, light 450–700; body 180–380 px after its own top enters; numbers 200 px each, 120 px apart from 600 px (desktop), labels 80 px after | —                               |
| Blog "Write" (Home)         | scroll, scrubbed both ways            | "Blog" rises letter by letter from its mask and lights from 20%; the intro rises 24 px. Each row's title is written letter by letter, like the hero and About names: every letter rises from its word's mask and lights. Then the date and the summary rise. "All posts" rises last. Rows lift 1.01 on hover (devices with hover only). Touch: the titles rise word by word. Criztian picked concept 3 of 3 on the lab (2026-10-30). | tied to scroll, linear: heading letters 150 px each, 40 px apart, from 180 px; intro 300–500 px; title letters 150 px each, 6 px apart, from 120 px after the row's top enters; date when the last letter starts, summary 60 px later, 200 px each; hover 400 ms spring | —                               |
| Prices "Open"               | scroll, scrubbed both ways            | "PRICES" rises letter by letter from its mask and lights from 20%; the sub rises 24 px. Each card is uncovered top-down, one after another, and its name, summary and include rows light from 20% as the edge passes them. Each price rises from its mask last, "From" lighting with it. The notes rise, then Book a call rises last. The cards never answer the pointer. Touch: each card opens and its price rises; nothing else inside moves. Criztian picked concept 1 of 3 on the lab (2026-10-30). | tied to scroll, linear: heading letters 150 px each, 40 px apart, from 180 px; sub 300–500 px; 1280 and up: cards open over 360 px from 560 / 660 / 760 px, lights 150 px each from 5 / 40 / 47% of the open (rows 8% apart), price at 83%; stacked: each card on its own timeline, open over 240 px from 300 px after its top enters; notes 200 px each from 100 px after their block enters, 100 px apart; Book a call 400–550 px | —                               |
| Footer "Sign-off"           | scroll, scrubbed both ways            | The hero name's move one last time. "Let's talk about your place." is written letter by letter: each letter rises from its word's mask and lights from 20%. Then "Or email" rises word by word, the email and the 3 socials rise from their clips, and Book a call rises dim and lights last, the last light on the page. The bottom bar stays still. Touch and under 1280: the heading rises word by word, then Book a call rises and lights; nothing else moves. Same footer on `/blog`, posts and the case study. Criztian picked concept 2 of 3 on the lab (2026-10-30). | tied to scroll, linear: letters 150 px each, 3.5% of the heading's height apart (10 px at 1440), from 170 px after the heading's top enters (touch: words 15% apart); after the Book a call row's top enters: Book a call rises 10–160, lights 120–270 (touch 100–250); "Or email" 30 / 50, email 70, socials 75 / 95 / 115, 150 px each | —                               |
| Case study "Open" (`/work/[slug]`) | load, then scroll, scrubbed both ways | The page draws itself like a browser loading, the Prices open carried to the screens. Load: the title rises word by word from its masks and lights from 20%, the sub and meta rise, and the big screen opens top-down. Scroll: every screen opens top-down and its caption lights as the edge reaches it; BEFORE and AFTER rise letter by letter, the other headings word by word; paragraphs open top-down line by line; the 3 notes open one after another, their title and body lighting with the edge; each change's title rises word by word; the measure items rise one by one; All work rises last. Touch and under 1280: the load, the headings (BEFORE / AFTER as whole words), the screens and notes opening, the measure items and All work; paragraphs, captions and change titles stay still. Criztian picked concept 2 of 3 on the lab (2026-10-30). | load: title words 1.1 s rise, 0.9 s light, 90 ms apart from 200 ms; sub / meta 1.0 s from 900 / 1050 ms; screen 2 s from 500 ms (first 45% ease-out over 1.4 s, rest linear). Scroll, tied to scroll, linear: screens 360 px (240 under 1280) from 200 px after their own top enters, second BEFORE screen +120; captions 150 px from 100 (+120); headings 150 px each, 40 px apart from 180; paragraphs 240 px from 180 after their own top enters; notes 240 px from 150, 100 apart, title / body light from 150 / 240; change title words 30 px apart from 250; measure items 120 px apart from 400; All work 120–270 | —                               |
| Blog pages "Open" (`/blog`, `/blog/[slug]`) | load, then scroll, scrubbed both ways | The case study's page loading carried to the blog. List: "BLOG" rises letter by letter and lights, the intro rises, the newest post opens top-down and its title, summary, meta and Read the post light as the edge passes; each older row opens top-down as you reach it, its title, summary and meta lighting with the edge. Post: the title rises word by word and lights, the rail and the lead open, then the article opens top-down; on scroll every paragraph, list line and table cell opens, each h2 rises word by word, the quote opens slowly, the author photo opens and its note lights; the Next band's title rises word by word and its links rise last. Rows lift 1.01 on hover. Touch and under 1280: the load, the row and quote opens, the h2 words, the photo and the Next band; paragraphs, list lines, table cells and the lights stay still. Criztian picked concept 2 of 3 on the lab (2026-10-30). | load: letters / title words 1.1 s rise, 0.9 s light, 90 ms apart from 200 ms; intro 1.0 s at 900 ms; newest post opens 1.4 s from 500 ms, lights at 500 / 750 / 800 / 1000 ms; rail / lead open 1.4 s from 900 / 1000 ms; article 2 s from 1100 ms (first 50svh ease-out over 1.4 s, rest linear). Scroll, tied to scroll, linear: rows open 240 px from 120, lights 150 px from 160 / 180 / 240; paragraphs 200 px, list lines and cells 150 px, from their own top entering; h2 words 25 px apart from 0; quote 360 px; photo 40–280, note 80–230; Next title words 40 px apart from 180, links after the last word, 40 apart | — |
| 404 "Stairs"                | page load                             | How it works' stairs on the one screen (no scroll, no footer). The 3 digits of "404" climb in from different depths below their mask, like stairs, land in order and light from 20% as they land. The message words climb from growing depths and close up as they land, Back to home climbs, and Book a call climbs dim and lights last. Touch: the digits and Book a call; the message and Back to home stay still. Criztian picked concept 3 of 3 on the lab (2026-10-30). | `--ease-out`: digits 1.6 s from 110 / 140 / 170% of their height, from 200 / 320 / 440 ms, light 0.9 s from 600 ms after each rise; words 1.4 s from 110–200% at 1.2 s, light from 1.6 s; Back to home from 1.5 s (light 1.8 s); Book a call from 1.65 s, light from 2.3 s, done 3.2 s | — |
| Privacy "Open" (`/privacy`) | load, then scroll, scrubbed both ways | The blog pages' open on the privacy page. Load: "Privacy" rises letter by letter and lights from 20%, the date rises, and the sections column opens top-down. Scroll: each section opens top-down as you reach it, its heading rises word by word from its masks and lights, and its body lights from 20% as the edge passes. The footer bar stays still. Touch and under 1280: the load and the section opens; headings and bodies stay still. Criztian picked concept 1 of 3 on the lab (2026-10-30). | load: letters 1.1 s rise, 0.9 s light, 90 ms apart from 200 ms; date 1.0 s at 900 ms; column 2 s from 1100 ms (first 50svh ease-out over 1.4 s, rest linear). Scroll, tied to scroll, linear, from each section's top entering: open 20–220 px; heading words 150 px each, 20 px apart from 30; body light 90–240 | — |
| Smooth scroll               | wheel or trackpad (desktop)           | The page glides to a stop instead of stepping: Lenis, the same feel as lurais.framer.website (Criztian, 2026-10-29). Same-page links (Work, Prices) glide too. Phones keep their own touch scroll. Shortened from Lurais's 2 s in the calm pass "Soft" (Criztian, 2026-10-30), so the page stops soon after the hand does. | 1.2 s · ease-out-expo (Lenis default); a 300 px wheel step at 99% in 749 ms (was 1222) | —                               |
| Nav hide (every size)       | scroll                                | Past 80 px, the nav slides up out of view while the page moves down and slides back on any move up. Keyboard focus brings it back. Every size (Criztian, 2026-10-29; first planned for desktop only).                                                                                   | 300 ms · ease-out                                                       | —                               |
| Reduced motion              | the visitor's "reduce motion" setting | No pins, no slides, no fades. Hero = the scroll-0 still. Stakes fully lit. Desktop Work = the stacked layout (same as tablet). The stacked layout is also the fallback when the scroll script fails. Wheel steps settle in ~0.1 s, links jump; the nav moves without sliding. Checked on every page 2026-10-30: 0 running animations, everything lit. | —                                                                       | `59:311`, `58:412`              |
| Breather (Home)             | —                                     | Black room between the home sections so each one arrives alone: a gap between the sections, not padding inside them, so no scroll range moves. Criztian, 2026-10-30: "add spaces between so they enjoy scrolling", then "minus at least 100" on the lab's 50svh. | 25svh at 1280 and up (225 px at 900 tall), 12svh below (101 px at 844), after 35svh was "still too far" | —                               |
| Everything else             | enters view, once                     | Fade up. Hover per the States board.                                                                                                                                                                                                                                                    | fade 300 ms, hover 150 ms · ease-out                                    | `44:33`                         |

Easing (judgment): ease-out = `cubic-bezier(0.22, 1, 0.36, 1)`.
Rule (value #1): if the motion slows the phone page, the motion goes, not the speed.
Keyboard: the pinned Work section must never trap focus.

Motion for the case study and blog pages: Criztian directs it himself in Claude Code (2026-10-29). The case study is done ("Open", 2026-10-30), and so are the blog pages ("Open", 2026-10-30).

### Reference motion: lurais.framer.website

Read from its Framer bundle on 2026-10-29. Method: download the page and its `framerusercontent.com/sites/…/*.mjs` modules, grep the page module for `__framer__enter`, `__framer__animate`, `__framer__exit`, `__framer__threshold`, `__framer__animateOnce` and the text `effect` object, then resolve each variable to its object. The runtime (`framer.*.mjs`) shows how a text effect splits and staggers.

| Move          | Where                                    | From → to                                   | Timing                                     | Trigger                                                  |
| ------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Text effect   | 4 body paragraphs                        | each line 20% → 100% opacity, no movement   | spring 2 s, bounce 0.25; lines 0.1 s apart | 50% in view, once                                        |
| Block appear  | 19 blocks (headers, text wrappers, boxes) | opacity 0, 10 px below → in place           | spring 1 s, bounce 0.2                     | 50% in view (28 of 40) or 100%; 27 once, 13 replay       |
| Slide appear  | 12 elements                              | opacity 0, 30 px left → in place            | spring 0.4 s, bounce 0.2                   | in view                                                  |
| Rise appear   | 7 elements                               | opacity 0, 100 px below → in place          | spring 1 s, bounce 0.2                     | in view                                                  |
| Load          | nav links                                | opacity 0, 20 px above → in place           | spring 1.4 s after 1 s                     | page load                                                |
| Line          | dividers                                 | 2 px line draws to full width               | spring 2 s, bounce 0.2, after 0.2 s        | in view                                                  |
| Hover         | work cards, social links                 | scale 1.01–1.02                             | spring 0.4 s, bounce 0.2                   | hover                                                    |
| Smooth scroll | page                                     | Lenis `duration: 2`                         | —                                          | wheel                                                    |

What we take (judgment): one motion vocabulary everywhere, small distances, long soft timings, and text that waits dim instead of popping in from nothing. What we do differently: Lurais only triggers on view; the Stakes headline follows the scroll, because Criztian asked for it.

### Reference motion: dennissnellenberg.com

Read from his code on 2026-10-29: `index.html`, `assets/js/index-new.js` and `assets/js/locomotive-scroll.min.js` (GSAP 3.9.1 with ScrollTrigger, Locomotive Scroll with its default lerp 0.1, Barba). Locomotive divides `data-scroll-speed` by 10, and at `data-scroll-position="top"` moves an element by scroll × −speed.

| Move       | Where                 | From → to                                              | Timing                                                        | Trigger |
| ---------- | --------------------- | ------------------------------------------------------ | ------------------------------------------------------------- | ------- |
| Name slide | `.name-h1`            | sideways, 0.4 px left per px of scroll (speed 4)        | scrubbed, smoothed by Locomotive                               | scroll  |
| Name loop  | `.name-wrap`          | cloned, xPercent 0 → −100, endless                      | 18 s, linear; flips direction with the scroll direction        | always  |
| Photo      | `.personal-image`     | 0.3 px down per px (speed −3), so it leaves slower      | scrubbed                                                       | scroll  |
| Label      | `.header-above-h4`    | 0.1 px up per px past its center (speed 1)              | scrubbed                                                       | scroll  |
| Arrow      | `.home-header .arrow` | rotate 0 → 90°                                          | the header's bottom from screen bottom to top; desktop only    | scroll  |
| Load       | `.once-in`            | y 50vh (10vh at 540 px and below) → 0                   | 1.5 s, Expo.easeOut, 0.07 s apart, after a loader              | load    |
| Hold       | —                     | none: 0 pins in the code                                | —                                                              | —       |

What we take (judgment): the layers moving at different speeds, as the hero exit. What we skip: the endless loop (the thesis bans ambient loops) and the loader (cut list).

### Reference motion: lamalama.com

Read from its code on 2026-10-29: the WordPress theme's Vite bundle (`main-*.js`, `scripts-*.js`, `app-*.js`), the `case_item` and `case_highlighted` modules and `main-*.css`. GSAP with its Flip plugin, Swiper for the image strip, Swup for page changes. The Home case list is 7 `<button>` rows: a 20% hairline on top, the name, tags, "( View + )", a 120 px description and 96 px thumbnails on the right.

| Move         | Where                          | From → to                                                                                         | Timing                                                                      | Trigger                                              |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| Row open     | `.js-case-item`                | the row's 96 px thumbnails fly (Flip) into a 400 px tall strip; strip height 0 → 456 px; "View case" fades in; the description text reveals | Flip expo.out 0.95 s, images 0.1 s apart; height power4.out 1.05 s; button 0.75 s | click, 1000 px and wider                             |
| Row close    | `.js-case-item`                | the same backwards; description back to 120 px                                                    | expo.out 0.95 s; images fly back 0.75 s, 0.08 s apart                        | click                                                |
| Row hover    | "View" label                   | the word scrambles in from `#$*@` characters; the gap before "+" widens 0 → 6 px                   | power4.out 0.45 s                                                           | mouse only                                           |
| Sticky button | "Start a project"             | `clip-path: inset(0 0 80% 0)` → `inset(0)`, y 80% → 0, scale 0.98 → 1, opacity 0 → 1               | expo.out 0.55 s                                                             | the list's top passes 80% of the screen, both ways   |
| Touch        | rows under 1000 px or on touch | always open, no motion                                                                            | —                                                                           | —                                                    |
| Hold         | —                              | none: no pin and no scrub on the list (its only ScrollTrigger toggles the sticky button)          | —                                                                           | —                                                    |

What we take (judgment): the Flip, a row's screens growing out of the row into place (Work concept 2 "Grow", scrubbed instead of on click), and the button's clip reveal for "Your place"'s Book a call. What we skip: the scramble (off our calm voice), animating height (banned move 9) and click-to-open (the thesis has rows follow the scroll).

## Awwwards references (Figma Moodboard page, board `29:2`)

| Site                  | Award                           | Adopt                                                                     | Improve                                              | Skip                                            |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| dennissnellenberg.com | Site of the Day, Apr 4, 2022    | Giant name behind the portrait that slides on scroll                      | A plain promise and red "Book a call" above the fold | Grey ground, location pill, lowercase name      |
| codebyjesse.com       | Honorable Mention, May 12, 2026 | Dark page, one accent, project button always top right, short proof strip | Only true numbers; plain headline                    | Autoplay video hero, serif italics, award badge |
| lamalama.com          | Site of the Month, Jul 2026     | Work as rows: name, what was done, 3 screens                              | Plain labels, 14 px+                                 | Grain video hero, agency hype line              |

Tried and dropped: raviklaassens.com (long loader). Lesson: no loader.

## Cut list (don't build these)

1. ~~Blog~~ back in, live at launch (2026-10-29), with 3 posts Criztian writes; being designed in the Claude app. 2. ~~Case-study pages~~ back in (2026-10-29): one template for both projects, being designed in the Claude app. 3. Testimonials (none real yet). 4. Contact form (booking link only). 5. FAQ (How it works + Prices answer the worries). 6. "Why me" section (merged into How it works). 7. About page (one section). 8. Closing CTA section (the footer is the CTA). 9. Terms page (terms and refunds live in the client contract; cookies are a section inside Privacy, decided 2026-10-29). 10. Giant name in the footer. 11. Loader / intro screen. 12. Location badge (the Philippines is kept quiet). 13. The "43 sites" stat (NDA). 14. A "Let's connect" section (socials are a footer row). 15. Work "Skip to How it works" link (the nav already jumps there).

## Giant type check

- Hero name: CRIZTIAN (8 letters, one line, full width). Phone: CRIZ / TIAN. Check at 390 and 360.
- Hero promise: 47 characters, max 3 lines on phone.
- Longest big number: 24h / 4+ (About), longest price $1,500 / $2,500 / $4,000 (6 characters).
- Footer h2: 28 characters, max 3 lines on phone.
