# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A one-owner portfolio: a single public scrolling page (dot-matrix WebGL hero + contact form) and a password-protected owner dashboard with a live content editor. Everything runs locally (Next.js + Supabase in Docker); nothing is deployed.

Read before working:

- `AGENTS.md`: this is Next.js 16.3.4, which differs from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.
- `PRODUCT.md` (audience, positioning, what must not be fabricated) and `DESIGN.md` (visual system) before any UI work.
- `plans/handoff.md`: the redesign in progress. It covers the current phase, the owner's decisions, the fixed-canvas architecture and the DOM contract every dot scene follows.
  - Rationale for the earlier hero, quote, burst and editor work is in `git show 0a3c97a:plans/handoff.md`.
  - The full Phase 1–3 notes (Parts 0–4, the reviews, and the Services thread and orbit) are in `git show 0f198b2:plans/handoff.md`.
  - Each phase ends with the prompt for the next conversation.
  - The other plans in `plans/` are finished history, not open work.

## Commands

```bash
pnpm supabase:server   # start Supabase in Docker (Docker Desktop must be running); prints URLs, never keys
pnpm db:status         # full status JSON, including the keys for .env.local
pnpm dev               # http://localhost:3000 (runs webpack on purpose, see Gotchas)
pnpm check             # format:check + lint + typecheck; run before committing
pnpm typecheck         # next typegen && tsc --noEmit; tsc alone skips route types
pnpm build             # production build (Turbopack)

pnpm test:unit                                  # Vitest + jsdom, tests/unit/**
pnpm test:unit tests/unit/hero.test.tsx         # one file
pnpm test:unit -t "renders the fallback"        # by test name
pnpm test:e2e                                   # Playwright, tests/e2e/**
pnpm test:e2e tests/e2e/hero.spec.ts            # one spec
pnpm test:e2e -g "contact"                      # by title

pnpm db:reset          # replays migrations; DESTROYS local data, including auth.users
pnpm db:types          # regenerate src/types/database.type.ts after a migration
```

- **Unit tests** need no Docker. `vitest.config.ts` injects a synthetic environment because env modules validate at import.
- **e2e tests** need Supabase running.
  - Playwright runs `pnpm build && pnpm start`. But if anything is already on :3000 (e.g. `pnpm dev`), it silently reuses that server instead.
  - Stop the dev server for a run that really exercises the production build.
- **Home page without Docker:** `/` still renders with Supabase down. `readPublishedContent` falls back to the seed defaults.

## Architecture

**Layout.** Feature code lives in `src/features/<feature>/`: `components/`, `hooks/`, `server/`, `services/`, `schemas/`, `stores/`, plus `*.rules.ts` for pure logic. File names carry their role as a suffix: `.component.tsx`, `.hook.ts`, `.service.ts`, `.router.ts`, `.schema.ts`, `.rules.ts`, `.store.ts`, `.data.ts`, `.type.ts`, `.provider.tsx`. `src/components/ui/` is vendored shadcn output. Do not hand-edit it; change tokens in `src/app/globals.css` instead.

**Data path.** tRPC 11 + TanStack Query:

- Each feature has a router in `server/*.router.ts`. They are composed in `src/server/trpc/app.router.ts`.
- `baseProcedure` is public. `ownerProcedure` requires a Supabase session.
- Server components call procedures through `caller` from `src/server/trpc/trpc.server.ts` and pass results down as props.
- Client components use `useTRPC()` with `useMutation`.
- Routers translate errors to `TRPCError` and pass `ctx.requestId` to services **as an explicit argument**; services never import the context.
- Services log with `logError({ event: "feature.verb_past_tense", requestId, details, error })`. The logger in `src/server/logging/` redacts keys, tokens and personal data.

**Auth and data security.**

- Supabase via `@supabase/ssr`. `src/proxy.ts` is Next 16's middleware: it lives inside `src/` and exports `proxy`.
- Server-side identity uses `getClaims()`, never `getSession()` or `getUser()`.
- Public signup is disabled, so `authenticated` _is_ the owner. There is deliberately no owners table.
- Nothing is granted to `anon`. The public page reads content, and the contact form writes messages, **server-side through the admin (secret-key) client**.
- The `(owner)/dashboard` layout redirects anonymous visitors. Both auth layers are path-based, so owner-only routes (including the editor preview) must stay under `/dashboard/`.

**Site content: draft/publish.**

