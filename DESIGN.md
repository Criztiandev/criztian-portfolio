---
name: Criztian
description: A dark signal board where the name is built from points of light.
colors:
  unlit-black: "#000000"
  lamp-white: "#ffffff"
  lit-grey: "#bfbfbf"
  dim-grey: "#999999"
  ghost-grey: "#737373"
  wire-grey: "#666666"
typography:
  display:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "clamp(3rem, 18vw, 16rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
  headline:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "clamp(1.75rem, 1rem + 3vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
  title:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "clamp(1.5rem, 1rem + 1.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lede:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0.14em"
  label:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.333
    letterSpacing: "0.025em"
  cue:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.22em"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "24px"
  gutter-desktop: "40px"
  header-height: "72px"
  section-y: "80px"
  cue-offset: "40px"
components:
  nav-link:
    textColor: "{colors.lit-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  nav-link-active:
    textColor: "{colors.lamp-white}"
  button-contact:
    backgroundColor: "{colors.lamp-white}"
    textColor: "{colors.unlit-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  button-contact-hover:
    backgroundColor: "{colors.lit-grey}"
    textColor: "{colors.unlit-black}"
  button-primary:
    backgroundColor: "{colors.lamp-white}"
    textColor: "{colors.unlit-black}"
    rounded: "{rounded.none}"
    height: "32px"
    padding: "0 10px"
  quote-statement:
    textColor: "{colors.lamp-white}"
    typography: "{typography.headline}"
  quote-attribution:
    textColor: "{colors.dim-grey}"
    typography: "{typography.cue}"
  input:
    backgroundColor: "{colors.unlit-black}"
    textColor: "{colors.lamp-white}"
    rounded: "{rounded.none}"
    height: "32px"
    padding: "4px 10px"
---

# Design System: Criztian

## Overview

**Creative North Star: "The Lit Signal Board"**

The site is a dark room with a display board. The name **Criztian** is not typeset. It is built from thousands of points of light that sit on black, scatter from a cursor or a finger, and spring back with a bounce. Everything around the board is quiet signage: small, tracked-out, uppercase labels at partial brightness that never compete with it. The board is what you remember, and the rest of the page exists so you can read it.

The world is **black throughout** and **strictly monochrome**. Hierarchy is set by how brightly something is lit (full white, three-quarter, dimmed, ghost), never by hue. Every corner is square, because signage and hardware are square. The only round things on the site are dots, plus one owner-made curve: the How I work orbit, a track of dashes. Motion is deliberate and cinematic. The name sweeps on dim, grows into place, and only then does the supporting copy lift in. The signature goes further: as you scroll, the dots leave the wordmark and re-form into a slowly turning cube drawn in stippled points, above a statement quote.

This file describes the public site. The owner surfaces (`/login`, `/dashboard`, the editor) are tools that use the stock shadcn neutral system with light and dark modes. Only the Square Signal Rule reaches them, because it is set at the token level.

**Key Characteristics:**

- Black ground from hero to footer. The public page ignores the OS colour scheme.
- One display voice (Antonio, uppercase) and one working voice (Geist).
- Brightness is the only emphasis tool. No accent hue.
- Zero radius. Dots are the only curves, except the How I work orbit track.
- The dot field is decorative. A real `<h1>` always carries the name.

**References (inspiration, not specs to clone):**

