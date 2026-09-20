# criztian-portfolio

A personal portfolio site: one public scrolling page with a contact form, plus a
password-protected owner dashboard. Runs entirely locally — Supabase, Postgres
and the mail inbox all run in Docker on your machine. Nothing is deployed.

|           |                                               |
| --------- | --------------------------------------------- |
| Framework | Next.js 16.3.4 (App Router)                   |
| Language  | TypeScript, React 19                          |
| Data      | tRPC 11 + TanStack Query 5                    |
| UI state  | TanStack Store                                |
| Styling   | Tailwind CSS 4 + shadcn/ui                    |
| Backend   | Supabase (Postgres, Auth) via `@supabase/ssr` |
| Forms     | React Hook Form + Zod 4                       |
| Tests     | Vitest (unit), Playwright (end-to-end)        |

## Prerequisites

| Requirement        | Notes                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Node.js 24+**    | Enforced by `engines` in `package.json`.                                                 |
| **pnpm 10.34.5**   | Pinned via `packageManager`. Use `corepack enable` rather than installing pnpm globally. |
| **Docker Desktop** | Must be **running** before any Supabase command. Verify with `docker info`.              |

Supabase binds ports **54321–54324**. On Windows these can collide with
Hyper-V/WSL2 reserved ranges, which fails with a confusing socket-permission
error rather than a port-conflict one. Check with
`netsh interface ipv4 show excludedportrange protocol=tcp` and remap in
`supabase/config.toml` if the ranges overlap.

## First run

```bash
git clone https://github.com/Criztiandev/criztian-portfolio.git
cd criztian-portfolio
pnpm install
```

Start Docker Desktop, then bring up Supabase. This pulls several container
images the first time and takes a few minutes:

```bash
pnpm supabase:server
```

It prints the local service URLs when it is ready.

Now create your environment file:

```bash
cp .env.example .env.local
```

Fill it in with the keys from:

```bash
pnpm db:status
```

Copy `PUBLISHABLE_KEY` into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and
`SECRET_KEY` into `SUPABASE_SECRET_KEY`, and set `OWNER_EMAIL` to the address
you want contact notifications addressed to. `pnpm supabase:server`
deliberately prints only URLs, never keys — `pnpm db:status` is where the
secrets live.

Then start the app:

```bash
pnpm dev
```

Open <http://localhost:3000>.

The app validates its environment at import time, so a missing or malformed
variable fails immediately with a message naming the offending key rather than
failing mysteriously later.

### Creating the owner account

