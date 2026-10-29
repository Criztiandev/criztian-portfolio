# CMS plan

The plan for the CMS in this template. `/cms` in Claude Code builds it one phase at a
time and ticks the checklist at the end. The house rules in docs/architecture.md still
apply to every line of it.

Status on 2026-10-11: built. All eight phases are done (see Built so far and the checklist).
The blog CMS from 2026-10-08 was posts only, and Save on a published post went live at once.
This plan turned it into a generic CMS with drafts and kept the parts that already worked
(see Reuse).

Page editor, planned on 2026-10-11: edit the landing page, the colors and the fonts of a
deployed site. It was revised the same day into a full-screen editor at `/editor`. All
six phases are built; the last one, `page-review`, on 2026-10-12. See Page editor and its
own checklist.

## What it is

- The admin where Criztian, and later each client, edits a site's content: the lists in
  `/dashboard`, and every entry in the editor at `/editor`.
- Generic: collections and their fields come from `src/config/cms.config.ts`. CMS code
  never names a collection.
- Draft → Preview → Publish: Save draft never changes the site. Publish shows what changed,
  then goes live.
- First real use after the template: the Hanapix monthly lessons, as a Lessons collection
  in that site's config.

## v1 features

1. **Collections config.** Each collection has a slug, labels, an icon, cards, fields and
   list columns. The sidebar, the list and the editor are built from it.
2. **Field types:** `text`, `textarea`, `date`, `switch`, `slug` and `richtext`.
   `richtext` reuses `MarkdownEditor` and stores Markdown.
3. **List columns:** the title with the summary under it, Updated, Site (publish state),
   plus extra columns from the config. An extra column is a field, or a function that
   returns a Badge (`{ tone, label }`) for worked-out values such as the Hanapix lesson
   status.
4. **One table for every collection,** with a draft and a live version per entry (see Data
   model).
5. **Security:** signed-in users read and write everything. The public reads live entries
   only and never sees a draft. Signups stay closed.
6. **Shell:** `/dashboard` with the sidebar: the Content group from the config, an Inbox
   group with Messages (the contact messages that are on the dashboard today), View site,
   the signed-in user and Log out. Since 2026-10-12 a Pages group above them holds one
   item, Editor, which opens the page editor.
7. **List:** Edit and Delete in the row menu, and a New button. Delete asks first and says
   it takes the entry off the site right away. Empty, loading and error states.
8. **Editor:** cards and fields from the config, checks from the config, the publish state
   chip, Save draft, Publish, the page drawn beside the fields as it is typed, and a
   warning before leaving with unsaved changes. Saves show the existing toast. Since
   `editor-all` it is the full-screen editor at `/editor` for every collection (Page
   editor); the form under `/dashboard`, its drawer and its preview pane are gone.
9. **Publish check:** every changed field, the old value struck through and the new value
   under it. A first publish lists every field. Publish copies the draft to live and
   refreshes the site. Since 2026-10-12 the Publish button saves what is unsaved first,
   then opens the check, and a new entry has the button from the start.
10. **Preview:** `/preview/[collection]/[id]` shows the draft with the site's own page
    component, inside the site header, under a bar: "Preview: you're seeing unpublished
    changes." with a Back to editor link. Signed-in users only. Since `editor-all` the
    editor's frame shows what is typed, and this route draws the saved draft from the same
    view registry, with the brand. Nothing links to it; it still answers by URL.
11. **The blog runs on it:** the blog is the sample collection (slug `posts`, label Blog). `/blog` and `/blog/[slug]`
    read live posts from the new table.
12. **Tests:** unit tests for the publish state, the changes list and the schema built from
    the config; database tests for the security rules; end-to-end tests for the whole flow.

## Later: only when a client needs it

Image field and uploads (Supabase Storage) · drag to reorder (the Figma
Entry row has a Sortable property ready) · an Unpublish action (today: Show on site off,
then Publish, or Delete) · discard changes and version history · search and pagination
past 100 entries · client roles and invites · phone layout · autosave · scheduled publish ·
sitemap and RSS.

From the page editor: a link field (the first section with a button needs it) · a list
field (add, remove and reorder items inside a section) · typing on the page itself ·
showing, hiding and ordering sections · undo · panels that collapse or resize, so the page
or the post body gets more room · a Reset to defaults action for a single.

`single` collections and the dropdown field left this list on 2026-10-11: the page editor
builds them (phases `single` and `fonts`).

## Cut

- Content staging. Staging is for code; drafts and preview cover content.
- One admin for many sites. Each site has its own.
- Next.js Draft Mode. `draftMode()` fails the build under `dynamic = "error"`
  (docs/architecture.md, Static versus dynamic). A preview route keeps the public pages
  static and needs no secret key.

## Reuse (built 2026-10-08, keep it)

- `src/components/markdown-editor.tsx`, `src/lib/tiptap.ts`,
  `src/type/markdown-editor.type.ts` and `test/markdown.test.ts`: the `richtext` field.
- `src/lib/react-markdown.ts` and `src/components/post-body.tsx`: render `richtext` on
  the site.
- `src/components/ui/toast.tsx`, mounted in `src/app/dashboard/layout.tsx`.
- `src/lib/supabase/public.ts`: the cookie-less client for public pages.
- The save pattern in docs/architecture.md, CMS on the site: write first, then
  `revalidatePath("/", "layout")`, then the toast and `router.refresh()`.
- `test/e2e/postgrest.mock.ts` and the end-to-end setup.

## Replace (in the site phase)

- `supabase/migrations/20261008035350_posts.sql`: never deployed, so delete the file and
  reset; no drop migration.
- `src/model/post.model.ts`, `src/type/post.type.ts`, `src/repository/post.repository.ts`,
  `src/service/post.service.ts`, `src/router/post.router.ts`,
  `src/components/post-form.tsx`, `src/app/dashboard/posts/[id]/page.tsx`, the posts part
  of `src/app/dashboard/page.tsx`, and their tests. Keep the rules of `postSlugSchema` and
  `postLinkSchema`; move them where the slug field and the editor can use them.
- The Blog (CMS) section of docs/architecture.md and its shortcut ledger rows (delete,
  dates, preview) were rewritten as each part was built. It is the CMS section now.

## Decisions (2026-10-10)

