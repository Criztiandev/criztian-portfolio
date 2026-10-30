# Build plan — Criztian portfolio

**Last pack:** 2026-10-29, third pack (case study + blog + privacy), on commit `0c62aa3`. Earlier: second pack (pricing) before the fresh repo; first pack on template commit `fcec601`. Fresh repo first commit: `30e5a37`.

**Fourth pack (2026-10-29):** page max 1440 → 1920 (content 1840, Large frames drawn), nav = Work · Prices · Blog, a Home blog section (latest 3). See the 3 new Phase 4 boxes and "Large 1920 frames".

**Changes since Phase 4 started (third pack):** the Home footer bottom bar gets a **Blog** link before Privacy; the Roudon-Smith Work row gets a **Read the case study** link; new pages below (case study, blog list, blog post); new Privacy copy. Build them as the new Phase 4 boxes. After the design review (round 1, 2026-10-29): no back link above the page titles ("All work" and "All posts" sit next to the Next links at the bottom); the club screenshot now shows the full size row; the case study AFTER is now 3 paired rows (the "Why" section is gone); blog quotes are a big Anton line; the contact email everywhere is criztiandev@gmail.com (update the Home footer and the booking error text if they say hello@criztian.dev); links have no inside inset (the text sits on the gutter line) and a tap area at least 44 px tall on touch screens.

Build one phase per run, in order. Plan first, wait for Criztian's OK, then build. Tick the boxes as you go.

## Figma

