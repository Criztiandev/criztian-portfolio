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

Criztian directs this phase himself (2026-10-29). Build from his instructions; the motion notes in docs/website-plan.md are the default.

- [x] Load (Criztian's version: name rises dim and lights up, portrait lights with it, headline and copy rise; photo color on hover).
- [x] Smooth scroll (Criztian, 2026-10-29): Lenis with lurais.framer.website's 2 s glide; phones keep their touch scroll.
- [x] Nav hides on scroll down, comes back on scroll up, every size (Criztian, 2026-10-29).
- [ ] Hero pin + name slide (desktop + tablet).
- [ ] Stakes word reveal (once).
- [ ] Work pin with row switching (desktop only).
- [ ] Fade-ups, hover.
- [ ] Reduced motion: stills, stacked Work.

Transform and opacity only, no layout shift, content visible without JavaScript, still under reduced motion, no hover-only effects on touch screens. Done when: every effect runs at 60 fps on a mid-range phone (or is cut), and the JavaScript bundle size before and after is reported.

Done 2026-10-29 (Load): option 1 of the hero lab (letter-by-letter mask rise) with Criztian's revisions: the portrait starts dim (30%) and lights with the name, the name rises dim (20%) and lights from the center out, headline words and copy rise after, the photo is black and white with its color on hover. Later the same day: frame 1 is all black, the portrait rises from below its clip while dim, name letters dim under the cursor and relight, the headline, copy and nav come in from 1.4 s as the name lights (nav on Home from 1.6 s, other pages 200 ms; `site-header.tsx`, `config/motion.config.ts`), all done by about 3.2 s. Final numbers, same setup: LCP median 1524 ms (portrait), CLS 0.050, JS 226.3 KB, frames over 34 ms 7–8 of about 124; filmstrip 36 animations at 1440, 33 at 390, frame 1 all `#0a0a0a`, 0 console errors; `pnpm check` 43/43; public.spec 13/13. CSS only, so the hero is a server component again; the other lab moves and `/hero-lab` are deleted. The portrait uses `filter: brightness` on top of transform and opacity (why in docs/architecture.md, "Hero load"). Measured on webpack production builds, phone 390 × 844, 4× CPU, 1.6 Mbps, 150 ms RTT, 5 runs each, the new photo in both: LCP median 1176 → 1496 ms (the LCP element moved from the CRIZ text to the portrait, whose load time did not change; both under 2.5 s); CLS 0.014 → 0.050 (a font-swap wrap at 0.276 was fixed with `whitespace-nowrap`); JS 225.6 → 226.1 KB; HTML 14.3 → 15.0 KB; CSS 18.9 → 19.2 KB; frames over 34 ms in the first 3.5 s: 4–7 → 7–8 of about 120. No real mid-range phone tested. Reduced motion: 0 hero animations, the still. Paused-animation filmstrip at 1440 and 390, hover gives `grayscale(0)`, 0 console errors. `pnpm check` 43/43; `pnpm test:e2e` public.spec + the 4 CMS tests that draw the hero frame 17/17 (run before the portrait light, hover and nowrap, which no test covers). Hero pin + name slide stays open: Criztian picked load only. Responsive fix (Criztian, same day): the tablet and desktop hero is one screen tall, so headline, Book a call and note fit the first screen at 768×830, 1010×830, 1024×768, 1280×720, 1366×650 and 1440×790 (before: the note 70–210 px below the fold); 1440×900 and 1920×1080 unchanged (portrait 600×900 at x 420 / 720×1080 at x 600, name 425 / 575, fade y 792 at 1920); 768×1024 portrait 429×644 (Figma 440×660, whose tablet hero is 1040 tall); phone unchanged. `pnpm check` 43/43; public.spec 13/13.

Done 2026-10-29 (Smooth scroll + nav hide, Criztian's direction): Lenis 1.3.27 as `<ReactLenis root>` in the marketing layout with lurais.framer.website's setting, read from its bundle (Framer "Smooth Scroll" at intensity 20 = `new Lenis({ duration: intensity / 10 })`, so `duration: 2`), plus `anchors` and `stopInertiaOnNavigate`; `data-lenis-prevent` on the booking popup, its backdrop and the menu Sheet; `useNavHidden` slides the header up past 80 px while the page moves down and back on any move up, every size; keyboard focus brings it back. Browser run on webpack production builds, 0 console errors: one 300 px wheel step at 1440 moves 150 px by 200 ms, 291 by 1 s, 300 by 1.7 s, never backwards; nav Work glides 0 → 1334 px in 2.0 s, never backwards (no flash from Next's own jump), Work 79.6 px from the top (scroll-mt 80), URL `/#work`, nav hidden after; from `/blog` it lands the same; nav top −80 after scrolling down, 0 after scrolling up and at the top, Tab brings it back; phone touch scroll of 485 px hides it (−64), scrolling back up shows it; the wheel over the open popup or menu moves the page 0 px (124 px without the attribute); menu → Work lands on Work at 390 (touch) and 1024, with and without reduced motion (Work top 64 / 63.6). Reduced motion: link jump in 1 frame, wheel step settles in 117 ms, no header transition. Before → after (HEAD worktree, phone 390, `/_next/static` JS on `/`): 231.1 → 237.9 KB transferred (18 → 19 files), 789.2 → 809.6 KB decoded; frames over 34 ms at 4× CPU, 3 runs each: phone touch scroll (3,000 px) 0/0/1 → 1/0/0 of about 178, desktop wheel scroll (10 steps) 0/0/0 → 0/1/0 of about 210. Fixed during the run: `focus-within` kept the nav open after a mouse click on a nav link; it is `has-focus-visible` now. `pnpm check` 43/43; `pnpm test:e2e` 31/32, the 2 new tests pass. The 1 failure, `cms.spec.ts:1156` ("saves a draft in the editor"), fails the same at HEAD 09a5170 (3/3 here, 1/1 there): `article p` now resolves to the summary paragraph ("Written in the editor."), so the frame selects Summary, not Body. Open since the blog restyle, outside this change.

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