- `src/features/site-content/schemas/site-content.schema.ts` is the single source of truth for content shape, write validation, TS types and editor fields.
- Content is stored in a singleton `site_content` row with `draft` and `published` columns. Primitive defaults live in `src/data/site-content.data.ts`, and `createDefaultSiteContent()` composes them. A missing or invalid record degrades to defaults, never a crash.
- `SitePage` renders the whole public page from a `SiteContent`. The same component runs in `/` and inside the editor's iframe (`/dashboard/editor/preview`), so there is no duplicate "editor version" of the site.
- The editor updates the preview over `postMessage` within about 80ms and autosaves the draft separately after about 800ms. Keep those paths independent. Publish promotes draft to published and calls `revalidatePath("/")`.
- The published read is never cached: the admin client fetches with `cache: "no-store"` and `/` exports `dynamic = "force-static"`, so `/` stays prerendered, every build reads fresh content, and a publish's `revalidatePath("/")` refreshes it at runtime (Phase 11). Don't tag it instead: tag state lives in memory, so a fresh `next build` replayed the year-old cached document anyway.
- The preview uses a `ready` handshake. The iframe posts `ready` once its listener is attached, and the editor answers with the current content. Never post from the iframe's `onLoad`: it fires before hydration and the message is dropped.
- Rich text is Tiptap JSON. The schema allowlists node and mark types, and those must match the extension list in `rich-text.extensions.ts`: `generateHTML` throws on anything unknown. Change both together.
- `SitePage` renders the tagline to HTML (`renderRichTextHtml`) and passes `taglineHtml` to the client `Hero`. On `/` SitePage is a server component, so Tiptap and the site-content schema stay out of the public bundle (Phase 11: 122 KB gzipped). Never call the renderer from a client component the public page imports.

**Hero dot field** (`src/features/portfolio/`). The full architecture and the DOM contract are in `plans/handoff.md`.

- **How it works:** raw WebGL2, no three.js or ogl. The sampler (Canvas2D) rasterises the name in Antonio and samples a dot grid. The renderer and GLSL in `shaders/` draw it. `dot-field.rules.ts` is the pure, unit-tested layer.
- **One fixed canvas:**
  - `Hero` renders the one opaque canvas inside a `fixed top-0 h-lvh -z-10` layer. It is always exactly the viewport, so no dot is ever clipped at a section edge.
  - SitePage's wrapper is the stage: `isolate`, the named group `group/stage`, `data-status` and `data-scene`. The hook finds it with `canvas.closest("[data-status]")`.
  - Nothing between the wrapper and the canvas may form a stacking context. That rules out `isolate`, `z-index`, and transform, opacity or filter animation. The canvas must never sit inside a sticky element.
  - Keep **exactly one `<canvas>` and one `[data-status]`**; the e2e specs use strict locators.
