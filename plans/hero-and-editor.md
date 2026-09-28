# Hero dot-field + live content editor

> Written 2026-09-20. Two features, one plan, deliberately sequenced so nothing is built twice.
> **Part A** — the landing hero: a dot-matrix wordmark with a cursor vortex.
> **Part B** — a three-pane content editor in the owner dashboard with live preview and publish.

## Context

The home page is three bare placeholder sections (`#work`, `#about`, `#contact`) under a sticky bordered `max-w-4xl` bar. No hero, no display typeface, no animation code, and all copy is hardcoded in `src/data/*.data.ts`.

Two things are wanted. First, a full-viewport black hero where the name is rendered as a dense grid of white dots sampled from the glyph shapes, carrying a slow idle wave and — under the cursor — a vortex that swirls the dots and pushes them outward, opening a hole with spiral arms and a bright rim. Second, an editor at `/dashboard/editor` where the site renders live in the centre, a section list sits on the left, and a config panel on the right changes text and colour with the preview updating as you type, until you hit Publish.

### The sequencing decision, and why it is the whole plan

These two features look independent and are not. If the hero is built reading hardcoded constants and the editor is added afterwards, the hero has to be torn open and re-plumbed to read from the database, and its tuning work gets revalidated against a different data path.

So **the content schema comes first**, before a single line of hero code. The hero reads from it on day one. The editor then only has to write to something that already exists. The existing `src/data/*.data.ts` constants do not disappear — they become the **seed defaults**, so the site renders correctly against an empty database and the editor has something to populate from.

This has one non-obvious consequence that shapes the hero's implementation, covered in Phase 7: because hero text becomes editable from the start, the WebGL hook must treat text as _changing input_, not as a constant. Getting that wrong means every keystroke in the editor tears down and rebuilds a WebGL context.

### Decisions made with the user

| Question           | Decision                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Nav destinations   | All six are anchors on the single home page. Placeholder sections added for the three that don't exist. |
| Display typeface   | **Antonio** (Google, variable `wght` 100–700, `latin`). Rendered at weight 700.                         |
| Header treatment   | Transparent overlay over the hero, solid + blurred once scrolled past.                                  |
| Hero in light mode | Always black. A full-bleed art piece; the rest of the page follows the theme.                           |
| Animation library  | **`motion`** (current name for Framer Motion) for the UI layer.                                         |
| Build order        | **Content schema first**, then hero, then editor.                                                       |
| Editable colours   | **Curated set of ~6**, not the full ~25-token shadcn set.                                               |
| Publish model      | **Draft + published only.** No version history.                                                         |
| Editable sections  | **Hero only**, for now. Schema designed so adding sections is a data change.                            |

### What "maximize efficiency" means concretely here

Five choices do the heavy lifting, and they are the reason this is one plan rather than two:

1. **Schema first** — no refactor pass, no work done twice.
2. **The preview is an iframe pointing at the real page** — zero duplicated components. There is no "editor version" of the site to keep in sync.
3. **Preview updates by `postMessage`, persistence is separate** — typing never round-trips the database.
4. **One Zod schema is the single source of truth** — content shape, write validation, TypeScript types and editor field generation all derive from it.
5. **Existing data constants become seed defaults** — the site works with an empty database, so there is no chicken-and-egg bootstrap problem and no migration of content.

## What the reference site actually does

Investigated directly rather than inferred from screenshots.

- The wordmark is **one `<canvas>`** filling its container, `background-color: rgba(0,0,0,0)` — transparent, so the black comes from the section behind it. The canvas receives the pointer.
- It is a third-party **Framer code component** (`data-code-component-plugin-id="84d4c1"`), dynamically imported at runtime. Its shader is not in the static HTML or any lazy chunk, and is not ours to copy — this is an original implementation of the same technique.
- The entrance is **Framer Motion**: the hero block ships as `opacity:0.001; transform:translateY(150px)` with a `data-framer-appear-id` and animates up. Worth reproducing.
- A false lead worth recording: the page contains the string `ogl`, but it comes from `-google|` inside a bot-detection regex, not the `ogl` WebGL library.

## Ground truth

Verified against the installed tree and real build output.

- `next@16.3.4`, `react@19.2.8`. `next/font/google` API unchanged.
- `Antonio` is in next/font's Google data: weights `100`–`700` plus `variable`, axis `wght` 100–700. Variable, so omit `weight`.
- Tailwind **v4.3.3**, CSS-first. Tokens in `@theme inline` in [globals.css](src/app/globals.css). `--font-heading` already declared.
- `eslint-plugin-react-hooks@^7` active, so React Compiler rules are **errors**: `set-state-in-effect`, `purity`, `immutability`, `refs`. `no-explicit-any` is an error.
- Prettier: no semicolons, double quotes, 2-space, 80 columns, LF. Named exports; `export default` only in framework route files.
- `pnpm dev` pinned to `--webpack` for a Windows Turbopack EPERM bug. Do not change.
- `tests/e2e/contact.spec.ts` does `page.goto("/#contact")` — `#contact` must survive.
- New dependencies: **`motion`**, **`@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/pm` + `@tiptap/html`** (all MIT). Verify each package's entry point and major version against its installed `package.json` before writing code — Tiptap v3 changed APIs.

### Font-loading facts that invert the usual advice

Checked against this project's real build output:

- **next/font in Next 16 does NOT hash family names.** Emitted CSS is `font-family: Geist`, `--font-sans: "Geist", "Geist Fallback"`. Hashed names were Next 13/14. Read the name from `fontDisplay.style.fontFamily` anyway so this never matters again.
- **The real trap is the fallback face.** The loader emits `font-family: Antonio Fallback; src: local(Arial)` with metric overrides. It is _always_ available, so `document.fonts.check('700 100px "Antonio", "Antonio Fallback"')` returns `true` while Antonio has not downloaded, and the canvas silently samples metric-adjusted Arial. **Split on the comma and check family index 0 only.**
- **`document.fonts.ready` alone is useless.** It resolves when the current layout has no _pending_ font loads — if nothing has demanded Antonio yet, it resolves immediately against an unloaded font. `document.fonts.load()` is the load-bearing call; it creates the demand. It resolves with `[]` rather than rejecting on an unknown family, so a `check()` afterwards is mandatory.
- **`ctx.font = ...` fails silently** if the value doesn't parse. Always quote the family and assert the read-back.

### jsdom 30.1.0 — probed directly