| Decision                                                                                                | Why                                                                             | Who                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| Draft → Preview → Publish, no content staging                                                           | A typo never goes live in one click                                             | Criztian                         |
| Generic: all per-site content setup lives in `cms.config.ts`                                            | One CMS for every client site                                                   | Criztian                         |
| Backend first: the data and site phases come before any new screen                                      | Private drafts and preview get proven by tests first                            | Criztian                         |
| The posts-only blog moves onto the generic CMS, keeping its editor and rendering                        | Two systems would drift; nothing is deployed yet, so now is the cheapest time   | Claude's call, Criztian can veto |
| The CMS stays in `/dashboard`; the contact messages move to Inbox → Messages                            | The blog CMS, `afterLoginPath` and the E2E tests already use `/dashboard`       | Claude's call, Criztian can veto |
| One table with `draft` and `published` JSON per entry                                                   | A new collection needs no migration; publish state is two null checks           | Claude's call, Criztian can veto |
| Preview is its own route, not Draft Mode                                                                | See Cut                                                                         | Claude's call, Criztian can veto |
| Delete in the app                                                                                       | Clients can't use Studio, which is the shortcut ledger's own trigger            | Claude's call, Criztian can veto |
| Desktop first: designed at 1440, works from 1280 to 1535, must not break at 1024; no phone layout in v1 | Content is edited at a desk                                                     | Claude's call, Criztian can veto |
| Geist and Tabler icons, the repo's own                                                                  | `src/app/layout.tsx` and `components.json`; the Figma text styles use Geist too | Claude's call, Criztian can veto |
| `single` collections move to Later (2026-10-11)                                                         | No collection in the template uses one; the first real site needs a list        | Criztian                         |
| The date field is shadcn's date picker, not a native date input (2026-10-11)                            | It matches Figma; it adds `react-day-picker` and `date-fns`                     | Criztian                         |
| The list title links to the editor (2026-10-11)                                                         | The editor could not be found: New sat on the list, Edit behind the row menu    | Criztian                         |
| A New row per collection in the sidebar was tried and removed the same day (2026-10-11)                 | It read as a second category under Blog; New stays on the list                  | Criztian                         |
| Preview is a live pane beside the form, not a new tab; nothing links to the preview route (2026-10-11; `editor-all` replaces the pane) | See what is typed without leaving the editor                                    | Criztian                         |
| Settings opens in a drawer from a header button (2026-10-11; `editor-all` replaces the drawer)          | Built on shadcn's `sheet`; shadcn's `drawer` is a swipe sheet a mouse cannot drag | Criztian (the `sheet` item is Claude's call) |
| Messages is a table on shadcn's `table` (2026-10-11)                                                    | An inbox reads better as rows; the entries list stays a native table            | Criztian                         |
| The sample collection's label is Blog, not Posts (2026-10-11)                                           | "Posts" did not say what it is; the slug stays `posts`                          | Criztian                         |
| The editor form is centered, and fields take a `placeholder` from the config (2026-10-11; `editor-all` replaces the centered form) | The form sat at the left edge of a wide screen; empty fields gave no hint       | Criztian                         |
| The post summary is rich text, in a short box (2026-10-11)                                              | Criztian wants formatting in it. Claude advised plain text: three readers needed plain text and now strip or render it | Criztian |
| Page editor: a canvas with a side panel, no dragging and no typing on the page (2026-10-11)             | Not a website builder: sections stay in code, the editor changes what is in them | Criztian |
| Page editor: one brand palette of five colors; the public site stops following dark mode (2026-10-11)   | One look per site; two palettes would double the fields and the contrast checks  | Criztian |
| Page editor: lists are fixed slots coded per section; lists that grow are their own collection (2026-10-11) | A list field breaks the flat values in about nine places                     | Criztian |
| Page editor: images wait for their own phase (2026-10-11)                                               | They need a storage bucket, upload rules and an image field                      | Criztian |
| Page editor: built on this CMS, not on Puck or a hosted CMS (2026-10-11)                                | Puck keeps the section list in the database, so each new coded section needs a data patch on every clone | Claude's call, approved with the plan |
| Page editor: fonts come from a list in code; text under 4.5:1 blocks Save draft (2026-10-11)            | `next/font` loads fonts at build time; an unreadable site is a real failure      | Claude's call, approved with the plan |
| Page editor: a full-screen editor at `/editor`, laid out like Builder's: the hierarchy on the left, the real page in the middle, the fields on the right, Publish at the top right. It replaces the canvas inside the dashboard (2026-10-11) | The page gets the whole window and is seen while editing                         | Criztian |
| Page editor: the hierarchy has two levels, pages and their sections, and no field level (2026-10-11)    | Fields show in the right panel                                                   | Criztian |
| Page editor: everything opens in `/editor`, blog posts too (2026-10-11)                                 | One editor for all content                                                       | Criztian (Claude advised pages only: the post body gets a 352px column) |
| Page editor: the top-right button is Publish for the open entry, the existing publish check, with Save draft beside it (2026-10-11) | No backend change                                                                | Criztian |
| Page editor: panels fixed at 224 and 384px (416px since 2026-10-12, Open risks check 6); every section stays mounted and the unselected ones are hidden; one view registry; a typing pause only for a collection with rich text; singles move first (`canvas`), posts second (`editor-all`) (2026-10-11) | A drag handle waits until a post feels cramped; a failed field in an unmounted section cannot take focus; the by-URL preview draws from the same registry and gets the brand; a color drag must redraw live; the unchanged posts tests prove the shared save, publish and guard logic | Claude's calls, approved with the plan |
| Publish saves the draft itself, then shows the check; a new entry has the Publish button from the start (2026-10-12) | Going live took three clicks: Save draft, Publish, Publish | Criztian (he kept the check, as Claude advised) |
| The dashboard stays, and its sidebar has one item, Editor, that opens the page editor at `/editor`, a different page; Home page and Theme are listed inside the editor, not in the dashboard sidebar (2026-10-12) | His words: "create a sidebar called editor and when I click it navigate, not same page, different page for the editor". Claude had read an earlier sentence as "move the whole admin under `/editor`" and built that; it was thrown away the same day | Criztian. That Blog and Messages stay in the dashboard sidebar is Claude's reading |

## Collections config

Keys per collection: `slug` (the post slug rules; `messages` is reserved), `label`
(for the sidebar and page title), `singular` ("New post", "Publish this post?"),
`icon` (a Tabler icon), `cards` (a name and an optional description; each card is a
section in the editor), `titleField`,
`summaryField`, `fields` and `columns` (extra list columns). The site registers a page
view per collection in `src/config/cms-canvas.config.tsx`, not here. Named types go in
`src/type/cms.type.ts`.

Keys per field: `name`, `type`, `label`, `card`, and optionally `required`, `max`, `helper`,
`placeholder` (the grey hint in an empty field) and `compact` (a short box for a `richtext`
field).

The page editor adds, each with its first reader: `single` on a collection (one entry, no
list) and an optional `titleField`; on a field `default` (the start value, also what the
site draws before any entry exists), `contrast: { field, min }` (this color must reach
`min` to 1 against that field) and `options` (the choices of a `select` field). New field
types: `color` and `select`.

The sample collection, `posts`, labelled Blog:

| Field         | Type     | Card     | Rules                        | Helper text                                            |
| ------------- | -------- | -------- | ---------------------------- | ------------------------------------------------------ |
| `title`       | text     | Content  | required, max 200            |                                                        |
| `slug`        | slug     | Content  | required, unique among posts |                                                        |
| `summary`     | richtext | Content  | required, max 300, compact   | Shows in lists and link previews. Keep it to one line. |
| `body`        | richtext | Content  | required, max 100,000        |                                                        |
| `publishDate` | date     | Settings | required, today on create    | Shown on the post.                                     |
| `visible`     | switch   | Settings | on by default                | Turn it off to hide this post without deleting it.     |

The Settings card description: "When and whether this post shows on the site." Settings is
the second section of a post in the editor (it was a drawer until `editor-all`). A
Hanapix-style badge column would be `{ label: "Status", badge: (entry) => ({ tone: "info",
label: "Now" }) }`.

## Data model

`cms_entries`, one row per entry:

| Column         | Type                                 | Note                                                                 |
| -------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `id`           | bigint identity, primary key         | like the other tables                                                |
| `collection`   | text, not null                       | a collection slug from the config                                    |
| `draft`        | jsonb, null                          | the saved version that isn't live; null means no unpublished changes |
| `published`    | jsonb, null                          | the live version; null means never published                         |
| `published_at` | timestamptz, null                    | the last publish                                                     |
| `created_at`   | timestamptz, not null, default now() |                                                                      |
| `updated_at`   | timestamptz, not null, default now() | the list's Updated column                                            |
| `updated_by`   | uuid, null, references auth.users    | who saved last                                                       |
| `single`       | boolean, not null, default false     | page editor: true for the one row of a single collection; a partial unique index on `(collection) where single` keeps it at one |

- Publish state: `published` null → Draft. Both set → Changes not published. `draft` null
  → Published.
- Save draft writes `draft` only and never revalidates. If the draft equals the live
  version, store null.
- Publish: `published = draft`, `draft = null`, `published_at = now()`, then
  `revalidatePath("/", "layout")`. Delete revalidates too.
- The database checks only that `draft` and `published` are JSON objects, not the fields
  inside them, so the router validates every write with the zod schema built from the
  config. Studio edits are not validated, so a page must survive a bad
  value.
- Slugs: unique per collection among live entries (an index), and checked on save and on
  publish with the `CONFLICT` code that already exists.
- Grants: follow "Supabase grants" in docs/architecture.md (revoke all, then grant).
  `authenticated` selects, inserts, updates and deletes. `anon` reads live rows only and
  never the `draft` column (column grants or a view; choose with
  supabase-postgres-best-practices). Prove both with tests.
- Show on site is an ordinary field. The site's own query decides what it means: the blog
  hides the post, Hanapix would show a locked lesson.

## How the site reads content

- Public pages stay static (`dynamic = "error"` stays). They read live entries through a
  repository with `createPublicSupabase()`, like the blog does today, and keep
  `revalidate = 3600` (docs/architecture.md explains why).
- Preview: `/preview/[collection]/[id]` is dynamic and lives outside `(marketing)`. Add
  `/preview` to `protectedPathPrefixes` and check `getClaims()` in the page too. It reads
  `draft ?? published` with the signed-in user's cookie client under RLS, and renders the
  same component the public page uses (for posts: one post view shared with
  `/blog/[slug]`). The site registers a view per collection in
  `src/config/cms-canvas.config.tsx`, and the editor's frame draws from the same registry.
  A collection without a view answers 404 here and opens in the editor with a note where
  the page would be.

## Figma

File: CMS Template, https://www.figma.com/design/bLXTzlj4RLHjxpOsRB6O4R (Criztiandev's Pro
team). The frames are 1440 wide and proven at 1280 and 1535.

Screens (page Screens · Desktop, 1:2):

| Screen          | Node                   | Route                                                            |
| --------------- | ---------------------- | ---------------------------------------------------------------- |
| Collection list | 4:31                   | `/dashboard/[collection]`                                        |
| Entry editor    | 5:152                  | `/editor/[collection]/new` and `/editor/[collection]/[id]`       |
| Publish check   | 14:425 (dialog 14:457) | a dialog on the editor                                           |

Since `editor-all` the entry editor is the full-screen one, which no frame covers; 5:152
stays the reference for the fields. Editor parts: Content card 5:213, Settings card 5:241, actions 5:197 (Save draft 9:278,
Preview 9:285, Publish 9:292), publish state chip 9:275, info line 5:276. The fields on the
screen are sample content; the config decides the real ones. Slug uses the Text field.
Body uses `MarkdownEditor`, so the code is the reference for its toolbar.

