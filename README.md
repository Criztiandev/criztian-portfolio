# Criztian portfolio

Criztian's one-page portfolio: custom websites for small businesses. Built on Criztian's
website template: Next.js 16 + tRPC + TanStack Query + Jotai + shadcn/ui + motion + zod +
Supabase + Resend, with a small CMS for the home text, the theme and the blog. The public
site keeps working when Supabase is down.

Start with [CLAUDE.md](CLAUDE.md) (the design and build rules), [PRODUCT.md](PRODUCT.md) and
[docs/build-plan.md](docs/build-plan.md). Read [docs/architecture.md](docs/architecture.md)
before changing structure, and [docs/cms-plan.md](docs/cms-plan.md) for the CMS.

## Requirements

- Node 24 (22.18 minimum), pnpm 10 (pinned in `package.json`)
- Docker Desktop for the local Supabase stack (or a hosted Supabase project)
- A Resend account for the contact form email

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm db:start
pnpm supabase status
```

Copy `API URL` into `NEXT_PUBLIC_SUPABASE_URL` and the publishable key into
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Do not redirect command
output into `.env.local` from PowerShell: it writes UTF-16.

The local stack uses ports 56320 to 56329 so it can run next to other Supabase projects on
the default 543xx ports and the other local repos (553xx, 4433x). Two clones of the template running at once would collide: give each
clone its own `project_id` and port range in `supabase/config.toml`, and update `.env.example`,
`playwright.config.ts` and this file to match.

```bash
pnpm db:reset
pnpm db:types
```

Create your user in Studio at http://127.0.0.1:56323 (Authentication, Users, auto-confirm).
Public signups are disabled on purpose; see the architecture doc. Every signed-in user is an
editor: they read contact messages and create, edit and publish posts. Put the same
credentials in `.env.local` as `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`; `pnpm test:e2e` runs
its database tests only when they are set. `pnpm db:reset` deletes users too, so create the
user again after a reset.

Set `RESEND_API_KEY`, `EMAIL_FROM` and `EMAIL_TO`. While `EMAIL_FROM` uses the sandbox
sender `onboarding@resend.dev`, `EMAIL_TO` must be the address of your Resend account.

```bash
pnpm dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js |
| `pnpm check` | lint (zero warnings), typecheck, tests |
| `pnpm lint` | ESLint with the house rules |
| `pnpm typecheck` | `next typegen` then `tsc --noEmit` |
| `pnpm test` | `node --test` over `test/**/*.test.ts` |
| `pnpm test:e2e` | Playwright end-to-end tests; builds and serves the app on port 3010 |
| `pnpm format` | Prettier |
| `pnpm db:start` / `db:stop` / `db:reset` | local Supabase stack |
| `pnpm db:types` | regenerate `src/type/database.type.ts` |
| `pnpm exec shadcn add <item>` | add a shadcn component (pinned CLI) |

## Testing

```bash
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm check` is the fast gate: lint, typecheck and unit tests. The browser install runs once
per machine (add `--with-deps` on Linux). `pnpm test:e2e` builds the app and serves it on
port 3010 next to a fake Resend API on 3011 and a fake Supabase API on 3012; all three ports
must be free. Without the E2E credentials the app is built against the fake Supabase API and
the database tests skip; with them it uses the local stack, which must be running. Database
runs leave contact messages behind; delete them in Studio.

## CMS

`pnpm db:reset` loads four sample posts from `supabase/seed.sql`: one draft, one with
unpublished changes and two published. `/blog` shows the live version of every post whose
Show on site switch is on. A draft never reaches the site: Publish copies it to the live
version and refreshes the static pages right away. A signed-in user sees a saved draft at
`/preview/posts/<id>`, drawn like the site with its header and colors.

`/dashboard` has the sidebar, the contact messages under Inbox (a table: who wrote, the
message, when, and a Reply link) and a list per collection: the title, the last update, the
publish state and a row menu with Edit and Delete. The sample collection is called Blog
there; its slug is `posts`. Delete asks first and takes a live post off the site right away.
New post on the list and a click on a title open the editor at `/editor`, which fills the
window: the post is drawn in the middle as you type, the fields are on the right, and
Content and Settings (the publish date and the Show on site switch) are its two sections
on the left. Save draft keeps the changes off the site, and leaving with unsaved changes
asks first. Publish opens a check that lists what changed, the old value
struck through and the new one under it; confirming it puts the saved draft on the site.
Publish saves the draft itself first, on a new post too, so going live is two clicks: Publish, then Publish in the check. Posts changed directly in
Studio show up within an hour. `/blog` and the home page read Supabase at build time, so
`pnpm build` needs the stack running whenever `.env.local` names it.

Editor in the sidebar opens the page editor at `/editor`. It is a page of its own, not a
screen inside the dashboard; Dashboard at its top left goes back. Home page and Theme are
listed there, not in the dashboard sidebar. It is the same editor: the pages and the
sections of the open one on the left, the real page in the
middle, the fields of the selected section on the right, and Save draft and Publish at the
top right. The page redraws as you type; in a collection with rich text, a quarter second
after the last key. In Home page, a click on a section of the page
selects it, and a click on a text puts the cursor in its field; Theme draws the same page
but its sections are not Theme's, so a click there does nothing. Desktop, Tablet and Phone in the top bar
change the width the page is drawn at. Nothing is live until Publish.

Home page edits the home page's text: the hero heading and text, and the contact heading.

Theme edits the public site's five colors: background, text, primary, accent and muted.
Pick a color or type a hex value, Save draft, then Publish. Text that is hard to read on
the background or on muted (under 4.5 to 1) cannot be saved. The public site has this one
look and does not follow the visitor's dark mode; the dashboard and the editor keep their
own light and dark themes.

