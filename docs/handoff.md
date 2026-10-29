# Handoff — Criztian portfolio

As of 2026-10-29. Planned in the Claude app (ca); built by Claude Code (cc) from `docs/build-plan.md`.
The template's own handoff moved to `docs/template-handoff.md` (still the reference for how the CMS works).

## Status

Brand, website plan and Figma design are done and approved by Criztian. The design passed a fresh-eyes Awwwards-style review at 7.0 / 10 with zero instant fails. Next: Claude Code builds, phase by phase. Launch target: about Tue, Nov 17, 2026.

## Decisions (don't re-ask)

| Decision                                                                                                                                                                                                                                                                 | Who                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Audience: owners of US customer-facing small businesses; main channel = cold email with a concept redesign, Upwork backup                                                                                                                                                | Criztian                                              |
| Goal: booked discovery calls, target 3 a month within 3 months of launch                                                                                                                                                                                                 | Criztian                                              |
| One page + 404 + Privacy; case studies are rows on the home page                                                                                                                                                                                                         | Criztian                                              |
| Experience: scroll-driven on hero + Work (desktop), light motion elsewhere; tablet and phone have no pin                                                                                                                                                                 | Criztian                                              |
| Page max 1440 centered; bands full-bleed; no 1920 frames                                                                                                                                                                                                                 | Criztian                                              |
| "Book a call" = Cal.com popup, https://cal.com/criztian/discovery, free 20 minutes, Cal Video. No contact form                                                                                                                                                           | Criztian                                              |
| Proof = concepts only; no testimonials until real                                                                                                                                                                                                                        | Criztian                                              |
| Prices shown as "From $X" per package (3 packages)                                                                                                                                                                                                                       | Criztian                                              |
| Roudon-Smith = screens only, labeled concept, no live link; its 2× re-exports wait until after launch                                                                                                                                                                    | Criztian                                              |
| Keep the CMS (dashboard, editor, Supabase) in the portfolio. Still cut: public blog, contact form, public login link                                                                                                                                                     | Criztian                                              |
| Limit: the public site keeps working when the database is down (Supabase free pauses after 7 days idle)                                                                                                                                                                  | Claude (planner)                                      |
| Reply-time promise = 24 hours (About stat + booking error text)                                                                                                                                                                                                          | Criztian                                              |
| Both photos are AI restyles of his real face; must pass a friends' "that's you" check                                                                                                                                                                                    | Criztian                                              |
| Footer socials: LinkedIn, Instagram, Facebook as Smoke text links (not logos); no X                                                                                                                                                                                      | Criztian + Claude                                     |
| The Philippines is kept quiet on the site, never faked                                                                                                                                                                                                                   | Criztian                                              |
| Never promise visibility or rankings; "see your redesign before you pay" is outreach only                                                                                                                                                                                | Criztian                                              |
| No Web3, crypto or gambling                                                                                                                                                                                                                                              | Criztian                                              |
| Build path: code-first from Figma (impeccable `buildPath: code`)                                                                                                                                                                                                         | Criztian                                              |
| Body text 18 px minimum for anything answering a buyer's worry; trust lines in Body/Base                                                                                                                                                                                 | Criztian (review fix)                                 |
| Prices (from): Starter $1,500 · Standard $2,500 · Premium $4,000 · pages up to 3 / 5 / 7 · rounds 2 / 3 / 4 · editor in Standard + Premium · care plan from $150/month                                                                                                   | Criztian (picked Claude's recommendation, 2026-10-29) |
| Founding price: first 3 clients get the Starter for $800, for a written review + case study. Outreach only, never on the site; ends after client #3                                                                                                                      | Criztian (Claude's recommendation)                    |
| How it works step 3 = "I research, design, build." + the research line + "Most sites go live in 3–6 weeks." Call stays step 1 (research only after a yes); no 2-week promise (10–20 h/week next to the day job)                                                          | Criztian (picked Claude's recommendation, 2026-10-29) |
| No \"View details\" popup on the price cards; one \"Every package\" line under the cards instead                                                                                                                                                                         | Criztian (Claude's recommendation)                    |
| Legal = 1 Privacy page with a cookies section (CalOPPA basics: what's collected, who else sees it, Do Not Track, see/fix/delete, how changes are announced). Refunds and terms live in the client contract; no cookie banner, so the analytics tool must not use cookies | Criztian (Claude's recommendation, 2026-10-29)        |
| Case study template (5 parts + next + footer), Roudon-Smith first; BEFORE on the page's one Paper White band                                                                                                                                                             | Criztian (approved the desktop, 2026-10-29)           |
| Blog design: type-only posts (no image field), newest post big, older as rows; no pagination, tags or search until 10+ posts                                                                                                                                             | Criztian (approved, 2026-10-29)                       |
| Blog reached from a footer link; the top nav stays at 3 links                                                                                                                                                                                                            | Claude (judgment); Criztian can veto                  |
| Roudon-Smith Work row gets "Read the case study"                                                                                                                                                                                                                         | Claude (judgment); Criztian can veto                  |
| Motion for the new pages: Criztian directs it himself in Claude Code                                                                                                                                                                                                     | Criztian (2026-10-29)                                 |
| Contact email everywhere = criztiandev@gmail.com (replaces hello@criztian.dev)                                                                                                                                                                                           | Criztian (2026-10-29)                                 |
| Case study AFTER = 3 rows, each answering one BEFORE note with one screen; the separate "Why" section folded in and removed                                                                                                                                              | Criztian (review fix, 2026-10-29)                     |
| Blog quotes = a big Anton line, no side bar                                                                                                                                                                                                                              | Criztian (review fix, 2026-10-29)                     |
| Design review of the new pages: round 1 = 6.65, round 2 = 7.2 (pass, no instant fails); round-2 fixes applied (3rd note reworded, clean club crops, phone quote, "All work" always shown). "Most members pick this." kept: it's their own site's claim                   | Fresh reviewer (judgment) + Claude (data)             |

## Open questions

| Question                                                                                           | Who answers                             | Blocks                |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------- |
| Buy criztian.dev (the site's domain); the contact email stays criztiandev@gmail.com                | Criztian                                | launch                |
| Analytics tool (named on the Privacy page)                                                         | Claude Code proposes, Criztian approves | launch                |
| Cal.com event still set to 40 minutes; change to 20 + new description (see his Cal setup notes)    | Criztian                                | launch                |
| Instagram and Facebook URLs assumed `criztiandev`; open each to confirm                            | Claude Code checks, Criztian confirms   | launch                |
| Friends' "that's you" check on both photos                                                         | Criztian                                | launch                |
| Hero portrait is 1024 × 1536; upscale 2× (e.g. Upscayl) for sharp retina                           | Criztian                                | launch (nice to have) |
| Launch date for the Privacy page                                                                   | Criztian                                | launch                |
| J&T case study copy: what was wrong with jtexpress.ph, the 3 main changes and why, what to measure | Criztian → Claude app                   | J&T case study        |
| The 3 real blog posts (the Figma titles are working titles)                                        | Criztian                                | blog at launch        |
| Client contract: deposit and refund terms written in                                               | Criztian                                | first client          |
| Fresh-eyes design review of the new pages (running in the Claude app)                              | Claude app                              | possible small fixes  |

## Links

- Figma (single source of truth): https://www.figma.com/design/SBq7maOIwqSa2V8MRCVSXz — file key `SBq7maOIwqSa2V8MRCVSXz`. Pages: Moodboard `0:1`, Concepts `1:2`, Brand `1:3`, Directions `36:2`, **Design `39:2`**.
- Booking: https://cal.com/criztian/discovery
- J&T concept (live): https://criztian-jnt-express-concept.vercel.app
- Roudon-Smith concept (Figma): https://www.figma.com/design/siuHAstLFZVicZv0dTvU3J (Home Desktop `30:3`, Home Phone `98:539`)
- LinkedIn: https://www.linkedin.com/in/criztian-jade-tuplano-036b85258/
- Instagram: https://www.instagram.com/criztiandev (unconfirmed)
- Facebook: https://www.facebook.com/criztiandev (unconfirmed)
- GitHub: https://github.com/Criztiandev
- References: dennissnellenberg.com · codebyjesse.com · lamalama.com
- Brand framework doc: https://claude.ai/code/artifact/3edbc550-e4b5-48cf-ba06-93e1cf992e84
- Website framework doc: https://claude.ai/code/artifact/19f23d9e-334a-437f-9eb2-5c43736b8c7f
- Project home (planner side): the markdown file `criztian-portfolio.md` Criztian keeps and attaches in the Claude app.

## Assets

| File                                                    | Source                                                           | Notes                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| `public/brand/criztian-wordmark.svg`                    | Figma Brand `20:11`, SVG export, text outlined                   | Paper White                                                |
| `public/brand/criztian-wordmark-black.svg`              | same, recolored #0A0A0A                                          | one-color version                                          |
| `public/brand/criztian-mark.svg`                        | Figma component Logo/Mark `34:76`                                | "C." with red period                                       |
| `public/brand/criztian-icon.svg`                        | Figma Brand "Icon 64" `20:23`                                    | favicon / app icon source                                  |
| `public/images/hero/criztian-portrait.png`              | original in Figma `39:6`                                         | 1024 × 1536, transparent cut-out (AI restyle of his photo) |
| `public/images/about/criztian-about.png`                | original in Figma `40:47`                                        | 1092 × 1440 (AI restyle of his photo)                      |
| `public/images/work/roudon-smith-home-desktop.jpg`      | RS Figma `30:3`, 1×                                              | 1440 × 900                                                 |
| `public/images/work/roudon-smith-wine-detail.png`       | RS Figma `30:3` crop (RSW Cuvée block), 1×                       | 1080 × 810, 4:3                                            |
| `public/images/work/roudon-smith-home-phone.png`        | RS Figma `98:539` top screen, 1×                                 | 390 × 845                                                  |
| `public/images/work/roudon-smith-wine-phone.png`        | RS Figma `98:565` crop, 1×                                       | 390 × 846                                                  |
| `public/images/work/jnt-home-desktop.png`               | live J&T site, Playwright 2×                                     | 2880 × 1800                                                |
| `public/images/work/jnt-home-phone.png`                 | live J&T site, Playwright 3×                                     | 1170 × 2532                                                |
| `public/images/work/jnt-help-detail.png`                | live J&T site help hero, 2× crop                                 | 1320 × 990, 4:3                                            |
| `public/images/work/jnt-help-phone.png`                 | live J&T site help section, 3×                                   | 1170 × 2538                                                |
| `public/images/placeholder.svg`                         | drawn for the pack                                               | Graphite with a dashed Smoke border; for any empty slot    |
| `public/images/work/roudon-smith-before-home.png`       | their live site roudonsmith.com, Playwright 2×, 2026-10-29       | 2880 × 1800                                                |
| `public/images/work/roudon-smith-before-club.png`       | their live club page, Playwright 2×, 2026-10-29                  | 2880 × 1800                                                |
| `public/images/work/roudon-smith-club-desktop.png`      | RS Figma club page `86:171`, crop y 290–1190 (full size row), 1× | 1440 × 900                                                 |
| `public/images/work/roudon-smith-after-one-button.png`  | RS Figma home `30:3`, crop x 240–1200, y 300–900, 1×             | 960 × 600                                                  |
| `public/images/work/roudon-smith-after-sizes-phone.png` | RS Figma club phone `101:676`, crop y 950–1438, 1×               | 390 × 488                                                  |

The Roudon-Smith images are 1×: fine for now, re-exported at 2× after launch.
