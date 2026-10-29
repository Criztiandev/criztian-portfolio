# Architecture

This file holds every "why". The code has no comments on purpose: names and structure explain
the "what", this document explains the decisions.

## Two kinds of projects, one codebase

- Fullstack app: tRPC procedures, Supabase Auth, the dashboard.
- Static marketing site: pages under `src/app/(marketing)` only. They are prerendered at
  build time and rendered again at most once an hour, with or without the Supabase
  variables (see "Static versus dynamic"). Without them the pages draw the code defaults.
  The server features stay in the repo unused until needed.

Both kinds ship the CMS described in "CMS" below. There is no mode flag. Static
versus fullstack is decided by which routes exist and by the hosting target (Vercel or any
Node host). A pure static host (GitHub Pages, S3) needs the eject recipe at the end of this
file.

## Folder map

```
src/
  app/          routes only (page.tsx, layout.tsx, route.ts)
  components/   React components, kebab-case, no scope suffix; ui/ is shadcn output
  hooks/        client hooks (use-*.ts)
  data/         static content constants, no I/O
  config/       site constants and env readers
  model/        zod schemas shared by forms and tRPC input
  type/         every named TypeScript type, plus the generated database.type.ts
  util/         pure functions with no I/O that every layer and node:test can import
  error/        AppError and the Postgrest mapper
  repository/   the only code that queries tables; functions take the client as `db`
  service/      business logic, one function per use case
  router/       tRPC routers: validate with a model, call a service or repository
  lib/          adapters named after their tool: supabase/, trpc/, tiptap.ts,
                react-markdown.ts, utils.ts
  proxy.ts      Next proxy (session refresh), must live next to app/
```

File names are `name.scope.ts` with a singular scope (`contact.model.ts`,
`contact-message.repository.ts`). Names a tool sets stay as they are.

Named types (`type X =`, `interface`, `enum`) live only in `src/type`. Inline annotations in
function signatures are allowed, and `src/components/ui` is exempt because shadcn generates it.

## Layers and the lint that enforces them

Imports point down: router -> service -> repository -> database client. `eslint.config.mjs`
enforces the direction with `no-restricted-imports` deny lists per folder (type-only imports
are always allowed). The raw `@supabase/*` packages may be imported only inside
`src/lib/supabase`. Only `repository/` calls `db.from()`; lint cannot check that last rule,
so it is convention.

`util/` exists because the CMS helpers (the publish state, the changes list, `toCmsValues`)
are needed by components, the service, the repository and node:test at once: `model/` is for zod schemas, components may not import
`service/`, and `lib/` is closed to repositories. It has the same deny list as `model/`,
`type/` and `data/`.

Pages may call a repository directly when a service would only pass the call through: the
editor and preview pages with the cookie client from `lib/supabase/server.ts`, marketing pages with the
cookie-less `createPublicSupabase` from `lib/supabase/public.ts`. Client components reach
data only through tRPC, so lint denies them both clients. Route files under
`src/app/(marketing)` are also denied Tiptap, the editor, the toast and the cookie client. Lint cannot follow a shared component that imports the editor, so
`public.spec.ts` also checks that the scripts shipped to `/`, `/login` and `/blog` contain no
ProseMirror code.

Other lint rules that encode house style: braces on every control statement, no nested or
unneeded ternaries, no `any`, `import type` for types, and no `reduce`, `some`, `every`,
`find`, `findIndex`, `findLast`, `findLastIndex` or `flatMap` (use loops, `map` or `filter`).
The selector is name based, so a non-array `.find()` is flagged too; restructure the code,
there is no `eslint-disable` because comments are not allowed.

## Testing

Two runners, kept apart by file suffix:

- `pnpm test` runs `node --test` over `test/**/*.test.ts` for pure functions such as schemas
  and the error mapper. Node strips types natively, so modules a test imports must use
  relative `.ts` imports for runtime values and `import type` for types: Node resolves no
  tsconfig aliases and strips nothing it cannot see. `erasableSyntaxOnly` in tsconfig keeps
  enums, namespaces and parameter properties out. `test/markdown.test.ts` also round-trips
  Markdown through the editor's Tiptap extensions and renders Markdown to a string with
  react-markdown; that is still not a component test. Node has no `DOMParser`, so HTML inside
  Markdown (the `<br>` Tiptap writes in table cells) is tested by serializing JSON, never by
  parsing Markdown.
- `pnpm test:e2e` runs Playwright over `test/e2e/*.spec.ts` (`testDir` plus `testMatch`). The
  `.spec.ts` suffix keeps those files out of the node:test glob. A Playwright file named
  `*.test.ts` would run under node:test and fail, so Playwright files always end in `.spec.ts`.
  That suffix and the test doubles `resend.mock.ts` and `postgrest.mock.ts` are deliberate
  exceptions to `name.scope.ts`.

Playwright builds and starts the production server on port 3010 (`next build && next start`),
never `next dev`: error masking and prerendering exist only in production, and the
`dynamic = "error"` tripwire fails the whole build there instead of one dev request. The
build overwrites `.next`, so run `pnpm build` again before a manual `pnpm start`.

`expect` waits up to 15 seconds, not Playwright's 5 (`playwright.config.ts`, since
2026-10-11). Six workers start their browsers and three log in at the same moment, right
after the server starts, so the first navigation of a worker took up to 8.8 seconds and
failed 2 to 4 tests on most runs. No route is slow by itself (a first request answers in
about 20 ms), which is why the routes are not warmed in a `globalSetup`. A passing check
never waits longer; only a failing one takes 10 seconds more.

Playwright never reuses a running server: a server it did not start has neither the fresh
build nor the mocks. If port 3010, 3011 or 3012 is taken, the run stops before any test:
Playwright reports the port as already used, or says the web server could not start. Run
manual checks on another port, such as 3020.

`playwright.config.ts` loads `.env.local` with Node's `process.loadEnvFile` (variables already
in the environment win), fills the Supabase and Resend variables with dummies when they are
missing, and always points `RESEND_BASE_URL` at `test/e2e/resend.mock.ts`, a small Node server
that answers like the Resend API and records every email. No test run sends real email.
`@next/env` would load the file too, but pnpm does not expose it at the project root, so it
would be one more dependency.

When `E2E_USER_EMAIL` or `E2E_USER_PASSWORD` is missing, the config also points
`NEXT_PUBLIC_SUPABASE_URL` at `test/e2e/postgrest.mock.ts` on port 3012, which answers every
request with `[]`. It is the first `webServer` entry, so it is up before `next build` starts.
Without it the build would prerender `/blog` against the dummy URL, wait out the client's
retries and fail. With the credentials set, the build uses the local stack, which must be
running.

