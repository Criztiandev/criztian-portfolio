# Handoff — criztian-portfolio foundation

> Written for the next Claude Code session picking up this build. Read this, then `plans/project-foundation.md` for the full plan.
> State as of 2026-09-20, commit `ccda3a6`, branch `main`, pushed to `https://github.com/Criztiandev/criztian-portfolio`.

## Where things stand

**Phases 0–8 complete and verified. 48 of 56 boxes ticked. 13 commits. 49 unit tests passing.**

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
| **9 Playwright e2e**                 | **NOT STARTED — do this next**                    |
| 10 Logging + README                  | not started                                       |
| 11 Final verification                | not started                                       |

`pnpm check`, `pnpm test:unit` and `pnpm build` are all green at `ccda3a6`.

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

Scripts: `dev` `build` `start` `lint` `lint:fix` `format` `format:check` `typecheck` `check` `test:unit` `test:unit:watch` `db:start` `db:stop` `db:status` `db:reset` `db:types`.

`.env.local` exists and is gitignored, populated with real local Supabase keys. Owner account is `criztiandev@gmail.com`; **the password is known only to the user — never ask for it.** To exercise a logged-in flow, create a throwaway user via the admin API and delete it afterwards (see commit `15fbd79`), or ask the user to drive the browser.

## The user's conventions — these override upstream docs

1. **No explanatory comments.** Zero narration in code. Rationale goes in this plan or the README. `src/components/ui/**` is vendored shadcn output and exempt.
2. **No single-letter names.** Anywhere — variables, parameters, callback args, imports. tRPC's canonical `const t = initTRPC...` is written `const trpc`.
3. **No dense one-liners.** Explicit `for...of` over `reduce`/chained pipelines; no `??=` or nested ternaries. `.map()` inside JSX is fine.
4. **All types in `src/types/`, all static data in `src/data/`**, never mixed, never inline in a feature file.

The user reacts badly to violations of these. They are also in `plans/project-foundation.md` under Conventions and in session memory.

## Environment landmines — all hit, all real

- **Windows Defender caused `EPERM: rename` → intermittent `GET / 500`** in `next dev`. Fixed by `Add-MpPreference -ExclusionPath 'E:\Project'`. If 500s reappear, check the exclusion still exists.
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

## Next: Phase 9 — Playwright

```
- [ ] Add @playwright/test and run `pnpm exec playwright install chromium` (~120 MB)
- [ ] Two specs only: contact happy path at /#contact, and /dashboard redirecting when logged out
- Gate: pnpm exec playwright test — both pass
```

Notes for whoever writes these:

- The contact form's timing check rejects submissions faster than 2 seconds. A Playwright spec that fills and submits instantly **will be rejected**. Either wait, or seed `renderedAt` — do not weaken the check to make a test pass.
- Rate limit is 5 per hour per hashed IP. Repeated e2e runs against a persistent DB will start failing. Clear `contact_messages` between runs or use `pnpm db:reset`.
- The logged-out `/dashboard` spec needs no credentials — that is why it was chosen.
- Add `playwright.config.ts` and `tests/e2e/`. Do not put e2e specs where `vitest.config.ts` picks them up (`include` is `tests/unit/**`).

Then Phase 10 (logging + README rewrite — README is still the unmodified shadcn template) and Phase 11 (final verification).

## Open items for the user

- **Site metadata is placeholder** — `"Criztian — Portfolio"` / `"Personal portfolio and contact."` in `src/app/layout.tsx`. Real copy still needed, plus the three section headings (Work / About / Contact) in `src/app/page.tsx`.
- **Commit author is `criztiandev`** (lowercase, guessed from the email when git had no identity). GitHub handle is `Criztiandev`. Offered a rewrite; the user has not decided.
- **Browser walkthrough not fully confirmed.** Login is confirmed working from the user's own logs. The password-reset-through-Mailpit round trip and the contact form's rendered success state have been verified by HTTP/curl but not visually.

## What NOT to do

- Do not add TanStack Table, Charts, Markdown or Highlight. Deliberately deferred — three of the four are alpha and there is no dataset or blog content to design against.
- Do not add an `owner_accounts` table, a rate-limit table with an atomic RPC, idempotency keys, a notification state machine, or `docs/*.md`. All explicitly cut as over-engineering for a one-user site; rationale is in the plan's cut list.
- Do not write the Resend adapter. The `EmailAdapter` interface exists; the real implementation waits until deployment so it is written against the live API rather than a mock.
- Do not add integration tests. Two tiers only — Vitest unit and Playwright e2e.
- Do not run `/codex:review` unless asked; the user declined it once already.
