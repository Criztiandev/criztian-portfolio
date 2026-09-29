---
name: Criztian
description: A black signal board where the name's dots build one product, then come home.
colors:
  unlit-black: "#000000"
  lamp-white: "#ffffff"
  lit-grey: "#bfbfbf"
  dim-grey: "#999999"
  ghost-grey: "#737373"
  wire-grey: "#666666"
  rule-grey: "#1f1f1f"
typography:
  display:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "clamp(3rem, 18vw, 16rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
  statement:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "11rem"
    fontWeight: 700
    lineHeight: 0.95
  numeral:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "21.25rem"
    fontWeight: 700
    lineHeight: 0.86
  title:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "clamp(2.75rem, 2.47rem + 1.14vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.95
  body:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "1.125rem"
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
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.429
    letterSpacing: "0.025em"
  item:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.231
    letterSpacing: "0.08em"
  section-label:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.333
    letterSpacing: "0.22em"
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
  column-gap: "40px"
  label-top-mobile: "28px"
  label-top-desktop: "56px"
  plate-frame-mobile: "12px"
  plate-frame-desktop: "18px"
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
    padding: "10px 20px"
  button-contact-hover:
    backgroundColor: "#cccccc"
    textColor: "{colors.unlit-black}"
  button-primary:
    backgroundColor: "{colors.lamp-white}"
    textColor: "{colors.unlit-black}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 10px"
  section-label:
    textColor: "{colors.dim-grey}"
    typography: "{typography.section-label}"
  statement:
    textColor: "{colors.lamp-white}"
    typography: "{typography.statement}"
  quote-attribution:
    textColor: "{colors.dim-grey}"
    typography: "{typography.cue}"
  list-item:
    textColor: "{colors.lit-grey}"
    typography: "{typography.item}"
    padding: "12px 0"
  plate:
    backgroundColor: "{colors.unlit-black}"
    rounded: "{rounded.none}"
  plate-chip:
    backgroundColor: "{colors.unlit-black}"
    textColor: "{colors.dim-grey}"
    typography: "{typography.cue}"
    padding: "4px 8px"
  input:
    backgroundColor: "{colors.unlit-black}"
    textColor: "{colors.lamp-white}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 12px"
---

# Design System: Criztian

> **Status:** this is the locked design, mockup B ("Statement"), with `B-desktop-1` as the reference (owner, 2026-09-29). Phase 5 built the page order, the copy and the B surface: the statement split for the quote, Work, About, Testimonials, FAQ and Contact, the section label, Body, Title, Cue, Rule Grey, the form and the footer. Phase 6 drew every dot object in one material: the frames round the Work, About and client plates, the gather round the form, and the one product that Services and How I work build. Until Phases 7–10 land, the code still shows parts of the Phase 3 system: My services and How I work keep their Headline role, their 80rem cap and their layout (the white orbit plates, the corner shape, the glide lock). The renders are in `plans/mockups/`. Exact markup is in the artboards on the mockup canvas (linked from the handoff). When unsure how something should look, match B1.

## Overview

**Creative North Star: "The Lit Signal Board"**

The site is a dark room with a display board. The name **Criztian** is not typeset. It is built from thousands of points of light that sit on black, scatter from a cursor or a finger, and spring back with a bounce.

**The one idea: the dots build one product.** As the visitor scrolls, the name's dots become the idea (a turning cube) and frame the finished work. Then they build one product stage by stage: the mark, the mark in a page layout, and the layout opening into code; then the same page listened for, planned, wireframed, built and launched. They frame the real people behind the work, gather round the contact form, and come home to the name in the footer. A client should leave remembering one sentence: "I build whole products."

**The page rule.** Every screen shows one dot object and one big, bold statement. Everything else is quiet signage. FAQ is the one screen without a dot object, so the dots are out of the way while people read.

The world is **black throughout** and **strictly monochrome**. Hierarchy is set by how brightly something is lit (full white, three-quarter, dimmed, ghost), never by hue. Every corner is square, because signage and hardware are square. The feeling is calm, precise and premium.

This file describes the public site. The owner surfaces (`/login`, `/dashboard`, the editor) are tools that use the stock shadcn neutral system with light and dark modes. Only the Square Signal Rule reaches them, because it is set at the token level.

**Key Characteristics:**

- Black ground from hero to footer, with no texture. The public page ignores the OS colour scheme.
- One dot object (none on FAQ) and one statement per screen.
- One display voice (Antonio, uppercase) and one working voice (Geist).
- Brightness is the only emphasis tool. No accent hue.
- Zero radius. Dots are the only curves; the How I work ring is drawn in dots.
- The dots are decorative. A real `<h1>` always carries the name, and real text carries every statement.