`public.spec.ts` needs no database: the home page, the mobile menu, client-side validation,
that valid input is sent to the API, the honeypot and session contracts of the API, the
dashboard, editor and preview redirects (the editor's frame route included), the
prerendered blog index (its `x-nextjs-cache` header),
404s for unknown and malformed slugs, that every `cms` procedure needs a session, and that
public pages ship no editor code. Public runs build `/blog` against the mock, so it is empty,
and `/` draws its code defaults and the default palette for the same reason.
One test sets a light system: `html` still gets the `dark` class and `--background` is
`#0a0a0a`, the palette's own rule. It then opens both kinds of 404. A missing post renders
inside the marketing layout, so its `body` is the palette's black. A URL that matches no
route gets Next's default page with no palette rule, so its `body` takes the brand values
in `globals.css` `:root`: `rgb(10, 10, 10)` on `rgb(244, 244, 241)`.
The mock answers `[]` for any table, and both blog readers take arrays, so it needed no
change for `cms_entries`.

`database.spec.ts` skips itself unless `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` are set in
`.env.local` (an account created in Studio) and `NEXT_PUBLIC_SUPABASE_URL` is a loopback
address, so a `.env.local` that names a hosted project never receives test rows. It covers a
wrong password, the whole contact journey (submit, email captured by the mock, a login that
lands on the first collection, the sidebar showing the email and the current item, the row
in the Messages table with its email, the message opened by a click in its cell, the Reply
link's `mailto:`, a 404 for an unknown collection, logout, redirect), the empty and error
states of Messages (`contact.list` answered with `page.route`, then Try again, which waits
for the table or the empty state, because the alert already leaves when the retry starts)
and the closed signup endpoint. Runs leave rows
in `contact_messages`; delete them in the Studio SQL editor. `pnpm db:reset` clears them too, but it also deletes
the test user, so create it again in Studio afterwards. Failed tests keep a Playwright trace
under `test-results/` (gitignored); it records everything typed, including the E2E password,
so `E2E_USER_*` must be a throwaway test account.

`cms.spec.ts` skips under the same two conditions. Its data tests sign in on `/login`, call
`/api/trpc/cms.*` with the browser's cookies, and talk to PostgREST directly as anon. They
cover: a draft is invisible to anon; anon cannot select `draft` or `*`,
filter on `draft`, insert, update, delete or call `cms_publish_entry` (42501 each time); a
draft saved over a live entry leaves the version anon reads untouched; the create, save,
publish and delete cycle with its 400s and 404s; and slug uniqueness three ways (the save
check, the second publish, and a direct insert that only the index can stop). It deletes its
own rows.

The single test covers a collection with one entry, through the router. It starts on
the dashboard: the sidebar has an Editor link to `/editor` and a Blog row, and no Home
page or Theme row. A click on Editor lands on `/editor/home/new`, a page with no sidebar,
with the label as the `h1`, a Back to Dashboard link, exactly two page rows (Home page,
which is current, and Theme, whose link is `/editor/theme`) and the default text in the
fields; Contact heading is hidden until its section is clicked. After a create, the by-URL preview `/preview/home/<id>` draws the
draft with its bar and a Back to editor link to `/editor/home/<id>`, and the same id under
`/preview/theme/` answers 404. `/dashboard/home`, `/editor` and `/editor/home/new` all
land on the row, a second create answers 409, and a direct insert
with `single` set answers 23505, which only the index can stop. A saved draft leaves `/` alone, Publish puts the new text
there, and deleting the row brings the default back. A single cannot be isolated with a
random slug, so the test first deletes every `home` row: the suite owns the local `home`
row, and a failed run cannot block the next one. It changes the hero text only, never the
two headings, because `public.spec.ts` runs beside it and reads the same `/`. With the E2E
credentials set, `/` comes from the real database, so a live `home` entry with another
heading in a developer's local database fails the home test in `public.spec.ts`; delete the
entry, or run `pnpm db:reset` and clear `.next/cache/fetch-cache`.

The theme test covers the brand palette and clicks the color field. It runs with a dark
system setting from start to end, to prove the theme is forced dark. After the login the
dashboard has its `dark` class. `cms.create` with a text color of `#222222` answers 400.
`/editor/theme` lands on `/editor/theme/new` with the five defaults; the editor and the
frame both have the `dark` class. `#222` typed into Text leaves the picker on the old
color, and `#222222` moves it. Save draft then shows the contrast error on Background and on Muted,
focuses Background and creates nothing; fixing Text clears both errors with no second save,
which fails without the `deps`. A half-typed `#12` reaches the check on blur and shows the
format error on Text. Primary set through the picker turns the frame's Send button blue
before any save, and again after the save, when the frame has loaded a second time; `/`
stays on `--primary:#e1251b`. The publish check lists the five colors, and after Publish `/` prints
the new primary, has the `dark` class and draws the Send button in it with white text.
Deleting the row brings the default back, and Log out lands on a `/login` with the
`dark` class. Like the single test it first deletes every `theme` row. Of the five colors
it changes Primary only, because `public.spec.ts` reads `--background` beside it.

The same test covers the two fonts. A create with a heading font that is not an option
answers 400. The Fonts section button shows the two dropdowns on Geist with the six
options. Playfair Display as the heading font turns the frame's `h1` and leaves the hero
text on Geist; Lora as the body font turns the hero text; the editor's own `h1` stays
Geist; and `document.fonts` in the frame reports both families as loaded, so the files
are really served. After Save draft `/` still prints `--font-display:var(--font-geist)`,
and the Home page frame, which draws the live theme, is still Geist. The publish check
lists seven rows, the last two by label ("Playfair Display", "Lora"). After Publish the
home page's `h1` and `h2` are Playfair Display and its button text Lora. It publishes
fonts to `/`, so no test in `public.spec.ts` may read a font there.

`public.spec.ts` reads the fonts on `/no-such-page`, which has the root layout and no
palette rule: the `body` is Geist, which proves the `:root` line in `globals.css`, and
`--font-<value>` holds the label for every option in `data/font.data.ts`, which proves
the data and `config/font.config.ts` agree. It is the first end-to-end file that imports
from `src`.

The frame test clicks the page editor on `/editor/home/new` and saves nothing, so `/` stays
as `public.spec.ts` expects. It starts with the frame's request aborted: "Loading
preview..." shows, and after 10 seconds the failed line (the step waits up to 20). With
the frame back, the iframe carries `aria-hidden="true"`, five quick keys in a heading
reach the frame as at least five `values` messages (no typing pause for a collection
without rich text), and typing a heading redraws the frame's `h1`. A section picked in
the hierarchy shows its fields, hides the others and gets the outline in the frame. A
click on the hero text in the frame selects Hero and focuses its field. A click on the
frame's Blog link changes no URL and leaves the focus where it was, and a middle click on
it opens no tab (the test counts new pages until its end). A click on Send
message selects Contact, sends no `contact.submit` request and shows no validation text.
Tab from the last hierarchy row lands on the stage, the group named "Page preview", and
the next Tab on the first field, so the iframe is never a stop.
Phone gives the frame an `innerWidth` of 390 and shows the menu button, which a click does
not open; with the stage focused, Page Down scrolls the page in the frame and Home brings
it back. With Hero selected and Contact heading emptied, Save draft selects Contact,
focuses the field, shows its error and creates nothing. It also checks the 404 of a frame
route and an editor route for an unknown collection, no sideways scroll at 1280 and the
one `h1`. It reads the frame with
CSS and text locators; role locators inside the `aria-hidden` iframe were not tried.

`test/theme.test.ts` checks `themeCss` without a browser: the default palette as one exact
rule, soft text, the error red and fill text at 4.5 to 1 or more on four hard palettes
(two mid greys, a blue and a dark one), and that a stored value that is not a color never
prints. For the fonts: the two variables of a chosen pair, and that a stored font that is
not an option prints the default rule.

The site journey in `cms.spec.ts` proves that nothing is live without Publish: a draft
answers 404 on `/blog/<slug>` and is missing from `/blog`, the preview route shows it to the
signed-in user (with its Back to editor link to `/editor/posts/<id>` and the palette's rule in the
page) and redirects an anonymous one, Publish turns the cached 404 into the post
(heading, bold text and table line break rendered), a draft saved over the live post shows
only in the preview, Show on site off plus Publish answers 404 again, and Delete takes the
post off the site. The check that the hidden post left `/blog` reads the HTML with
`request`: a browser visit there prefetched the first post's page just before the delete,
and that render could be cached after the purge and answer 200 for an hour. Save draft never purges the cache, so a cached page proves nothing about
a draft: the test publishes a second post to force a purge before it reads the first one
again. The first read after a publish or delete is polled, so the test does not depend on
when the route handler finishes its pending revalidations. The first post's summary holds
bold text: the dashboard list and the post's meta description must show it without the
asterisks, and the blog list must show it as `strong`.

The two list tests click the screen. The first creates a draft, a changed and a published
entry through the router, then checks each row's publish state, that a changed entry shows
its draft title, the `href` of New, Edit and a title link (all under `/editor`), and that a
click in the padding of a title cell opens the editor; the editor tests follow New. It closes the
delete dialog with Esc and with
Cancel, then deletes the live entry and waits for the toast, the missing row and a 404 on
`/blog/<slug>`. The second answers `cms.list` itself with `page.route`: `[]` for the empty
state, a held request for the loading state and an aborted one for the error state, then Try
again. The error state shows after React Query's three default retries, about 7 seconds, so
that step waits up to 20.

`cms.spec.ts` runs its tests in order (`test.describe.configure({ mode: "default" })`), not
under `fullyParallel`. Every publish, and every delete of a live entry, purges the whole
site, and the site journey reads cached pages between its own purges. With the list tests
added and all six in parallel, the site journey failed 2 runs in 5 on 2026-10-11: `/blog` was
still a cache hit 0.3 seconds after a publish, and `/blog/<slug>` still answered 200 five
seconds after a delete. The likely cause is the race in "Static versus dynamic": a page that
a link prefetch started rendering before a purge is cached after it. In order, 4 runs in 4
passed, and the suite takes about 5 seconds longer.

The two editor tests click the editor on a post. The first opens New post from the list
and lands on `/editor/posts/new` with the tab title "New post". Content is the selected
section and Settings a button in the hierarchy: before a click its switch is hidden, after
it the switch is on and Title is hidden. Back on Content it reads the
placeholders of the title, the summary and the body (for the two editors as the drawn
`::before` text, because the attribute is there even when nothing is drawn), the short box
and the helper tie of the summary, and checks that the page, `main` and the fields panel do
not scroll sideways at 1280, which covers the body toolbar in its narrow column. A new
post has an enabled Publish button. Five quick keys in Title reach the frame as one
`values` message, which is the typing pause. A table inserted in Body sits in a wrapper
that scrolls sideways, and Undo takes it out again. It
saves the empty form (four errors, focus on Title, nothing created; Title and Summary
name their error in `aria-describedby`), turns
the empty summary into a bullet list and still reads "Summary is required". With the title
typed and the slug still empty the frame's `article h1` shows it, and the editor's own `h1`
is still the only heading the role locator finds. It fills the other
fields, types the summary into its own editor, sets bold from the
Body's toolbar (the section has two) and reads the bold text in the frame before any save.
A click on the frame's title focuses the Title field; a click on the frame's date selects
Settings and focuses the date button. With the calendar open, a click on the body in the
frame closes it, selects Content and focuses Body. Back in Settings it picks the 15th
with a click, then
the 16th with the keyboard (Enter, Tab twice, ArrowRight, Enter); on the 15th of a month
it uses the 17th and 18th, because a click on the day that is already selected does not
close the calendar. Neither may submit the
form, the frame's `time` shows the picked day, and Esc with the calendar open closes the
calendar only. Save draft shows
the toast, puts the id in the URL, turns the tab title to "Edit post" and shows the Draft
chip, and the frame, loaded a second time, draws the title again. It then proves that
nothing is live without Publish: `/blog/<slug>` answers 404 and anon reads `[]` for the row.
A second save, the Back to Blog link and browser Back prove the list refresh and the Back
fix. It checks 404s for `/editor/posts/0`, `/editor/posts/abc` and `/editor/messages/1`, and
for the old `/dashboard/posts/new` and `/dashboard/posts/<id>`. With `cms.saveDraft`
aborted and the panel scrolled down to Body, Save draft shows its error inside the
viewport. It ends on a field in a
section that is not shown: it writes the publish date "soon" into the draft over PostgREST
as the signed-in user, the stage says "This cannot be previewed yet" as a `status` in the
editor's own document, and Save draft must
select Settings, show "Enter a valid date" and focus the date button.

The calendar is a `dialog`, found by its name ("Publish date"). That a field took the focus
after a click in the frame is checked with `toBeFocused()`, which waits: `setFocus` runs in
a timeout and Tiptap focuses on the next animation frame, so a one-shot read of
`document.activeElement` races. The frame test reads the focused tag three times: twice
after a waiting check has passed, and once right after a click that must leave the focus
where it was. A role
locator does not find a field of an unselected section; a label locator does, and
`toBeHidden()` holds for both.

The second covers the leave warning on a live entry: a clean form, also after a click into
the body, leaves through Back to Blog without a question; a changed title arms the
`beforeunload` guard and makes Back to Blog and the hierarchy's Theme row ask. Cancel keeps
the page and the typed text. Save draft turns
the chip to "Changes not published" while anon and `/blog/<slug>` still show the published
title. A slug that a live post uses shows the error on the Slug field with focus, and OK on
the question leaves through the back link. The guard is read by dispatching a cancelable
`beforeunload` event in the page: `dispatchEvent` answers false when a listener prevented
it. That proves the listener is armed, not that Chrome prompts; Chrome did prompt on a
manual reload on 2026-10-11.

The publish test clicks the check. A draft made through the router lists all six fields with
no old values, the date as "Oct 10, 2026" and the switch as Yes. Esc closes the dialog and
returns focus to Publish, and nothing is live: `/blog/<slug>` answers 404 and anon reads `[]`.
Confirming shows the toast and the Published chip, turns Publish off with the focus back
on it, and puts the post on the
site. With a changed title and a changed middle paragraph Publish is on: one click saves
("Draft saved") and opens the check with exactly two rows, the title and that one
paragraph. Cancel leaves
the live version as it was, the chip reads "Changes not published" and the draft holds the
new title. Save draft keeps the focus on its button while it runs, and Publish clicked
right after it lists the newest title. An emptied title with Publish pressed shows "Title
is required", opens no dialog and saves nothing. The last part publishes a draft whose
slug another post took in the meantime and
reads the slug message in the dialog. `toHaveText` on the rows matches each whole row, so it
also proves that no other paragraph is listed.

The journey test clicks the fast path, with no router call before its clean-up: New post on
the list, the four fields, the frame, then Publish with no Save draft before it. That one
click saves ("Draft saved") and opens the check while the URL is still
`/editor/posts/new`; nothing is live at that point. Confirming moves to
`/editor/posts/<id>` with the Published chip, then `/blog` and the post show it. On the
way it checks that Blog is the current sidebar row on the
list and the current hierarchy row on `/editor/posts/new` and on the saved entry. The test
never selects Settings, so the date and the switch in its
publish check prove that a section that was never shown still saves its start values.
Until it confirms it reads `/blog` and
`/blog/<slug>` with `request`, not the browser, so no cached page and no link prefetch can
answer. After Publish it polls the `/blog` HTML for the title, opens the page and clicks
through to the post.

The page journey does the same for a page: the home text and a color, from the editor to
the site. It first deletes the `home` and `theme` rows through the router, as every single
test does, and then makes no router call until its clean-up. Editor in the sidebar opens
Home page. A new hero text shows in the frame; Save draft shows the toast and the Draft
chip, and `/` does not have the text. Publish opens the check with the three fields, and
`/` still does not have it; confirming turns the chip to Published and puts the text on
`/`. The Theme row of the hierarchy opens `/editor/theme/new` with no leave question, and
its frame draws the hero text that was just published. A hex value typed into Primary
turns the frame's Send button green. The test types it because Playwright cannot drive the
system's color dialog. Publish, with no Save draft before it, lists the seven fields while
`/` still prints `--primary:#e1251b`. The three reads of `/` before a publish are answered
from the cache, so what they show is that Save draft and opening the check do not purge
it; that anon cannot read a draft is the data tests' proof. After the confirm, Back to Dashboard returns to the
Blog list, and View site opens `/` in a new tab with the text and the green button. It is
the only test that saves and publishes Home page from the screen and the only one that
uses View site. It changes the hero text and Primary only, because `public.spec.ts` reads
the same `/` beside it. With the purge taken out of
`publishEntry`, it failed on 2026-10-12 at its first read of `/` after Publish.

Answer a `window.confirm` inside the `page.once("dialog")` listener, registered before the
click: an unhandled dialog freezes the click, and with no listener Playwright dismisses it.

`test/markdown.test.ts` still covers the Markdown round trip and the rendering.

Scope `getByRole("alert")` to the form. Next adds a visually hidden route announcer with
`role="alert"` to every page, and Playwright sees into its shadow root, so an unscoped alert
locator matches two elements and fails strict mode.

After a click on an editor toolbar button, wait for the editor to be focused before typing.
Tiptap's `focus()` runs on the next animation frame, so a key pressed earlier lands on the
toolbar button: Enter would press Bold a second time instead of starting a new paragraph.

Not covered on purpose: component tests (vitest arrives with the first one), visual
regression, and a CI workflow (add it with the remote).

## Error contract

`AppError` carries a `code` from `APP_ERRORS` (UNAUTHORIZED, CONFLICT, NOT_FOUND,
CONFIG_MISSING, DATABASE_ERROR, EMAIL_SEND_FAILED) and `name === "AppError"`, so logs and
error UIs can identify it at a glance. Messages are user-safe text; the raw Postgrest or
Resend error travels in `cause`. Postgrest errors are plain objects at runtime, so the mapper
matches by code, never with `instanceof`. CONFLICT is a unique violation (23505) or the CMS
slug check: a duplicate slug, or a second row for a single collection. The CMS editor shows
a slug conflict on the Slug field and, for a collection with no slug field, as the form's
error (see "CMS singles"); the publish check shows it in the dialog.
NOT_FOUND arrived with the CMS: a save, publish or delete on an entry that is gone, a
publish with no draft, and `cms.list` for a collection that is not in the config. Codes are added only with their first producer: FORBIDDEN arrives with
the first policy that can deny an authenticated user.

In tRPC, one outermost middleware on `publicProcedure` turns an `AppError` into a `TRPCError`
with the mapped code. It runs for HTTP calls, `createCaller` and any future server-side
proxy, while `errorFormatter` runs for HTTP only. The formatter replaces zod's JSON message
with "Invalid input" and masks `INTERNAL_SERVER_ERROR` messages in production, because tRPC
otherwise forwards raw driver text to clients. The route handler logs 5xx errors; the cause
chain is the place to look.

In Server Components, use `redirect()` and `notFound()` for expected cases and let the rest
reach `app/error.tsx`, which shows the digest Next prints in the server log.

## Env contract

| Variable                                                           | Read                           | Required                                                                 |
| ------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                             | at import, in `site.config.ts` | production (Vercel has a fallback)                                       |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | lazily, first use              | fullstack, the blog, the home page's editable text and the brand palette |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`                         | lazily, first send             | when email is sent                                                       |

Lazy readers let a marketing-only clone build with no env at all; the blog pages, the
home page and the marketing layout check `hasSupabaseEnv()`. Without it the blog renders
empty, or 404 for a post, and the home page draws its code defaults in the default palette. `NEXT_PUBLIC_*` values
are inlined at build time only for literal `process.env.NEXT_PUBLIC_X` references, so the
readers never loop over keys. The site URL falls back to `http://localhost:3000` instead of
throwing because `next build` always runs with `NODE_ENV=production`.

With the env set but Supabase unreachable (Docker off, or the hosted project paused), those
pages fall back the same way. Ported from the J&T site on 2026-10-29; that is the site's rule:
it works without Docker or Supabase.

- `fromPostgrestError` maps a request that got no response (postgrest-js returns `code: ""`
  and `status: 0`) to `UNAVAILABLE` (tRPC `SERVICE_UNAVAILABLE`).
- `listLiveEntriesIfReachable` and `getLiveEntryBySlugIfReachable` in `cms.service.ts` return
  none, log `[cms] Supabase is unreachable`, and rethrow every other error. The home page,
  the marketing layout (theme) and both blog pages read through them.
- The public client sets `db: { retry: false }`. postgrest-js otherwise retries a failed GET 3
  times after 1, 2 and 4 s, so each read would stall 7 s before falling back.
- The proxy only builds a Supabase client on the protected paths (`siteConfig.protectedPathPrefixes`),
  so a public page never waits on `auth.getClaims()`.

`EMAIL_TO` is env rather than config because it is deployment specific: with the sandbox
sender it must be the Resend account owner.

## Auth flow

Supabase Auth with the publishable key. `src/proxy.ts` runs `updateSession` on every
request except static assets: it refreshes tokens, writes the refreshed cookies, forwards the
cache headers Supabase hands to `setAll`, and redirects anonymous visitors only on the
`protectedPathPrefixes` in `site.config.ts`, `/dashboard`, `/editor` and `/preview` (never
on `/api/*`, which answers 401 itself).
The matcher must be a literal, so the prefix list is checked in code.

Login and logout run on the browser client inside client components, not through tRPC:
Supabase Auth rate limits are per IP (a server would share one), and OAuth or email flows
are GET redirects. `protectedProcedure` calls `getClaims()`; `getSession()` is never trusted
on the server. Every dashboard page, every editor page and both preview pages check
`getClaims()` again because layouts do not re-run on navigation and the proxy must never be
the only check. The dashboard layout reads the claims too, but only to show the signed-in
email in the sidebar.

Public signups are off (`[auth] enable_signup = false` in `supabase/config.toml`, and the
same switch in the hosted dashboard). Every account is an editor. With signups on, anyone
holding the public key could self-register, become `authenticated`, read every contact
message and publish posts, because those grants go to that role. Accounts are created in
Studio. Self-service signup needs CAPTCHA, custom SMTP and roles first.

`signOut({ scope: "local" })` ends only this session. `queryClient.clear()` on logout
drops cached data so the next user in the same tab never sees it.

## Supabase grants

Hosted projects no longer grant new tables to `anon`, `authenticated` and `service_role`
automatically: new projects since 2026-05-30, all projects from 2026-10-30
(https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).
`auto_expose_new_tables = false` in `supabase/config.toml` makes the local stack behave the
same way; delete the line when the CLI drops the field. Every migration that creates a table therefore revokes
all privileges from `anon` and `authenticated`, grants exactly what the feature needs and
enables RLS. The `true`
policies for `authenticated` are deliberate, because every account is an editor; the
Supabase advisor may still flag them. Inserts into identity columns need no sequence grant.

`cms_entries` grants `authenticated` SELECT, INSERT, UPDATE and DELETE, and grants `anon`
SELECT on three columns only: `id`, `collection` and `published`. With the policy
`published is not null`, anon reads live versions and can neither select nor filter on
`draft`, `updated_at` or the other columns. `select=*` answers 42501 for anon, which is why
Supabase advises against column grants for most projects
(https://supabase.com/docs/guides/database/postgres/column-level-security); here one
repository reads as anon and names its columns. A view would not help: a `security_invoker`
view needs the same grants on the table, and a default view runs as its owner and skips RLS
(https://www.postgresql.org/docs/17/sql-createview.html). Functions follow the same
revoke-then-grant rule: `cms_publish_entry` is granted to `authenticated` only. The trigger
function has no grant at all and still fires for `authenticated`, because Postgres checks
EXECUTE on a trigger function when the trigger is created; `cms.spec.ts` would fail
otherwise.

## Static versus dynamic

`src/app/(marketing)/layout.tsx` exports `dynamic = "error"`: a marketing page that calls
`cookies()`, `headers()`, `connection()` or `draftMode()`, reads `searchParams`, or fetches
with `cache: "no-store"` or `revalidate: 0` fails `next build` instead of silently turning
dynamic. A plain `fetch`, such as the Supabase client's, runs at build time and again on
revalidation. The bundled docs call `dynamic = "error"` equal to `force-cache` and
`only-cache`, but the 16.3.8 source only sets `dynamicShouldError`; never set `cache`,
`next.revalidate` or `fetchCache` on the public Supabase client. Marketing pages must not use
a tRPC server-side caller either, because its context reads cookies. `/dashboard`,
`/editor`, `/preview` and `/api/trpc` are dynamic by design. Client providers mounted in the root layout do not make
pages dynamic. The header is not auth-aware for the same reason: it would read cookies on
every page.

`/blog` and `/blog/[slug]` are ISR. `/blog` is prerendered at build time. `/blog/[slug]`
returns `[]` from `generateStaticParams`, so no post is read at build time: each one renders
on its first visit and is then cached, 404s included. Both export `revalidate = 3600` on
purpose: tag invalidations live in one process's memory, the build's fetch cache survives
between builds, and edits made in Studio send no revalidation, so without a cap a stale list
could live forever. Publish, and Delete on a live entry, call `revalidatePath("/", "layout")`;
the next visit renders fresh, cached 404s included. Save draft never does. Expiry by time is
stale-while-revalidate: the first visit after the hour still gets the old page. A render
that read the data just before a publish and finished after it stays cached until the hour
runs out, and a prefetched `/blog` can stay in
the browser for up to 5 minutes (`staleTimes.static`). Pages are never cached in dev; check
with `next build && next start` and the `x-nextjs-cache` header.

`/` is ISR too since 2026-10-11. It reads the live `home` entry at build time and exports
the same `revalidate = 3600` for the same reasons (see "CMS singles"). The build therefore
reads Supabase for `/` as well as for `/blog` whenever the variables are set.

The marketing layout reads the live `theme` entry the same way and exports
`revalidate = 3600` itself (see "CMS theme"). A route takes the lowest value of its layouts
and its page, so every page under `(marketing)` is ISR at one hour now, `/login` included,
and each one reads Supabase once more at build time. `dynamic = "error"` still holds: the
read is a plain `fetch` through the cookie-less client.

## CMS

The admin where the owner of a site edits its content: the lists and the inbox under
`/dashboard`, and the editor that every entry opens in under `/editor` (see "CMS editor"
and "CMS canvas"). docs/cms-plan.md holds the features, the
decisions and the Figma map; this section holds the whys.

- One rule: nothing is live without Publish. Save draft writes the `draft` column only and
  never purges the cache, anon has no grant on that column, and the preview route needs a
  session. A typo never goes live in one click. `cms.spec.ts` proves each part (see
  "Testing").
- No content staging and no Next.js Draft Mode. Staging is for code; drafts and the preview
  cover content. `draftMode()` fails the build under `dynamic = "error"` (see "Static versus
  dynamic"), and a preview route keeps the public pages static and needs no secret key.
- Generic, so one CMS serves every client site. Collections and their fields come from
  `config/cms.config.ts`; the sidebar, the list, the editor, the publish check and the
  write schema are built from it. A new collection needs no migration and no CMS code (the
  README lists the steps). CMS code never names a collection or a field; `slug` is the one
  reserved field name.
- One table for every collection, with a `draft` and a `published` JSON version per entry.
  That is what makes a new collection free of migrations, and the publish state is two null
  checks. The price is that the database cannot check a field, so the router does (see "CMS
  data layer").
- Delete is in the app, because a client cannot use Studio.
- Desktop first: designed at 1440, works from 1280 to 1535 and does not break at 1024.
  Content is edited at a desk; there is no phone layout.

Which files are the CMS. Outside `app/`, every CMS file has `cms` in its name, so the CMS
can be copied into an existing site: `type/cms.type.ts`, `model/cms.model.ts`,
`util/cms.util.ts`, `repository/cms-entry.repository.ts`, `service/cms.service.ts`,
`router/cms.router.ts`, `hooks/use-cms-unsaved.ts`, the `cms-*` components, the routes under
`app/dashboard`, `app/editor` and `app/preview`, and the `cms_entries` migrations. It leans on the rich
text editor (see "Rich text editor"), the toast, `LogoutButton` and the shadcn parts it
imports. The site owns the two config files, `config/cms.config.ts` and
`config/cms-canvas.config.tsx`, plus whatever renders
its content. For the blog that is
`model/post.model.ts`, `type/post.type.ts`, `post-view.tsx`, `post-body.tsx` and the pages
under `/blog`. For the home page it is `data/home.data.ts`, `model/home.model.ts`,
`type/home.type.ts`, `home-view.tsx` and `app/(marketing)/page.tsx`. For the brand palette
it is `data/theme.data.ts`, `model/theme.model.ts`, `type/theme.type.ts`,
`util/theme.util.ts`, `site-shell.tsx`, `app/(marketing)/layout.tsx` and the forced theme
in `providers.tsx`. For the two fonts it is `data/font.data.ts`, `config/font.config.ts`,
the font classes in `app/layout.tsx` and the font lines in `globals.css`.

On 2026-10-11 a throwaway second collection (a text, a slug, a date and a switch field, a
field column and a badge column, no preview view) was added to the config and nothing else.
The sidebar, the empty list, the editor, the publish check, the list columns and Delete all
worked, Preview was hidden, a slug that a live post already uses was accepted, and `/blog`
did not change. It was removed again; `test/cms.test.ts` keeps the two-collection check of
the write schema.

### CMS data layer

The backend is one table, `cms_entries`, the `cms` router on `protectedProcedure` and
`supabase/seed.sql`. Public pages and the preview route read the table through the
repository (see "CMS on the site").

- One row per entry holds two JSON versions, `draft` and `published`. The publish state is
  two null checks (`cmsPublishState`), and a check constraint forbids both being null.
- Writes are validated at the tRPC boundary by `buildCmsWriteSchema(cmsCollections)`: a union
  with one object per collection, so an unknown collection or a bad value is BAD_REQUEST and
  unknown keys are stripped. The builders take the config as an argument, so the unit tests
  run on a fixture and never load the site's config.
- JSON columns have no per-field checks, and Studio edits skip the router. `toCmsValues` in
  the repository keeps only text and switch values, so a bad edit becomes a missing field.
  A page must still check an entry with its own read schema before it renders, as the blog
  does with `postSchema`.
- `slug` is a reserved field name. The unique index is on `(collection, published ->> 'slug')`
  for live entries, and the `CmsField` type forces a field of type `slug` to carry that name.
  Drafts may share a slug: `createEntry` and `saveDraft` check against live entries for early
  feedback, and the index decides at publish.
- Publish is one SQL statement in `cms_publish_entry` (security invoker, so RLS applies).
  PostgREST cannot write `published = draft`, and a read followed by a write from the app
  could wipe a draft saved in between. No row back means NOT_FOUND.
- Save draft stores null when `cmsChanges` finds no difference from the live version, and it
  never revalidates. Delete revalidates only when the entry was live.
- `updated_at` and `updated_by` come from column defaults on insert and from a trigger on
  update. Inserts are left to the defaults so the seed can set its own dates. `auth.uid()` is
  null in Studio and in the seed.
- The slug and link rules live in `cms.model.ts` (`cmsSlugSchema`, `cmsLinkSchema`), so the
  slug field, the blog's URL check and the editor's link popover share them.
- Show on site is an ordinary field. Anon can read a live entry whose switch is off through
  the REST API; only the page's own query hides it. A site with paid content needs a rule of
  its own.
- The seed holds the four sample posts from the Figma collection list, one per publish state
  plus a second published one. It runs on `pnpm db:reset` only.

### CMS on the site

The blog is the sample collection: its slug is `posts` and its label in the dashboard is
Blog.
`/blog` and `/blog/[slug]` read live entries of the `posts` collection through
`listLiveEntries` and `getLiveEntryBySlug` with the cookie-less client. Each entry is checked
with `postSchema` in `model/post.model.ts`, the site's read shape, which gives a typed
`Post`. An entry that fails the check, or has Show on site off, is left out of the list and
answers 404. The schema built from the config is for writes: it returns untyped values, so a
page would still need a check per field. The list is sorted by `publishDate` in the page,
because the repository is generic and orders by id. Unpublishing is Show on site off, then
Publish; the next visit to the post answers 404.

The summary is rich text, like the body (Criztian's call on 2026-10-11; it was a plain
textarea, and the advice was to keep it plain). It has three readers that used to take plain
text. `/blog` renders it with `PostSummary` in a `prose` block, so the list shows the
formatting. Headings are drawn as paragraphs there (`flatMarkdownOptions`): a summary
heading would otherwise sit in the page outline beside the post titles, and a `#` would give
the page a second h1. The post's meta description and the dashboard list take
`markdownToText(summary)`: a link preview is plain text by nature, and the list cell is one
cut line. The 300 limit counts the Markdown source, so the message for a rich text field
says "formatting and link addresses included".

`PostView` is the one post component: `/blog/[slug]` renders it with the live version, the
preview route with the saved draft, and the editor's frame with what is typed.

`/preview/[collection]/[id]` shows `draft`, or the live version when there is no draft, to
signed-in users. It lives outside `(marketing)` because it reads cookies, and it is a route
of its own because `draftMode()` fails the build under `dynamic = "error"`. The proxy
redirects anonymous visitors and the page checks `getClaims()` again. It draws the
collection's view from `config/cms-canvas.config.tsx`, the registry the editor's frame
uses (see "CMS canvas"). A collection without a view answers 404, and so does an entry
whose view returns `null`. Until `editor-all` the route had a registry of its own,
`cms-preview.config.tsx`, whose views drew the content without the site shell. With one
registry the view brings the header and the brand palette, and the route answers for the
single collections too. The registry is a `Map`, so a URL segment such as `constructor`
finds nothing. It is
not part of `cms.config.ts`, because client components import that file for its icons
and the view would pull react-markdown into every dashboard page. The frame
is the registry's one importer in the browser. A view therefore runs on the server and in
the browser: no `server-only` import
and no async view. The post view checks its values with `postPreviewSchema`, the read shape
with any text as the slug, so the frame draws before a valid slug is typed. The bar links
back to the editor at `/editor/<slug>/<id>`. Since 2026-10-11 nothing links to this route
(Criztian's call: Preview
stays in the editor, "rather than going to a new page"); it still answers by URL. Only the
frame blocks clicks, so a single's page drawn by this route has a contact form that really
sends (shortcut ledger).

Posts are written in the CMS editor (see "CMS editor"). The seed and Studio write entries
too.

The save pattern: the write comes first, so a failed write never purges the cache; then the
toast and `router.refresh()`. `staleTimes.dynamic` is 0, so a
forward navigation renders again anyway, but Back reuses the browser's cached copy of the
editor page, which `staleTimes` does not cover. Without the refresh, Back showed the old
form, and saving it again would overwrite the newer save. The list is a client query on
entries, so the editor also invalidates `cms.list` after create and save (see "CMS list").

`cms.publish` and `cms.delete` rely on `httpBatchLink`: the route handler runs pending
revalidations once its `Response` exists, and with the batch link that happens after the
mutation finished. A streaming link would answer first. Every publish purges the whole site;
that is cheap at blog size and keeps the code to one line.

Public pages render the body with `PostBody` and `markdownOptions` from
`lib/react-markdown.ts`: `remark-gfm` for tables, `rehype-raw` for the HTML Tiptap writes
(`<br>` in table cells, `<em>` when bold and italic overlap) and `rehype-sanitize` last, with
its default GitHub schema. Raw HTML written in Studio renders sanitized; HTML typed in the
editor is escaped by Tiptap and stays visible text. Never drop `rehype-sanitize`, put a
plugin after it, or override `urlTransform`. react-markdown also blanks links that are not
http(s), mailto, irc or xmpp.

`markdownToText` in the same file gives the plain text of a Markdown string. It calls
react-markdown's default export as a function, which is allowed because that function uses
no hooks, with the same options, and collects the strings from the React elements it gets
back. The text is therefore what the site would render, sanitized, with no second parser and
no new dependency. Table cells and `<br>` get a space, because react-markdown drops the
whitespace between cells. The service calls it for the list rows only when the collection's
summary field is `richtext`; a plain summary is left alone, so `C#` or `5 * 3` keep their
signs.

### CMS shell

`src/app/dashboard/layout.tsx` draws the sidebar, the `main` area with the page gutter and
the toast. Every dashboard screen sits in it.

- `cms-sidebar.tsx` is hand-written, not shadcn's `sidebar`, although the Figma note on the
  Sidebar component names it. That item is 731 lines and adds `skeleton`, `tooltip`
  and `use-mobile`; the hook sets state inside an effect, which fails the react-hooks lint
  here. Its collapse and phone drawer are not in v1, and the look is the same without them.
- The sidebar is a client component for two reasons. It imports `cms.config.ts` for the
  icons, because a component cannot cross from server to client as a prop. And it reads the
  open section with `useSelectedLayoutSegment`, because a layout does not render again on
  navigation.
- The current item carries `aria-current="page"` and is styled from that attribute, so no
  class is chosen in code. Its background (`bg-muted` on `bg-sidebar`) is 1.04:1, under the
  3:1 a state needs. That is the Figma design, kept because the font weight, the attribute,
  the `h1` and the page title say the same thing.
- The sidebar has three groups: Pages, Content and Inbox. Pages holds one item, Editor,
  a link to `/editor`. It is a different page, not a screen inside the dashboard: the
  page editor fills the window and has no sidebar (see "CMS canvas"). Criztian's call on
  2026-10-12: "create a sidebar called editor and when I click it navigate, not same
  page, different page for the editor". The pages themselves (the single collections,
  Home page and Theme) are listed inside the editor, not in this sidebar: "rather than on
  the sidebar of the dashboard ... in the editor we have all the pages there". The Editor
  item is never the current row, because the dashboard is never drawn around the editor.
- Content lists the list collections only (`single !== true`). Each lives at
  `/dashboard/<slug>`, so those rows have one link shape.
  `useSelectedLayoutSegment` answers the first segment, so the row is current on the list.
  An entry opens in `/editor`, which has its own hierarchy and no sidebar (see "CMS
  canvas"). A New row under each collection was tried on 2026-10-11
  and removed the same day (Criztian's call): it read as a second category under Blog. New
  stays on the list.
- Focus rings are box-shadows, and forced-colors mode (a Windows contrast theme) removes
  them. The sidebar rows, the list's title link and the message toggle use
  `focus-visible:outline-hidden`, which keeps an outline in that mode; with `outline-none`
  they showed no focus mark at all in Chromium's forced-colors emulation on 2026-10-11. The
  shadcn parts still use `outline-none` (shortcut ledger).
- A `single` collection (one entry, no list) has no sidebar row since 2026-10-12. Until
  then it had one, and on 2026-10-12 Claude twice misread Criztian's words as "move the
  whole admin under `/editor` and delete the dashboard"; that build was thrown away.
  Its old address `/dashboard/<slug>` still forwards to `/editor/<slug>`, which opens the
  page editor (see "CMS canvas").
- `/dashboard` redirects to the first collection that is not a single, or to Messages when
  there is none. A single would send the editor's Back to dashboard link straight back
  into the editor. `/dashboard/[collection]` is the list (see "CMS list"), and an unknown
  slug answers 404.
- `/dashboard/messages` is a static segment and wins over `[collection]`. That is why
  `messages` is a reserved collection slug; nothing enforces it.
- Inbox and Messages are named in the sidebar because the contact inbox is part of this
  template. A site without the contact form deletes the group and the page.
- Messages is a table on shadcn's `table`, by Criztian's call on 2026-10-11; the entries
  list stays a native table (see "CMS list"). The cells override shadcn's padding and header
  colour so the two tables look alike. `contact-message-list.tsx` keeps its own `headClass`,
  `cellClass` and `frameClass` instead of sharing them with a `cms-*` file, so the inbox and
  the CMS can each be deleted without the other.
- A message shows as one line. A chevron button with `aria-expanded` opens it in place, and
  each row keeps its own state, so opening one never closes another. While a row is closed
  the button's `::after` covers the cell, so a click anywhere on the line opens it; once
  open the cover is gone and the text can be selected. Opening a row also shows the
  sender's name and address in full; closed, both are cut. The button is a plain `button`, not
  `Button`, which moves 1px while pressed and would become the containing block of the
  cover.
- Reply is a `mailto:` link. The address is encoded, with `@` put back, because anon can
  insert a row straight through PostgREST (see "Abuse protection"): a stored address such
  as `a@b.com?bcc=x@y.com` would otherwise add a hidden recipient to the reply.
  `contactReplyHref` in `util/contact.util.ts` builds the link, and `test/contact.test.ts`
  checks that address.
- Received is formatted in the browser's time zone, like Updated in the list.
- Not in Figma: the Log out row, and the email where Figma shows a name,
  because accounts have no display name. "Admin" is fixed text, since every account is an
  editor. The row is `LogoutButton` and says "Log out" to match "Log in" on the site. It
  drops the Button's 1px border so its icon lines up with the nav items.
- The layout reads the claims only to show the email. The pages still check them.
- The toast is shadcn's base-nova `toast` (Base UI Toast: stacking, swipe, `aria-live`),
  mounted only in this layout and the editor's so public pages ship none of it. `components/ui/toast.tsx`
  gained `motion-reduce:transition-none` by hand; keep it when the item is added again with
  `--overwrite`. Errors stay inline in the form, where they persist.
- `--success`, `--success-soft`, `--info`, `--info-soft` and `--warning` in `globals.css` are
  the Figma values in hex (Tailwind's green, blue and amber). Contrast: success on its soft
  background 6.49 light and 8.55 dark, info 5.49 and 5.78, the warning dot on the page 5.02
  and 11.86. The publish state reads `--success` and `--warning`; the badge variants read
  `--success`, `--success-soft`, `--info` and `--info-soft`.

### CMS list

`/dashboard/[collection]` lists a collection (Figma 4:31). The page is a Server Component: it
checks the claims and draws the heading and the New link. `cms-entry-table.tsx` is the client
part. The dashboard `main` is `px-10 py-8`, the Figma gutter.

- `cms.list` returns list rows, not entries. `listEntryRows` in the service maps each entry
  with `toCmsListRow`: the title and summary of the newest version (the draft when there is
  one), `updated_at`, the publish state and one cell per extra column. Passing the
  repository's rows through would send both versions of every entry, bodies included, to
  the browser. An unknown collection answers NOT_FOUND, not `[]`.
- A missing or non-text title reads "Untitled", so a bad Studio edit cannot break a row.
- Extra columns come from `columns` in the config. `{ label, field }` shows the stored text
  of a field, so a date reads `2026-10-08` and a switch reads Yes or No. `{ label, badge }`
  is a function of the newest values that returns `{ tone, label }`, or null for an empty
  cell. The function runs in the service, so the browser gets plain data and the table never
  imports the config; the page passes the column labels as props. The sample
  collection has no extra column: the proof is the unit test, plus screenshots taken once
  with a throwaway field column and badge column.
- Extra columns sit between Title and Updated, 160px each. Figma does not place them.
- The table is a native `<table>` with `table-fixed`, not shadcn's `table`, which is the
  same elements with classes that every cell here would override. The widths follow the
  Figma row: Updated 120, Site 160, actions 32, with the 16px gap split between neighbours.
  A row is 65px high where Figma has 64, and the header 45 where Figma has 44: Figma draws
  the divider inside the row and CSS adds it below. With four rows the table ends 6px lower
  than the frame (measured on 2026-10-11).
- The table has a minimum width: the fixed columns plus 160px for the title and for each
  extra column, worked out from the Tailwind spacing variable. Past it the frame scrolls
  sideways, not the page. Without it two extra columns left the title 14px wide at 1024.
  The frame is `relative`, because the `sr-only` Actions heading is absolutely positioned
  and would otherwise escape the scroll container and make the page scroll.
- Updated is formatted in the browser's time zone with `Intl.DateTimeFormat("en-US",
{ dateStyle: "medium" })`. Rows render only after the client query answers, so the server
  and the client never disagree.
- The list is a client query on `cms.list`, like the messages. Delete invalidates it. The
  editor does the same after create, save and publish, because `staleTime` is 30 seconds.
- New is a `Link` with `buttonVariants`, not `Button` with `render`: Base UI's `Button`
  puts `role="button"` on a link, and the end-to-end test could not find it as a link. Edit
  is a `DropdownMenuItem` rendered as a `Link`; Enter on it navigates. Both open the editor,
  at `/editor/<slug>/new` and `/editor/<slug>/<id>`.
- The title is a `Link` to the editor too (Criztian's call on 2026-10-11: the editor could
  not be found behind the New button and the row menu). Its `::after` covers the title cell, so a click on the title, the summary
  or the space around them opens the entry; the cost is that text in that cell cannot be
  selected with the mouse. It has `prefetch={false}`, or a full list would prefetch up to
  100 signed-in pages.
- Delete opens one `AlertDialog` for the whole table, opened from the menu item's `onClick`
  (the Base UI pattern; a dialog inside the menu would unmount with it). The row stays in
  state while the dialog closes, so its title does not blank during the exit animation. The
  text depends on the state: a live entry "comes off the site right away", a never-published
  draft "was never published, so the site won't change". An error stays inline in the
  dialog; success shows the toast.
- The Delete button is solid `bg-destructive` with `text-background`: 4.76:1 light and
  6.84:1 dark. The `destructive` variants of `Button` and `DropdownMenuItem` tint the
  background and measure 3.83:1 and 3.99:1 in the light theme, under AA, so the menu item
  is plain and the button overrides the colours.
- The dialog opens with focus on Cancel, Tab cycles Cancel and Delete, Esc closes it and
  focus returns to the row's menu button. Base UI moves focus back from its guard on the
  next animation frame, so a script that presses Tab twice within one frame gets past it.
- States with no Figma frame: "Loading..." (`role="status"`), "Could not load this list."
  with Try again (`role="alert"`), and "Nothing here yet." The error shows after React
  Query's three default retries, about 7 seconds. The copy avoids the collection's plural
  label, because lowercasing breaks a label such as "FAQs"; `singular` is lowercased, as the
  service already does.
- `ui/badge.tsx` has three hand-added variants, `success`, `info` and `neutral`, on the
  tokens in `globals.css`; keep them when the item is added again with `--overwrite`.
  Badges in the table are `h-6`, Figma's 24px; shadcn's default is 20. The `outline` tone
  uses shadcn's `outline` variant, so its text is `foreground` where Figma has
  `muted-foreground`.
- `CmsPublishStateLabel` in `cms-publish-state.tsx` is the dot plus the word, never colour
  alone. The Draft dot is `muted-foreground`. The editor reuses it.

### CMS editor

`/editor/[collection]/new` and `/editor/[collection]/[id]` are one route file, for every
collection since `editor-all` (2026-10-12, Criztian's call: "everything opens in
`/editor`, blog posts too"; the advice was pages only). The page is a Server Component: it
checks the claims, finds the collection, reads the entry with the repository and hands
plain props to `cms-entry-editor.tsx`, keyed by id. That file holds the form logic,
`cms-entry-field.tsx` draws one field, and `cms-entry-canvas.tsx` is the screen around
them (see "CMS canvas").

Until `editor-all` a list collection opened in a form under `/dashboard/<slug>/<id>`
(Figma 5:152), with its Settings card in a drawer and a preview pane beside the form.
All of that is gone: the route file, the form layout, `ui/sheet.tsx`, the `drawer` key,
`cms-entry-preview.tsx`, `use-cms-preview.ts` and `cms-preview.config.tsx`. The old URLs
answer 404 with no redirect, because nothing was deployed with them.

- `new` is tested before the id is parsed as a number. For a single, `new` redirects to
  the row when there is one; for a list it is always a new entry.
  `/editor/messages/<anything>` answers 404, because `messages` is not a collection.
- The tab title is "New post" or "Edit post" for a list (the collection's `singular`) and
  the label for a single.
- Only the newest version (`cmsNewestValues`) goes to the browser, with the publish state.
  Whether the collection has a page view is read on the server (`cmsCanvasViews.has`), so
  the registry and react-markdown stay out of the editor's own scripts; they load inside
  the frame.
- The form is react-hook-form with `zodResolver(buildCmsValuesSchema(fields))`, the schema
  the router checks with. The schema builders in `cms.model.ts` name their input type
  (`z.ZodType<CmsValues, CmsValues>`): `zodResolver` rejects an `unknown` input, and without
  it the client type of `cms.saveDraft` was `{ id }` only.
- `cmsInitialValues` gives every field a start value, because react-hook-form reads a missing
  key as a change. A stored value is kept when its type fits. Otherwise the field's `default`
  is used when it has one (see "CMS singles"). With no default a switch starts on, a required
  date starts as today, a select starts on its first option and the rest start empty. That is "today on create" and "on
  by default" for Posts with no config key, and a field lost to a Studio edit still renders.
- Today is the browser's local date; a server on UTC is a day behind Manila until 08:00. So
  the form is client-only: `CmsEntryEditor` reads the date with `useSyncExternalStore` and
  shows "Loading..." in the server HTML, and `CmsEntryForm` mounts in the browser. A
  `useState` initialiser would pass lint and still disagree with the server HTML.
- The Controller's render function passes plain props to `CmsEntryField` (`ref`, `value`,
  `error`, `onChange`, `onBlur`), not react-hook-form's `field` object: the `react-hooks/refs`
  rule treats an object with a `ref` property as a ref and flags every read of it.
  `cms-entry-field.tsx` has no `"use client"` line, like `markdown-editor.tsx`: only a client
  component imports it, and with the line the Next TypeScript plugin warns about function
  props.
- Fields by type: `text` and `slug` are `Input`, `textarea` is `Textarea`, `richtext` is
  `MarkdownEditor` with its start value read once, `switch` is shadcn's `switch` in the Figma
  row (text left, switch right), `date` is a date picker and `color` a picker beside a hex
  box (see "CMS theme").
- `select` is a dropdown over the field's `options`, a list of `{ value, label }`
  (2026-10-12). The control is shadcn's `native-select`, a native `<select>`, not the Base
  UI `select`: the label, the keyboard and react-hook-form's focus work as on an input,
  and no popup can stay open when its section is hidden, which the calendar needed a fix
  for. It is sized from outside (`*:data-[slot=native-select]:h-9`), so
  `ui/native-select.tsx` stays as generated. The cost: the list cannot draw an option in
  its own font.
- A select always holds one of its options. `cmsInitialValues` keeps the stored value only
  when it is an option, then takes `default`, then the first option; any other stored
  text would leave the form with a value the control cannot show. The type wants at least
  one option, and forces `options` onto a select the way it forces the name onto a slug
  field. The write schema is `z.enum` of the values, so `required` means nothing here.
- The publish check shows a select's label, not its stored value. `cmsChanges` looks the
  label up after it has compared the stored values, as it already cuts rich text down to
  the changed block. A list column on a select field still shows the stored value
  (shortcut ledger).
- `placeholder` in the config gives a field its grey hint (2026-10-11). An input takes it as
  the attribute. A rich text field draws it with Tiptap's `Placeholder` extension: the
  extension marks the empty first paragraph, the editor's classes print its
  `data-placeholder` in a `::before`, and `aria-placeholder` carries it for screen readers.
  The extension is built once per editor (`buildEditorExtensions`, held in `useState`),
  because `useEditor` resets its options whenever the array changes.
- `compact` gives a rich text field a short box, 96px where the default is 256. Posts uses
  it for the summary (see "CMS on the site").
- A section can hold more than one rich text field. The `Field` of each is a `group` named
  by its label, so the two "Formatting" toolbars can be told apart, by a screen reader and
  by a test (`getByRole("group", { name: "Body" })`). The helper text is tied to the editor
  with `aria-describedby`.
- A rich text field reads its start text once, when it mounts (`useState` in
  `CmsEntryField`). Every section mounts with the form, so that is the page-load value.
- The date picker is shadcn's `calendar` in the existing `Popover`, behind an outline button
  that shows "Oct 7, 2026" (Criztian's call on 2026-10-11, to match Figma; a native date
  input would have needed no dependency). It brought `react-day-picker` 10 and `date-fns` 4.
  This field is the only consumer of `react-day-picker`; `date-fns` also reads today's date
  in `cms-entry-editor.tsx` and formats the date in the publish check. The value stays a `YYYY-MM-DD` string: `parseISO` reads it as local midnight and
  `format` writes it back. A day click closes the popover. Clicking the selected day again
  clears the field only when it is not required. The button is named by the label plus its
  own text (`aria-labelledby`), so a screen reader hears the date. Focus on open goes to the
  first button in the popover, Base UI's default; two Tabs reach the selected day, the arrow
  keys move and Enter picks. react-day-picker's `autoFocus` did not put the focus on the day
  under Base UI, so it is not set. The end-to-end test runs all of this in the Settings
  section of a post: neither pick submits the form, and Esc closes the calendar only.
- `ui/calendar.tsx` has a hand edit: `CalendarDayButton` passes `ref={ref}` to its `Button`.
  The generated file created the ref and focused it but never attached it, so the arrow keys
  moved nothing and a keyboard user could not pick another day (seen on 2026-10-11 with
  shadcn 4.21 and react-day-picker 10.0.2). `ui/switch.tsx` has one too: the default size is
  the Figma switch (track 40 by 24, thumb 16). Keep both when the items are added again with
  `--overwrite`.
- The `h1` follows the title field (`useWatch`), or reads "New post" or "Untitled". The chip
  shows once the entry is saved; its state comes from the server after `router.refresh()`.
- Save draft on a new entry calls `cms.create`, then `router.replace` to
  `/editor/<slug>/<id>`, so Back never returns to a form that would create a second entry.
  The button stays disabled after that success until the page remounts. On an existing
  entry it calls `cms.saveDraft`, then `router.refresh()`. Both show the toast "Draft
  saved", reset the form to the saved values and invalidate `cms.list`. Neither touches the
  site: only `cms.publish` and a delete of a live entry call `revalidatePath`.
- `CONFLICT` becomes an error on the Slug field with focus (`slug` is the reserved field
  name); its section is selected first. Any other failure shows in a row of its own above
  the scrolling fields, so it is in view however far the panel is scrolled (it was the
  first child of the scroller until the review of 2026-10-12).
- Each field error has an id, and the failed control names it in `aria-describedby` beside
  its helper text, so a screen reader ties the message to the field.
- Save draft, Publish and the dialog's Publish stay focusable while they are off
  (`focusableWhenDisabled`, which Base UI turns into `aria-disabled` and a blocked click).
  A natively disabled button drops the focus to `body`, which is where it landed after
  every save and every publish.
- A popover that belongs to a field (the calendar, the link box of a rich text field)
  closes when its section is hidden. A click in the frame never reaches the editor's
  document, so Base UI did not see an outside press and left the popover open in the
  window's top-left corner. `CmsEntryField` and `MarkdownEditor` take `hidden` for this.
- The fields are not locked while a save runs. `inert` on the cards was tried: `onError` ran
  while the cards were still inert, so the Slug field refused the focus and the end-to-end
  test failed on it. A field that holds the focus would also lose it when it turns inert;
  that part was not tested. See the shortcut ledger.
- The top bar has Save draft and Publish, on every entry, new ones included. Save draft is
  the form's submit button; Publish is `type="button"`, saves what is unsaved and opens
  the publish check (see "CMS publish").
- Every card is a section in the hierarchy, Settings for a post included (it was a
  drawer). A section that was never selected still saves its start values, because every
  section stays mounted; the journey test publishes a post without opening Settings.
- There is no Preview button. The frame draws what is typed, not what is saved, also for
  an entry that was never saved (see "CMS canvas").
- The info line closes the panel: "Changes stay in this draft until you publish."
- Leaving with unsaved changes asks first. One effect follows `formState.isDirty`: it adds a
  `beforeunload` listener and sets a jotai atom, and its cleanup clears both, since the atom
  outlives the page. `use-cms-unsaved.ts` holds the atom and the question
  (`window.confirm`, the same native prompt the tab close shows). The editor's back link
  and hierarchy rows ask in `onNavigate`, the pattern in Next's `Link` docs with jotai in
  place of the context. The dashboard sidebar and Log out asked too until `editor-all`;
  the form never shares a screen with them now, so those two guards are gone.
- A click into the body does not count as a change: Tiptap reports the trailing paragraph it
  adds as an appended transaction, which `MarkdownEditor` ignores. A body that does not
  round-trip to the same Markdown (the seed's table post) can stay "unsaved" after an edit
  is undone.

### CMS publish

Publish in the editor opens the publish check (Figma 14:457) before anything goes live.
`cms-publish-check.tsx` is the button, the dialog and the `cms.publish` call, which runs
`cms_publish_entry` (see "CMS data layer").

- Publish saves first (Criztian's call on 2026-10-12: "publish directly so its fast").
  Going live took three clicks: Save draft, Publish, then Publish in the check. Now one
  click on Publish checks the form, saves the draft when anything is unsaved and opens the
  check; the second click confirms. The check stays, by his choice, so a typo still never
  goes live in one click.
- The list is built in the browser when Publish is pressed. After the save the editor
  reads the entry back with `cms.get` and runs `cmsChanges(fields, published, draft)`,
  the function `saveDraft` uses to decide whether a draft differs from the live version,
  so the list and the publish state cannot disagree. Until 2026-10-12 the page built the
  list on the server and passed it as a prop; that list was as old as the last page
  load. The read happens before the dialog opens, so the dialog has no loading state; a
  failed read shows as the form's error.
- A new entry has the Publish button from the start. Publish creates it, and the move to
  `/editor/<slug>/<id>` waits until the check closes, by Cancel or by a publish: the move
  remounts the form, and an open dialog would be lost with it.
- A failed check of the form opens no dialog and saves nothing: the first failed field's
  section is selected and the field focused, as for Save draft.
- When the saved draft equals the live version there is nothing to list: a toast says
  "Nothing to publish".
- A first publish has no live version, so every field with a value is listed with no old
  value.
- `cmsChanges` puts the field `type` on each change. The dialog formats a date like the
  editor's date button ("Oct 7, 2026") and a switch as Yes or No (`cmsValueText`, the words
  the list columns use).
- Rich text lists only the paragraphs that changed. `cmsChanges` splits both texts on blank
  lines and drops the equal paragraphs at the start and at the end. What is left is one
  block, so two edits far apart show everything between them; it never hides a change. When
  only blank lines changed nothing would be left, so the full texts are kept. See the
  shortcut ledger.
- Rich text shows as Markdown source. Rendering it would put react-markdown into the
  editor's own scripts (see "CMS editor"); the frame shows the rendered post.
- Publish is off while a save runs, while the page refreshes, and when the entry is
  published with nothing typed since. `router.refresh()` still runs inside
  `useTransition` after a save and after a publish, so the chip and that off state follow
  the server; the list no longer depends on it.
- The dialog keeps the list it was opened with in state, so the list cannot change under the
  reader and does not blank while the dialog closes after a publish.
- It is the list's `AlertDialog`, not a new shadcn `dialog`: a confirm that must
  be answered, with the same focus trap and Esc. Classes on this dialog give it the Figma
  look (512 wide, `p-6`, `rounded-lg`, a plain footer). `ui/alert-dialog.tsx` stays as
  generated, so the Delete dialog keeps the shadcn look.
- The old value is a `del` and the new one an `ins`, each with a visually hidden "Before:" or
  "After:", because screen readers do not announce a strike-through. A value that was
  emptied reads "Removed"; an empty value on a first publish reads "Empty".
- The list scrolls past half the screen height and takes focus, so the keyboard can scroll
  it. It is the first stop in the dialog, so focus opens on the list, not on Cancel: Enter
  does nothing there and Publish is two Tabs away.
- `cms-publish-check.tsx` has no `"use client"` line, like `cms-entry-field.tsx`: it takes a
  function prop and only the editor imports it.
- After a publish the dialog closes, the toast says "Published", the page refreshes (the
  chip turns to Published and Publish turns off, with the focus back on it) and `cms.list`
  is invalidated. `publishEntry` purges the site.
- A failure stays inline in the dialog. CONFLICT reads "Another post already uses this slug":
  two drafts may share a slug and the index decides at publish, where the repository only
  says "Could not publish the entry".
- Not in Figma: the scroll, "Removed" and "Empty", the error line and "Publishing...". The
  overlay is shadcn's light blur where Figma has a dark scrim, and the control radius is 10
  where Figma has 8, as on the editor.

### CMS singles

A single collection has one entry and no list: the home page's text and the theme
(docs/cms-plan.md, Page editor). `single: true` in the config is the whole switch.

- The database keeps it at one row, not the app. `cms_entries.single` is true for the row
  of a single collection, and a partial unique index on `(collection) where single`
  refuses a second one. An app check alone is a read followed by an insert, and two rows
  would fail silently: the editor reads the newest row and the site the highest live
  id, so the owner could edit one row while the site shows the other. The slug index
  cannot do the job: an entry with no slug has NULL there, and NULLs are distinct.
- The SQL names no collection. `insertEntry` writes the flag from the config, so a new
  single collection needs no migration. Anon has no grant on the column and needs none;
  `cms.spec.ts` checks that anon cannot select it.
- `/editor/<slug>` redirects a single to `/editor/<slug>/<id>`, or to
  `/editor/<slug>/new` when it has no row, and `/editor/<slug>/new` redirects to the row
  when one exists (see "CMS canvas"). The old address `/dashboard/<slug>` forwards to
  `/editor/<slug>`, so the lookup is written once. The form logic is the one every
  collection uses, because its first save already moves to the entry's URL.
- A second create answers 23505, which is CONFLICT. The editor puts a CONFLICT on the Slug
  field; a collection with no slug field gets it as the form's error: "<label> already
  exists. Reload the page to edit it." It does not reload by itself, because that would
  replace what was typed without asking.
- A single's `h1` is the collection label, and its back link reads Back to Dashboard,
  because it has no list to go back to. `titleField` is optional for that. The `h1` that follows the title
  field is a child component, `CmsEntryTitle`, mounted only when there is a title field:
  `useWatch` takes a name or nothing, never "maybe a name".
- `default` on a field is the editor's start value when nothing fitting is stored. A
  stored empty string is kept, so the owner can blank a field on purpose.
- The site does not read `default` from the config. The home page checks the live entry
  with `homeSchema`, whose keys each end in `.catch(<default>)`, and `HOME_DEFAULTS` in
  `data/home.data.ts` feeds both the config and the schema. So `/` draws with no entry,
  with no Supabase env, after a field is added and after a bad Studio edit; a required
  heading that was emptied in Studio falls back too. A generic reader with defaults was
  not built: it would need a made-up "today" for date fields and would still hand back
  untyped values.
- `/` reads through `listLiveEntries` and takes the first row. That needs no new
  repository function, and an array is what the end-to-end mock answers for every table.
- `home` sits after `posts` in the config. The order sets the rows of the sidebar and of
  the page editor's hierarchy, and which single `/editor` opens. `/dashboard` skips the
  singles and opens the first list, which the end-to-end login helper expects to be Blog.
- The home defaults are the text the page had before, so `public.spec.ts` did not change.

### CMS theme

The owner picks five colors in the `theme` collection, a single: background, text,
primary, accent and muted. The public site draws them after Publish. docs/cms-plan.md,
Theme on the public site, has the token table.

- One palette, dark only (docs/brand.md; Tokens phase 2026-10-29). `providers.tsx` passes
  `forcedTheme="dark"` to next-themes on every path, so `html` always has the `dark` class,
  shadcn's `dark:` styles fire everywhere and next-themes sets `color-scheme: dark` (native
  scrollbars and controls match the black page). `globals.css` has no `.dark` block: its
  `:root` holds the dark values, the same ones `themeCss(THEME_DEFAULTS)` prints, so pages
  outside the marketing layout (dashboard, Next's 404) match the site.
- Brand tokens (Tokens phase 2026-10-29). The `@theme` block carries the Figma variables
  under their Figma code names: primitives (`--color-black`, `graphite`, `paper`, `smoke`,
  `red`, `white`) and the semantic `--color-bg-page`, `bg-surface`, `text-primary`,
  `text-muted`, `text-on-accent`, `border-subtle`. The semantic ones point at the primitives,
  not at the shadcn tokens, because `themeCss` computes muted text (`#969695`) and borders
  (`#212121`) where Figma has smoke `#8a8a86` and graphite `#232323`. So the CMS Theme editor
  steers the shadcn layer only. `--color-accent` is the one shared name: shadcn's
  `var(--accent)`, whose default is the brand red, so shadcn's menu-item focus fill is red
  until the components phase restyles it. `--color-black` replaces Tailwind's `#000`.
  The twelve text styles are `--text-*` with their line height, tracking and weight; the
  three giant-name sizes are `clamp()` in px, since they must fit the viewport, not follow
  the root font size. `--radius: 0` turns every shadcn `rounded-*` into a hard edge.
  Spacing and gutters need no tokens: space/N is Tailwind's scale. `--ease-out` is the brand
  easing (a judgment in docs/brand.md) and `--motion-fast/base/slow` the durations, used as
  `duration-(--motion-base)`.
- `themeCss` in `util/theme.util.ts` turns the five colors into 18 shadcn tokens and
  returns one string, because React prints an empty style tag when a `style` element has
  two children. `SiteShell` prints it above the header. The selector is `:root:root`,
  which beats `:root` and `.dark` in `globals.css` with no `!important`.
- Only the marketing layout and the views in `cms-canvas.config.tsx` render `SiteShell`.
  The editor's frame and, since `editor-all`, the by-URL preview route draw those views,
  so both have the palette and the CMS code of neither names a collection. The dashboard,
  the editor's own chrome, the error page and the 404 for a URL that matches no route keep
  the default tokens. A missing post's 404 renders inside the marketing layout, so it has
  the header and the palette.
- Every printed value is hex built again from parsed numbers, never the stored text. A
  stored `red;}body{display:none` fails `cmsColorSchema`, the read schema's `.catch` puts
  the default in its place, and `themeCss` falls back the same way when it is handed the
  text directly. `test/theme.test.ts` checks both.
- Text on a primary or accent fill is black or white, whichever contrasts more. The worst
  fill is a mid grey, where that still gives 4.58 to 1.
- Soft text (`--muted-foreground`, also the focus ring) is the first mix of text into
  background, from 60% to 100% text in steps of 10, that reaches 4.5 to 1 on the
  background and on muted. Lines (`--border`, `--input`) are 10% text in background.
- The error red starts from the two reds the site had before, `#e7000b` and `#ff6467`,
  and is mixed toward the text color in steps of 20% until one of them reaches 4.5 to 1
  on the background. On a mid-grey background that ends at the text color itself. The
  plan named `#e40014` and `#ff6568`; those are not what the browser drew. The Delete
  button measured 4.76 to 1 (see "CMS list"), which is `#e7000b` on white.
- One helper, `firstReadable`, picks soft text and the red. On 2026-10-11 a script ran
  200,000 random palettes that pass the contrast rule: soft text and the red never fell
  under 4.5 to 1, fill text never under 4.58.
- The contrast rule is a key on a field. `contrast: { field: "text", min: 4.5 }` on
  `background` and on `muted` means: that field's color must reach 4.5 to 1 against this
  one. `buildCmsValuesSchema` checks it once for the whole entry, so the editor and the
  router refuse the same saves, and the error lands on the field that carries the key.
  Text under 4.5 to 1 blocks Save draft, because an unreadable site is a real failure.
- zod runs that check even after a field failed its own format check, so the rule skips a
  color it cannot parse; the field already shows "Enter a color like #1a2b3c".
- Every Controller gets `rules.deps`: the fields whose `contrast` points at it. With a
  resolver, react-hook-form updates only the changed field's error, so without the `deps`
  a fixed Text left the errors on Background and Muted until the next Save draft. The
  plan had this in the canvas phase; it moved here with the rule (2026-10-11).
- The color control is a native color input beside a hex box. The label points at the
  box, and the picker is named "<label> color picker". A valid hex writes to the form on
  every key. A half-typed one stays in the control's own state and is written on blur or
  Enter: the form never holds `#12` while the owner types, which the canvas will redraw
  from, yet a wrong value still reaches the check and shows its error. No effect syncs
  the two: the box shows its own text only while that text is not a color.
- Colors are stored trimmed and in lowercase, so `#FFFFFF` over `#ffffff` is no change in
  the publish check. A color field that is not `required` may be empty.
- `cmsColorChannels` and `cmsContrast` live in `util/cms.util.ts`. `cms.model.ts`,
  `theme.model.ts` and `theme.util.ts` import runtime values with relative `.ts` paths,
  because node:test loads them (see "Testing"). They are the first such imports inside
  `src`, and Turbopack builds them.
- The palette adds two rules to `globals.css`, outside any layer. `:root body` sets the background and the
  text color: Next's default 404 styles `body` inline with a dark media query, and that
  beats the layered base rule, so on a dark system the 404 for an unknown URL was black. `.prose` maps the 18
  typography variables to tokens, so rich text follows the palette on the site and the
  dashboard's own tokens in the editor. `prose-neutral dark:prose-invert` left the post
  view, the blog list and the editor.
- Rich text body is the text color, not a softer grey: a softer shade could fall under 4.5
  to 1 on a palette that only just passes. Code blocks take the text color as their
  background and the background as their text.
- What changed with no palette edit (old values converted from the `oklch` tokens): the
  site no longer turns dark; lines `#e5e5e5` to `#e7e7e7`; soft text `#737373` to
  `#6c6c6c`, which lifts it on muted from 4.35 to 4.82 to 1; the focus ring `#a1a1a1` to
  `#6c6c6c`; text on fills `#fafafa` to `#ffffff`; rich text body `#404040` to `#0a0a0a`,
  its headings and links `#171717` to `#0a0a0a`, bullets `#d4d4d4` to `#6c6c6c`, code
  blocks `#262626` with `#e5e5e5` text to `#0a0a0a` with `#ffffff`. In the dashboard's
  dark theme the rich text editor's code block is light.
- Accent has no surface in the template's sections and muted shows only on hover, so both
  fields say so in their helper text.

Fonts (2026-10-12). The same collection has a second card, Fonts, with a heading font and
a body font, each a dropdown over a list of six in code.

- The list is in code because `next/font` reads its arguments at build time: they must be
  written literals, and each call must sit in a `const` at module scope. So the owner
  picks from fonts the build already holds, never any font.
- Two files, because two readers cannot share one. `data/font.data.ts` holds the six
  `{ value, label }` options and imports nothing, so the config, the read schema and
  node:test can load it. `config/font.config.ts` holds the six `next/font/google` calls,
  which Node cannot run outside a build.
- A font's key is therefore typed twice: the `value` in the data, and the literal
  `variable: "--font-<value>"` in the config. Nothing in the type system ties them.
  `public.spec.ts` does: it reads `--font-<value>` for every option and expects the
  label in it. With Lora's variable misspelled on purpose (2026-10-12), that test failed
  and the page drew in Times New Roman.
- Every font's variable class sits on `html` in the root layout, so the frame, the
  by-URL preview and the public site all have the six variables with no code of their
  own.
- Portfolio (2026-10-29): only the brand fonts remain, Anton (heading default, one static
  weight, 400) and Inter (body default), both preloaded because both draw on every page.
  Heading and body each fall back to their own default (`HEADING_FONT_DEFAULT`,
  `BODY_FONT_DEFAULT`). Geist Mono left the root layout, so `font-mono` is Tailwind's system
  stack. The notes below describe the template's six fonts; read Geist as Inter.
- `globals.css` has `:root { --font-sans: var(--font-inter) }`, outside any layer. It is
  not decoration: Tailwind prints `:root{--font-sans:var(--font-sans)}` in its theme
  layer, a loop. Until this phase Geist's own class set `--font-sans` and broke the loop;
  now that class sets `--font-geist`, and this line does it. Without it every page falls
  to the browser's default font.
- `themeCss` adds `--font-sans:var(--font-<body>)` and `--font-display:var(--font-<heading>)`
  to its one `:root:root` rule. `--font-heading` is `var(--font-display,
var(--font-sans))`, and a base rule gives it to `h1` to `h6`, rich text headings
  included. The dashboard and the editor print no palette rule, so `--font-display` is
  unset there and everything stays Geist.
- The read schema is `z.enum(keys).catch("geist")`, so the key `themeCss` prints is one of
  the six from code, never stored text. `test/theme.test.ts` feeds it
  `red;}body{display:none`, a label, `constructor`, an empty string and `true`.
- Only Geist is preloaded; the other five have `preload: false`. Preloading all six would
  make every page download six files. The cost: a chosen font swaps in after the first
  paint, and Geist (29,288 bytes) is still downloaded on a public site that draws none
  of it. `next/font` gives no file URL, so the chosen font cannot be preloaded by hand
  (shortcut ledger).
- All six are variable fonts, loaded in the upright style only, so italic text is the
  upright font slanted by the browser, as it was with Geist alone. Rich text asks for
  weight 800 on a post title; Lora and Space Grotesk stop at 700 and draw it at 700.
- Cost, measured on 2026-10-12 with the same build before and after: the one stylesheet
  went from 98,988 to 111,275 bytes (16,634 to 19,674 gzip) and from 13 to 45
  `@font-face` rules, on every route, the dashboard included. The build holds 38 font
  files where it had 11; a browser downloads only the ones a page draws.
- There is no `font.type.ts`, though the plan listed it: `Theme` infers the font keys
  from the schema and nothing else needs a named type.

### CMS canvas

`/editor/[collection]/[id]` is the page editor, a screen of its own that fills the window
(Criztian's call on 2026-10-11; the plan had a canvas inside the dashboard). The hierarchy
is on the left, the real page in the middle, the fields of the selected section on the
right, and Save draft and Publish at the top right. The layout is Builder's Visual Editor
(https://www.builder.io/c/docs/ui-ve-tour). Its features are not: no dragging, no Insert
panel, no typing on the page, and sections stay in code. It opens every collection: the
singles since `canvas`, and lists such as Blog since `editor-all` (Criztian's call; the
advice was pages only, because a post body gets a narrow column).

Routes and shell:

- It is a route of its own because the dashboard layout draws the sidebar for every page
  under it. `app/editor/layout.tsx` checks the claims and mounts `main` and the toast; the
  providers sit in the root layout. Both layouts share the root one, so moving between
  `/dashboard` and `/editor` is a client navigation and the `onNavigate` guards work.
- The whole editor is inside `main`, the top bar included, and the top bar is a `div`: the
  `h1` and the two action buttons stay where the tests and a screen reader look for them.
- The dashboard sidebar's Editor item links to `/editor`, which redirects to the first
  single, `/editor/<slug>`. That is how the owner gets here (Criztian's call on
  2026-10-12: one sidebar item, a different page).
- `app/editor/[collection]/page.tsx` answers `/editor/<slug>` with a redirect and draws
  nothing: a single goes to `/editor/<slug>/<id>` or `/editor/<slug>/new`, a list
  collection goes to its list at `/dashboard/<slug>`, and an unknown slug answers 404.
  So every row of the hierarchy has one link shape, and a click on a page stays in the
  editor. Until 2026-10-12 the rows linked to `/dashboard/<slug>`, which sent the owner
  through a dashboard address to get from one page to the next.
- `/dashboard/<slug>` is the list of a list collection and forwards a single to
  `/editor/<slug>`. The list's New, Edit and title links point at `/editor/<slug>/new`
  and `/editor/<slug>/<id>`.
- `"/editor"` is a protected prefix; the theme is forced dark there like everywhere.
- `CmsEntryForm` keeps the form, the two saves, the leave warning and the publish check.
  `canvas` is a boolean: whether the collection has a page view. `cms-entry-canvas.tsx` is
  the shell and
  takes the heading, the chip, the buttons and the fields as slots. It has no
  `"use client"` line, like `cms-entry-field.tsx`.
- A collection without a view still opens: the stage says so and has no width group.

Hierarchy and fields:

- The hierarchy is a `nav` named Pages. It lists the pages: one row per single
  collection, plus the open collection when that is a list (a post shows Blog above Home
  page and Theme). Under the open one sits a button per card (Criztian's call: two
  levels, no field level). The rows link to `/editor/<slug>` behind the leave warning.
  The open row is found by comparing slugs, because `useSelectedLayoutSegment` answers
  null inside a page. A list that is not open has no row: its place is the dashboard
  sidebar.
- The back link is named "Back to <label>", "Back to Dashboard" for a single, so it never
  shares a name with a row.
- The selected section has `aria-current="true"` and the open row `aria-current="page"`.
  Unselected sections are `muted-foreground`, so the selected one is told apart by more
  than its background, which is 1.04:1 on the sidebar color (see "CMS shell").
- Every card stays mounted and the unselected ones carry `hidden`. react-hook-form keeps
  the ref of a field that unmounted and would focus a node that is gone (`_focusError`
  walks `_names.mount`), a remount would drop a rich text field's undo history, and Tiptap
  creates its editor in an effect, so a field that just mounted cannot take the focus.
  Tailwind's preflight gives `[hidden]` `display: none !important`, so it wins over
  `flex`.
- A failed field in a hidden section: `onInvalid` finds the first failed field in render
  order (cards, then fields) and selects its section with `flushSync`. react-hook-form
  focuses the field right after, because it calls `_focusError` after `onInvalid`.
  `flushSync` is legal there: the resolver is awaited first, so it runs outside render.
  The same holds for the message listener and a mutation's `onError`.
- Cards draw flat in the panel, with no border and no padding of their own.
- The hierarchy is 224px wide and the panel 416px, both fixed (shortcut ledger).

The frame:

- The page is drawn in an iframe, not in the editor's own document. `themeCss` prints a
  `:root:root` rule that would repaint the editor, and the page's breakpoints must answer
  to the frame's width, not the window's.
- The frame is `/preview/[collection]/canvas`: already behind the `/preview` guard, forced
  dark, and the static segment wins over `[id]`. The page checks the claims and answers
  404 without a view. It reads no draft. The values arrive in messages, and the server
  only adds `site`, the live values of every single collection (`listSingleValues`), so
  the home view draws the published palette and the theme view the published text.
- `config/cms-canvas.config.tsx` is the registry, a `Map` from a slug to
  `(values, site) => ReactNode`. A view returns the whole page, `SiteShell` included. Only
  the frame imports it in the browser; the editor page reads `.has(slug)` on the server.
  It is the one view registry: the by-URL preview route draws from it too (see "CMS on
  the site").
- A view returns `null` when it cannot draw the values. For a post that takes a stored
  date that is not a date. The stage then says "This cannot be previewed yet. Save draft
  to see what needs fixing.", and Save draft names the field.
- Every frame loads every view, so since `editor-all` the Home page and Theme frames load
  react-markdown too. Measured on 2026-10-12 from the build's client manifest: the frame
  page's scripts went from 447 to 757 kB, 145 to 240 kB gzip, in 9 chunks. The editor
  page's own chunks hold no react-markdown; their one Markdown parser is marked, which
  Tiptap brings.
- Messages are one zod union, `cmsCanvasMessageSchema`: `ready`, `select` and `blank`
  from the frame, `values` and `card` from the editor. Both sides check `event.origin`, then
  `event.source`, then parse, and post with their own origin as the target.
- The editor counts the `ready` messages and posts the values and the section again on
  each one. A boolean would miss a frame that loaded a second time.
- Values are posted on every change, so a color drag redraws live. A collection with a
  `richtext` field waits 250 ms after the last change instead: react-markdown is one
  synchronous render, and a same-origin frame shares the editor's main thread, so a parse
  per key would be felt while typing. The first post after each `ready` does not wait, or
  a frame that just loaded would stay blank for a quarter second. A ref holds the last
  `ready` that was served; it is read and written inside the effect only.
- `PostBody` is wrapped in `memo`, so a key in Title, Slug or the date does not parse the
  body again. Measured on 2026-10-12, message to painted frame. Without `memo`: 44 to 66
  ms per redraw with 89,648 characters of plain paragraphs, and 153 to 196 ms with 55,208
  characters of headings, lists, tables and code, a long task each time and for any
  field. With `memo`: 2 to 5 ms for a key in Title on both. A key in Body still costs 34
  to 62 ms on the plain post and 145 to 188 ms on the rich one, once per typing pause
  (shortcut ledger). An earlier reading of "30 to 42 ms, no long task" came from the plain
  post alone.
- The frame blocks `mousedown`, `click` and `submit` with capture listeners on `window`
  that call `preventDefault()` and `stopPropagation()`. Next hydrates the whole document,
  so React's own listeners sit on `document`, one step below `window`: the event never
  reaches them, in either phase. `preventDefault` alone would still open the mobile menu
  and run the contact form's own submit handler. With `mousedown` blocked the focus stays
  in the editor. `auxclick` is blocked the same way: on 2026-10-12 a middle click on a
  link in the frame opened the public page in a new tab.
- The iframe has a `title`, `aria-hidden` and `tabIndex={-1}`, and takes no pointer events
  until the first `ready`. `document.activeElement` is never the iframe: measured in
  Chromium on 2026-10-11 and in Playwright's Firefox on 2026-10-12, where the scrolling
  fields panel is one more Tab stop, as Firefox does for any scroll box. WebKit could not
  be run on this machine: Windows Smart App Control blocks a DLL of Playwright's build.
- The stage around the iframe is a focusable group named "Page preview". The arrow keys,
  Page Up and Page Down scroll the page in the frame through `contentWindow.scrollBy`, and
  Home and End through `contentWindow.scrollTo`, because nothing inside the frame can take the focus. Without
  it a keyboard user saw only the first screen of a long post. A hidden sentence says the
  preview is visual only. Tab now goes from the last hierarchy row to the stage, then to
  the first field.
- A click in the frame posts the nearest `data-cms-card` and `data-cms-field`. A known
  field decides the section and then gets the focus (`form.setFocus`). Without a field,
  the card name must be one of the collection's. A click that selects another section
  hides the field that had the focus, so the focus falls to `body`.
- The active section gets an outline in `--info` from a style tag. The card name goes
  through `CSS.escape` and is printed only when it is one of the collection's cards. The
  collection's own sections also get a pointer and a dashed outline under the mouse. Other
  sections get neither: in the Theme editor the page's Hero and Contact are not Theme's
  cards, and a click on them selects nothing.
- The frame scrolls to a section that the hierarchy chose, not to one its own click chose.
  It scrolls in an effect, after the page is drawn: on the first `ready` the section
  message arrives before React has rendered the values.
- Site code marks a section with `data-cms-card` and a text with `data-cms-field`. The
  attributes ship on the public page too and do nothing there.
- A post has two sections and only one is on the page. `post-view.tsx` marks the `article`
  as Content and as the `body` field, the `h1` as `title` and the `time` as `publishDate`.
  Settings has no element, so selecting it outlines nothing and scrolls nowhere. A click
  on the date still selects it, because a known field decides the section.

The stage:

- The iframe is as wide as the device (1280, 768 or 390) and scaled with a transform:
  `min(1, stage width / device width)`, measured by a `ResizeObserver`. Its height is the
  stage height divided by the scale, so the scaled page fills the stage.
- Measured on 2026-10-12 with the 416px panel: Desktop is 0.600 at a 1440 window, 0.475
  at 1280, 0.674 at 1535 and 0.275 at 1024; Tablet is exactly full size at 1440 (768px of
  stage) and Phone too. There is no sideways scroll and one `h1` at all four widths, and
  axe-core 4.10.2 finds no violation in the dark theme. Every Tab stop has a focus ring,
  and the wheel scrolls the page inside the frame (both measured on 2026-10-11).
- "Loading preview..." shows until the first `ready`, and a failed line after 10
  seconds. When the view returns `null` the frame posts `blank` and the stage says "This
  cannot be previewed yet. Save draft to see what needs fixing." as a `status`. All three
  lines sit on their own `bg-background` surface: they are drawn over the frame, which is
  always light, and in the dark theme the bare text measured 2.59 and 2.89 to 1. The
  sentence was first drawn inside the frame, where it was 7px high at a 1280 window and
  hidden from screen readers.
- A collection with no view shows "This collection has no page view yet." in the text
  color; in `muted-foreground` on `bg-muted` it measured 4.34 to 1.
- The form is at least 1024px wide, the width the CMS must not break at, and `main`
  scrolls sideways under that. Without the floor the stage reached 0px at a 640px window:
  the iframe never mounted, so the failed line showed for a page that was never asked
  for, and under 608px the buttons were cut off with no way to scroll to them.
- The width group is three `Toggle`s in a group named "Preview width". The pressed one
  inverts its colors, like the rich text toolbar.
- The fields panel is 416px (`26rem`) and scrolls, and on Windows its scrollbar takes
  15px, so a field is 368px wide. The rich text toolbar is two rows there, with the cursor
  in a paragraph (13 buttons) and in a table (18). At 384px a field was 336px and the
  table buttons made a third row; a 1px sweep on 2026-10-12 put the change at 397px. The
  plan said "three rows, use 416px". Claude first read that as a 416px field in a 448px
  panel and advised against it, so the panel stayed at 384px until the measurement the
  same day showed that the plan's own number was enough.
- A table wider than the field scrolls sideways inside it
  (`[&_.tableWrapper]:overflow-x-auto` on the editor's content). The wrapper clips, so
  without it a five-column table hid its last columns and they could not be reached.
- The first save of a new entry moves to the entry's URL, the page remounts (`key={id}`)
  and the frame loads again. It happens once per entry (shortcut ledger).

### Rich text editor

The `richtext` field is `MarkdownEditor`: headless Tiptap 3.31.4 with `@tiptap/markdown`
(marked underneath; Tiptap calls it an early release) and `TableKit`, listed once in
`lib/tiptap.ts` for the editor and the tests. The
toolbar is Base UI `Toolbar` with shadcn `Toggle`, `Button` and `Popover`, so it adds no
Radix. Overrides, each with its removal trigger:

- `OrderedList` gets a Markdown tokenizer that never matches. The stock one turns
  `Hi. there` into `1. there` and `Ok. then` into `1. then` (issue #8395), so marked's own
  list parser runs instead. Remove it when #8395 closes and `test/markdown.test.ts` passes
  without it.
- Table cells and headers hold `paragraph+`: the serializer flattens a cell to one line, so a
  list or heading in a cell would be lost. "Insert table" is disabled inside a table, because
  Tiptap's `insertTable` always reports that it can run and splits the table there.
- `Paragraph` escapes a `-`, `+`, `#` or `=` and a `1.` or `1)` at the start of each line it
  writes. `@tiptap/markdown` escapes only inline characters, so a paragraph that reads
  `- not a list` or `1. not a list` (an input rule undone with Backspace, pasted text, or
  an escape written in Studio) came back as a list or heading after one save. Remove the
  override when Tiptap escapes block starts itself and the "keeps typed block markers as
  text" test passes without it.
- `underline: false`: Tiptap writes underline as `++text++`, which is not standard Markdown
  (#8215).
- `link: { openOnClick: false }`, and the link popover accepts only http, https and mailto
  (`cmsLinkSchema`), because react-markdown blanks other schemes.

The editor is uncontrolled: `defaultValue` is read once, the editor page must key its form by
id, and nothing calls `setContent` in an effect. `immediatelyRender: false` avoids the SSR
mismatch. `useEditor` compares options on every render and calls `setOptions` on a change,
so `editorProps` is memoized and changes only with `aria-invalid`. `onUpdate` ignores
transactions that do not change the document: focus alone dispatches one, and the
TrailingNode extension then appends a paragraph, which used to re-serialize an untouched body.
An editor that Tiptap calls empty sends `""`, not its Markdown: an empty list, quote, code
block or table serializes to `- `, `>`, a fence or pipes, which passed the required check
and would have published an empty block (seen in a headless run on 2026-10-11).
The editor exposes `focus()` through its `ref`, so react-hook-form moves focus to it when the
body fails validation. marked is a global singleton: build one `MarkdownManager` per process
(see the test file).

Toolbar details that look arbitrary but are not: Base UI keeps disabled toolbar items
focusable and marks them with `aria-disabled` instead of `disabled`, so the toolbar dims them
itself; pressed toggles invert their colours, because `bg-muted` is under the 3:1 contrast a
state needs; the toolbar is sticky, so the wrapper uses `overflow-clip` (a scroll container
would break sticky). The editor alone draws table cell borders and highlights selected cells,
otherwise columns and cell selections are invisible; public tables keep the typography style.
`globals.css` recolours Tiptap's gap cursor, which is a black line on the dark theme by
default and lives in unlayered CSS that Tailwind utilities cannot override.

Known losses at 3.31.4: a code block that itself contains ``` breaks on reload (#8341; the
fix is a CodeBlock extension of about 12 lines); lists that start at 0 renumber; pasted
`a.` and `b.` lines become a lettered list; issues #8445, #8446 and #8404 are open; a
Markdown image written in Studio becomes its alt text the next time the body is edited in the
app, because there is no Image extension.

## Abuse protection

Today: zod at the tRPC boundary, the honeypot field `website` (must stay empty; bots that
fill it get "Invalid input"), and CHECK constraints in the table that mirror the schema.
Not covered: the anon INSERT grant lets anyone with the public key write rows straight to
PostgREST, bounded by the CHECK constraints; no email is sent on that path. CMS entries accept
writes from signed-in users only, so only an editor can trigger the site-wide purge.

Add when spam or Resend 429s show up: a Postgres per-IP rate limit (a `private.rate_limits`
table plus a SECURITY DEFINER function called through a secret-key client, a
`rateLimitedProcedure` throwing TOO_MANY_REQUESTS), Cloudflare Turnstile, or inserts
through a secret-key client with the anon grant revoked.

The row is stored before the email is sent so a Resend failure keeps the lead. A retry
after EMAIL_SEND_FAILED therefore creates a duplicate row; accepted.

## Shortcut ledger

Each shortcut is deliberate and names its upgrade trigger.

- The booking popup calls the calendar failed when Cal.com sends no `navigatedToBooker`
  message within 15 s (`BOOKING.timeoutMs`). A slow network past 15 s sees the error and the
  email link even though Cal.com might still load. Raise the limit if real visitors hit it.
- `contact.list` returns at most 100 rows, no pagination. Add keyset pagination past 100.
- Two atoms, the mobile nav and the CMS unsaved flag, each private
  to its hook file. A `store/` folder appears when two hooks share an atom.
- The leave warning is `window.confirm` on the editor's back link and hierarchy rows,
  plus the browser's own prompt on tab close. Browser Back and Forward are not guarded: the App
  Router has no API for it. Add a styled dialog or a history guard when an editor loses work
  that way.
- The page in the frame is hidden from screen readers (`aria-hidden`); only the stage
  around it has a name and a hint. Expose the drawn page when a screen reader user asks
  for it.
- Not tested with a real screen reader, and not in WebKit. The proof is Chromium's
  accessibility tree, axe-core in light and dark, and the same twelve checks in Firefox.
- The publish check lists the changes read when Publish was pressed. A draft saved in
  another tab between that click and the confirm is published unseen. Read the list again
  on confirm once two people edit the same entry.
- Rich text in the publish check is one changed block of Markdown source: two edits far
  apart show everything between them, and a table reads as pipes. Add a real diff (the `diff`
  package, or a longest-common-subsequence pass over the paragraphs) and a rendered view
  when editors find the list hard to read.
- Save draft checks every rule, so a half-filled entry cannot be saved. Split the schema into
  draft rules and publish rules when editors want to park unfinished work; the page views
  must then survive missing fields.
- Text typed while a save is in flight is dropped when the form resets: a field snaps back,
  and the body keeps the text but does not count it until the next keystroke. Make the
  fields read-only during the request when saves get slow.
- A single's entry cannot be deleted or reset in the app, because it has no list; the
  end-to-end test deletes it through the router. Add a Reset to defaults action when a
  client asks.
- `single` is written when the row is created. A row made by the seed or in Studio without
  it, and the rows of a list collection that becomes a single later, are outside the
  unique index. Set the flag in a migration when that happens.
- Contrast is checked for text on the background and on muted only. Fill text is black or
  white by rule, and nothing compares primary with the background, so a white button on a
  white page can be saved. Add a `contrast` key to `primary` when an owner does that.
- Accent and muted have no surface of their own in the template's sections. A client's
  sections give them one.
- Every listed font's `@font-face` rules ship on every route: 12,287 bytes of CSS, 3,040
  gzip, for the five fonts beside Geist. Delete a font from `font.data.ts` and
  `font.config.ts` when a site will never offer it.
- Only Geist is preloaded. A chosen font swaps in after the first paint, and Geist's
  29,288 bytes are downloaded on a public site that draws another font. Serve the font
  files from `public/` with hand-written `@font-face` rules and print the preload link
  from `SiteShell` when the swap shows.
- Italics are synthesized for every font, and a post title's weight 800 is drawn at 700
  in Lora and Space Grotesk. Add `style: ["normal", "italic"]` to a font, or pick fonts
  with the weight, when a client's text looks wrong; italics double that font's rules.
- A font's key is typed in `font.data.ts` and again as the variable in `font.config.ts`.
  `public.spec.ts` fails when they differ.
- The font dropdowns are native, so an option is not drawn in its own font; the frame
  shows the pick at once. Use the Base UI `select` when owners want to see the list.
- A list column on a `select` field shows the stored value, not the label. Look the label
  up in `toCmsListCell` with the first collection that lists one.
- The page editor's hierarchy is fixed at 224px and its fields panel at 416px. A field is
  368px wide beside the panel's scrollbar. Add panels that collapse or resize when the
  page or a field feels cramped.
- Desktop is scaled in the page editor: 0.600 at a 1440 window, 0.475 at 1280, 0.674 at
  1535 and 0.275 at 1024. Collapsing panels are the way to a bigger page.
- Every section's fields stay mounted in the page editor and the unselected ones are
  hidden. Mount only the selected section when an editor with many sections opens slowly.
- The first save of an entry in the page editor loads the frame again, resets the
  selected section and the width, and drops the focus to `body`. Keep the two in an atom,
  or the frame in a layout, when that jump annoys.
- The hierarchy lists the pages (the single collections) and the open collection's
  sections, not entries. Add an entry level when editors want to move between entries
  without the list.
- The dashboard sidebar's Editor item always opens the first single. Remember the last
  page opened when owners have many pages.
- The page editor has no Log out, Messages or View site; its back link reaches them.
  Add a menu when editors ask.
- The frame redraws on every change; a collection with rich text waits 250 ms after the
  last one, so the page trails the typing by a quarter second. A key in the body parses
  the whole body on the main thread once per pause: up to 62 ms at 89,648 plain
  characters and up to 188 ms at 55,208 characters of tables, lists and code. Parse in a
  worker when a long post stutters.
- Sections are picked in the frame by mouse; the keyboard uses the hierarchy buttons and
  scrolls the page from the stage.
- Clicks, middle clicks and submits are blocked in the frame, so a menu or a form cannot
  be tried there.
- The other single collections in the frame are their live version from when it loaded.
- A card name is typed in the config and again in the view's `data-cms-card`.
- Every frame loads every registered view, so the Home page and Theme frames load
  react-markdown too: 757 kB of scripts, 240 kB gzip. Load each view with `next/dynamic`
  when a frame opens slowly.
- A view that throws shows the error page inside the frame; the form keeps what was
  typed, and Try again in the frame draws the page once the value is fixed (run on
  2026-10-12 with a view made to throw). Wrap the view in `catchError` when it happens.
- The old `/dashboard/<slug>/new` and `/dashboard/<slug>/<id>` answer 404 with no
  redirect. Add redirects when a deployed site has bookmarks to them.
- The by-URL preview route draws a single's page with a contact form that really sends,
  because only the frame blocks clicks. Block them there too when a message is sent by
  mistake.
- That `tabIndex={-1}` keeps Tab out of the iframe is checked in Chromium and Firefox, not
  in WebKit.
- The 404 for a URL that matches no route and the error page do
  not carry the brand; only a 404 thrown inside `(marketing)`, such as a missing post,
  does. Add a root `not-found.tsx` that draws `SiteShell` when a client asks.
- No server-side tRPC prefetch (`lib/trpc/server.tsx`, `HydrateClient`). Add when a Server
  Component must render tRPC data without a loading state; use `queryClient.query()`, not
  the deprecated `prefetchQuery`, and never under `(marketing)`.
- No `fieldErrors` payload: the client validates with the same schema. Add
  `data.fieldErrors` plus a `setError` adapter when a form needs server-only validation.
- Plain-text email. Add `react-email` v6 and `render()` for designed emails; esbuild then
  needs an `allowBuilds` entry in `pnpm-workspace.yaml`.
- No superjson. Add it in `initTRPC`, every link and dehydrate/hydrate when Date, Map or
  Set cross the wire; until then use ISO strings and `z.iso.datetime()`.
- No `instrumentation.ts`, themed `not-found.tsx`, `global-error.tsx` or theme toggle. Add
  with an observability provider or the design pass.
- `node:test` for units and Playwright for end-to-end. Add vitest 5 with the first
  component test.
- No CI workflow. Add one that runs `pnpm check` and `pnpm test:e2e` once the repo has a
  remote. It must start the local Supabase stack, create the test user and set `E2E_USER_*`;
  without them the database tests skip and CI stays green. Install browsers with `--with-deps`.
- No secret key or admin client. Add with the first job that must bypass RLS, and grant the
  tables it needs to `service_role` in a migration (see "Supabase grants").
- No signup, password reset or OAuth callback routes. Add with self-service accounts.
- The shadcn parts (`Button`, the inputs, the menu) hide their outline with `outline-none`,
  which leaves no outline in forced-colors mode; only the hand-written focus styles keep one
  (see "CMS shell"). Swap it for `focus-visible:outline-hidden` in `components/ui` when a
  user works with a contrast theme, and keep the edit when an item is added again.
- No webhook route for edits made outside the app; Studio edits show within an hour. Add
  `POST /api/revalidate` when content is edited outside the app regularly: read a
  `REVALIDATE_SECRET` lazily and answer 503 without it, compare SHA-256 digests of the header
  and `Bearer <secret>` with `timingSafeEqual`, call `revalidatePath("/", "layout")`, answer
  204, and create the Database Webhook per environment.
- `cms.list` sends list rows, but `listEntries` still reads both full versions of up to 100
  entries from the database to build them. Select only the title, summary and column fields
  when a list gets slow.
- The dashboard sidebar is fixed at `w-60`, with no collapse and no phone drawer. Add shadcn's
  `sidebar` with the phone layout, and rewrite its `use-mobile` hook with
  `useSyncExternalStore` so it passes lint.
- The date shown is the `publishDate` field, typed by hand. `published_at` is stored and not
  shown. Show it when readers need the real publish time.
- Slugs are typed by hand and a changed slug breaks old links. Derive the slug from the title
  when editors ask; add a redirects table when links get shared.
- No images, sitemap or RSS. Add each on its first request.
- No CodeBlock fence fix for #8341 (see "Rich text editor"). Add it when a post needs a code block
  that contains ```.
- The blog index reads the 100 newest live entries by id and sorts them by `publishDate` in
  the page; `cms.list` stops at 100 rows too. Past 100, order by `published ->> 'publishDate'`
  in the query with an index, add keyset pagination, and TanStack Table once editors need
  sorting or filtering.
- Every publish purges the whole site. Switch to targeted paths or tags when purges get costly.
- The ISR cache and its tags live in one process. Add a `cacheHandler` with the second
  server instance.
- A rebuild within the hour can reuse the previous build's `/blog` rows from
  `.next/cache/fetch-cache`. Clear that folder before the build when it matters.
- Every unknown `/blog/<slug>` caches a 404 on disk. Rate limit `/blog/*` at the CDN or
  proxy when abuse shows up.
- A publish does not purge a CDN in front of `next start` (`s-maxage=3600`). Purge the CDN on
  unpublish when an instant takedown is needed.

## Static-only host eject

For GitHub Pages, S3 or Nginx without Node: set `output: "export"` and
`images.unoptimized`, then delete `src/proxy.ts`, `src/app/api`, `src/app/dashboard`,
`src/app/editor`, `src/app/preview`, `src/app/(marketing)/login`, `src/app/(marketing)/blog`,
`src/lib/supabase`, `src/lib/trpc`, `src/lib/tiptap.ts`, `src/lib/react-markdown.ts`,
`src/router`, `src/repository`, `src/service`, `src/lib/resend.ts`,
`src/config/cms.config.ts`,
`src/config/cms-canvas.config.tsx`, `src/hooks/use-cms-unsaved.ts`, the `cms-*`
components, `post-view.tsx`, `post-body.tsx` and `markdown-editor.tsx`, the Blog and Log in
nav links, `supabase/` and their dependencies (Tiptap, react-markdown, remark-gfm,
rehype-raw, rehype-sanitize, react-day-picker, date-fns, and `@tailwindcss/typography`
with its `@plugin` line in `globals.css`). `ui/calendar.tsx` and
`type/markdown-editor.type.ts` still import two of those packages, so they go with them.
Keep `model/cms.model.ts`, `util/cms.util.ts` and `type/cms.type.ts`: the theme files
import them. The contact form then needs an external endpoint in place of its tRPC
mutation. Delete `.next` first, because a stale `.next/dev/types` still imports the deleted
routes. Then `pnpm typecheck` names what still imports the deleted code: the contact form,
the tRPC provider in `providers.tsx`, the login, logout and message-list components and
`type/trpc.type.ts`, which a static site deletes, and the two route files it keeps, the
marketing layout and the home page. Those two drop their Supabase read, pass the code
defaults and lose `revalidate = 3600`, which an export ignores. Delete
`test/markdown.test.ts` with `lib/tiptap.ts` and `lib/react-markdown.ts`, and the
end-to-end suite: it tests the deleted routes, and `next start` refuses
`output: "export"`. The root layout still needs `config/font.config.ts`; a site with fixed
fonts keeps only the ones it draws there and in `data/font.data.ts`.

The recipe was run once, on 2026-10-12, on commit `75514c4` in a throwaway worktree. After
the deletions `tsc` named eight files, the contact form among them; lint named none,
because it does not check imports. With those eight fixed, the first `next build` wrote 68
files to `out/`, the home page drawn from the code defaults. The build downloads the Google
fonts, so it needs the network. The two `revalidate` lines were still in for that build:
it passed and still listed `/` as revalidated hourly, which is how we know an export
ignores them. The page it wrote held two dead links to `/login`, which is why the Log in
link is on the list. Not done in that run: uninstalling the packages, and a real endpoint
for the contact form. Read in the source and not run: the `@plugin` line, the two files
that import the packages, and that `next start` refuses an export.

## Version pins

- `next` and `eslint-config-next` 16.3.8 exact: a security release whose bundled docs
  match 16.3.6. Move to 16.4 in its own commit; the managed AGENTS.md block changes.
- `typescript` ~5.9: typescript-eslint 8 rejects TypeScript 7. `eslint` ^9: the
  eslint-config-next 16 plugins are not ESLint 10 ready.
- `@trpc/*` exact 11.19.0: exact-version peers. The `next` dist-tag is older; never use it.
- `@tiptap/*` exact 3.31.4 (`@tiptap/extension-paragraph` and `@tiptap/extensions`
  included; the second came with the starter kit and is listed for its `Placeholder`), for
  the same reason: their peers are exact versions. Move all of them together and run
  `pnpm test`, which checks the list, paragraph, table cell and underline overrides in "Rich
  text editor".
- `react-markdown` 10, `remark-gfm` 4, `rehype-raw` 7 and `rehype-sanitize` 6 are ESM only
  and need no Next config.
- `engines.node` is 22.18: `jotai` 3 is ESM only and needs 22.12, and running `.ts` test files
  with plain `node` needs 22.18, the first 22.x release with type stripping on by default.
- `motion` 14 replaced `framer-motion` and pins it internally; never install both.
- pnpm is pinned through `packageManager`; pnpm 11+ fails installs on unreviewed build
  scripts, so keep `allowBuilds` complete.
- `@react-email/components` is deprecated on npm. `new Resend()` throws without a key, so
  the client is created inside `sendEmail`.

## Tooling notes

- `pnpm db:types` runs through pnpm on purpose: PowerShell redirection writes UTF-16. The
  generated file is ignored by ESLint and Prettier; never hand-edit it. Supabase CLI 2.120
  writes no `__InternalSupabase.PostgrestVersion` block for local types.
- `supabase init` was a one-time author step; `config.toml` is committed. Docker is needed
  for `db:start`; without it, link a hosted project (see the README). The local stack uses
  ports 56320 to 56329 so it runs next to projects on the default 543xx ports.
- Add shadcn items with the pinned CLI: `pnpm exec shadcn add <item>`.
- `cn` reads the brand text tokens (`text-button`, `text-heading-h1`, ...) as colors, so
  `cn("text-paper", "text-heading-h1")` drops `text-paper`. Inside `cn` and cva, write the
  type as stock utilities (`text-base leading-none font-semibold` is the Button style); plain
  `className` strings can use the tokens.
- Brand buttons are the shadcn Button: sizes `large` (52), `small` (44), `icon-large` (44) and
  `link`. Their `border-0` lets the fill reach the edge like Figma; focus is a 2 px inset Paper
  ring for every Button, the CMS included. Links styled as buttons use `cn(buttonVariants())`
  on a real `<a>` or `Link`, never `nativeButton={false}`, which adds `role="button"`.
- The react-hooks compiler rules are on: `useForm().watch` fails lint (use `useWatch`), and
  state updates inside effects are errors.

## Portfolio home (Phase 4, 2026-10-29)

- **Contact form removed** (cut list #4, realign item 11): the form, its router, service,
  repository, model, types and util, the dashboard Messages page and Inbox group, Resend
  (`lib/resend.ts`, `config/email.config.ts`, the mock, the env keys, the package) and
  `EMAIL_SEND_FAILED`. Migration `20261029120000_drop_contact_messages.sql` drops the table.
  Older sections of this doc that mention the contact form, Resend, Messages or
  `contact_messages` describe the template and no longer apply. `/dashboard` with no list
  collection now answers 404 instead of redirecting to Messages.
- **Copy source:** docs/website-plan.md wins over the Figma text layers. They differ on the
  desktop hero sub ("for business") and the desktop footer email (`criztiandev@gmail.com`);
  the site uses the plan's text. The contact email is `criztiandev@gmail.com` (decided 2026-10-29).
- **CMS home shape:** cards Hero (`heroHeading` = the h1 promise, `heroText`) and Stakes
  (`stakesHeading`, `stakesText`). Everything else is static in `src/data/home.data.ts`.
- **Hero under the bar:** the header stays `sticky`; the hero pulls itself up with
  `-mt-16 xl:-mt-20` (the bar heights) so blog and login keep their layout. Those pages sit
  in `PageFrame`, the old `max-w-5xl` main frame.
- **`cn` knows the brand font sizes** (`src/lib/utils.ts`, `createCn` from `cn/config`).
  Without it `cn("text-body-small text-paper", "text-smoke")` dropped the size, because
  `text-<token>` reads as a color. `components/ui` imports plain `cn` from `"cn"`, so don't
  pass a brand size and a color through a ui component's `className`.
- **About grid:** `xl:grid-rows-[auto_auto_1fr]` is a deliberate arbitrary value. The photo
  spans three rows; with plain auto rows its extra height spreads over the h2 and body rows.
  `xl:col-span-*` resets the start column, so items also repeat `xl:col-start-2`.
- **Proportions:** desktop Work and About use `grid-cols-3` (list/photo 427 px, Figma 434);
  the screens column is `w-3/5` (Figma 59.6%). Work runs 11 px taller on desktop and 16 px on
  tablet, About 10 px shorter. Accepted over arbitrary widths.
- **Large (2xl, fourth pack):** the Work stage leaves the 3-column grid for fixed sizes from
  the Large frame (`110:607`): shots `w-147` (588), phone fills the rest of `w-246` (984 → 380),
  list `flex-1` with no gap (Figma list 856 ends where the screens start). At 1536 the list is
  472, still wider than the 427 at 1440. About keeps the grid: the photo is 587 × 733 at 1920,
  Figma 588 × 735 (Figma's own 3-column Steps are 586.67 there); an exact 588 would need an
  arbitrary column template for 1.3 px.
- **Display/XL is one clamp token:** `--text-display-xl` = `clamp(10rem, 12.5vw - 2rem, 13rem)`,
  160 up to 1536 and 208 at 1920+. It covers both Figma styles (Display/XL and Display/XL — Large)
  because the floor is the desktop size, so every `md:text-display-xl` stays 160 below 1536.
- **Work on desktop:** the stage only exists with the Work hold (see "Work hold"). Every other
  desktop (reduced motion, no scroll timelines, touch, a window under 720 px tall) gets the
  stacked tablet layout, as the motion thesis says.
- The footer's Privacy link 404s until the Privacy row.

### Hero load (Phase 5)

- CSS keyframes only (`--animate-hero-*` in `globals.css`), so the hero stays a server
  component and ships no JavaScript. The timings are the constants at the top of
  `hero-section.tsx`; change them there. `HERO_TEXT_START_MS` (`config/motion.config.ts`)
  is shared with the header, because the nav waits for the hero text on Home.
- The portrait rises from fully below its clip (`translateY(100%)`, the same move as the
  letters), so frame 1 is all background. A `brightness(0)` start was tried and dropped: pure
  black shows as a silhouette on `--color-black` (#0a0a0a). The load runs on an inner
  `absolute inset-0` div; the outer div holds the position, the centering
  `-translate-x-1/2` (the `translate` property) and the exit sink (see "Hero exit"). LCP stays
  the portrait (1524 ms median).
- The portrait's wrapper lights from `brightness(0.3)` with the name. Brightness, not
  opacity: an opacity fade shows its body as a grey box over the name, and a dim image still
  paints, so LCP stays the image's load time (1492 ms without the light, 1496 ms with it).
  The animation sits on the wrapper and `grayscale` with its hover on the `img`, so they
  never fight over one `filter`. The shade is `pointer-events-none` so the hover reaches the
  photo under it.
- The photo is black and white through CSS, not in the file, because the source keeps its
  color for the hover (Criztian's exception to the brand's black-and-white rule).
- `whitespace-nowrap` on the name: inline-block letters add break points, and before Anton
  loads the wider fallback wrapped Z onto its own line and pushed TIAN down (CLS 0.276 on a
  throttled phone). What is left (0.05) is the letters moving sideways at the font swap.
- Replacing an image under the same file name keeps showing the old one: Next 16 caches
  optimized images for 4 hours by URL (`minimumCacheTTL`). Delete `.next/dev/cache/images`
  in dev, or give the new file a new name.
- Each name letter is a span inside the `aria-hidden` name, so screen readers never hear
  letters. One token runs two animations per letter: the mask rise (left to right) and the
  light-up from 20% opacity (center out, so the light starts behind his head). The inline
  `animationDelay` gives both delays as a comma list. Opacity, not color, keeps it on the
  compositor.
- Letter hover: the hover state sets a 300 ms ease-out, the rest state a 900 ms ease-in-out,
  so a letter dims fast and relights slowly. `hover:` only matches devices with hover, and
  `motion-safe:` keeps it off under reduced motion. The entrance animation owns opacity
  until it ends, so hovering does nothing during the first seconds.
- Nav entrance (`site-header.tsx`, `--animate-nav-drop`): on Home it starts 200 ms after the
  hero text (`usePathname() === "/"`), so the name and portrait lead; on every other page it
  starts at 200 ms, so a page without the hero never waits. Cache Components are off, so
  `usePathname` needs no Suspense boundary. The marketing layout keeps the header across
  client navigation, so it plays once per load.
- No flicker or flash when the lights come on: a 900 ms ease (Criztian's eyes, WCAG 2.3.1).
- `hero-mask` (`clip-path: inset(-0.3em -0.2em -0.05em -0.2em)`) is a deliberate arbitrary
  value: it clips at the bottom only and leaves room for Anton's tops and side bearings.
- The h1 words sit in spans with spaces between them, so its accessible name is unchanged.
- Every animation class is `motion-safe:`, so reduced motion gets the still; without
  JavaScript the CSS still runs and ends visible.
- One screen tall on tablet and desktop (Criztian, 2026-10-29), so the headline and Book a
  call are on the first screen at any height. Before, desktop had a 900 px minimum and tablet
  a fixed 760 px photo area, so at 1440×790 the note sat 70 px below the fold and at
  1024×768 196 px. Tablet: the stage is a flex column (`md:h-svh md:min-h-150`); the photo
  area takes what the text leaves, capped at Figma's 760 (`md:max-h-190`); the name is
  centered in it (`-mt-1.5` puts it at Figma's 280 in a 760 area); the photo runs from
  `top-25` to the bottom with `aspect-2/3`; the fade is `h-4/17` and `aspect-5/2` of the area,
  so it never darkens the name. Desktop: no minimum; `--text-display-giant-desktop` is
  `min(<width clamp>, 117.65svh - 499px)`, the largest name whose bottom clears the right
  column (172 px tall, 40 px from the bottom) by 24 px, given its `-mt-6` offset. It only
  bites below about 790 px tall, so every Figma frame keeps its size. A longer CMS hero
  text makes that column taller and can touch the name on short screens; raise the 499
  then. Under 600 px (a landscape phone in the tablet range) the stage stops at
  `min-h-150` and scrolls. The phone layout is unchanged.
- Known: the CMS editor frame plays the entrance when it loads, and a word typed into the
  headline shows after its entrance delay (up to about 2 s). Turn animations off inside the
  canvas frame if that gets in the way.

### Smooth scroll and nav hide (Phase 5)

- Lenis (`lenis`, 1.3.27 when added), mounted once as `<ReactLenis root>` in
  `app/(marketing)/layout.tsx`, so every public page and the 404 (which wraps that layout)
  glide. Not in `SiteShell`: the CMS canvas draws `SiteShell` too, and its frame keeps native
  scroll for `scrollToCard`.
- The feel is lurais.framer.website's, Criztian's reference (2026-10-29). Its Framer "Smooth
  Scroll" component runs `new Lenis({ duration: intensity / 10 })` at intensity 20: a 2 s
  glide on Lenis's default ease-out-expo. `SMOOTH_SCROLL` in `config/motion.config.ts` is the
  one knob.
- Only the wheel and trackpad glide. Touch keeps the phone's own scroll (`syncTouch` stays
  off: if the motion slows the phone page, the motion goes). Keyboard, scrollbar drag and
  find-in-page stay native, and Lenis moves the real window scroll, so `position: sticky`,
  `IntersectionObserver` and CSS scroll timelines keep working.
- Reduced motion: Lenis honors it by default (`respectReducedMotion`). A link jump is
  immediate (1 frame); a wheel step settles in about 0.1 s (189 of 300 px in the first
  frame), close to the browser's own wheel step. Fully native would mean skipping
  `ReactLenis` under `prefers-reduced-motion`, which needs a client wrapper; add it if a
  visitor asks.
- `anchors: true` glides same-page hash links (`/#work` on `/`). Next's `<Link>` still
  updates the URL and calls `scrollIntoView()` after its render. Lenis has already started
  its glide inside the click, and while it glides it ignores scroll it did not make, so the
  glide wins and nothing flashes. `scroll-mt-16 xl:scroll-mt-20` still decides where it
  stops. A hash link from another page is Next's normal jump. The menu's hash links land on
  their section too, gliding behind the closing Sheet (Work top 64 px at 390 and 1024, with
  and without reduced motion).
- `stopInertiaOnNavigate: true`: a click on a link to another page stops a running glide, so
  the next page starts at its top.
- Overlays carry `data-lenis-prevent`: the booking popup, its backdrop, and the menu Sheet
  (full screen, so its own backdrop is never under the pointer). base-ui locks `<body>` while
  a dialog is open, because `<html>` is not a scroll container here, and Lenis's `autoToggle`
  only watches `<html>`. A script can still scroll a locked page, so without the attribute
  one 600 px wheel step over the open popup moved the page behind it 124 px. Any new
  overlay needs it.
- Nav hide (`hooks/use-nav-hidden.ts`) reads the native `scroll` event, so it works with
  Lenis, under reduced motion and in the CMS frame. Past 80 px (the desktop header height) it
  hides while the page moves down and comes back on any move up; near the top it always
  shows. It slides with `--motion-base` and the ease-out token; under reduced motion it
  switches without sliding. Keyboard focus brings it back (`has-focus-visible`), so a
  keyboard user never tabs into a hidden bar. Not `focus-within`: a mouse click leaves focus
  on the clicked nav link, which kept the bar open after every nav click. Every size, not
  desktop only as first planned (Criztian, 2026-10-29).
- Known: Safari's bounce at the end of a page counts as a move up, so the nav comes back
  there. A wheel glide runs on for up to 2 s after the last wheel step; that is the feel
  Criztian picked.

### Stakes ink (Phase 5)

- CSS scroll-driven animation, no JS, so `StakesSection` stays a server component. The section names a view timeline (`stakes-timeline`, `view-timeline-name: --stakes`); each headline word (`stakes-ink`) and the body (`stakes-rise`) run on it. They reuse the hero's `hero-light-up` (from 20%) and `hero-copy-up` keyframes, which are emitted because the hero's `--animate-*` utilities use them. If the hero stops using them, Stakes shows the lit still.
- Ranges are scroll px after the band's top enters the screen (`cover`), set inline per word from the constants in `stakes-section.tsx` (`animationRange`, like the hero's inline `animationDelay`). Px, not %, so a ramp is the same scroll distance on every screen. The wave always ends at 660 px whatever the heading's word count (the step shrinks), so a longer CMS heading still finishes mid-screen.
- Linear, not the ease-out token: with ease-out, 80% of a word's change happened within 50–55 px of scroll, a pop by Criztian's 100 px rule; linear spreads it over 120–125 px. Lenis's glide is the easing.
- Longhands (`animation-name`, …), not the `animation` shorthand: the shorthand resets `animation-timeline`, so the longhands keep the timeline whatever the declaration order.
- Guards: `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`. Firefox doesn't run scroll-driven animations by default yet ([caniuse](https://caniuse.com/mdn-css_properties_animation-timeline_view), checked 2026-10-29), so it gets the lit still, as does reduced motion.
- An ancestor with `overflow: hidden` or `auto` becomes the timeline's scroller and freezes the reveal; `overflow: clip` is safe. No ancestor has one today.
- The 20% start is below AA contrast on purpose, only along the ramp; every word ends at full black, and reduced motion never dims.
- Known: in the CMS frame the reveal follows the frame's own scroll, so a short frame can show the heading part-lit while editing. Turn it off inside the canvas frame if that gets in the way, like the hero entrance.

### Hero exit (Phase 5)

- Criztian picked concept 1 of 3 ("Layers") on the lab, 2026-10-29. It is dennissnellenberg.com's hero exit, read from his code (docs/website-plan.md, "Reference motion: dennissnellenberg.com"). As the hero scrolls away, the name slides left 0.4 px per px of scroll and the portrait sinks 0.3 px per px, so the name passes behind it. The headline words rise out of their masks in reading order, then the sub, the buttons and the note rise out. Nothing dims: the thesis keeps passed things lit.
- CSS scroll-driven animation, no JS, so `HeroSection` stays a server component. The section names a view timeline (`hero-timeline`, `--hero`); the `hero-exit-*` utilities in `globals.css` run on it.
- Ranges are px from the start of the hero's `exit` range, which is scroll 0 when the hero is one screen tall. So hero px and Stakes px share an origin: the headline is out by 420 px and the copy by 460 px, while the Stakes ink runs 250–660. The word and copy ranges are inline from the constants in `hero-section.tsx`, like Stakes. The name and portrait ranges (0–1000 px) sit in their utilities, next to their distances (−400 px, +300 px), so each ratio lives in one place.
- Every exit move sits on its own wrapper element. The load animations and the letter hover already own `transform`, `translate`, `opacity` and `filter` on their elements, and a scroll animation (fill `both`) on the same element would override them all the time.
- The words rise to `translateY(-140%)`: `hero-mask` leaves 0.3em above each word for Anton's tops, so the word must travel past that for its descenders to clear (crop at scroll 420: all black).
- Linear (Lenis's glide is the easing), longhands only, guarded by `prefers-reduced-motion: no-preference`, `(hover: hover) and (pointer: fine)` and `@supports (animation-timeline: view())`. Touch screens get the load only (thesis touch line); reduced motion and Firefox get the still.
- The 2 other concepts were "Lights out" (concept 1 plus the name and portrait dim while Stakes inks) and "Rewind" (a 1-screen hold that plays the load backwards). See docs/build-plan.md phase 5.
- The Motion library (`motion`) is gone: only `MotionConfig` in `providers.tsx` used it, and no component animated with it.

### Work hold (Phase 5)

- Criztian picked concept 3 of 3 ("Long road") on the lab, 2026-10-29. The lab page was deleted after the pick. The concepts not picked were:
  - "Spotlight": the screens swap in place, with the old set rising out of its frames and the new one rising in.
  - "Grow": lamalama.com's Flip, scrubbed, with each row's screens growing out of that row.
- How it moves:
  - The section holds for 2 screens. The row 1 beat plays while the section scrolls in, so the story is 3 screens, 1 per row.
  - The 3 screen sets ride one column that climbs at a constant rate and never stops. Each set is exactly in its Figma place at 34%, 62% and 90% of the story.
  - Each shot lights from `brightness(0.3)` to 1 as its set nears its place, and dims as it leaves. The order is desktop, phone, detail, 4% of the story apart.
  - The phone column moves at 0.9× (dennissnellenberg.com's layers). Desktop and detail share one speed: a speed difference between two shots stacked in one column closes their 16 px gap (21 px overlap in the lab).
  - "Your place"'s dashed frames draw left to right from 66% of the story, as they come on screen, so the lower stage is never empty.
  - Book a call rises last with lamalama.com's clip reveal: `inset(0 0 80% 0)`, y 80%, scale 0.98 (docs/website-plan.md, "Reference motion: lamalama.com").
- Rows open without animating height (banned move 9; it would also count as layout shift):
  - Each detail is `position: absolute` under its row and opens with a clip-path.
  - The rows below slide by one fixed gap, `--work-detail`, the tallest detail plus its 12 px gap: 152 px, or 124 px at 1536 px and wider, measured at 1280, 1440 and 1920.
  - The rows' list reserves that gap at its bottom.
  - A shorter detail leaves a little extra space under it (56 px for J&T at 1440).
  - If the Work copy changes, re-measure `--work-detail`. If a detail grows past it, it overlaps the next row.
- One timeline, CSS only, no JavaScript. The section names `--work`, the frame inside is `position: sticky`, and every move runs on the story range `cover 0 → cover var(--work-story)` (300svh).
  - The row timings are keyframe percentages of that range (`work-row1-name`, …).
  - Phone and detail shots reuse their set's keyframes with the range shifted by `--work-shot-shift` (4% and 8% of the story).
  - The choreography is authored for exactly 3 rows: a 4th row needs new keyframes, set offsets and a longer story.
- When the hold runs: the `work-hold` variant in `globals.css` requires all of these:
  - 1280 px or wider and 720 px or taller;
  - a mouse or trackpad (`hover: hover` and `pointer: fine`);
  - no reduced motion;
  - `@supports (animation-timeline: view())`.
- Short screens: `work-hold-short`, 720–895 px tall, uses 40 px frame padding, a 96 px WORK heading and 16 px row padding, so the frame fits one screen down to 720. Below 720 the hold turns off and the stacked layout shows.
- Stage geometry. These are deliberate arbitrary values, taken from the Figma pin frames `58:310`–`58:356` and the Large frame `110:607`:
  - the stage is `aspect-ratio: 886 / 742`, sized `min(100cqw, 100cqh × 886/742)` inside a size container;
  - shots are absolutely placed at Figma's percentages;
  - at 1536 px and wider the columns are `minmax(0, 1fr) 61.5rem`, so the stage is 984 × 824, as in Figma Large.
- `overflow-y: clip` on the section in hold mode stops the sets parked below the stage from growing the page's scroll height. `clip` does not make a scroll container, so `sticky` and the timeline keep working.
- Nav: in hold mode `#work` has `scroll-margin-top: 0`, so the nav link lands at the start of the hold, with row 1 lit and its set in place.
- Keyboard:
  - Tabbing to a link in a closed row lights that row and shows its detail (`:focus-within` with `!important`, which beats the animation). Focus never sits on an invisible link.
  - The screens don't follow the keyboard (that would need JavaScript), and an opened detail can overlap the row below until you scroll.
  - Tab leaves Work after Book a call, so the hold never traps focus.
- Hover: each stage shot inside a link lifts to 1.02 with a `linear()` spring. The curve is judgment: a damped spring with ratio 0.8 settling in 400 ms, peak 1.015, standing in for Lurais's spring 0.4 s with bounce 0.2. "Your place"'s frames have no link, so they never lift (DESIGN.md: things that can't be clicked never answer the pointer).
- Touch and every no-hold case with motion:
  - WORK rises letter by letter and the label rises.
  - Each stacked screen rises from below its own clip (`translateY(100%)` → 0, `hero-portrait-rise`) over the first 250 px after the screen is fully on screen. It has no brightness change, because brightening big photos can cost phone frames.
  - Each screen names its own view timeline on a `overflow: clip` wrapper (`--work-rise`); `Shot`'s own `overflow: hidden` would freeze an anonymous `view()`.
- Reduced motion and Firefox get the stacked still, everything lit.
- Known: the CMS canvas frame draws the Home page at desktop width, so the hold also runs inside it, following the frame's own scroll. Turn it off there if it gets in the way, as with the hero entrance.

### How it works stairs (Phase 5)

- Criztian picked concept 2 of 3 ("Stairs") on the lab, 2026-10-30. The lab page was deleted after the pick. Not picked: 1 "Fuse" (the line draws first and lights each step) and 3 "Count" (each number ticks up one digit like an odometer, then lights its step).
- How it moves: the heading words rise from their masks and light (150 px each, 40 px apart, from 180 px). Each step's number, title and body rise from below the step's own clip, from 160, 200 and 240 px down, so the parts close up as they climb and land together; the step lights in the last 150 px of its 300 px rise. Its line draws 60 px before it lands and finishes 90 px after.
- CSS scroll-driven animation, no JS, so `StepsSection` stays a server component. Linear, longhands only, guarded by `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`, like Stakes. It reuses the hero's `hero-mask-rise` and `hero-light-up` keyframes (emitted because the hero's `--animate-*` utilities use them).
- Two timelines, picked by width, so touch gets one move per scene without a separate build:
  - 1280 px and wider, the 3-column row: every step runs on the section's timeline (`--steps`) and starts 120 px after the one before it (300 / 420 / 540 px after the section's top enters). While they climb, the three steps sit at different heights, like stairs.
  - Under 1280, stacked: each `li` names its own timeline (`--step`) and starts at 0, so only the step coming on screen moves.
  - `steps-step` sets `--steps-timeline` and `--steps-from` per width and per `data-step`, and the children read them (`animation-timeline: var(--steps-timeline)`). Checked in Chrome: it resolves to `--steps` at 1440 and `--step` at 390.
- The line is its own element, Smoke, over the `li`'s Graphite border, which stays as the track. A border can't be clipped on its own, and a Graphite line drawing on black (about 1.3:1) can't be seen. So the finished lines are Smoke, not Figma's Graphite. Criztian saw this in the lab and picked it.
- `steps-draw` has an explicit `to { inset(0) }`. With only a `from` keyframe, the base value is `none`, and `inset()` to `none` doesn't interpolate: the line jumped from undrawn to drawn halfway through its range (caught in the lab by reading the computed `clip-path`).
- The parts' drops are spacing tokens (`steps-number`, `steps-title`, `steps-body`: 40, 50, 60). The scroll ranges are px in the utilities, so a ramp is the same scroll distance on every screen.
- The clip is `overflow: clip` on the wrapper inside each `li`, not `hidden`, so it never becomes the timeline's scroller.
- Reduced motion and Firefox get the still: everything lit, lines drawn.

### About echo (Phase 5)

- Criztian picked concept 1 of 3 ("Echo") on the lab, 2026-10-30. The lab page was deleted after the pick. Not picked: 2 "Out from behind" (the photo lifts back up and the heading slides out from behind its edge, the hero exit in reverse) and 3 "Shutter" (the photo opens from a center line, the body and each stat open top-down by clip).
- How it moves: the section replays the hero load with the scroll. "Hi," and "I'm" rise from their masks and light (150 px each, 40 px apart, from 180 px). "Criztian." rises letter by letter like the hero name (30 px apart). The photo rises from below its frame (300–700 px) and lights from brightness 0.3 (450–700). The body rises 24 px. Each red number rises from its mask and lights, and its label rises 80 px later.
- CSS scroll-driven animation, no JS, so `AboutSection` stays a server component. Linear, longhands only, guarded by `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`. It reuses the hero's keyframes (`hero-mask-rise`, `hero-light-up`, `hero-portrait-rise`, `hero-portrait-light`, `hero-copy-up`).
- Three timelines, so every width gets the right timing without a separate build:
  - `--about` (the section): the heading at every width (it is at the top of the section on every layout) and the photo.
  - `--about-body` (a wrapper `div` around the body): the body starts 180 px after its own top enters. On desktop that matches the lab (section 420 px); on the phone, where the body sits under the photo, it moves only when it comes on screen. The timeline is on the wrapper, not on the moving `p`, so the 24 px rise never moves its own timeline.
  - `--about-stat` (each `li`): the number and label run on their own `li`. From 768 px up the stats sit in a row, so `data-stat` 2 and 3 start 120 / 240 px later. On the phone they stack, so each starts at 0 and moves as it comes on screen, about 110 px apart.
- The photo moves only at 1280 px and wider with a mouse or trackpad. Touch screens and narrower windows keep it still, lit, in place (DESIGN.md "Touch": brightening a big photo can cost phone frames). The text moves everywhere, one block at a time.
- The heading's letters are `inline-block` spans, and Chrome then names the heading "Hi, I'm C r i z t i a n .". So the `h2` carries `aria-label` with the heading text and its animated spans are `aria-hidden`; its `textContent` stays the same, so the e2e heading check still reads it. WORK has the same split ("W O R K" in the accessibility tree) and is not fixed yet.
- The photo frame has `overflow: clip` (not `hidden`), so it never becomes a scroll container.
- Reduced motion and Firefox get the still: everything lit and in place.

### Blog write (Phase 5)

- Criztian picked concept 3 of 3 ("Write") on the lab, 2026-10-30. The lab page was deleted after the pick. Not picked: 1 "Ruled" (each row's line draws in Smoke, then the title rises word by word onto it) and 2 "Stack" (each row rises whole from below its own clip and lights).
- How it moves: "Blog" rises letter by letter and lights (150 px each, 40 px apart, from 180 px), the intro rises 24 px (300–500 px). Each title is written letter by letter: every letter rises from its word's mask and lights, 150 px each, 6 px apart, from 120 px after the row's top enters. The date starts when the last letter starts, the summary 60 px later, 200 px each. "All posts" rises from its own clip and lights (120–270 px after its top enters).
- CSS scroll-driven animation, no JS, so `HomeBlogSection` stays a server component. Linear, longhands only, guarded by `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`. It reuses `hero-mask-rise`, `hero-light-up` and `hero-copy-up`.
- Three timelines: `--blog` (the section) for the heading and intro, `--blog-row` (each `li`) for the title, date and summary, and `--blog-link` for "All posts". Rows stack at every width, so each row moves only when it comes on screen, one after another, about 160 px apart on desktop.
- Touch gets the titles word by word, not letter by letter: `blog-letter` runs only with hover and a fine pointer, `blog-word` only without (hover none or a coarse pointer). A title has about 45 letters, so 3 rows put about 135 moving letters on a phone; words cut that to about 26. Not profiled on the phone; it is the light version DESIGN.md "Touch" asks for.
- The Home row is its own component (`HomePostRow`), not `PostRow` with a flag: the split title and the motion would otherwise reach `/blog`, whose motion Criztian directs later. It reuses `PostMeta` and the link classes from `blog-list-view.tsx`.
- The split title: Chrome would name the link "W e l c o m e …", so the link holds an `sr-only` copy of the title and the letters are `aria-hidden`. `group-hover:underline` sits on each letter too, because an underline doesn't reach into `inline-block` children; the spaces between words are the link's own text, so the line runs on unbroken.
- "All posts" rises 150% (its own `blog-link-rise`), not the 110% of `hero-mask-rise`: its clip wrapper has 4 px of padding so the underline isn't cut, and at 110% the top of the 16 px link would show at the first frame.
- The row lift is `scale: 1.01` on the `li` with the Work spring (`linear()`, 400 ms), only with hover, a fine pointer and no reduced motion.
- Reduced motion and Firefox get the still: everything lit and in place.

### Booking popup

- Every "Book a call" stays a real link to `BOOK_CALL.href`. `BookingDialog`, mounted once in
  `SiteShell`, catches plain clicks on any link with that exact href and opens the popup
  instead. Callers need no change, the link works without JavaScript, and Ctrl/Cmd or
  middle click still opens Cal.com in a tab. The phone menu's link also closes the menu.
- Cal.com is a plain iframe of `?embed=true&theme=dark`, not `@calcom/embed-react`. Cal.com
  sends no frame-blocking headers, and the embed page posts `navigatedToBooker` from
  `https://cal.com` when the booker shows (checked 2026-10-29), which ends the loading state.
- Panel size deviates from Figma `45:123` (720 × 560): 720 wide from `md` up, as tall as the
  viewport allows minus 40 px top and bottom, capped at 800 (`inset-y-10 m-auto max-h-200`).
  560 left about 467 px for the calendar. Below `md` it is full screen (`67:309`).
- The popup uses base-ui's `Dialog.Popup` and `Dialog.Title` directly, with the shadcn
  Dialog root, portal, overlay and close. `ui/dialog.tsx` merges classes with the plain `cn`
  package, which reads `text-heading-h2` as a color and drops it, and its content wrapper
  hard-codes a 10% overlay where Figma wants black 80%.

### 404 and Privacy

- Figma has these two pages at Desktop 1440 only (`45:191`, `45:220`). Phone and tablet reuse
  the same tokens: the giant phone / tablet / desktop sizes for "404", H1 then Display L for
  "Privacy".
- `app/not-found.tsx` sits at the root, because only the root one catches unmatched URLs. The
  root one renders inside the root layout alone, so it wraps itself in `MarketingLayout`
  (theme CSS, header, booking popup) instead of copying the theme loader.
- The 404 fills the screen under the sticky header: `min-h-[calc(100svh-4rem)]`, and
  `xl:min-h-[calc(100svh-5rem)]` (header 64 / 80). No spacing token says "viewport minus
  header", so this arbitrary value stays.
- The footer bottom bar (`SiteFooterBar`) is shared by the home footer and Privacy, so the
  third-pack "Blog" link lands on both at once.

### Case study (`/work/[slug]`)

- One template, `CaseStudyView`, filled from `CASE_STUDIES` in `src/data/case-study.data.ts`.
  The route prerenders every slug there; a slug without data (`/work/jnt-express` until its
  copy exists) calls `notFound()` and answers 404. Not `dynamicParams = false`: `next start`
  then logs an `Internal: NoFallbackError` stack for every unknown slug (seen 2026-10-29).
- Screens keep their ratio and crop in the data (`aspectRatio`, `objectPosition`), applied as
  inline styles by the shared `Shot`. Each screen has its own ratio (16:10, 9:4, 4:3, 4:5,
  13:12) and the phone crops start at different heights (`50% 20%` for the one-button home),
  so a class per screen would mean arbitrary values.
- AFTER shows a phone crop below `md` and the desktop screen from `md` up, as two `Shot`s.
  The desktop shots' text is too small to read at 358 px.
- The Next band always shows "All work". Its heading and "Read the case study" render only
  when the study has `next`, which stays unset until the J&T page is live.
- The `link` button size has no padding (the text sits on the gutter line) and grows to 44 px
  tall on coarse pointers (`pointer-coarse:min-h-11`), from design review round 1. Figma's
  Link component still draws the old 4 px inset.
- A Work row link starting with `http` opens in a new tab with the arrow icon; any other
  href is an internal `next/link` with no icon.
- The two AFTER phone crops are 4:5 portrait, as docs/website-plan.md says, not the 358 × 286
  frames in Figma (`101:601`, `101:611`, named "phone 4:5"): Figma stretches the screenshot
  into a landscape frame, so its text is squashed to about two-thirds height. "Starting 20%
  down" is `object-position: 50% 47%` (20% of the scaled 776 px image is 155 px, out of 328
  px of overflow). The phone AFTER is about 320 px taller than Figma because of this.

### Blog (`/blog`, `/blog/[slug]`)

- `BlogListView` and `PostView` draw the pages; the routes only load posts. `listVisiblePosts`
  (`src/service/post.service.ts`) is the one list query, used by the index and by the post
  page to find the next older post (`findNextPost`). Reading time and dates come from
  `src/util/post.util.ts`: words of the plain text at 200 a minute, rounded up, at least 1;
  dates print as "Nov 16, 2026" in UTC so the server's time zone can't shift the day.
- The nav sits in the page flow, so each header's top padding is Figma's minus the nav
  (96 − 64, 120 − 64, 160 − 80), as on Privacy.
- The newest post is the first `li`, drawn big; the rest are rows. Each title link stretches
  over its whole `li` with an `::after` box (the focus ring is drawn on that box), so the
  whole post is one link without nesting the summary's own links inside an `<a>`. "Read the
  post" is a styled `aria-hidden` span; links inside a summary sit under the box and don't
  take clicks.
- Rich text styles live in `postBodyComponents` (`src/components/post-body.tsx`), not in
  `markdownOptions`: the text-only helpers and the tests share those options and need no
  classes. The wrapper sets Body/Base, so paragraphs need no component and a quote's
  paragraphs take the quote's Anton size. A Markdown `#` renders as an h2, so a post never
  adds a second h1. `ul` markers are 6 px Paper White squares drawn with `::before`; `ol`
  keeps native numbers (the `start` attribute and nested lists keep working), so a number
  sits about 8 px right of Figma's.
- Tables stay real tables from `md` up (fixed, equal columns). Below `md` every row and cell
  is a block, the header row hides, and each row stacks its cells, as docs/website-plan.md
  says.
- The Next post band always shows "All posts". Its heading and "Read the next post" render
  only when there is an older post, the same rule as the case study's Next band.
- The featured post and the Next band's links are 8 px shorter than Figma: the `link` size
  has no inset since design review round 1 (Case study, above).
- A stale data cache can hide a newly published post from a fresh `pnpm build`: fetch results
  persist in `.next/cache` across builds. Wipe `.next` before a browser check that needs new
  rows (seen 2026-10-29).
