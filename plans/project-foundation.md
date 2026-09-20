# Project foundation: local development

> Revised 2026-09-20. Replaces the previous 581-line version. All version claims below were verified against this machine, the installed `node_modules/next/dist/docs/`, and the npm registry on that date.

## Context

`criztian-portfolio` is currently an **untouched shadcn/Next.js starter**. There are eight real source files, no git repository, no `.env`, and the project has never been built or dev-run. The goal is to turn it into a working local development foundation: owner authentication, one scrolling portfolio page with an embedded contact form, and the data plumbing (tRPC + TanStack Query + Supabase) that later dashboard and blog features will build on.

The previous version of this plan was 581 lines and ~80 checkboxes covering everything from a Docker install to a full Playwright suite, with no ordering between them and several factual errors. This revision fixes the errors, cuts work that has no consumer yet, and reorders everything into phases that each end in a command you can run.

Deployment is out of scope. Local only.

---

## What changed from the previous version

### Decisions confirmed

| Decision                                              | Effect                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Defer TanStack Table, Charts, Markdown, Highlight** | The entire "Tables, charts, and blog-rendering foundation" section is removed. See [Deferred](#deferred-to-later-plans).                                                                                                                                                                 |
| **Downgrade ESLint 10 → 9**                           | `eslint-config-next@16.3.4` depends on `eslint-plugin-import` and `eslint-plugin-jsx-a11y`, and **both cap their eslint peer at `^9`**. ESLint 10 is not cleanly supported. Pin `eslint@^9`.                                                                                             |
| **shadcn output is vendored**                         | `src/components/ui/*`, `src/lib/utils.ts` and the `components.json` aliases are left exactly as the CLI generates them. No `.ui.tsx` renames, no moving `src/lib/utils.ts`. `shadcn add` keeps working untouched.                                                                        |
| **One document, ordered phases with gates**           | Phases 0–11 below. Each has hard prerequisites and one concrete verification command.                                                                                                                                                                                                    |
| **`src/` is the application root** (added mid-build)  | `app/`, `components/`, `lib/` and `hooks/` moved to `src/`. `tsconfig.json` maps `@/*` → `./src/*`; `components.json` and `.prettierrc` point at `src/app/globals.css`. Per the Next docs, `public/`, `.env.*` and config files stay at the root, and `proxy.ts` goes **inside** `src/`. |

### Factual corrections to the old plan

- **`tsc --noEmit` is not a valid typecheck.** Next 16 generates route types and `next-env.d.ts` only during `dev`/`build`/`typegen`. The docs are explicit: _"running `tsc --noEmit` directly wouldn't validate your route types… `next typegen && tsc --noEmit`"_ (`next/dist/docs/01-app/03-api-reference/06-cli/next.md`). Neither file exists in this repo right now, so today's `typecheck` script is false-green.
- **`/#contact` will not scroll smoothly.** Next 16 _"will no longer override your `scroll-behavior` setting during navigation"_; you must add `data-scroll-behavior="smooth"` to `<html>` (`.../02-guides/upgrading/version-16.md:971-978`). The old plan built a one-page anchor-nav site and never mentioned this.
- **`.gitignore` swallows `.env.example`.** It contains a bare `.env*` with no negation, so the one env file that must be committed is silently ignored.
- **Moving `src/lib/utils.ts` accomplishes nothing and breaks the CLI.** It is one line — `export { cn } from "cn"` — and `src/components/ui/button.tsx` already bypasses it by importing `from "cn"` directly. Moving it desyncs the `components.json` utils alias.
- **`@types/node` is `^20` but Node here is v24.21.0.** Test tooling peers on `>=22`.
- **`useStore` is deprecated** in `@tanstack/react-store@0.11.1`; `useSelector` is current. The old plan hedged; this is settled.
- **`@supabase/supabase-js` is a _peer_ of `@supabase/ssr`**, not a dependency. Under pnpm's strict `node_modules` you must install both explicitly.

### Cut list — restore any of these on request

Each is a multi-tenant-SaaS pattern applied to a system with exactly one user and maybe a dozen messages a year.

| Cut                                                                    | Why                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `owner_accounts` table + singleton constraint                          | Public signup is disabled and there is exactly one row in `auth.users`, so `authenticated` **is** the owner by construction. A second identity table must be kept in sync with `auth.users` and defends against a case signup-disabled already prevents. Net increase in failure modes.                                                                       |
| Rate-limit table + atomic RPC                                          | An atomic RPC exists to resolve concurrent-increment races that a personal contact form will not have. Replaced by a honeypot, a minimum time-to-submit check, and a `count(*)` over the last hour by hashed IP — ~15 lines, no migration, and it stops more real spam.                                                                                       |
| Idempotency keys + notification state machine + operator-recovery docs | Replaced by two nullable columns, `notified_at` and `notify_error`. Persist-then-notify, best effort. If `notified_at IS NULL` the message is still in the database and visible in the dashboard — that is the whole recovery story, and it is more reliable than a state machine that never gets exercised. Double-submit is solved by disabling the button. |
| `docs/architecture.md` + `development.md` + `deployment.md`            | Folded into `README.md`, which is still the unmodified template and needs rewriting anyway. Three docs for a solo project guarantees two go stale and start misleading you.                                                                                                                                                                                   |
| Integration test tier                                                  | Kept unit (Vitest, fast, no Docker, runs in the hook) and e2e (Playwright, two specs). Dropped the middle tier: procedure tests against live local Supabase need Docker up, need a DB reset per test for isolation, are flaky on Windows, and duplicate the e2e coverage.                                                                                     |
| Mocked Resend adapter                                                  | Testing a mock tests the mock. The `EmailAdapter` **interface** and the local preview implementation stay, so the seam exists; the Resend implementation gets written against the real API when you deploy.                                                                                                                                                   |
| `superjson`                                                            | Three wiring points and a dependency to avoid one `Date`. Return ISO strings from the contact mutation.                                                                                                                                                                                                                                                       |
| Optimistic-update policy section                                       | The old plan's own conclusion was _"There is no eligible persistent row-edit feature in the current foundation."_ An entire section, a policy table and two checkboxes for a feature that does not exist. Reduced to one line under [Architecture](#architecture).                                                                                            |
| 33-row "How to test" table                                             | Every row restated a step's own "Verify …" clause. Verification now lives in each phase gate.                                                                                                                                                                                                                                                                 |

---

## Ground truth

**Toolchain present:** Node v24.21.0, pnpm 10.34.5, git 2.55.0.windows.5. **Docker: not installed** (`docker: command not found`).

**Repo:** not a git repository. Never built — no `.next/`, no `next-env.d.ts`. Authored source is only `app/{layout,page}.tsx`, `app/globals.css`, `components/theme-provider.tsx`, `components/ui/button.tsx`, `lib/utils.ts` — all since relocated under `src/`, see [Target file tree](#target-file-tree).

**Installed:** next 16.3.4 · react/react-dom 19.2.8 · typescript 5.9.3 · tailwindcss + @tailwindcss/postcss 4.3.3 · eslint 10.11.0 · eslint-config-next 16.3.4 · prettier 3.9.8 · prettier-plugin-tailwindcss 0.8.1 · @types/node 20.19.43 · @base-ui/react 1.8.0 · next-themes 0.4.6 · shadcn 4.21.0 · lucide-react 1.47.0 · cva 0.7.1 · cn 0.3.0. pnpm lockfile v9.

**To add (verified on the npm registry):** `@trpc/{server,client,tanstack-react-query}@11.19.0` · `@tanstack/react-query@5.103.1` · `@tanstack/eslint-plugin-query@5.103.1` (eslint peer `^8.57 || ^9 || ^10`) · `@tanstack/react-store@0.11.1` · `zod@4` · `@hookform/resolvers@^5` (v5 is the zod-4 line; **do not pin `^3`**) · `react-hook-form` · `@supabase/ssr` **and** `@supabase/supabase-js` · `client-only`, `server-only`.

**Next.js 16 behaviours this plan depends on:** `proxy.ts` replaces `middleware.ts` (root-level, exports `proxy`, **`export const runtime` throws there**) · sync `cookies()`/`headers()`/`params`/`searchParams` fully removed · Turbopack is default for `dev` **and** `build`, so never pass `--turbopack` · `next lint` removed and `next build` no longer lints · `cacheComponents` is opt-in and stays off, so the legacy caching model applies.

---

## Architecture

Browser flow: shadcn UI + React Hook Form → TanStack Query → tRPC → service → Supabase / email adapter.

- Application procedures are hosted at `src/app/api/trpc/[trpc]/route.ts` on the Node runtime. No parallel REST API.
- Server Components use the server-side caller / prefetch proxy, never loopback HTTP.
- Routers validate input and enforce access; services coordinate workflows. Skip repository wrappers that only rename SDK calls.
- Feature **schemas** may be shared with the browser. Supabase clients, secret keys and email integrations are server-only.
- Fresh query cache per server request; one stable browser query client. Clear private queries on sign-out. Never persist owner data to browser storage.
- **Session refresh happens in `proxy.ts` and nowhere else.** A refresh token is single-use with a narrow reuse window; refreshing in two places revokes the whole session and presents as random logouts, not as an error. The tRPC context reads claims for authorization only.
- No in-process session, counter or dedup state — keep the app shape serverless-compatible.
- **Optimistic updates: none in this foundation.** Contact submission and authentication wait for the server. Revisit per-mutation when a reversible row edit actually exists.

### State ownership

| Concern                                   | Owner                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| Shared transient UI state (mobile nav)    | TanStack Store via `@tanstack/react-store`, accessed with `useSelector` |
| State used by one component               | Local React state                                                       |
| Server records, caches, request status    | TanStack Query through tRPC                                             |
| Form values, validation, submission state | React Hook Form + Zod                                                   |
| Theme                                     | Existing `next-themes` provider                                         |
| Route and shareable section               | Next.js routing + native URL anchors                                    |
| Verified identity                         | Server-side `supabase.auth.getClaims()`                                 |

Do not mirror query results, form fields, auth tokens or theme state into the UI store. Create the store through a factory scoped to a provider — no module-level mutable singleton, which would leak across server requests.

### Conventions

- `name.context.ts` / `name.context.tsx`, kebab-case for multiword: `contact.form.tsx`, `contact.schema.ts`, `contact.router.ts`, `theme.provider.tsx`.
- **Exempt:** `src/components/ui/**` and `src/lib/utils.ts` are vendored shadcn output — leave names and imports exactly as generated. Framework filenames (`page.tsx`, `layout.tsx`, `route.ts`, `proxy.ts`), tool configs and timestamped SQL migrations keep their own conventions.
- **No explanatory comments.** Code carries no narration. Rationale that matters lives in this plan or the README, not inline. Self-explanatory names and small functions instead.
- **No single-letter names.** Every variable, parameter, callback argument and import alias carries context: `for (const item of items)`, `.map((section) => ...)`, `catch (error)`. This overrides upstream docs — tRPC's canonical `const t = initTRPC...` is written as `const trpc`.
- **No dense one-liners.** Prefer explicit `for` / `for...of` loops and named helper functions over `reduce`, long chained pipelines, and clever operators (`??=`, nested ternaries). `.map()` inside JSX to render a list is fine. Multi-line object and argument literals even when they would fit on one line.
- **All types live in `src/types/`** (`portfolio.type.ts`, `contact.type.ts`, `env.type.ts`, `database.type.ts`). **All static data lives in `src/data/`** (`navigation.data.ts`, `portfolio.data.ts`). Types and data are never mixed in one file, and neither is declared inline in a feature or component file. Derive store/schema types structurally in `src/types/` rather than re-exporting `ReturnType<typeof factory>`, which would import in a circle.
- Strict TypeScript; infer types from schemas and routers; generate database types from the schema.

---

## Phases

Each phase lists hard prerequisites, its deliverable, and one gate that proves it is done. **Do them in order.** Tick each box after its gate passes.

### ⛔ Phase D — Docker Desktop (user action, start this now)

**Not an agent action.** Docker is absent on this machine. Phases 6–9 are hard-blocked on it, so start the install at the same time as Phase 0 and it will be ready when you get there.

- [x] Install Docker Desktop with the WSL2 backend and start the engine. Record any required restart or BIOS/Windows feature change in the README.
- **Gate:** `docker info` exits 0.

---

### Phase 0 — Repository and hygiene baseline

**Prereqs:** none. This must be first: if `.gitattributes` is not committed before the first commit, Git's Windows defaults bake CRLF into history, Prettier rewrites to LF, lint-staged re-stages, and every file shows as modified forever.

- [x] `git init`. Add `.gitattributes` with `* text=auto eol=lf`.
- [x] Add `.editorconfig` matching `.prettierrc` (LF, 2-space indent, final newline).
- [x] Add `.nvmrc` (`24`) and `.npmrc` (`engine-strict=true`). Add `"packageManager": "pnpm@10.34.5"` and an `engines.node` field to `package.json`.
- [x] Fix `.gitignore`: add `!.env.example` after the `.env*` line, and add `.local/`.
- [x] Make the initial commit.
- **Gate:** `git check-ignore -v .env.local` prints a match **and** `git check-ignore .env.example` exits non-zero.

### Phase 1 — Toolchain correction and first-ever build

**Prereqs:** 0. This is the first time this project is built; establish a known-good baseline before anything else so later failures are unambiguous.

- [x] Record current `pnpm lint` output as the pre-existing baseline.
- [x] Downgrade `eslint` to `^9`. Bump `@types/node` to `^24`. Verify the resolved tree has no peer errors.
- [x] Change the `typecheck` script to `next typegen && tsc --noEmit`. Add `lint:fix`, `format:check`, and an aggregate `check` script. Expand `format` beyond `**/*.{ts,tsx}` to cover JSON, CSS, Markdown and YAML.
- [x] Fix `src/app/layout.tsx` in one pass: add `export const metadata`, add `data-scroll-behavior="smooth"` to `<html>`, and Prettier-format it (it currently has a stray semicolon, single quotes and an over-width line, all against the repo's own `.prettierrc`).
- **Gate:** `pnpm lint && pnpm typecheck && pnpm build` — all exit 0.

> `next typegen` loads `next.config.ts` using the production build phase, so required env vars must be present for it to run. Keep env validation (Phase 3) **out of** `next.config.ts` or `typecheck` will break without a `.env.local`.

### Phase 2 — Format and lint automation

**Prereqs:** 1

- [x] Add `husky`, `lint-staged`, `eslint-config-prettier` (placed **after** the configs it overrides) and `@tanstack/eslint-plugin-query` to the flat config.
- [x] Add `.husky/pre-commit` invoking `pnpm exec lint-staged`. Use `pnpm exec`, not `npx`, and Git-Bash-compatible syntax with LF endings.
- [x] Configure `lint-staged` with non-overlapping file groups so ESLint and Prettier never touch the same file concurrently: code files get `eslint --fix` then `prettier --write`; other supported files get `prettier --write` only.
- [x] Add a `prepare` script that tolerates environments without git or dev dependencies.
- **Gate:** commit a deliberately unformatted file; it lands in history already formatted. Then commit a file with a real lint error; the commit is blocked.

### Phase 3 — Unit test harness and env validation

**Prereqs:** 1. Landing tests here is what makes every later phase verifiable by command instead of by clicking.

- [x] Add `vitest`, `@vitejs/plugin-react`, `@testing-library/{react,dom,jest-dom}`, `jsdom`, `vite-tsconfig-paths`. Add `vitest.config.ts` and a `test:unit` script.
- [x] Add `zod`. Create `src/config/env.server.ts` and `src/config/env.public.ts` with separate schemas, imported only from server and client code respectively.
- [x] Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, `EMAIL_MODE=preview`, `OWNER_EMAIL`.
- [x] Add a guard rejecting Supabase key values matching `/^eyJ/`. Supabase's current keys are short opaque `sb_publishable_…` / `sb_secret_…` strings; a long key starting with `eyJ` is a legacy JWT copied from a stale tutorial. Validate **shape only** so this passes before Supabase is running.
- **Gate:** `pnpm test:unit` passes with a real assertion, and blanking a required var makes `pnpm build` fail naming that key.

> The public schema must not be able to import the server schema. Never prefix a secret with `NEXT_PUBLIC_`.

### Phase 4 — tRPC + TanStack Query skeleton

**Prereqs:** 3. Deliberately sequenced **before** Supabase so the hardest integration is proven in isolation, with no Docker dependency.

- [x] Add `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `client-only`, `server-only`.
- [x] Create `src/server/trpc/trpc.init.ts` (`createTRPCContext` wrapped in React `cache()`, `createTRPCRouter`, `baseProcedure`), `src/server/trpc/app.router.ts`, `src/lib/query/query.factory.ts` (`makeQueryClient`, a deliberate `staleTime`, and a `shouldDehydrateQuery` that also dehydrates pending queries), `src/lib/trpc/trpc.client.tsx` (`createTRPCContext<AppRouter>()` → `TRPCProvider`, `useTRPC`), `src/server/trpc/trpc.server.ts` (`import "server-only"`, `cache(makeQueryClient)`, `createTRPCOptionsProxy`).
- [x] Add `src/app/api/trpc/[trpc]/route.ts` using `fetchRequestHandler`, exported as both `GET` and `POST`. Do not add `export const runtime` — Node is already the default.
- [x] Mount the provider in `src/app/layout.tsx` alongside the theme provider. One provider, one browser cache.
- [x] Add one DB-free `health` procedure.
- **Gate:** `pnpm dev`, then `curl "http://localhost:3000/api/trpc/health?input=%7B%7D"` returns a tRPC `{"result":{"data":…}}` envelope.

> `createTRPCContext` is invoked two ways — with a `Request` via `fetchRequestHandler`, and with no arguments via `createTRPCOptionsProxy` in Server Components. Derive everything from `await cookies()` / `await headers()` rather than a passed-in `req` so one implementation serves both. This is the most common breakage in this integration.

### Phase 5 — Store, app shell, and public page

**Prereqs:** 4

- [x] Add `@tanstack/react-store`. Move `src/components/theme-provider.tsx` → `src/providers/theme.provider.tsx` and update its import.
- [x] Add `src/features/portfolio/stores/portfolio-ui.store.ts` as a **factory**, plus `src/providers/portfolio-store.provider.tsx` scoping one instance to the interactive shell. Access it with `useSelector` — not the deprecated `useStore`.
- [x] Build the scrolling `/` page with section navigation and a `#contact` section. Keep sections server-rendered; put client boundaries only around the nav and the form.
- [x] Keep navigation accessible: real anchors, keyboard operation, focus handling, and `prefers-reduced-motion` respected if scrolling is animated.
- [x] Add `react-hook-form`, `@hookform/resolvers@^5`, and `src/features/contact/schemas/contact.schema.ts` (name, email, message; whitespace normalisation; size limits). Build `contact.form.tsx` with labels, field errors, pending and success states. Submit handler stubbed for now.
- [x] Add only the shadcn controls the form needs (`input`, `textarea`, `field`) via the CLI. **Do not rename or rewrite the generated files.**
- **Gate:** `pnpm build && pnpm test:unit` pass, where unit tests cover the store's open/close/select-section transitions and the contact schema's accept/reject cases. Manually: `/#contact` scrolls smoothly both from nav and when opened directly, and selecting a section closes the mobile menu without clearing form input.

### Phase 6 — Local Supabase and schema

**Prereqs:** Phase D, 1

- [x] Add `supabase` as a devDependency (version-pins the CLI with the project). Run `supabase init` and `supabase start`.
- [x] Disable public signup in `supabase/config.toml` (confirm the exact key against the generated file — historically `[auth] enable_signup = false`).
- [x] Add a `contact_messages` migration: id, normalised name/email/message, `created_at`, `notified_at timestamptz`, `notify_error text`, and a hashed-IP column for the rate check.
- [x] Enable RLS. `INSERT` allowed to `anon`; `SELECT`/`UPDATE`/`DELETE` require `authenticated`. There is no owner table — signup is disabled, so `authenticated` is the owner.
- [x] Create the single owner account through the CLI/Studio admin path. Do not commit a password.
- [x] Generate `src/types/database.type.ts` from the local schema. Add a `db:reset` and a `db:types` script.
- **Gate:** `pnpm exec supabase db reset` replays cleanly, then as `anon` a `select` on `contact_messages` returns 0 rows while an `insert` succeeds.

> **Windows port hazard:** Supabase binds 54321–54324. Windows reserves dynamic TCP ranges for Hyper-V/WSL2 that sometimes land in the 54xxx band, producing `bind: An attempt was made to access a socket in a way forbidden by its access permissions` — which looks nothing like a port conflict. Check with `netsh interface ipv4 show excludedportrange protocol=tcp` and remap in `config.toml` if they overlap.

### Phase 7 — Supabase SSR and owner authentication

**Prereqs:** 6, 4

- [x] Add `@supabase/ssr` **and** `@supabase/supabase-js` (the latter is a peer, not a dependency — pnpm will not hoist it for you).
- [x] Create `src/lib/supabase/supabase.client.ts`, `supabase.server.ts` (awaits `cookies()`), and `supabase.proxy.ts` exporting `updateSession`.
- [x] Add `src/proxy.ts` exporting `proxy(request)` and delegating to `updateSession`. The Next docs are explicit: _"If you're using Proxy, ensure it is placed inside the `src` folder."_ **No `export const runtime`** — it throws in proxy files.
- [x] **Invert the gate from the upstream recipe.** Supabase's example redirects every unauthenticated request that is not `/login` or `/auth` to `/login`. Shipped as-is, that redirects every visitor away from your public portfolio. Gate on an allowlist of protected prefixes instead: `request.nextUrl.pathname.startsWith("/dashboard")`.
- [x] Verify identity with `supabase.auth.getClaims()`, not `getSession()` and not `getUser()`. `getClaims()` verifies the token signature on every call, locally against cached JWKS on asymmetric-signing projects. Never trust an unverified session object in server code.
- [x] Build `/login`, `/forgot-password`, `/reset-password` and a protected `/dashboard` shell. Generic error messages for bad credentials. Recovery redirects allowlisted to local URLs.
- [x] Clear private TanStack data and refresh server-rendered state on sign-out.
- **Gate:** `curl -I http://localhost:3000/` returns **200** (not a redirect) while `curl -I http://localhost:3000/dashboard` returns 307 to `/login`. That one pair catches the inverted-gate bug. Then complete a password reset through Supabase's local Mailpit inbox at `http://127.0.0.1:54324`.

> **Verify against the installed `@supabase/ssr` types before writing the cookie handlers.** Recent versions changed `setAll` to take two arguments — `setAll(cookiesToSet, headers)` — where the second carries `Cache-Control: private, no-store` headers that stop a CDN serving one user's session cookie to another. Dropping the second argument is not a type error, so it fails silently. Confirm the shape in `node_modules/@supabase/ssr/dist/main/types.d.ts` after install.

### Phase 8 — Contact submission and local email preview

**Prereqs:** 7, 5

- [x] Add `src/features/contact/server/contact.router.ts` and `contact.service.ts`. Validate with the shared schema, check the honeypot, check minimum time-to-submit, and check the hourly count by hashed IP. Reject before any write.
- [x] Persist the message **before** attempting notification. A database failure must prevent the email step; a notification failure must not lose the message.
- [x] Define an `EmailAdapter` interface in `src/server/integrations/email/`. Implement `email-preview.adapter.ts` only — it writes an HTML/`.eml` file to `.local/email-previews/` using server-controlled filenames. Resend is a future second implementation of the same interface; do not write it now.
- [x] Record outcome in `notified_at` / `notify_error`. A preview is `previewed` — never report it as delivered.
- [x] Return a generic public acknowledgment tied to persistence. Never leak stored input, provider details or notification state.
- [x] Wire the form's submit handler to the mutation. Disable the button while pending. Retain input on recoverable errors. Return `created_at` as an ISO string so no transformer is needed.
- **Gate:** submit the form; exactly one new row exists in `contact_messages` **and** one new file appears under `.local/email-previews/`. Confirm `.local/` is gitignored and not reachable through any app route.

### Phase 9 — End-to-end coverage

**Prereqs:** 8

- [x] Add `@playwright/test` and run `pnpm exec playwright install chromium` (~120 MB — budget for it and note it in the README). _README note carried into Phase 10, which rewrites the README._
- [x] Two specs only: the contact happy path at `/#contact`, and `/dashboard` redirecting when logged out.
- **Gate:** `pnpm exec playwright test` — both pass against local services with synthetic data.

### Phase 10 — Logging and documentation

**Prereqs:** 9

- [ ] Add structured error logging with request identifiers in `src/server/logging/logger.service.ts`. Verify passwords, tokens, full message bodies and unnecessary personal data are absent from ordinary logs.
- [ ] Rewrite `README.md` (still the unmodified template): prerequisites including Docker, first-run setup, every script, and the local Supabase/Mailpit URLs. Keep `AGENTS.md` as-is — the "this is not the Next.js you know" warning is load-bearing.
- [ ] Add a short "Deferred" section to the README recording future work: hosted Supabase, Vercel, Resend live sending, dashboard data, blog. Present none of it as configured.
- **Gate:** a clean clone plus only the documented commands reaches a working `pnpm dev`.

### Phase 11 — Final verification

**Prereqs:** 10

- [ ] `pnpm check` (format:check + lint + typecheck), `pnpm test:unit`, `pnpm exec playwright test`, `pnpm build` — all green.
- [ ] Confirm the production build needs no live email credentials and no hosted database.
- [ ] Confirm no real email sends and no credentials in browser output or ordinary logs.
- **Gate:** all of the above pass from a clean `pnpm install`.

---

## Target file tree

Create each directory when its first file is needed.

```text
src/
  app/
    layout.tsx            # + metadata, data-scroll-behavior="smooth", providers
    page.tsx              # scrolling portfolio, #contact section
    globals.css
    (auth)/login/page.tsx
    (auth)/forgot-password/page.tsx
    (auth)/reset-password/page.tsx
    (owner)/dashboard/{layout,page}.tsx
    auth/confirm/route.ts
    api/trpc/[trpc]/route.ts

  components/ui/          # VENDORED — shadcn CLI output, do not rename or rewrite
    button.tsx  input.tsx  textarea.tsx  field.tsx
  components/layout/site-shell.layout.tsx

  providers/
    app.provider.tsx  theme.provider.tsx  trpc.provider.tsx
    portfolio-store.provider.tsx

  features/
    portfolio/{components,stores,hooks}/
    auth/{components,schemas,server}/
    contact/
      components/contact.form.tsx
      schemas/contact.schema.ts
      server/{contact.router.ts,contact.service.ts}
    dashboard/components/

  server/
    trpc/{trpc.init.ts,trpc.context.ts,app.router.ts,trpc.server.ts}
    integrations/email/{email.adapter.ts,email-preview.adapter.ts}
    logging/logger.service.ts

  lib/
    utils.ts              # VENDORED — leave as `export { cn } from "cn"`
    supabase/{supabase.client.ts,supabase.server.ts,supabase.proxy.ts}
    trpc/trpc.client.tsx
    query/query.factory.ts

  config/{env.server.ts,env.public.ts}
  types/                  # ALL TypeScript types
    portfolio.type.ts  contact.type.ts  env.type.ts  database.type.ts
  data/                   # ALL static data, kept separate from types
    navigation.data.ts  portfolio.data.ts
  hooks/
  proxy.ts                # MUST be inside src/, NOT the project root

public/                   # stays at the project ROOT, per the Next docs
supabase/{config.toml,migrations/}
tests/{unit/,e2e/,fixtures/}
plans/
.husky/pre-commit

.env.example  .editorconfig  .gitattributes  .nvmrc  .npmrc
components.json  eslint.config.mjs  next.config.ts  postcss.config.mjs
tsconfig.json  package.json
lint-staged.config.mjs  vitest.config.ts  playwright.config.ts
```

Application code lives under `src/`. Per the Next docs' src-folder rules, `public/`, `.env.*` and every config file stay at the project root, while `proxy.ts` goes **inside** `src/`. `tsconfig.json` maps `@/*` to `./src/*`. Change `next.config.ts` only when a requirement needs it.

---

## Manual acceptance

1. Fresh clone → documented setup → `pnpm dev` works.
2. `pnpm exec supabase db reset`, then provision the owner.
3. Log in, reach `/dashboard`, sign out, confirm access is revoked and the previous owner's cached data is gone.
4. Complete password recovery through Mailpit.
5. Open `/#contact` directly **and** via nav; both scroll smoothly. Submit valid input; inspect the row and the preview file.
6. Resubmit; confirm the honeypot/timing/rate checks reject without writing a row or attempting notification.
7. Simulate a preview-adapter failure; confirm the message row survives with `notify_error` set.
8. Open/close mobile nav; UI responds with no network wait and contact input is preserved. No hydration warnings in console.
9. `pnpm check`, `pnpm test:unit`, `pnpm exec playwright test`, `pnpm build`.
10. Verify hook success, failure, and partial-staging behaviour on a throwaway branch.

The foundation is done when these pass and another developer can reproduce the setup from the README alone. A local build is not evidence of a successful Vercel deployment; a local preview file is not evidence of real Resend delivery.

---

## Deferred to later plans

**TanStack Table / Charts / Markdown / Highlight.** Cut from this foundation. Registry state as of 2026-09-20: `@tanstack/react-table@9.2.4` is genuinely stable (v9 released 2026-08-04, peer `react >=18`); `@tanstack/charts@0.18.0`, `@tanstack/markdown@0.0.15` and `@tanstack/highlight@0.1.0` are all **alpha**. The dashboard has no dataset and the blog has no content, so wrappers built now would be rewritten against different alpha APIs before the real feature lands. Add each in the plan that gives it a consumer. When you do: Charts' React adapter is the `@tanstack/charts/react` subpath (the standalone `@tanstack/react-charts@0.18.0` is the older package), and Highlight's Markdown bridge is `createTanStackMarkdownHighlighter` from `@tanstack/highlight/markdown`.

**Also deferred:** `/blog/[slug]` routes and homepage previews · content storage, drafts, publishing, metadata · dashboard datasets, analytics, chart aggregation, server-side table procedures · hosted Supabase, Vercel production and previews, production migrations · live Resend sending, sender/domain verification, production Auth SMTP · optimistic mutations (revisit per-mutation when a reversible row edit exists) · Supabase Realtime, WebSockets, background polling · hosted CI, commit-message conventions, release automation · public signup, multiple administrators, role management, social login, i18n.

---

## References

Installed Next.js docs first (`node_modules/next/dist/docs/`), then:

- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) · [`proxy.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [`next typegen`](https://nextjs.org/docs/app/api-reference/cli/next)
- [tRPC + TanStack Query setup](https://trpc.io/docs/client/tanstack-react-query/setup) · [with Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [Supabase SSR client creation](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs) · [API keys](https://supabase.com/docs/guides/getting-started/api-keys) · [Local development](https://supabase.com/docs/guides/local-development) · [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [TanStack Store React quick start](https://tanstack.com/store/latest/docs/framework/react/quick-start) · [Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) · [Query ESLint rules](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)
- [Husky](https://typicode.github.io/husky/get-started.html) · [lint-staged](https://github.com/lint-staged/lint-staged) · [Prettier + linters](https://prettier.io/docs/integrating-with-linters)