| API                                       | Present?        | Consequence                                                                                       |
| ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `IntersectionObserver` / `ResizeObserver` | **no**          | `ReferenceError` — would crash the header's existing passing suite                                |
| `document.fonts`                          | **no**          | `TypeError` on `document.fonts.load`                                                              |
| `matchMedia`                              | no              | Already stubbed in [setup.ts](tests/setup.ts), `matches: false`                                   |
| `requestAnimationFrame`                   | **yes**         | vitest defaults `pretendToBeVisual: true` — no stub needed                                        |
| `canvas.getContext("2d")` / `("webgl2")`  | **both `null`** | The renderer bails, so the text fallback is what unit tests see — exactly what they should assert |

`tests/unit/section-navigation.test.tsx` passes today and references only `#about` and `#contact`, both of which survive.

## Conventions

Recorded in `plans/handoff.md`; the user reacts badly to violations.

- **No explanatory comments.** None, anywhere, including the GLSL.
- **No single-letter names**, including callback parameters and loop indices.
- **No dense one-liners or HOF chains.** Explicit `for...of` over `reduce` and `.filter().map()`. No nested ternaries, no `??=`. `.map()` in JSX is fine.
- **All types in `src/types/`, all constants in `src/data/`.**
- Named function expressions for callbacks.
- Feature code in `src/features/<feature>/`, never `src/components/` (vendored shadcn only).
- Match the existing `contact` feature end to end for router/service/schema shape, `server-only` placement, `TRPCError` translation and `requestId` logging. Match the existing migrations for RLS and grant style.

---

# PART A — Content foundation and the hero

## Phase 0 — Harness, guards, libraries

**Prereqs:** none. Must be first — both features reach for globals jsdom lacks, and the header already has a passing suite that would start throwing.

- [x] Add `src/features/portfolio/browser-capability.rules.ts`: `hasIntersectionObserver()`, `hasResizeObserver()`, `hasFontLoadingApi()`, `prefersReducedMotion()`, `prefersFinePointer()`. Each also guards `typeof window === "undefined"` for prerender. No other file checks globals directly.
- [x] Extend [setup.ts](tests/setup.ts) in its existing `if (!window.x)` shape: stub `IntersectionObserver`, `ResizeObserver`, `document.fonts` (`{ ready: Promise.resolve(), load: …[], check: () => false, addEventListener, removeEventListener }`), and `HTMLCanvasElement.prototype.getContext` → `null`. The last silences jsdom's "Not implemented" stderr and makes the unsupported path explicit. Do **not** stub `requestAnimationFrame`.
- [x] `pnpm add motion`. Confirm the major and import path from `node_modules/motion/package.json` exports before using it.
- [x] Wrap the tree in `<MotionConfig reducedMotion="user">` in [layout.tsx](src/app/layout.tsx). Every `motion` component then honours the preference automatically. The dot field needs its own check — it is not a `motion` component.
- [x] **Gate:** `pnpm test:unit` passes (existing 8 suites), `pnpm check` exits 0.

## Phase 1 — Content schema, table, and read path

**Prereqs:** 0. This is the foundation both features sit on. Nothing else starts until it is green.

- [x] `src/features/site-content/schemas/site-content.schema.ts` — one Zod schema, the single source of truth. Shape:
  - `hero`: `name`, `taglineDocument` (Tiptap JSON), `scrollLabel`, `worksLabel`, `disciplines` (array of strings)
  - `theme`: the six curated colours — `pageBackground`, `bodyText`, `mutedText`, `accent`, `border`, `heroDot`, each a hex string with a regex constraint
  - Every field gets a `.default(...)` sourced from the existing constants, so `schema.parse({})` yields a complete valid document. **This is what makes an empty database safe.**
- [x] Derive types into `src/types/site-content.type.ts` via `z.input`/`z.output`, matching the existing `contact.type.ts` pattern. No hand-written duplicates.
- [x] `src/data/site-content.data.ts` — `DEFAULT_SITE_CONTENT`, built by parsing `{}` through the schema. Hero copy moves here from wherever it would otherwise be inlined.
- [x] Migration `supabase/migrations/<timestamp>_site_content.sql`. All lowercase SQL, schema spelled out, **no comments**, hand-picked round-hour timestamp — matching both existing migrations exactly.

  ```sql
  create table public.site_content (
    id bigint generated always as identity primary key,
    draft jsonb not null,
    published jsonb,
    draft_updated_at timestamptz not null default now(),
    published_at timestamptz,
    constraint site_content_draft_size
      check (pg_column_size(draft) <= 131072),
    constraint site_content_published_size
      check (published is null or pg_column_size(published) <= 131072)
  );

  create unique index site_content_singleton_idx
    on public.site_content ((true));
  ```

  Keeps the house `generated always as identity` primary key. The unique index on a constant expression is what makes the table structurally incapable of holding a second row — no application code enforces it. The size checks mirror the schema's own bounds the way the contact table mirrors its length limits in SQL.

- [x] **No `updated_at` trigger.** The repo has no trigger, no function and no `moddatetime` anywhere; `draft_updated_at` is set explicitly by the service on write. Do not introduce the first trigger for this.
- [x] Security block in the repo's fixed four-step order — `enable` → `revoke` → narrow `grant` → per-action policies. **The `revoke all` is the load-bearing line**; RLS alone is not the gate here, table privileges are.

  ```sql
  alter table public.site_content enable row level security;
  alter table public.site_content force row level security;

  revoke all on table public.site_content from anon, authenticated;

  grant select, update on table public.site_content to authenticated;

  create policy site_content_owner_select
    on public.site_content
    for select
    to authenticated
    using ((select auth.uid()) is not null);

  create policy site_content_owner_update
    on public.site_content
    for update
    to authenticated
    using ((select auth.uid()) is not null)
    with check ((select auth.uid()) is not null);
  ```

  One policy per action, never `for all` — the house convention. `(select auth.uid())` rather than a bare call, so the check is evaluated once rather than per row. `force row level security` so it applies to the table owner too.