Public signup is disabled, so the single owner account is created by hand
through Supabase Studio (<http://127.0.0.1:54323>) under **Authentication →
Users**. Do not commit the password.

## Environment variables

Copy `.env.example` to `.env.local`. `.env.local` is gitignored; `.env.example`
is committed and should never contain a real secret.

| Variable                               | Scope      | Purpose                                                        |
| -------------------------------------- | ---------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                  | public     | Base URL for metadata and auth redirects.                      |
| `NEXT_PUBLIC_SUPABASE_URL`             | public     | Local Supabase API, `http://127.0.0.1:54321`.                  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public     | `sb_publishable_…`. Ships in the browser bundle.               |
| `SUPABASE_SECRET_KEY`                  | **server** | `sb_secret_…`. Server only — never prefix with `NEXT_PUBLIC_`. |
| `OWNER_EMAIL`                          | server     | Where contact notifications are addressed.                     |
| `EMAIL_MODE`                           | server     | `preview` — writes an HTML file instead of sending.            |

Supabase now issues opaque `sb_publishable_` / `sb_secret_` keys. The older
`eyJ…` JWT keys are rejected at startup with an explanatory error.

## Scripts

**Develop**

| Script       | Does                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| `pnpm dev`   | Dev server on :3000. Runs webpack, not Turbopack — see [Known issues](#known-issues). |
| `pnpm build` | Production build (Turbopack).                                                         |
| `pnpm start` | Serve a production build.                                                             |

**Supabase**

| Script                 | Does                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `pnpm supabase:server` | Start Supabase and print its service URLs. Prints no keys.          |
| `pnpm db:status`       | Full status as JSON, **including the keys** for `.env.local`.       |
| `pnpm db:stop`         | Stop the containers.                                                |
| `pnpm db:reset`        | Drop and replay all migrations. **Destroys local data.**            |
| `pnpm db:types`        | Regenerate `src/types/database.type.ts` from the live local schema. |
| `pnpm db:start`        | Plain `supabase start`, without the URL summary.                    |

**Quality**

| Script                              | Does                                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm check`                        | `format:check` + `lint` + `typecheck`. Run this before committing.                                    |
| `pnpm lint` / `pnpm lint:fix`       | ESLint.                                                                                               |
| `pnpm format` / `pnpm format:check` | Prettier.                                                                                             |
| `pnpm typecheck`                    | `next typegen && tsc --noEmit`. Both halves are required — `tsc` alone does not validate route types. |

**Test**

| Script                 | Does                                |
| ---------------------- | ----------------------------------- |
| `pnpm test:unit`       | Vitest, `tests/unit/**`.            |
| `pnpm test:unit:watch` | Vitest in watch mode.               |
| `pnpm test:e2e`        | Playwright, `tests/e2e/**`.         |
| `pnpm test:e2e:ui`     | Playwright's interactive UI runner. |

A pre-commit hook runs ESLint and Prettier over staged files.

## Local services

Available once `pnpm supabase:server` has finished.

| Service               | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| App                   | <http://localhost:3000>                                   |
| Supabase API          | <http://127.0.0.1:54321>                                  |
| Studio                | <http://127.0.0.1:54323>                                  |
| Mailpit (auth emails) | <http://127.0.0.1:54324>                                  |
| Postgres              | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Password-reset and confirmation emails are not delivered to real inboxes — they
land in Mailpit.

Contact-form notifications are different: they are written as inspectable HTML
files to `.local/email-previews/` while `EMAIL_MODE=preview`. Nothing is sent.

## Testing

Two tiers, no integration tier.

**Unit** — Vitest with jsdom, covering the contact schema, the anti-spam rules,
the portfolio UI store, the section navigation component, environment
validation, log redaction, the notification template and the email preview
writer.

```bash
pnpm test:unit
```

**End-to-end** — Playwright against Chromium. Two specs: the contact happy path,
and `/dashboard` redirecting a logged-out visitor to `/login`.

Before the first run, download the browser. This is a **~120 MB** download and
is stored outside the repo, in your user profile:

```bash
pnpm exec playwright install chromium
```

Then:

```bash
pnpm test:e2e
```

The e2e suite **runs a production build first** (`pnpm build && pnpm start`)
rather than using the dev server, so a run takes roughly 15 seconds. This keeps
it deterministic and independent of dev-server bundler behaviour. If you already
have a server on :3000 it will reuse that instead of building.

Two deliberate properties of the contact spec, so they do not get "simplified"
into failures:

- The form rejects submissions made in under two seconds as bot traffic, so the
  spec waits it out. The wait is derived from the app's own constant — do not
  weaken the check to make the test faster.
- Submissions are rate-limited to five per hour per hashed IP. Each run sends a
  unique `x-forwarded-for`, so repeat runs get their own bucket instead of
  tripping the limit. Do not clear the table to work around this.

## Project layout

```
src/
  app/            routes; (auth) and (owner) groups, /api/trpc handler
  components/ui/  vendored shadcn output — do not hand-edit
  config/         environment validation, fails fast at import
  data/           static values and constants
  emails/         notification templates
  features/       per-feature code: auth, contact, portfolio
  lib/            Supabase clients, tRPC client, query factory
  providers/      React context providers
  server/         server-only code: tRPC init, logging, integrations
  types/          all TypeScript types
  proxy.ts        request proxy (Next 16's middleware); must live inside src/
supabase/         migrations, config, email templates
tests/unit/       Vitest
tests/e2e/        Playwright
plans/            build plan and session handoff notes
```

Types live in `src/types/`, static data in `src/data/` — never inline in a
feature file.

## Logging

Server errors are logged as single-line JSON through
`src/server/logging/logger.service.ts`. Every tRPC request carries a
`requestId` that appears on each line it produces, so one failure can be traced
across layers.

Log output is redacted before it is written: keys matching credentials or
personal data are replaced, values that look like Supabase keys, JWTs or bearer
tokens are masked wherever they appear, and long strings are truncated. Contact
message bodies and submitter details are never logged. `tests/unit/logger-rules.test.ts`
enforces this.

## Known issues

**`next dev` runs webpack, not Turbopack.** Turbopack's dev server rewrites
`.next` manifests per route and on Windows the rename fails with `EPERM`: the
first route compiled serves fine and every route after it returns a 500. Next 16
makes Turbopack the default, so `dev` passes `--webpack` explicitly. This is
upstream ([#57581](https://github.com/vercel/next.js/issues/57581),
[#92298](https://github.com/vercel/next.js/issues/92298)), not a project
problem. `next build` is unaffected and still uses Turbopack, so nothing about
the production output changes. Revisit when those issues close.

**`supabase_vector` crash-loops.** Cosmetic. It only feeds Studio's Logs pane.

## Deferred

None of the following is configured. They are recorded here so the gaps are
deliberate rather than forgotten.

| Deferred          | Current state                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Hosted Supabase   | Local Docker only. No hosted project, no linked remote.                                                  |
| Vercel deployment | No deployment of any kind. No Vercel project or CI.                                                      |
| Resend live email | `EmailAdapter` exists with a preview-only implementation. No provider, no API key, nothing is ever sent. |
| Dashboard data    | `/dashboard` authenticates and shows who is signed in. It does not yet read contact messages.            |
| Blog              | No content, no rendering pipeline, no Markdown tooling.                                                  |

## See also

`AGENTS.md` carries a warning that this version of Next.js differs from what
coding assistants expect. Leave it in place. `plans/` holds the build plan and
session handoff notes.
