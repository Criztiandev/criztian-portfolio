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
- The preview uses a `ready` handshake. The iframe posts `ready` once its listener is attached, and the editor answers with the current content. Never post from the iframe's `onLoad`: it fires before hydration and the message is dropped.
- Rich text is Tiptap JSON. The schema allowlists node and mark types, and those must match the extension list in `rich-text.extensions.ts`: `generateHTML` throws on anything unknown. Change both together.

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
  - Frames that can grow use `min-h`. Sticky fixed-height copy boxes (the Services captions, the How I work step boxes and heading box, and the Contact frame) go through `SceneFitGate`, which drops the scene to dust when the copy can't fit. See DOM contract rules 12–14 in `plans/handoff.md`.
  - **Contact is gated, not grown.** Its gather needs the whole form in one pinned frame, and a grown frame would hide the submit button for the length of the pin. So the frame is fixed-height and joins the gate: most phones, landscape phones, 400% zoom and text spacing flow it as a plain section. The gate also watches the slot, so error messages that outgrow the frame flow it too, and when its switch moves a focused field, it scrolls by the same amount so the field stays put.
  - **How I work's orbit** is scroll-driven CSS behind the `staged` variant, on the container's `--step-scene` view timeline, with ranges from `resolveStepHandover` (`step-motion.rules.ts`, which reads the scene's share: `DOT_SCENE_MOTION`, else `stepMorphShare`). Nested turn wrappers each rotate one `--orbit-step-angle` over one handover, about the circle centre far below the frame. The ring's ticks move by `stroke-dashoffset` on a small band SVG, never by rotating a huge layer.
  - **The orbit's step box is identical staged and unstaged** (slot rect, container height, each step's height and width). The hook and the gate measure while the stage is still `idle`, and nothing re-measures when `running` switches `staged` on. Custom properties are namespaced `--orbit-*`; never redefine `--radius`, the token behind every `rounded-*`.
  - **Services is triggered, not scrubbed.** Between two thread keyframes (`DOT_SCENE_MOTION` `isThread`), `resolveTriggeredTarget` commits the target to the next or previous shape once the scroll passes `threadTrigger` in that direction, and `followTriggeredProgress` plays it over `threadDrawSeconds`. The hook publishes the committed shape as the stage's `data-thread`; the captions are CSS transitions keyed on it (literal selectors in globals.css).
  - **The glide lock.** On a thread-to-thread commit (not during a nav jump, never under reduced motion) the hook dispatches `DOT_THREAD_COMMIT_EVENT` with the shape's rest top. `SmoothScroll` glides there over `threadDrawSeconds` on `easeInOutSine`: through `lenis.scrollTo(…, { lock: true })` with Lenis, else a RAF glide with `overflow: hidden` on `<html>`. A key press or an in-page anchor click releases either lock. `SmoothScroll` therefore listens on every pointer type; only Lenis itself stays fine-pointer-only. Never key it on `data-scene`; no CSS keys on `data-scene` today. `staged` needs scroll-driven animations, motion allowed, height over 30rem, a running stage and no `data-fit`; everything else gets the Phase 2 layout.
  - Use the `view-timeline-name` and `view-timeline-inset` longhands: the `view-timeline` shorthand resets the inset and puts every handover 72px late.
  - A dust scene ends one viewport before its container does. The viewport height is the shortest pinned frame plus its sticky top (`resolveViewportHeight`). Every frame is at least one viewport tall and the hero's is exactly one, so a frame that grows under rule 12 never moves a dust boundary.
  - `buildSceneKeyframes` turns the measured scenes into keyframes. `resolveTimelinePosition` maps `scrollY` to one position `p` (keyframe index plus transit progress), which the loop smooths (`followTimelineProgress`, snapping jumps longer than one segment).
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
- **No `useState` in the hook.** Status goes out as DOM attributes (`data-status`, `data-scene` and `data-thread` on the stage, `data-point-count` on the canvas), which CSS and the e2e specs key off.
- **Font gate:** it must check only the primary family (`Antonio`), because `Antonio Fallback` (metric-adjusted Arial) always reports as loaded. Use `document.fonts.load()` followed by `check()`; `fonts.ready` alone is not enough.
- **Fallbacks:**
  - No WebGL2 (or a lost context) falls back to the text `<h1>`. Slots hide and scene containers drop their pin height.
  - Reduced motion never starts the loop. It draws a keyframe only while the scroll is inside that keyframe's pin range, and clears the canvas between scenes.
  - There is no viewport gate; phones run the dots.
  - `aria-hidden` goes on decorative leaves only: the canvas, the empty slots, the orbit ring, the step numerals, the plate dots and Work's window rings. The other exception is a visual duplicate of text that stays exposed: the FAQ statement (the label `<h2>` carries it), the later Projects labels and a label's position count (the list carries it).

**Other.**

- **Sections:** every screen below the hero is the B statement split, built from the `SCREEN_*`, `STATEMENT_*`, `SECTION_LABEL_CLASS`, `BODY_CLASS`, `TITLE_CLASS` and `CUE_CLASS` constants in `src/data/page-sections.data.ts`. Services and How I work keep their Phase 3 layout and the older `SECTION_HEADLINE_CLASS` family until Phases 7 and 8.
  - Statements size from their column (`@container`, `cqi`) with a rem term and an svh cap. Check the widest word against its column at the fit sizes after changing a factor.
  - Projects is one B screen per visible project, until Phase 9's deck. Its pinned frame holds only the slot, at the plate's rect, and the screens scroll past it. The first screen's label is the section `<h2>`; later labels are `aria-hidden` duplicates.
  - On a phone each Work screen is full-bleed, `isolate` and `overflow-clip`, and a ring 24px round its plate spreads the background colour over the rest of the screen (`PROJECT_PLATE_WINDOW_CLASS`). The pinned frame therefore shows only round the plate passing it, and copy never crosses its dots. Forced colours drop `box-shadow`, so those screens turn opaque there instead. With no visible project the scene has no slot and falls back to dust.
  - FAQ is the dust scene's only section, one frame tall (rule 10), and the dust is invisible (owner, Phase 6).
- **Env:** `src/config/env.server.ts` / `env.public.ts` validate at import and fail fast. They reject legacy `eyJ…` Supabase keys.
- **Email:** `EmailAdapter` has only a preview implementation, which writes HTML to `.local/email-previews/`. Nothing is sent.
- **Global UI state:** `@tanstack/react-store` (`useSelector`, not the deprecated `useStore`).
- **Smooth scroll:** core `lenis` 1.x (never `lenis/react`, never 2.x), mounted by `SmoothScroll` in `src/app/page.tsx` only, so the editor preview and the dashboard never get it.
  - It runs only for fine pointers and without reduced motion. Its own RAF loop sleeps when Lenis stops smoothing; keep it separate from the dot hook's loop.
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
- **`next build` replays a stale published document.** The published-content read is cached in Next's Data Cache (`.next/cache/fetch-cache`) for a year with no tags, and a fresh build reuses it, so a production build can render an old theme or old fields while the DB and dev server are right. Runtime publishes are fine (`revalidatePath`). Until the read is tagged or made uncached, delete `.next/cache/fetch-cache` before a build that must show current content.
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
