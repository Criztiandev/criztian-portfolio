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

The world is **black throughout** and **strictly monochrome**. Hierarchy is set by how brightly something is lit (full white, three-quarter, dimmed, ghost), never by hue. Every corner is square, because signage and hardware are square. The only round thing on the site is a dot. Motion is deliberate and cinematic. The name sweeps on dim, grows into place, and only then does the supporting copy lift in. The signature goes further: as you scroll, the dots leave the wordmark and re-form into a slowly turning cube drawn in stippled points, above a statement quote.

This file describes the public site. The owner surfaces (`/login`, `/dashboard`, the editor) are tools that use the stock shadcn neutral system with light and dark modes. Only the Square Signal Rule reaches them, because it is set at the token level.

**Key Characteristics:**

- Black ground from hero to footer. The public page ignores the OS colour scheme.
- One display voice (Antonio, uppercase) and one working voice (Geist).
- Brightness is the only emphasis tool. No accent hue.
- Zero radius. Dots are the only curves.
- The dot field is decorative. A real `<h1>` always carries the name.

**References (inspiration, not specs to clone):**

- **[jeffmilanes.com](https://www.jeffmilanes.com/)**. Borrow **Scene 03**: outlines of a phone and a browser drawn in scattered dots, forming shapes as the story advances. Here, that becomes the scroll-morph transition described under Components. Nothing else from this site is adopted: no scene counter, film strip, monospace labels or photography treatment.
- **[adriavale.framer.website](https://adriavale.framer.website/)**. The Framer template the hero descends from: the dot-matrix name on black, the six-item nav, and the square outlined Contact action. The dot field is an original WebGL implementation of the same technique, not the template's component. The seeded hero tagline and the nav labels currently match this template word for word. They are placeholders, not the owner's copy.

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

- The seeded owner-theme defaults in `src/data/site-content.data.ts` are still light (page `#ffffff`, body text `#252525`), so every section below the quote renders white, and the header turns into a pale grey bar once it goes solid over the black stage.
- In an OS dark scheme the page mixes both worlds. `next-themes` darkens the body, while the owner theme forces `--background` to white inside the page wrapper, so the scrolled header renders as a pale grey bar over a dark page.
- The five owner-editable tokens should seed as follows:
  - page background → Unlit Black
  - body text → Lamp White
  - muted text → Dim Grey
  - accent → Lamp White
  - border → Wire Grey

  The public wrapper should also stop inheriting the `.dark` / `:root` switch.

- Form errors currently use shadcn's destructive red. Under the monochrome rule an error must carry its meaning through wording and `role="alert"`, not hue. Whether red survives as a functional exception is an open decision.

## Typography

**Display Font:** Antonio (with a metric-matched Arial fallback), loaded through `next/font` with `display: block`.
**Body Font:** Geist (with Geist Fallback).
**Mono:** Geist Mono is loaded as `--font-mono` but has no role on the public site.

**Character:** a tall, condensed poster face beside a clean, neutral grotesque. Antonio shouts in uppercase and Geist keeps its voice low.

### Hierarchy

- **Display** (Antonio 700, uppercase, `min(25vw, 40svh)` on mobile and `clamp(3rem, 18vw, 16rem)` from 768px, line-height 1, tracking 0.05em in the dot sampler): the name, and nothing else. It is the source shape the dot field samples.
- **Headline** (Antonio 700, uppercase, `clamp(1.75rem, 1rem + 3vw, 3.5rem)`, line-height 1.05): section titles such as Project, About, Services, Blog and Contact, and the **statement quote** under the cube. The rem term keeps it growing under page zoom (WCAG 1.4.4). Keep it clearly below Display and clearly above everything in Geist.
- **Body** (Geist 400, 16px, line-height 1.5): paragraphs and form text. Keep lines to about 65–75ch.
- **Lede** (Geist 400, uppercase, 14px/1.625 with 0.14em tracking from 768px; 13px/1.7 with 0.05em tracking on mobile): the hero tagline and other one-line statements under a headline. Maximum width is 34rem.
- **Label** (Geist 400, uppercase, 12px, 0.025em tracking): nav links and the Contact action.
- **Cue** (Geist 400, uppercase, 11px with 0.22em tracking from 768px; 12px with 0.12em on mobile): the scroll cue and other quiet wayfinding.

### Named Rules

**The Two-Voice Rule.** Antonio is for uppercase headlines, the statement quote and the name. Geist handles everything else. There is no third voice, and there is no mixed-case Antonio.

**The Tracked Signage Rule.** Uppercase Geist is always tracked out. Uppercase text at default tracking reads as shouting, not signage.

**Known drift:** section headings are still Geist 600 at 24px, and `--font-heading` still points at the sans. Point `--font-heading` at `--font-display` to apply the Two-Voice Rule in one place.

## Layout

The layout is a single vertical scroll of full-width sections on one black ground, navigated by anchors (`#home`, `#project`, `#about`, `#services`, `#blog`, `#contact`). There is one breakpoint, at 768px.

- **Hero stage:**
  - At every width it fills exactly one viewport (`100svh`) and centres its content.
  - The wordmark box is `min(40vw, 45svh)` tall on mobile and `min(clamp(380px, 23.4vw + 200px, 500px), 70svh)` from 768px. The name spans 92% of the width on mobile and 78% from 768px.
  - The pointer box bleeds 25% above and below the wordmark box. The one dot canvas spans the whole stage (hero and quote) from its top to the cube slot's bottom, so scattered and travelling dots are never clipped along an invisible line. Its backing store is capped at `MAX_CANVAS_PIXELS`.
  - The scroll cue is pinned 40px from the bottom of the stage at every width, and hidden when the viewport is under 30rem tall (landscape phones).
- **Header:**
  - Fixed and 72px tall, with 24px side gutters on mobile and 40px on desktop.
  - It has three zones on a `1fr auto 1fr` grid, so the nav stays truly centred: the brand wordmark at left (linking to `#home`), the primary nav (Project, Blog, About, Contact) in the centre, and the "Let's talk" action at right.
  - Below 768px the nav collapses behind a menu button into a full-width stacked panel.
- **Quote (`#quote`):** directly after the hero, on the same black stage, and not in the nav. It is at least one viewport tall. A square cube slot, `min(80vw, 46svh, 36rem)`, is top-aligned under a `max(5.5rem, 12svh)` top pad, so its position never depends on the quote's length. The centred quote sits 32px below the slot (40px from 768px), at most 20ch wide and balanced. It has no scroll margin, so an anchored `#quote` lands exactly on the formed cube.
- **Sections:** currently placeholder layout. Each is a centred column (max 896px, 16px gutters, 80px vertical padding) with an 80px scroll margin so anchored headings clear the header. Treat the scroll margin as fixed and the column as provisional.

**The Stage Rule.** The hero owns the first viewport. Nothing else competes above the fold, not even a secondary call to action.

## Elevation & Depth

The system is flat. Nothing casts a shadow. Depth comes only from light, meaning how bright a thing is against black. It also comes from one translucent layer: after 120px of scroll, the header turns into black at 80% opacity with a backdrop blur and a hairline bottom rule, so the page reads as passing beneath it.

**The Lit-Not-Lifted Rule.** Nothing on the public site gets a `box-shadow` or a raised surface. When something needs to come forward, it gets brighter.

## Shapes

Every corner is square. Buttons, inputs, cards, image frames and focus rings are all square. The one curve in the system is the dot: each wordmark point is a circle (roundness 1), 4px across on a 3px pitch, so neighbours overlap and the letterforms read as nearly solid shapes made of light until the pointer pulls them apart.

**The Square Signal Rule.** Zero radius everywhere. The only round thing on the site is a dot.

**How to apply:** the vendored shadcn components (`src/components/ui/`) must not be hand-edited, and they derive every radius from `--radius`. Setting `--radius: 0` in `src/app/globals.css` squares all of them at once, including the owner surfaces. Today it is `0.625rem`, so inputs and buttons render with soft 10px corners. That is known drift.

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
- **Fallbacks:** no WebGL2 falls back to the text wordmark, with the same sweep and grow done in CSS. Reduced motion draws the settled dots once, with no loop. There is no viewport gate: phones run the dots. The `<h1>` is always present and readable. Only the canvas is `aria-hidden`.
- **Scroll morph.** Borrowed from jeffmilanes.com Scene 03. As the visitor scrolls, the name's own dots leave the wordmark and re-form as a cube drawn in stippled outlines, in the slot above the quote.
  - **Window:** the morph starts once 10% of the hero has scrolled away and completes when the quote section reaches the top of the viewport. Progress follows the scroll with a short ease, so flings read as a float, not a jitter.
  - **Flight:** the name dissolves left to right, echoing the intro sweep and the quote wipe. Each dot's departure is staggered, it travels on a gentle arc, and it eases in and out.
  - **Cube:** up to 7,200 dots land on the 12 edges in a jittered band about as thick as a chalk stroke, drawn with 3px dots. Leftover dots fade out mid-flight. The cube is tilted toward the viewer and seen in perspective.
  - **Pointer:** the cube scatters and springs back exactly like the name, with the same spring and bounce. Its push radius is scaled to the cube's on-screen size, as the name's is to its ink height. Scattered dots ride the rotation home.
  - **Depth as light:** far edges are dimmer (down to 35%), never smaller or coloured. Dimness is expressed as opacity, so a far edge can never darken a near one where they cross.
  - **Constant spin with a lean:** the cube never stops turning, one revolution about every 21s. Its spin axis leans about 11° to the right and slowly circles a further 4° like a spinning top, once every 7s, so it never turns on a rigid, mechanical axis. Scrolling back reverses the morph, and dots in flight ignore the pointer.
  - **Known gap:** endless motion with no pause control does not meet WCAG 2.2.2 (Pause, Stop, Hide). The owner chose constant rotation over the earlier spin-then-rest. Reduced motion still gets a still cube. A pause toggle is the fix if AA compliance is needed.
  - **Reduced motion:** no flight, spin or wobble. The name and the cube, leaning at its resting angle, are drawn still, each in its own place.
  - **No WebGL2:** the slot collapses and the quote moves up. The text `<h1>` and the quote carry all meaning either way.
  - It reuses the wordmark's points, so it adds none to the budget.

### Statement Quote

The one quote on the page, owner-editable in the dashboard (text plus an optional author), seeded as a visible placeholder until the owner writes their own. It is the Headline voice: Antonio 700 uppercase in Lamp White, centred, at most 20ch wide and balanced across lines. The author sits 24px below in Cue type at Dim Grey after an em dash, and is hidden when empty. Its markup is `figure > blockquote > p` plus a `figcaption`.

- **Reveal:** once the quote is 20% into the viewport (about when the cube locks in), a clip wipe opens it left to right while the text slides 24px into place, over 0.9s on `cubic-bezier(0.65, 0, 0.35, 1)`. The author lifts in 0.6s later. It plays once.
- **Reduced motion:** it appears instantly. The hidden state never uses opacity, so the text stays readable to assistive tech throughout.

### Navigation

Uppercase 14px Geist links, tracked out, at Lit Grey over the hero, lighting to Lamp White on hover and for the current section (`aria-current`). They sit in the centre zone in a 16px-gapped row with 12px × 8px hit padding. Once the header turns solid, the links step down to muted text and hover to full foreground. The header drops in 24px on load (0.6s) and its groups stagger in 0.06s apart. On mobile, a ghost icon button toggles a stacked panel of all six links, and Escape closes it.

**Brand (placeholder):** the name in Antonio 700 uppercase at 28px, Lamp White, with a small Ghost Grey © at its top right. It stands in until the owner's own logo (planned as a cursive mark) replaces it.

### Contact Action

The one call to action in the header: a square Lamp White button with Unlit Black 14px uppercase text reading "Let's talk" and a 16px up-right arrow, 20px × 8px padding. On hover the fill dims to 80%. It is the brightest interactive surface on the page, it links to `#contact`, and it is hidden below 768px, where the menu panel carries Contact.

### Buttons

- **Primary** (form submit): square, Lamp White fill, Unlit Black text, 32px tall, 10px side padding, 14px Geist 500. Hover dims the fill to 80%. Active nudges it down 1px.
- **Ghost** (icon toggles): transparent at rest, with a faint fill on hover.
- **Focus:** a 3px ring at half strength of the ring colour. Never remove it.

### Inputs / Fields

- **Style:** square, 32px tall, transparent on black, Wire Grey hairline, Lamp White text, placeholder in Dim Grey.
- **Focus:** the border brightens and a 3px half-strength ring appears.
- **Error:** `aria-invalid` switches the border and ring to the error treatment. The message sits below the field with `role="alert"`.
- **Labels:** Geist 500 at 14px, sitting above the field.

### Scroll Cue

Cue type in Dim Grey with a 14px down-right arrow. It lifts in (16px, 0.6s) 0.3s after the intro settles, and invites the scroll that drives the morph.

## Do's and Don'ts

### Do:

- **Do** keep every public section on Unlit Black (#000000) and express hierarchy through brightness steps: Lamp White, Lit Grey, Dim Grey.
- **Do** set section titles and the statement quote in Antonio 700 uppercase and everything else in Geist.
- **Do** track out uppercase Geist (0.025em for labels, 0.14em for ledes, 0.22em for cues).
- **Do** keep a real, readable `<h1>` behind the dot field, and mark only the canvas `aria-hidden`.
- **Do** route every motion through the reduced-motion preference. The dot field checks it separately, because it is not a `motion` component.
- **Do** square corners through the `--radius` token rather than by editing vendored components.

### Don't:

- **Don't** introduce an accent hue, gradient or tinted surface. The palette is white at different intensities on black.
- **Don't** use a border radius anywhere. The only round thing is a dot.
- **Don't** use shadows or raised cards. Brightness, not elevation, brings things forward.
- **Don't** put readable text in Ghost Grey (#737373). It fails AA at body sizes.
- **Don't** let the public page follow the OS light or dark scheme.
- **Don't** lift copy, layouts or components verbatim from the reference sites. The seeded tagline and nav labels that match adriavale.framer.website are placeholders to replace with the owner's own words.