**References (history).** Earlier phases took one reference site per section: the hero from [adriavale.framer.website](https://adriavale.framer.website/), the dot shapes from [jeffmilanes.com](https://www.jeffmilanes.com/) (Scene 03) and the How I work orbit from [buckssauce.com](https://buckssauce.com/). The Phase 4 audit found that nobody had checked how the sections added up (`plans/handoff.md`, "Direction"). These sites are history now. Design a section against the one idea and B1, never against a reference site. What they left behind:

- **adriavale:** the dot-matrix name on black. The dot field is an original WebGL implementation of the same technique, not the template's component. The seeded tagline that matched the template word for word gave way to the owner's approved line in Phase 5 (the seed default, and the owner's draft until they publish it).
- **jeffmilanes:** outlines drawn in scattered dots that form as the story advances.
- **buckssauce:** a huge ring with only its top arc in view, the steps riding it, and the giant outlined numeral. Its label plate, the plate's dots and the corner mascot are gone.

## Colors

The palette is a set of brightness levels on black. Every colour is white at some intensity.

### Primary

- **Lamp White** (`lamp-white`): the lit state. It is used for the dots, the text `<h1>` fallback, every statement and title, the active nav link, hover states, and the two filled actions (the header's Contact action and the form's submit button). It is the one element on a screen that should read first.

### Neutral

- **Unlit Black** (`unlit-black`): the ground of every public section. The WebGL canvas clears to it, so the dot field and the page share one black with no seam.
- **Lit Grey** (`lit-grey`, white at ~75%): readable secondary copy, such as body paragraphs, the hero tagline, nav links at rest, the Services items and the active numeral's outline.
- **Dim Grey** (`dim-grey`, white at 60%): tertiary text such as section labels, the scroll cue, plate chips, captions and helper text. At 7.4:1 on black it is still comfortable to read.
- **Ghost Grey** (`ghost-grey`, white at 45%): decorative marks only; B uses none (the brand's © is Dim Grey). It measures 4.4:1 on black, which is below AA for body text.
- **Wire Grey** (`wire-grey`, white at 40%): outlines on interactive elements (form fields), the project tag, the How I work ring's dots and the outgoing numeral.
- **Rule Grey** (`rule-grey`, white at 12%): hairline dividers only. It draws the solid header's bottom rule, the Services item rules, the FAQ rows, the About stats rule and the footer bar's rule. At about 1.3:1 it is too faint to mark a control (WCAG 1.4.11), so it never outlines anything interactive. It is its own token, `--rule` (the foreground at 12%, `border-rule`), set on the public stage; `--border` and `--input` stay Wire Grey for field outlines and the project tag.

### Named Rules

**The Light-Is-Emphasis Rule.** Hierarchy comes from brightness alone: lamp white, then lit, dim and ghost. If something needs more attention, light it brighter. Never give it a colour.

**The Ghost Rule.** Ghost Grey never carries text a visitor has to read. If it must be read, it is Dim Grey or brighter.

**The Always-Night Rule.** The public page is black from top to bottom in every OS colour scheme. The owner can retune the six theme colours in the editor, but the seeded defaults stay dark.

**Known drift:**

- The five owner-editable tokens now seed dark (2026-09-26): page background Unlit Black, body text Lamp White, muted text Dim Grey, accent Lamp White, border Wire Grey. The page wrapper sets all five, so the header and every section read them.
- The public stage carries `dark` and `scheme-dark`, so the shadcn tokens outside those five (`--ring`, `--card`) and native controls resolve dark in every OS scheme (`--input` is set inline to the border token), and `html:has([data-status])` keeps the page scrollbar dark. Only the `body` background still follows the `.dark` / `:root` switch. Overscroll is off, so it shows only where the stage does not cover.
- Form errors are monochrome. The stage sets `--destructive: var(--foreground)` inline, so an error outlines the field in half-strength Lamp White and its message carries the meaning in words, with a warning glyph and `role="alert"`. No red.

## Typography

**Display Font:** Antonio (with a metric-matched Arial fallback), loaded through `next/font` with `display: block`.
**Body Font:** Geist (with Geist Fallback).

**Character:** a tall, condensed poster face beside a clean, neutral grotesque. Antonio shouts in uppercase and Geist keeps its voice low.

### Hierarchy

- **Display** (Antonio 700, uppercase, `min(25vw, 40svh)` on mobile and `clamp(3rem, 18vw, 16rem)` from 768px, line-height 1, tracking 0.05em in the dot sampler): the name, and nothing else. It is the source shape the dot field samples.
- **Statement** (Antonio 700, uppercase, line-height 0.95, Lamp White, left-aligned and balanced): the one big line on each screen. It carries the section's meaning, so it is always real text (a heading, a quote or a line of copy), never dots or an image. Size follows length: a long line steps down so it sits on three or four lines, and a single word that cannot wrap steps down until it fits its column ("Development" fits the 720px column only at about 144px or less, and the 342px phone column at about 68px or less). Only "FAQ" steps up. The mockup sizes are caps at the reference widths, not fixed points:

  | Statement                                                  | Desktop (1440) | Phone (390) |
  | ---------------------------------------------------------- | -------------- | ----------- |
  | Default: a project title, a service name, "I am Criztian." | 176px          | 72px        |
  | The belief line, at most 11ch                              | 136px          | 52px        |
  | A client's words                                           | 120px          | 68px        |
  | "Let's start your project today.", on three lines          | 128px          | 52px        |
  | "FAQ"                                                      | 240px          | 110px       |

  A statement never overflows its column or its frame. From 48rem the left column is about half the viewport, so in the split a statement is sized from its column (container units), not from the viewport, and it keeps a rem term so it grows under page zoom (WCAG 1.4.4). The scale (`STATEMENT_SIZE_CLASSES`, set in Phase 5) is `min(cap, k·cqi + rem, h·svh)` with line-height 0.95:

  | Statement | Phone               | Split                        |
  | --------- | ------------------- | ---------------------------- |
  | Default   | 19cqi + 0.5rem, 72  | 26cqi + 0.5rem, 176, 20svh   |
  | Belief    | 14cqi + 0.5rem, 52  | 18cqi + 0.5rem, 136, 16svh   |
  | Client    | 17cqi + 0.25rem, 68 | 15.5cqi + 0.5rem, 120, 14svh |
  | Contact   | 14cqi + 0.5rem, 52  | 16.5cqi + 0.5rem, 128, 15svh |
  | FAQ       | 30cqi + 0.5rem, 110 | 32cqi + 0.5rem, 240, 28svh   |

  The svh term keeps a statement inside short frames (landscape phones, 1280×720). Each factor was checked so the widest word fits its column at the fit sizes and at 768×1024 and 1024×768 ("CRIZTIAN." is the tightest at 768 wide). A word that still cannot fit, such as an owner's long project title, breaks rather than overflows. Phase 7 checks the service names, "Development" included.

- **Numeral** (Antonio 700 digits, line-height 0.86, outlined with a 2px Lit Grey stroke and no fill, so the ring's dots show through the digits where its top arc crosses them; about 340px on desktop and 150px on a phone): the How I work step numbers only. Phase 8 sizes them from the frame. They are decorative and `aria-hidden`; the step title carries the meaning. They are the one exception to "Display is the name, and nothing else", and they drop to Title size, solid Dim Grey, in the reading list.
- **Title** (Antonio 700, uppercase, line-height 0.95, 56px at 1440 and 44px at 390, `clamp(2.75rem, 2.47rem + 1.14vw, 3.5rem)`): the How I work step titles and the About stat values. It sits one clear step below the statement.
- **Body** (Geist 400, 15px/1.55 on a phone and 18px/1.5 from 768px, Lit Grey, at most 40ch): the paragraph under a statement, the About story and the FAQ answers. Form fields use 16px below 768px (iOS Safari zooms the page into a smaller field on focus) and 15px from 768px.
- **Lede** (Geist 400, uppercase, 14px/1.625 with 0.14em tracking from 768px; 13px/1.7 with 0.05em tracking on mobile): the hero tagline only. Maximum width is 34rem.
- **Label** (Geist 400, uppercase, 14px, 0.025em tracking): nav links and the Contact action. The project tag uses it at 12px. The submit button takes the Label voice in Geist 500 (owner, Phase 5).
- **Item** (Geist 400, uppercase, 13px/16px, 0.08em tracking, Lit Grey, after a Dim Grey number): numbered lists, such as the six items under each service.
- **Section label** (Geist 400, uppercase, 11px on a phone and 12px from 768px, 0.22em tracking, 16px line-height, Dim Grey): the one `<h2>` style. It names the section and, where the section has steps or several items, the position: "My services · 02 / 03". Every section from Projects to Contact opens with it, at the top left of its frame; the hero, the quote and the footer have none.
- **Cue** (Geist 400, uppercase, 11px with 0.22em tracking at every width, Dim Grey): the scroll cue, plate chips, captions (the quote's author, a client's name, a stat's label, a project's stack line), the "Or email me" line and the footer bar.

### Named Rules

**The One-Statement Rule.** Big type is emphasis only: the name, the belief line, one statement per section and the How I work numerals. A screen never has two statements, and a section's name is never big type: it is the section label. The one exception is FAQ, whose statement repeats its label as an `aria-hidden` visual duplicate.

**The Two-Voice Rule.** Antonio is for the name, statements, titles and numerals. Geist handles everything else. There is no third voice, and there is no mixed-case Antonio.

**The Tracked Signage Rule.** Uppercase Geist is always tracked out. Uppercase text at default tracking reads as shouting, not signage.

`--font-heading` points at `--font-display`, so the Two-Voice Rule holds for shadcn headings too.

## Layout

The page is a single vertical scroll of full-screen sections on one black ground, navigated by anchors. The main breakpoint is 768px.

### Order and navigation

1. Hero (`#home`)
2. Belief quote (`#quote`, not in the nav)
3. Projects (`#project`)
4. Services (`#services`)
5. How I work (`#process`)
6. About (`#about`)
7. Testimonials (`#testimonials`)
8. FAQ (`#faq`)
9. Contact (`#contact`), with Let's connect's email line merged in beside the form, so the page ends once
10. Footer

- **Primary nav:** Work (`#project`), Services, Process, About and FAQ, plus the "Let's talk" action to `#contact`. The artboards call two anchors `#work` and `#belief`; the site keeps `#project` and `#quote`.
- **Blog** is hidden from the page and the nav until real posts exist. Its code stays.

### The statement split

Every screen below the hero is the same composition (the quote has no section label):

- **Desktop:** two columns inside the 40px gutters, 40px apart.
  - **Left** (about x 40–760 at 1440): the section label at the top left, 56px below the header. Then, vertically centred in the rest of the frame, the statement, left-aligned, with the body and details under it.
  - **Right** (about x 800–1400): the object, large and vertically centred. It is a dot shape, a dot-framed plate or the form.
  - **The columns flex with the object:** Projects gives its plate 700px (620 + 700), and How I work gives the ring the wide side (800 + 560, with no gap). Its 560×448 shape is top-aligned, 64px below the top of the content, not vertically centred. Every other screen is 720 + 600.
  - **Width:** at 1440 the split fills the whole width inside the gutters (1360px). The content stops growing at 100rem (1600px; `max-w-[105rem]` with the gutters), so beyond about 1680px wide the split is centred. Below that the columns keep their ratios: 6fr : 5fr for most screens (720 : 600 at 1440) and 31fr : 35fr for Work (620 : 700). How I work's 800 + 560 arrives with Phase 8.
  - **Vertical rhythm:** the label sits `min(3.5rem, 6svh)` below the header and the frame keeps `min(4rem, 7svh)` at its foot, so 1280×720 fits without growing; short screens (the `short` variant) tighten both to 16px.
- **Phone:** one column, left-aligned, in 24px gutters. The section label sits 28px below the header. Then, vertically centred, the object comes first: a plate at full width (342px at 390, 10:7, at most 28svh tall), or a dot shape as a centred square at its own size (the cube 288px, Services 280px, How I work 268px). Work is the one screen that is top-aligned on a phone (label, plate, copy), so its pinned slot can sit on the plate. Then come the statement and the details. Where the object is the form (Contact) or there is none (FAQ), the statement comes first. FAQ is not centred: its statement sits 8px under the label, and the list follows 16px below it.
- **How I work** centres its numeral, title and copy on the ring in both layouts.
- **Choosing the layout:** pinned scenes use the `split` variant (`min-width: 48rem`, or `max-height: 30rem` from 34rem wide), so a landscape phone gets the two columns while 400% zoom stays single-column. The `short` variant tightens step type and the shape band on short screens, so small phones (375×548) keep the pinned layout. Never choose by `md:` alone. The header nav switches at 1024px.

**The Split Rule.** The statement is on the left and the object on the right; on a phone the object comes first. The composition axis never changes from one section to the next.

**The Stage Rule.** The hero owns the first viewport. Nothing else competes above the fold, not even a secondary call to action.

### Screens

- **Hero stage** (kept exactly as it is):
  - At every width it fills exactly one viewport (`100svh`) and centres its content.
  - The wordmark box is `min(40vw, 45svh)` tall on mobile and `min(clamp(380px, 23.4vw + 200px, 500px), 70svh)` from 768px. The name spans 92% of the width on mobile and 78% from 768px.
  - The pointer box bleeds 25% above and below the wordmark box.
  - The one dot canvas is fixed to the viewport behind every section, so scattered and travelling dots are never clipped along an invisible line. Its backing store is capped at `MAX_CANVAS_PIXELS`.
  - The hero pins for its first 10svh of scroll, so the name and tagline stay together until the dots leave. The tagline and scroll cue fade out as it unpins.
  - The scroll cue is pinned 40px from the bottom of the stage at every width, and hidden when the viewport is under 30rem tall (landscape phones).
- **Header:**
  - Fixed and 72px tall, with 24px side gutters on mobile and 40px on desktop.
  - It has three zones on a `1fr auto 1fr` grid, so the nav stays truly centred: the brand at left (linking to `#home`), the primary nav in the centre, and the "Let's talk" action at right.
  - Below 1024px the nav collapses behind a menu button into a full-width stacked panel of every anchor, capped at the viewport height and scrollable.
- **Frames:** every section below the hero is at least one frame tall (the viewport minus the 72px header), and the split sits inside it. Every anchor except `#home` has a 72px scroll margin, equal to the header, so an anchor jump lands exactly where its scene pins.
  - **Step scenes** (Services, How I work, and Projects from Phase 9): a pinned frame holds the label and the shape slot, with one pitch of scroll per step.
    - **Staged (the default where it can run):** the copy never scrolls. It sits on one pinned board and changes when a step triggers.
    - **Staged needs** scroll-driven animations, motion allowed, a viewport taller than 30rem, a running dot field and a scene that fits. Anywhere else the Services and How I work steps dock as opaque black curtains below the label and the slot, so the copy never crosses either; Projects becomes a plain list instead (see Projects).
    - When the copy cannot fit its box (WCAG text spacing, 400% zoom, an extreme size), the scene drops to a plain reading list; the copy is never clipped or covered.
  - **Single-frame scenes** (Quote, About, Testimonials and the footer): the frame grows with its content (a minimum height, never a fixed one), so zoom or text spacing lengthens the pin instead of clipping the copy. Contact is the exception: its frame is fixed and flows as a reading section where the form cannot fit (see Contact).
  - **FAQ:** no dot object and no pin. The dots fade to nothing while people read, so the screen is plain black (owner, Phase 6).
- **Footer:** the name re-forms in its slot, above a Cue-type bar with a Rule Grey top rule: ©, the footer nav (the five primary links), the email and Back to top. It is one row from 1024px, and stacked and centred below, where every item is at least 44px tall.

## Elevation & Depth

The system is flat. Nothing casts a shadow. Depth comes only from light, meaning how bright a thing is against black. It also comes from one translucent layer: after 120px of scroll, the header turns into black at 80% opacity with a backdrop blur and a Rule Grey bottom rule, so the page reads as passing beneath it.

**The Lit-Not-Lifted Rule.** Nothing on the public site gets a `box-shadow` or a raised surface. When something needs to come forward, it gets brighter. A plate is framed by dots, never by a border or a shadow.

## Shapes

Every corner is square. Buttons, inputs, plates, tags and focus rings are all square. The only curves in the system are made of dots. Each wordmark point is a circle (roundness 1), 4px across on a 3px pitch, so neighbours overlap and the letterforms read as nearly solid shapes made of light until the pointer pulls them apart.

**The Square Signal Rule.** Zero radius everywhere. The only round things on the site are dots, and rings drawn in dots.

**How to apply:**

- The vendored shadcn components (`src/components/ui/`) must not be hand-edited, and they derive every radius from `--radius`. `--radius` is `0rem` in `src/app/globals.css`, which squares all of them at once, including the owner surfaces. It carries a unit because shadcn compares it with pixel lengths in `min()`.
- A ring is drawn in dots: one circle with round caps and a 3px stroke, dashed `0 <gap>` so it reads as 3px dots every 10px of arc, never as a solid or dashed stroke. With `pathLength` set (the ring uses 3600 today), the gap is in path units: 3600 × 10 ÷ the circumference in px, set per layout.

## Motion

**The One-Motion Rule.** Section content moves in one of two ways, and no section gets its own trick:

- **Text: the light sweep.** A wipe from left to right, about 0.9s on the signal ease (`SIGNAL_EASE`, `cubic-bezier(0.65, 0, 0.35, 1)`). The name's intro sweeps with a soft 26px edge in the shader; the quote and the Services captions use a hard-edged clip-path wipe today. Phase 10 brings one sweep to every section and decides whether text gets the soft edge.
- **Dots: the pen-order draw.** A shape draws in the order a pen would draw it, and un-draws from its start. Between shapes the dots travel on a staggered sweep and a gentle arc.

Interface motion is separate and stays small: the header drop-in, the scroll-cue lift, hover and active states, the menu and FAQ disclosures, the How I work turn and the stats count-up.

Parked ideas (the adaptive cursor, the cursive logo and heading parallax) wait for the owner's yes or no in Phase 10.

**The One-Scroll Rule: trigger, play, no lock.** Inside a scene with steps, a step triggers once the scroll passes 12% into a transit, in either direction, and then plays by itself (1.6s for a drawing), so a stopped scroll never leaves a half-drawn shape. The page never holds the scroll: a fast scroll carries on, and the next trigger takes over. This replaces the Services glide lock (removed in Phase 7); How I work's turn (Phase 8) and the projects deck (Phase 9) follow it. Between scenes, the dots' flight follows the scroll on a short ease, as it does today; Phase 8 decides the crossings between two thread scenes (see Thread).

**Reduced motion:** no sweep, draw, flight, spin or wobble. Text appears in place, and each shape is drawn still, in its resting pose, only while its section is pinned. Between scenes the canvas is empty.

**The Moving-Line Rule.** A drawn line that travels (the ring's dots, the numerals' outlines, a drawing hairline) is never Lamp White. It is Lit Grey or Wire Grey. Lamp White is for settled, lit states: a landed title and the arrival strike, which flashes in place. The dot field is exempt: its dots are Lamp White in flight and at rest, dimmed only by depth.

## Components

### Dot-Field Wordmark (signature)

The name as a matrix of lit points. It is a single WebGL2 canvas that samples Antonio 700 glyph coverage onto a 3px grid, rendered in Lamp White on Unlit Black. The hero stays exactly as it is.

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
- **Fallbacks:** no WebGL2 falls back to the text wordmark, with the same sweep and grow done in CSS. Reduced motion draws the settled dots once, with no loop. There is no viewport gate: phones run the dots. The `<h1>` is always present and readable. Only decorative leaves are `aria-hidden`: the canvas, the empty slots, the ring and the numerals.
- **Scroll morph: the idea.** As the visitor scrolls, the name's own dots leave the wordmark and re-form as a cube drawn in stippled outlines, beside the belief quote.
  - **Window:** the morph starts once 10% of the hero has scrolled away and completes when the quote section reaches the top of the viewport. Progress follows the scroll with a short ease, so flings read as a float, not a jitter.
  - **Flight:** the name dissolves left to right, echoing the intro sweep and the quote wipe. Each dot's departure is staggered, it travels on a gentle arc, and it eases in and out.
  - **Cube:** up to 7,200 dots land on the 12 edges in a jittered band about as thick as a chalk stroke, drawn with 3px dots. Leftover dots fade out mid-flight. The cube is tilted toward the viewer and seen in perspective.
  - **Pointer:** the cube scatters and springs back exactly like the name, with the same spring and bounce. Its push radius is scaled to the cube's on-screen size, as the name's is to its ink height. Scattered dots ride the rotation home.
  - **Depth as light:** far edges are dimmer (down to 35%), never smaller or coloured. Dimness is expressed as opacity, so a far edge can never darken a near one where they cross.
  - **Constant spin with a lean:** the cube never stops turning, one revolution about every 21s. Its spin axis leans about 11° to the right and slowly circles a further 4° like a spinning top, once every 7s, so it never turns on a rigid, mechanical axis. Scrolling back reverses the morph, and dots in flight ignore the pointer.
  - **Known gap:** endless motion with no pause control does not meet WCAG 2.2.2 (Pause, Stop, Hide) while a turning shape is on screen: the cube's spin and the Services shapes' sway. The owner chose constant motion. Reduced motion still gets a still shape. A pause toggle that stops both is the fix; it is an owner decision in Phase 11.

### The Dot Story

Every section is a scene on one scroll timeline (see `plans/handoff.md`). A formed shape sits in a pinned slot while its section is stuck under the header, and between scenes the dots fly from one slot to the next with the same staggered sweep and arc as the name-to-cube morph. In scroll order (the canvas's "The dot story" artboard; the geometry is in the handoff's Phase 6):

1. **The name** (hero).
2. **The idea:** the cube (belief quote).
3. **Finished work:** the dots frame the active project plate (Projects).
4. **Brand, design and code:** one product in three stages, the mark, the mark in a page layout, and the layout opening into code (Services).
5. **Five states of the same page:** a loose ring (listening), a grid (planning), a wireframe (visualising), the built page (building), and the page lifting off on a trail of dots (delivery) (How I work).
6. **Real people:** the dots frame the owner's photo (About), then a client's photo or logo (Testimonials).
7. **Out of the way:** FAQ is plain black while people read.
8. **Gather:** the dots gather round the contact form (Contact).
9. **Home:** the name re-forms in the footer.

**The Draw-and-Frame Rule.** The dots draw ideas and frame real things. Ideas are drawn in dots: the name, the cube, the product being built. Real things are framed by dots: a project image, the owner's photo, a client's photo or logo, the form. A real thing is never made of dots, a dot object is never shrunk into a corner, and no screen has a dotted grid or other background texture.

- **One material:** every shape except the name is the cube's chalk stipple, dots in a jittered band about as wide as the cube's. The particle globe and the starfield are gone. The owner chose, from captures, to let the dust behind FAQ go away (Phase 6): the dust scene still covers FAQ for the timeline, but it draws nothing.
- **Drawings:** Services and How I work draw one page: a 1.8 × 1.2 frame with a header rule, the mark (a small circle and square) at its left, three nav dashes, a hero block, an image block and three columns. The mark alone is a circle in front of a square. The page is drawn with the mark, stepped back behind a code panel, as a grid, as outlines, built (text lines, an image cross, column lines) and launched on a narrowing trail of dots. Listening is a loose dim ring of scattered points. Each is seen in a slight 3/4 view, with the far side dimmer.
- **Plate frames:** a frame is a thin rectangle of dots just outside its plate: 18px out, or 5% of the plate's short side when that is less (12px round a 342×240 phone plate). The plate's rect sets the proportions: 10:7 for a project, 4:5 for the About photo and 1:1 for a client's plate on desktop. A frame is still: it never scatters under the pointer, so the real thing keeps the attention (owner, Phase 6). It still takes the small arrival bounce.
- **Reduced motion:** see Motion.
- **No WebGL2:** slots collapse and the scenes stop pinning. The text `<h1>`, the statements and the plates carry all meaning either way.
- **Dot count:** every shape uses the same dots: 12,000, or the wordmark's count if it is larger. The cube draws its reference 7,200 of them, and the rest wait hidden. A small slot shows only a share of a drawing, so a phone never packs its dots into a blob.

### Belief Quote

The one quote on the page, owner-editable in the dashboard (text plus an optional author), seeded as a visible placeholder until the owner writes their belief line. It is a statement at the belief size (136px, at most 11ch), left-aligned in the left column, with the cube on the right (460×460 at 1440, centred in the column). On a phone the cube comes first (288px, centred), 32px above the statement. It has no section label. The author sits 24px below in Cue type at Dim Grey after an em dash, and is hidden when empty. Its markup is `figure > blockquote > p` plus a `figcaption`.

- **Reveal:** once the quote is 20% into the viewport (about when the cube locks in), the light sweep opens it left to right while the text slides 24px into place, over 0.9s on the signal ease. The author lifts in 0.6s later. It replays on re-entry, once it has fully left the viewport (owner, 2026-09-28).
- **Reduced motion:** it appears instantly. The hidden state never uses opacity, so the text stays readable to assistive tech throughout.

### Projects

The proof section. It is owner-editable in the dashboard (up to six projects). The seed is three visible placeholders; a project without a valid image shows the neutral monochrome placeholder plate. Nothing is invented.

- **Layout:** the section label "Work · 01 / 03" (the active project over the visible count), the project's title as the statement, its summary in Body, then a square tag (Wire Grey hairline, Dim Grey Label type at 12px) and the stack line in Cue type. On the right is the 10:7 plate (700×490 at 1440), framed by dots. On a phone the plate comes first, full width. B has no in-section action: "Let's talk" is always a tap away, in the header from 1024px and in the menu panel below it.
- **The editor's heading and intro:** retired (owner, Phase 5). The label "Work" stands in for the heading, and neither field shows on the page or in the editor; the schema still stores them.
- **Until the deck (Phases 5–8):** one B screen per visible project, one after another. Each screen has its own label ("Work · 02 / 03"; the first is the section `<h2>`, the rest are `aria-hidden` duplicates), its title as the statement and its 10:7 plate. The pinned frame holds only the dot slot at the plate's rect, so the screens slide past it and the dot frame frames each plate as it lands. On a phone each screen is black except a clear ring round its plate, so the frame shows only round the plate that is passing it, wiping off and on between projects, and copy never crosses its dots (owner, Phase 6). The ring is a background-coloured spread used as a mask, not a visible shadow. The label sits 24px above the plate, clear of the ring. In forced colours, where the mask cannot draw, the phone screens stay opaque and hide the frame. With no visible project there is no frame.
- **The deck (Phase 9):** a pinned step scene with one step per visible project, triggered and never locked. The active project swaps inside one plate slot while the dots draw the frame round it in pen order. The title, summary, tag and stack are captions on the same trigger, and the image swaps with the light sweep. Until then the screens stay a list.
- **Plate:** the image, `object-cover`; or, when a project has no valid image, the monochrome placeholder (`/projects/placeholder.webp`) with a chip naming it as one ("Image placeholder", Cue type in Dim Grey on a black tab, 16px in from the top left).
- **Links:** in the list (the fallback, and until Phase 9), a card with an https link is one link that opens a new tab. In the staged deck the plate and the captions are separate elements (DOM contract rule 14), so one link cannot wrap the card. Phase 9 puts the link on the active project's caption, keeps every hidden caption out of the tab order, and gives the link a visible hover and focus state.
- **Never hidden:** cards are never opacity-hidden, so they read without JavaScript, and they stay in DOM order for screen readers. With reduced motion, without JavaScript or without WebGL2, the deck is a plain list.

### Thread (My services)

The three services build one product, drawn by one dotted line.

- **Layout:** the section label "My services · 01 / 03", the service name as the statement, the owner's short copy in Body, and the six items as a numbered list in Item type between Rule Grey hairlines (two columns of three on desktop, one column on a phone). The shape is on the right, large and vertically centred (600×480 at 1440); on a phone it sits above the statement (280px).
- **Shapes:** three stages of one product, the mark (branding: a circle in front of a square), the mark in a page layout (web design) and the layout opening into code (development: the page stepped back, a code panel in front overlapping its right third). Each is seen in a 3/4 view with a slow sway, so it turns like the cube instead of reading as a flat icon; the mark and the code stage are set in depth, with their back layer dimmer.
- **The thread:** between two services the dots leave the old drawing in pen order and arrive at the new one in pen order, each on a short hop. So the old line unwinds from its start while the new one draws from its start, joined by a thin, bowed stream of dots.
- **Triggered, not scrubbed:** the scroll triggers each drawing and it then plays by itself (1.6s, sine-eased pen). Scrolling 12% into a transit commits to the next service; scrolling 12% back commits to the previous one, which un-draws. The scroll is never held (the One-Scroll Rule).
- **Captions:** they follow the same trigger. The old caption wipes out at once (0.35s); the new one sweeps in like the quote as the drawing finishes (after 0.88s, 0.9s per line: name, then paragraph, then items, 0.12s apart).
- **Entry and exit:** the classic burst flight, in from the Projects plate and on to How I work. Once How I work (Phase 8) and the projects deck (Phase 9) are thread scenes too, `isThreadSegment` treats those crossings as thread segments, because it has no same-scene check. Phase 8 decides whether a crossing between two scenes triggers or stays a scrubbed flight, and updates this line and the One-Scroll Rule.

### Orbit (How I work)

The five steps ride the top of a huge ring of dim dots, and the dots build the page beside it.

- **Anatomy:** a ring of Wire Grey round dots, of which only the top arc shows. The active step's numeral sits centred on the ring (the circle's centre is at x 440 at 1440, and centred on a phone), with its title in Title type in Lamp White and its paragraph in Body, centred, at most 40ch, under it. The section label sits at the top left. There is no plate, no plate dots and no bullet.
- **The shape** is back at full size: on desktop it sits beside the ring on the right (about 560px), never in a corner; on a phone it is centred above the numeral (268px at 390).
- **Five states of one page:** listening, planning, visualising, building and delivery (see The Dot Story). None of them spins or sways, so the loop sleeps here.
- **Turn:** the steps hold still while a shape is formed. When a step triggers (the One-Scroll Rule, from Phase 8), the steps turn one step round the ring's centre on the signal ease, so the next step rises from the right to the top as its shape draws, and the previous one leaves to the left. The ring layer itself never rotates: its dots drift by `stroke-dashoffset` with the scroll all the time, as the ticks do today (Phase 4 decision 3, to be confirmed when the owner scrolls Phase 8).
- **Edges:** on wide screens only the previous numeral peeks in at the left edge, outlined in Wire Grey, with its title in Dim Grey. On a portrait phone the neighbours sit fully off screen.
- **Fallback:** where the staged layout can't run, there is no ring, and each step docks as an opaque black curtain below the label and the slot. Where a step can't fit (400% zoom, text spacing, short landscape phones), the section becomes a reading list.

### About

- **Layout:** the section label "Who am I", the statement "I am Criztian.", the owner's line and story in Body, then the three stats as a `<dl>` under a Rule Grey rule: each value in Title type in Lamp White, with its label under it in Cue type. On the right is the owner's photo on a 4:5 plate (480×600 at 1440), set to the right edge and framed by dots. On a phone the photo comes first, full width, cropped to the phone plate (342×240 at 390 in the mockup).
- **The photo is real and never made of dots.** It shows in black and white (Phase 4 decision 2, to confirm when the photo arrives). Until then it is a placeholder image with a "[Your photo]" chip, and the story is a bracketed "[Your story, in your own words]".
- **The stats count up** when the row enters view, and re-arm only once it has fully left the viewport (Phase 10). The real value never leaves the DOM; the counting digits are an `aria-hidden` overlay.

### Testimonials

- **Layout:** the section label "Testimonials · 01 / 03", the client's words as the statement in curly quotes, in `figure > blockquote > p`, and the attribution under them in a `figcaption` in Cue type: "[Client name] · [Role, company]". On the right is the client's photo or logo on a 1:1 plate (440×440 at 1440), set to the right edge and framed by dots. On a phone the plate comes first, full width, cropped to the phone plate (342×240 at 390).
- **Placeholders:** bracketed until the owner sends real quotes with permission. Never invent a quote, a name or a logo.
- **Several quotes:** the label reads just "Testimonials" while there is one quote and counts them ("Testimonials · 01 / 03") once there are more (owner, Phase 5). How one quote gives way to the next is not designed yet; Phase 5 shows the first. Decide the rest when the real quotes arrive.

### FAQ

- **Layout:** the section label "FAQ", and the statement "FAQ" (240px on desktop, 110px on a phone). The statement is a visual duplicate of the label, so it is `aria-hidden`. On the right are the owner's nine questions as native disclosures between Rule Grey hairlines. Each question is Geist 500 in Lamp White (17px on desktop, 15px on a phone) on a row at least 56px tall (44px on a phone), with a Lit Grey plus that turns 45° into a close mark when open. The answer is in Body. On a phone the list follows the statement.
- **Plain black:** no dot object, so the dots are out of the way while people read.

### Contact

- **Layout:** the section label "Get in touch" and the statement "Let's start your project today." Under it, in Cue type, sits "Or email me:" and the address as a Lamp White link with a 1px underline. On the right is the form on a black box (at least 520×440 at 1440, 32px padding), with the dots gathering round it. The box grows with error messages, the sent message, zoom and text spacing, never a fixed height, and the gather frame follows its measured rect. On a phone the form follows the statement at full width.
- **The gather:** the form box is the slot. Its shape is a dotted perimeter at the frame outset, with points scattered outward from it and thinning with distance; the corners stay sparse. It is still, and the form keeps the pointer.
- **Where it pins:** the gather needs the whole form in one pinned frame, so Contact's frame has a fixed height and joins the fit gate. Where the form cannot fit (most phones below about 844px tall, landscape phones, 400% zoom, text spacing, or error messages that outgrow the frame), the section flows as a plain black reading section and the gather gives way. When it switches while someone is typing or has just submitted, the focused field stays exactly where it was on screen. On a phone the form sits 80px below the email line, so the gather's scatter clears it.
- **Form:** name and email side by side on desktop, then "Service needed" and "What can I help you with?". The submit button is full width. `#contact` must keep working.

### Navigation

Uppercase 14px Geist links (Label type) at Lit Grey over the hero, lighting to Lamp White on hover and for the current section (`aria-current`). They sit in the centre zone in a 16px-gapped row with 12px × 8px hit padding. Once the header turns solid, the links stay Lit Grey, as B1 shows. The header drops in 24px on load (0.6s) and its groups stagger in 0.06s apart. Below 1024px, a ghost icon button toggles a stacked panel of every anchor, and Escape closes it.

**Brand (placeholder):** the name in Antonio 700 uppercase at 28px, Lamp White, with a small 10px Dim Grey © at its top right. It stands in until the owner's own logo (planned as a cursive mark, parked until Phase 10) replaces it.

### Contact Action

The one call to action in the header: a square Lamp White button with Unlit Black 14px uppercase text reading "Let's talk" and a 16px up-right arrow 10px after the text, with 20px × 10px padding. On hover the fill dims to 80%. It is the brightest interactive surface on the page, it links to `#contact`, and it is hidden below 1024px, where the menu panel carries Contact.

### Buttons

- **Primary** (form submit): square, Lamp White fill, Unlit Black text, 48px tall and full width in the form, Geist 500 at 14px in the uppercase Label voice with 0.025em tracking (owner, Phase 5). Hover dims the fill to 80%. Active nudges it down 1px.
- **Ghost** (icon toggles): transparent at rest, with a faint fill on hover.
- **Focus:** a 3px ring in half-strength Lamp White (about 5.3:1 on black), as `FOCUS_RING_CLASS` draws it. Never remove it. The public stage points `--ring` at the foreground, so the vendored button, input, textarea and select draw the same ring.

### Inputs / Fields

- **Style:** square, 44px tall with 12px side padding (the message box 112px), transparent on black, Wire Grey hairline, Lamp White text (16px below 768px, 15px from 768px), placeholder in Dim Grey.
- **Focus:** the border turns Lamp White and the 3px half-strength Lamp White ring appears.
- **Select:** the native `<select>` ("Service needed") matches the input, with `appearance-none` and a 12px Lit Grey chevron. Its empty prompt shows in Dim Grey, and its option list renders dark through `scheme-dark`.
- **Error:** monochrome. `aria-invalid` switches the border to half-strength Lamp White and adds a 3px ring at 40%. The message sits below the field after a warning glyph, with `role="alert"`, and its wording carries the meaning.
- **Labels:** Geist 500 at 14px in Lamp White, sitting above the field.

### Scroll Cue

Cue type in Dim Grey with a 14px down-right arrow. It lifts in (16px, 0.6s) 0.3s after the intro settles, and invites the scroll that drives the morph.

## Do's and Don'ts

### Do:

- **Do** give every screen one dot object (none on FAQ) and one statement, and keep everything else quiet signage.
- **Do** open every section from Projects to Contact with the section label `<h2>`.
- **Do** keep every public section on plain Unlit Black (#000000) and express hierarchy through brightness steps: Lamp White, Lit Grey, Dim Grey.
- **Do** set the name, statements, titles and numerals in Antonio 700 uppercase and everything else in Geist.
- **Do** track out uppercase Geist (0.025em for labels, 0.08em for items, 0.14em for the lede, 0.22em for section labels and cues).
- **Do** draw ideas in dots and frame real things with dots.
- **Do** let the scroll trigger a step and let it play by itself.
- **Do** keep a real, readable `<h1>` behind the dot field, and mark only decorative leaves `aria-hidden` (or a visual duplicate of text that stays exposed, like the FAQ statement).
- **Do** route every motion through the reduced-motion preference. The dot field checks it separately, because it is not a `motion` component.
- **Do** square corners through the `--radius` token rather than by editing vendored components.
- **Do** match B1 when unsure how something should look.

### Don't:

- **Don't** introduce an accent hue, gradient, tinted surface or background texture. The palette is white at different intensities on black.
- **Don't** use a border radius anywhere. The only round things are dots, and rings drawn in dots.
- **Don't** use shadows or raised cards. Brightness, not elevation, brings things forward.
- **Don't** put readable text in Ghost Grey (#737373). It fails AA at body sizes.
- **Don't** outline anything interactive in Rule Grey. It is for dividers.
- **Don't** fill a surface with Lamp White unless it is an action (the Contact action, the submit button).
- **Don't** put two statements on one screen, or set a section's name in big type (FAQ's `aria-hidden` duplicate is the one exception).
- **Don't** render a real thing (a photo, a project image, a logo) in dots, or shrink a dot object into a corner.
- **Don't** hold the scroll, or give a section a new content effect outside the light sweep and the pen draw.
- **Don't** let the public page follow the OS light or dark scheme.
- **Don't** lift copy, layouts or components verbatim from the reference sites, or design a section against one.