- [x] **Nothing is granted to `anon`, and there is no `anon` policy.** The public site reads `published` server-side through the **admin client**, selecting only that column. That gives column-level separation RLS cannot express, and means an unpublished draft is unreachable from the browser under any circumstance. It is the same posture the second contact migration established after an anon INSERT policy turned out to let the browser bypass application checks.
- [x] Seed the single row in the migration with the defaults so a fresh `pnpm db:reset` yields a working site.
- [x] `pnpm db:types` to regenerate `src/types/database.type.ts`. Never hand-edit it. Note a `jsonb` column types as the generic `Json` union, which is effectively untyped — **the Zod parse at the service boundary is what actually gives you a typed document**, not the generated type.
- [x] `src/features/site-content/server/site-content.service.ts` (`import "server-only"` as the first line, blank line, then imports) — `readPublishedContent()` and `readDraftContent()`, both using `createSupabaseAdminClient()` instantiated per call inside the function, never at module level. Both parse through the Zod schema and **fall back to `DEFAULT_SITE_CONTENT` on a missing row or a parse failure**, so a malformed record degrades to a working site rather than a crash. Log failures as `logError({ event: "site_content.read_failed", requestId, details, error })` — dotted `feature.verb_past_tense` event names, and `details` carries only non-identifying scalars.
- [x] Pure helpers (defaults merging, publish-state comparison) go in `src/features/site-content/site-content.rules.ts`, which **must not** get `import "server-only"` — that is the unit-test boundary, and adding it there is a documented way to break the suite.
- [x] **Gate:** `pnpm db:reset` succeeds; a unit test asserts `schema.parse({})` equals `DEFAULT_SITE_CONTENT` and that a partial document fills in missing fields.

## Phase 2 — Display typeface

**Prereqs:** 1.

- [x] Create `src/config/fonts.config.ts` exporting `fontSans`, `fontMono`, `fontDisplay`. Move the existing Geist loaders here. `fontDisplay = Antonio({ subsets: ["latin"], variable: "--font-display", display: "block" })` — omit `weight`, it is variable.
- [x] **`display: "block"`, not the default `"swap"`.** With `swap` the browser paints metric-adjusted Arial for up to 3s then swaps — and _that swap is the race_; it can land after you sampled. `block` gives a short invisible period then the real font, correct for a hero whose fallback is an already-styled `<h1>`. Leave `preload` default-true.
- [x] Update [layout.tsx](src/app/layout.tsx) to import from the config and add `fontDisplay.variable`. Add `--font-display` to `@theme inline` in [globals.css](src/app/globals.css).
- [x] **Gate:** in the browser console, `getComputedStyle(document.documentElement).getPropertyValue("--font-display")` returns a real family. Confirm before writing any sampling code.

## Phase 3 — Hero types, tuning, navigation

**Prereqs:** 2.

- [x] `src/types/hero.type.ts`: `DotFieldStatus` (`"idle" | "running" | "unsupported"`), `DotFieldTuning`, `DotFieldViewport`, `DotFieldSample`, `DotFieldPointer`, `DotFieldUniforms`, `DotFieldRuntime`, `DotFieldSizeRequest`, `MeasureInkWidth`, `SiteHeaderPlacement`.
- [x] `src/data/hero.data.ts`: `DOT_FIELD_TUNING` plus `RESIZE_DEBOUNCE_MS`, `HEIGHT_CHANGE_IGNORE_PX`, `MAX_FRAME_DELTA_SECONDS`, `MAX_PIXEL_RATIO`, `VISIBILITY_ROOT_MARGIN`, `CONTEXT_OPTIONS`. Tuning is _appearance_, so it stays in code — only _content_ is editable.
- [x] **`hero.name` is stored proper-case (`"Criztian"`)** and uppercased by CSS. A literal `"CRIZTIAN"` in the DOM makes several screen readers spell it letter by letter. The canvas uppercases separately when sampling.
- [x] Widen `PortfolioSection` to `"home" | "project" | "about" | "services" | "blog" | "contact"`; add `placement` to `PortfolioNavigationItem`. Rewrite [navigation.data.ts](src/data/navigation.data.ts) as `PORTFOLIO_LEADING_NAVIGATION` (home, project, about), `PORTFOLIO_TRAILING_NAVIGATION` (services, blog), `PORTFOLIO_ACTION_NAVIGATION` (contact), composed into `PORTFOLIO_NAVIGATION` with spreads — no `.filter()` at call sites. `DEFAULT_PORTFOLIO_SECTION` → `"home"`.

### Tuning values

Lengths in **CSS pixels**, converted by `uPixelRatio` in the shader so there is exactly one conversion point. Pitch and dot size are in **device pixels**, so retina gets a finer field at constant physical dot size.

| Constant                                        | Value                                                     | Notes                                                                        |
| ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `dotPitch` / `dotSize` / `dotEdgePixels`        | `5` / `2.8` / `1.5`                                       | Device px.                                                                   |
| `alphaThreshold`                                | `40`                                                      | **Not 128.** See below.                                                      |
| `widthRatio` / `maxHeightRatio`                 | `0.72` / `0.42`                                           | Clamp both axes or short windows overflow vertically.                        |
| `minFontSize` / `maxFontSize` / `probeFontSize` | `48` / `900` / `100`                                      |                                                                              |
| `fontWeight`                                    | `700`                                                     | Antonio's heaviest axis value.                                               |
| `maxPointCount`                                 | `60000`                                                   | Backstop; `resolveDotPitch` coarsens past it.                                |
| `vortexRadius` / `vortexSwirl` / `vortexPush`   | `180` / `2.4` rad / `120`                                 | **Push must stay below radius** or the effect inverts.                       |
| `vortexFade` / `vortexShrink`                   | `0.85` / `0.45`                                           |                                                                              |
| `waveAmplitude` / `waveSecondaryAmplitude`      | `6` / `3`                                                 | Above ~10 the letters stop reading as letters.                               |
| `waveFrequency` / `waveSecondaryFrequency`      | `0.0042` / `0.011`                                        | rad per CSS px.                                                              |
| `waveSpeed` / `waveSecondarySpeed`              | `0.55` / `-0.31`                                          | Counter-rotating and incommensurate, so the idle loop has no visible period. |
| `pointerLerp`                                   | `0.14`                                                    | Frame-rate normalised — see Phase 7.                                         |
| `influenceEnterLerp` / `influenceLeaveLerp`     | `0.09` / `0.06`                                           | Closing slower than opening reads viscous, not elastic.                      |
| `autoPointer*`                                  | `0.27` / `0.41` freq, `0.3` / `0.18` amp, `0.7` influence | Incommensurate so the path never visibly repeats.                            |

**`alphaThreshold: 40` plus a per-point `coverage` value is the single biggest quality decision.** A hard 128 threshold discards every partially-covered edge cell and the letters come out visibly ragged. A low threshold that keeps the glyph alpha and uses it to scale both dot size and brightness turns a stair-stepped edge into a genuine antialiased halftone. This is what makes the wordmark look considered rather than pixelated.

