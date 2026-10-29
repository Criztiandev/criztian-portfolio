# Brand — Criztian

Source of truth: Figma file `SBq7maOIwqSa2V8MRCVSXz` ("Criztian — Brand v2"), page **Brand** (`1:3`, board `20:2`). Every value below was read from the Figma variables and styles on 2026-10-29. If this file and Figma disagree, Figma wins: tell the planner (Claude app).

## Personality

- **ARE:** Reliable · Warm · Skilled · Bold (Bold = the look only; the words stay calm).
- **NOT:** Flashy (motion for show, slow pages) · Cheap (template look, discount talk) · Salesy (hype, "10x", guarantees).
- **Values, ranked (higher wins a clash):** 1. the client's results (a fast site beats heavy animation) · 2. reliability (on time beats more polish) · 3. craft.
- Archetype: Creator. Metaphor: Porsche 911 (beautiful, engineered, reliable every day).

## Colors

### Primitives (collection "Primitives")

| Token            | Hex     | CSS (Figma code syntax) | Role                                  |
| ---------------- | ------- | ----------------------- | ------------------------------------- |
| `color/black`    | #0A0A0A | `var(--color-black)`    | page                                  |
| `color/graphite` | #232323 | `var(--color-graphite)` | panels, popup, hairlines              |
| `color/paper`    | #F4F4F1 | `var(--color-paper)`    | text, the giant name, the Stakes band |
| `color/smoke`    | #8A8A86 | `var(--color-smoke)`    | second text, labels, inactive rows    |
| `color/red`      | #E1251B | `var(--color-red)`      | the action + big numbers only         |
| `color/white`    | #FFFFFF | `var(--color-white)`    | text on red only                      |

### Semantic (collection "Color", mode Dark — the only mode)

| Token                  | Points to | CSS                           |
| ---------------------- | --------- | ----------------------------- |
| `color/bg/page`        | black     | `var(--color-bg-page)`        |
| `color/bg/surface`     | graphite  | `var(--color-bg-surface)`     |
| `color/text/primary`   | paper     | `var(--color-text-primary)`   |
| `color/text/muted`     | smoke     | `var(--color-text-muted)`     |
| `color/text/on-accent` | white     | `var(--color-text-on-accent)` |
| `color/accent`         | red       | `var(--color-accent)`         |
| `color/border/subtle`  | graphite  | `var(--color-border-subtle)`  |

Contrast (measured): paper on black 18:1 · smoke on black 5.7:1 · white on red 4.7:1 · red on black 4.2:1 (so red **text** only at 24 px and up).
Mix: about 80% black, 15% paper, under 5% red. Red never fills large areas. The site is dark only; there is no light theme.

## Fonts

| Font      | Weights used | Where it comes from               | License                   |
| --------- | ------------ | --------------------------------- | ------------------------- |
| **Anton** | 400          | Google Fonts (`next/font/google`) | SIL Open Font License 1.1 |
| **Inter** | 400, 600     | Google Fonts (`next/font/google`) | SIL Open Font License 1.1 |

Anton = the name, headlines and big numbers. Inter = everything people read. Never Anton for body text. No other fonts.

## Text styles (from Figma)

| Style                   | Font      | Size | Line height | Tracking | Notes                                                                        |
| ----------------------- | --------- | ---- | ----------- | -------- | ---------------------------------------------------------------------------- |
| Display/Giant — Desktop | Anton 400 | 425  | 85%         | 0        | hero name; scale 375 at 1280 → 425 at 1440                                   |
| Display/Giant — Large   | Anton 400 | 576  | 85%         | 0        | hero name; scale 456 at 1536 → 576 at 1920+                                  |
| Display/XL — Large      | Anton 400 | 208  | 90%         | 0        | WORK, PRICES, BEFORE, AFTER, BLOG at 1536+; scale 160 at 1536 → 208 at 1920+ |
| Display/Giant — Tablet  | Anton 400 | 220  | 85%         | 0        | hero name; scale 220 at 768 → 379 at 1279                                    |
| Display/Giant — Phone   | Anton 400 | 222  | 85%         | 0        | CRIZ / TIAN stacked; scale 203 at 360 → 456 at 767                           |
| Display/XL              | Anton 400 | 160  | 90%         | 0        | WORK, PRICES (desktop)                                                       |
| Display/L               | Anton 400 | 96   | 95%         | 0        | other section titles (desktop); WORK, PRICES (phone)                         |
| Heading/H1              | Anton 400 | 64   | 100%        | 0        | Stakes, footer, About numbers (tablet/phone), prices                         |
| Heading/H2              | Anton 400 | 40   | 105%        | 0.5%     | hero promise, row names, package names                                       |
| Body/Large              | Inter 400 | 20   | 150%        | 0        | About intro                                                                  |
| Body/Base               | Inter 400 | 18   | 28 px       | 0        | all reading text and trust lines                                             |
| Body/Small              | Inter 400 | 14   | 150%        | 0        | footer bottom bar only                                                       |
| Label                   | Inter 600 | 12   | 130%        | 8%       | uppercase; Work row meta line                                                |
| Button                  | Inter 600 | 16   | 100%        | 0        | buttons and links                                                            |

