# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A one-owner portfolio: a single public scrolling page (dot-matrix WebGL hero + contact form) and a password-protected owner dashboard with a live content editor. Everything runs locally (Next.js + Supabase in Docker); nothing is deployed.

Read before working:

- `AGENTS.md`: this is Next.js 16.3.4, which differs from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.
- `PRODUCT.md` (audience, positioning, what must not be fabricated) and `DESIGN.md` (visual system) before any UI work.
- `plans/handoff.md`: the redesign in progress. It covers the current phase, the owner's decisions, the fixed-canvas architecture and the DOM contract every dot scene follows.
  - Rationale for the earlier hero, quote, burst and editor work is in `git show 0a3c97a:plans/handoff.md`.
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
  - `buildSceneKeyframes` turns the measured scenes into keyframes. `resolveTimelinePosition` maps `scrollY` to one position `p` (keyframe index plus transit progress), which the loop smooths (`followTimelineProgress`, snapping jumps longer than one segment).
  - The stage's `data-scene` is the formed keyframe id or `moving`.
- **Shapes:**
  - The name stays on attribute 0, pixel-identical to the pre-timeline build at rest.
  - Every other shape comes from `buildShapeLibrary` (seeded, `SHAPE_POINTS` each), padded to the point total and uploaded once into its own buffer. Attributes 2 and 3 (`aFrom` and `aTo`) are re-pointed at the right buffers when the keyframe pair changes.
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
  - The RAF loop sleeps once the dots are at rest, `p` has reached its target, the intro has settled, and no spinning shape (the cube, the placeholder sphere) is formed or in transit (`shouldLoopSleep`).
  - Scroll, pointer and resize input restart it. `visibilitychange` stops it.
  - There is no IntersectionObserver, because a fixed canvas is always on screen.
- **No `useState` in the hook.** Status goes out as DOM attributes (`data-status` and `data-scene` on the stage, `data-point-count` on the canvas), which CSS and the e2e specs key off.
- **Font gate:** it must check only the primary family (`Antonio`), because `Antonio Fallback` (metric-adjusted Arial) always reports as loaded. Use `document.fonts.load()` followed by `check()`; `fonts.ready` alone is not enough.
- **Fallbacks:**
  - No WebGL2 (or a lost context) falls back to the text `<h1>`. Slots hide and scene containers drop their pin height.
  - Reduced motion never starts the loop. It draws a keyframe only while the scroll is inside that keyframe's pin range, and clears the canvas between scenes.
  - There is no viewport gate; phones run the dots.
  - `aria-hidden` goes on the canvas and the empty slots only.

**Other.**

- **Env:** `src/config/env.server.ts` / `env.public.ts` validate at import and fail fast. They reject legacy `eyJ…` Supabase keys.
- **Email:** `EmailAdapter` has only a preview implementation, which writes HTML to `.local/email-previews/`. Nothing is sent.
- **Global UI state:** `@tanstack/react-store` (`useSelector`, not the deprecated `useStore`).

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
