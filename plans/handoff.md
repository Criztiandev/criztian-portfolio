# Handoff — criztian-portfolio

> Written for the next Claude Code session picking up this build. Both plans — `plans/project-foundation.md` and `plans/hero-and-editor.md` — are complete and are history now; read them for rationale, not for work remaining.
> State as of 2026-09-20, branch `project/portfolio`, remote `https://github.com/Criztiandev/criztian-portfolio`.

## Where things stand

| Workstream                                            | State                       |
| ----------------------------------------------------- | --------------------------- |
| Foundation — `plans/project-foundation.md`            | **complete** — 56 of 56     |
| Hero dot-field — Part A of `plans/hero-and-editor.md` | **complete** — Phases 0–10  |
| Live content editor — Part B of the same plan         | **complete** — Phases 11–15 |

All 115 boxes in the active plan are ticked. 126 unit tests across 14 files, 8 Playwright specs, `pnpm check` clean, `pnpm build` clean.

**Both plans are finished.** What remains is the user's own content and the deploy work — see [Open items](#open-items-for-the-user).

## Foundation — complete

**All phases complete. 56 of 56 boxes ticked. 59 unit tests and 2 e2e specs passing.**

The foundation plan is finished. What remains is the user's own content and the deploy work the plan deliberately excluded — see [Open items](#open-items-for-the-user).

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
| 11 Final verification                | done                                              |

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

`.env.local` exists and is gitignored, populated with real local Supabase keys. Owner account is `criztiandev@gmail.com`; **the password is known only to the user — never ask for it.** To exercise a logged-in flow, create a throwaway user via the admin API and delete it afterwards — `tests/e2e/owner-account.ts` does exactly this and is the working reference. Never ask the user for the password. Note that `auth.users` is currently **empty** (see Open items).

## The user's conventions — these override upstream docs

1. **No explanatory comments.** Zero narration in code. Rationale goes in this plan or the README. `src/components/ui/**` is vendored shadcn output and exempt.
2. **No single-letter names.** Anywhere — variables, parameters, callback args, imports. tRPC's canonical `const t = initTRPC...` is written `const trpc`.
3. **No dense one-liners.** Explicit `for...of` over `reduce`/chained pipelines; no `??=` or nested ternaries. `.map()` inside JSX is fine.
4. **All types in `src/types/`, all static data in `src/data/`**, never mixed, never inline in a feature file.

The user reacts badly to violations of these. They are also in `plans/project-foundation.md` under Conventions and in session memory.

## Environment landmines — all hit, all real