- File key: `SBq7maOIwqSa2V8MRCVSXz` (https://www.figma.com/design/SBq7maOIwqSa2V8MRCVSXz)
- Page **Design** `39:2` holds the frames below. Tokens, text styles and components live on page **Brand** `1:3`.
- Page max 1920 (fourth pack): Large 1920 frames exist; see "Large 1920 frames" below.

### Frames and section node IDs

| Section          | Phone 390 `49:195`                             | Tablet 768 `48:174`                            | Desktop 1440 `39:3`                        |
| ---------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| 0 · Nav (sticky) | `49:352`                                       | `48:333`                                       | `39:14`                                    |
| 1 · Hero         | `49:196`                                       | `48:175`                                       | `39:4`                                     |
| 2 · Stakes       | `49:214`                                       | `48:193`                                       | `39:41`                                    |
| 3 · Work         | `49:217` (rows `49:221` / `49:232` / `49:249`) | `48:196` (rows `48:200` / `48:211` / `48:228`) | `39:44` (rows `39:50` / `39:55` / `39:58`) |
| 4 · How it works | `49:264`                                       | `48:243`                                       | `40:31`                                    |
| 5 · About        | `49:282`                                       | `48:261`                                       | `40:46`                                    |
| 6 · Prices       | `49:297`                                       | `48:278`                                       | `40:63`                                    |
| 7 · Footer       | `49:343`                                       | `48:324`                                       | `40:110`                                   |

### Boards

- **States board** `44:33`: menus phone `44:38` / tablet `44:62` · nav states `44:84` · hover + focus `44:165` · booking popup `45:123` (desktop loading `45:126`, error `45:153`; phone loading `67:309`, error `67:322`) · 404 `45:191` · Privacy `45:220`.
- **Motion states board** `58:221`: Load + hero `58:292` (`59:285`, `59:311`, `59:337`) · Stakes reveal `58:306` (`58:296`, `58:299`) · Work pin `58:408` (`58:310`, `58:333`, `58:356`) · Reduced motion `58:458` (`58:412`).
- **Shots board** `47:174`: the framed J&T screenshots.

### New pages (third pack, 2026-10-29)

| Page                                                              | Phone 390                       | Tablet 768                     | Desktop 1440                   |
| ----------------------------------------------------------------- | ------------------------------- | ------------------------------ | ------------------------------ |
| Case study · Roudon-Smith (frame)                                 | `91:594`                        | `91:346`                       | `90:315`                       |
| 1 · Header                                                        | `91:595`                        | `91:347`                       | `90:316`                       |
| 2 · The business                                                  | `91:603`                        | `91:355`                       | `90:328`                       |
| 3 · Before (paper band)                                           | `91:608`                        | `91:360`                       | `90:333`                       |
| 4 · After (3 change rows: list `101:596` / `101:580` / `101:564`) | `91:629`                        | `91:381`                       | `90:354`                       |
| 5 · What I'd measure                                              | `91:650`                        | `91:402`                       | `90:375`                       |
| 6 · Next case study                                               | `91:661`                        | `91:413`                       | `90:386`                       |
| Blog list (frame)                                                 | `96:848`                        | `96:458`                       | `93:398`                       |
| 1 · Header / 2 · Posts                                            | `96:849` / `96:852`             | `96:459` / `96:462`            | `93:399` / `93:402`            |
| Blog post (frame)                                                 | `96:994`                        | `96:604`                       | `93:451`                       |
| 1 · Header / 2 · Article / 3 · Next post                          | `96:995` / `96:998` / `96:1059` | `96:605` / `96:608` / `96:669` | `93:452` / `93:459` / `93:520` |

Footers and navs in these frames are copies of Home's. Privacy (`45:220`) has new copy (5 sections). Home changes: Roudon-Smith Work row link "Read the case study" (`97:558` desktop, `97:563` tablet, `97:568` phone) and a "Blog" link before "Privacy" in every footer bottom bar.

### Large 1920 frames (fourth pack, 2026-10-29)

Page max 1920, content max 1840. Big parts stretch, reading text max 720. Text styles: `Display/Giant — Large` (576, clamp 456 at 1536 → 576 at 1920+) and `Display/XL — Large` (208, clamp 160 → 208).

| Frame                     | Large 1920 | Sections                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                      | `110:572`  | Hero `110:573` (1920 × 1080: name centered, portrait 720 × 1080 centered, promise bottom-left, sub + actions bottom-right) · Stakes `110:586` · Work `110:589` (stage: shots 588 wide, phone 380, list left, screens right) · How it works `110:612` · About `110:627` (photo 588 × 735) · Blog `110:643` · Prices `110:664` · Footer `110:718` · Nav `110:733` |
| Case study · Roudon-Smith | `110:965`  | Header `110:966` · Business `110:973` · Before `110:978` · After `110:999` · Measure `110:1019` · Next `110:1030` · Footer `110:1035`                                                                                                                                                                                                                           |
| Blog list                 | `110:1199` | Header `110:1200` · Posts `110:1203` · Footer `110:1220`                                                                                                                                                                                                                                                                                                        |
| Blog post                 | `110:1331` | Header `110:1332` · Article `110:1334` (rail + 720 body stay left-aligned) · Next `110:1395` · Footer `110:1400`                                                                                                                                                                                                                                                |

Home blog section (new, all sizes): Desktop `109:564` · Tablet `109:589` · Phone `109:614` · Large `110:643`. 404 and Privacy have no Large frame: they are text pages, so keep their content at 720 and center nothing new.

### Components (page Brand `1:3`)

- Button `34:91` — Size Large (52 px) / Small (44 px) × State Default / Hover / Focus; prop Label.
- Link `34:107` — State Default / Hover / Focus; props Label, Show icon, Icon.
- Icon button `34:120` — 44 px, State Default / Hover / Focus; prop Icon.
- Nav `34:184` — Device Desktop (80 px) / Compact (64 px) × State Top / Scrolled.
- Icons: Arrow down `34:63`, Arrow up-right `34:67`, Menu `34:71`, Close `34:75` (24 px). Logo/Mark `34:76`.

## Phases

### 1. Setup

- [x] Every realign item below fixed (config, data, routes, git, line endings) — except the ones moved to later phases (marked in the list).
- [x] Scripts run: `pnpm check` and `pnpm build`.
- [x] Anton + Inter load the project's way (`next/font/google`); no other fonts.
- [x] Figma connected (`get_metadata` answers on `39:4`).
- [x] The stack matches docs/architecture.md (CMS kept).

Done when: every check script passes.

Done 2026-10-29: `pnpm check` 46/46 unit tests, lint and typecheck clean; `pnpm build` passes; `pnpm test:e2e` 32/32 against the local stack. With Supabase down, `pnpm build` exits 0 in 8 s with 5 `[cms] Supabase is unreachable` fallbacks, and `/`, `/blog`, `/login` answer 200. Browser run of `/` at 390/768/1440/1920: 1 h1, no sideways scroll, 0 console errors, Anton heading + Inter body. Local Supabase is `project_id = "criztian-site"` on ports 56320-56329 (`criztian-portfolio` is taken by the discontinued repo's Docker volume).

### 2. Tokens

- [x] Figma variables (Primitives, Color, Layout) and the 12 text styles in the theme (Tailwind v4 `@theme` in `src/app/globals.css`) with the same numbers. See docs/brand.md.
- [x] `max-w-page` = 1440 px; gutters 16 / 32 / 40; radius 0 everywhere on the site.
- [x] Giant name sizes as `clamp()` between the min and max in docs/brand.md.
- [x] Dark only: no light theme, no theme toggle on the public site.

Done when: every Figma token has a matching theme value.

Done 2026-10-29: Figma `get_variable_defs` on `20:2` and `39:3` matched docs/brand.md, no new difference. `@theme` holds the 6 primitives, 6 semantic colors, 12 text styles (3 giant `clamp()`s: 222 px at 390, 220 at 768, 425 at 1440), `max-w-page` 90rem, `--radius: 0`, overlay shadow, ease and durations. `THEME_DEFAULTS` is the brand; forced dark on every path; `.dark` block gone. `pnpm check` 46/46, lint and typecheck clean; `pnpm test:e2e` 32/32 (theme tests rewritten to the brand palette). Browser run skipped: no layout changed and e2e asserts the page colors.

### 3. Components

- [x] Button (Large, Small; Default / Hover / Focus).
- [x] Link (with optional arrow icon; Default / Hover / Focus).
- [x] Icon button (44 px).
- [x] Nav (Desktop / Compact × Top / Scrolled) + the phone / tablet menu.
- [x] Icons as SVG components (arrow down, arrow up-right, menu, close) and the logo mark.
- [x] Temporary kit page showing all of them.

Done when: the kit page matches Figma at all sizes.

Done 2026-10-29: shadcn Button restyled through its cva (sizes `large` 52, `small` 44, `icon-large` 44, `link`; Paper invert on hover; 2 px inset Paper focus ring); menu on shadcn Sheet (base-ui Dialog); icons + LogoMark in `src/components/icons.tsx`; header rebuilt; kit at `/kit` (noindex, delete at review). Figma calls: 7. `pnpm check` 46/46; `pnpm test:e2e` 32/32 (menu + CMS canvas tests moved to the new labels). Browser at 390/768/1440/1920: nav 64/64/80/80, gutters 16/32/40, links gap 40, buttons 52/44, icon button 44, no sideways scroll, 0 console errors; menus match `44:38`/`44:62`; Escape returns focus to the trigger; scrolled bar black + graphite hairline at 80 px.

### 4. Sections (mobile-first, static, no motion)

- [x] 0 · Nav
- [x] 1 · Hero
- [x] 2 · Stakes
- [x] 3 · Work (desktop stage layout static on row 1; tablet / phone stacked)
- [x] 4 · How it works
- [x] 5 · About
- [x] 6 · Prices
- [x] 7 · Footer
- [x] Booking popup (Cal.com embed) with loading + error states, desktop and phone
- [x] 404 page
- [x] Privacy page (copy updated in the third pack: 5 sections, cookies included)
- [x] Home: Roudon-Smith row link "Read the case study" + footer "Blog" link (third pack). Footer Blog link done 2026-10-29 with Privacy (shared bar); row link still open.
- [x] Case study template `/work/[slug]`, filled for Roudon-Smith (third pack)
- [x] Blog list restyle (third pack)
- [x] Blog post restyle, every rich-text element (third pack)

- [x] Fourth pack: nav = Work · Prices · Blog (desktop nav + phone/tablet menus)
- [x] Fourth pack: Home blog section (latest 3, hidden until 3 posts)
- [x] Fourth pack: Large 1920 on every page (`max-w-page` 1920, content 1840, `Display/Giant — Large` and `Display/XL — Large` clamps, reading text max 720, hero 1920 × 1080 layout, Work stage sizes)

Done when: each section matches Figma at 390, 768, 1440 and 1920 (Large frames).

Done 2026-10-29 (fourth pack run 2: Large 1920): `get_metadata` on the 4 Large frames showed most sections already match at 1920 (fixed widths + `justify-between`); hero done in run 1. Changed: `--text-display-xl` is one clamp (160 → 208 from 1536 to 1920); `--container-content` 115rem (1840); Work stage at `2xl` = shots 588 + phone 380, list fills the rest, no gap; Work label, row line and case-study captions capped at 720 (`max-w-180`); image `sizes` hints for 1920 (Work, About, case study header / before / after). About photo stays on the 3-column grid (587 × 733 vs Figma 588 × 735, why in docs/architecture.md, "Portfolio home"). Figma calls: 5. Browser on `/`, `/work/roudon-smith`, `/blog`: at 1920 WORK / PRICES / BEFORE / AFTER / BLOG 208 px (187 tall), footer heading 561.6 (Figma 561), Work section 984.5, list x 40 w 856, shots 588 × 367.5 / 441, phone 380 × 824.5 (Figma 823.3), label and row line 720, captions 720, all same as Figma; at 1536 Display/XL 160, stage 984, list 472; at 1440 unchanged (160, list 426.7, shots 536, phone 341.3). 1 h1, no sideways scroll, 0 console errors at all 3 widths. 390/768 not run: every change is `2xl:`-only or held by the 160 clamp floor and `max-w-180`. `pnpm check` 43/43, lint and typecheck clean.

Done 2026-10-29 (fourth pack run 1: nav + Home blog + Criztian's revisions): nav = Work · Prices · Blog from `nav-links.data.ts` (desktop + menu). Home blog section between About and Prices reuses the `/blog` row (`PostRow`, h3 here), shown only with 3+ visible posts; the CMS canvas draws Home without posts. Revisions (in docs/handoff.md, not in Figma): hero fills the screen (desktop never shorter than 900); Work title + screens open the row's link (Roudon-Smith case study, J&T live site in a new tab; screens are a duplicate link, `tabIndex -1` + `aria-hidden`); About second photo fades in on hover (placeholder until Criztian's photo); every price figure "XXXXX". Giant desktop clamp left as is: it already reaches 575 at 1920 (Large 576). Figma calls: 6. Browser on `/`: hero 900 at 1440×900 and 1080 at 1920×1080 with Stakes at the fold; at 1920×1080 portrait 720×1080 at x 600, fade y 792, name y 272 (Figma 600 / 792 / 271); at 1440×900 name y 245 (Figma 246). Blog section padding, header (172 / 171 / 91), gaps (40 / 40 / 64) and row padding same as Figma at 390 / 768 / 1440. About hover opacity 0 → 1; title and stage clicks land on `/work/roudon-smith`; 4 "XXXXX"; 1 h1, no sideways scroll, 0 console errors at 390/768/1440/1920. `pnpm check` 43/43; `pnpm test:e2e` public.spec.ts 13/13 (home headings test now ignores the optional Blog heading, since local posts decide it).

Done 2026-10-29 (Blog list + post): `/blog` draws the newest post big and the rest as rows (whole post is one link); `/blog/[slug]` has the meta rail (date · N min read · By Criztian), the summary as lead, every rich-text element (h2, h3–h6, ul, ol, quote, table, link, code, hr), the author block and the Next post band, then the footer. Empty list: "No posts yet." (not drawn in Figma). Figma calls: 7. Checked with the Figma sample post seeded locally, then deleted. List at 390/768/1440: header 311/376/304 and h1 y 96/120/160, same as Figma; featured post 8 px shorter (link inset, why in docs/architecture.md, "Blog"). Post at 1440: header 422, article 1828, h2/table/ol/quote/ul y 627/717/1227/1359/1777, all same as Figma; article 2539 at 390 and 1856 at 768, same as Figma. 1 h1, 5 h2, no sideways scroll, 0 console errors at all 4 widths. Known: at 1920 content is not centered at 1440 (`--container-page`, open since `0c62aa3`). `pnpm check` 43/43 (3 new); `pnpm test:e2e` blog + publish specs 4/4.

Done 2026-10-29 (Home row link + case study): `/work/roudon-smith` prerendered from `src/data/case-study.data.ts`; `/work/jnt-express` 404. Row link is an internal link with no arrow. Link size: no inset, 44 px tall on touch (measured 156.7 × 44 at 390 with touch; 16 px tall on desktop, x 16 / 32 / 40 on the gutter). Contact email → criztiandev@gmail.com (footer, booking error, Privacy). Figma calls: 10. Section heights vs Figma at 1440: header 1442 / business 432 / Before 1178 / After 2292 / Measure 513, all within 1 px; at 768: 1107 / 472 / 1961 / 2446 / 621, within 1 px; at 390: all within 1 px except After +323 (4:5 phone crops, why in docs/architecture.md, "Case study"). Next band shows only "All work" (177 tall) until J&T is live. 1 h1, 5 h2, no sideways scroll, 0 console errors, every visible image loads at 390 and 1440. Known: at 1920 content is not centered at 1440, because `--container-page` is 120rem since `0c62aa3` (open question in the report). `pnpm check` 40/40; `pnpm test:e2e` public.spec.ts 13/13 (1 new).

Done 2026-10-29 (Booking popup): plain Cal.com iframe in a base-ui Dialog, opened from every Book a call link (links stay links). Figma calls: 4. Panel 390×844 full screen at 390; 720×800 centered at 768/1440/1920 (Figma 560 tall, why in docs/architecture.md, "Booking popup"); title Anton 40/42; loading, error (15 s) and live calendar shown at all 4 widths, 0 console errors. `pnpm check` 40/40; `pnpm test:e2e` 29/29 (2 new: desktop open/Escape/focus return, phone menu → full-screen popup).

Done 2026-10-29 (404 + Privacy): Figma has Desktop only (`45:191`, `45:220`); phone and tablet built from the same tokens. Root `app/not-found.tsx` wraps `MarketingLayout` (one header, booking popup works); `/nope` and `/blog/does-not-exist` return 404. Shared `SiteFooterBar` (© · Blog · Privacy) on Home and Privacy. Figma calls: 5. Browser at 390/768/1440/1920: 1 h1 each, Privacy 5 h2, no sideways scroll, 0 console errors besides the 404 status itself; 1440 matches Figma (Privacy title y 200 / 96 px, sections y 424, column 720; 404 at y 395 / 425 px, message y 796 / 64 px, actions x 1124 / 1287 vs 1123 / 1286). Known: Privacy section 1 wraps to 3 lines (browser Inter slightly wider than Figma's). `pnpm check` 40/40; `pnpm test:e2e` 27/29, then the 2 failures re-run 2/2 (404 text assertion updated; editor-code `networkidle` was a load flake).

Done 2026-10-29 (Home, rows 0–7): sections built from Desktop `get_design_context` + Phone/Tablet `get_metadata` (Figma calls: 10). Section heights vs Figma at 390: all within 3 px; at 768: Work +16, the rest within 3 px; at 1440: Work +11, About −10, the rest within 1 px (why in docs/architecture.md, "Portfolio home"). 1 h1, 6 h2, no sideways scroll, 0 console errors at 390/768/1440/1920; at 1920 content stays centered at 1440. Nav unchanged from phase 3. Contact form + Resend removed, `contact_messages` dropped. `pnpm check` 40/40 (6 contact unit tests removed with the code); `pnpm test:e2e` 27/27 (5 contact/messages tests removed, CMS tests moved to the Stakes card).

### 5. Motion

Criztian directs this phase himself (2026-10-29) with `/wmotion`, one section per run, in page order. The motion thesis in DESIGN.md "Motion" (approved 2026-10-29) is the default: story sections get 3 concepts on a lab page, small sections 1 proposal (3 on request). His instructions override it.

- [x] Load (Criztian's version: name rises dim and lights up, portrait lights with it, headline and copy rise; photo color on hover).
- [x] Smooth scroll (Criztian, 2026-10-29): Lenis with lurais.framer.website's 2 s glide; phones keep their touch scroll.
- [x] Nav hides on scroll down, comes back on scroll up, every size (Criztian, 2026-10-29).
- [x] 1 · Hero exit (story, Criztian picked concept 1 "Layers" of 3, 2026-10-29): no hold; the name slides behind the sinking portrait and the copy rises out; touch keeps the load only. Motion library removed.
- [x] Stakes word reveal (Criztian, 2026-10-29: inked by the scroll, both ways, not once).
- [x] 3 · Work (story, Criztian picked concept 3 "Long road" of 3, 2026-10-29): desktop hold with a mouse or trackpad, 1 screen of scroll per row; the screens ride one column that never stops, each set lights at its place and its row lights and opens; rows follow the scroll both ways; screens lift 1.02 on hover. Touch: stacked, each screen rises from its clip.
- [x] 4 · How it works (small, Criztian picked concept 2 "Stairs" of 3, 2026-10-30): the 3 steps climb in at different heights like stairs, each step's number, title and body close up as it lands and lights, then its line draws in Smoke. Under 1280 (touch included): stacked, each step on its own timeline, one moving at a time.
- [x] 5 · About (small, Criztian picked concept 1 "Echo" of 3, 2026-10-30): the hero load replayed by the scroll. "Hi, I'm" rises word by word and "Criztian." letter by letter, lighting as they land; the photo rises from below its frame and lights; the body rises; the 3 red numbers rise from their masks one by one, each label after its number. Touch and under 1280: the photo stays still, the text moves one block at a time.
- [x] 5b · Blog (small, Criztian picked concept 3 "Write" of 3, 2026-10-30): each title is written letter by letter, like the hero and About names, then its date and summary rise; "Blog" rises letter by letter and "All posts" rises last; rows lift 1.01 on hover. Touch: the titles rise word by word.
- [x] 6 · Prices (small, Criztian picked concept 1 "Open" of 3, 2026-10-30): the cards open top-down one after another, the light follows the edge down each card, and each price rises from its mask last; "PRICES" rises letter by letter, the notes rise and Book a call rises last. Touch: each card opens on its own timeline and its price rises; nothing else inside moves.
- [x] 7 · Footer (story, Criztian picked concept 2 "Sign-off" of 3, 2026-10-30): the hero name's move one last time. "Let's talk about your place." is written letter by letter, each letter rising from its word's mask and lighting; "Or email" rises word by word, the email and the socials rise from their clips, and Book a call rises dim and lights last, the last light on the page. The bottom bar stays still. Touch and under 1280: the heading rises word by word, then Book a call rises and lights; nothing else moves.
- [x] Case study `/work/[slug]` (small, Criztian picked concept 2 "Open" of 3, 2026-10-30): the page draws itself like a browser loading. On load the title rises word by word and lights, the sub and meta rise, and the big screen opens top-down. On scroll every screen opens top-down, its caption lighting as the edge passes; BEFORE and AFTER rise letter by letter, the other headings word by word; paragraphs open line by line; the 3 notes open one after another, their text lighting with the edge; each change's title rises word by word; the measure items rise one by one; All work rises last. Touch and under 1280: the load, the headings (BEFORE / AFTER as whole words), the screens and notes opening, the measure items and All work; paragraphs, captions and change titles stay still.
- [x] Blog pages `/blog` and `/blog/[slug]` (small, Criztian picked concept 2 "Open" of 3, 2026-10-30): the case study's page loading carried to the blog. On load "BLOG" rises letter by letter and lights, the newest post opens top-down with its text lighting as the edge passes, and on a post the title rises word by word, then the rail, the lead and the article open top-down. On scroll each older row opens top-down and its text lights; in a post every paragraph, list line and table cell opens, each h2 rises word by word, the quote opens slowly, the author photo opens; the Next band's title rises word by word and its links rise last. Touch and under 1280: the load, the row and quote opens, the h2 words, the photo and the Next band; paragraphs, list lines, table cells and the row lights stay still.
- [x] 404 (small, Criztian picked concept 3 "Stairs" of 3, 2026-10-30): How it works' stairs on load. The 3 digits climb in from different depths like stairs, land in order and light as they land; the message words climb from growing depths and close up as they land; Back to home climbs, and Book a call climbs dim and lights last. Touch: the digits and Book a call; the message and Back to home stay still.
- [x] Other pages (small): Privacy. Done 2026-10-30: Criztian picked concept 1 "Open" of 3, the blog pages' open on `/privacy`. On load "Privacy" rises letter by letter and lights, the date rises, and the sections column opens top-down; on scroll each section opens top-down, its heading rises word by word and its body lights as the edge passes. The footer bar stays still. Touch and under 1280: the load and the section opens; headings and bodies stay still.
- [x] Interactions (Home first). Done 2026-10-30: Criztian picked version 1 "Timed swap" of 3: Book a call's light fill opens top-down and its label turns black as the edge passes; every text link, the logo and the Home blog titles draw a 1 px line left to right (titles word by word); every clickable presses to 0.97; blog rows lift on keyboard focus too. Shared pieces, so every page gets it; only the `/blog` title underlines still snap. 24 of 24 Home clickables answer within 100 ms on hover and focus at 1440, 22 of 22 on focus at 390; touch gets the press only; reduced motion shows the end state at once.
- [x] Reduced motion: stills, stacked Work. Done 2026-10-30: checked on every page (0 running animations, everything lit, Work stacked), and Criztian's calm pass "Soft" (concept 1 of 3) shipped with it: so visitors don't get dizzy, every move stays with less travel (the hero name slides 160 px instead of 400, the portrait no longer sinks against it, the steps climb from 48 / 64 / 80 px instead of 160 / 200 / 240, the About photo rises 25% instead of 100%), the glide is 1.2 s instead of 2, and a breather sits between the home sections (25svh at 1280 and up, 12svh below; his "minus at least 100" on the lab's 50svh, then "still too far" on 35svh).

Transform, opacity and clip-path (filter only on a photo's own wrapper), no layout shift, content visible without JavaScript, still under reduced motion, no hover-only effects on touch screens. Done when: every effect runs at 60 fps on a mid-range phone (or is cut), and the JavaScript bundle size before and after is reported.

Done 2026-10-29 (Load): option 1 of the hero lab (letter-by-letter mask rise) with Criztian's revisions: the portrait starts dim (30%) and lights with the name, the name rises dim (20%) and lights from the center out, headline words and copy rise after, the photo is black and white with its color on hover. Later the same day: frame 1 is all black, the portrait rises from below its clip while dim, name letters dim under the cursor and relight, the headline, copy and nav come in from 1.4 s as the name lights (nav on Home from 1.6 s, other pages 200 ms; `site-header.tsx`, `config/motion.config.ts`), all done by about 3.2 s. Final numbers, same setup: LCP median 1524 ms (portrait), CLS 0.050, JS 226.3 KB, frames over 34 ms 7–8 of about 124; filmstrip 36 animations at 1440, 33 at 390, frame 1 all `#0a0a0a`, 0 console errors; `pnpm check` 43/43; public.spec 13/13. CSS only, so the hero is a server component again; the other lab moves and `/hero-lab` are deleted. The portrait uses `filter: brightness` on top of transform and opacity (why in docs/architecture.md, "Hero load"). Measured on webpack production builds, phone 390 × 844, 4× CPU, 1.6 Mbps, 150 ms RTT, 5 runs each, the new photo in both: LCP median 1176 → 1496 ms (the LCP element moved from the CRIZ text to the portrait, whose load time did not change; both under 2.5 s); CLS 0.014 → 0.050 (a font-swap wrap at 0.276 was fixed with `whitespace-nowrap`); JS 225.6 → 226.1 KB; HTML 14.3 → 15.0 KB; CSS 18.9 → 19.2 KB; frames over 34 ms in the first 3.5 s: 4–7 → 7–8 of about 120. No real mid-range phone tested. Reduced motion: 0 hero animations, the still. Paused-animation filmstrip at 1440 and 390, hover gives `grayscale(0)`, 0 console errors. `pnpm check` 43/43; `pnpm test:e2e` public.spec + the 4 CMS tests that draw the hero frame 17/17 (run before the portrait light, hover and nowrap, which no test covers). Hero pin + name slide stays open: Criztian picked load only. Responsive fix (Criztian, same day): the tablet and desktop hero is one screen tall, so headline, Book a call and note fit the first screen at 768×830, 1010×830, 1024×768, 1280×720, 1366×650 and 1440×790 (before: the note 70–210 px below the fold); 1440×900 and 1920×1080 unchanged (portrait 600×900 at x 420 / 720×1080 at x 600, name 425 / 575, fade y 792 at 1920); 768×1024 portrait 429×644 (Figma 440×660, whose tablet hero is 1040 tall); phone unchanged. `pnpm check` 43/43; public.spec 13/13.

Done 2026-10-29 (Smooth scroll + nav hide, Criztian's direction): Lenis 1.3.27 as `<ReactLenis root>` in the marketing layout with lurais.framer.website's setting, read from its bundle (Framer "Smooth Scroll" at intensity 20 = `new Lenis({ duration: intensity / 10 })`, so `duration: 2`), plus `anchors` and `stopInertiaOnNavigate`; `data-lenis-prevent` on the booking popup, its backdrop and the menu Sheet; `useNavHidden` slides the header up past 80 px while the page moves down and back on any move up, every size; keyboard focus brings it back. Browser run on webpack production builds, 0 console errors: one 300 px wheel step at 1440 moves 150 px by 200 ms, 291 by 1 s, 300 by 1.7 s, never backwards; nav Work glides 0 → 1334 px in 2.0 s, never backwards (no flash from Next's own jump), Work 79.6 px from the top (scroll-mt 80), URL `/#work`, nav hidden after; from `/blog` it lands the same; nav top −80 after scrolling down, 0 after scrolling up and at the top, Tab brings it back; phone touch scroll of 485 px hides it (−64), scrolling back up shows it; the wheel over the open popup or menu moves the page 0 px (124 px without the attribute); menu → Work lands on Work at 390 (touch) and 1024, with and without reduced motion (Work top 64 / 63.6). Reduced motion: link jump in 1 frame, wheel step settles in 117 ms, no header transition. Before → after (HEAD worktree, phone 390, `/_next/static` JS on `/`): 231.1 → 237.9 KB transferred (18 → 19 files), 789.2 → 809.6 KB decoded; frames over 34 ms at 4× CPU, 3 runs each: phone touch scroll (3,000 px) 0/0/1 → 1/0/0 of about 178, desktop wheel scroll (10 steps) 0/0/0 → 0/1/0 of about 210. Fixed during the run: `focus-within` kept the nav open after a mouse click on a nav link; it is `has-focus-visible` now. `pnpm check` 43/43; `pnpm test:e2e` 31/32, the 2 new tests pass. The 1 failure, `cms.spec.ts:1156` ("saves a draft in the editor"), fails the same at HEAD 09a5170 (3/3 here, 1/1 there): `article p` now resolves to the summary paragraph ("Written in the editor."), so the frame selects Summary, not Body. Open since the blog restyle, outside this change.

Done 2026-10-29 (Stakes ink, Criztian's direction): the headline inks word by word as the band scrolls in (20% → full black, reading order) and the body rises after; it follows the scroll both ways instead of playing once. Lurais's motion was read from its bundle first (docs/website-plan.md, "Reference motion"). CSS scroll-driven animation, zero JS (why in docs/architecture.md, "Stakes ink"). Production build at 390×844, 768×1024, 1440×900 and 1920×1080: every word ramps over 145–150 px of scroll (10–90% in 120–125 px), the body over 195 px (160); the last word is lit at 660 px with the heading at y 264–648 / 460–825 / 360–634 / 540–814; 10 animations and 0 console errors at all 4. Ease-out was tried first: 10–90% in 50–55 px, a pop, so the scrub is linear. Reduced motion: 0 animations, all lit. Firefox (Playwright): no `animation-timeline`, 0 animations, all lit, 0 errors. WebKit not run (Playwright's WebKit would not launch on this machine). Touch drags of 2,925 px at 390 with 4× CPU, 3 runs: 2/0/0 of about 424 frames over 34 ms; the same build with only the Stakes animations off: 1/1/1. JS unchanged (server component, no client code); `/` HTML 126,053 bytes, the Stakes section 1,372. `pnpm check` 43/43; e2e `public.spec` "renders the home page sections" and `cms.spec` "edits the home page beside the live page" 2/2.

Done 2026-10-29 (Hero exit, concept 1 "Layers" of 3 on a `/motion-lab` page, deleted after the pick): dennissnellenberg.com's exit, read from his code first (docs/website-plan.md, "Reference motion: dennissnellenberg.com"). As the hero scrolls away, the name slides left (−400 px over 1000 px of scroll, his 0.4 px per px), the portrait sinks (+300 px over 1000 px, his 0.3), the 10 headline words rise out of their masks (150 px each, 30 px apart, 0–420 px), then the sub, buttons and note rise out (200 px each, 100 px apart, 60–460 px). Nothing dims. Not picked: 2 "Lights out" (concept 1 plus the name dims from the edges in and the portrait to 0.3 while Stakes inks) and 3 "Rewind" (a 1-screen hold that plays the load backwards; it moved the Stakes ink from 260 to 1160 px). CSS scroll-driven animation, zero JS, the hero is still a server component (why in docs/architecture.md, "Hero exit"). Webpack production builds, ramp probe at 1440×900 and 1920×1080, identical: name and portrait 10–1000 px (10–90% in 800), each word 120 px (first 10–150, last 280–420), sub 70–260, buttons 170–360, note 270–460 (150 each), Stakes' first word still 260–400; 15 hero scroll animations, 0 console errors. Touch 390×844 and reduced motion: 0 hero animations, the still at scroll 400. Firefox (Playwright): the still, 0 errors. Phone profile, HEAD worktree vs after (390×844, 4× CPU, 1.6 Mbps, 150 ms RTT, 5 runs each): LCP median 1192 → 1136 ms (H1 in 4 of 5 runs on both sides, the portrait in 1, so the element follows image timing, not this change); CLS 0.029 → 0.031; `/_next/static` JS 237.5 → 237.7 KB transferred, 809.5 → 809.0 KB decoded, 19 files both. Removing `motion` saved 0.5 KB decoded: tree-shaking had already dropped everything but `MotionConfig`. Phone frames not re-run: touch gets no new motion. `pnpm check` 43/43; `pnpm test:e2e` 31/32, the 1 failure is the known `cms.spec.ts:1156` ("saves a draft in the editor"), open since the blog restyle.

Done 2026-10-29 (Work hold, concept 3 "Long road" of 3 on a `/motion-lab` page, deleted after the pick)

Reference: lamalama.com's work list, read from its code first (docs/website-plan.md, "Reference motion: lamalama.com"). It is click-to-open with a GSAP Flip, with no pin or scrub. Its sticky button's clip reveal became Book a call's rise.

The concepts:
- Not picked: 1 "Spotlight" (the screens swap in place) and 2 "Grow" (lamalama's Flip, scrubbed). Both were stopped once Criztian picked.
- Long road was built and then checked by an independent verifier. It found no blockers.
- Fixed before showing:
  - the detail screen slid 21 px over the desktop screen (the speed difference now sits on the phone column only);
  - an empty lower stage at 72–76% ("your site" draws from 66%).

How it's built: CSS scroll-driven animation plus `position: sticky`, zero JavaScript; `WorkSection` is still a server component (why in docs/architecture.md, "Work hold").

Ramp probe, dev server, the same numbers as the lab:
- 1440×900, story 2700 px:
  - letters 160 and label 160 (10–90);
  - row names, details and shifts 170–190;
  - set lights 150 each, 108 px apart;
  - frame draws 170–180;
  - Book a call 220;
  - the road 0–2700.
- 1280×720, short layout:
  - every ramp 120 or more;
  - the frame fits (list 640 of 640).
- 1920×1080:
  - stage 984×824 (Figma 984×824.5);
  - ramps 180–260.
- 390×844 touch, no hold:
  - letters and label 160;
  - each screen rises 200 (10–90) once it is fully on screen.
- 0 console errors at every size.

Fallbacks and input:
- Reduced motion and Firefox (Playwright): 0 Work animations, the stacked still, all lit, 0 errors.
- Touch at 1440: 11 light moves, no hold.
- Keyboard: Tab goes Roudon-Smith → case study → J&T → live site → Book a call, then leaves Work. Each focused row lights with its detail shown.
- Hover: a project shot reaches 1.014 by 100 ms and settles at 1.02. "Your site" frames don't move.

Phone profile on webpack production builds, HEAD worktree vs after (Pixel 7, 4× CPU, 1.6 Mbps, 150 ms RTT, 5 load runs):
- LCP median 2232 → 2328 ms. It is the hero portrait in 9 of 10 runs; the spread is 1960–2764 before and 1992–4096 after (one run picked a paragraph). Work sits below the fold, so this is run noise.
- CLS 0.055 → 0.054.
- `/_next/static` JS 239.1 → 239.5 KB transferred, 19 files both. No client file changed, and every chunk is renamed because the baseline builds in another folder.
- This method measures HEAD at 239.1 KB, so the 237.9 KB budget line from the earlier runs is not comparable.
- Touch drags of 2,850 px through Work, 3 runs, frames over 34 ms: 1/0/2 of about 423 → 0/0/0.

Scripts: `pnpm check` 43/43; e2e `public.spec` "renders the home page sections" and `cms.spec` "edits the home page beside the live page" 2/2.

No real mid-range phone tested.

Done 2026-10-30 (How it works, concept 2 "Stairs" of 3 on a `/motion-lab` page, deleted after the pick): the heading words rise from their masks and light; the 3 steps climb in at different heights and land in order, each step's number, title and body rising from 160 / 200 / 240 px below its clip so they close up as they land; each step lights over the last 150 px of its 300 px rise; its line draws in Smoke over the Graphite track as it lands. Not picked: 1 "Fuse" (the line draws first and lights each step) and 3 "Count" (each number ticks up one digit, then lights its step). CSS scroll-driven animation, zero JS, still a server component (why in docs/architecture.md, "How it works stairs"). Fixed in the lab: the line jumped to drawn at 50% (`inset()` → `none` doesn't interpolate), so `steps-draw` has an explicit end keyframe.

Ramp probe on the dev server, computed values every 10 px:
- 1440×900, section timeline: words 120 px (10–90), from 200 to 400; steps rise 240 px each, starting 120 px apart (330–570, 450–690, 570–810), lights 120, lines 120 (560–920); max 7% change per 10 px; step 3 lands with its number at y 368. Same numbers as the lab.
- 390×844 touch, per-step timelines: words as desktop; each step rises 240 px and lights 120 once it comes on screen (230–470, 510–750, 790–1030, no overlap), each landing with its number at about y 568; lines 120.
- 15 animations, 0 console errors at both.
- Reduced motion at 390: 0 animations, all 15 elements still and lit.

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43 (the first typecheck tripped on `.next/dev/types`, which the dev server had rewritten with a leftover tail of the deleted lab route; deleting the 2 generated files fixed it). e2e `public.spec` "renders the home page sections" passed; `cms.spec` "edits the home page beside the live page" failed once at line 703 (focus went to BODY after a header link click inside the CMS frame, not to the textarea), then passed 2/2 on a rerun of the same build.

Done 2026-10-30 (About, concept 1 "Echo" of 3 on a `/motion-lab` page, deleted after the pick): the heading words rise from their masks and light, "Criztian." letter by letter like the hero name; the photo rises from below its frame and lights from 0.3; the body rises 24 px; each number rises from its mask and lights, its label 80 px later. Not picked: 2 "Out from behind" (the heading slides out from behind the photo) and 3 "Shutter" (the photo opens from a center line, the rest opens by clip). CSS scroll-driven animation, zero JS, still a server component (why in docs/architecture.md, "About echo").

Ramp probe on the dev server, computed values every 10 px:
- 1440×900: words and letters 120 px (10–90) each, 190–650; photo rise 320 (300–700), light 200 (460–700); body 160 (430–630); numbers 160 and light 120, starting 600 / 720 / 840; labels 160 (680–1120). Same numbers as the lab, within 10 px.
- 390×844 touch: heading as desktop; photo still (no animation); body 160 once on screen (940–1140); numbers 1160 / 1270 / 1370, labels after, no pop.
- 0 console errors at both. Reduced motion at 1440: 0 animations, all 19 elements still and lit.
- Accessibility: the letter split named the heading "Hi, I'm C r i z t i a n ."; fixed with `aria-label` (now "Hi, I'm Criztian."). Found while checking: WORK reads "W O R K", open.

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43, then lint and typecheck again after the `aria-label` fix. e2e not run: no route, form, auth or proxy change; the home heading test reads `textContent`, which is unchanged ("Hi, I'm Criztian.", read in the browser).

Done 2026-10-30 (Blog, concept 3 "Write" of 3 on a `/motion-lab` page, deleted after the pick): "Blog" rises letter by letter and lights; the intro rises 24 px; each row's title is written letter by letter (each letter rises from its word's mask and lights, 6 px apart), then the date and the summary rise; "All posts" rises last; rows lift 1.01 on hover with the Work spring. Not picked: 1 "Ruled" (each row's line draws in Smoke, then the title rises word by word onto it) and 2 "Stack" (each row rises whole from below its own clip and lights). CSS scroll-driven animation, zero JS, still a server component (why in docs/architecture.md, "Blog write"). Command to pick: about 10 min.

Ramp probe on the dev server with the 3 local test posts, computed values every 10 px:
- 1440×900, mouse: heading letters 120 px (10–90) each, 190–460; intro 160 (310–510); per row, from its own top entering: first letter 120 (about 125–275), last letter 120, date and summary 160 each, ending 450–540; "All posts" 120 (126–276). Same numbers as the lab.
- 390×844, touch: words instead of letters (26 word animations, 0 letter animations), each 120 px; date and summary 160; no pop.
- 0 console errors at both. Reduced motion at 1440: 0 animations, every element lit, no hover lift.
- Hover at 1440: row scale 1.01, the title underlines across the letters. Accessibility tree: heading "Blog", each h3 and its link named by the full title (an `sr-only` copy; the letters are `aria-hidden`).

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43. e2e not run: no route, form, auth or proxy change (the lab route was added and deleted in the same run).

Done 2026-10-30 (Prices, concept 1 "Open" of 3 on a `/motion-lab` page, deleted after the pick): "PRICES" rises letter by letter and lights; the sub rises 24 px; each card is uncovered top-down by a clip, one after another, and its name, summary and include rows light as the edge passes them; the price rises from its mask last, "From" lighting with it; the notes rise, then Book a call rises from its clip. Not picked: 2 "Tiers" (whole cards rise from deeper the higher the price, 200 / 280 / 360 px, and land flat) and 3 "Across" (cards still, read like a comparison: names and prices written letter by letter left to right, then the rows light in a wave). CSS scroll-driven animation, zero JS, still a server component (why in docs/architecture.md, "Prices open"). The lab showed a geometry limit first: at 1440×900 a card is 635 px tall and the row is fully on screen for only 265 px of scroll, so the open starts once a card's top is well on screen.

Ramp probe on the dev server, computed values every 10 px, cover counted from the section's top entering:
- 1440×900, mouse: heading letters 120 px (10–90) each, 200–520; sub 160 (330–490); cards open 290 each (600–890, 700–990, 800–1090), card tops at y 628 / 528 / 428 when they start; lights 120 each; prices 120 (880–1000, 980–1100, 1080–1200, landing at y 350 / 250 / 150); notes 160 each, 1150–1510; Book a call 120 (1450–1570). 37 moving parts, 47 animations, 0 pops, all lit at the end. Same numbers as the lab.
- 390×844, touch: each card on its own timeline, open 190 px (10–90) then its price 120, one card at a time (630–940, 1090–1400, 1580–1890); the lights stay still (27 animations); no pop.
- 0 console errors at both. Reduced motion at 1440: 0 animations, everything lit and in place (only the static `hero-mask` clips remain).
- Layout at 390 / 768 / 1440 / 1920: section heights, heading, cards and prices identical to before; Book a call keeps its size and x, its top reads +78 px at scroll 0 only because it waits at `translate: 150%`.

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43 (typecheck first failed on `.next/dev/types/routes.d.ts` and `validator.ts`: the dev server's copies, left with text past their end after the lab route was deleted while `next typegen` ran; the two generated files were deleted and typecheck passed). e2e not run: no route, form, auth or proxy change.

Done 2026-10-30 (Footer, concept 2 "Sign-off" of 3 on a `/motion-lab` page, deleted after the pick): the heading is written letter by letter like the hero, About and Blog names, each letter rising from its word's mask and lighting from 20%; "Or email" rises word by word, the email and the 3 socials rise 150% from padded clips; Book a call rises from its clip at 20% and lights last. The bottom bar never moves. Not picked: 1 "Answer" (the DESIGN.md beat: the heading inks word by word like Stakes, no movement; the email and socials rise 24 px; Book a call lights last) and 3 "Landing" (Stairs: the heading words climb from 160–280 px below and land together, then the email, socials and Book a call climb from 160–260 px and land on the bar at the page's end). CSS scroll-driven animation, zero JS, still a server component (why in docs/architecture.md, "Footer sign-off"). The geometry decided the shape first: the footer is the page's end, so the whole story has only its own height of scroll (794 px at 1440×900), and the bar is fully on screen for only the last 40 px.

Ramp probe on a production build (`next build`, served on :3110), computed values every 10 px, counted from the footer's top entering:
- 1440×900, mouse: 24 letters, each 120 px (10–90), done 450–680; Book a call rises 520–670 and lights 630–780 of 794, the last to finish; "Or email" done 690 / 710; email and socials done 730–770. 56 animations, no pop.
- 1920×1080, mouse (3-line heading): letters done 440–900; Book a call lit at 1050 of 1067, last.
- 390×844 and 768×1024, touch: 5 words, each 120 px (10–90), done 400–520 / 420–680; Book a call lit at 570 of 730 / 860 of 894, last; 12 animations (no letters, no email or socials).
- Every run: everything lit and in place at the last scroll position, 0 console errors, 1 h1. Reduced motion at 1440 and 390: 0 footer animations, the still. `/blog` and `/work/roudon-smith` (same footer): lit at the end at 1440, and at 390 touch for the case study.
- Layout: footer 794 / 1068 tall at 1440 / 1920 and 670 / 874 at 390 / 768 without touch, same as before (730 / 894 with touch is the existing 44 px tap height on the socials).

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43 (typecheck first failed on `.next/dev/types/routes.d.ts` and `validator.ts` again, the dev server's copies left with text past their end after the lab routes were deleted; the two generated files were removed and the check passed). `pnpm exec playwright test public.spec.ts -g "renders the home page sections"` 1/1 (it reads the footer h2's text).

Done 2026-10-30 (Case study, concept 2 "Open" of 3 on a `/motion-lab` page, deleted after the pick): the Prices open carried to the case study's screens, so the page draws itself like a browser loading. Load (timed, ease-out): title words rise from their masks and light from 200 ms, 90 ms apart (1.1 s rise, 0.9 s light); sub and meta rise 24 px from 900 / 1050 ms; the big screen opens top-down from 500 ms over 2 s, its first 45% (the part on screen at 1440×900) on the ease-out over 1.4 s, the rest linear (a plain ease-out opened the visible part in about 150 ms). Scroll: every screen opens over 360 px (240 under 1280) from 200 px after its own top enters, the second BEFORE screen 120 px later; captions light as the edge reaches them; BEFORE / AFTER rise letter by letter, 40 px apart from 180 px; paragraphs open top-down over 240 px from 180 px after their own top enters; the 3 notes open 100 px apart, title and body lighting as the edge passes; change titles rise word by word, 30 px apart from 250 px; measure items rise 120 px apart from 400 px; All work rises from its clip last. Not picked: 1 "Echo" (the hero load replayed: the title written letter by letter, screens rising from their frames and lighting from 30%, every heading letter by letter) and 3 "Spotlight" (the Work rows' light: each note, change and measure item lights at the reading line and drops back to Smoke-level 60% once past the top third). CSS only, zero JS, still a server component (why in docs/architecture.md, "Case study open").

Ramp probe on the dev server, computed progress every 10 px of scroll:
- 1440×900, mouse: 20 load animations, frame 1 has every title word at 20% and 110% down and the screen fully closed, all settled by 3 s. 86 case-study scroll animations, each 120 px or more (10–90), 0 pops: business words 820–980; paragraphs 190 each (950–1280, 1470–1660, …); BEFORE 1250–1570; screens 290 each (1620–1910, 1740–2030, 2840–3130, 3470–3760, 3940–4230); notes 190 each (2080–2470); AFTER 2430–2710; change titles 2830–4170; measure 4720–5300; All work 5180–5300.
- 390×844, touch: 17 load animations, same frame 1 and last frame. 30 case-study scroll animations, 0 pops: business words 330–490; BEFORE 880–1000; screens 190 each, one at a time (1230–1420, 1530–1720, 3100–3290, 3880–4070, 4580–4770); notes 1810–2360; AFTER 2480–2600; measure 5120–5700; All work 5870–5990.
- Both: everything lit and in place at the last scroll position, 1 h1, 0 console errors. Reduced motion at 1440 and 390: 0 animations at every 300 px step, the still.
- Layout at 390 / 768 / 1440 / 1920: every section, the h1 and every h3 the same height as before (page 7418 / 7722 / 6908 / 8521 px). The first build put All work in an `inline-block` clip wrapper and the Next band grew 8 px (177 → 185) from the line box; the wrapper is `flex` now, back to 177.

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43 (typecheck first failed again on the dev server's `.next/dev/types/routes.d.ts` and `validator.ts` after the lab routes were deleted; the two generated files were removed and the check passed). e2e not run: no route, form, auth or proxy change.

Done 2026-10-30 (Blog pages, concept 2 "Open" of 3 on `/motion-lab` pages, list and post per concept, deleted after the pick): the case study open carried to `/blog` and `/blog/[slug]`. Load (timed, `--ease-out`): "BLOG" letters rise from the mask and light, 90 ms apart from 200 ms; the intro rises 24 px at 900 ms; the newest post opens top-down over 1.4 s from 500 ms, its title / summary / meta / Read the post lighting from 500 / 750 / 800 / 1000 ms. Post: title words rise and light 90 ms apart from 200 ms; the rail and the lead open over 1.4 s from 900 / 1000 ms; the article column opens over 2 s from 1100 ms, its first 50svh on the ease-out over 1.4 s, the rest linear. Scroll (linear): rows open over 240 px from 120 px after their top enters, title / summary / meta lighting from 160 / 180 / 240 px (1280 and up with a mouse); paragraphs, h3–h6 and code open over 200 px from their own top entering, list lines and table cells over 150 px (1280 and up with a mouse); h2 words rise 25 px apart from 0; the quote opens over 360 px; the author photo opens over 40–280 px, its note lights 80–230; the Next band title words rise 40 px apart from 180, its links rise from padded clips after the last word, 40 px apart. Not picked: 1 "Write" (every title written letter by letter, like the Home rows) and 3 "Layers" (the hero exit: the title slides left and the header sinks under the list or article, the next post's title slides in from the right). CSS only, zero JS, the pages stay server components (why in docs/architecture.md, "Blog pages open"). Command to pick: 34 min.

The 3 local posts fit on one desktop screen, so the lab post pages drew the Figma sample post ("What a small business website really costs", copy read from `93:464`, 1 Figma call) as lab-only data; nothing was written to the database. The lab showed the first-screen limit: at 1440×900 the article's first h2 sits at y 626, so body ranges start at the block's own entry and stay short (h2 words 25 px apart), and everything above y ≈ 700 is done at load and arrives with the timed column.

Ramp probe on the dev server, computed progress every 10 px of scroll:
- Lab, 1440×900, the Figma post: 80 scroll animations, 0 pops, every one 120 px or more (10–90); load done by 3.1 s, frame 1 all dim or closed; at load only the first two table rows (bottom ~180 px of the screen) are part-way.
- Production, 1440×900, mouse: `/blog` 14 load animations done by 1.9 s, rows 120 px (10–90) each; posts 13 load animations done by 3.1 s, 20–30 scroll animations; 0 pops; on the short local posts the last paragraph and the author block sit in the bottom band at load and finish on the first scroll.
- Production, 390×844, touch: `/blog` 2 row opens, 190 px each; posts 11–27 scroll animations (h2 words, Next band, photo), 0 pops.
- Every run: everything lit and in place at the last scroll position, 1 h1, no sideways scroll, 0 console errors. Reduced motion at 1440 and 390: 0 animations, the still. Page height at 1440 unchanged (`/blog` 2021, posts 2081 / 2096 px).

JS unchanged (server components, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43. `pnpm test:e2e` public.spec "the blog index is prerendered", "unknown or malformed blog slugs return 404", cms.spec "shows a post on the site only after Publish", "takes a new post from the editor to the site": 4/4.

Done 2026-10-30 (404, concept 3 "Stairs" of 3 on `/motion-lab` pages, deleted after the pick): How it works' stairs, timed. The 404 is one screen (900 px page at 1440×900, no footer), so page load is the only trigger. Load (`--ease-out`): the digits rise from below the `hero-mask` clip, from 110 / 140 / 170% of their height, 1.6 s each, starting 200 / 320 / 440 ms, so mid-way they sit at different heights and they land in order; each lights 20 → 100% over 900 ms from 600 ms after its rise starts. The message words rise together from 1.2 s, from 110 / 140 / 170 / 200% below their masks over 1.4 s, so they close up as they land, lighting from 1.6 s. Back to home rises from 170% in a padded clip from 1.5 s (lights 1.8 s); Book a call rises from 200% at 1.65 s, dim, and lights last from 2.3 s, done at 3.2 s. Touch (no hover or a coarse pointer): the digits and Book a call; the message and Back to home stay still. Passed: 1 "Echo" (the hero load: digits rise 150 ms apart and light center-out from 1.1 s, words rise, digits dim under the cursor) and 2 "Open" (one top-down edge over the 404 and the message row over 1.8 s, each part lighting as the edge reaches it).

Filmstrip probe on the dev server (every animation paused on load, then set every 100 ms from 0 to 3.4 s):
- 1440×900, mouse: 23 animations (6 digits, 8 words, 2 Back to home, 2 Book a call, 5 nav). Frame 1 black apart from the Next dev badge; the lit area grows every frame from 300 ms and is flat from 2.7 s; the last frame matches the reduced-motion still (same lit value).
- 390×844, touch: 10 animations (6 digits, 2 Book a call, 2 nav); the message and Back to home sit still from frame 1; flat from 2.9 s.
- Both: status 404, the h1 found by its name "This page doesn't exist." (what public.spec reads), 0 console errors apart from the page's own 404 response. Reduced motion at 1440: 0 animations in `main`, the still. Layout at 1440 unchanged: "404" at y 395 (361 tall), h1 at 796, links at 808 / 826.

JS unchanged (server component, no client code). Phone frames not profiled: no pinned, canvas or 3D move.

Scripts: `pnpm check` 43/43 (typecheck first failed again on the dev server's `.next/dev/types/routes.d.ts` and `validator.ts` after the lab routes were deleted; the two generated files were removed and the check passed). e2e not run: no route, form, auth or proxy change; the h1 name that public.spec checks was read in the probe.

Done 2026-10-30 (Reduced motion and the calm pass, concept 1 "Soft" of 3 on `/motion-lab` pages, deleted after the pick): Criztian asked for less motion so visitors and clients don't get dizzy, and for room between sections because the page felt "super compact". Each lab version was the whole home page with a breather between sections (50svh at 1280 and up, 25svh below). Soft keeps every move with less travel: the hero exit name slides −160 px over 1000 px (was −400) and the portrait no longer sinks (+300), so the two layers stop moving against each other; the steps' number, title and body climb from 48 / 64 / 80 px (was 160 / 200 / 240); the About photo rises from 25% of its height (was 100%) while it lights; Lenis `duration` 2 → 1.2. Not picked: 2 "Still light" (nothing climbs or slides: every rise became the light 20 → 100% in place, glide 1 s) and 3 "One at a time" (each section keeps only its title and its one beat; bodies, labels, notes, links and prices lit and still). Picked with a revision: "minus at least 100 for the spacing", so the breather is 35svh at 1280 and up (315 px at 900 tall, 378 at 1080, was 450 / 540) and 18svh below (152 px at 844). It is a gap between the sections (`gap-y-breather` on the `HomeView` wrapper), not more padding, so no section's scroll ranges moved (why in docs/architecture.md, "Calm pass and breather"). Command to pick: about 18 min.

Probe on the dev server, computed progress every 10 px of scroll:
- Lab, 1440×900: one 300 px wheel step at 99% after 1222 ms today, 733 / 608 / 711 ms in versions 1 / 2 / 3; 356 / 355 / 218 / 292 scroll animations; 0 pops in all; everything lit at the last scroll position; 0 console errors.
- Production, 1440×900, mouse: wheel step 90% at 400 ms, 99% at 749 ms (was 624 / 1222); hero name slide 810 px (10–90); steps climb 240 and light 120; About photo rise 320, light 200; 355 scroll animations, 0 pops (shortest 110 px, the Stakes ink at 10 px sampling), all lit at the end; 0 console errors. Breather 315 px (Stakes top 900 → 1215); page scroll 7733 → 9938 px.
- Production, 390×844, touch: 162 scroll animations, 0 pops, all lit at the end, 0 console errors; breather 152 px.
- Closer, same day: Criztian found the 35svh gap "still too far can you make them closer a little", so 25svh at 1280 and up and 12svh below. Measured on the dev server: 225 px at 1440×900, 101 px at 390×844, page 10208 px tall at 1440 (was 10838), 0 console errors. No scroll range moved (the gap sits between sections).
- Reduced motion at 1440 on `/`, `/work/roudon-smith`, `/blog`, `/blog/welcome-to-our-new-website`, `/privacy` and the 404, and on `/` at 390: 0 running animations at every 300 px step, 0 dimmed elements in `main`, Work stacked (its inner block `position: static`); 0 console errors apart from the 404 page's own 404 response.

JS unchanged apart from one number in `config/motion.config.ts` (no new client code). Phone frames not profiled: no pinned, canvas or 3D move, and touch gets less motion than before.

Scripts: `pnpm check` 43/43 (typecheck first failed again on the dev server's `.next/dev/types/routes.d.ts` and `validator.ts` after the lab routes were deleted; the two generated files were removed and the check passed). `pnpm exec playwright test public.spec.ts cms.spec.ts -g "renders the home page sections|edits the home page beside the live page"` 2/2 (the CMS canvas draws `HomeView` too).

### 6. Review and launch

- [ ] Every section at 390, 768, 1440, 1920 plus the edges 360, 1279 and 1536.
- [ ] Lighthouse performance, accessibility and SEO scores pasted here.
- [ ] No console errors, no unlabeled placeholders, every button goes somewhere real.
- [ ] Real prices replace "XXXXX" and Criztian's 2 About photos replace the placeholder (docs/handoff.md, open questions).
- [ ] The public home renders full content with the database paused (limit in PRODUCT.md).
- [ ] Title, description, social image and favicon set.
- [ ] Kit page removed.

Done when: a preview is deployed and its link is ready for Criztian's final OK.

## Realign list (template leftovers and mismatches with Figma) — data, read 2026-10-29

1. ✅ **Git:** `origin` = `https://github.com/Criztiandev/criztiandev-web-template-v1.git`, with the template's history. Start a fresh repo (`git init`) and a new GitHub repo **before any push**.
2. ✅ **Line endings:** the working copy is CRLF (every file shows as changed), while `.prettierrc` sets `"endOfLine": "lf"`. Add `.gitattributes` with `* text=auto eol=lf` and renormalize.
3. ✅ `package.json:2` — `"name": "website-template"` → `criztian-portfolio`.
4. ✅ `src/config/site.config.ts:12-13` — name "Website Template" / template description → `Criztian` / `Custom websites for small businesses.` (page title: "Criztian — Custom websites for small businesses.").
5. ✅ `src/config/font.config.ts` (whole file) — Geist, Inter, Manrope, Space Grotesk, Lora, Playfair Display → Anton + Inter only.
6. ✅ `src/data/font.data.ts:1-10` — 6 font options, default Geist → Anton (headings) and Inter (body) only.
7. ✅ `src/data/theme.data.ts:3-11` — white / near-black defaults → brand: background #0A0A0A, text #F4F4F1, accent #E1251B, surface #232323, muted text #8A8A86.
8. ✅ `src/app/globals.css:8-43` — shadcn neutral tokens and a `.dark` variant → the brand tokens from docs/brand.md; dark only.
9. ✅ (links are `/#work` etc. so they work from /blog too) `src/data/nav-links.data.ts:2-5` — Home, Blog, Contact, Log in → Work `#work`, How it works `#how-it-works`, Prices `#prices`. "Book a call" is a button, not a nav link. No public login link.
10. ✅ Done 2026-10-29 (Hero + Stakes in the CMS; rest static). `src/data/home.data.ts:3-7` and `src/model/home.model.ts` — hero heading/text + contactHeading → the home content from docs/website-plan.md, in `src/data/*.data.ts`, in the same shape the CMS home collection saves. No `contactHeading`.
11. ✅ Done 2026-10-29. 4 CMS e2e tests are built on the form, so they get rewritten once. Add a migration dropping `contact_messages` (anon may insert). **Contact form (cut list #4):** `src/components/home-view.tsx:3` and `:30-37`, `src/components/contact-form.tsx`, `src/components/contact-message-list.tsx`, `src/app/dashboard/messages/page.tsx`, `src/router/contact.router.ts` (+ its entry in `src/router/app.router.ts`), `src/service/contact.service.ts`, `src/repository/contact-message.repository.ts`, `src/model/contact.model.ts`, `src/type/contact.type.ts`, `src/type/contact-message.type.ts`, `src/util/contact.util.ts`, `test/contact.test.ts`, and the contact references in `src/config/cms.config.ts`. Remove; keep Resend only if something else uses it.
12. ✅ **Blog: keep it, live at launch (decided 2026-10-29).** Keep `src/app/(marketing)/blog/` and the CMS blog collection. The blog index and post pages are being designed in the Claude app; don’t restyle them until a later pack adds their Figma frames and phase. Remove only the public "Log in" and "Contact" nav links for now (item 9). **Third pack: the blog list and post frames are in (see "New pages"); build them in Phase 4.**
13. ✅ `src/app/(marketing)/login/` — keep the route for Criztian; no public link to it.
14. ✅ Down-mode fix ported from J&T; the full real content comes with the Sections phase. `src/app/(marketing)/page.tsx:8-19` — home content comes from Supabase (`revalidate = 3600`) with a fallback to defaults. Make sure the fallback is the full real content, so the page is complete with the database paused.
15. ✅ (icon.svg, favicon.ico 16+32, apple-icon.png 180 in src/app) `src/app/favicon.ico` — the template icon → build from `public/brand/criztian-icon.svg` (32 + 16 px), plus an apple-touch icon.
16. ✅ `README.md` — the template readme → a short portfolio readme.
17. **Case-study pages are being designed in the Claude app** (`/work/[slug]` for Roudon-Smith and J&T, one template). Both projects get one at launch; Roudon-Smith first. Don’t build them yet; a later pack adds the Figma frames and the phase. **Third pack: the template and Roudon-Smith frames are in (see "New pages"); J&T's copy is still to come.**
18. ➡️ Sections phase (rows 84-86). New routes needed: `/privacy`, a custom 404 (`not-found.tsx`), the Cal.com booking popup.