- **Scenes and timeline:**
  - Every section belongs to a `[data-dot-scene]` container, with shapes in `data-dot-shapes`.
  - A formed shape lives only in a pinned `[data-dot-slot]` inside the container's first child, a sticky frame. Dust scenes have no slot and fill the viewport.
  - Pinned layouts choose by height as well as width with the `split`, `short` and `staged` variants in `globals.css`, never `md:`.
  - Frames that can grow use `min-h`. Fixed-height copy boxes (the Services captions, the How I work step boxes, the project cards and the Contact frame) go through `SceneFitGate`, which drops the scene to dust when the copy can't fit. See DOM contract rules 12–14 in `plans/handoff.md`.
  - **Contact is gated, not grown.** Its gather needs the whole form in one pinned frame, and a grown frame would hide the submit button for the length of the pin. So the frame is fixed-height and joins the gate: most phones, landscape phones, 400% zoom and text spacing flow it as a plain section. The gate also watches the slot, so error messages that outgrow the frame flow it too, and when its switch moves a focused field, it scrolls by the same amount so the field stays put.
  - **How I work's orbit is triggered like Services (Phase 8).** `process` is a thread scene in `DOT_SCENE_MOTION`. The hook writes the dots' own position in the scene as `--thread-turn` on the orbit's container, the one thread scene with `hasTurn` in `DOT_SCENE_MOTION` (`resolveThreadTurn`: the step index, eased on the signal ease between steps, from −1 on the flight in to the last step). The `orbit-step` utility turns it into each step's `rotate` about the circle centre far below the frame, `--orbit-assemble` (the digits' assemble and the title's sweep; 1 from one step before the step arrives, so both neighbours wait assembled on the rim) and `--orbit-lit` (the numeral and title brightness, and the body's sweep; 1 only while the step is formed). Both are capped by the scene's `--scene-lit`, so the wheel's copy and numerals leave with its dots instead of staying lit through the exit while the flight streams through them (Phase 11). No turn, reveal or digit animation runs on the scroll timeline or a clock. Only the ring's dots drift with the scroll, by `stroke-dashoffset` on the container's `--screen` view timeline (`orbit-spin`); the ring is one round-capped circle dashed `0 10px` in px, from the ring's top to the frame's foot, never a rotated layer.
  - **The orbit is a centred wheel (owner, Phase 8; DESIGN.md's Wheel Rule).** At every width the frame stacks on the centre axis like a phone: the label top-left, the slot centred (as wide as the content, at most twice its height), the numeral on the top of the ring (`cx` 50%), and the title and copy under it. `--orbit-numeral` sizes from the height; `--orbit-copy` budgets the longest step (a title line and three body lines; two title lines on a phone, one 32px line on a `short` phone); the slot's height `--orbit-slot` is what the step leaves, up to `--orbit-slot-max`, and the slot drops the numeral box's 0.078em overhang from it so it ends above that box; and `--orbit-step-top` puts the step right under it, so the longest step ends one `--screen-bottom` above the frame's foot. `--orbit-spacing` is `max(50vw, 36rem)` from `split` (the neighbours wait half in view at the edges, and a neighbour's title never meets the active one) and 115vw on a phone (off screen); `--orbit-curve` keeps the radius a fixed multiple of it, so the step angle is one division by a number.
  - **The orbit's step box is identical staged and unstaged** (slot rect, container height, each step's height and width). The numeral carries `contain: layout`, so its digits' assemble transforms are ink overflow and never count as copy that doesn't fit: without it the gate's staged re-checks (on resize or font load) flowed How I work on wide screens 900–975px tall (Phase 7 fix). Any animated decoration inside a fit box needs the same. The hook and the gate measure while the stage is still `idle`, and nothing re-measures when `running` switches `staged` on. Custom properties are namespaced `--orbit-*`; never redefine `--radius`, the token behind every `rounded-*`.
  - **Projects, Services and How I work are triggered, not scrubbed.** Between two thread keyframes of the same scene (`DOT_SCENE_MOTION` `isThread`; `isThreadSegment` checks the keyframes' `scene`), `resolveTriggeredTarget` commits the target to the next or previous keyframe once the scroll passes `threadTrigger` in that direction, and `followTriggeredProgress` plays it over `threadDrawSeconds`. When a fast scroll has already committed past the next keyframe, the play hurries through the one in between (`threadHurrySeconds`, in proportion to how far behind it is), so a fast scroll never skips or teleports a drawing. The hook publishes the committed keyframe's id as the stage's `data-thread`. It also writes each thread keyframe's reveal as `--reveal-<keyframe id>` on the thread scene's container every frame it changes (`resolveThreadReveal`: 1 while the dots form that keyframe, eased to 0 half a hop away, from the dots' own progress `p`). The captions, the deck's cards and the labels' position counts read it as `--caption-reveal` through literal selectors in globals.css, and `caption-line` turns it into each line's sweep. So text, dots and scroll can't drift apart: never drive the captions with a timer or a CSS transition again (owner, Phase 7). A crossing between two thread scenes (Projects into Services, Services into How I work) stays a scrubbed flight, because both frames are moving then and a shape played ahead of the scroll would hang at the next pinned slot over the outgoing copy (Phase 8).
  - **Keyframe ids and the redraw (Phase 9).** A multi-step keyframe's id is its shape (`branding`, `listening`…), unless its scene repeats that shape: then it is `formatSceneStepId(scene, index)` (`project-1`, `project-2`…), so the deck's `frame frame frame` gets three ids (`buildDeckShapes`: `frame` once per visible project). A one-shape scene keeps the scene's id (`project` with one visible project), and it is not a thread keyframe. `data-scene`, `data-thread` and the `--reveal-*` names all use these ids. Between two thread keyframes of one scene with the same shape (`isRedrawSegment`: `isThreadSegment` plus equal shapes, so the deck redraws while Work's last frame still flies to About's) the shape redraws in place: `uRedraw` 1 drops the flight, and the vertex shader unwinds the shape in pen order over the first half of the hop and redraws it in pen order over the second, by opacity alone, with a `redrawEdge` soft edge. A hop back plays it in reverse. With `uRedraw` 0 the maths is unchanged. The deck's `[data-caption="project-k"]` selectors in globals.css are literal and go up to `PROJECTS_MAX` (6): add one whenever it grows.
  - **Every section's text sweeps with the dots (Phase 10).**
    - The hook writes `--scene-reveal` on every `[data-dot-scene]` container each frame it changes. It comes from `resolveSceneReveal` over `resolveRevealRange`: 1 across the scene's keyframes, easing to 0 half a hop outside. Two kinds of scene stay lit through the transit after them, so their lines never wipe out under a reader:
      - a scene with no slot (the FAQ's dust, an emptied deck);
      - a pinned frame that grew past the viewport under rule 12 (`isGrown` on its keyframes: the quote, About or Testimonials on a landscape phone, at 400% zoom or with text spacing). Its lower lines only come into view after its pin.
    - globals.css maps it through `--scene-lit` to `--caption-reveal`. `--scene-lit` is 1 while anything in the scene has `:focus-visible`.
    - The `swept:` variant then applies `caption-line` to each section's label word, statement and copy lines, the About stats row, the FAQ rows and the footer bar. The variant needs motion allowed (the OS setting and the page's pause), a running stage and no `[data-fit]`; unlike `staged:` it needs neither scroll-driven animations nor 30rem of height.
    - Number the lines with `buildLineStyle`. Every scene container that holds swept lines needs `buildSceneCaptionStyle(lastLine)` (step scenes use `buildThreadCaptionStyle`): `--caption-stagger` has no default, so without it nothing sweeps. `lastLine` matters from four lines on, because `--caption-last` defaults to 2. A label sweeps only its heading word, in a span, so the `h2` box never moves.
    - A line that is or holds `:focus-visible` drops its clip and slide. The clip leaves a full line above and below, so a padded link keeps its tap area.
    - The About counts are a CSS counter (`stat-count`, `@property --stat-count <integer>`) on the stats row's line reveal: an `aria-hidden` overlay over the real value, which stays in the DOM and goes transparent only while swept. The overlay draws the number in `::before` and pins the suffix in an absolutely positioned `::after` at `inset-inline-end: 0`, so each `dd` must stay `relative w-fit`. One `::after` holding both moved the suffix each time the count gained a digit, which is a layout shift.
    - Never drive section text with `whileInView`, an observer or a timer again.
  - **Section titles arrive big (owner, Phase 11).**
    - Every section label is bold Antonio (`SECTION_LABEL_CLASS`: 18px, 20px from 768px, in the same 16px line box). Each titled scene container (all but FAQ, whose statement already says "FAQ") carries `swept:section-title`, and its label word carries `section-title-word`.
    - `section-title` animates two registered numbers on the container, from its own `--screen` timeline, so the whole scene inherits them. `--title-hold` is 0 until entry 38% (the outgoing section's text has wiped out by then), rises to 1 by entry 44% (the big word sweeps in, alone) and stays 1 until exit 0%. `--title-grow` is 1 until entry 68% and eases to 0 by entry 90%. The fill is `forwards` only, so a section not reached yet has both at 0.
    - The scene waits for its title: `[data-dot-scene]` sets `--title-gate: clamp(0, 1 - 3 · --title-grow, 1)` and folds it into `--scene-lit`, and every literal step reveal (`--reveal-*`) is `min(…, var(--title-gate, 1))`. So a section's statement, copy, plates and step captions sweep in only once its title has nearly docked, as the dots land. That was the owner's call ("it should take time for the title to emphasise it"), after rejecting two earlier timings: a title big from the start of the transit (it overlapped the old section's text and the flight), then one that shrank as soon as it arrived.
    - A black text-shadow halo (`--title-halo`, the page background at `--title-grow` strength) clears the flying dots off the big letters and fades out as the title docks. It is black on black, never a lift.
    - The word scales by `1 + grow · (title size / 1em − 1)`, where the title size is `min(8rem, 17cqi, 14svh)` against the `h2`'s own `@container` and `tan(atan2(a, b))` divides the two lengths. It is `scale` from the bottom-left corner, never `font-size`: a font-size change slid the position count along the line, which is a layout shift, and a word growing downward covered the arriving plate. So the big title fills the gap between the old frame's bottom inset and the new frame's top inset.
    - The word's `--caption-reveal` is `max(--scene-lit, --title-hold)`: it stays whole while it arrives, then wipes out with the dots as the section leaves. A count (`section-title-count`) is hidden until the word is docked.
    - The `h2` stays 16px tall and its `@container` gives it layout containment, so the big word is ink overflow: it never moves anything or reaches a fit box's `scrollHeight`.
  - **Copy drift (Phase 10).**
    - Every labelled scene container, and the quote, carries `screen-timeline`: a `--screen` view timeline with a 4.5rem inset. The copy drift, the section titles and the orbit ring's drift all read it.
    - Their copy column carries `copy-drift`. Its direct children animate `transform` by up to `--copy-drift` (40px) as the section enters and exits, from 48rem and with motion allowed. The drift is exactly 0 while pinned, because the keyframes sit on the entry and exit range boundaries of the section's own timeline. A `view()` timeline on the pinned copy itself keeps moving through the pin.
    - Never use `translate` for it: `caption-line` owns that property.
    - `copy-drift` also gives its column `contain: layout` in every mode, so the children's transforms are ink overflow and never reach Contact's fit-box `scrollHeight`. The column's `@container` (`inline-size`) contains nothing: without the containment, a large drift flows Contact on the next gate check.
  - **No lock (Phase 7).** A commit only plays the drawing; nothing holds or moves the scroll, so a fast scroll carries on and the next trigger takes over. The glide lock (`DOT_THREAD_COMMIT_EVENT`, Lenis `lock: true`, the phone `overflow: hidden` glide and the wheel-gesture hold) is gone; never bring back a scroll hold. Never key the captions on `data-scene`; no CSS keys on `data-scene` today. `staged` needs scroll-driven animations, motion allowed (not reduced, not paused), height over 30rem, a running stage and no `data-fit`; everything else gets the Phase 2 layout.
  - **Services' B layout.** The frame is the statement split (`SCREEN_CLASS` columns): the label with its position count, and the slot on the right (5:4, 600×480 at 1440) or above the copy on a phone (at most 280px wide). The caption board sits in the left column under the label, or at the foot of a phone frame. Its geometry comes from the container's `--caption-top` and `--caption`, and `SCREEN_INSET_CLASS` repeats `SCREEN_CLASS`'s paddings as `--screen-top` and `--screen-bottom`: change both together (`step-motion.spec.ts` checks the board sits one row gap under the label). Phone caption heights are tiered on `--caption-stacked`, which `split` never reads, because a `short:` value would otherwise override split's formula on landscape phones.
  - Use the `view-timeline-name` and `view-timeline-inset` longhands: the `view-timeline` shorthand resets the inset and starts the ring's drift 72px late.
  - A dust scene ends one viewport before its container does. The viewport height is the shortest pinned frame plus its sticky top (`resolveViewportHeight`). Every frame is at least one viewport tall and the hero's is exactly one, so a frame that grows under rule 12 never moves a dust boundary.
  - `buildSceneKeyframes` turns the measured scenes into keyframes. `resolveTimelinePosition` maps `scrollY` to one position `p` (keyframe index plus transit progress), which the loop follows with `followTriggeredProgress`. It never snaps: the hook snaps `p` only when one scroll event moves the target more than one segment (a nav jump, a scrollbar drag), so a jump doesn't flash through every shape.
  - The stage's `data-scene` is the formed keyframe id or `moving`.
- **Shapes:**
  - The name stays on attribute 0, pixel-identical to the pre-timeline build at rest.
  - Every other shape comes from `buildShapeLibrary`: seeded, at its tuned `pointCount` (12,000 for the drawings; the cube keeps its reference 7,200). Each is padded to the point total and uploaded once into its own buffer, and the padding is hidden. Attributes 2 and 3 (`aFrom` and `aTo`) are re-pointed at the right buffers when the keyframe pair changes.
  - Line-art shapes are layers of strokes (`LINE_ART_SHAPES`), each placed with an offset and a scale, so the pages share their strokes. `listening`, `delivery` (a page plus its launch trail) and `gather` are seeded point generators. Every generator keeps pen order. The model is y-up; the handoff's sketch geometry is y-down.
  - A `fill` shape with a slot (`frame`, `gather`) frames it `resolveFrameOutset` outside (18px, or 5% of the short side when that is less); dust has no slot and fills the viewport. `staticYaw` is the resting pose with or without motion.
  - `resolvePlacement` gives each keyframe a centre, half-size, rotation, camera and visible-rank threshold. The shader mixes from to with the staggered sweep and arc, then adds the spring offsets.
- **Coordinates:**
  - Name homes stay in the bleed box's local device px. The name placement's centre is rounded to whole device pixels.
  - One pixel ratio from `resolveCanvasPixelRatio` feeds the canvas, the sampler and the pointer. The canvas CSS size is derived from its rounded backing size.
- **Blending:** dimness is opacity, not darkness, under source-over. Don't switch to MAX blending: it darkens the wordmark's seams.
- **Tuning:** every tuning number lives in `src/data/hero.data.ts` (`DOT_FIELD_MORPH_TUNING`, `DOT_SHAPE_TUNING`). Tune there and nowhere else.
- **Two effects in `use-dot-field.hook.ts`; never merge them.**
  - One owns the GL context and animation loop, with stable deps (`[canvasRef, wordmarkRef, taglineRef, mode]`).
  - The other resamples geometry on `[text, fontFamily]`. Merging them recreates a WebGL context on every editor keystroke.
  - A third, tiny effect applies `dotColor` as a uniform; never put `dotColor` in the GL effect's deps, or a colour edit blanks the field.
- **Physics:**
  - Each dot is a damped spring (`stepDotPhysics`), stepped on the CPU and streamed to attribute 1 as offsets.
  - The pointer (canvas device px) pushes only while a slotted shape is formed. Homes come from `writeNameHomes` or `projectShapePoints`, which repeats the shader's maths.
- **Loop:**
  - The RAF loop sleeps once the dots are at rest, `p` has reached its target, the intro has settled, and no spinning shape (the cube, a swaying Services stage) is formed or in transit (`shouldLoopSleep`). How I work, the frames, the gather and the dust are still, so the loop sleeps there.
  - Scroll, pointer and resize input restart it. `visibilitychange` stops it.
  - There is no IntersectionObserver, because a fixed canvas is always on screen.
- **No `useState` in the hook.** Status goes out as DOM attributes (`data-status`, `data-scene` and `data-thread` on the stage, `data-point-count` on the canvas), which CSS and the e2e specs key off. (`data-push-radius` fed the cursor's push ring, which the owner removed in Phase 11.)
- **Font gate:** it must check only the primary family (`Antonio`), because `Antonio Fallback` (metric-adjusted Arial) always reports as loaded. Use `document.fonts.load()` followed by `check()`; `fonts.ready` alone is not enough.
- **Fallbacks:**
  - No WebGL2 (or a lost context) falls back to the text `<h1>`. Slots hide and scene containers drop their pin height.
  - Reduced motion never starts the loop, and nor does the page's pause (`prefersReducedMotion()` is the OS setting or `html[data-motion="paused"]`). It draws a keyframe only while the scroll is inside that keyframe's pin range, and clears the canvas between scenes. `onMotionPreferenceChanged` switches between the loop and this path both ways at any time.
  - There is no viewport gate; phones run the dots.
  - `aria-hidden` goes on decorative leaves only: the canvas, the empty slots, the orbit ring, the step numerals, Work's window rings, the nav dot and the scroll-progress hairline. The other exception is a visual duplicate of text that stays exposed: the FAQ statement (the label `<h2>` carries it), the later Projects labels, a label's position count (the list carries it) and the About stat overlays (the real value underneath carries it).

**Other.**

- **Sections:** every screen below the hero but How I work is the B statement split, built from the `SCREEN_*`, `STATEMENT_*`, `SECTION_LABEL_CLASS` (bold Antonio since Phase 11), `BODY_CLASS`, `TITLE_CLASS` and `CUE_CLASS` constants in `src/data/page-sections.data.ts`. How I work is the one exception, a centred wheel built from its own `--orbit-*` geometry; only the hidden Blog still uses the older `SECTION_HEADLINE_CLASS`. The service names use their own statement sizes (`service`, and `longWord` for "Development").
  - Statements size from their column (`@container`, `cqi`) with a rem term and an svh cap. Check the widest word against its column at the fit sizes after changing a factor.
  - Projects is a deck (Phase 9), one card per visible project in an `<ol data-deck>`, the container's second child. The pinned frame holds only the slot, at the plate's rect, and the container is `--steps` frames tall. The slot is `pointer-events-none`, like Contact's: a plate is clipped away mid-hop, and a pointer that reached the slot then would scatter the next frame and keep the loop awake (frames never scatter; owner, Phase 6). The first card's label is the section `<h2>`; later labels are `aria-hidden` duplicates.
  - **Staged,** the `<ol>` is the board: sticky at `top-18`, one frame tall and `pointer-events-none`, with every card stacked in one grid cell. Each `<li>` carries `data-caption="project-k"`, so `--reveal-project-k` sweeps its label's count and its caption lines (`caption-line`: the title, the summary, the tag and stack row) and wipes its plate (`plate-sweep`, a clip-only wipe with no slide). The later labels' "Work" is `inline-block staged:invisible`, so only the count changes (an atomic inline, or its forced-colours backplate blanks the `<h2>`'s "Work" under the stacked cards). Only the swept lines and the plate take pointer events, and clip-path clips hit testing, so a hidden card never takes a hit.
  - **Unstaged,** the same `<ol>` is the Phase 5 list: one screen per card, each one frame tall, sliding past the pinned slot. On a phone each screen is full-bleed, `isolate` and `overflow-clip`, and a ring 24px round its plate spreads the background colour over the rest of the screen (`PROJECT_PLATE_WINDOW_CLASS`, hidden when staged). The pinned frame therefore shows only round the plate passing it, and copy never crosses its dots. Forced colours drop `box-shadow`, so those screens turn opaque there instead, unless staged.
  - The title is the link when a project has an https one (`PROJECT_TITLE_LINK_CLASS`). Its `::after` carries the hit area, the focus ring and the forced-colours focus outline: over the whole card in the list, over the title only when staged. Nothing focus-related goes on the link itself, because the title's sweep clips its left edge. The keyboard rule (owner, Phase 9): while a link in the deck has `:focus-visible`, every card's `--caption-reveal` is 0 but the focused card's, which is 1. So tabbing onto a hidden project's link brings it onto the board, and the scroll takes over again once focus leaves. Hidden links stay in the tab order and the reading order.
  - Each card is a fixed-height `[data-fit-box]` (`PROJECT_CARD_CLASS`), so a title or text that can't fit flows the deck through the gate to a reading list over dust (`unpinned`: the container is `auto` and the cards grow from a one-frame minimum). With one visible project there is no deck: its `<li>` has no `data-caption`, so the card follows the scene's `--scene-lit` like any section's copy. With none the scene has no slot and falls back to dust.
  - FAQ is the dust scene's only section, one frame tall (rule 10), and the dust is invisible (owner, Phase 6).
- **Header (Phase 10):**
  - A scroll-spy owns `activeSection`. It runs `resolveActiveSection` (`navigation.rules.ts`) in the scrollY handler, measuring each section against its own computed `scroll-margin-top`, so a larger browser font still marks the right section. Clicks only close the menu. Never resolve during render: it would be a hydration mismatch.
  - The nav dot is a `motion.span` with `layoutId` rendered only in the Primary nav. A second copy with the same `layoutId` in the mobile panel breaks the slide.
  - The scroll-progress hairline is CSS only (`scroll-progress`, `animation-timeline: scroll(root)`, longhands: the `animation` shorthand resets the timeline).
  - The mobile panel wipes open with `@starting-style` (`MOBILE_MENU_WIPE_CLASS`). Its clip-path clips hit testing mid-wipe, so a test must wait for `inset(0px)` before it wheels the panel.
  - The right zone is one wrapper (`HEADER_ACTIONS_CLASS`, the grid's column 3): the pause toggle, the Secondary nav ("Let's talk", from 1024px) and the menu button (below 1024px). One toggle serves both widths; "Let's talk" stays the last header tab stop.
- **Pause motion (owner, Phase 11; WCAG 2.2.2):**
  - The page's pause is `html[data-motion="paused"]`. `setMotionPaused` writes it, stores it in `localStorage` (`MOTION_PAUSED_STORAGE_KEY`) and dispatches `MOTION_PREFERENCE_EVENT` on `window`. A `beforeInteractive` script in the root layout restores it before hydration; Next queues it in `__next_s`, so it runs after the first paint but before any effect or `MotionConfig` reads it.
  - Paused means exactly reduced motion. `prefersReducedMotion()` includes it; every listener uses `subscribeMotionPreference` (the media query's `change` plus that event), never the media query alone; `MotionConfig` goes to "always"; and CSS excludes `[data-motion="paused"] *` from `staged`, `swept`, `copy-drift` and smooth `scroll-behavior`, and redefines `motion-safe`/`motion-reduce` with `@custom-variant`. A new motion rule must honour both.
  - `MotionToggle` is a square ghost button named "Pause motion" or "Play motion" (no `aria-pressed`), hidden under the OS's reduced motion and without scripting. Its label reads `useIsMotionPaused` (false on the server, so hydration matches); the hero and `MotionConfig` read `usePrefersReducedMotion`, which is the real value from the first client render.
- **The adaptive cursor (Phase 10):**
  - `AdaptiveCursor` is mounted only in `src/app/page.tsx`, outside the store provider.
  - Three states: the idle pair (a 6px dot and a 36px ring), the 56px filled disc over links, buttons and FAQ questions, and hidden over fields. Over the dots the ring stays the idle ring (owner, Phase 11: the ring that grew to the push radius was "a giant circle").
  - It attaches listeners only where `supportsCustomCursor()` holds (a fine pointer and forced colours off), and stays hidden until the first mouse pointer event. That event sets `html[data-cursor="on"]`, and globals.css then hides the native cursor, fields excepted.
  - It is a fixed, `pointer-events-none` `div`, rendered on the server as `data-cursor-state="hidden"`.
  - Motion's frame loop captures `requestAnimationFrame` at load. A RAF counter installed after load never sees the cursor's springs (or any Motion animation), so install counters with `addInitScript`.
- **No JavaScript:** Motion writes `initial` styles into the server HTML. Every Motion element whose content must show without JavaScript carries `data-reveal`, and `@media (scripting: none)` resets its opacity, clip-path and transform. The cursor starts at opacity 0 and deliberately carries no `data-reveal`. Swept text needs no tag: `swept:` only applies on a running stage. The copy drift is plain CSS and still runs without JavaScript; it hides nothing.
- **Contact success (Phase 10):**
  - The form stays mounted and turns `invisible`. Never remount, key or `reset()` it: `renderedAt` is the two-second check.
  - The acknowledgement shares the form's grid cell, so nothing shifts, and takes focus through a module-level callback ref. An inline ref would re-focus it on every re-render, including the editor preview's.
  - The form is `method="post"`, so a submit without JavaScript never puts the fields in the URL. Never give it a multipart `encType`: Next answers a multipart POST to `/` with a 404 "Server action not found".
- **Env:** `src/config/env.server.ts` / `env.public.ts` validate at import and fail fast. They reject legacy `eyJ…` Supabase keys.
- **Email:** `EmailAdapter` has only a preview implementation, which writes HTML to `.local/email-previews/`. Nothing is sent.
- **Global UI state:** `@tanstack/react-store` (`useSelector`, not the deprecated `useStore`).
- **Smooth scroll:** core `lenis` 1.x (never `lenis/react`, never 2.x), mounted by `SmoothScroll` in `src/app/page.tsx` only, so the editor preview and the dashboard never get it.
  - It runs only for fine pointers and without reduced motion or the page's pause. Its own RAF loop sleeps when Lenis stops smoothing; keep it separate from the dot hook's loop.
  - It owns every in-page anchor scroll. It scrolls the real window, so never give it a wrapper element or import `lenis/dist/lenis.css`.
  - Never add `scroll-padding-top`: focus clearance comes from `scroll-mt-18` on each focusable (DOM contract rule 9).
  - Nested scrollers opt out with `data-lenis-prevent`. Never scroll programmatically on mount; a long programmatic scroll goes through an in-page anchor click so the timeline snap is set.

## Code conventions (the user enforces these)

- **No explanatory comments** anywhere, GLSL included. Rationale goes in docs or `plans/`. Vendored `src/components/ui/` is exempt.
- **No single-letter names**, including callback parameters, loop indices and imports (tRPC's `t` is written `trpc`).
- **No dense one-liners or chained higher-order functions.** Use explicit `for...of` over `reduce` or `.filter().map()`. No nested ternaries and no `??=`. `.map()` in JSX is fine.
- **All types go in `src/types/`, all static data and constants in `src/data/`.** Never define them inline in a feature file. Exception: GLSL sources live in `features/portfolio/shaders/`.
- **Callbacks are named function expressions** (`useCallback(function markSettled() {…})`), not arrows.
- **Named exports only**; `export default` is for Next route files.
- **Prettier:** no semicolons, double quotes, 80 columns.
- **Server-only files** start with `import "server-only"`.
- **React Compiler lint rules are errors:** `set-state-in-effect`, `refs` (which also fires on _passing_ a ref-reading function during render), `purity` and `immutability`.
- **React Hook Form:** use `form.subscribe` / `useWatch`, not `form.watch()`.
- **Zod 4:** use `.prefault({})`, not `.default({})`, for nested objects whose fields all have defaults.

## Gotchas

- **`pnpm dev` passes `--webpack` on purpose.** Turbopack's dev server hits `EPERM` renaming `.next` manifests on Windows, so every route after the first returns 500.
  - Don't remove the flag, and don't re-diagnose this as antivirus.
  - Stop the dev server with Ctrl-C, never `taskkill /F`, which leaves locked handles on `.next`. If it happens anyway, delete `.next`.
- **ESLint is pinned to 9.** ESLint 10 crashes `eslint-plugin-react`.
- **`cn()` drops a line height that comes before a font size.** `cn("leading-[0.95]", "text-[…]")` keeps only the size, because the merge treats a font size as overriding line height. Put the line height on the size utility (`text-[…]/[0.95]`), as `STATEMENT_SIZE_CLASSES` does.
- **`next build` without Supabase bakes in the seed defaults.** The read is uncached (see Site content), so a build with Docker down prerenders `/` from the defaults until the next publish or build.
- **`/* turbopackIgnore: true */`** in `email-preview.adapter.ts` is a bundler directive, not a comment to delete: without it Turbopack traces the whole project into the tRPC route.
- **Never write a secret-shaped literal in a test,** even a fake one. GitHub push protection blocked a push once. Build fixtures from parts: `` `sb_secret_${"0".repeat(32)}` ``.
- **e2e state:**
  - `tests/e2e/hero.spec.ts` asserts the published hero name is `Criztian`. Never leave a test value published; `editor.spec.ts` restores the name.
  - Logged-in specs create and delete a throwaway user via the admin API (`tests/e2e/owner-account.ts`). The owner's password is never needed; don't ask for it.
  - `editor.spec.ts` finds the name field with `getByLabel("Name")`, a substring match that also counts hidden panels. No other editor label may contain "Name".
  - Each run sends a unique `x-forwarded-for` so the contact rate limit gets a fresh bucket.
- **Contact anti-spam is deliberate:** a honeypot, a two-second minimum time-to-submit, and five per hour per hashed IP. Never weaken the checks to make tests faster.
- **`#contact` must keep working;** the e2e suite navigates to it.
- **Deliberately not added:**
  - integration tests (two tiers only: unit and e2e)
  - Jotai, Zustand or Redux
  - three.js, react-three-fiber or ogl
  - a Resend adapter (waits for deployment)
  - owners, rate-limit or idempotency tables

  Don't add them unless asked.

- **Shell environment:**
  - `python` is not installed; use `node -e`.
  - Bash `/tmp` and Node `/tmp` resolve to different directories on this machine; use `process.env.TEMP` in Node scripts.
  - Very large TypeScript files break bash heredocs; use the Write tool.