Giant type is sized so the longest real word fits the narrowest width of its range (CRIZTIAN at 1280 and 768; CRIZ / TIAN at 360). Scale between the min and max with `clamp()`.

## Layout tokens (collection "Layout")

- Spacing: `space/1 2 3 4 6 8 10 12 16 20 24 30 40` = 4 8 12 16 24 32 40 48 64 80 96 120 160 px (same numbers as Tailwind).
- Gutters: `layout/gutter-phone` 16 · `layout/gutter-tablet` 32 · `layout/gutter` 40.
- `layout/page-max` 1920 · `layout/content-max` 1840 (changed from 1440 / 1360 in the fourth pack, 2026-10-29). Reading text max 720 px.
- Radius: `radius/none` 0 (the site uses only this) · sm 8 · md 24 · lg 40 · pill 9999 (exist in Figma, unused).
- Motion: `motion/fast` 150 ms · `motion/base` 300 ms · `motion/slow` 600 ms. Easing (judgment): ease-out `cubic-bezier(0.22, 1, 0.36, 1)`.

## Effects

- `Shadow/Overlay`: drop shadow 0 24 px 64 px, black 50%. Booking popup panel only.

## Logo

Files in `public/brand/`:

| File                          | Use                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `criztian-wordmark.svg`       | Primary: CRIZTIAN in Anton, Paper White, for black backgrounds                |
| `criztian-wordmark-black.svg` | One color: black on white (email, print, light backgrounds)                   |
| `criztian-mark.svg`           | Short mark "C." (Paper White C, Signal Red period): nav, avatars, stamps      |
| `criztian-icon.svg`           | "C." on a black 64 px tile: favicon and app icon (checked at 64 / 32 / 16 px) |

Rules:

- Clear space = the height of the C on every side.
- Minimum size: wordmark 80 px wide on screens (20 mm in print); short mark 16 px.
- The period in "C." is always Signal Red.
- Don't stretch, outline, add glow or gradients, recolor the C, set it in any font but Anton, or place it on a photo without a dark area.

## Imagery

- Black-and-white photos of him only. Hero: stern, chest-up, top light, black background (`public/images/hero/criztian-portrait.png`, transparent cut-out). About: relaxed, small smile, at a desk (`public/images/about/criztian-about.png`).
- Both photos are AI restyles of his real face (his decision). They must pass the friends' "that's you" check before launch.
- Work images are real screenshots of real work, shown in plain frames drawn with brand tokens. No photo-real device mockups.
- No stock photos, no stock smiles, no other AI images, no glow on letters.

## Voice

A calm pro on your side. Plain words, no hype, real numbers.

- Sample lines: "I design it, build it, and I'm still here after launch." · "You'll know the price and how many changes you get before we start." · "Your place deserves a website as good as it is."
- **Use:** bookings, customers, your place, straight answers, yours to keep.
- **Avoid:** digital experiences, 10x, guaranteed, conversion, leads, crafting, elevate, unlock, seamless, empower.
- Never promise visibility or rankings. Promise bookings, calls and visits.

## Do's and don'ts

- **Do** keep red for the action and big numbers.
- **Do** keep hard edges (radius 0) everywhere on the site.
- **Do** use the drawn SVG icons (arrow down, arrow up-right, menu, close) with the color set per use.
- **Don't** use gradients, glass, glow or gradient text.
- **Don't** use eyebrow labels above headings, or 01 / 02 / 03 numbering where the order means nothing.
- **Don't** use cream grounds, serif titles over food photos, pill buttons, stock smiles or centered hero copy (the competitors' shared look).