**Why `vortexPush: 120` opens a clean hole.** The radial map `r → r + push(r)` with `radius: 180`:

| origin r | falloff | push | lands at |
| -------- | ------- | ---- | -------- |
| 0        | 1.000   | 120  | 120      |
| 20       | 0.933   | 112  | **132**  |
| 60       | 0.549   | 66   | **126**  |
| 100      | 0.174   | 21   | **121**  |
| 140      | 0.016   | 2    | 142      |

Everything from r=0 to r=100 lands in the band 121–132: a clean empty hole ~240 px across with a bright compressed rim. The map is deliberately **non-monotonic** (20→132 but 60→126) so dots fold past each other — with additive blending that rim glows, which is the signature detail. If it reads blown out, `vortexPush: 70` is the monotone, softer-rim alternative.

- [x] **Gate:** `DOT_FIELD_TUNING` typechecks, no `any`, no numeric literals left in any other file.

## Phase 4 — The pure layer

**Prereqs:** 3. `src/features/portfolio/dot-field.rules.ts` imports only `@/data` and `@/types`. Zero `document`, `window`, canvas or GL — mirroring the existing `contact.rules.ts` / `contact.service.ts` split.

- [x] `parsePrimaryFontFamily(fontFamily)` — split on `,`, index 0, trim, strip quotes. **This is what defends against the `Antonio Fallback` → `local(Arial)` trap.**
- [x] `buildFontShorthand(weight, fontSize, family)` — always quotes the family.
- [x] `resolveFontSize({ measureInkWidth, targetWidth, probeSize })` — measure at the probe, scale by ratio, measure once more, correct. Two measurements converge to <0.5%; binary search costs 8–10 for no more accuracy. `measureInkWidth` is **injected**, so this is testable with a fake and no canvas.
- [x] Measure **ink** width, not advance (`actualBoundingBoxLeft + actualBoundingBoxRight`), same for height, and centre off real ink metrics — `textBaseline: "middle"` centres the em box, so all-caps sits visibly low.
- [x] `samplePixelGrid(data, width, height, pitch, threshold)` — explicit nested `for` loops, reads alpha at `(rowY * width + columnX) * 4 + 3`, emits `x`, `y`, **and `coverage`** per point, returns a `Float32Array` of 3-tuples plus a count.
- [x] `resolveDotPitch`, `resolvePixelRatio`, `resolveAutoPointer`, and `applyFrameLerp(current, target, ratePerFrame, deltaSeconds)` = `current + (target - current) * (1 - Math.pow(1 - ratePerFrame, deltaSeconds * 60))`. **Without this the vortex is visibly twice as laggy at 60 Hz as at 120 Hz**, and most phones are 120 Hz.
- [x] `shouldRebuildPoints(previous, next)` — `true` on width or DPR change, ignores height deltas under `HEIGHT_CHANGE_IGNORE_PX`. **The mobile URL-bar guard is not optional**: browser chrome showing/hiding changes viewport height by 60–120 px and would otherwise trigger a full resample mid-scroll, repeatedly.
- [x] **Gate:** `pnpm test:unit` passes including `tests/unit/dot-field-rules.test.ts` (coverage listed in Phase 10).

## Phase 5 — Shaders and renderer

**Prereqs:** 4. Shader sources as template literals in `src/features/portfolio/shaders/`.

- [x] **Vertex shader.** One `vec3` attribute (`x`, `y`, `coverage`). Uniforms for resolution, pointer, influence, time, pixel ratio, dot size, and the vortex/wave groups. Per vertex:
  - Seed from `fract(float(gl_VertexID) * 0.6180339887)` — a low-discrepancy sequence that decorrelates neighbours. Drive ±14% size and ±22% brightness jitter from it. **This is what stops the lattice reading as screen-door moiré**, at zero cost.
  - Apply the two counter-rotating sine waves.
  - `proximity = 1.0 - smoothstep(0.0, radius, distanceToPointer)`; `falloff = proximity * proximity * uInfluence`. The squaring gives a flat plateau near the centre and a long soft tail; a linear falloff looks conical and mechanical.
  - Rotate the offset by `uVortexSwirl * falloff`. **The arms come from shear, not rotation** — a rigid rotation produces no arms. Because the angle decreases with radius, inner material winds up relative to outer: ~134° of differential twist across the disc.
  - Normalise the **rotated** vector (`swirled / max(distanceToPointer, 1.0)` — rotation preserves length, and the `max` is a branch-free zero guard) and push along it. Pushing along the rotated direction moves material _out along the arm_, which keeps the arms coherent as the hole opens.
  - Scale point size and alpha by `coverage`, the seed jitter, and `falloff`.
- [x] **Fragment shader.** Round dot from `gl_PointCoord`, AA edge as `uEdgePixels / vPointSize` so the rim stays ~1.5 device px regardless of vortex shrink. `discard` below threshold.
- [x] Context attributes `{ alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: "high-performance" }`. `antialias: false` because the fragment shader does its own — MSAA on points costs fill rate for nothing.
- [x] **Additive blending**: `blendFunc(SRC_ALPHA, ONE)`. Where the vortex piles dots into the rim, overlapping dots sum and the rim glows — the reference's signature. `ONE_MINUS_SRC_ALPHA` is the flat fallback if it reads blown out.
- [x] `createDotFieldProgram` throws with `getShaderInfoLog`/`getProgramInfoLog`. `attachShader` → `linkProgram` → `detachShader` → `deleteShader` immediately. Cache uniform locations once.
- [x] **Gate:** `pnpm check` exits 0. No React import, no `window` at module scope.

## Phase 6 — Sampler service

**Prereqs:** 5. `src/features/portfolio/services/dot-field-sampler.service.ts` — thin Canvas2D adapter, deliberately branch-free.

- [x] Creates an offscreen canvas, measures, sizes, fills the text, `getImageData`, hands the array to `samplePixelGrid`. Also exports `waitForDisplayFont`.
- [x] Optional `context.letterSpacing = "-0.02em"` to tighten the condensed look; `measureText` accounts for it. Feature-detect with `"letterSpacing" in context`.
- [x] **Gate:** a static dot field renders in the browser. Tune `dotPitch` / `dotSize` / `alphaThreshold` against real glyphs here, before any animation exists.

## Phase 7 — The hook

**Prereqs:** 6. **Exactly one `useState`** (`status`). Pointer state, RAF id, timestamps and the GL runtime live in refs — nothing per-frame touches React.

