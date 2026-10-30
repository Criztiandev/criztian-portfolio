# Motion

Figma: n/a, built before v0.3 (no storyboard; "Motion test — portfolio" was a tool test only) · Motion page n/a

**This file is a record of what's built, not a plan.** Every box in docs/build-plan.md phase 5 is ticked and each page was picked by Criztian. Written 2026-10-30 by ca's /wmotion (built-site mode, audit only).
**How the scroll points were measured:** on localhost (dev server) at 1440×900, from every running scroll animation's range (`animation-range` + its subject's layout), mapped to the section's top edge as a % of the viewport. Range lengths are px of scroll. All 355 home scroll animations are linear, 0 pops (none under 100 px from 10 to 90%), all lit by the page end. Not measured here: touch sizes (Touch column is from cc's build log), frame rate on a real phone.

## Thesis
**Lights up.** The page opens in the dark; the scroll lights things in reading order and dims them on the way back up; the last light on the page is Book a call. Focal moment: the hero load, the only timed sequence on Home. Continuity: the hero exit hands the load to the scroll; subpages "open" top-down like a page loading. Feedback: instant underline and colour swaps (no interaction run yet, see Open questions). Budget: a signature scroll story (the Work hold), CSS scroll timelines with zero motion JS apart from Lenis. Calmed by "Soft" (2026-10-30) so nobody gets dizzy.

## Values
Timed entrances (`--ease-out` = cubic-bezier(0.22, 1, 0.36, 1)): letters and words rise 1.1–1.2 s, 90–120 ms apart · light 20% → 100% over 900 ms · portrait rise 1.4 s, light 1.2 s · nav drop 1 s · copy rise 1 s · screen or column open 1.4–2 s (the on-screen part on the ease-out, the rest linear).
Tokens: `--motion-fast` 150 ms · `--motion-base` 300 ms · `--motion-slow` 600 ms.
Scroll-scrubbed: linear, always (ease-out put 80% of the change in 50–55 px). Windows: letter or word 150 px (120 px from 10 to 90%) · body 200 px · step 300 px · card or screen open 240–360 px · photo rise 400 px.
Travel caps ("Soft"): climbs 80 px at most · hero name slides 160 px · About photo rises from 25% of its height.
Smooth scroll: Lenis 1.3.27, `duration: 1.2` (was 2), anchors, stopInertiaOnNavigate; mouse and trackpad only; `data-lenis-prevent` on the booking popup and the menu.
Breather between home sections: 25svh at 1280 and up (225 px at 900 tall), 12svh below (101 px at 844).
Reduced motion: the still everywhere (cc checked every page, 2026-10-30).

## Load
Home: 3.3 s total · main action (hero Book a call) shows 1.95 → 2.95 s, nav Book a call 2.08 → 3.08 s · order: frame 1 all black → portrait rises from below its clip at 30% (0–1.4 s) and name letters rise → name lights from the center out and the portrait lights (1.1–2.4 s) → headline words rise (from 1.4 s) → nav drops in, 5 items 120 ms apart (1.6–3.1 s) → sub, buttons and note rise (1.8–3.1 s) · timeline n/a, built before v0.3 · MP4 n/a
Other pages: nav from 200 ms (Book a call 0.68 → 1.68 s); each page's own load is in its table.

## Nav
Menu open/close: UI kit Sheet below 1280, opacity and slide 150–200 ms ease-in-out (not tuned in the motion phase) · hide or show on scroll: hides after 80 px going down, comes back on any move up and on keyboard focus, transform 300 ms ease-out, every size · timeline n/a, built before v0.3 · MP4 n/a

## Pages

