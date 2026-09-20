# Handoff — criztian-portfolio foundation

> Written for the next Claude Code session picking up this build. Read this, then `plans/project-foundation.md` for the full plan.
> State as of 2026-09-20, commit `3ade506`, branch `main`. **Commits after `8a4cb6d` are local only — not yet pushed** to `https://github.com/Criztiandev/criztian-portfolio`.

## Where things stand

**Phases 0–10 complete and verified. 53 of 56 boxes ticked. 59 unit tests and 2 e2e specs passing.**

| Phase                                | State                                             |
| ------------------------------------ | ------------------------------------------------- |
| D Docker Desktop                     | done — `docker info` exits 0, data on `E:\Docker` |
| 0 Repo baseline                      | done                                              |
| 1 Toolchain + first build            | done                                              |
| 2 Pre-commit automation              | done                                              |
| 3 Tests + env validation             | done                                              |
| 4 tRPC + TanStack Query              | done                                              |
| 5 Store + page + contact form        | done                                              |
| 6 Local Supabase + schema + RLS      | done                                              |
| 7 Supabase SSR + owner auth          | done                                              |
| 8 Contact submission + email preview | done                                              |
| 9 Playwright e2e                     | done                                              |
| 10 Logging + README                  | done                                              |
| **11 Final verification**            | **NOT STARTED — do this next**                    |

`pnpm check`, `pnpm test:unit`, `pnpm build` and `pnpm exec playwright test` are all green.

## Start here

```bash
cd E:/Project/criztian-portfolio
pnpm supabase:server         # Docker must be running; prints the service URLs
pnpm dev                     # http://localhost:3000
```

| Service               | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| App                   | http://localhost:3000                                     |
| Supabase API          | http://127.0.0.1:54321                                    |
| Studio                | http://127.0.0.1:54323                                    |
| Mailpit (auth emails) | http://127.0.0.1:54324                                    |
| Postgres              | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Scripts: `dev` `build` `start` `lint` `lint:fix` `format` `format:check` `typecheck` `check` `test:unit` `test:unit:watch` `test:e2e` `test:e2e:ui` `supabase:server` `db:start` `db:stop` `db:status` `db:reset` `db:types`. All are documented in `README.md`.

`.env.local` exists and is gitignored, populated with real local Supabase keys. Owner account is `criztiandev@gmail.com`; **the password is known only to the user — never ask for it.** To exercise a logged-in flow, create a throwaway user via the admin API and delete it afterwards (see commit `15fbd79`), or ask the user to drive the browser.

## The user's conventions — these override upstream docs

1. **No explanatory comments.** Zero narration in code. Rationale goes in this plan or the README. `src/components/ui/**` is vendored shadcn output and exempt.
2. **No single-letter names.** Anywhere — variables, parameters, callback args, imports. tRPC's canonical `const t = initTRPC...` is written `const trpc`.
3. **No dense one-liners.** Explicit `for...of` over `reduce`/chained pipelines; no `??=` or nested ternaries. `.map()` inside JSX is fine.
4. **All types in `src/types/`, all static data in `src/data/`**, never mixed, never inline in a feature file.

The user reacts badly to violations of these. They are also in `plans/project-foundation.md` under Conventions and in session memory.

## Environment landmines — all hit, all real

