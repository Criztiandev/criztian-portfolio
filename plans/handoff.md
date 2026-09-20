# Handoff — criztian-portfolio foundation

> Written for the next Claude Code session picking up this build. Read this, then `plans/project-foundation.md` for the full plan.
> State as of 2026-09-20, commit `ccda3a6`, branch `main`, pushed to `https://github.com/Criztiandev/criztian-portfolio`.

## Where things stand

**Phases 0–9 complete and verified. 50 of 56 boxes ticked. 49 unit tests and 2 e2e specs passing.**

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
| **10 Logging + README**              | **NOT STARTED — do this next**                    |
| 11 Final verification                | not started                                       |

`pnpm check`, `pnpm test:unit`, `pnpm build` and `pnpm exec playwright test` are all green.

## Start here

```bash
cd E:/Project/criztian-portfolio
pnpm exec supabase start     # Docker must be running
pnpm dev                     # http://localhost:3000
```

| Service               | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| App                   | http://localhost:3000                                     |
| Supabase API          | http://127.0.0.1:54321                                    |
| Studio                | http://127.0.0.1:54323                                    |
| Mailpit (auth emails) | http://127.0.0.1:54324                                    |
| Postgres              | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Scripts: `dev` `build` `start` `lint` `lint:fix` `format` `format:check` `typecheck` `check` `test:unit` `test:unit:watch` `test:e2e` `test:e2e:ui` `db:start` `db:stop` `db:status` `db:reset` `db:types`.

`.env.local` exists and is gitignored, populated with real local Supabase keys. Owner account is `criztiandev@gmail.com`; **the password is known only to the user — never ask for it.** To exercise a logged-in flow, create a throwaway user via the admin API and delete it afterwards (see commit `15fbd79`), or ask the user to drive the browser.

## The user's conventions — these override upstream docs

1. **No explanatory comments.** Zero narration in code. Rationale goes in this plan or the README. `src/components/ui/**` is vendored shadcn output and exempt.
2. **No single-letter names.** Anywhere — variables, parameters, callback args, imports. tRPC's canonical `const t = initTRPC...` is written `const trpc`.
3. **No dense one-liners.** Explicit `for...of` over `reduce`/chained pipelines; no `??=` or nested ternaries. `.map()` inside JSX is fine.
4. **All types in `src/types/`, all static data in `src/data/`**, never mixed, never inline in a feature file.

The user reacts badly to violations of these. They are also in `plans/project-foundation.md` under Conventions and in session memory.

## Environment landmines — all hit, all real

- **Windows Defender causes `EPERM: rename` → intermittent 500s** in `next dev`. Fixed by `Add-MpPreference -ExclusionPath 'E:\Project'`. **This recurred on 2026-09-20** — a cold `next dev` reliably 500s on the second route compiled, failing the e2e run, with `EPERM` on `.next/dev/server/*-manifest.js` in `.next/dev/logs/next-development.log`. Reading or re-adding the exclusion needs an **elevated** PowerShell (`Get-MpPreference` returns "Must be an administrator"), so it could not be verified or re-applied from this session. **Ask the user to re-run the `Add-MpPreference` line as administrator.** Phase 9 sidesteps it by running e2e against a production build; `pnpm dev` itself is still exposed.
- **Never `taskkill /F` the dev server.** It leaves locked handles on `.next`, reproducing the same EPERM. Ctrl-C it, and `rm -rf .next` if it happens.
- **`/tmp` differs between bash and node** on this box. Bash's `/tmp` is `C:\Users\crizt\AppData\Local\Temp`; node resolves `/tmp` as `E:\tmp`. Use `process.env.TEMP` in node scripts.
- **`UID` is readonly in bash.** A `UID=$(...)` capture silently fails. Cost a leaked test user once.
- **`python` is not installed.** Use `node -e` for scripting.
- **`supabase_vector` container crash-loops** (`ConnectionRefused` on the Docker socket). Cosmetic — it only feeds Studio's Logs pane, but it makes plain `supabase status` print nothing. Use `supabase status -o json`. Can be silenced with `[analytics] enabled = false` in `config.toml` if it becomes annoying; the user has not asked for this.

## Version facts that contradict training data

- **Next.js 16.3.4.** `middleware.ts` is `src/proxy.ts` (inside `src/`, exporting `proxy`); `export const runtime` **throws** there. `cookies()`/`headers()`/`params`/`searchParams` are async with no sync fallback. Turbopack is default — never pass `--turbopack`. `next lint` is removed. `typecheck` must be `next typegen && tsc --noEmit` or route types go unchecked.
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
7. **Playwright's `webServer` runs `pnpm build && pnpm start`, not `pnpm dev`.** `next dev` rewrites `.next` manifests as it compiles each route and loses a rename race with the virus scanner on this machine, serving a 500 for the second route the suite visits. A production build writes `.next` once, before any test runs. Costs ~10s of build per run and buys a deterministic suite. Revert to `pnpm dev` once the Defender exclusion is confirmed back.
8. **Each e2e run sends a unique `x-forwarded-for`** (`2001:db8::<timestamp>`, the reserved documentation range). Next sets `x-forwarded-for` even on localhost, so every run previously hashed to one IP and the 5-per-hour limit would have rejected run 6 — the suite was one run from breaking when this was found. A per-run address gives each run its own bucket without deleting rows or weakening the limit. Prefer this over `db:reset` between runs.

## Phase 9 — Playwright (done)

`playwright.config.ts` plus `tests/e2e/contact.spec.ts` and `tests/e2e/dashboard.spec.ts`. Run with `pnpm test:e2e`.

What the specs had to work around, so nobody "simplifies" them back into failing:

- **The contact form's timing check rejects submissions faster than 2 seconds.** `contact.spec.ts` waits `MIN_SECONDS_BEFORE_SUBMIT` imported from `src/data/contact.data.ts` plus a margin, so changing the constant moves the test with it. Do not weaken the check to make a test faster.
- **Rate limiting is per hashed IP, 5 per hour, and localhost is not exempt.** See deviation 8 — each run sends its own `x-forwarded-for`.
- **e2e runs against a production build.** See deviation 7. `workers` is pinned to 1 for the same reason.
- `reuseExistingServer` is on outside CI. If you already have `pnpm dev` on :3000 the suite will reuse it and inherit the dev-server EPERM flakiness — stop it first, or expect a 500.
- The logged-out `/dashboard` spec needs no credentials; that is why it was chosen. It asserts the redirect lands on `/login?next=/dashboard` **and** that the Sign in button renders. That second assertion is what caught the EPERM 500 — keep it.
- Browser binaries live in `C:\Users\crizt\AppData\Local\ms-playwright` (chromium-1243, 433 MB), outside the repo.

## Next: Phase 10 — logging + README

- `src/server/logging/logger.service.ts` with request identifiers; keep passwords, tokens and message bodies out of logs.
- Rewrite `README.md` — still the unmodified shadcn template. **Carry over the Phase 9 box's unfinished clause: the README must note the ~120 MB `playwright install chromium` download.** Also document `test:e2e` and that e2e builds before it runs.
- Add a short "Deferred" section: hosted Supabase, Vercel, Resend live sending, dashboard data, blog. Present none of it as configured.

Then Phase 11 (final verification).

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