### Home
Styles: 1 · Lights up, picked section by section (each row's concept below) | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | brand moment | See Load. | time | — | same load | portrait, name, copy | n/a |
| 1 | Hero exit "Layers" | continuity | The name slides 160 px left; the 10 headline words rise out of their masks; sub, buttons and note rise out. Nothing dims, the portrait stays. | scroll 0 → 1000 px (top at 0% → −111%). Name 1000 px. Words 0 → 420 px, 150 px each. Copy 60 → 460 px, 200 px each | Passed: "Lights out", "Rewind". Removed in Soft: the portrait sinking against the name. | load only, no exit | name, portrait, copy | n/a · dennissnellenberg.com hero exit |
| 2 | Stakes ink | attention | The headline inks word by word (20% → 100%), both ways; the body rises after. | top at 72% → 11% (550 px). Words 72% → 27%, 150 px each. Body 33% → 11% (200 px) | Played once (he asked for scrubbed). Ease-out (pop). | same ink | — | n/a · lurais.framer.website |
| 3 | Work "Long road" (signature) | brand moment | Desktop hold: the project screens ride one column that never stops; each set lights at its place, its row lights and opens; "Your place" frames draw empty; Book a call rises last. | Heading letters top at 87% → 51% (320 px). Road top at 100% → −200% (2700 px). Pin 1800 px (top at 0%). Into the pin: row 1 −360 → 396, set 1 lights −306 → 585, row 2 315 → 1152, set 2 lights 396 → 1341, set 3 lights and draws 882 → 1314, row 3 1071 → 1368, Book a call 1368 → 1638 | Passed: "Spotlight" (swap in place), "Grow" (Flip, scrubbed). Never park the moving thing. | stacked, no hold; each screen rises from its clip once fully on screen | desktop screens, phone column, "your site" frames | n/a · lamalama.com work list |
| 4 | How it works "Stairs" | state | The 3 steps climb in from 48 / 64 / 80 px and land in order, each closing up and lighting as it lands; its line draws in Smoke. | top at 80% → −3% (750 px). Heading 80% → 54%. Steps 67% → 7%, 300 px each, 120 px apart. Lines 40% → −3% | Passed: "Fuse", "Count". | under 1280: stacked, each step on its own timeline, one at a time | — | n/a |
| 5 | About "Echo" | brand moment | The hero load replayed by the scroll: "Hi, I'm" word by word, "Criztian." letter by letter; the photo rises from 25% and lights from 0.3; body, numbers and labels rise one by one. | top at 80% → −24% (930 px). Heading 80% → −15%, 150 px each. Photo rise 67% → 22% (400 px), light 50% → 22%. Body and numbers 53% → −24% | Passed: "Out from behind", "Shutter". | under 1280: photo still, text one block at a time | photo | n/a |
| 5b | Blog "Write" | state | "Blog" and each title written letter by letter; date and summary rise; "All posts" last. | top at 80% → −22% (915 px). Letters 80% → −3%, 150 px each. All posts −5% → −22% (150 px) | Passed: "Ruled", "Stack". | titles rise word by word | — | n/a |
| 6 | Prices "Open" | state | "PRICES" letter by letter; the cards open top-down one after another, the light following the edge; each price rises last; notes, then Book a call. | top at 80% → −75% (1400 px). Cards open 38% → −24%, 360 px each, 100 px apart. Prices done by −34%. Book a call −59% → −75% (150 px) | Passed: "Tiers", "Across". | each card opens on its own timeline and its price rises; nothing else inside moves | — | n/a |
| 7 | Footer "Sign-off" | brand moment | The heading written letter by letter like the hero name; "Or email", the email and socials rise; Book a call rises dim and lights last, the last light on the page. The bar stays still. | top at 68% → 14% (485 px, done 20 px before the page end). Letters 68% → 22%. Email, socials, Book a call 43% → 15% | Passed: "Answer" (the Stakes ink, the DESIGN.md beat), "Landing" (Stairs). | under 1280: heading word by word, then Book a call | — | n/a |

### Case study `/work/[slug]`
Styles: 1 · "Open", the Prices open carried to the screens: the page draws itself like a browser loading | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3
Measured on `/work/roudon-smith` (5967 px of scroll).

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | continuity | Title words rise and light 200 → 1750 ms; the big screen opens top-down 500 → 2500 ms; sub and meta rise 900 → 2050 ms. | time | — | same load | — | n/a |
| 1 | The business | state | Heading words rise and light; paragraphs open top-down. | top at 80% → 25% (495 px) | — | paragraphs still | — | n/a |
| 2 | BEFORE | state | Letters rise; screens open top-down, captions light as the edge passes. | top at 80% → −25% (940 px). Screens 360 px each | — | whole words; screens open over 240 px | — | n/a |
| 3 | The 3 notes | state | Open one after another, title and body lighting with the edge. | note top at 83% → 34% (440 px), 100 px apart | — | notes open | — | n/a |
| 4 | AFTER and the 3 changes | state | AFTER letters rise; each change's title rises word by word and its screen opens. | AFTER top at 80% → 30% (450 px). Each change top at 73% → 33% (360 px) | — | change titles still | — | n/a |
| 5 | What I'd measure | state | Items rise one by one. | top at 80% → 12% (610 px) | — | same | — | n/a |
| 6 | Next band | feedback | All work rises from its clip last. | top at 87% → 70% (150 px) | — | same | — | n/a |
| 7 | Footer | brand moment | Same as Home row 7. | top at 68% → 14% | — | same | — | n/a |
Passed for this page: "Echo" (the hero load replayed), "Spotlight" (dims what was read; lost).

### Blog list `/blog`
Styles: 1 · "Open", the case study's page loading carried to the blog | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | continuity | "BLOG" letters rise and light 200 → 1570 ms; intro 900 → 1900 ms; the newest post opens top-down 500 → 1900 ms, its text lighting with the edge. | time | — | same load | — | n/a |
| 1 | Older rows | state | Each row opens top-down, its text lighting as the edge passes. | row top at 87% → 60% (240 px); with 3 posts, done by 434 px | — | rows open, lights still | — | n/a |
| 2 | Footer | brand moment | Same as Home row 7. | top at 68% → 14% | — | same | — | n/a |
Passed for this page: "Write" (titles letter by letter), "Layers" (the hero exit).

### Blog post `/blog/[slug]`
Styles: 1 · "Open", as the blog list | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3
Measured on `/blog/welcome-to-our-new-website` (1181 px of scroll).

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | continuity | Title words rise and light 200 → 1660 ms; rail and lead open 900 → 2400 ms; the article column opens 1100 → 3100 ms. | time | — | same load | — | n/a |
| 1 | Article blocks below the fold | state | Paragraphs, list lines and table cells open; h2s rise word by word; the quote opens slowly; the author photo opens. | block top at 100% → 78% (200 px; list lines and cells 150, quote 360). On this short post: part-way at load, done by 181 px | — | paragraphs, list lines and cells still | — | n/a |
| 2 | Next band | feedback | Title words rise; links rise last. | top at 80% → 23% (510 px) | — | same | — | n/a |
| 3 | Footer | brand moment | Same as Home row 7. | top at 68% → 14% | — | same | — | n/a |

### Privacy
Styles: 1 · "Open", the blog pages' open on a short reading page | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | continuity | "Privacy" letters rise and light 200 → 1840 ms; date 900 → 1900 ms; the sections column opens 1100 → 3100 ms. | time | — | same load | — | n/a |
| 1 | Sections | state | Each section opens top-down; its heading rises word by word and its body lights as the edge passes. | section top at 98% → 73% (220 px). First 2 sections done at load; the other 3 at 6 → 226, 265 → 485, 440 → 660 px | Passed: Stairs depth, letter-written headings. | section opens only | — | n/a |

### 404
Styles: 1 · "Stairs", How it works' stairs on load (one screen, no scroll) | 2 · n/a, built before v0.3 | 3 · n/a, built before v0.3
Slice: n/a, built before v0.3

| # | Section | Job | Beat (built) | Scroll points (1440×900) | Not here | Touch | Layers | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Load | brand moment | The 3 digits climb from 110 / 140 / 170% (200 → 2040 ms) and light as they land; the message words climb from growing depths and close up (1200 → 2600 ms); Back to home climbs (1500 → 2900 ms); Book a call climbs dim and lights last (1650 → 3200 ms). | time | Passed: "Echo", "Open". | digits and Book a call only | — | n/a |

## Interaction layer  (as built; never had its own run)

| Element | Hover | Press | Focus | Touch | Values | Timeline |
| --- | --- | --- | --- | --- | --- | --- |
| Book a call (nav, hero, Work, Prices, footer) | background and text colour swap | 1 px down (UI kit) | 3 px ring | press only | instant (0 s transition) | n/a |
| Text buttons (nav Work / Prices / Blog, See the work, All posts, socials, case study links) | underline | 1 px down | ring | press only | instant | n/a |
| Work rows | underline; the shots lift to 1.02 | none | the row lights with its detail shown | no lift | Work spring, 1.014 by 100 ms | n/a |
| Home blog rows | lift 1.01; title underlines across the letters | none | **none found** | none | Work spring | n/a |
| `/blog` rows | as Home blog rows | none | **none found** | none | — | n/a |
| Logo | **none** | none | ring | — | — | n/a |
| Footer email, Blog, Privacy | underline | none | ring | — | instant | n/a |
| Inline body links (post, Privacy email) | none (already underlined) | none | ring | — | — | n/a |
| Hero name letters (not a link) | dim to 20% under the cursor, then relight | — | — | none | 300 ms ease-out | n/a |
| Hero portrait | black and white → colour | — | — | none | — | n/a |

## Assets
Real project screenshots (Roudon-Smith Winery, J&T Express), his portrait (black and white, colour on hover), the About photo, the "your site" frames drawn empty in CSS. No stock mockups, no 3D, no AI images.

## References
- dennissnellenberg.com · hero exit · the name slides 0.4 px per px of scroll (calmed to 0.16)
- lurais.framer.website · light-up (dim 20% → 100%) and Lenis glide · Smooth Scroll 20 = `duration: 2` (calmed to 1.2)
- lamalama.com · work list · click-to-open Flip (not used); its sticky button's clip reveal became Book a call's rise
Numbers and code reads: docs/website-plan.md, "Reference motion".

## Open questions
1. **Main action is late on Home (data). Decided: keep.** Book a call shows at 1.95–2.95 s (hero) and 2.08–3.08 s (nav). It's the approved hero load (Criztian, 2026-10-30).
2. **The interaction layer never had its own run (data).** 22 of 24 Home links and buttons answer with an instant swap (underline or colour, 0 s transition); the logo has no hover. taste.md asks for a physical answer within 100 ms. Fix with `/wmotion interactions` in cc when he wants it.
3. **Not measured:** frame rate on a real mid-range phone (phase 5's "Done when" still says so); touch sizes in this audit (taken from cc's log).
4. **Accessibility, from cc's log, still open:** the WORK heading's letters have no `aria-label`, so it can read "W O R K".