- [x] **Split the effects. This is the schema-first consequence and it matters.** Hero text is editable, so it _will_ change at runtime — on every keystroke in Part B's editor. Put GL context creation, program linking and listener wiring in an effect with **stable deps**, and geometry sampling + `setGeometry` in a **separate** effect keyed on `[text, displayFontFamily]`. If text lives in the context effect's deps, every keystroke tears down and recreates a WebGL context, which stutters visibly and will eventually hit the browser's ~16-context limit.
- [x] **Bail first.** `canvas.getContext("webgl2", CONTEXT_OPTIONS)` is the very first call. `null` → `setStatus("unsupported")` and return, leaving the text fallback visible. This is the jsdom path too. Reaching `document.fonts` before this check is what makes the unit tests throw.
- [x] **Font gate**, in order: guard `hasFontLoadingApi()` → `await document.fonts.load('700 100px "<primary>"')` → `await document.fonts.ready` → `document.fonts.check(<same descriptor>)`. Primary family only. Set `ctx.font` and assert the read-back before sampling.
- [x] **Late-arrival insurance**: a one-shot `loadingdone` listener that resamples if `check()` now passes and it hasn't already sampled with the real font. Twelve lines that eliminate the whole "first paint sampled Arial" class of bug.
- [x] **Guard every await** with an `isCancelled` flag checked immediately after.
- [x] **RAF loop.** Named function expression inside the effect, not a `useCallback`. Clamp the frame delta to 50 ms so returning to a backgrounded tab doesn't teleport the wave. `applyFrameLerp` for pointer and influence. Per frame: three `uniform*` calls and one `drawArrays`.
- [x] **Pointer listeners on the container, not `window`** — window-level listening means the vortex chases the cursor while the hero is scrolled off-screen. `pointerleave`, `pointercancel` and **`window` `blur`** all set influence to 0; alt-tabbing mid-hover otherwise leaves the hole frozen open. Cache the bounding rect, invalidate on resize and scroll. Never `preventDefault`, never `touch-action: none`.
- [x] **Coarse pointer**: skip listeners entirely — touch "hover" only exists while a finger is down, and the finger covers the thing it creates. Drive the `resolveAutoPointer` Lissajous path instead so mobile still gets the centrepiece.
- [x] **Reduced motion:** full init, full font gate, full sample, then **exactly one** draw at `time = 0`, `influence = 0`, never schedule another. Attach no pointer listeners. Listen for `change` and start/stop live — this also makes the branch e2e-testable via Playwright's `reducedMotion` option.
- [x] **Visibility:** `IntersectionObserver` with `rootMargin: "120px"` pauses/resumes; reset the previous timestamp on resume. Also hook `visibilitychange` — RAF halts in background tabs, but the observer catches "scrolled away in a _visible_ tab". Gate both behind the Phase 0 capability guards.
- [x] **Resize:** debounced `ResizeObserver` on the section. When `shouldRebuildPoints` is false, still resize the canvas and update `gl.viewport` + `uResolution`, just skip the resample. Re-arm a `(resolution: Xdppx)` media query to catch DPR changes from dragging between monitors, which `resize` does not always fire.
- [x] **Context loss:** `preventDefault()` in `webglcontextlost` is mandatory — without it `webglcontextrestored` never fires. Set status `"unsupported"` so a lost context degrades to a legible hero.
- [x] **Cleanup — and the StrictMode landmine.** Cancel RAF and timers, disconnect observers, remove every listener, delete buffer/VAO/program, then:

  ```ts
  if (!canvas.isConnected) {
    context.getExtension("WEBGL_lose_context")?.loseContext()
  }
  ```

  `getContext("webgl2")` returns the **cached** context for a canvas, and React 19 StrictMode re-runs effects against the _same_ DOM node without remounting. Unconditional `loseContext()` therefore means: run 1 creates context C → cleanup loses C → run 2's `getContext` returns C, already lost → every GL call is a silent no-op → **black rectangle, dev only**. `isConnected` discriminates: React detaches the node before passive-effect destroy on a real unmount. **Verify once with a `console.log` rather than trusting it** — if it doesn't hold, drop `loseContext()` from cleanup entirely, which is not a leak in practice. Keep it in the give-up path.

- [x] **Gate:** `pnpm dev`, open `/`. Swirl tracks smoothly, leaving eases back, steady 60fps. Resize re-fits without stretching. Emulate reduced motion + reload — dots render once and RAF is never called again.

## Phase 8 — Header

**Prereqs:** 3. Rework [section-navigation.component.tsx](src/features/portfolio/components/section-navigation.component.tsx) in place.

- [x] `motion.header`, `fixed inset-x-0 top-0 z-50`, inner `relative flex h-18 items-center justify-between px-6 md:px-10`. Leading `<nav>` left, trailing links plus the bordered `CONTACT` box right, logo mark `absolute left-1/2 -translate-x-1/2` so it stays centred regardless of group widths.
- [x] Logo mark: inline eight-point asterisk `<svg>`, `aria-hidden`, ~18px, in a link to `#home` with an `aria-label`. Slow `motion` rotation on hover.
- [x] Scroll state via `motion`'s `useScroll` + `useMotionValueEvent` on `scrollY` — **no sentinel and no `IntersectionObserver`**, which sidesteps the jsdom problem for this component entirely. Two variants: transparent with white text over the hero, `bg-background/80 backdrop-blur border-b` past it. `useState` from the `useMotionValueEvent` callback is fine — the lint rule only forbids `setState` in an effect _body_.
- [x] Entrance: header fades and slides down once; stagger the two link groups with a parent `variants` container.
- [x] Keep the mobile panel, `aria-expanded`/`aria-controls`, Escape-to-close and `aria-current`. Hide desktop groups below `md`. The panel lists all six.
- [x] **Do not wrap the mobile panel in `AnimatePresence`.** The existing test looks it up by `#portfolio-mobile-nav` and asserts `hidden`; unmounting on close makes that lookup throw. Keep it mounted with `hidden={!isOpen}` and animate height/opacity on a `motion.nav`.
- [x] Run `tests/unit/section-navigation.test.tsx` **unchanged first** — it may pass as-is. Update only if genuinely broken, and keep it behavioural.
- [x] **Gate:** `pnpm test:unit` passes; the header is invisible over the hero and solid once scrolled past.

## Phase 9 — Hero component and page

**Prereqs:** 7, 8.

