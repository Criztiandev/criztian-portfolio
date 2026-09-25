# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A one-owner portfolio: a single public scrolling page (dot-matrix WebGL hero + contact form) and a password-protected owner dashboard with a live content editor. Everything runs locally (Next.js + Supabase in Docker); nothing is deployed.

Read before working:

- `AGENTS.md`: this is Next.js 16.3.4, which differs from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.
- `PRODUCT.md` (audience, positioning, what must not be fabricated) and `DESIGN.md` (visual system) before any UI work.
- `plans/handoff.md` for the rationale behind non-obvious decisions. The plans in `plans/` are finished history, not open work.

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

**Hero dot field** (`src/features/portfolio/`).

- **How it works:** raw WebGL2, no three.js or ogl. The sampler (Canvas2D) rasterises the name in Antonio and samples a dot grid. The renderer and GLSL in `shaders/` draw it. `dot-field.rules.ts` is the pure, unit-tested layer.
- **Tuning:** every tuning number lives in `src/data/hero.data.ts`. Tune there and nowhere else.
- **Two effects in `use-dot-field.hook.ts`; never merge them.** One owns the GL context and animation loop, with stable deps (`[containerRef, canvasRef, mode]`). The other resamples geometry on `[text, fontFamily]`. Merging them recreates a WebGL context on every editor keystroke. A third, tiny effect applies `dotColor` as a uniform; never put `dotColor` in the GL effect's deps, or a colour edit blanks the field.
- **Physics:** each dot is a damped spring (`stepDotPhysics` in `dot-field.rules.ts`), stepped on the CPU and streamed to vertex attribute 1 as offsets from the static home positions. Radius and push scale with the wordmark's ink height. The RAF loop stops once every dot is at rest and pointer input restarts it, so a resize must always redraw.
- **No `useState` in the hook.** Status goes out as DOM attributes (`data-status`, `data-point-count`), which CSS and the e2e specs key off.
- **Font gate:** it must check only the primary family (`Antonio`), because `Antonio Fallback` (metric-adjusted Arial) always reports as loaded. Use `document.fonts.load()` followed by `check()`; `fonts.ready` alone is not enough.
- **Fallbacks:** no WebGL2 (or a lost context) falls back to the text `<h1>`. Reduced motion draws the settled dots once and never starts the loop. There is no viewport gate; phones run the dots. `aria-hidden` goes on the canvas only.

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
- **Never write a secret-shaped literal in a test,** even a fake one. GitHub push protection blocked a push once. Build fixtures from parts: `` `sb_secret_${"0".repeat(32)}` ``.
- **e2e state:**
  - `tests/e2e/hero.spec.ts` asserts the published hero name is `Criztian`. Never leave a test value published; `editor.spec.ts` restores the name.
  - Logged-in specs create and delete a throwaway user via the admin API (`tests/e2e/owner-account.ts`). The owner's password is never needed; don't ask for it.
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