- **`EPERM: rename` → 500s in `next dev` is a Turbopack bug, not antivirus.** Solved 2026-09-20 by controlled experiment; the earlier "Windows Defender" diagnosis in this file was **wrong** and cost real time, so it is corrected here rather than softened. Symptom: on a cold `.next`, `/` serves 200 and every route compiled after it serves 500, with `EPERM` renaming `.next/dev/server/*-manifest.js` in `.next/dev/logs/next-development.log`. Ruled out, each by test: antivirus (adding `Add-MpPreference -ExclusionPath 'E:\Project'` as administrator changed nothing), concurrency (requests 4s apart fail identically), and orphaned servers (process tree was a single clean parent chain). Swapping only the bundler fixed it — `--webpack` gave 200/200/200/307/307 and **zero** EPERM on the same routes and same cold `.next`. Known upstream on Windows: [#57581](https://github.com/vercel/next.js/issues/57581), [#92298](https://github.com/vercel/next.js/issues/92298). `next build` is unaffected: it writes `.next` once instead of rewriting manifests per route.
- **Do not re-diagnose the above as a scanner problem.** If 500s reappear, check the bundler first. `Get-MpPreference` needs an elevated shell and tells you nothing useful here.
- **Never `taskkill /F` the dev server.** It leaves locked handles on `.next`, reproducing the same EPERM. Ctrl-C it, and `rm -rf .next` if it happens.
- **`/tmp` differs between bash and node** on this box. Bash's `/tmp` is `C:\Users\crizt\AppData\Local\Temp`; node resolves `/tmp` as `E:\tmp`. Use `process.env.TEMP` in node scripts.
- **`UID` is readonly in bash.** A `UID=$(...)` capture silently fails. Cost a leaked test user once.
- **`python` is not installed.** Use `node -e` for scripting.
- **`supabase_vector` container crash-loops** (`ConnectionRefused` on the Docker socket). Cosmetic — it only feeds Studio's Logs pane. An earlier note here claimed it makes plain `supabase status` print nothing; that is **no longer true** on CLI 2.117.0, which prints JSON either way (verified 2026-09-20). Can be silenced with `[analytics] enabled = false` in `config.toml`; the user has not asked for this.

## Version facts that contradict training data

- **Next.js 16.3.4.** `middleware.ts` is `src/proxy.ts` (inside `src/`, exporting `proxy`); `export const runtime` **throws** there. `cookies()`/`headers()`/`params`/`searchParams` are async with no sync fallback. Turbopack is default — never pass `--turbopack`, but `dev` **does** pass `--webpack` to dodge the EPERM bug above. `next lint` is removed. `typecheck` must be `next typegen && tsc --noEmit` or route types go unchecked.
- **ESLint pinned to 9.** ESLint 10 _crashes_ — `eslint-plugin-react@7.37.5` calls `contextOrFilename.getFilename()`, removed in 10. Do not "upgrade" it.
- **`useStore` is deprecated** in `@tanstack/react-store`; use `useSelector`.
- **`@supabase/ssr` `setAll` takes two args** `(cookies, headers)`. The second carries no-store cache headers. Dropping it is not a type error and leaks sessions across users behind a CDN.
- **Use `getClaims()`**, never `getSession()` or `getUser()`, for server-side identity.
- Always read `node_modules/next/dist/docs/` before writing Next.js code — the project's `AGENTS.md` mandates it and it has been right every time.

## Deviations from the approved plan — all deliberate, all flagged to the user

1. **`src/` is the app root** (user asked mid-build). `public/`, `.env.*` and configs stay at the project root; `proxy.ts` lives _inside_ `src/`.
2. **Anon `INSERT` on `contact_messages` was revoked**, contradicting Phase 6's gate. The publishable key ships in the browser, so anon INSERT let anyone flood the table via the Data API, bypassing honeypot/timing/rate checks. Contact writes now use the secret key server-side. Migration `20260920140000`.
3. **`[auth.email] enable_signup` must stay `true`.** It toggles the whole email _provider_, not signup. Setting it false broke login and recovery. Global signup is off via `[auth] enable_signup = false`.
4. **Custom recovery email template** (`supabase/templates/recovery.html`) using `{{ .TokenHash }}`. The default `{{ .ConfirmationURL }}` returns tokens in the URL fragment, which a server cannot read.
5. **`vite-tsconfig-paths` dropped** — Vite 5 resolves tsconfig paths natively.
6. **The `d` dark-mode hotkey was deleted.** It was shadcn template cruft with no UI affordance.
7. **Playwright's `webServer` runs `pnpm build && pnpm start`, not `pnpm dev`.** Costs ~10s of build per run and buys a suite that cannot inherit dev-server bundler bugs — which is exactly how the Turbopack `EPERM` issue above surfaced in the first place. Kept deliberately after that bug was fixed; the user was asked and chose to keep it.
8. **Each e2e run sends a unique `x-forwarded-for`** (`2001:db8::<timestamp>`, the reserved documentation range). Next sets `x-forwarded-for` even on localhost, so every run previously hashed to one IP and the 5-per-hour limit would have rejected run 6 — the suite was one run from breaking when this was found. A per-run address gives each run its own bucket without deleting rows or weakening the limit. Prefer this over `db:reset` between runs.
9. **`dev` is `next dev --webpack`; `build` stays on Turbopack.** Opting dev out of Turbopack is the documented escape hatch (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`) and is the fix for the `EPERM` 500s above. Costs slower HMR — webpack was ~5s to first compile here versus Turbopack's ~0.3s. Production builds are untouched, so nothing that ships changes. Revisit when the upstream Windows issues close.

## Phase 9 — Playwright (done)

`playwright.config.ts` plus `tests/e2e/contact.spec.ts` and `tests/e2e/dashboard.spec.ts`. Run with `pnpm test:e2e`.

What the specs had to work around, so nobody "simplifies" them back into failing:

- **The contact form's timing check rejects submissions faster than 2 seconds.** `contact.spec.ts` waits `MIN_SECONDS_BEFORE_SUBMIT` imported from `src/data/contact.data.ts` plus a margin, so changing the constant moves the test with it. Do not weaken the check to make a test faster.
- **Rate limiting is per hashed IP, 5 per hour, and localhost is not exempt.** See deviation 8 — each run sends its own `x-forwarded-for`.
- **e2e runs against a production build.** See deviation 7. `workers` is pinned to 1 for the same reason.
- `reuseExistingServer` is on outside CI. If you already have `pnpm dev` on :3000 the suite will reuse it and inherit the dev-server EPERM flakiness — stop it first, or expect a 500.
- The logged-out `/dashboard` spec needs no credentials; that is why it was chosen. It asserts the redirect lands on `/login?next=/dashboard` **and** that the Sign in button renders. That second assertion is what caught the EPERM 500 — keep it.
- Browser binaries live in `C:\Users\crizt\AppData\Local\ms-playwright` (chromium-1243, 433 MB), outside the repo.

## Phase 10 — logging + README (done)

**Logging.** `src/server/logging/logger.service.ts` emits single-line JSON. Redaction lives beside it in `logger.rules.ts`, deliberately **without** `import "server-only"` so it is unit testable — the same split `contact.rules.ts`/`contact.service.ts` already uses. Do not add `server-only` to the rules file; it will break `tests/unit/logger-rules.test.ts`.

Every tRPC request carries a `requestId` (added in `createTRPCContext`) that appears on every line it produces, so a router-level warning and the central `onError` line can be tied together. Verified live: a honeypot submission produced `contact.rejected` and `trpc.request_failed` sharing one id.

Redaction drops values under credential- or personal-shaped keys (`SENSITIVE_KEY_FRAGMENTS` in `src/data/logging.data.ts`), masks Supabase keys / JWTs / bearer tokens found anywhere in free text, caps nesting depth, and truncates long strings. **Call sites must keep passing only non-identifying fields** — a rejection reason, a tRPC path, an error code. Never pass contact names, emails or message bodies, even though redaction would catch them; defence in depth, not a licence.

**README.** Rewritten from the shadcn template. Covers prerequisites, first run, every script, env vars, service URLs, both test tiers, layout, the Turbopack issue and a Deferred section. `AGENTS.md` left untouched, as the plan requires.

**`pnpm supabase:server`** (user request, mid-phase) starts Supabase and prints **only** service URLs. Plain `supabase start` echoes `SECRET_KEY`, `SERVICE_ROLE_KEY` and `JWT_SECRET` into the terminal; this does not. `pnpm db:status` is still how you read the keys when filling `.env.local`, and the README says so.

**Gate passed properly:** cloned the repo to a scratch directory, `pnpm install`, `cp .env.example .env.local`, filled the two keys from `pnpm db:status`, `pnpm dev` — 200 / 200 / 200 / 307 across `/`, `/login`, `/forgot-password`, `/dashboard`.

## Next: Phase 11 — final verification

Three boxes remain. Read the phase in `plans/project-foundation.md` before starting; do not infer them from this file.

## Open items for the user

- **Site metadata is placeholder** — `"Criztian — Portfolio"` / `"Personal portfolio and contact."` in `src/app/layout.tsx`. Real copy still needed, plus the three section headings (Work / About / Contact) in `src/app/page.tsx`.
- **Commit author is `criztiandev`** (lowercase, guessed from the email when git had no identity). GitHub handle is `Criztiandev`. Offered a rewrite; the user has not decided.
- **Browser walkthrough not fully confirmed.** Login is confirmed working from the user's own logs. The password-reset-through-Mailpit round trip and the contact form's rendered success state have been verified by HTTP/curl but not visually.

## What NOT to do

- Do not add TanStack Table, Charts, Markdown or Highlight. Deliberately deferred — three of the four are alpha and there is no dataset or blog content to design against.
- Do not add an `owner_accounts` table, a rate-limit table with an atomic RPC, idempotency keys, a notification state machine, or `docs/*.md`. All explicitly cut as over-engineering for a one-user site; rationale is in the plan's cut list.
- Do not write the Resend adapter. The `EmailAdapter` interface exists; the real implementation waits until deployment so it is written against the live API rather than a mock.
- Do not add integration tests. Two tiers only — Vitest unit and Playwright e2e.
- **Do not add Jotai, Zustand or Redux.** Asked on 2026-09-20 on the belief that no global state manager existed; one does — `@tanstack/react-store`, shipped and tested in Phase 5 (`portfolio-ui.store.ts`, `portfolio-store.provider.tsx`, `use-portfolio-ui.hook.ts`). Total global state is one boolean and one enum. The user chose to keep TanStack Store rather than migrate or run two libraries.
- Do not run `/codex:review` unless asked; the user declined it once already.