- [x] Extract `src/features/portfolio/components/site-page.component.tsx` taking `content: SiteContent` as a prop and rendering the whole public page. **Both the public route and Part B's preview route render this one component** — that is what keeps the editor from ever drifting from the real site.
- [x] `hero.component.tsx`, `"use client"`, props `{ content, displayFontFamily }`. Section `relative isolate flex h-svh w-full items-center justify-center overflow-hidden bg-black`.
- [x] **The fallback is the default render, not a special case.** `status` starts `"idle"`, so SSR emits a visible, correctly-fonted `<h1>` and a transparent canvas — **no-JS gets a good hero for free**, and `"unsupported"` renders identically. No separate branch to forget.
  - `<h1 style={{ fontFamily: displayFontFamily }}>` with the name, `uppercase`, `text-[clamp(3rem,18vw,16rem)] leading-none`, `opacity-0` via `data-[status=running]:`.
  - **`opacity-0`, not `sr-only` or `hidden`** — the `<h1>` stays in the a11y tree, stays selectable, and stays _rendered_, so the browser actually demands the display font.
  - `<canvas aria-hidden="true" data-status data-point-count className="pointer-events-none absolute inset-0 …">`. Pointer events are captured on the section.
  - No `aria-labelledby` on the section — it would become a landmark and add noise.
- [x] `displayFontFamily` comes from the **server**: the page imports `fontDisplay` and passes `fontDisplay.style.fontFamily` as a plain string prop. Keeps the font module out of the client bundle and makes the component renderable in jsdom with a fake family.
- [x] [page.tsx](src/app/page.tsx) becomes a server component that calls `readPublishedContent()` and renders `<SitePage content={...} />`. **Demote `<h1>Work</h1>` to `<h2>`** (two `<h1>`s is a real regression), rename `#work` → `#project`, add `#services` and `#blog`, move `mx-auto max-w-4xl px-4` off `<main>` onto the sections so the hero is full-bleed.
- [x] Theme colours from `content.theme` render as a `<style>` block of CSS variable overrides on `:root`. Hex values, injected directly — CSS variables accept any colour format and Tailwind v4's `color-mix()` opacity modifiers work with hex, so **no colour-conversion dependency is needed**.
- [x] Motion pass: parent `motion.div` with `variants` + `staggerChildren` for the tagline and bottom row; hero block enters with a `translateY` rise like the reference. Scroll arrow is `animate={{ y: [0, 6, 0] }}`, `repeat: Infinity`.
- [x] **Gate:** `pnpm check` exits 0, exactly one `<h1>`, and editing the seeded row in Supabase Studio then reloading changes the hero text.

## Phase 10 — Part A tests

**Prereqs:** 9.

- [x] `tests/unit/dot-field-rules.test.ts`, highest value first:
  - **`samplePixelGrid`** — the most valuable test here and it needs no canvas. Hand-build a 16×16 RGBA `Uint8ClampedArray` with a known opaque square; assert exact cells, exact count, and `coverage` for partial-alpha cells.
  - **`parsePrimaryFontFamily`** — `'"Antonio", "Antonio Fallback"'` → `"Antonio"`, plus single-quoted, unquoted, single-family. Guards the Arial trap directly.
  - **`applyFrameLerp`** — two 8.33 ms steps ≈ one 16.67 ms step. Guards the 120 Hz bug.
  - **`resolveFontSize`** — a fake linear measurer converges within 0.5%; a non-linear one still converges.
  - **`shouldRebuildPoints`** — 70 px height delta → `false`, 200 px → `true`, width or DPR change → `true`.
  - `createDotFieldProgram` against a fake GL object whose `getShaderParameter` returns `false`, asserting the thrown message carries the info log.
- [x] `tests/unit/hero.test.tsx` — jsdom's lack of WebGL **is the fixture**: `getContext` → `null` → `"unsupported"` → the accessible-fallback contract is what renders. Assert the `<h1>` is visible with accessible name "Criztian", the canvas is `aria-hidden` with `data-status="unsupported"`, and the shell yields exactly one `<h1>`. Render through the real provider stack. Plus a reduced-motion test: override the `matchMedia` stub, spy on `requestAnimationFrame`, assert it is never called.
- [x] `tests/e2e/hero.spec.ts` — where the GL path actually runs: headless Chromium has real WebGL2 via SwiftShader, and the suite already runs a production build, so the font gate runs against real preloaded next/font output.
  - `data-status="running"` — one assertion proving context creation, compilation, linking, the font gate, sampling, upload and first draw all succeeded. When it fails the value says which: `"unsupported"` means GL, `"idle"` means the font gate or sampler hung.
  - `data-point-count` > 500. **The load-bearing assertion** — it makes the sampler's output against the _real_ font observable from outside. If Antonio silently fails to load, or `ctx.font` is rejected, or the layout math regresses, the count moves and this catches it. (Screenshot pixel-coverage was the alternative; it needs a PNG decoder dependency and is sensitive to driver AA.)
  - `h1` text "Criztian", `toHaveCount(1)`.
- [x] Manual pass at 1440 / 768 / 375 px; CPU throttled 4× and the vortex still tracks.
- [x] **Gate:** `pnpm check && pnpm test:unit && pnpm test:e2e` all exit 0.

---

# PART B — The live content editor

**Prereqs:** all of Part A. The schema, table, service and `SitePage` component already exist; this part adds the write path and the UI.

## The preview is an iframe — why, specifically

The centre pane is an `<iframe>` pointing at a preview route, not a React tree rendered inline. Three concrete reasons, and the first two are hard blockers rather than preferences:

1. **The hero is `h-svh` and the header is `position: fixed`.** Both resolve against the _viewport_. Rendered inside a scaled div in the editor they resolve against the browser window, so the hero would be the wrong height and the header would escape the pane and float over the editor chrome. Inside an iframe they resolve against the iframe — correct layout, free.
2. **Media queries resolve against the iframe width.** So a desktop/tablet/mobile toggle is just changing the iframe's CSS width. Rendered inline, everything would respond to the browser width and always show the desktop layout.
3. **Total style isolation** between editor chrome and site, in both directions.

The cost is cross-document messaging, which is ~30 lines for a same-origin iframe. Worth it.

## Phase 11 — Write path and publish

**Prereqs:** Part A complete.

- [x] `src/features/site-content/server/site-content.router.ts` following the `contact.router.ts` shape exactly — the router is a **translation layer only**: `.input(schema)`, try/catch, `TRPCError` construction with `cause` always set. No business logic, no database access, no logging (that lives in the service and the central `onError`).
- [x] **`ownerProcedure` already exists** in `trpc.init.ts` and narrows `ctx.claims` from `OwnerClaims | null` to `OwnerClaims`. Use it — do not add a second gate. All three procedures are `ownerProcedure`:
  - `getDraft`
  - `saveDraft` — validates the full document, writes `draft` and `draft_updated_at`
  - `publish` — copies `draft` into `published`, sets `published_at`, then `revalidatePath("/")`. `cacheComponents` is off, so the legacy caching model applies and `revalidatePath` is the correct lever.