- **[jeffmilanes.com](https://www.jeffmilanes.com/)**. Borrow **Scene 03**: outlines of a phone and a browser drawn in scattered dots, forming shapes as the story advances. Here, that becomes the scroll-morph transition described under Components. Nothing else from this site is adopted: no scene counter, film strip, monospace labels or photography treatment. The How I work numbers are the owner's own 01–05.
- **[buckssauce.com](https://buckssauce.com/)** (owner's request, 2026-09-29). Borrow the "Why Bucks Sauce" orbit: a huge dashed ring with only its top arc in view, steps riding the rim tangent to it, a giant outlined numeral, a label plate between two dots, and digits that assemble as a step comes into view. Translated into the system: monochrome, a square plate, Antonio numerals, and the dots in place of the mascot. Nothing else from this site is adopted: no hue, no rounded pill, no mascots, no arched headline.
- **[adriavale.framer.website](https://adriavale.framer.website/)**. The Framer template the hero descends from: the dot-matrix name on black, the six-item nav, and the square outlined Contact action. The dot field is an original WebGL implementation of the same technique, not the template's component. The seeded hero tagline still matches this template word for word. It is a placeholder, not the owner's copy.

## Colors

The palette is a set of brightness levels on black. Every colour is white at some intensity.

### Primary

- **Lamp White** (`lamp-white`): the lit state. It is used for the dots of the wordmark, the text `<h1>` fallback, headlines, the active nav link, hover states, and the inverted Contact button. It is the one element on a screen that should read first.

### Neutral

- **Unlit Black** (`unlit-black`): the ground of every public section. The WebGL canvas clears to it, so the dot field and the page share one black with no seam.
- **Lit Grey** (`lit-grey`, white at ~75%): readable secondary copy, such as the hero tagline and nav links at rest.
- **Dim Grey** (`dim-grey`, white at 60%): tertiary text such as the scroll cue, helper text and metadata. At 7.4:1 on black it is still comfortable to read.
- **Ghost Grey** (`ghost-grey`, white at 45%): decorative marks only, such as the © beside the wordmark. It measures 4.4:1 on black, which is below AA for body text.
- **Wire Grey** (`wire-grey`, white at 40%): hairline outlines on interactive elements, such as the Contact button and form fields.

### Named Rules

**The Light-Is-Emphasis Rule.** Hierarchy comes from brightness alone: lamp white, then lit, dim and ghost. If something needs more attention, light it brighter. Never give it a colour.

**The Ghost Rule.** Ghost Grey never carries text a visitor has to read. If it must be read, it is Dim Grey or brighter.

**The Always-Night Rule.** The public page is black from top to bottom in every OS colour scheme. The owner can retune the six theme colours in the editor, but the seeded defaults stay dark.

**Known drift:**

- The five owner-editable tokens now seed dark (2026-09-26): page background Unlit Black, body text Lamp White, muted text Dim Grey, accent Lamp White, border Wire Grey. The page wrapper sets all five, so the header and every section read them.
- The public stage carries `dark` and `scheme-dark`, so the shadcn tokens outside those five (`--input`, `--ring`, `--card`) and native controls resolve dark in every OS scheme, and `html:has([data-status])` keeps the page scrollbar dark. Only the `body` background still follows the `.dark` / `:root` switch. Overscroll is off, so it shows only where the stage does not cover.
- Form errors are monochrome. The stage sets `--destructive: var(--foreground)` inline, so an error outlines the field in half-strength Lamp White and its message carries the meaning in words, with a warning glyph and `role="alert"`. No red.

## Typography

**Display Font:** Antonio (with a metric-matched Arial fallback), loaded through `next/font` with `display: block`.
**Body Font:** Geist (with Geist Fallback).

**Character:** a tall, condensed poster face beside a clean, neutral grotesque. Antonio shouts in uppercase and Geist keeps its voice low.

### Hierarchy

- **Display** (Antonio 700, uppercase, `min(25vw, 40svh)` on mobile and `clamp(3rem, 18vw, 16rem)` from 768px, line-height 1, tracking 0.05em in the dot sampler): the name, and nothing else. It is the source shape the dot field samples.
- **Headline** (Antonio 700, uppercase, `clamp(1.75rem, 1rem + 3vw, 3.5rem)`, line-height 1.05): every section title (My services, Who am I, Featured projects, How I work and the dust sections), and the **statement quote** under the cube. The rem term keeps it growing under page zoom (WCAG 1.4.4). Keep it clearly below Display and clearly above everything in Geist.
- **Title** (Antonio 700, uppercase, `clamp(1.5rem, 1rem + 1.5vw, 2.25rem)`, line-height 1.05): project card titles, service and process step titles, the About intro and the stat values. One step below Headline, so a list of cards never outshouts its section title.
- **Body** (Geist 400, 16px, line-height 1.5): paragraphs and form text. Keep lines to about 65–75ch.
- **Lede** (Geist 400, uppercase, 14px/1.625 with 0.14em tracking from 768px; 13px/1.7 with 0.05em tracking on mobile): the hero tagline and other one-line statements under a headline. Maximum width is 34rem.
- **Label** (Geist 400, uppercase, 12px, 0.025em tracking): nav links and the Contact action.
- **Cue** (Geist 400, uppercase, 11px with 0.22em tracking from 768px; 12px with 0.12em on mobile): the scroll cue and other quiet wayfinding.
- **Orbit numeral** (Antonio 700 digits, line-height 0.86, outlined with a 2px Lit Grey stroke over an Unlit Black fill; up to 22rem in `split`, `clamp(4.5rem, 14svh, 7.5rem)` on a portrait phone): the How I work step numbers only. Decorative and `aria-hidden`; the step title carries the meaning. It is the one exception to "Display is the name, and nothing else", and it drops to Title size, solid Dim Grey, in the reading list.

### Named Rules

**The Two-Voice Rule.** Antonio is for uppercase headlines, the statement quote and the name. Geist handles everything else. There is no third voice, and there is no mixed-case Antonio.

**The Tracked Signage Rule.** Uppercase Geist is always tracked out. Uppercase text at default tracking reads as shouting, not signage.

`--font-heading` points at `--font-display`, so the Two-Voice Rule holds for shadcn headings too.

## Layout

The layout is a single vertical scroll of full-width sections on one black ground, navigated by anchors (`#home`, `#services`, `#about`, `#project`, `#process`, `#connect`, `#testimonials`, `#faq`, `#blog`, `#contact`; `#quote` is not in the nav). The main breakpoint is 768px. Pinned scenes choose their layout with the `split` variant (`min-width: 48rem`, or `max-height: 30rem` from 34rem wide), so a landscape phone gets side-by-side columns while 400% zoom stays single-column. The `short` variant tightens step type and the shape band on short screens, so small phones (375×548) keep the pinned layout. The header nav switches at 1024px.

- **Hero stage:**
  - At every width it fills exactly one viewport (`100svh`) and centres its content.
  - The wordmark box is `min(40vw, 45svh)` tall on mobile and `min(clamp(380px, 23.4vw + 200px, 500px), 70svh)` from 768px. The name spans 92% of the width on mobile and 78% from 768px.
  - The pointer box bleeds 25% above and below the wordmark box.
  - The one dot canvas is fixed to the viewport behind every section, so scattered and travelling dots are never clipped along an invisible line. Its backing store is capped at `MAX_CANVAS_PIXELS`.
  - The hero pins for its first 10svh of scroll, so the name and tagline stay together until the dots leave. The tagline and scroll cue fade out as it unpins.
  - The scroll cue is pinned 40px from the bottom of the stage at every width, and hidden when the viewport is under 30rem tall (landscape phones).
- **Header:**
  - Fixed and 72px tall, with 24px side gutters on mobile and 40px on desktop.
  - It has three zones on a `1fr auto 1fr` grid, so the nav stays truly centred: the brand wordmark at left (linking to `#home`), the primary nav (Services, About, Work, Process, Blog) in the centre, and the "Let's talk" action at right.
  - Below 1024px the nav collapses behind a menu button into a full-width stacked panel of every anchor, capped at the viewport height and scrollable.
- **Quote (`#quote`):** directly after the hero, on the same black stage, and not in the nav. It is at least one viewport tall. A square cube slot, `min(80vw, 46svh, 36rem)`, is top-aligned under a `max(5.5rem, 12svh)` top pad, so its position never depends on the quote's length. The centred quote sits 32px below the slot (40px from 768px), at most 20ch wide and balanced. Its 72px scroll margin equals the header, so an anchored `#quote` lands where the cube pins.
- **Projects (`#project`), a placeholder until the Phase 5 deck:**
  - A pinned left frame holds the header and a stippled sphere slot.
  - The card list on the right scrolls past it (48rem at most, 60px between cards).
  - Below 768px the black card list rises over the pinned frame like a curtain.
- **Sections:** every section shares the Projects width (80rem at most) and the 24px / 40px gutters. Every anchor except `#home` has a 72px scroll margin, equal to the header, so an anchor jump lands exactly where its scene pins.
  - **Step scenes (My services, How I work):** a pinned frame holds the heading and the shape slot, one pitch of scroll per shape. Each scene has its own layout: My services is centred ("Thread" under Components) and How I work is an orbit ("Orbit" under Components).
    - **Staged (the default where it can run):** the copy never scrolls. It sits on one pinned board and changes only while the dots are in flight: How I work turns one step along its orbit.
    - **Staged needs** scroll-driven animations, motion allowed, a viewport taller than 30rem, a running dot field and a scene that fits. Anywhere else the steps dock as opaque black curtains below the heading and the slot, so the copy never crosses either.
    - When the copy cannot fit its box (WCAG text spacing, 400% zoom, an extreme size), the scene drops to a plain reading list over dust; the copy is never clipped or covered.
  - **Who am I (`#about`):** pinned. The slot sits left and the copy and stats right in `split`; on a portrait phone the slot stacks above the copy.
  - **Dust (Let's connect, Testimonials, FAQ, Blog, Get in touch):** normal flow under one dust scene, with more space above each heading than below it. Get in touch is at least one frame tall, so `#contact` lands on dust.
  - **Footer:** pinned. The name re-forms in its slot above a Cue-type bar (©, the footer nav, the email and Back to top) that is one row from 1024px and stacked and centred below.

**The Stage Rule.** The hero owns the first viewport. Nothing else competes above the fold, not even a secondary call to action.

## Elevation & Depth

The system is flat. Nothing casts a shadow. Depth comes only from light, meaning how bright a thing is against black. It also comes from one translucent layer: after 120px of scroll, the header turns into black at 80% opacity with a backdrop blur and a hairline bottom rule, so the page reads as passing beneath it.

**The Lit-Not-Lifted Rule.** Nothing on the public site gets a `box-shadow` or a raised surface. When something needs to come forward, it gets brighter.

## Shapes

Every corner is square. Buttons, inputs, cards, image frames and focus rings are all square. The curves in the system are the dot and the How I work orbit track. Each wordmark point is a circle (roundness 1), 4px across on a 3px pitch, so neighbours overlap and the letterforms read as nearly solid shapes made of light until the pointer pulls them apart.

**The Square Signal Rule.** Zero radius everywhere. The only round things on the site are dots and the How I work orbit track.

**How to apply:** the vendored shadcn components (`src/components/ui/`) must not be hand-edited, and they derive every radius from `--radius`. `--radius` is `0rem` in `src/app/globals.css`, which squares all of them at once, including the owner surfaces. It carries a unit because shadcn compares it with pixel lengths in `min()`.

## Components

### Dot-Field Wordmark (signature)

The name as a matrix of lit points. It is a single WebGL2 canvas that samples Antonio 700 glyph coverage onto a 3px grid, rendered in Lamp White on Unlit Black.

- **Intro:**
  1. The name appears as a ghost at 14% brightness.
  2. After 0.25s, a soft-edged reveal (26px feather) sweeps it on from left to right over 0.9s.
  3. After 1.05s, it grows from 75% to full scale over 1.25s.
  4. Both the sweep and the grow use `cubic-bezier(0.65, 0, 0.35, 1)`.
- **Pointer scatter:** every dot is a damped spring tied to its home.
  - The pointer pushes dots inside its radius outward, with a linear falloff.
  - Released dots overshoot home three or four times and settle in about 3s.
  - Holding still leaves a steady crater.
  - At a 294px ink height the radius is 300px and the push 2px per frame. Both scale with the wordmark, so a phone gets a proportionally smaller radius.
  - It works with a mouse hover or a finger drag. Vertical swipes still scroll the page, and the dots bounce home when they do.
  - It is inactive during the intro and under reduced motion.
- **Fallbacks:** no WebGL2 falls back to the text wordmark, with the same sweep and grow done in CSS. Reduced motion draws the settled dots once, with no loop. There is no viewport gate: phones run the dots. The `<h1>` is always present and readable. Only decorative leaves are `aria-hidden`: the canvas, the empty slots and the orbit's ring, numerals and plate dots.
- **Scroll morph.** Borrowed from jeffmilanes.com Scene 03. As the visitor scrolls, the name's own dots leave the wordmark and re-form as a cube drawn in stippled outlines, in the slot above the quote.
  - **Window:** the morph starts once 10% of the hero has scrolled away and completes when the quote section reaches the top of the viewport. Progress follows the scroll with a short ease, so flings read as a float, not a jitter.
  - **Flight:** the name dissolves left to right, echoing the intro sweep and the quote wipe. Each dot's departure is staggered, it travels on a gentle arc, and it eases in and out.
  - **Cube:** up to 7,200 dots land on the 12 edges in a jittered band about as thick as a chalk stroke, drawn with 3px dots. Leftover dots fade out mid-flight. The cube is tilted toward the viewer and seen in perspective.
  - **Pointer:** the cube scatters and springs back exactly like the name, with the same spring and bounce. Its push radius is scaled to the cube's on-screen size, as the name's is to its ink height. Scattered dots ride the rotation home.
  - **Depth as light:** far edges are dimmer (down to 35%), never smaller or coloured. Dimness is expressed as opacity, so a far edge can never darken a near one where they cross.
  - **Constant spin with a lean:** the cube never stops turning, one revolution about every 21s. Its spin axis leans about 11° to the right and slowly circles a further 4° like a spinning top, once every 7s, so it never turns on a rigid, mechanical axis. Scrolling back reverses the morph, and dots in flight ignore the pointer.
  - **Known gap:** endless motion with no pause control does not meet WCAG 2.2.2 (Pause, Stop, Hide) while a spinning shape is on screen. The owner chose constant rotation. Reduced motion still gets a still shape. A pause toggle is the fix if AA compliance is needed; it is planned as an owner decision in Phase 6.
- **Scene timeline.** The burst into Projects is retired. Every section is now a scene on one scroll timeline (see `plans/handoff.md`).
  - A formed shape sits in a pinned slot while its section is stuck under the header.
  - Between scenes, the dots fly from one slot to the next with the same staggered sweep and arc as the name-to-cube morph.
  - Today the page runs name, then cube, then the three service shapes, then a placeholder sphere in Who am I and Projects (until Phases 4 and 5), then the five process shapes, then quiet dust behind the reading sections, then the name again in the footer.
  - **Reduced motion:** no flight, spin or wobble. Each shape is drawn still, in its resting pose, only while its section is pinned. Between scenes the canvas is empty.
  - **No WebGL2:** slots collapse and the scenes stop pinning. The text `<h1>` and the quote carry all meaning either way.
  - **Frames grow:** the Quote, About and footer frames use a minimum height, so zoom or text spacing lengthens the pin instead of clipping the copy. Step boxes can't grow; they fit or the scene flows.
  - **Dot count:** every shape uses the same dots, at least 7,200, or the wordmark's count if it is larger.

### Statement Quote

The one quote on the page, owner-editable in the dashboard (text plus an optional author), seeded as a visible placeholder until the owner writes their own. It is the Headline voice: Antonio 700 uppercase in Lamp White, centred, at most 20ch wide and balanced across lines. The author sits 24px below in Cue type at Dim Grey after an em dash, and is hidden when empty. Its markup is `figure > blockquote > p` plus a `figcaption`.

- **Reveal:** once the quote is 20% into the viewport (about when the cube locks in), a clip wipe opens it left to right while the text slides 24px into place, over 0.9s on `cubic-bezier(0.65, 0, 0.35, 1)`. The author lifts in 0.6s later. It plays once.
- **Reduced motion:** it appears instantly. The hidden state never uses opacity, so the text stays readable to assistive tech throughout.

### Thread (My services), prototype

The three services drawn by one dotted line, with the scroll as the pen. A prototype awaiting the owner's feel (2026-09-28).

- **Layout:** centred like the quote. A Lede-type "My services" label on top, the shape big and centred in 3D, and one caption area underneath: the service name in the Headline voice, the owner's paragraph, and the six items as one quiet Label-type line. The label replacing the Headline for this one section is a system change for the owner to confirm.
- **Depth:** each service shape has depth layers (the seal's star floats in front of its rings; the browser's bar in front of its frame; the slash in front of the brackets), seen in perspective with a slow sway, so it turns like the cube instead of reading as a flat icon.
- **The thread:** between two services the dots leave the old drawing in pen order and arrive at the new one in pen order, each on a short hop. So the old line unwinds from its start while the new one draws from its start, joined by a thin, bowed stream of dots.
- **Triggered, not scrubbed:** the scroll triggers each drawing and it then plays by itself (1.6s, sine-eased pen), so a stopped scroll never leaves a half-drawn shape. Scrolling 12% into a transit commits to the next service; scrolling 12% back commits to the previous one, which un-draws.
- **One gesture, one service:** as a drawing triggers, the page glides to that service's resting position over the same 1.6s and on the same ease, and scroll input is held until it lands and the current wheel or trackpad gesture has gone quiet, so a fling can't skip a service. Arriving from the quote or from Who am I glides onto the first or last service the same way (0.9s). A key press or a nav click releases the hold at once. Reduced motion never holds the scroll.
- **Captions:** they follow the same trigger. The old caption wipes out at once (0.35s); the new one wipes in like the quote as the drawing finishes (after 0.88s, 0.9s per line, name, then paragraph, then items, 0.12s apart).
- **Entry and exit** keep the classic burst flight (from the quote's cube, and on to Who am I).

### Orbit (How I work)

The five steps ride the top of a huge dashed orbit, after buckssauce.com (owner, 2026-09-29).

- **Anatomy:** a Wire Grey track (foreground/40) of fine 1px dashes and ~10px radial ticks, of which only the top arc shows. Each step sits on the rim, tangent to it: the owner's number as an Orbit numeral centred on the track, the step title on a square Lamp White plate in black Title type between two small round dots, and the paragraph below in Lit Grey body, centred, at most 30ch. In `split` the heading sits top left and the dot shape upper right of the numeral, where the reference keeps its mascot, never under anything on the rim. On a portrait phone the shape is a band under the header, with the heading below it and the orbit below that.
- **Turn:** the orbit holds still while a shape is formed. During each dot transit it turns one step on the signal ease, so the next step rises from the right edge to the top as its shape draws. The track's ticks stream right the whole time, with the scroll, at 0.8× the orbit's own turn and against it.
- **Assembly:** a step assembles as it comes into view: its digits rise from a squashed, tilted, transparent state, and its plate and paragraph wipe in left to right. Scrubbed, so scrolling back takes it apart.
- **Edges:** on wide screens about 100px of the next numeral peeks at the right edge, as in the reference. On a portrait phone the neighbours sit fully off screen.
- **Plate exception (owner, 2026-09-29):** the plate is a non-interactive Lamp White fill, the one filled white surface that is not an action. Its dots and the square corners keep it signage, not a button.
- **Fallback:** without scroll-driven animations or with reduced motion, there is no track, and each step docks as an opaque black curtain below the heading and the slot. Where a step can't fit (400% zoom, text spacing, short landscape phones), the section becomes a reading list over dust.

**The Moving-Line Rule.** A line that travels is never Lamp White. It is Lit Grey or Wire Grey, like the orbit's track and the numerals' outline. Lamp White is for settled, lit states: a landed title, the plate, and the arrival strike, which flashes in place.

### Projects

The proof section, modelled on a studio "works" list and translated into the system. Owner-editable in the dashboard (heading, intro and up to six projects). The seed is three visible placeholders; nothing is invented.

- **Left column (pinned):** the Headline, an owner-editable Lede in Lit Grey, a Cue-type count in Dim Grey beneath it (`/ 03`, the live number of visible projects; never above the heading), and a square outlined "Let's talk" action to `#contact` (Wire Grey hairline, Lamp White text, the border lights to Lamp White on hover and focus, no fill, so the header action stays the brightest surface).
- **Card:** a 10:7 plate (the image, `object-cover`, zooming 4% on hover under `motion-safe`; or a black plate labelled "Screenshot to come" in Cue type), then a row with the Title at Lit Grey (Lamp White on hover or focus) and a square tag (Wire Grey hairline, Dim Grey Label type), then an optional summary in Lit Grey body and an optional stack line in Cue type. With an https link the whole card is one link that opens a new tab.
- **Never hidden:** cards are never opacity-hidden, so they read without JavaScript; the dots are their reveal.

### Navigation

Uppercase 14px Geist links, tracked out, at Lit Grey over the hero, lighting to Lamp White on hover and for the current section (`aria-current`). They sit in the centre zone in a 16px-gapped row with 12px × 8px hit padding. Once the header turns solid, the links step down to muted text and hover to full foreground. The header drops in 24px on load (0.6s) and its groups stagger in 0.06s apart. Below 1024px, a ghost icon button toggles a stacked panel of all ten anchors, and Escape closes it.

**Brand (placeholder):** the name in Antonio 700 uppercase at 28px, Lamp White, with a small Ghost Grey © at its top right. It stands in until the owner's own logo (planned as a cursive mark) replaces it.

### Contact Action

The one call to action in the header: a square Lamp White button with Unlit Black 14px uppercase text reading "Let's talk" and a 16px up-right arrow, 20px × 8px padding. On hover the fill dims to 80%. It is the brightest interactive surface on the page, it links to `#contact`, and it is hidden below 1024px, where the menu panel carries Contact.

### Buttons

- **Primary** (form submit): square, Lamp White fill, Unlit Black text, 32px tall, 10px side padding, 14px Geist 500. Hover dims the fill to 80%. Active nudges it down 1px.
- **Ghost** (icon toggles): transparent at rest, with a faint fill on hover.
- **Focus:** a 3px ring at half strength of the ring colour. Never remove it.

### Inputs / Fields

- **Style:** square, 32px tall, transparent on black, Wire Grey hairline, Lamp White text, placeholder in Dim Grey.
- **Focus:** the border brightens and a 3px half-strength ring appears.
- **Select:** the native `<select>` ("Service needed") matches the input, with `appearance-none` and a Dim Grey chevron. Its empty prompt shows in Dim Grey, and its option list renders dark through `scheme-dark`.
- **Error:** monochrome. `aria-invalid` switches the border and ring to half-strength Lamp White. The message sits below the field after a warning glyph, with `role="alert"`, and its wording carries the meaning.
- **Labels:** Geist 500 at 14px, sitting above the field.

### Scroll Cue

Cue type in Dim Grey with a 14px down-right arrow. It lifts in (16px, 0.6s) 0.3s after the intro settles, and invites the scroll that drives the morph.

## Do's and Don'ts

### Do:

- **Do** keep every public section on Unlit Black (#000000) and express hierarchy through brightness steps: Lamp White, Lit Grey, Dim Grey.
- **Do** set section titles and the statement quote in Antonio 700 uppercase and everything else in Geist.
- **Do** track out uppercase Geist (0.025em for labels, 0.14em for ledes, 0.22em for cues).
- **Do** keep a real, readable `<h1>` behind the dot field, and mark only decorative leaves `aria-hidden`.
- **Do** route every motion through the reduced-motion preference. The dot field checks it separately, because it is not a `motion` component.
- **Do** square corners through the `--radius` token rather than by editing vendored components.

### Don't:

- **Don't** introduce an accent hue, gradient or tinted surface. The palette is white at different intensities on black.
- **Don't** use a border radius anywhere. The only round things are dots and the How I work orbit track.
- **Don't** use shadows or raised cards. Brightness, not elevation, brings things forward.
- **Don't** put readable text in Ghost Grey (#737373). It fails AA at body sizes.
- **Don't** let the public page follow the OS light or dark scheme.
- **Don't** lift copy, layouts or components verbatim from the reference sites. The seeded tagline that matches adriavale.framer.website is a placeholder to replace with the owner's own words. The How I work orbit follows buckssauce.com at the owner's explicit request, translated into this system.
