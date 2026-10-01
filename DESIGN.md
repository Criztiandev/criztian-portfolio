---
name: Criztian
description: A black signal board where the name's dots build one product, then invite you to build.
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
    fontSize: "clamp(6rem, 45svh - 9.5rem, 20rem)"
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
  question:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.02em"
  field-label:
    fontFamily: 'Geist, "Geist Fallback", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.333
    letterSpacing: "0.08em"
  section-label:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "0.04em"
  arrival-title:
    fontFamily: 'Antonio, "Antonio Fallback", sans-serif'
    fontSize: "min(8rem, 17cqi, 14svh)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "0.04em"
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
    textColor: "{colors.lamp-white}"
    typography: "{typography.section-label}"
  section-label-count:
    textColor: "{colors.dim-grey}"
    typography: "{typography.section-label}"
  motion-toggle:
    textColor: "{colors.lamp-white}"
    rounded: "{rounded.none}"
    height: "40px"
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
    backgroundColor: "transparent"
    textColor: "{colors.lamp-white}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0"
  chip:
    textColor: "{colors.lit-grey}"
    typography: "{typography.field-label}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 10px"
  chip-selected:
    textColor: "{colors.lamp-white}"
  faq-question:
    textColor: "{colors.lit-grey}"
    typography: "{typography.question}"
---

# Design System: Criztian

> **Status:** this is the locked design, mockup B ("Statement"), with `B-desktop-1` as the reference (owner, 2026-09-29). Phase 5 built the page order, the copy and the B surface: the statement split for the quote, Work, About, Testimonials, FAQ and Contact, the section label, Body, Title, Cue, Rule Grey, the form and the footer. Phase 6 drew every dot object in one material: the frames round the Work, About and client plates, the gather round the form, and the one product that Services and How I work build. Phase 7 moved My services onto the statement split and removed the glide lock. Phase 8 rebuilt How I work around a centred wheel: no plates, the shape above the numeral at full size, the neighbours dim at both edges, and the turn triggered by the dots. Phase 9 built the projects deck: one pinned board, one project at a time, with the dots redrawing the frame round each plate. Phase 10 put every section in the one motion style: each section's label, statement and copy sweep in with the dots and out as they leave, the copy drifts on desktop as a screen arrives and leaves, and the header gains a scroll-spy dot, a scroll-progress hairline and the adaptive cursor. Phase 11 (owner) made the section label bold Antonio and lets it arrive as a big title that docks into the label as its section pins, added the square "Pause motion" toggle to the header, and kept the cursor's ring small over the dots. Phase 12 (owner, direction B "The conversation" on the Phase 12 canvas) rebuilt the ending: FAQ's numbered questions beside a drawing of two speech bubbles, a new Let's connect screen where two hands shake, the restyled form with the dots gathering round it, and LET'S BUILD in the footer's dots. The renders are in `plans/mockups/`. Exact markup is in the artboards on the mockup canvas (linked from the handoff). When unsure how something should look, match B1.

## Overview

**Creative North Star: "The Lit Signal Board"**

The site is a dark room with a display board. The name **Criztian** is not typeset. It is built from thousands of points of light that sit on black, scatter from a cursor or a finger, and spring back with a bounce.

**The one idea: the dots build one product.** As the visitor scrolls, the name's dots become the idea (a turning cube) and frame the finished work. Then they build one product stage by stage: the mark, the mark in a page layout, and the layout opening into code; then the same page listened for, planned, wireframed, built and launched. They frame the real people behind the work, draw the conversation beside the questions, shake hands, gather round the contact form, and end on an invitation in the name's own lettering: LET'S BUILD. A client should leave remembering one sentence: "I build whole products."

**The page rule.** Every screen shows one dot object and one big, bold statement. Everything else is quiet signage. On FAQ the numbered questions carry the screen in place of a statement.

The world is **black throughout** and **strictly monochrome**. Hierarchy is set by how brightly something is lit (full white, three-quarter, dimmed, ghost), never by hue. Every corner is square, because signage and hardware are square. The feeling is calm, precise and premium.

This file describes the public site. The owner surfaces (`/login`, `/dashboard`, the editor) are tools that use the stock shadcn neutral system with light and dark modes. Only the Square Signal Rule reaches them, because it is set at the token level.

**Key Characteristics:**

