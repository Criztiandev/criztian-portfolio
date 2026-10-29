# Build plan — Criztian portfolio

**Last pack:** 2026-10-29, second pack (pricing: docs/website-plan.md, docs/handoff.md, PRODUCT.md). No git repo existed at pack time (Phase 1 fresh init in progress); the first pack was on template commit `fcec601`. Fresh repo first commit: `30e5a37` (Phase 1, 2026-10-29).

Build one phase per run, in order. Plan first, wait for Criztian's OK, then build. Tick the boxes as you go.

## Figma

- File key: `SBq7maOIwqSa2V8MRCVSXz` (https://www.figma.com/design/SBq7maOIwqSa2V8MRCVSXz)
- Page **Design** `39:2` holds the frames below. Tokens, text styles and components live on page **Brand** `1:3`.
- Page max 1440: there are no Large 1920 frames. At 1536 and up, content stays centered at 1440 and the black bands stay full-bleed.

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

- [ ] 0 · Nav
- [ ] 1 · Hero
- [ ] 2 · Stakes
- [ ] 3 · Work (desktop stage layout static on row 1; tablet / phone stacked)
- [ ] 4 · How it works
- [ ] 5 · About
- [ ] 6 · Prices
- [ ] 7 · Footer
- [ ] Booking popup (Cal.com embed) with loading + error states, desktop and phone
- [ ] 404 page
- [ ] Privacy page

Done when: each section matches Figma at 390, 768, 1440 and 1920 (centered at 1440).

### 5. Motion

- [ ] Load (name rise + portrait fade).
- [ ] Hero pin + name slide (desktop + tablet).
- [ ] Stakes word reveal (once).
- [ ] Work pin with row switching (desktop only).
- [ ] Fade-ups, hover, nav hide/show.
- [ ] Reduced motion: stills, stacked Work.

Transform and opacity only, no layout shift, content visible without JavaScript, still under reduced motion, no hover-only effects on touch screens. Done when: every effect runs at 60 fps on a mid-range phone (or is cut), and the JavaScript bundle size before and after is reported.

### 6. Review and launch

- [ ] Every section at 390, 768, 1440, 1920 plus the edges 360 and 1279.
- [ ] Lighthouse performance, accessibility and SEO scores pasted here.
- [ ] No console errors, no unlabeled placeholders, every button goes somewhere real.
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
10. ➡️ Sections phase (Hero), with item 11. `src/data/home.data.ts:3-7` and `src/model/home.model.ts` — hero heading/text + contactHeading → the home content from docs/website-plan.md, in `src/data/*.data.ts`, in the same shape the CMS home collection saves. No `contactHeading`.
11. ➡️ Sections phase, with the Hero: 4 CMS e2e tests are built on the form, so they get rewritten once. Add a migration dropping `contact_messages` (anon may insert). **Contact form (cut list #4):** `src/components/home-view.tsx:3` and `:30-37`, `src/components/contact-form.tsx`, `src/components/contact-message-list.tsx`, `src/app/dashboard/messages/page.tsx`, `src/router/contact.router.ts` (+ its entry in `src/router/app.router.ts`), `src/service/contact.service.ts`, `src/repository/contact-message.repository.ts`, `src/model/contact.model.ts`, `src/type/contact.type.ts`, `src/type/contact-message.type.ts`, `src/util/contact.util.ts`, `test/contact.test.ts`, and the contact references in `src/config/cms.config.ts`. Remove; keep Resend only if something else uses it.
12. ✅ **Blog: keep it, live at launch (decided 2026-10-29).** Keep `src/app/(marketing)/blog/` and the CMS blog collection. The blog index and post pages are being designed in the Claude app; don’t restyle them until a later pack adds their Figma frames and phase. Remove only the public "Log in" and "Contact" nav links for now (item 9).
13. ✅ `src/app/(marketing)/login/` — keep the route for Criztian; no public link to it.
14. ✅ Down-mode fix ported from J&T; the full real content comes with the Sections phase. `src/app/(marketing)/page.tsx:8-19` — home content comes from Supabase (`revalidate = 3600`) with a fallback to defaults. Make sure the fallback is the full real content, so the page is complete with the database paused.
15. ✅ (icon.svg, favicon.ico 16+32, apple-icon.png 180 in src/app) `src/app/favicon.ico` — the template icon → build from `public/brand/criztian-icon.svg` (32 + 16 px), plus an apple-touch icon.
16. ✅ `README.md` — the template readme → a short portfolio readme.
17. **Case-study pages are being designed in the Claude app** (`/work/[slug]` for Roudon-Smith and J&T, one template). Both projects get one at launch; Roudon-Smith first. Don’t build them yet; a later pack adds the Figma frames and the phase.
18. ➡️ Sections phase (rows 84-86). New routes needed: `/privacy`, a custom 404 (`not-found.tsx`), the Cal.com booking popup.