- **`EPERM: rename` → 500s in `next dev` is a Turbopack bug, not antivirus.** Solved 2026-09-20 by controlled experiment; the earlier "Windows Defender" diagnosis in this file was **wrong** and cost real time, so it is corrected here rather than softened. Symptom: on a cold `.next`, `/` serves 200 and every route compiled after it serves 500, with `EPERM` renaming `.next/dev/server/*-manifest.js` in `.next/dev/logs/next-development.log`. Ruled out, each by test: antivirus (adding `Add-MpPreference -ExclusionPath 'E:\Project'` as administrator changed nothing), concurrency (requests 4s apart fail identically), and orphaned servers (process tree was a single clean parent chain). Swapping only the bundler fixed it — `--webpack` gave 200/200/200/307/307 and **zero** EPERM on the same routes and same cold `.next`. Known upstream on Windows: [#57581](https://github.com/vercel/next.js/issues/57581), [#92298](https://github.com/vercel/next.js/issues/92298). `next build` is unaffected: it writes `.next` once instead of rewriting manifests per route.
- **Do not re-diagnose the above as a scanner problem.** If 500s reappear, check the bundler first. `Get-MpPreference` needs an elevated shell and tells you nothing useful here.
- **Never paste a real key into a test fixture, even the local Supabase one.** GitHub push protection blocked a push on 2026-09-20 because `tests/unit/logger-rules.test.ts` used this machine's actual `SUPABASE_SECRET_KEY` as redaction-test input. The push was rejected outright, so nothing reached GitHub, but the three offending commits had to be rewritten with `filter-branch` and force-pushed. The fixtures are now **built from parts** (`sb_secret_${"0".repeat(32)}`) so no secret-shaped literal exists in the source for a scanner to match. Keep them that way — collapsing them back into a plain string literal will re-block the push even if the value is fake.
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

10. **`useDotField` uses zero `useState`, not the one the plan specified.** `react-hooks/set-state-in-effect` is an **error** in this config, and status changes would otherwise re-render on a 60fps path. The hook writes `data-status` / `data-point-count` onto the DOM nodes instead, and the CSS and e2e specs key off those attributes. Strictly better; do not reintroduce state.
11. **`createDefaultSiteContent()` is a function in `site-content.rules.ts`, not a `DEFAULT_SITE_CONTENT` constant in `src/data`.** The convention says static data lives in `src/data`, but a composed constant there would need the schema, and the schema needs the primitive defaults from `src/data` — a runtime circular import. The primitives stay in `src/data/site-content.data.ts`; the composition is a function.
12. **Dot-field tuning values differ from the approved plan's table.** Corrected against screenshots rather than reasoning — see Part A above for which moved and why.
13. **Shader sources live in `src/features/portfolio/shaders/`, not `src/data/`.** They are program source, not tuning data, and keeping `hero.data.ts` purely numeric is what makes it usable as a tuning file. Flagged to the user as a judgment call; they did not object.
14. **The hero tagline now renders Tiptap JSON as HTML.** The Part A stopgap (`readRichTextPlainText`) survives only as the fallback inside `renderRichTextHtml`.
15. **The editor form seeds from the server draft, not a module-level `EMPTY_*` constant.** Phase 14 asked for the `login.form.tsx` shape exactly, but an editor pre-populated with empty values would erase the draft on first save. `defaultValues: buildEditorFormValues(initialContent)` is the only sensible reading of the phase as a whole, which also says "reloading the editor shows the persisted draft".
16. **There are three preview message types, not the plan's two.** `ready` was added because an iframe's `load` event fires before React hydrates inside it — see Part B for the full story. The plan already required two-way messaging, so this is within its design.
17. **`siteContentSchema` allowlists rich-text node and mark types.** The plan argued the Tiptap extension list removes the XSS surface, which is true, but the constraint manifests as a thrown `RangeError` rather than sanitisation, so an out-of-schema draft would crash the home page. The allowlist rejects it at the boundary and `renderRichTextHtml` catches anything that still gets through.
18. **The `disciplines` schema drops blank entries.** A fixed-slot editor necessarily produces empty strings; without this, every parse failed and the editor was inert. See Part B.
19. **`renderRichTextHtml` is a service, not a call inside `SitePage`.** The plan said to render server-side in `SitePage`, but `SitePage` also runs client-side inside the preview iframe, so the call has to work in both. `@tiptap/html` resolves per-environment and does.
20. **The dashboard links to the editor.** One line in `dashboard/page.tsx`; there was otherwise no way to reach `/dashboard/editor` from the UI.

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

## Phase 11 — final verification (done)

Evidence, so it does not have to be re-derived:

| Check                                            | Result                                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                     | pass                                                                                                             |
| `pnpm test:unit`                                 | 8 files, 59 tests                                                                                                |
| `pnpm exec playwright test`                      | 2 passed                                                                                                         |
| `pnpm build`                                     | pass, from a removed `.next`                                                                                     |
| Secret key in `.next/static`                     | **absent**                                                                                                       |
| Secret key in `.next/server`                     | absent — read from `process.env` at runtime, never inlined                                                       |
| `sb_secret_` in client bundle                    | 1 hit, and it is **not** a leak: the literal help text in `LEGACY_JWT_MESSAGE`. Expect this hit; do not "fix" it |
| Email provider SDK installed                     | none                                                                                                             |
| `EMAIL_MODE` accepted values                     | `"preview"` only — the enum makes sending unreachable, not merely unconfigured                                   |
| Hosted Supabase / Vercel / Resend host in `src/` | none                                                                                                             |
| Outbound `fetch`/`axios` in `src/server/`        | none                                                                                                             |
| Secrets or personal data in logs                 | 0 of 8 probed strings present                                                                                    |

## Hero dot-field — Part A (done)

The name renders as a grid of white dots sampled from the glyph outlines, carrying a slow idle wave, and the cursor opens a swirling vortex in it. Built from first principles — the reference site's own implementation is a dynamically-loaded third-party Framer plugin and was not copied.

**How it fits together**, outermost first:

| File                                                            | Role                                                                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                                              | Server component. Reads published content, passes `fontDisplay.style.fontFamily` down as a plain string.    |
| `src/features/portfolio/components/site-page.component.tsx`     | Renders the **whole public page** from a `SiteContent`. Part B's preview route renders this same component. |
| `src/features/portfolio/components/hero.component.tsx`          | The `#home` section, the fallback ladder, `motion` entrance.                                                |
| `src/features/portfolio/hooks/use-dot-field.hook.ts`            | All GL lifecycle. **Two effects** — see the warning below.                                                  |
| `src/features/portfolio/services/dot-field-sampler.service.ts`  | Canvas2D: font gate, measure, `fillText`, `getImageData`.                                                   |
| `src/features/portfolio/services/dot-field-renderer.service.ts` | WebGL2 plumbing: compile, link, VAO, uniforms, draw.                                                        |
| `src/features/portfolio/shaders/*.ts`                           | GLSL as template literals.                                                                                  |
| `src/features/portfolio/dot-field.rules.ts`                     | The pure layer. No DOM, no GL. Everything worth unit-testing lives here.                                    |
| `src/data/hero.data.ts`                                         | `DOT_FIELD_TUNING` — **every** magic number. Tune the look here and nowhere else.                           |

**Do not merge the two effects in `use-dot-field.hook.ts`.** The first creates the GL context and owns the RAF loop and listeners; its deps are stable. The second samples the glyphs and uploads the buffer, keyed on `[text, fontFamily]`. That split is the entire reason Part B's live editing is viable: a keystroke re-runs only the geometry effect. Putting `text` in the first effect's deps tears down and recreates a WebGL context per keystroke, which stutters visibly and eventually exhausts the browser's ~16-context limit.

**The vortex maths, so nobody "simplifies" it.** The spiral arms come from _shear_, not rotation — a rigid rotation of the disc produces no arms. The rotation angle is `uVortexSwirl * falloff` where `falloff` decreases with radius, so inner material winds up relative to outer. The outward push is then applied along the **rotated** vector (`swirled / max(distance, 1.0)`), which moves material out _along_ the arm and keeps it coherent as the hole opens. Push along the un-rotated vector gives straight spokes instead.

**Tuning is empirical and was corrected against screenshots, not reasoning.** The first render was wrong in two ways worth remembering:

- `maxHeightRatio` is measured against the **hero stage container**, which is `h-[42vh]`, not the viewport. The plan's `0.42` therefore double-applied and capped the font at ~159 px so the width constraint never bound — the word came out a third of its intended size and read as thin dotted outlines. `0.85` is correct for a 42vh stage. **If the stage height changes, this needs rechecking.**
- `vortexFade: 0.85` dimmed displaced dots to 15% opacity, so the vortex _erased_ the spiral arms instead of showing them. It is now `0.25`.

Values that moved from the plan's table after looking at the result: `maxHeightRatio` 0.42→0.85, `vortexFade` 0.85→0.25, `vortexShrink` 0.45→0.2, `vortexRadius` 180→220, `vortexPush` 120→85, `dotSize` 2.8→3.2, `dotEdgePixels` 1.5→1. Screenshots were taken at DPR 1; on a DPR 2 display the field is denser and crisper.

**Font-loading facts, verified against this project's real CSS output** — they invert the usual advice:

- **next/font in Next 16 does not hash family names.** The emitted variable is `--font-display: 'Antonio', 'Antonio Fallback'`, not `__Antonio_e7cd54`. Hashed names were Next 13/14. Read the name from `fontDisplay.style.fontFamily` anyway so this never matters again.
- **The trap is the second face.** The loader also emits `font-family: Antonio Fallback; src: local(Arial)` with metric overrides. It is _always_ available, so `document.fonts.check` against the full stack returns `true` while Antonio has not downloaded, and the canvas silently samples metric-adjusted Arial. `parsePrimaryFontFamily` splits on the comma and checks index 0 only. Keep it that way.
- **`document.fonts.ready` alone is useless here.** It resolves when the current layout has no _pending_ loads, so if nothing has demanded the font yet it resolves immediately against an unloaded one. `document.fonts.load()` is the load-bearing call. `load()` resolves with `[]` rather than rejecting on an unknown family, so the `check()` afterwards is mandatory.
- `display: "block"` on the loader, not the default `"swap"`. With `swap` the browser paints metric-adjusted Arial for up to 3s and then swaps — and that swap can land _after_ sampling.

**Observability for tests.** The stage carries `data-status` (`idle` → `running`, or `unsupported`) and the canvas carries `data-point-count`. `tests/e2e/hero.spec.ts` asserts both: `data-status="running"` proves context creation, compilation, linking, the font gate, sampling, upload and first draw all succeeded, and `data-point-count > 500` is the only external signal that the sampler produced real geometry from the real font. If Antonio silently fails to load, the count moves and the test catches it. Headless Chromium has genuine WebGL2 via SwiftShader, so this path is really exercised.

## Live content editor — Part B (done)

`/dashboard/editor` is a three-pane editor: section list, live iframe preview, config panel. Typing retints and rewrites the preview in ~120 ms without a round trip; the draft autosaves ~800 ms after you stop; Publish promotes draft to published and revalidates `/`.

| File                                                                | Role                                                                                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/features/site-content/server/site-content.router.ts`           | `getDraft` / `saveDraft` / `publish`, all `ownerProcedure`. `revalidatePath("/")` here. |
| `src/features/site-content/server/site-content.service.ts`          | Admin-client reads and writes. Singleton row updated with `.gte("id", 0)`.              |
| `src/features/site-content/components/content-editor.component.tsx` | Three-pane shell. Owns `frameRef` and `pendingContentRef`, and the ready handshake.     |
| `.../editor-config-panel.component.tsx`                             | The form, both debounces, save + publish mutations.                                     |
| `.../editor-preview-pane.component.tsx`                             | Viewport toggle and the iframe.                                                         |
| `.../site-preview.component.tsx`                                    | Runs **inside** the iframe. Holds content in state, listens for messages.               |
| `src/features/site-content/rich-text.extensions.ts`                 | The one Tiptap extension list, shared by editor and renderer.                           |
| `src/features/site-content/services/rich-text-renderer.service.ts`  | `generateHTML` with a plain-text fallback.                                              |

### The iframe hydration race — the bug that cost the most here

**An iframe's `load` event fires before React hydrates inside it.** The editor originally posted the initial content from `onLoad`; the preview's `message` listener is attached in a `useEffect`, so that first message arrived before anything was listening and was silently dropped.

The fix is a handshake, and it is why there are **three** message types rather than the plan's two: when `SitePreview`'s effect attaches its listener it posts `{ type: "ready" }` to `window.parent`; the editor answers with the current `pendingContentRef.current`. `onLoad` is gone — do not reintroduce it, it is not a reliable readiness signal.

**This also breaks tests that look correct.** A Playwright spec that waits for the preview's `h1` and then types will fail intermittently: the `h1` is server-rendered, so it appears long before hydration. `tests/e2e/editor.spec.ts` waits for `[data-status='running']` **inside the frame** first — that attribute only appears after the client hook runs, so it is a true hydration signal. Three separate ad-hoc runs reported "live preview never updates" before this was understood; the preview was fine, the test was early.

### Empty form slots vs. a strict schema — silent, not loud

The discipline editor renders a fixed `HERO_MAX_DISCIPLINES` inputs. Slots with no value register as `undefined`, and `z.array(z.string())` rejects `undefined` — so `siteContentSchema.safeParse(values)` failed on **every** keystroke, and because the debounce handler returns early on a parse failure, **nothing happened at all**: no preview update, no save, no error anywhere. It looked like the subscription was not firing.

Two changes fix it, and both are worth keeping:

- `buildEditorFormValues()` / `padDisciplineSlots()` pad the form's defaults to empty strings, which the schema accepts.
- The `disciplines` schema now drops blank entries in a transform, so a cleared slot disappears instead of failing validation.

**The general lesson: a debounced handler that early-returns on a parse failure fails silently.** If the editor ever appears inert again, check the parse result before anything else.

### Tiptap facts, verified not assumed

- **`@tiptap/html` resolves to a different build under Node** (`./dist/server/index.js`) which requires **`happy-dom`** as a real peer dependency. pnpm auto-installed it; it is not in `package.json` and does not need to be.
- **`generateHTML` throws `RangeError` on any node or mark type outside the schema** — `Unknown node type: image`, `There is no mark type link in this schema`. A draft containing one would have crashed the public home page. Guarded twice: `siteContentSchema` now allowlists node and mark types (`RICH_TEXT_NODE_TYPES`, `RICH_TEXT_MARK_TYPES`), and `renderRichTextHtml` wraps the call in try/catch with an escaped plain-text fallback.
- **Text content is properly escaped.** `<img src=x onerror=alert(1)>` renders as `&lt;img src=x onerror=alert(1)&gt;`. Verified directly. So `dangerouslySetInnerHTML` in the hero is sound — the risk was a crash, never injection. The trimmed StarterKit yields exactly nodes `doc, paragraph, text, hardBreak` and marks `bold, italic`, and none of them carry attributes.
- The allowlists were confirmed by probing the built schema, not by reading the changelog.

### Lint rules that shaped the code

- **`react-hooks/refs` is an error, and it fires on _passing_ a ref-reading function during render** — not just on reading a ref. Both `form.handleSubmit(onSubmit)` and a `useMutation({ onMutate })` option were rejected when the function touched a timer ref. The explicit-submit "cancel the pending debounce" step was dropped as a result; a duplicate save writes identical content, so it costs nothing.
- **`react-hooks/incompatible-library` warns on `form.watch()`.** Use `form.subscribe({ formState: { values: true }, callback })` for the effect subscription and `useWatch({ control, name })` for render subscriptions. Both are memoization-safe and warning-free.

### Testing the logged-in flow without the user's password

`tests/e2e/owner-account.ts` creates a throwaway confirmed user through the Supabase admin API in `beforeAll` and deletes it in `afterAll`. It reads credentials from the environment via `process.loadEnvFile(".env.local")` (Node 24 built-in) — **no key is ever written into a fixture**, per the push-protection landmine above.

**`tests/e2e/hero.spec.ts` asserts the published hero name is literally `Criztian`.** Any manual publish of a test value breaks it — that happened here and was traced in minutes only because the failure names the expected text. `editor.spec.ts` reads the current name first and restores it at the end, so the suite is idempotent; keep it that way.

## Gotchas discovered building Part A

- **TypeScript drops narrowing of a captured `const` inside a hoisted `function` declaration.** `const element = ref.current; if (element === null) return;` then using `element` inside `function inner() {}` errors with "possibly null" — confirmed with a minimal two-function repro, no other variables involved. The fix used throughout `use-dot-field.hook.ts` is an explicitly typed alias after the guard (`const container: HTMLElement = containerElement`). Arrow functions assigned to consts behave the same way. Do not "clean this up" back into a single declaration.
- **`aria-hidden` on a wrapper removes everything inside it from the accessibility tree.** It was briefly on the stage div, which contains both the canvas and the `<h1>` — so the heading vanished for screen readers. `tests/e2e/hero.spec.ts` caught it on the first run. It belongs on the canvas alone.
- **`motion/react` ships no `"use client"` directive** — the `.` and `./react` entries are a plain CJS re-export of `framer-motion`; only `./react-client` carries it. Importing `MotionConfig` straight into a server layout is asking for trouble. `src/providers/motion.provider.tsx` carries the directive instead, matching the existing provider pattern.
- **`react-hooks/set-state-in-effect` is an error here**, so `useDotField` uses **zero** `useState` and communicates through `data-` attributes. This is better than the plan's one-`useState` design anyway: nothing in the render path changes at 60fps.
- **Zod 4's `.default()` types against the _output_.** A nested object whose fields all have defaults cannot take `.default({})`. Use **`.prefault({})`**, which runs the value through parsing. Zod 4.6.5 also supports getter-based recursion, which is how the rich-text node schema is defined without a hand-written recursive type.
- **`pg_column_size` is not immutable enough for a check constraint.** The size guards use `length(draft::text)` instead.
- **Large TypeScript files defeat bash heredocs on this box.** A file mixing backticks, `${}`, quotes and regex literals will fail the whole command with `unexpected EOF while looking for matching`, and because bash parses before executing, _nothing_ in that command runs — including earlier statements that looked independent. Use the Write tool for those.
- **`python` is not installed** (noted again in Environment landmines above).

## Open items for the user

- **Site metadata is placeholder** — `"Criztian — Portfolio"` / `"Personal portfolio and contact."` in `src/app/layout.tsx`. Hero copy is now database-driven and editable (`site_content.draft`); the Project / About / Services / Blog section bodies in `site-page.component.tsx` are still placeholders and are **not** yet editable — Part B covers the hero only.
- **Commit author is `criztiandev`** (lowercase, guessed from the email when git had no identity). GitHub handle is `Criztiandev`. Offered a rewrite; the user has not decided.
- **Browser walkthrough not fully confirmed.** Login is confirmed working from the user's own logs. The password-reset-through-Mailpit round trip and the contact form's rendered success state have been verified by HTTP/curl but not visually.
- **The local Supabase has no users at all.** Listed on 2026-09-20 after Part B: `auth.users` is empty, so `criztiandev@gmail.com` cannot log in locally and `/dashboard/editor` is unreachable without recreating it. This was already the case before that session's cleanup, which deleted only its own two throwaway addresses (`editor-probe@`, `editor-e2e@`) and logged each. A likely cause is an earlier `pnpm db:reset`, which drops auth rows along with everything else. Recreate with the admin API, or sign up once with `[auth] enable_signup` temporarily true.
- **The e2e suite reuses a dev server if one is on :3000.** `reuseExistingServer` is on outside CI, so `pnpm test:e2e` silently skips `pnpm build && pnpm start` when `pnpm dev` is already running — which is how it ran here. Stop the dev server first for a run that genuinely exercises the production build. `pnpm build` was verified separately and is clean.
- **One pre-existing build warning, not from Part B.** Turbopack flags `path.join(process.cwd(), EMAIL_PREVIEW_DIRECTORY)` in `email-preview.adapter.ts` as dynamic filesystem access that traces the whole project into the server bundle. Harmless locally; worth fixing before deploying, either by scoping the path statically or with a `turbopackIgnore` comment.

## What NOT to do

- Do not add TanStack Table, Charts, Markdown or Highlight. Deliberately deferred — three of the four are alpha and there is no dataset or blog content to design against.
- Do not add an `owner_accounts` table, a rate-limit table with an atomic RPC, idempotency keys, a notification state machine, or `docs/*.md`. All explicitly cut as over-engineering for a one-user site; rationale is in the plan's cut list.
- Do not write the Resend adapter. The `EmailAdapter` interface exists; the real implementation waits until deployment so it is written against the live API rather than a mock.
- Do not add integration tests. Two tiers only — Vitest unit and Playwright e2e.
- **Do not add Jotai, Zustand or Redux.** Asked on 2026-09-20 on the belief that no global state manager existed; one does — `@tanstack/react-store`, shipped and tested in Phase 5 (`portfolio-ui.store.ts`, `portfolio-store.provider.tsx`, `use-portfolio-ui.hook.ts`). Total global state is one boolean and one enum. The user chose to keep TanStack Store rather than migrate or run two libraries.
- Do not run `/codex:review` unless asked; the user declined it once already.
- **Do not merge the two effects in `use-dot-field.hook.ts`.** The split is what makes Part B's live editing possible — see Part A above.
- **Do not put the editor preview route outside `/dashboard/`.** Both auth layers are path-based; anywhere else serves unpublished drafts to the public.
- Do not add three.js, `@react-three/fiber` or `ogl`. The hero is ~220 lines of raw WebGL2 with no dependency surface, and the vertex shader would be identical under any of them. This was weighed and rejected with the user.
- Do not raise `dotPitch` chasing a point count. Per-frame cost is O(1) in point count — the pitch is purely an aesthetic control.
- **Do not post to the preview iframe from its `onLoad`.** The load event fires before React hydrates inside it, so the message is dropped. Use the `ready` handshake — see Part B.
- **Do not make the preview wait on a server round trip.** The 80 ms postMessage path and the 800 ms `saveDraft` path are deliberately independent; collapsing them into one is what makes typing feel slow.
- **Do not loosen the rich-text node/mark allowlist without widening the Tiptap extension list to match.** They are two halves of one invariant; `generateHTML` throws on anything the schema lets through that the extensions do not know.
- Do not publish a test hero name and leave it. `tests/e2e/hero.spec.ts` asserts `Criztian`.