- Black ground from hero to footer, with no texture. The public page ignores the OS colour scheme.
- One dot object and one statement per screen (FAQ's numbered questions stand in for its statement).
- One display voice (Antonio, uppercase) and one working voice (Geist).
- Brightness is the only emphasis tool. No accent hue.
- Zero radius. Dots are the only curves; the How I work ring is drawn in dots, and the cursor's ring is the one hairline circle.
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
- **Wire Grey** (`wire-grey`, white at 40%): outlines on interactive elements (the form's underlines and service chips), the project tag, the How I work ring's dots and the neighbouring numerals.
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
- **Statement** (Antonio 700, uppercase, line-height 0.95, Lamp White, left-aligned and balanced): the one big line on each screen. It carries the section's meaning, so it is always real text (a heading, a quote or a line of copy), never dots or an image. Size follows length: a long line steps down so it sits on three or four lines, and a single word that cannot wrap steps down until it fits its column ("Development" fits the 720px column only at about 144px or less, and the 342px phone column at about 68px or less). The mockup sizes are caps at the reference widths, not fixed points:

  | Statement                                                    | Desktop (1440) | Phone (390) |
  | ------------------------------------------------------------ | -------------- | ----------- |
  | Default: a project title, "I am Criztian.", "Let's connect." | 176px          | 72px        |
  | A service name ("Web design" wraps to two lines at 1440)     | 176px          | 72px        |
  | "Development", one long word                                 | 127px          | 64px        |
  | The belief line, at most 11ch                                | 136px          | 52px        |
  | A client's words                                             | 120px          | 68px        |
  | "Let's start your project today.", on three lines            | 128px          | 52px        |

  A statement never overflows its column or its frame. From 48rem the left column is about half the viewport, so in the split a statement is sized from its column (container units), not from the viewport, and it keeps a rem term so it grows under page zoom (WCAG 1.4.4). The scale (`STATEMENT_SIZE_CLASSES`, set in Phase 5) is `min(cap, k·cqi + rem, h·svh)` with line-height 0.95:

  | Statement | Phone                | Split                        |
  | --------- | -------------------- | ---------------------------- |
  | Default   | 19cqi + 0.5rem, 72   | 26cqi + 0.5rem, 176, 20svh   |
  | Service   | 19cqi + 0.5rem, 72   | 23cqi + 0.5rem, 176, 20svh   |
  | Long word | 16.5cqi + 0.5rem, 72 | 16.5cqi + 0.5rem, 176, 20svh |
  | Belief    | 14cqi + 0.5rem, 52   | 18cqi + 0.5rem, 136, 16svh   |
  | Client    | 17cqi + 0.25rem, 68  | 15.5cqi + 0.5rem, 120, 14svh |
  | Contact   | 14cqi + 0.5rem, 52   | 16.5cqi + 0.5rem, 128, 15svh |

  The svh term keeps a statement inside short frames (landscape phones, 1280×720). Each factor was checked so the widest word fits its column at the fit sizes and at 768×1024 and 1024×768 ("CRIZTIAN." is the tightest at 768 wide). A word that still cannot fit, such as an owner's long project title, breaks rather than overflows. The service names were measured in Phase 7: BRANDING is 3.71em wide and DEVELOPMENT 4.98em, so the default factor would overflow BRANDING in split columns under about 825px wide where the cap doesn't bind (1024 and 768 wide). Each service therefore names its size in `SERVICES_SCENE`: Branding and Web design take the Service size, and Development the Long word size, about 127px in the 720px column (it could fit 144px there, but the linear scale must also fit a 249px landscape column).

- **Numeral** (Antonio 700 digits, line-height 0.86, outlined with a 2px Lit Grey stroke and no fill, so the ring's dots show through the digits where its top arc crosses them; about 250px on desktop and 150px on a phone): the How I work step numbers only. They size from the viewport height so the shape above them keeps its room: 45svh less 9.5rem from 48rem wide (253px at 1440×900, 172px at 1280×720), from 96px to 320px; on a phone 17.8svh, from 72px to 150px. The active numeral is outlined in Lit Grey and the neighbours in Wire Grey. They are decorative and `aria-hidden`; the step title carries the meaning. They are the one exception to "Display is the name, and nothing else", and in the reading list they drop to a small solid Dim Grey number above the title (24px on a phone, 36px at 1440).
- **Title** (Antonio 700, uppercase, line-height 0.95, 56px at 1440 and 44px at 390, `clamp(2.75rem, 2.47rem + 1.14vw, 3.5rem)`): the How I work step titles and the About stat values. It sits one clear step below the statement. On short phones (the `short` variant) a step title steps down to 32px, so a 375×548 phone keeps the orbit pinned.
- **Body** (Geist 400, 15px/1.55 on a phone and 18px/1.5 from 768px, Lit Grey, at most 40ch): the paragraph under a statement, the About story and the FAQ answers. Form fields use 16px below 768px (iOS Safari zooms the page into a smaller field on focus) and 15px from 768px.
- **Lede** (Geist 400, uppercase, 14px/1.625 with 0.14em tracking from 768px; 13px/1.7 with 0.05em tracking on mobile): the hero tagline only. Maximum width is 34rem.
- **Label** (Geist 400, uppercase, 14px, 0.025em tracking): nav links and the Contact action. The project tag uses it at 12px. The submit button takes the Label voice in Geist 500 (owner, Phase 5).
- **Item** (Geist 400, uppercase, 13px/16px, 0.08em tracking, Lit Grey, after a Dim Grey tabular number): numbered lists, such as the six items under each service. Each row has a Rule Grey hairline under it and is 40px tall on the split (12px padding). On a phone it is 36px, tightening to 28px on phones up to 44rem tall and 24px on short ones, so the dot object keeps its room. The list is an `<ol>`, so the visible number is an `aria-hidden` duplicate.
- **Question** (Antonio 700, uppercase, 26px on desktop and 20px on a phone, line-height 1.05, 0.02em tracking; Lit Grey, Lamp White while its answer is open, after a Dim Grey Antonio number at 20px or 16px): the FAQ questions only (Phase 12). They are big enough to carry the screen, one clear step below a title. The number is an `aria-hidden` duplicate, because the list is an `<ol>`.
- **Field label** (Geist 500, uppercase, 12px on a 16px line that grows only when the label wraps, 0.08em tracking, Lamp White, 10px after a Dim Grey Antonio 700 number at 14px): the contact form's four labels and the chips' text (the chips in Lit Grey). The numbers 01 to 04 are `aria-hidden` and sit outside the `<label>`s.
- **Section label** (Antonio 700, uppercase, 18px on a phone and 20px from 768px, 0.04em tracking, in a 16px line box; the name in Lamp White and the position in Dim Grey): the one `<h2>` style. It names the section and, where the section has steps or several items, the position: "My services · 02 / 03". Every section from Projects to Contact opens with it, at the top left of its frame; the hero, the quote, Let's connect and the footer have none. It was Geist 12px Dim Grey until Phase 11, when the owner found it too quiet to tell which section they were in.
- **Arrival title** (the section label's name at `min(8rem, 17cqi, 14svh)`, about 122px at 1440×900 and 58px on a 390 phone): as a section scrolls in, once the previous section's text has swept out, its label sweeps in as a big title, holds, and shrinks into the label; the section's own copy waits for it and sweeps in as it docks and the dots land (owner, Phase 11). It is the same word at a larger scale, never a second element, so it grows from the label's bottom-left corner into the gap above the frame and never covers the frame's plate, drawing or statement. The size keeps "Testimonials", the widest label, on one line in its column. Every labelled section has one, FAQ included since Phase 12; the quote and Let's connect have no label, so they have none.
- **Cue** (Geist 400, uppercase, 11px with 0.22em tracking at every width, Dim Grey): the scroll cue, plate chips, captions (the quote's author, a client's name, a stat's label, a project's stack line), the "Or email me" line and the footer bar.

### Named Rules

**The One-Statement Rule.** Big type is emphasis only: the name, the belief line, one statement per section and the How I work numerals. A screen never has two statements, and a pinned section's name is never big type: it is the section label. The one exception is the arrival title, which is big only while its section scrolls in, before the statement sweeps in, and is docked by the time the dots land. FAQ has no statement since Phase 12: its numbered questions carry the screen.

**The Two-Voice Rule.** Antonio is for the name, statements, titles, section labels, the FAQ questions and numerals. Geist handles everything else. There is no third voice, and there is no mixed-case Antonio.

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
9. Let's connect (`#connect`, not in the nav; Phase 12): the handshake and the email line
10. Contact (`#contact`)
11. Footer

- **Primary nav:** Work (`#project`), Services, Process, About and FAQ, plus the "Let's talk" action to `#contact`. The artboards call two anchors `#work` and `#belief`; the site keeps `#project` and `#quote`.
- **Blog** is hidden from the page and the nav until real posts exist. Its code stays.

### The statement split

Every screen below the hero is the same composition (the quote and Let's connect have no section label, and FAQ's numbered questions stand in for its statement):

- **Desktop:** two columns inside the 40px gutters, 40px apart.
  - **Left** (about x 40–760 at 1440): the section label at the top left, 56px below the header. Then, vertically centred in the rest of the frame, the statement, left-aligned, with the body and details under it.
  - **Right** (about x 800–1400): the object, large and vertically centred. It is a dot shape, a dot-framed plate or the form.
  - **The columns flex with the object:** Projects gives its plate 700px (620 + 700). Every other screen is 720 + 600, except How I work (see the Wheel Rule below).
  - **Width:** at 1440 the split fills the whole width inside the gutters (1360px). The content stops growing at 100rem (1600px; `max-w-[105rem]` with the gutters), so beyond about 1680px wide the split is centred. Below that the columns keep their ratios: 6fr : 5fr for most screens (720 : 600 at 1440) and 31fr : 35fr for Work (620 : 700).
  - **Vertical rhythm:** the label sits `min(3.5rem, 6svh)` below the header and the frame keeps `min(4rem, 7svh)` at its foot, so 1280×720 fits without growing; short screens (the `short` variant) tighten both to 16px.
- **Phone:** one column, left-aligned, in 24px gutters. The section label sits 28px below the header. Then, vertically centred, the object comes first: a plate at full width (342px at 390, 10:7, at most 28svh tall), or a dot shape as a centred square at its own size (the cube 288px, Services 280px, How I work up to 268px tall). Work is the one screen that is top-aligned on a phone (label, plate, copy), so its pinned slot can sit on the plate. Then come the statement and the details. Where the object is the form (Contact), the statement comes first, top-aligned: 16px under the label, with the form 70px below it. FAQ is top-aligned too: the label, the drawing 16px under it, and the list 24px under the drawing.
- **How I work** is composed like a phone at every width: the label at the top left, then on the centre axis the shape, the numeral on the ring, and the title and copy under it (owner, Phase 8).
- **Choosing the layout:** pinned scenes use the `split` variant (`min-width: 48rem`, or `max-height: 30rem` from 34rem wide), so a landscape phone gets the two columns while 400% zoom stays single-column. The `short` variant tightens the frame's insets, the step type and the copy budget on short screens, so small phones (375×548) keep the pinned layout. Never choose by `md:` alone. The header nav switches at 1024px.

**The Split Rule.** The statement is on the left and the object on the right; on a phone the object comes first. The composition axis never changes from one section to the next, with one exception.

**The Wheel Rule.** How I work turns on a wheel, and a wheel only reads as a real rotation when its centre is the screen's centre. So How I work stacks on the centre axis at every width, as the phone does: the shape above, the numeral on the top of the ring, the title and copy under it, with the neighbouring steps dim at both edges. Its label stays at the top left like every other section (owner, Phase 8, replacing B1's left-hand ring).

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
  - It has three zones on a `1fr auto 1fr` grid, so the nav stays truly centred: the brand at left (linking to `#home`), the primary nav in the centre, and the pause toggle and the "Let's talk" action at right.
  - Below 1024px the nav collapses behind a menu button into a full-width stacked panel of every anchor, capped at the viewport height and scrollable.
- **Frames:** every section below the hero is at least one frame tall (the viewport minus the 72px header), and the split sits inside it. Every anchor except `#home` has a 72px scroll margin, equal to the header, so an anchor jump lands exactly where its scene pins.
  - **Step scenes** (Projects, Services and How I work): a pinned frame holds the shape slot while the label stays put (on the board, for Projects), with one pitch of scroll per step.
    - **Staged (the default where it can run):** the copy never scrolls. It sits on one pinned board and changes when a step triggers.
    - **Staged needs** scroll-driven animations, motion allowed, a viewport taller than 30rem, a running dot field and a scene that fits. Anywhere else the Services and How I work steps dock as opaque black curtains below the label and the slot, so the copy never crosses either; Projects becomes a plain list instead (see Projects).
    - When the copy cannot fit its box (WCAG text spacing, 400% zoom, an extreme size), the scene drops to a plain reading list; the copy is never clipped or covered.
  - **Single-frame scenes** (Quote, About, Testimonials, Let's connect and the footer): the frame grows with its content (a minimum height, never a fixed one), so zoom or text spacing lengthens the pin instead of clipping the copy. Contact is the exception: its frame is fixed and flows as a reading section where the form cannot fit (see Contact).
  - **FAQ** (Phase 12): its pinned frame holds only the drawing, and the questions scroll past it in their own layer, so a reader can open answers freely while the drawing stays put. On a phone the list slides up over the drawing on an opaque ground.
- **Footer:** the dots spell LET'S BUILD in its slot (Phase 12; the name re-formed there until then), above a Cue-type bar with a Rule Grey top rule: ©, the footer nav (the five primary links), the email and Back to top. It is one row from 1024px, and stacked and centred below, where every item is at least 44px tall and the bar has no gaps and a 12px top padding (213px on a 390 phone), with LET'S BUILD centred on the whole screen above it, as the phone artboard has it. In forced colours, where the canvas is hidden, LET'S BUILD shows as text in its place, as the hero's name does.

## Elevation & Depth

The system is flat. Nothing casts a shadow. Depth comes only from light, meaning how bright a thing is against black. It also comes from one translucent layer: after 120px of scroll, the header turns into black at 80% opacity with a backdrop blur and a Rule Grey bottom rule, so the page reads as passing beneath it.

**The Lit-Not-Lifted Rule.** Nothing on the public site gets a `box-shadow` or a raised surface. When something needs to come forward, it gets brighter. A plate is framed by dots, never by a border or a shadow. The arrival title's black halo is not a lift: it is black on black, invisible except where it clears the flying dots off the big letters.

## Shapes

Every corner is square. Buttons, inputs, plates, tags and focus rings are all square. The only curves in the system are made of dots, plus the cursor's ring. Each wordmark point is a circle (roundness 1), 4px across on a 3px pitch, so neighbours overlap and the letterforms read as nearly solid shapes made of light until the pointer pulls them apart.

**The Square Signal Rule.** Zero radius everywhere. The only round things on the site are dots, rings drawn in dots, and the cursor's ring: a 1px hairline that trails the pointer on desktop (owner, Phase 10; see Cursor).

**How to apply:**

- The vendored shadcn components (`src/components/ui/`) must not be hand-edited, and they derive every radius from `--radius`. `--radius` is `0rem` in `src/app/globals.css`, which squares all of them at once, including the owner surfaces. It carries a unit because shadcn compares it with pixel lengths in `min()`.
- A ring is drawn in dots: one circle with round caps and a 3px stroke, dashed `0 10px` so it reads as 3px dots every 10px of arc, never as a solid or dashed stroke. The circle has no `pathLength`, so the dash is in pixels at every size.

## Motion

**The One-Motion Rule.** Section content moves in one of four ways, and no section gets its own trick:

- **Text: the light sweep, drawn by the dots.** A hard-edged wipe from left to right with a 24px slide, on the signal ease (`cubic-bezier(0.65, 0, 0.35, 1)`: `SIGNAL_EASE` for Motion, the `ease-signal` token in CSS). It never runs on a clock: the dots' own progress draws it (owner, Phase 10). Every section's label, statement and copy sweep in as the section's dots land and wipe out as they leave, one line after another in reading order (a paragraph, a list row, a stats row or a footer link is one line), so text, dots and scroll stay in sync at any speed, and every visit replays it. Step scenes sweep their captions per step (see Thread, Orbit and Projects), and their labels with the scene. Only the name's intro keeps a soft 26px edge, in the shader; all other text has the hard edge (owner, Phase 10). FAQ keeps its rows lit while they scroll away, until the handshake has formed, so a reader never loses the row they are reading. So does a screen whose frame grows past the viewport (a landscape phone, 400% zoom or text spacing), because its lower lines only come into view after its pin. Keyboard focus lights a whole section, so a focused link is never clipped.
- **Dots: the pen-order draw.** A shape draws in the order a pen would draw it, and un-draws from its start. Between shapes the dots travel on a staggered sweep and a gentle arc.
- **Copy drift (desktop).** From 48rem wide, the copy of every single-frame screen (the quote, About, Testimonials, FAQ, Let's connect and Contact) drifts up to 40px against its dot object as the screen arrives and leaves, and holds still while it is pinned (owner, Phase 10). It never runs under reduced motion, on phones, or in the step scenes, whose copy is tied to the dots.
- **The arrival title.** Once the outgoing section's text has swept out, as the arriving section rises from the foot of the screen across the breather, its label sweeps in as the big arrival title, alone on the screen, at the pace of the scroll: the sweep takes about a third of the arrival (about 250px of scroll at 1440×900), never a sudden pop (owner, Phase 12: "sudden pop out hurts my eye"). It holds big for about a quarter of the arrival, then shrinks into the label on the signal ease over the last third. The section's statement, copy and images wait for it: they sweep in only as it docks, while the dots land. A soft black halo round its letters keeps the flying dots off them. It follows the scroll, like the drift, so scrolling back reverses it, and a nav jump lands with it docked. It wipes out with the dots when the section leaves (owner, Phase 11, in three rounds: not over the old section and the flight, and long enough to register).

Interface motion is separate and stays small: the header drop-in, the scroll-cue lift, hover and active states, the menu wipe-open, the FAQ answers opening, the How I work turn, the stats count-up, the nav dot, the scroll-progress hairline, the cursor and the contact acknowledgement. All motion animates transform, clip-path and opacity only, with two named exceptions: the FAQ answer's height and the cursor ring's width and height.

The Phase 10 decisions on the parked ideas (owner): heading parallax became the copy drift above; the adaptive cursor is built (see Cursor); the cursive logo replaces the brand when the owner's mark arrives.

**The One-Scroll Rule: trigger, play, no lock.** Inside a scene with steps, a step triggers once the scroll passes 12% into a transit, in either direction, and then plays by itself (1.6s for a drawing), so a stopped scroll never leaves a half-drawn shape. The page never holds the scroll: a fast scroll carries on, and the next trigger takes over. This replaces the Services glide lock (removed in Phase 7); How I work's turn (Phase 8) and the projects deck (Phase 9) follow it too. Between scenes, the dots' flight follows the scroll on a short ease, even from one scene with steps into the next (Projects into Services, Services into How I work): both frames are moving then, and a shape that played ahead of the scroll would hang at the next pinned slot over the outgoing copy (Phase 8).

**The Breather.** Every section after the hero starts three-quarters of a screen of black below the one before (owner, Phase 12: "a huge space … so it's dramatic and the transition of the dots is not short", then "smaller a little so when I scroll down I can still see the bottom"). The old section's copy sweeps out as it rises, the dots fly across the black, and only then does the next section's title sweep in, so a transition reads as its own moment and even a fast scroll never stacks two sections' text. The old section's bottom edge is still on screen as the next one's top comes up, so the screen is never empty. FAQ into Let's connect, where the questions end on a black band, was the model. FAQ's drawing holds only a quarter of a screen after its questions, and Let's connect adds only a quarter of a screen of breather, so the conversation never sits alone on black and that pause is no longer than the others (owner: "the transition of FAQ and Let's connect is too long"). It is space, not a pin: nothing holds the scroll. It goes where the dots can't run (no WebGL2, no JavaScript) and stays, plain black, under reduced motion and the pause, so a motion setting never changes the page's length.

**Reduced motion:** no sweep, draw, flight, spin, wobble, drift, arrival title or count. Text appears in place, and each shape is drawn still, in its resting pose, only while its section is pinned. Between scenes the canvas is empty. The nav dot moves without sliding and the cursor's ring sits on the pointer. The scroll-progress hairline stays, because it moves only with the reader's own scroll, like a scrollbar.

**Pause motion:** the header's square toggle gives the same page to anyone, whatever their system says (WCAG 2.2.2, owner, Phase 11). Paused, the page is exactly the reduced-motion page, the cube and the Services stages stop turning, and the browser remembers the choice. Where the system already asks for reduced motion the toggle is hidden, because there is nothing left to pause.

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
  - **Pause:** the cube's spin and the Services shapes' sway never end on their own, so the header's "Pause motion" toggle stops both, with everything else that moves (WCAG 2.2.2; owner, Phase 11). Reduced motion gets a still shape without it.

### The Dot Story

Every section is a scene on one scroll timeline (see `plans/handoff.md`). A formed shape sits in a pinned slot while its section is stuck under the header, and between scenes the dots fly from one slot to the next with the same staggered sweep and arc as the name-to-cube morph. In scroll order (the canvas's "The dot story" artboard; the geometry is in the handoff's Phase 6):

1. **The name** (hero).
2. **The idea:** the cube (belief quote).
3. **Finished work:** the dots frame the active project plate, and between two projects the frame unwinds and redraws round the new plate (Projects).
4. **Brand, design and code:** one product in three stages, the mark, the mark in a page layout, and the layout opening into code (Services).
5. **Five states of the same page:** a loose ring (listening), a grid (planning), a wireframe (visualising), the built page (building), and the page lifting off on a trail of dots (delivery) (How I work).
6. **Real people:** the dots frame the owner's photo (About), then a client's photo or logo (Testimonials).
7. **The conversation:** two speech bubbles, a question with two lines of text and an answer with three dots, beside the questions (FAQ, Phase 12).
8. **The handshake:** two hands shaking, drawn from both wrists in towards the clasp (Let's connect, Phase 12).
9. **Gather:** the handshake's dots fly to the frame round the contact form (Contact).
10. **The invitation:** the footer's dots spell LET'S BUILD in the name's own lettering (Phase 12; until then the name came home there).

**The Draw-and-Frame Rule.** The dots draw ideas and frame real things. Ideas are drawn in dots: the name, the cube, the product being built, the conversation, the handshake and the invitation. Real things are framed by dots: a project image, the owner's photo, a client's photo or logo, the form. A real thing is never made of dots, a dot object is never shrunk into a corner, and no screen has a dotted grid or other background texture.

- **One material:** every shape except the name and the sign is the cube's chalk stipple, dots in a jittered band about as wide as the cube's. The particle globe and the starfield are gone, and since Phase 12 no screen is dust: FAQ draws the conversation. A scene that cannot fit still drops to (invisible) dust.
- **Drawings:** Services and How I work draw one page: a 1.8 × 1.2 frame with a header rule, the mark (a small circle and square) at its left, three nav dashes, a hero block, an image block and three columns. The mark alone is a circle in front of a square. The page is drawn with the mark, stepped back behind a code panel, as a grid, as outlines, built (text lines, an image cross, column lines) and launched on a narrowing trail of dots. Listening is a loose dim ring of scattered points. Each is seen in a slight 3/4 view, with the far side dimmer.
- **The ending's drawings** (Phase 12) are still, in the same 3/4 view at half the slot's short side: the conversation (the question bubble behind, the answer bubble in front; the pen draws the question, its lines, the answer and its three dots), and the handshake (Lucide's handshake redrawn with sleeves and double cuffs, the back arm behind and the front hand in front; the pen draws both arms at once from the sleeves in to the clasp). Neither spins or sways, so the loop sleeps on them.
- **The sign:** LET'S BUILD is sampled from Antonio exactly like the name (the same 3px grid, 4px dots and 0.05em tracking), at the name's width, about 1,124px at 1440, and it arrives left to right. A drawing may use at most 12,000 dots, so beyond about 1,445px wide the sign stops growing (about 1,100px) while the name keeps growing. It scatters under the pointer like the name, and it is fitted, never stretched, into the footer's slot (342px wide on a 390 phone).
- **Plate frames:** a frame is a thin rectangle of dots just outside its plate: 18px out, or 5% of the plate's short side when that is less (12px round a 342×240 phone plate). The plate's rect sets the proportions: 10:7 for a project, 4:5 for the About photo and 1:1 for a client's plate on desktop. A frame is still: it never scatters under the pointer, so the real thing keeps the attention (owner, Phase 6). It still takes the small arrival bounce. Between two projects it never flies: it unwinds in pen order with the old project and redraws in pen order round the new plate, in place, and a hop back plays it in reverse (Phase 9).
- **Reduced motion:** see Motion.
- **No WebGL2:** slots collapse and the scenes stop pinning. The text `<h1>`, the statements and the plates carry all meaning either way.
- **Forced colours:** the canvas is hidden, so the name and LET'S BUILD show as text.
- **Dot count:** every shape uses the same dots: 12,000, or the wordmark's count if it is larger. The cube draws its reference 7,200 of them, and the rest wait hidden. A small slot shows only a share of a drawing, so a phone never packs its dots into a blob.

### Belief Quote

The one quote on the page, owner-editable in the dashboard (text plus an optional author), seeded as a visible placeholder until the owner writes their belief line. It is a statement at the belief size (136px, at most 11ch), left-aligned in the left column, with the cube on the right (460×460 at 1440, centred in the column). On a phone the cube comes first (288px, centred), 32px above the statement. It has no section label. The author sits 24px below in Cue type at Dim Grey after an em dash, and is hidden when empty. Its markup is `figure > blockquote > p` plus a `figcaption`.

- **Reveal:** the light sweep opens the statement left to right as the name's dots form the cube, and the author follows it; scrolling away wipes both out, and coming back replays them (Phase 10: drawn by the dots, replacing the timed reveal). On desktop the quote drifts up to 40px against the cube as the screen arrives and leaves.
- **Reduced motion:** it appears in place. The hidden state never uses opacity, so the text stays readable to assistive tech throughout.

### Projects

The proof section. It is owner-editable in the dashboard (up to six projects). The seed is three visible placeholders; a project without a valid image shows the neutral monochrome placeholder plate. Nothing is invented.

- **Layout:** the section label "Work · 01 / 03" (the active project over the visible count), the project's title as the statement, its summary in Body, then a square tag (Wire Grey hairline, Dim Grey Label type at 12px) and the stack line in Cue type. On the right is the 10:7 plate (700×490 at 1440), framed by dots. On a phone the plate comes first, full width. B has no in-section action: "Let's talk" is always a tap away, in the header from 1024px and in the menu panel below it.
- **The editor's heading and intro:** retired (owner, Phase 5). The label "Work" stands in for the heading, and neither field shows on the page or in the editor; the schema still stores them.
- **The deck (Phase 9):** a pinned step scene with one step per visible project and one frame of scroll per step. The label, the plate slot and one board stay put, and the board shows one project at a time. It follows the One-Scroll Rule: 12% into a transit the next project commits and plays by itself, 12% back the previous one returns, and the scroll is never held. A fast scroll hurries through a project it passed, as the Services drawings do.
- **The swap:** between two projects the dot frame unwinds in pen order with the old project and redraws in pen order round the new plate, in place; it never flies (owner, Phase 9). A hop back plays it in reverse: the frame un-draws from the end of its line and redraws from there. The image wipes with a clip-only light sweep and never slides inside its frame. The title, the summary, the tag and stack, and the label's count ("· 02 / 03") sweep as captions at the pen's pace, as Services' do: out over the first half of the hop and in over the second, never on a clock. At the middle of the hop the board is briefly clear, so two projects never overlap. The word "Work" stays put between projects: it sweeps in with the section as the first frame draws, and out as the dots leave for Services (Phase 10).
- **One project, or none:** with one visible project there is no deck: the one screen shows as it is, with its frame. With no visible project there is no frame.
- **The fallback list:** where the board can't run (reduced motion, no scroll-driven animations, a viewport 30rem tall or less, no JavaScript, no WebGL2), the deck is the Phase 5 screens, one after another, each one frame tall (at least one, growing with its copy, without JavaScript or WebGL2). Each screen has its own label ("Work · 02 / 03"; the first is the section `<h2>`, the rest are `aria-hidden` duplicates), its title as the statement and its 10:7 plate. The pinned frame holds only the dot slot at the plate's rect, so the screens slide past it and, where the dots run, the dot frame frames each plate as it lands. On a phone each screen is black except a clear ring round its plate, so the frame shows only round the plate that is passing it, and copy never crosses its dots (owner, Phase 6). The ring is a background-coloured spread used as a mask, not a visible shadow. The label sits 24px above the plate, clear of the ring. In forced colours, where the mask cannot draw, the phone screens stay opaque and hide the frame.
- **Plate:** the image, `object-cover`; or, when a project has no valid image, the monochrome placeholder (`/projects/placeholder.webp`) with a chip naming it as one ("Image placeholder", Cue type in Dim Grey on a black tab, 16px in from the top left).
- **Links:** the title is the link, when a project has an https one, and it opens a new tab. It underlines on hover. In the list its hit area and its 3px focus ring cover the whole screen; on the board they cover the title only, so the ring sits round the title. Every card stays in DOM order, in the tab order and in the screen-reader order, on the board or not (owner, Phase 9). Tabbing onto a hidden project's link brings that project onto the board, and the scroll takes over again when focus leaves. Until then the focused project keeps the board, even when the keys scroll the page on, and the frame redraws under it.
- **Fit:** each card is a fixed-height box, one frame tall. Where a card's copy can't fit its box, the deck flows as a plain reading list: the cards grow instead of clipping, and the frame gives way.
- **Where it pins** (measured with the placeholder titles; a long title flows it sooner): desktop, tablets and portrait phones down to 375×548, 360×560 and 320×568, and the shortest landscape phone (740×280), where the statement's height cap shrinks the title. It flows at 740×360 (by 2px), 740×304, 667×320 and 400% zoom. With WCAG text spacing it pins at 1920×1080, 1440×900 and 360×640, and flows at 1024×768.
- **Never hidden:** a card off the board is clipped by its sweep, never opacity-hidden or removed, so every card reads without JavaScript and stays in DOM order for screen readers.

### Thread (My services)

The three services build one product, drawn by one dotted line.

- **Layout:** the section label "My services · 01 / 03", the service name as the statement, the owner's short copy in Body, and the six items as a numbered list in Item type between Rule Grey hairlines (two columns of three once the copy column is 30rem wide, else one column). The copy is vertically centred in the left column under the label. The shape is on the right, large and vertically centred (a 5:4 slot, 600×480 at 1440, the page about 420px wide); on a phone it sits above the statement, in a slot at most 280px wide that takes whatever height the copy leaves (320px on a 390×844 phone, 200px at 390×664, 152px at 375×548).
- **The label's position** ("· 02 / 03") is an `aria-hidden` visual duplicate that follows the committed service. It shows only on the staged board, where it wipes with the captions. Wherever the captions are docking curtains or a reading list (reduced motion, no scroll-driven animations, short screens, a scene that cannot fit), the label reads just "My services", because curtains follow the scroll, not the trigger.
- **Shapes:** three stages of one product, the mark (branding: a circle in front of a square), the mark in a page layout (web design) and the layout opening into code (development: the page stepped back, a code panel in front overlapping its right third). Each is seen in a 3/4 view with a slow sway, so it turns like the cube instead of reading as a flat icon; the mark and the code stage are set in depth, with their back layer dimmer.
- **The thread:** between two services the dots leave the old drawing in pen order and arrive at the new one in pen order, each on a short hop. So the old line unwinds from its start while the new one draws from its start, joined by a thin, bowed stream of dots.
- **Triggered, not scrubbed:** the scroll triggers each drawing and it then plays by itself (1.6s, sine-eased pen). Scrolling 12% into a transit commits to the next service; scrolling 12% back commits to the previous one, which un-draws. The scroll is never held (the One-Scroll Rule). A fast scroll never skips a drawing: when the reader has already passed the next service, the pen hurries through it and then draws the one they stopped on at its own pace.
- **Captions:** drawn by the same pen, never by a timer (owner, Phase 7). The old caption wipes out as its drawing unwinds, over the first half of the hop. The new one sweeps in from the left as its drawing forms, over the second half: the name first, then the paragraph, then the items. So the name lands with the drawing at any scroll speed, a fast scroll wipes it through quickly, and scrolling back reverses both. At the middle of the hop, when the drawing is half one shape and half the other, the text box is briefly clear, so two captions never overlap.
- **Where it pins:** desktop, tablets and portrait phones from 360px wide, down to 375×548. Landscape phones and 320px-wide phones flow it as a reading list, because the six items can't fit under the statement in their frame. So do 400% zoom, and WCAG text spacing on phones and at laptop sizes (1440×900, 1024×768), where "Web design"'s two lines at line height 1.5 outgrow the board; 1920×1080 still pins.
- **Entry and exit:** the classic burst flight, in from the last Projects plate and on to How I work, following the scroll, each across three-quarters of a screen of black (the Breather, Phase 12). The projects deck (Phase 9) and How I work (Phase 8) are thread scenes too, but a crossing between two scenes stays a scrubbed flight: `isThreadSegment` threads two steps only inside one scene (see the One-Scroll Rule).

### Orbit (How I work)

The five steps ride the top of a huge ring of dim dots, and the dots build the page above it. The whole screen turns on the centre axis (the Wheel Rule).

- **Anatomy:** a ring of Wire Grey round dots whose centre is far below the middle of the screen, so only its top arc shows, falling evenly to both edges. The active step's numeral sits centred on the top of the ring, with its title in Title type in Lamp White and its paragraph in Body, centred and at most 40ch, under it. The section label "How I work · 04 / 05" sits at the top left; its position is an `aria-hidden` duplicate that shows only on the staged board, like My services'. There is no plate, no plate dots and no bullet.
- **The shape** is back at full size, centred above the numeral, never in a corner. It takes the height the step leaves, ending just above the numeral: up to 416px on desktop (259px at 1440×900, 188px at 1280×720) and up to 268px on a phone (264 at 390×844, 209 at 390×664, 200 at 375×548). The page is drawn at 0.58 of that height, about 270px wide at 1440×900 and on a 390×844 phone.
- **Where the copy sits:** each step is placed from the top, right under the shape, and the shape's height is what the longest step leaves (a title line and three lines of Body on desktop, two title lines on a phone and one 32px line on a short phone), so that step ends one frame inset above the foot. Every step shares the one ring.
- **Five states of one page:** listening, planning, visualising, building and delivery (see The Dot Story). None of them spins or sways, so the loop sleeps here.
- **Turn:** the steps hold still while a shape is formed. When a step triggers (the One-Scroll Rule), the dots draw the next state in pen order, and the wheel turns one step round the ring's centre on the signal ease, from the dots' own progress and never on a clock. The next step rises from the right edge to the top as its shape draws: its numeral and title brighten and its paragraph sweeps in from the left. The previous step leaves to the left edge, dims, and its paragraph wipes out. The step beyond the right edge assembles its digits and sweeps its title in as it turns into view. A fast scroll hurries through a step it passed, exactly as the Services drawings do. When the dots leave for About, the whole wheel's copy wipes out and its numerals come apart with them, so the flight never streams through a lit step (Phase 11). The ring layer itself never rotates: its dots drift by `stroke-dashoffset` with the scroll all the time (Phase 4 decision 3, to be confirmed when the owner scrolls Phase 8).
- **Edges:** on desktop both neighbours wait on the rim at the screen's edges, half in view, outlined in Wire Grey with their titles in Dim Grey (owner, Phase 8). Steps are half the width apart along the ring, and never less than 576px, so a neighbour's title never meets the active one; on narrower screens only the neighbours' titles show at the edges. On a portrait phone the neighbours sit fully off screen.
- **Fallback:** where the staged layout can't run, there is no ring, and each step docks as an opaque black curtain under the shape. Where a step can't fit (400% zoom, text spacing at every size, landscape phones and 320px-wide phones such as 320×568), the section becomes a reading list.

### About

- **Layout:** the section label "Who am I", the statement "I am Criztian.", the owner's line and story in Body, then the three stats as a `<dl>` under a Rule Grey rule: each value in Title type in Lamp White, with its label under it in Cue type. On the right is the owner's photo on a 4:5 plate (480×600 at 1440), set to the right edge and framed by dots. On a phone the photo comes first, full width, cropped to the phone plate (342×240 at 390 in the mockup).
- **The photo is real and never made of dots.** It shows in black and white (Phase 4 decision 2, to confirm when the photo arrives). Until then it is a placeholder image with a "[Your photo]" chip, and the story is a bracketed "[Your story, in your own words]".
- **The sweep:** the label, the statement, the line, the story and the stats row sweep in one after another as the frame draws round the photo, and the stats row's rule draws with it. On desktop the copy drifts up to 40px against the photo as the screen arrives and leaves.
- **The stats count up** with the dots: as the stats row sweeps in, each number counts from 0 to its value, and it counts again on every visit (owner, Phase 4; built in Phase 10). The real value never leaves the DOM: the counting digits are an `aria-hidden` overlay drawn by CSS on top of it, so assistive tech, find-in-page and translation always read "5+", "500+" and "140". Under reduced motion, without JavaScript or WebGL2, and in forced colours, the real values show and nothing counts.

### Testimonials

- **Layout:** the section label "Testimonials · 01 / 03", the client's words as the statement in curly quotes, in `figure > blockquote > p`, and the attribution under them in a `figcaption` in Cue type: "[Client name] · [Role, company]". On the right is the client's photo or logo on a 1:1 plate (440×440 at 1440), set to the right edge and framed by dots. On a phone the plate comes first, full width, cropped to the phone plate (342×240 at 390).
- **The sweep:** the label, the words and the attribution sweep in one after another as the frame draws round the client's plate. On desktop they drift up to 40px against the plate as the screen arrives and leaves.
- **Placeholders:** bracketed until the owner sends real quotes with permission. Never invent a quote, a name or a logo.
- **Several quotes:** the label reads just "Testimonials" while there is one quote and counts them ("Testimonials · 01 / 03") once there are more (owner, Phase 5). How one quote gives way to the next is not designed yet; Phase 5 shows the first. Decide the rest when the real quotes arrive.

### FAQ

Rebuilt in Phase 12 (owner: "do something about the questions, because right now it's bland"; direction B, "The conversation").

- **Layout:** the section label "FAQ" (with the arrival title, like every labelled section), then the owner's questions, numbered 01 to 09, as native disclosures between Rule Grey hairlines, in the left column; on the right the dots draw two speech bubbles (480×480 at 1440, centred in its column and vertically in the frame). Each row is at least 56px tall (48px on a phone): a Dim Grey number, the question in Question type, and a Lit Grey plus that turns 45° into a close mark when open (the artboard's 14px mark: one path with 12px arms and a 1.5px square-ended stroke; the system text colour in forced colours). The answer is in Body, indented under the question (56px on desktop, 40px on a phone). On a phone the label comes first, the drawing (342×240) 16px under it, and the list 24px under the drawing.
- **Owner-editable:** up to twelve questions with their answers, added, edited, reordered and removed in the editor. A blank question hides its row, and the numbers count the rows shown.
- **Opening:** an answer opens downward: its question and every row above it stay exactly where they are, and only what is below moves. It eases its height over 0.35s on the signal ease, and the plus turns in the same time; closing reverses it. Under reduced motion both snap. The change stays inside 0.5s of the click or key press, so it never counts as a layout shift.
- **Reading:** the frame holds only the drawing; the list scrolls in its own layer, so the drawing stays put while the questions pass. On a phone the list slides up over the drawing on an opaque ground, as the Projects screens slide past their plates.
- **The sweep:** the label sweeps in as the arrival title docks, then each row, its hairline drawing with it. The rows then hold while they scroll away, until the handshake has formed, so a row never wipes out under the reader. On desktop the list drifts up to 40px against the drawing as the screen arrives and leaves.

### Let's connect

A screen of its own between FAQ and Contact (owner, Phase 12: "a handshake, like two hands shaking each other, saying let's connect").

- **Layout:** like the quote, it has no section label and is not in the nav (the nav dot hides while it is on screen, as on Testimonials). The statement "Let's connect." at the default size (176px at 1440, 72px on a phone) on the left, with the email line 32px under it (16px on a phone) in Cue type: "Or email me:" and the address as a Lamp White link with a 1px underline. On the right the dots draw two hands shaking (5:4, 600×480 at 1440); on a phone the drawing comes first (342×274), 32px above the statement, and the pair is centred in the frame.
- **Owner-editable:** the statement, the email line and the address. The footer's email link reads the same address.
- **The sweep:** the statement and the email line sweep in as the hands draw. On desktop the copy drifts up to 40px against the drawing.
- **Into Contact:** scrolling on, the handshake's dots fly to the frame round the real form.

### Contact

- **Layout:** the section label "Get in touch" and the statement "Let's start your project today." (both owner-editable since Phase 12). On the right is the form on a black box (at most 560px wide and at least 472px tall at 1440, with 32px padding), with the dots gathering round it. The box grows with error messages, zoom and text spacing, never a fixed height, and the gather frame follows its measured rect. On a phone the statement sits 16px under the label and the form follows 70px under it at full width with no padding (342×452 at 390), clear of the gather's scatter. The email line moved to Let's connect in Phase 12.
- **The gather:** the form box is the slot. Its shape is a dotted perimeter at the frame outset, with points scattered outward from it and thinning with distance; the corners stay sparse. It is still, and the form keeps the pointer.
- **Where it pins:** the gather needs the whole form in one pinned frame, so Contact's frame has a fixed height and joins the fit gate. Where the form cannot fit (most phones below about 844px tall, landscape phones, 400% zoom, text spacing, or error messages that outgrow the frame), the section flows as a plain black reading section and the gather gives way. When it switches while someone is typing or has just submitted, the focused field stays exactly where it was on screen.
- **Form** (restyled in Phase 12): four numbered rows, 01 Name and 02 Email side by side on desktop (24px apart), then 03 Service needed, 04 What can I help you with?, and a full-width "Send message" with an up-right arrow. Desktop rows are 28px apart, with the submit 32px below the message; on a phone everything stacks 14px apart, with the submit 18px below. The fields are listed under Inputs / Fields. `#contact` must keep working.
- **The sweep:** the label and the statement sweep in as the dots gather; the form is a real thing, framed by the dots, and never sweeps. On desktop the copy drifts up to 40px against the form as the screen arrives and leaves.
- **Sent:** the form stays where it is but turns invisible, and the acknowledgement takes its place in the same box, sweeping in from the left over 0.9s on the signal ease, and receives focus (Phase 10). The box keeps its height, so nothing on the page shifts and the gather stays where it is. Under reduced motion it appears at once.

### Navigation

Uppercase 14px Geist links (Label type) at Lit Grey over the hero, lighting to Lamp White on hover and for the current section (`aria-current`). They sit in the centre zone in a 16px-gapped row with 12px × 8px hit padding. Once the header turns solid, the links stay Lit Grey, as B1 shows. The header drops in 24px on load (0.6s) and its groups stagger in 0.06s apart. Below 1024px, a ghost icon button toggles a stacked panel of every anchor, which wipes open from the top (0.3s on the signal ease; instant under reduced motion), and Escape closes it.

- **Scroll-spy:** the current section is the last one whose top has reached its landing under the header, and it updates as the page scrolls, in the primary nav and the panel alike. A click only closes the panel; the scroll marks the section.
- **The nav dot:** a 6px Lamp White dot 10px under the current primary link, the size of the cursor's dot. It slides to the next link on the signal ease (0.3s), so on a nav jump it steps under each link the page passes. It hides where the current section has no primary link (the hero, Testimonials, Let's connect, Contact) and appears in place when it returns. In forced colours it takes the system text colour.
- **Scroll-progress hairline:** a 1px Wire Grey line along the header's bottom edge, filling from the left as the page scrolls, driven by the scroll itself (no script). It is the one progress mark on the page: no scene counter or film strip. Browsers without scroll-driven animations don't show it.
- **Pause motion:** a square ghost icon button (40px from 1024px, 32px below it) in Lamp White, first in the right zone: before "Let's talk" on desktop and before the menu button on phones. It shows a pause glyph named "Pause motion", or a play glyph named "Play motion" once paused. It has the 3px focus ring and a visible outline in forced colours. It is hidden where the system already asks for reduced motion and without JavaScript.

**Brand (placeholder):** the name in Antonio 700 uppercase at 28px, Lamp White, with a small 10px Dim Grey © at its top right. It stands in until the owner's cursive mark (approved in Phase 10) replaces it.

### Cursor

On desktops with a mouse the pointer is a pair: a 6px white dot exactly at the pointer, and a 36px ring, a 1px white hairline at 40%, that trails it on a critically damped spring (about 0.1s behind a moving pointer, with no overshoot). Both use `mix-blend-mode: difference`, so they read white on black and black on the Lamp White actions. White here is the one hard-coded colour, because it is the difference operand (owner, Phase 10; designed as old Part 4).

- **States:** over a link, a button, a FAQ question or a service chip the ring fills into a 56px disc, and the dot stays as a hole in it. Over a field the pair hides and the native caret shows. Everywhere else, the dots included, it is the idle pair: the ring keeps its 36px while the dots scatter under it (owner, Phase 11; the ring used to grow to the push radius, about 600px round the name, which the owner found distracting).
- **Scroll:** the state re-reads what is under a still pointer as the page scrolls, and the idle ring stretches up to 1.3 times along the scroll while it moves.
- **Transitions:** state changes take 0.3s on the signal ease, shared with the nav dot. The ring animates its width and height, not its scale, so the hairline stays 1px; it is one of Motion's two named exceptions.
- **Where it runs:** only on the public page, with a fine pointer and forced colours off. Phones, pens, touch, forced colours, no JavaScript and the dashboard keep the native cursor, and it stays hidden until the first mouse move. Under reduced motion the ring sits on the pointer with no lag and no stretch. It never takes pointer events and carries no text.

### Contact Action

The one call to action in the header: a square Lamp White button with Unlit Black 14px uppercase text reading "Let's talk" and a 16px up-right arrow 10px after the text, with 20px × 10px padding. On hover the fill dims to 80%. It is the brightest interactive surface on the page, it links to `#contact`, and it is hidden below 1024px, where the menu panel carries Contact.

### Buttons

- **Primary** (form submit): square, Lamp White fill, Unlit Black text, 48px tall and full width in the form, Geist 500 at 14px in the uppercase Label voice with 0.025em tracking (owner, Phase 5). Hover dims the fill to 80%. Active nudges it down 1px.
- **Ghost** (icon toggles): transparent at rest, with a faint fill on hover.
- **Focus:** a 3px ring in half-strength Lamp White (about 5.3:1 on black), as `FOCUS_RING_CLASS` draws it. Never remove it. The public stage points `--ring` at the foreground, so the vendored button, input, textarea and select draw the same ring.

### Inputs / Fields

Restyled in Phase 12 as signage rows.

- **Style:** underline fields: transparent on black, no top or side border and no side padding, a 1px Wire Grey bottom rule, Lamp White text (16px below 768px, 15px from 768px). Inputs are 44px tall, 8px under their label line (6px on a phone). The message box is fixed at 112px (80px on a phone) and scrolls inside.
- **Labels:** each sits on a 16px line in Field label type, after its `aria-hidden` number (01 to 04). A label that wraps (200% zoom, a landscape phone, text spacing) grows its line and pushes its field down, never over it.
- **Service chips:** "Service needed" is a native radio group (a `<fieldset>` with `role="radiogroup"`), its four services as square chips: 40px tall, 10px side padding (12px on a phone), 6px apart, a 1px Wire Grey border and Lit Grey Field label text, lighting to Lamp White on hover. The chosen chip turns Lamp White (border and text) with a 6px Lamp White dot before its text. On a phone they always sit two by two. Tab reaches the group once, and the arrow keys move and choose.
- **Focus:** the border turns Lamp White and the 3px half-strength Lamp White ring appears; a focused chip takes the ring. In forced colours focus is a 2px outline.
- **Error:** monochrome. `aria-invalid` switches the bottom rule to half-strength Lamp White and adds a 3px ring at 40%; an invalid chip group's borders turn half-strength (dashed in forced colours, and an invalid field's rule turns 3px). The message sits below the field after a warning glyph, with `role="alert"`, and its wording carries the meaning.

### Scroll Cue

Cue type in Dim Grey with a 14px down-right arrow. It lifts in (16px, 0.6s) 0.3s after the intro settles, and invites the scroll that drives the morph.

## Do's and Don'ts

### Do:

- **Do** give every screen one dot object and one statement (FAQ's numbered questions stand in for its statement), and keep everything else quiet signage.
- **Do** open every section from Projects to Contact with the section label `<h2>`.
- **Do** keep every public section on plain Unlit Black (#000000) and express hierarchy through brightness steps: Lamp White, Lit Grey, Dim Grey.
- **Do** set the name, statements, titles and numerals in Antonio 700 uppercase and everything else in Geist.
- **Do** track out uppercase Geist (0.025em for labels, 0.08em for items, 0.14em for the lede, 0.22em for cues). The Antonio section label takes 0.04em.
- **Do** draw ideas in dots and frame real things with dots.
- **Do** let the scroll trigger a step and let it play by itself.
- **Do** keep a real, readable `<h1>` behind the dot field, and real text behind the footer's sign, and mark only decorative leaves `aria-hidden` (or a visual duplicate of text that stays exposed, like a list's visible numbers).
- **Do** route every motion through the reduced-motion preference. The dot field checks it separately, because it is not a `motion` component.
- **Do** square corners through the `--radius` token rather than by editing vendored components.
- **Do** match B1 when unsure how something should look.

### Don't:

- **Don't** introduce an accent hue, gradient, tinted surface or background texture. The palette is white at different intensities on black.
- **Don't** use a border radius anywhere. The only round things are dots, rings drawn in dots, and the cursor's ring.
- **Don't** use shadows or raised cards. Brightness, not elevation, brings things forward.
- **Don't** put readable text in Ghost Grey (#737373). It fails AA at body sizes.
- **Don't** outline anything interactive in Rule Grey. It is for dividers.
- **Don't** fill a surface with Lamp White unless it is an action (the Contact action, the submit button).
- **Don't** put two statements on one screen, or set a section's name in big type (the arrival title is the one exception, and it docks before the dots land).
- **Don't** render a real thing (a photo, a project image, a logo) in dots, or shrink a dot object into a corner.
- **Don't** hold the scroll, or give a section a new content effect outside the light sweep, the pen draw and the desktop copy drift.
- **Don't** let the public page follow the OS light or dark scheme.
- **Don't** lift copy, layouts or components verbatim from the reference sites, or design a section against one.