- [x] **Writes go through the admin client inside the service**, matching the contact precedent, with `ownerProcedure` as the authorization gate at the router. Named function expressions for resolvers (`async function saveDraft({ ctx, input })`), never arrows. Pass `ctx.requestId` to the service **as an explicit argument** — services never import the context.
- [x] Every user-facing message string goes in `src/data/site-content.data.ts`, not inline.
- [x] Register under a `siteContent` key in `app.router.ts`.
- [x] Note on owner identity: there is **no allowlist or role claim** — any authenticated user is the owner, and single-owner is enforced by `enable_signup = false` in `supabase/config.toml`. That is the established model and `plans/handoff.md` explicitly rejects an `owner_accounts` table. If you want this feature tightened, the in-convention option is one line in `requireOwner` comparing `ctx.claims.email` to `serverEnv.OWNER_EMAIL`. Optional, not required.
- [x] **Gate:** unit tests cover `site-content.rules.ts` (defaults merging, publish-state comparison) with no `server-only` import.

## Phase 12 — Preview route

**Prereqs:** 11.

- [x] **Put the preview at `/dashboard/editor/preview`, not `/preview`.** Protection comes from two independent layers and both are path-based: the proxy checks `isProtectedPath`, which is driven by `PROTECTED_PATH_PREFIXES = ["/dashboard"]`, and `(owner)/dashboard/layout.tsx` does a second `getClaims()` check. A route at `/preview` would be covered by **neither** — it would serve unpublished content to anyone. Living under `/dashboard/` inherits both for free and needs no new entry in `auth.data.ts`.
- [x] **One small refactor makes this work:** `dashboard/layout.tsx` currently wraps children in `<div className="mx-auto max-w-4xl px-4 py-12">`, which would crush a full-bleed preview. Move that container out of the layout and into `dashboard/page.tsx`, leaving the layout as a pure auth gate. Both the editor and the preview then render full-bleed while keeping the gate. This is cheaper and less fragile than escaping a parent layout, which App Router does not support.
- [x] The route reads the draft server-side via `caller.siteContent.getDraft()`, then renders a thin client wrapper around `<SitePage />` that holds content in state and overrides it from `postMessage`. Reading the draft on load means the route also works standalone, not only when driven by the editor.
- [x] **Message handling, both directions, with explicit origins.** Post with `window.location.origin`, never `"*"`, and validate `event.origin === window.location.origin` on receive before touching the payload. Messages: `{ type: "content", payload }` and `{ type: "scroll", sectionId }`.
- [x] **Non-interactive, but not inert.** Rather than covering the iframe with a blocking overlay, the preview route applies `pointer-events: none` to `a, button, input, textarea, select` only. Links can't navigate and forms can't be submitted, but **the hero canvas still receives the pointer, so the vortex works in preview** — which is exactly the thing you want to watch while editing. An overlay would kill it.
- [x] **Gate:** visiting `/preview` logged in shows the site with draft content; logged out redirects.

## Phase 13 — Editor shell

**Prereqs:** 12.

- [x] `src/app/(owner)/dashboard/editor/page.tsx` — server component. **Read the draft with `caller.siteContent.getDraft()` and pass it as a prop**, matching the one existing server-side read in `dashboard/page.tsx`. The `trpc` options proxy and `getQueryClient` are wired up for `prefetchQuery` + `HydrationBoundary`, but there is **not a single `useQuery` or `HydrationBoundary` anywhere in the repo** — using them here means being the first, and validating that path. The `caller` + props route is the established one and is sufficient, since saves are mutations and `useMutation` is already used in `login.form.tsx`.
- [x] Three panes: left `w-60` section list, centre `flex-1` iframe, right `w-80` config panel. Full height, the editor itself does not scroll — each pane scrolls independently.
- [x] Left pane is driven by data, not hardcoded markup: an array of `{ id, label }` entries in `src/data/site-content.data.ts`. With hero-only scope that is `Hero` and `Theme`, but **adding a section later is a data change, not a component change**.
- [x] Editor UI state in a TanStack Store factory scoped to a provider, matching `portfolio-ui.store.ts` exactly — no module singleton. State: `selectedEntry`, `previewWidth`, `saveState` (`"idle" | "saving" | "saved" | "error"`).
- [x] Viewport toggle sets the iframe's CSS width (`100%` / `768px` / `390px`), centred, with a transition. Free responsive preview.
- [x] Selecting an entry posts `{ type: "scroll", sectionId }` to the iframe.
- [x] **Gate:** the three panes render, the iframe loads the site, the viewport toggle reflows it.

## Phase 14 — Config panel and live updates

**Prereqs:** 13. This is where the two-speed update model lives.

- [x] Form via `react-hook-form` + `zodResolver` against the same schema, matching `login.form.tsx` exactly: `useForm<Input, unknown, Output>` (three generics — Zod transforms make input ≠ output, and both types come from `src/types/`), a module-level `EMPTY_*` defaults constant, `mode: "onBlur"`, and `<form onSubmit={form.handleSubmit(onSubmit)} noValidate>`.
- [x] **shadcn `Field` primitives, not the `Form`/`FormField`/`Controller` wrapper** — the repo does not use it. Structure is always `<FieldGroup><Field><FieldLabel htmlFor><Input {...form.register()} /><FieldError errors={[errors.x]} /></Field></FieldGroup>`. `FieldError` takes an **array**. Every input gets a namespaced `id` matching `htmlFor`, and `aria-invalid={errors.x ? true : undefined}` — `undefined`, never `false`.
- [x] Mutations are `useMutation(trpc.siteContent.saveDraft.mutationOptions({ ... }))` — the tRPC v11 proxy style, not `trpc.x.useMutation()`. Error display is `{mutation.isError ? <p role="alert" …> : null}` — ternary-to-`null`, never `&&`. Submit labels swap to a gerund with a real `…` character.
- [x] **Two independent debounces off the same `watch()` subscription:**
  - **~80 ms → `postMessage` to the iframe.** Drives the visual. No network, no database.
  - **~800 ms → `saveDraft` mutation.** Persists. Updates `saveState` for a small "Saved" indicator.

  Keeping these separate is the core efficiency decision: the preview feels instant because it never waits on a round-trip, and the database sees roughly one write per pause rather than one per keystroke.