Components (page Components, frame 2:2):

| Component     | Node  | Variants and properties                                                    | In code                                           |
| ------------- | ----- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| Button        | 2:63  | Primary 2:48, Outline 2:53, Ghost 2:58; Label, Show icon, Icon             | `Button`: default, outline, ghost                 |
| Badge         | 2:75  | Success 2:64, Info 2:66, Neutral 2:68, Outline 2:70; Label                 | shadcn badge with success and info variants       |
| Publish state | 9:45  | Published 9:36, Changed 9:39, Draft 9:42                                   | `cms-publish-state.tsx`                           |
| Switch        | 2:80  | On 2:76, Off 2:78                                                          | shadcn switch                                     |
| Field         | 2:101 | Text 2:81, Textarea 2:86, Date 2:91; Label, Value, Helper, Show helper     | `cms-entry-field.tsx`: `Field` with `Input`, `Textarea` or `Calendar` in a `Popover` |
| Nav item      | 2:112 | Default 2:102, Active 2:107; Label, Icon                                   | a link in `cms-sidebar.tsx`                       |
| Sidebar       | 3:12  | Site name, Site initial, User name, User initial; Content and Inbox groups | `cms-sidebar.tsx`                                 |
| Entry row     | 3:43  | Title, Summary, Updated, Sortable (later)                                  | a row of `cms-entry-table.tsx`                    |

Colors: Figma uses the repo's shadcn names and values (background, foreground, muted,
muted-foreground, border, sidebar, primary, primary-foreground). New tokens for
`src/app/globals.css`, each with an `@theme` entry:

| Token            | Light   | Dark    | Used by                           |
| ---------------- | ------- | ------- | --------------------------------- |
| `--success`      | #166534 | #4ADE80 | Badge Success text, Published dot |
| `--success-soft` | #DCFCE7 | #052E16 | Badge Success background          |
| `--info`         | #1D4ED8 | #60A5FA | Badge Info text                   |
| `--info-soft`    | #DBEAFE | #172554 | Badge Info background             |
| `--warning`      | #B45309 | #FBBF24 | Changes not published dot         |

Light is designed. The dark values are a starting point; check AA contrast.

Sizes: Tailwind's scale (Figma space/1 to space/8 are 1 to 8, layout/gutter is 10).
`rounded-md` (8) and `rounded-lg` (10) come from the repo's `--radius`. Controls `h-9`
(small `h-8`), sidebar `w-60`. Figma's editor content is 720 wide; the full-screen
editor does not use that width (hierarchy 14rem, fields panel 26rem).

Type (Geist): page title `text-2xl font-semibold`, card heading `text-base font-semibold`,
body and labels `text-sm` (labels `font-medium`), captions and badges `text-xs` (badges
`font-medium`).

Icons, Figma (Lucide) → code (Tabler): plus → `IconPlus` · ellipsis → `IconDots` ·
chevron-left → `IconChevronLeft` · external-link → `IconExternalLink` · file-text →
`IconFileText` · mail → `IconMail` · calendar → `IconCalendar` · info → `IconInfoCircle`
· eye → `IconEye` · lock → `IconLock` · grip-vertical → `IconGripVertical` (later).

Not in Figma, build from existing parts: sign-in (the existing `/login`), the rich-text
toolbar (the code), empty, loading and error states, the delete confirm and the preview
bar (shadcn defaults with the tokens above).

## Known risks

- Hanapix runs on Cloudflare Workers (OpenNext); this template targets Vercel or a Node
  host. When the CMS goes into Hanapix, re-check revalidation there.
- The database does not check the fields inside the JSON. Every write goes through the router,
  and a page must survive a bad value written in Studio.
- Publish purges the whole site, as saves do today. Fine at this size (shortcut ledger).
- Anon can read a live entry whose Show on site switch is off through the REST API; only the
  page's own query hides it. Fine for posts. A site with paid content (Hanapix lessons) needs
  a rule of its own before launch.

## Page editor

Planned on 2026-10-11 and revised the same day. The owner changes the landing page's
content, the site's colors and its fonts after deploy, in a full-screen editor at
`/editor`: the hierarchy of pages and their sections on the left, the real page in the
middle at desktop, tablet or phone width, the selected section's fields in a panel on the
right, and a top bar with Save draft and Publish at the far right. A click on a section
selects it, and the page redraws while typing. From `editor-all` on, every collection opens
there, blog posts too. It is not a website builder. Sections stay in code; a new section is
coded, then made editable in three steps (README, Make a section editable).

`/cms` builds it in six phases: `single`, `theme`, `canvas`, `editor-all`, `fonts`,
`page-review`. The decisions are in the Decisions table.

### Why it is built here (2026-10-11)