Fonts, the second section of Theme, sets a heading font and a body font from the two brand
fonts: Anton (the heading default) and Inter (the body default). The page in the
middle redraws on each pick, and the site changes after Publish. To offer another Google
font, add it in two places with the same key: an option in `src/data/font.data.ts` and a
`next/font/google` call with `variable: "--font-<key>"` in `src/config/font.config.ts`.
Each listed font adds about 2.5 kB of CSS to every page, so delete the ones a site will
never offer.

### Make a section editable

Sections stay in code: you write a new section, then let the owner change its text in the
page editor. The example is an About section on the home page with two texts, `aboutHeading`
and `aboutText`.

1. Give each text a default and a read rule. Add the keys to `HOME_DEFAULTS` in
   `src/data/home.data.ts`, then to `homeSchema` in `src/model/home.model.ts`, each ending
   in `.catch(HOME_DEFAULTS.<key>)`. Copy the `heroHeading` line for a text that must not
   be empty and the `heroText` line for one that may be. The site draws the default until
   something else is published. The `Home` type follows the schema.
2. Add the section to the `home` collection in `src/config/cms.config.ts`: a card,
   `{ name: "About" }`, and one field per text. Copy the `heroHeading` field for a text
   that must not be empty (it has `required: true`) and the `heroText` field for one that
   may be. Set `name` to the key from step 1, then `label`, `card: "About"` and
   `default: HOME_DEFAULTS.<key>`. The card is the section's row on the left of the
   editor, in the order of `cards`, and its fields show on the right.
3. Draw the section in `src/components/home-view.tsx` from `home.aboutHeading` and
   `home.aboutText`. The Contact section is the markup to copy. Put
   `data-cms-card="About"` on the section and `data-cms-field="<key>"` on each text. A
   click on them in the editor then selects the section and puts the cursor in the field.

There is no migration, the editor's page view needs no change, and the site does not
change until Publish. Two names are typed twice and nothing checks them: a field's `name`
must be its key in `homeSchema`, and the card name must be spelled the same in the config
and in `data-cms-card`. So try it once in the editor: type in the field, then click the
section on the page. Two end-to-end tests in `test/e2e/cms.spec.ts` list the home fields,
the `values` of the single test and the publish list of the page journey: add the new keys
there. A list inside a section is a fixed number of slots, one field each; a list that
grows is a collection of its own. A section on another page needs that page as a single
collection first: see the next two parts.

### Add a collection

1. Add an object to `cmsCollections` in `src/config/cms.config.ts`: `slug`, `label`,
   `singular`, `icon`, `cards`, `titleField`, the `fields`, and optionally `summaryField`
   and `columns`. Copy the `posts` entry and change it. The field types are `text`,
   `textarea`, `richtext`, `date`, `switch`, `slug`, `color` (a six-digit hex value;
   `contrast: { field, min }` on a color field makes the editor refuse a pair that is too
   close) and `select` (a dropdown; give it `options`, a list of `{ value, label }`).
   Each card is a section in the editor.
2. That is all for the dashboard. The sidebar, the list, the editor and the publish check
   are built from the config, and every collection shares one table, so there is no
   migration.
3. To show the entries on the site, write a zod read schema in `src/model` (its type in
   `src/type`) and a page that calls `listLiveEntries` or `getLiveEntryBySlug` with
   `createPublicSupabase()`, checks each entry with the schema and exports
   `revalidate = 3600`. `src/app/(marketing)/blog` is the example.
4. To see the entry drawn in the editor while you type, follow "Show a collection in the
   page editor" below. Without that the editor still opens, with a note where the page
   would be.

Two rules: a field of type `slug` must be named `slug`, and the collection slug `messages`
is taken by the inbox. Slugs are unique among the live entries of one collection.

A collection with `single: true` has one entry and no list, like the Home page. It has no
row in the dashboard sidebar: it is a page in the page editor, which Editor in the sidebar
opens. `titleField` can be left out, and a field's `default` is what the editor starts
with. The home page reads it in
`src/app/(marketing)/page.tsx` and falls back to `src/data/home.data.ts`, so the site
draws before anything is saved. A seed row for a single collection must set `single` to
true.

### Show a collection in the page editor

1. Register a view for the collection in `src/config/cms-canvas.config.tsx`. It takes the
   values being typed and the live values of every single collection, and returns the
   whole page, `SiteShell` included, or `null` when the values cannot be drawn yet. It
   runs in the browser and on the server (`/preview/<slug>/<id>` draws the saved draft
   with it), so it must not import server-only code and must not be async. The `posts`
   view is the example for a list, `home` for a single.
2. In the page's component, put `data-cms-card="<card name>"` on each section and
   `data-cms-field="<field name>"` on each text, with the names from the config.
   `src/components/home-view.tsx` is the example. A click on them in the editor then
   selects the section and focuses the field.

## Without Docker

Use a hosted project instead of the local stack:

```bash
pnpm supabase login
pnpm supabase link --project-ref <ref>
pnpm supabase db push
pnpm supabase gen types --linked --schema public > src/type/database.type.ts
```

## Hosted project checklist

- Authentication, Sign In / Providers: turn off "Allow new users to sign up".
- Run `pnpm supabase db push` before each deploy that adds a migration.
- The build reads published posts, so the hosted Supabase project must be reachable from the
  build machine (Vercel builds are).
- Resend: verify a sending domain, then change `EMAIL_FROM`.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin (Vercel sets a fallback automatically).