- [x] Short fields (`name`, `scrollLabel`, `worksLabel`, disciplines) are plain shadcn `Input`s. **Do not put a rich text editor on a headline.**
- [x] Tagline uses **Tiptap** — `useEditor` with `StarterKit` trimmed to bold, italic and hard break, in a shadcn-styled bordered container with a small toolbar. The hero tagline genuinely wants line-break and emphasis control, and this establishes the pattern for the About body later.
- [x] **Store Tiptap JSON, not HTML.** Render it with `generateHTML` from `@tiptap/html` using the same extension list, server-side in `SitePage`. Because the extension list constrains what the document can contain, there is **no XSS surface and no sanitizer dependency** — which is the entire reason to prefer JSON over storing HTML.
- [x] Colour fields: native `<input type="color">` styled as a shadcn swatch, paired with a hex text input so a specific value can be typed. Zero dependencies. (`react-colorful` is the ~3 kB upgrade if the native picker feels cheap.)
- [x] Colour changes post CSS-variable overrides to the iframe the same way text does, so the whole site retints live.
- [x] Publish button: disabled while `draft_updated_at <= published_at`, confirms, calls `publish`, shows the result. Surface "unpublished changes" state clearly — it is the only thing standing between a draft and the live site.
- [x] **Gate:** typing in the right pane visibly updates the centre pane within a frame or two; reloading the editor shows the persisted draft; the public site still shows the _old_ content until Publish.

## Phase 15 — Part B tests and verification

**Prereqs:** 14.

- [x] Unit: the schema's default-filling behaviour, draft→published promotion, and the debounce/dirty helpers as pure functions in `site-content.rules.ts`.
- [x] Unit: the config panel renders fields for the selected entry and calls the save mutation. jsdom has no iframe contentWindow worth driving, so **assert the `postMessage` payload against a spy** rather than trying to test the preview end to end here.
- [x] E2E `tests/e2e/editor.spec.ts` — this is the only place the whole loop is real: log in, open the editor, change the hero name, assert the **iframe's** `h1` updates (Playwright's `frameLocator` makes this direct), click Publish, then visit `/` in a fresh context and assert the new name is live. That single spec covers postMessage, autosave, publish and revalidation in one pass.
- [x] Confirm logged-out access to `/dashboard/editor` and `/preview` both redirect.
- [x] Commit in two parts: `feat: add interactive dot-matrix hero with a cursor vortex` and `feat: add live content editor with draft and publish`. Include the regenerated `AGENTS.md` block if `next dev` rewrote it.
- [x] **Gate:** `pnpm check && pnpm test:unit && pnpm test:e2e` all exit 0.

---

## Risks and the first thing to try

| Symptom                                         | Cause                                                                                | Fix                                                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dots spell the word in Arial                    | Sampled before Antonio loaded, or checked the full family stack                      | Check family index 0 only; `load()` before `ready`; confirm the `loadingdone` resample is wired                                                             |
| Black rectangle in dev only                     | `loseContext()` in cleanup + StrictMode returning the cached lost context            | The `!canvas.isConnected` guard, or drop `loseContext()` from cleanup                                                                                       |
| Editor stutters badly while typing              | Hero text in the _context_ effect's deps, rebuilding a WebGL context per keystroke   | Split the effects as Phase 7 specifies                                                                                                                      |
| "Too many WebGL contexts" warning               | Same cause, accumulated                                                              | Same fix; verify cleanup runs                                                                                                                               |
| Letters look ragged                             | `alphaThreshold` at 128, or `coverage` not reaching the shader                       | Threshold 40; confirm the third float is in the attribute                                                                                                   |
| No spiral arms, just a spinning blob            | Push applied along the un-rotated direction, or swirl too low                        | Push must use `swirled / distanceToPointer`, then raise `vortexSwirl`                                                                                       |
| Hole doesn't open / effect inverts              | `vortexPush` ≥ `vortexRadius`                                                        | Keep push below radius                                                                                                                                      |
| Vortex laggy on 60 Hz only                      | Lerp not frame-rate normalised                                                       | `applyFrameLerp`                                                                                                                                            |
| Constant resampling while scrolling on mobile   | URL-bar height changes                                                               | `shouldRebuildPoints` height tolerance                                                                                                                      |
| Preview blank or hero wrong height              | Rendered inline instead of in an iframe                                              | `h-svh` and `fixed` need a real viewport — see Part B's opening                                                                                             |
| Publish doesn't change the live site            | Missing revalidation                                                                 | `revalidatePath("/")` in the publish mutation                                                                                                               |
| Draft visible to logged-out users               | An `anon` grant or policy was added, or the preview route sits outside `/dashboard/` | Nothing is granted to `anon`; the public path reads `published` via the admin client; the preview must live under `/dashboard/` to inherit both auth layers |
| Editor or preview squeezed into a narrow column | The `max-w-4xl` container is still in `dashboard/layout.tsx`                         | Move it into `dashboard/page.tsx` so the layout is a pure auth gate                                                                                         |
| `section-navigation` tests fail                 | Mobile panel wrapped in `AnimatePresence`                                            | Keep it mounted with `hidden`; animate height/opacity                                                                                                       |
| `ReferenceError: IntersectionObserver`          | A component reached for a global directly                                            | Route every check through `browser-capability.rules.ts`                                                                                                     |
| `motion` or Tiptap import fails                 | Wrong entry for the installed major                                                  | Read the package's `package.json` exports; Tiptap v3 changed APIs                                                                                           |

## Two judgment calls, flagged not decided

- **Shader sources** live in `src/features/portfolio/shaders/` rather than `src/data/`, because they are program source rather than tuning data, and keeping `hero.data.ts` purely numeric is what makes the tuning file useful. If you want the letter of the rule, they move to `src/data/dot-field-shader.data.ts` with no other change.
- **Tiptap on a hero tagline** is arguably more machinery than one short field needs; a plain `Textarea` with line breaks would cover it. It is included because you asked for a rich text library and because the About body will want it, so this establishes the pipeline once. Say the word and it defers to whenever About is designed.

## Note

This plan follows the shape of `plans/project-foundation.md`. To drive it with your `build plans/<name>.md` workflow, copy it into the repo — and consider splitting at the Part A/Part B boundary into `plans/hero-dot-field.md` and `plans/content-editor.md`, since they are separately shippable and Part A stands alone.