- Puck (`@puckeditor/core` 0.23.0, MIT) can lock a page to props only, but its section list
  lives in the database, so each new coded section needs a data patch on every deployed
  clone. It stores a nested tree and HTML rich text, which the publish check cannot diff,
  and its overrides API is marked experimental
  (https://registry.npmjs.org/@puckeditor/core, https://puckeditor.com/docs/api-reference/permissions).
- Sanity, Storyblok, Builder.io, Makeswift and Plasmic move content out of `cms_entries`.
  Payload is a second CMS. TinaCMS keeps content in Git.
- Payload, TinaCMS and Sanity all build visual editing the same way: an iframe that loads a
  real page, `postMessage` both ways and data attributes for click-to-select. That needs no
  new dependency here.

### Limits the owner accepted

- Fonts are a list in code, not any font: `next/font` needs literal calls at build time.
  Six to start: Geist, Inter, Manrope, Space Grotesk, Lora, Playfair Display. The chosen
  font is not preloaded. Found while building `fonts`: Geist is still preloaded on the
  public site when it is not chosen (29,288 bytes), italics are drawn by slanting the
  upright font, and a post title asks for weight 800 where Lora and Space Grotesk stop
  at 700.
- Desktop is drawn at 1280 and scaled to fit between the two panels: 0.600 at a 1440
  window, 0.475 at 1280, 0.674 at 1535, 0.275 at 1024 (measured on 2026-10-12 with the
  416px panel; the plan's 0.625, 0.50, 0.70 and 0.30 were for 384px). From 1440, Tablet
  and Phone are full size. Panels that collapse are in Later.
- The post body is written in a narrow column: 368px beside the panel's scrollbar. The
  toolbar is two rows, in a table too.
- Text under 4.5 to 1 against the background or the muted color blocks Save draft. Fills
  (primary, accent) get black or white text by contrast, which always reaches 4.58 to 1.
- No template section draws accent, and muted shows only on hover. Both get helper text; a
  client's sections give them a surface.
- The 404 for a URL that matches no route and the error page
  keep the default light look. The by-URL preview route has the palette since `editor-all`. A missing post's 404 renders inside the marketing layout
  and has the palette (found while building the theme phase).

### Data (generic CMS)

- `single: true` on a collection means one entry and no list. `/editor/<slug>` redirects
  a single to `/editor/<slug>/<id>`, or to `/editor/<slug>/new` when there is none; `/new`
  redirects to the row when one exists. `/dashboard/<slug>` forwards a single to
  `/editor/<slug>` (since 2026-10-12; it did the lookup itself before).
- A migration adds `single boolean not null default false` and a partial unique index on
  `(collection) where single`. `insertEntry` writes it from the config. A second insert
  answers 23505, which is CONFLICT; a collection with no slug field shows it as the form's
  root error.
- `titleField` is optional. Without it the editor's `h1` is the collection label.
- `default` on a field: `initialValue` uses it when nothing fitting is stored.
- Two single collections in the template, after `posts`: `home` (cards Hero and Contact)
  and `theme` (cards Colors and Fonts). The order sets the sidebar rows and which single
  `/editor` opens; `/dashboard` skips singles, so the login still lands on
  `/dashboard/posts`.
- Public pages read with the existing `listLiveEntries` and take the first row. The site's
  read schema (`home.model.ts`, `theme.model.ts`) fills every gap with `.catch(default)`,
  so a page draws with no entry, with no Supabase env and after a bad Studio edit. The
  defaults are today's text.

### Theme on the public site

- `themeCss(theme)` in `src/util/theme.util.ts` returns one string: React prints an empty
  style tag when a `style` element has two children. The selector is `:root:root`, which
  beats `:root`, `.dark` and the font class. Every color is hex built from parsed channels,
  never the stored string. The two font values are `var(--font-<key>)`, and the read schema
  lets only a listed key through.
- Tokens, from background B, text T, primary P, accent A and muted M:

  | Token | Value |
  | --- | --- |
  | `--background`, `--card`, `--popover` | B |
  | `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground` | T |
  | `--primary`, `--primary-foreground` | P, then black or white, the one with more contrast |
  | `--accent`, `--accent-foreground` | A, then black or white |
  | `--secondary`, `--muted` | M |
  | `--muted-foreground`, `--ring` | the first mix of T into B (60, 70, 80, 90, 100% T) that reaches 4.5 to 1 on B and on M |
  | `--border`, `--input` | 10% T in B |
  | `--destructive` | `#e7000b` or `#ff6467`, the site's two reds before the palette, mixed toward T in steps of 20% until one reaches 4.5 to 1 on B (the plan first named `#e40014` and `#ff6568`, which the browser never drew) |

  One helper picks the first candidate that is readable on a list of surfaces; both stepped
  rows use it.
- `SiteShell` (`src/components/site-shell.tsx`) draws the style tag, `SiteHeader` and the
  `main` wrapper. The marketing layout turns async, reads the live theme, renders
  `SiteShell` and exports `revalidate = 3600`. Only that layout and the views in
  `cms-canvas.config.tsx` print the style (the frame and the by-URL preview route draw
  those views), so the dashboard keeps its own look.
- `providers.tsx` passes `forcedTheme="light"` outside `/dashboard` and `/editor`, so no
  `dark:` class fires on the site.
- `globals.css` gets one unlayered `.prose` block that maps the 18 `--tw-prose-*` variables
  to tokens (code blocks stay dark: `pre-bg` is the foreground, `pre-code` the background),
  and `:root body { background-color; color }`, so Next's default 404 stops following the
  OS. `prose-neutral dark:prose-invert` leaves `post-view.tsx`, the blog list and
  `markdown-editor.tsx`.
- The `theme` collection: five `color` fields with defaults `#ffffff`, `#0a0a0a`,
  `#171717`, `#171717`, `#f5f5f5`. `background` and `muted` carry
  `contrast: { field: "text", min: 4.5 }`.
- What changes with no palette edit: the border is `#e7e7e7` (was `#e5e5e5`), muted text is
  `#6c6c6c` (was `#737373`), button text is pure white, the focus ring is `#6c6c6c` (was
  `#a1a1a1`), and a code block in the editor's rich text box inverts in dark mode. Found while
  building: rich text gets darker too, body `#404040` to `#0a0a0a`, because the `.prose`
  variables now read the text color (docs/architecture.md, CMS theme, has the full list).

### Editor

Laid out like Builder's Visual Editor (https://www.builder.io/c/docs/ui-ve-tour): the
hierarchy on the left, the site in a frame in the middle, the fields on the right and
Publish at the far right of the top bar. Only the layout is Builder's: no dragging, no
Insert panel, no style tab, no typing on the page.

Layout: one `<form>` that fills `main`, grid columns `14rem minmax(0,1fr) 26rem`, rows
`auto minmax(0,1fr)`.

| Area | Holds |
| --- | --- |
| Top bar | The back link ("Back to Blog" for a list, "Back to Dashboard" for a single), the `h1` (the title field or the collection label), the publish chip, the "Preview width" group (Desktop 1280, Tablet 768, Phone 390), Save draft, Publish |
| Left, `nav` "Pages" | One row per single collection, plus the open collection when it is a list (since 2026-10-12; it was one row per collection): a link to `/editor/<slug>` behind the unsaved guard, with `aria-current="page"` on the open one. Under the open one: a button per card, with `aria-current="true"` on the selected one |
| Center, the stage | The iframe: `src="/preview/<slug>/canvas"`, `title="Page preview"`, `aria-hidden`, `tabIndex={-1}`, in a clipped box that a `ResizeObserver` scales by `min(1, stage width / device width)`. Until the first `ready` it takes no pointer events and "Loading preview..." shows; after about 10 seconds the existing failed line shows. A collection with no view gets a "no page view" line |
| Right, the panel | The form error, every card's fields (the unselected cards are `hidden`) and the line that says nothing is live until Publish |

Routes:

- `src/app/editor/layout.tsx`: the claims redirect,
  `<main className="h-svh overflow-x-auto overflow-y-hidden">` and `<Toaster />`. The editor sits inside `main`, so most test locators scoped to `main` stay
  valid.
- `src/app/editor/page.tsx` redirects to the first single collection, `/editor/<slug>`,
  else to `/dashboard`, so `/editor` never answers 404. The dashboard sidebar's Editor
  item links here (2026-10-12).
- `src/app/editor/[collection]/page.tsx` (2026-10-12) answers `/editor/<slug>` with a
  redirect: a single goes to its entry or to `new`, a list goes to `/dashboard/<slug>`,
  an unknown slug answers 404. Until then `/editor/<slug>` had no page.
- `src/app/editor/[collection]/[id]/page.tsx` is the editor page. `id` is a number or
  `new`.
- `src/app/preview/[collection]/canvas/page.tsx` is the frame document. The static
  `canvas` segment beats `[id]`. It sits under the `/preview` proxy guard, checks
  `getClaims()`, answers 404 without a view and renders the client `CmsCanvasFrame`. Like
  every `/preview` page it is forced light.
- `"/editor"` joins `protectedPathPrefixes` in `src/config/site.config.ts` and the path
  check in `src/components/providers.tsx` that leaves the theme unforced. The editor
  follows dark mode like the dashboard, and the frame stays light.
- `/dashboard` redirects to the first collection that is not a single, else to Messages, so
  "Back to Dashboard" never bounces back into the editor.

The frame and its messages:

- `src/config/cms-canvas.config.tsx` holds `cmsCanvasViews`, a `Map` from a collection slug
  to `(values, site) => ReactNode`. A view returns the whole page, `SiteShell` included.
  `site` holds the live values of every single collection, so the home view draws the
  published theme and the theme view the published home. Only the frame imports the
  registry in the browser; the server page reads `.has(slug)`. In code the frame keeps the
  name canvas.
- `cmsCanvasMessageSchema` in `src/model/cms.model.ts` is a zod union on `type`. Both sides
  check `event.origin`, then `event.source`, then parse with `safeParse`.

  | Message | Sender | When |
  | --- | --- | --- |
  | `ready` | frame | its listener is attached, so also after a reload |
  | `values { values }` | editor | on every `ready` and on each form change; a collection with rich text waits 250 ms after the last change |
  | `card { card }` | editor | on every `ready` and when the selection changes |
  | `select { card, field }`, both nullable | frame | a click inside `[data-cms-card]` or `[data-cms-field]` |
  | `blank { blank }` | frame | on load and whenever the view starts or stops returning `null` |

- The frame blocks `mousedown`, `click` and `submit` with capture-phase listeners on
  `window` that call `preventDefault()` and `stopPropagation()`: focus stays in the
  editor, links do not navigate and the contact form sends nothing. `preventDefault()`
  alone would still run React handlers (the mobile menu, the contact form's submit).
- The frame outlines the active card in `var(--info)`, with a style tag built with
  `CSS.escape` and only for a card name it knows. It scrolls to the card unless its own
  click chose it.
- The editor counts the `ready` messages, so a frame that reloads gets its values again.
- A color drag must redraw live, so values post with no pause, except for a collection
  with a `richtext` field: 250 ms after the last change, built in `editor-all`. The first
  post after each `ready` never waits.

Editor logic, in `src/components/cms-entry-editor.tsx`. `CmsEntryForm` keeps its form, its
mutations, its guard and the publish check. It gains:

- `selected` state, which starts on the first card and goes to the shell as its `card`
  prop, and `openCard(name)`.
- Every card stays mounted and the unselected ones are `hidden`. react-hook-form keeps a
  field's ref after unmount and would focus a detached node on a failed save. Mounted
  cards also keep the body editor's undo history and let a rich text field take focus.
  Tailwind's preflight makes `hidden` win over `flex`.
- `onInvalid` finds the first failed field in render order and selects its card inside
  `flushSync`. react-hook-form then focuses the field itself, so `shouldFocusError` keeps
  its default.
- `select` from the frame: a known field decides the card, then `form.setFocus(field)`.
- A slug conflict selects the slug's card before `setError(..., { shouldFocus: true })`.
- After the first save, `router.replace` goes to `/editor/<slug>/<id>`.
- Cards draw flat in the panel: no border and no inner padding.
- `canvas` is a required boolean since `editor-all`: whether the collection has a page
  view. Until then it was optional, and a collection without it kept the form layout.
- The reverse `deps` on the Controllers, so fixing Text clears the contrast errors, were
  built in the theme phase.

`src/components/cms-entry-canvas.tsx` is the shell. It takes slots, so the form logic stays
in one place. `listSingleValues` goes in `src/service/cms.service.ts` and the two types in
`src/type/cms.type.ts`:

```ts
CmsEntryCanvas({ collection, canvas, control, card, onCard, onSelect, onSubmit,
  heading, chip, actions, error, children })
CmsCanvasFrame({ collection, cards, site })
listSingleValues(db: Db): Promise<CmsSiteValues>
type CmsSiteValues = Partial<Record<string, CmsValues>>
type CmsCanvasView = (values: CmsValues, site: CmsSiteValues) => ReactNode
```

Site code marks a section with `data-cms-card="<card name>"` and a text with
`data-cms-field="<field name>"`:

- `home-view.tsx`: the hero section is `data-cms-card="Hero"`, its `h1` is
  `data-cms-field="heroHeading"` and its `p` is `data-cms-field="heroText"`; the contact
  section is `data-cms-card="Contact"` and its `h2` is `data-cms-field="contactHeading"`.
- `post-view.tsx`: the `article` is `data-cms-card="Content"` and
  `data-cms-field="body"`, the `h1` is `data-cms-field="title"` and the `time` is
  `data-cms-field="publishDate"`.
- Field labels are unambiguous in the config ("Hero heading"), because the publish check
  shows the label only.

### Phases

The gate for each: `pnpm check`; `pnpm test:e2e` with the local stack and `E2E_USER_*`,
with no skipped test; `pnpm build` with and without the Supabase variables. `single` and
`theme` also run the suite once against the mock, because they change what public pages
read.

1. **`single`.** The migration, `pnpm db:types`, the `single` and `default` keys, the two
   redirects, the editor's heading, back link and CONFLICT branch, `insertEntry(..., single)`.
   Site: `src/data/home.data.ts`, `src/model/home.model.ts`, `src/type/home.type.ts`,
   `src/components/home-view.tsx`, the `home` collection, and `/` reading it. Tests go
   through the router: the redirects, a second create answers 409, a direct insert answers
   23505, anon cannot select `single`, a saved draft leaves `/` alone, Publish shows it.
   Every single test first deletes the collection's rows: the suite owns the local `home`
   and `theme` rows.
2. **`theme`.** The `color` type, `cmsColorSchema`, `cmsContrast`, the `contrast` rule and
   `CmsColorControl` (a native picker beside a hex box; valid values write while typing,
   blur and Enter write the typed text, so the form shows the error). Site:
   `src/data/theme.data.ts`, `src/model/theme.model.ts`, `src/type/theme.type.ts`,
   `src/util/theme.util.ts`, `src/components/site-shell.tsx`, the `theme` collection, the
   marketing layout, `providers.tsx`, `globals.css`. Modules that node:test loads import
   each other with relative `.ts` paths. Tests: the tokens as one rule; soft text and the
   error red stay at 4.5 to 1 (`#767676` and `#1d4ed8`); a stored `red;}body{display:none`
   never prints; a dark OS gets no `dark` class and a white `--background`; low contrast
   blocks the save; a saved primary is not on `/` until Publish.
3. **`canvas`.** The editor for single collections; posts keep the form layout. Create:
   `src/app/editor/layout.tsx`, `src/app/editor/page.tsx`,
   `src/app/editor/[collection]/[id]/page.tsx` (in this phase it answers 404 unless the
   collection is a single), `src/app/preview/[collection]/canvas/page.tsx`,
   `src/config/cms-canvas.config.tsx` with the views for `home` and `theme`,
   `src/components/cms-entry-canvas.tsx` and `src/components/cms-canvas-frame.tsx`. Change:
   `cms-entry-editor.tsx` (an optional `canvas` prop, the card state, `openCard` and the
   editor return); `src/app/dashboard/[collection]/page.tsx` (a single redirects to
   `/editor/<slug>/<id>` or `/editor/<slug>/new`);
   `src/app/dashboard/[collection]/[id]/page.tsx` (a single redirects to
   `/dashboard/<slug>`); `src/app/dashboard/page.tsx`, `site.config.ts` and `providers.tsx`
   as in Editor, Routes; `home-view.tsx` (the data attributes); `cms.model.ts`, `cms.type.ts` and
   `cms.service.ts` (the message schema, the types, `listSingleValues`). Delete: nothing.
   Tests that stay unchanged: every posts test in `test/e2e/cms.spec.ts` and all of
   `database.spec.ts`. Tests that change: the single test (its URLs are `/editor/home/...`,
   the back link reads "Back to dashboard" and the Home page row is the current one,
   Contact heading is hidden until its section is clicked); the theme test (its URLs are
   `/editor/theme/...`, `html` is dark on `/editor` and light in the frame, the frame's
   Send button turns the new primary before any save); the anonymous redirect test in
   `public.spec.ts` (it adds `/editor`, `/editor/home/new` and `/preview/home/canvas`). One
   new end-to-end test on `/editor/home/new`, which saves nothing: a click on the hero text
   selects Hero and focuses its field; typing redraws the frame's `h1`; a click on Blog in
   the frame changes no URL; Send message sends no request; Phone gives an `innerWidth` of
   390; focus never lands in the iframe; with Hero selected, a cleared Contact heading
   makes Save draft select Contact and focus the field; the selected section is outlined;
   no sideways scroll at 1280; one `h1`; `/preview/unknown/canvas` and
   `/preview/posts/canvas` answer 404; `/editor` lands on the home editor. Unit tests in
   `test/cms.test.ts`: the message schema takes the four messages and refuses an unknown
   type, a missing key and a number inside `values`. Docs: docs/architecture.md (a new CMS
   canvas section, Testing, Auth flow, CMS shell, CMS singles, CMS theme, the ledger, the
   eject list), README.md, docs/handoff.md and its linked doc.
4. **`editor-all`.** Every collection opens in `/editor`, and the old form goes. Add the
   `posts` view to the registry and the data attributes to `post-view.tsx`. Change: the
   list's New, Edit and title links point at `/editor` (`cms-entry-table.tsx`,
   `src/app/dashboard/[collection]/page.tsx`); the editor page drops its 404 for a list
   collection; the existing 250 ms typing pause applies, only for a collection with a
   `richtext` field; the by-URL preview route draws from the canvas registry, so it gets
   the brand, and its Back to editor link points at `/editor`. Delete:
   `src/app/dashboard/[collection]/[id]/page.tsx`; the form layout, the drawer and the pane
   in `cms-entry-editor.tsx`; `cms-entry-preview.tsx`, `use-cms-preview.ts`,
   `cms-preview.config.tsx` and `ui/sheet.tsx`; the `drawer` key and `previewable`; the
   sidebar and Log out guards, because the form and the sidebar no longer share a screen.
   Tests: the two editor tests, the publish test and the journey test are rewritten (the
   URLs, the Settings section button in place of the drawer,
   `frameLocator('iframe[title="Page preview"]')` in place of the pane, "Back to Blog" in
   place of "Blog"). Docs: docs/architecture.md, CMS editor, is rewritten, and so are the
   parts of this file that still describe the form, the drawer and the pane (v1 features,
   Collections config, How the site reads content, Figma).
5. **`fonts`.** The `select` type with `options` (it falls back to `default`, then to the
   first option). `src/data/font.data.ts`, `src/config/font.config.ts` (one
   `next/font/google` const per font with its own variable and `preload: false`; Geist
   keeps its preload), `src/type/font.type.ts`, a Fonts card with `headingFont` and
   `bodyFont`. `layout.tsx` puts every variable class on `html`. `globals.css`:
   `:root { --font-sans: var(--font-geist) }`, `--font-heading: var(--font-display,
   var(--font-sans))` and a base rule for `h1` to `h6`. The read schema is
   `z.enum(keys).catch("geist")`. Tests: a stored font that is not an option never prints;
   the computed `font-family` of the frame's `h1`.
6. **`page-review`.** One journey test that only clicks, from the editor to the site.
   docs/architecture.md: CMS singles, CMS theme, CMS canvas, Static versus dynamic, Env
   contract, Two kinds of projects, the eject recipe, Testing. README: "Make a section
   editable". The screens at 1440, 1280, 1535 and 1024.

### Shortcut ledger lines the phases add

- The site is `color-scheme: light`, so native controls stay light on a dark palette.
- Contrast is checked for text on the background and on muted only.
- Accent and muted have no surface in the template's sections.
- Desktop is scaled (0.600, 0.475, 0.674, 0.275).
- The panels are fixed at 224 and 416px. A field is 368px wide beside the panel's
  scrollbar. Add a wide state or a drag handle when a post feels cramped.
- Every section stays mounted and the unselected ones are hidden.
- The canvas redraws on every change, with no typing pause, except, from `editor-all`, in a
  collection with rich text.
- Sections are picked on the canvas by mouse; the keyboard uses the hierarchy buttons.
- Clicks and submits are blocked in the canvas, so a menu or a form cannot be tried there.
- The other collections on the canvas are their live version from when the frame loaded.
- The first save of an entry reloads the frame and resets the section and the width.
- The hierarchy lists the pages (the single collections) and the open collection, not
  entries.
- The dashboard's Editor item always opens the first single.
- The editor has no Log out, Messages or View site.
- Every frame loads every registered view.
- A view that throws shows the error page inside the frame until a reload.
- A single's entry cannot be deleted or reset in the app.
- `single` is written when the row is created; a list collection that becomes a single
  needs its rows fixed by hand.
- A card name is typed in the config and again in the view's `data-cms-card`.
- Every listed font's `@font-face` rules ship on every route, and the chosen font is not
  preloaded.
- Geist is preloaded on the public site even when another font is chosen.
- Italics are synthesized for every font.
- A post title asks for weight 800; Lora and Space Grotesk draw it at 700.
- A font's key is typed in `font.data.ts` and again as the variable in `font.config.ts`.
- The dropdown does not draw each font in its own face.
- A list column on a dropdown field shows the stored value, not the label.
- The 404 for an unknown URL and the error page do not carry the brand. The by-URL
  preview route has it since `editor-all`.
- The old `/dashboard/<slug>/new` and `/dashboard/<slug>/<id>` answer 404 with no redirect.
- The by-URL preview route draws a single's page with a contact form that really sends.
- The Home page and Theme frames load react-markdown too.

### Open risks

- `tabIndex={-1}` keeping Tab out of the iframe is checked in Chromium and Firefox, not
  in WebKit.
- Closed on 2026-10-11: the first relative `.ts` runtime imports inside `src` build under
  Turbopack, and the `:root:root` rule wins in a real browser (the dark-system test).
- Every public page reads Supabase at build time, so an unreachable database fails the
  whole build, and `/` and `/login` become ISR at one hour.
- A later `X-Frame-Options: DENY`, `frame-ancestors 'none'` or a strict `style-src` blanks
  the canvas or drops the brand.
- Nothing in Figma covers the editor, so there is no frame to compare against.

Checks during the build, each of which settles a risk:

1. Click in the frame, then read `document.activeElement`. Press Tab from the last section
   button.
2. `flushSync`, then focus, on a field in a section that was hidden.
3. Drag the Primary picker and watch the frame's button redraw.
4. At Phone width the frame's menu button does nothing.
5. Text is readable at 0.50 and 0.30, and the wheel scrolls the frame.
6. `editor-all`: the body editor at 352px shows two toolbar rows; if it shows three, use
      416px. Result on 2026-10-12: at 384px the field is 336px beside the scrollbar and the
   toolbar is three rows inside a table. Claude read "416px" as the field, priced a 448px
   panel and advised to keep 384px; the review then measured that a 416px panel is enough
   (two rows from 397px, Desktop 0.600 at 1440, Tablet still full size). The panel is
   416px.
7. `editor-all`: type in an 87,000 character body with the frame live; if Title stutters,
      add `memo` to `PostBody`. Result on 2026-10-12: with 89,648 plain characters a redraw
   took 44 to 66 ms, and with 55,208 characters of tables, lists and code 153 to 196 ms,
   for a key in any field. `memo` is in: a key in Title now takes 2 to 5 ms. The first
   reading, "30 to 42 ms, no long task", came from the plain post alone.

## Built so far

Data phase, 2026-10-10 (the whys are in docs/architecture.md, CMS data layer):

- Anon gets column grants (`id`, `collection`, `published`), not a view.
- `slug` is a reserved field name: a field of type `slug` must be named `slug`.
- Publish runs in the SQL function `cms_publish_entry`.
- `updated_at` and `updated_by` use column defaults on insert and a trigger on update.
- Pure functions live in `src/util/cms.util.ts`.
- Not built yet, each waits for its first reader: `single` (editor), `columns` (list), field
  defaults such as today and on (editor).

Site phase, 2026-10-10 (the whys are in docs/architecture.md, CMS on the site):

- The blog reads `cms_entries`. `src/model/post.model.ts` is the site's read shape for a post;
  a page checks an entry with it, not with the schema built from the config.
- `src/components/post-view.tsx` is the post view that `/blog/[slug]` and the preview share.
- Preview views are registered in `src/config/cms-preview.config.tsx`, not in
  `cms.config.ts`. The editor phase reads it (`cmsPreviewViews.has(slug)`) to hide the
  Preview button.
- The slug and link rules are `cmsSlugSchema` and `cmsLinkSchema` in `src/model/cms.model.ts`.
- The `posts` table, `post.save`, `PostForm` and the post screens are gone. No screen writes
  posts until the editor phase.
- `test/e2e/postgrest.mock.ts` needed no change: it answers `[]` for any table.
- Not built yet: the Back to editor link in the preview bar (editor, when
  `/dashboard/[collection]/[id]` exists).

Shell phase, 2026-10-10 (the whys are in docs/architecture.md, CMS shell):

- `src/components/cms-sidebar.tsx` is hand-written, not shadcn's `sidebar`.
- `/dashboard` redirects to the first collection. `/dashboard/[collection]` shows its heading
  only; the list phase fills it. `/dashboard/messages` holds the contact messages.
- Every collection lives at `/dashboard/<slug>`. `single` moved to the editor phase: a single
  collection will render its editor at that URL, so the sidebar needs no branch.
- Not in Figma: a Log out row under View site (the button says "Log out", like "Log in" on
  the site), and the user line shows the email.
- The five new tokens are in `globals.css`; the list phase is their first reader.

List phase, 2026-10-11 (the whys are in docs/architecture.md, CMS list):

- `/dashboard/[collection]` is the list: `src/components/cms-entry-table.tsx` on `cms.list`,
  with `src/components/cms-publish-state.tsx` for the Site column.
- `cms.list` returns list rows (title, summary, updated, state, cells), not whole entries.
  `toCmsListRow` in `src/util/cms.util.ts` builds them in the service.
- `columns` exists: `{ label, field }` or `{ label, badge }`, where `badge` is a function of
  the newest values that returns `{ tone, label }` or null. Posts has none, so no screen in
  the template shows one; a unit test and a one-off screenshot are the proof.
- The table is a native `<table>`, not shadcn's `table`. New is a plain link with the button
  classes.
- New and Edit link to the editor pages and answer 404 until the editor phase builds them.
- Delete asks in an alert dialog. Its text says whether the entry is on the site.
- Not in Figma: the row menu, the delete dialog and the empty, loading and error states. The
  state copy does not use the collection's plural label.
- `test/e2e/cms.spec.ts` runs its tests in order, not in parallel.
- For the editor phase: invalidate `cms.list` after create, save and publish.

Editor phase, 2026-10-11 (the whys are in docs/architecture.md, CMS editor):

- `/dashboard/[collection]/new` and `/dashboard/[collection]/[id]` are one route file.
  `src/components/cms-entry-editor.tsx` is the form and `src/components/cms-entry-field.tsx`
  one field. The cards and fields come from the config.
- Save draft creates or saves through `cms.create` and `cms.saveDraft`, shows the toast
  "Draft saved" and invalidates `cms.list`. A new entry then moves to its own URL.
- Start values come from the field type, not from a config key: a switch starts on, a
  required date starts as today (`cmsInitialValues` in `src/util/cms.util.ts`).
- The date field is shadcn's `calendar` in a `Popover`; the switch is shadcn's `switch`, sized
  to Figma by hand. The generated calendar needed one fix so the arrow keys work.
- Preview is a link to the preview route in a new tab, hidden without a preview view and for
  an unsaved entry. The preview bar has its Back to editor link. (Replaced the same day:
  see Editor revision.)
- The leave warning covers tab close, the sidebar links, the back link and Log out
  (`src/hooks/use-cms-unsaved.ts`). Browser Back and Forward are not covered.
- `single` moved again, to Later (Decisions, 2026-10-11).
- Not in Figma: the Slug and Body fields (sample content), the field errors, the calendar,
  the "Loading..." line and the leave question. Figma's Publish button is not on the screen
  yet.
- For the publish phase: add the Publish button next to Preview (primary, Figma 9:292),
  invalidate `cms.list` after publish, and call `router.refresh()` so the chip turns to
  Published. `cmsChanges` already builds the changes list.

Publish phase, 2026-10-11 (the whys are in docs/architecture.md, CMS publish):

- `src/components/cms-publish-check.tsx` is the Publish button and the publish check, the
  existing `AlertDialog` with the Figma look. Nothing changed in the backend.
- The editor page builds the changes list on the server with `cmsChanges` and passes it to the
  editor. A first publish lists every field.
- Rich text lists one changed block: equal paragraphs are dropped from the start and the end.
  It shows as Markdown source.
- Publish is disabled with unsaved edits, while a save or the page refresh runs, and when
  nothing changed. A new entry has no Publish button until its first save.
- A slug that another post took in the meantime shows as "Another post already uses this
  slug" in the dialog.
- Not in Figma: the scrolling list, "Removed" and "Empty", the error line and
  "Publishing...". The overlay is shadcn's light blur, Figma has a dark scrim.
- For the review phase: the full click journey can reuse the selectors of the publish test.
  Ask for the Publish button with `exact: true`, or the name also matches the Publish date
  button.

Review phase, 2026-10-11 (the whys are in docs/architecture.md, CMS):

- One more end-to-end test clicks the whole journey: New post, Save draft, not on `/blog`,
  Preview, the publish check, Publish, on `/blog`. It is the only test that publishes from
  the page the first save opens.
- A throwaway second collection, added to the config and nothing else, worked in the
  sidebar, the list (a field column and a badge column), the editor, the publish check and
  Delete. It was removed again; a unit test keeps the two-collection check of the write
  schema.
- The three screens were compared with Figma 4:31, 5:152 and 14:425 at 1440 and checked at
  1280, 1535 and 1024, plus dark at 1440: no sideways scroll, one h1 per page, a focus ring
  on every Tab stop, and Tab stays inside the publish check.
- What still differs from Figma, all on purpose: controls are 10px round (Figma 8), the
  dialog overlay is shadcn's light blur (Figma a dark scrim), a list row is 65px high
  (Figma 64, where the divider is drawn inside the row), the sidebar has a Log out row and
  shows the email, and the editor has the Slug and Body fields of the real config.
- The slug hint reads "like my-first-entry", so CMS code names no client word.
- docs/architecture.md has one CMS section, and the README has "Add a collection".
- Next: copy the CMS into its first real site (the Hanapix lessons) and re-check
  revalidation on Cloudflare (Known risks).

After the review, 2026-10-11 (the whys are in docs/architecture.md, CMS shell and CMS list):

- The list title links to the editor. A New row under each collection in the sidebar was
  added here and removed the same day (see Editor revision).
- `/dashboard/messages` is a table on shadcn's `table`: From, Message (one line, opens in
  place), Received and a Reply link. New shadcn file: `table`.
- The sample collection's label is Blog. The slug, the URLs and "New post" did not change.
- Figma still shows the sample names Pages, Posts and FAQs.
- The editor form is centered (Figma has it at the left edge), and Title, Slug, Summary and
  Body have placeholders from the config.
- The summary is a `richtext` field in a short box. `/blog` renders its formatting; the
  meta description and the dashboard list show its plain text (`markdownToText`). New
  direct dependency: `@tiptap/extensions`, for the placeholder in the two editors.

Editor revision, 2026-10-11 (the whys are in docs/architecture.md, CMS shell and CMS editor):

- The sidebar has one row per collection again. New stays on the list.
- Preview is a toggle. It opens a pane beside the form that draws what is typed with the
  collection's preview view, about a quarter second after the last key, also for an entry
  that was never saved. `src/components/cms-entry-preview.tsx` is the pane and loads in its
  own chunk on the first press; `src/hooks/use-cms-preview.ts` keeps it open across the
  first save.
- Nothing in the editor links to `/preview/[collection]/[id]` any more. The route and its
  tests are unchanged.
- A card with `drawer: true` opens from a header button in a panel on the right. Settings
  is one. New shadcn file: `sheet`, left as generated. No new dependency.
- Save draft opens a closed drawer when the only failed field is inside it, and on a slug
  conflict when the config puts `slug` on a drawer card. A rich text field in a drawer
  keeps what was typed when the drawer opens again.
- The post preview view checks with `postPreviewSchema` (any text as the slug), so the pane
  draws before the slug is valid.
- Differs from Figma on purpose: Settings is a drawer (Figma 5:241 is a card), the header
  has a Settings button, Preview is a toggle with a pane (Figma 9:285 is a plain button and
  there is no pane frame), and the info line sits under the cards, not inside the last
  one. Figma was not opened for this revision.

Single phase, 2026-10-11 (the whys are in docs/architecture.md, CMS singles):

- Migration `20261011083921_cms_entries_single.sql`: the `single` column and the partial
  unique index. Applied locally with `supabase migration up`, no reset.
- `single` and an optional `titleField` on a collection, `default` on a field.
  `/dashboard/<slug>` and `/dashboard/<slug>/new` redirect for a single.
- In the editor: `CmsEntryTitle` follows the title field, a single has no back link and
  shows its label as the `h1`, and a CONFLICT on a collection with no slug field is the
  form's error.
- The `home` collection (cards Hero and Contact, three fields) sits after `posts`.
  `src/data/home.data.ts` holds the defaults, `src/model/home.model.ts` the read schema,
  `src/components/home-view.tsx` the page. `/` reads the live entry and is ISR at one hour.
- The home defaults are the old text, so `public.spec.ts` changed by one path only.
- No canvas yet: Home page opens in the form layout with two cards and no Preview button.
- For the theme phase: `SiteShell` will wrap `SiteHeader` and `main`; the marketing layout
  reads the `theme` entry the way `/` reads `home`.

Theme phase, 2026-10-11 (the whys are in docs/architecture.md, CMS theme):

- The `color` field type: `cmsColorSchema` (six-digit hex, stored trimmed and in
  lowercase), `cmsColorChannels` and `cmsContrast` in `src/util/cms.util.ts`, and the
  color control in `src/components/cms-entry-field.tsx`, a native picker beside a hex box.
- The `contrast` key: `buildCmsValuesSchema` checks it for the whole entry, in the editor
  and in the router. The error lands on the field that carries the key.
- Moved here from the canvas phase (Criztian, 2026-10-11): `rules.deps` on the
  Controllers, so fixing Text clears the errors on Background and Muted at once.
- The `theme` collection (card Colors, five fields) sits after `home`. `/dashboard/theme`
  is the form layout for now, like Home page.
- `src/util/theme.util.ts` (`themeCss`), `src/components/site-shell.tsx`,
  `src/data/theme.data.ts`, `src/model/theme.model.ts`, `src/type/theme.type.ts`. The
  marketing layout reads the live entry and is ISR at one hour.
- `providers.tsx` forces the light theme outside `/dashboard`. `globals.css` has the
  `:root body` rule and the `.prose` block; `prose-neutral dark:prose-invert` is gone.
- The red is built from `#e7000b` and `#ff6467`, not the plan's two values.
- Not in the plan's list of changes: rich text is the text color now, so the blog's body
  text went from `#404040` to `#0a0a0a`.
- A missing post's 404 has the palette, because it renders inside the marketing layout.
- No Figma frame covers this phase: it is built from the repo's tokens and components.
- For the canvas phase: `SiteShell` takes `{ theme, children }`, and a canvas view returns
  it around the page. The color control writes only valid colors while typing, so the
  frame never gets a half-typed one.

Canvas phase, 2026-10-11 (the whys are in docs/architecture.md, CMS canvas):

- `/editor/[collection]/[id]` is the page editor for the single collections: the
  hierarchy, the real page in a frame, the fields of the selected section, and Save draft
  and Publish at the top right. `/dashboard/home` and `/dashboard/theme` redirect there,
  and `/editor` opens the first single.
- `src/components/cms-entry-canvas.tsx` is the shell. `src/components/cms-canvas-frame.tsx`
  is the page inside the frame, served at `/preview/[collection]/canvas`.
  `src/config/cms-canvas.config.tsx` registers the views for `home` and `theme`.
- `cmsCanvasMessageSchema` in `src/model/cms.model.ts`, `listSingleValues` in
  `src/service/cms.service.ts`, the data attributes in `home-view.tsx`.
- `CmsEntryForm` takes an optional `canvas` prop. Posts pass none and keep the form
  layout; every posts test passed unchanged.
- `/dashboard` opens the first collection that is not a single. `"/editor"` is a protected
  prefix and keeps the dashboard's light and dark themes.
- Differs from the plan: the hierarchy's row class is local to `cms-entry-canvas.tsx`, so
  `cms-sidebar.tsx` did not change; the open row and the selected section need states the
  sidebar's class does not have. The frame's listeners sit on `window`, not `document`:
  Next hydrates the whole document, so React listens on `document` itself.
- Found by the review (five reviewers, a skeptic for each; 14 findings held, all low or
  medium, all fixed): the form has a 1024px floor and `main` scrolls sideways under it;
  the frame scrolls to a section after the page is drawn; only the open collection's own
  sections show a pointer and a hover outline; an unselected row keeps 4.5 to 1 on hover.
- Found while building: a click on a section in the frame hides the field that had the
  focus, so the focus falls to `body`. The frame test first expected it to stay.
- A new entry has no Publish button until its first save, as in the form layout.
- No Figma frame covers this phase: it is built from the repo's tokens and components.
- For `editor-all`: the editor page has a 404 for list collections to drop, and
  `cms-entry-editor.tsx` has its `canvas !== undefined` branches to delete with the form
  layout.

Editor-all phase, 2026-10-12 (the whys are in docs/architecture.md, CMS editor and CMS canvas):

- Every collection opens in `/editor`. The list's New, Edit and title links point there,
  and a post has two sections in the hierarchy: Content and Settings.
- `src/config/cms-canvas.config.tsx` has the `posts` view, and `post-view.tsx` its data
  attributes: a click on the title, the date or the body in the frame focuses that field.
- Deleted: `src/app/dashboard/[collection]/[id]/page.tsx`, the form layout, the drawer and
  the pane in `cms-entry-editor.tsx`, `cms-entry-preview.tsx`, `use-cms-preview.ts`,
  `cms-preview.config.tsx`, `ui/sheet.tsx`, the `drawer` key, `previewable`, and the leave
  guards on the sidebar and on Log out.
- The by-URL preview route draws from the canvas registry: it has the header and the
  brand, and its Back to editor link points at `/editor`. It answers for `home` and
  `theme` too now.
- The typing pause is 250 ms for a collection with a `richtext` field and none otherwise.
  The first post after each `ready` does not wait.
- Not in the plan: a view may return `null`, and the frame then says "This cannot be
  previewed yet. Save draft to see what needs fixing." The old pane said the same. The
  editor page's tab title is "New post" or "Edit post" for a list.
- Differs from the plan: the panel stays 384px although the toolbar reaches three rows
  inside a table (Open risks, check 6), and `PostBody` has no `memo` (check 7). Both were
  reversed by the review the same day (next block).
- The skill named four tests to rewrite. Five more places changed: the list test, the
  site journey, the single test, the frame test's 404 list and the anonymous redirect
  list in `public.spec.ts`.
- The frame page's scripts went from 447 to 757 kB (145 to 240 kB gzip), because every
  frame loads every view and the posts view brings react-markdown.
- `pnpm check` needs `.next/dev/types` deleted once after a route file is removed:
  `next typegen` does not rewrite that folder, and tsconfig includes it.
- No Figma frame covers this phase: it is built from the repo's tokens and components.
- For `fonts`: the Fonts card is a second section under Theme; the frame is where the
  chosen fonts show first.

Review of editor-all and the Publish change, 2026-10-12 (the whys are in
docs/architecture.md, CMS editor, CMS publish and CMS canvas):

- A review workflow read commit `407ade3`: six reviewers, three skeptics for each finding,
  four runtime checks and a gap check, 81 agents. 22 findings stood and 1 was refuted.
- Fixed from it. A table wider than the body field scrolls inside it. A field's popover
  closes when its section is hidden. The stage is a focusable group whose keys scroll the
  page. A failed save shows its error above the scrolling fields. Field errors are named
  in `aria-describedby`. Save draft and Publish keep the focus while they are off. The
  notes on the stage have their own surface, and "This cannot be previewed yet" is drawn
  by the editor, not inside the frame (a fifth message, `blank`). Middle clicks are
  blocked in the frame. The by-URL preview's bar is an `aside`.
- Reversed from the editor-all block: the panel is 416px and `PostBody` has `memo`.
- Tests: two flaky steps fixed (the date picker on the 15th, the site journey's own
  prefetch), and new proof for the typing pause, the iframe's `aria-hidden`, the loading
  and failed lines, the by-URL preview of a single, keyboard scrolling and middle clicks.
- Publish saves first, then shows the check (Criztian: "publish directly so its fast";
  he kept the check). A new entry has the Publish button from the start, and the list of
  changes is read with `cms.get` when Publish is pressed, no longer built by the page.
- Run for the first time: the editor in Playwright's Firefox (12 checks pass), axe-core in
  light and dark (0 violations in the editor), `pnpm dev` with the console open (no
  warning), a collection with no page view, and a view that throws.
- Still not run: a screen reader, and WebKit (Windows Smart App Control blocks a DLL of
  Playwright's WebKit build on this machine).
- Not fixed: `core.autocrlf` is true and the repo has no `.gitattributes`, so git checks
  files out with CRLF and `prettier --check` reports them (27 files on 2026-10-12, 4 of
  them with a real difference). It waits for Criztian's word on a `.gitattributes`.

Fonts phase, 2026-10-12 (the whys are in docs/architecture.md, CMS theme and CMS editor):

- The `select` field type: `options` on the field, a list of `{ value, label }` with at
  least one entry. The type forces `options` on a select the way it forces the name on a
  slug field. The write schema is `z.enum` of the values. The editor starts on the stored
  value when it is an option, then on `default`, then on the first option.
- The control is shadcn's `native-select`, a native `<select>`. New shadcn file:
  `native-select`, left as generated.
- The `theme` collection has a second card, Fonts, with `headingFont` and `bodyFont`.
- `src/data/font.data.ts` holds the six options. `src/config/font.config.ts` holds one
  `next/font/google` call per font, each with its own variable (`--font-<key>`); only
  Geist is preloaded. The root layout puts every variable class on `html`.
- `themeCss` prints `--font-sans` and `--font-display` in its one rule. `globals.css` has
  `:root { --font-sans: var(--font-geist) }`, `--font-heading: var(--font-display,
  var(--font-sans))` and a base rule that gives `h1` to `h6` the heading font.
- Differs from the plan: there is no `font.type.ts`, because nothing needs a named font
  type (`Theme` infers the keys). Not in the plan: the publish check shows a dropdown's
  label ("Playfair Display"), which `cmsChanges` looks up.
- Measured, the same build before and after: the stylesheet went from 98,988 to 111,275
  bytes (16,634 to 19,674 gzip) and from 13 to 45 `@font-face` rules, on every route. The
  build holds 38 font files, 11 before; a browser downloads only the ones it draws. Two
  files are preloaded, as before: Geist and Geist Mono.
- Tests: `public.spec.ts` reads every listed font's variable on a page with no palette,
  which is the check that `font.data.ts` and `font.config.ts` agree. With Lora's variable
  misspelled on purpose, that test and the theme test failed, and the page fell to Times
  New Roman.
- No Figma frame covers this phase: it is built from the repo's tokens and components.
- For `page-review`: the journey test can pick a font with
  `getByLabel("Heading font").selectOption({ label })`.

Editor item, 2026-10-12 (the whys are in docs/architecture.md, CMS shell and CMS canvas):

- Not a `/cms` phase. Criztian asked for it three times; the first two times Claude built
  something else (see the Decisions row).
- `src/components/cms-sidebar.tsx`: a Pages group with one item, Editor, a link to
  `/editor`. The Content group lists the list collections only, so Home page and Theme
  have no row in the dashboard sidebar.
- `src/app/editor/[collection]/page.tsx` is new: `/editor/<slug>` redirects a single to
  its entry and a list to `/dashboard/<slug>`. `/editor` redirects to `/editor/<slug>` of
  the first single, and `/dashboard/<slug>` forwards a single there.
- `src/components/cms-entry-canvas.tsx`: the hierarchy lists the single collections plus
  the open collection, and its rows link to `/editor/<slug>`, so moving from Home page to
  Theme stays in the editor.
- Verified: `pnpm check` green with 45 unit tests; `pnpm test:e2e` with the stack and E2E
  credentials 31 passed with none skipped. In the built app the sidebar links are Editor,
  Blog, Messages and View site; a click on Editor lands on `/editor/home/new`, a page
  with no sidebar; the editor lists Home page and Theme; Theme opens `/editor/theme/new`;
  Back to dashboard returns to `/dashboard/posts`.
- Thrown away, kept in a git stash only: the "one shell" build that moved the lists and
  the inbox under `/editor` and deleted `src/app/dashboard`.

Page-review phase, 2026-10-12 (the whys are in docs/architecture.md, Testing and
Static-only host eject):

- One more end-to-end test, "takes the home text and a color from the editor to the site":
  Editor in the sidebar, the hero text, Save draft, Publish, the Theme row, a hex value in
  Primary, Publish, Back to Dashboard, View site. It makes no router call between its
  setup and its clean-up. With the purge taken out of `publishEntry` it fails.
- "Only clicks" is not literal in two places. The color is typed as hex, because
  Playwright cannot drive the system's color dialog. And the test first deletes the `home`
  and `theme` rows through the router, like every single test. Fonts are not in it: the
  theme test already clicks them through to `/`.
- The README has "Make a section editable", three steps. They were followed once with a
  throwaway About section of two texts, and nothing else was changed: the section showed
  in the hierarchy with its defaults, typing redrew it, a click on it in the frame
  selected it and focused the field, the publish check listed both fields, Publish put it
  on `/`, and the default came back after the delete. It was removed again.
- A fact check of the docs against the code (nine readers, read-only) found 30 lines that
  were stale or wrong, in docs/architecture.md, this file and the README. Each was checked
  against the code by hand, then fixed. None was a wrong decision: they were names and
  details that later phases had changed.
- The static eject recipe was run for the first time, in a throwaway worktree on
  `75514c4`. It reaches a static site in one build. The recipe gained three things the
  run showed (the contact form, the dead Log in link, and that an export ignores
  `revalidate`) and two things read in the source and not run (the typography plugin
  line, and that `next start` refuses an export, so the end-to-end suite goes).
- A review of the diff (four reviewers, a skeptic for each, and a blind follower who added
  a section from the README text alone) gave 17 findings: 10 confirmed, all fixed, and 7
  refuted. Step 2 of the README now says to set `name` to the key and to copy
  `required: true`, and the README names the two end-to-end tests that list the home
  fields.
- Verified: `pnpm check` green with 45 unit tests; `pnpm test:e2e` with the stack 32
  passed with none skipped, twice; `pnpm build` passes with and without the Supabase
  variables.
- The screens were measured at 1440, 1280, 1535 and 1024, and at 1440 in dark: the Blog
  list, Messages, Home page (Hero, Contact), Theme (Colors, Fonts), a post (Content,
  Settings) and the publish check. No sideways scroll, one `h1` each, no console error.
  Desktop is drawn at 0.600, 0.475, 0.674 and 0.275, as the docs say.
- No Figma frame covers the page editor, so there was no Figma call.
- Not checked: a screen reader, WebKit, and the suite against the mock (no public page
  reads anything new in this phase).
- Next: copy the page editor into its first real site.

## Checklist

- [x] setup
- [x] data
- [x] site
- [x] shell
- [x] list
- [x] editor
- [x] publish
- [x] review

Page editor:

- [x] single
- [x] theme
- [x] canvas
- [x] editor-all
- [x] fonts
- [x] page-review
