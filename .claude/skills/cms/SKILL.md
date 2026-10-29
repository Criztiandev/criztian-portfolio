---
name: cms
description: Build the CMS in the website template, one phase at a time, from docs/cms-plan.md (Claude Code only). Use on /cms.
disable-model-invocation: true
argument-hint: "[next | setup | data | site | shell | list | editor | publish | review | single | theme | canvas | editor-all | fonts | page-review]"
---

# /cms: build the CMS (cc)

**Scope: cc only** (Claude Code, in the website-template repo or a site cloned from it).
The phase comes from the argument: $ARGUMENTS

docs/cms-plan.md is the plan: the v1 features, Later, Cut, Reuse, Replace, the decisions,
the data model, the Figma map and the checklist. Its Page editor section is the plan for
the last six phases and has a checklist of its own. Build only what it lists.

## Phases, in order

Backend first: the data and site phases prove every feature with tests before any new
screen exists.

| Command        | What it does                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `/cms`         | Read docs/cms-plan.md, say which phase is next and why. Change nothing.                                    |
| `/cms next`    | Continue in a new conversation: pick up the state, then run the first unticked phase (see "next").         |
| `/cms setup`   | Check that the repo, the database and Figma are ready. Change nothing but the checklist.                   |
| `/cms data`    | Backend: config, table and security rules, model, repository, service and router, with tests.              |
| `/cms site`    | Public side: the blog on the new table, the preview route, the old posts code removed, an end-to-end test. |
| `/cms shell`   | First screens: new tokens, the `/dashboard` layout with the sidebar, Messages.                             |
| `/cms list`    | The collection list screen on real data.                                                                   |
| `/cms editor`  | The entry editor on real data: Save draft, Preview, the unsaved-changes warning.                           |
| `/cms publish` | The publish check dialog on the real changes list.                                                         |
| `/cms review`  | QA, the full journey through the screens, docs.                                                            |

The page editor (docs/cms-plan.md, Page editor), in order after `review`:

| Command            | What it does                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `/cms single`      | Single collections, field defaults, the home page reading its content from the CMS.             |
| `/cms theme`       | The color field, the contrast rule, the brand palette on the public site.                       |
| `/cms canvas`      | The full-screen editor at `/editor` for single collections: the hierarchy, the real page in a frame, the fields panel, click to select, the width switcher. |
| `/cms editor-all`  | Every collection opens in `/editor`: the posts view, the list links, and the old form, drawer and preview pane removed. |
| `/cms fonts`       | The dropdown field and the heading and body fonts from a list in code.                          |
| `/cms page-review` | The click-only journey, docs, the README steps for a new section.                               |

One phase per run. When a phase is done, say "✅ [phase] is done. Next: `/cms [next
phase]`." and stop. Never start the next phase on your own.

## Rules for every phase

1. **Read first:** AGENTS.md, docs/architecture.md (house rules, layers, the error, env
   and auth contracts, Static versus dynamic, CMS, Supabase grants),
   docs/cms-plan.md, docs/handoff.md and package.json. Read the guide in
   node_modules/next/dist/docs before writing Next code. Load
   supabase-postgres-best-practices before SQL or RLS.
2. **Push back first:** if the phase conflicts with the plan, the architecture doc or the
   code, say so with proof (file:line, command output) before planning. Label every call
   as data or judgment.
3. **Plan, then wait:** list the files you will create, change or delete, and what you
   will reuse. Wait for OK before editing.
4. **Stay in scope:** only this phase, and nothing from the plan's Later or Cut lists.
5. **Generic:** CMS code never names a collection, a field or a client word. Site code
   may: `src/config/cms.config.ts`, the blog pages, the canvas views
   (`src/config/cms-canvas.config.tsx`), the home and theme files (`home.*`, `theme.*`,
   `font.*`, `home-view.tsx`, `site-shell.tsx`) and the marketing pages. The routes under
   `app/dashboard`, `app/editor` and `app/preview` are CMS code. Every new CMS file name
   starts with cms (`cms.config.ts`, `cms-entry.repository.ts`, `cms-sidebar.tsx`) so the
   CMS can be copied into an existing site.
6. **Nothing live without Publish:** Save draft never changes the site, and drafts are
   never readable without a signed-in user. Every phase that touches this proves it with a
   test.
7. **House rules:** follow docs/architecture.md (layers, `name.scope.ts`, named types in
   `src/type`, no comments, the lint rules, AppError codes added only with their first
   producer, migrations that revoke, then grant). Add shadcn parts with the pinned CLI:
   `pnpm exec shadcn add <item>`.
8. **Figma is the reference, the codebase is the rules:** load the figma-design-to-code
   skill before get_design_context. Use the repo's tokens and components, never raw hex
   or pixel values when a token exists, and the Tabler icons mapped in the plan. One
   design context and one screenshot per piece; report how many Figma calls you used.
   The page editor phases have no Figma frame: build from the repo's tokens and
   components and say so in the report.
9. **Proof, not "should work":** run `pnpm check` every phase, `pnpm test:e2e` when
   routes, forms, auth, the proxy or the database changed, and `pnpm build` when pages or
   caching changed. Paste the results. `pnpm test:e2e` runs with the local stack and
   `E2E_USER_*` and must report 0 skipped: without them the database tests skip and the run
   stays green, so a skipped test stops the phase. For screens, compare with Figma at 1440, resize from
   1280 to 1535, and check that 1024 doesn't break. Without a browser tool, say so and
   list what to check by eye.
10. **Accessibility floor:** AA contrast, real buttons and links, a working keyboard
    (dialogs trap focus, Esc closes them), visible focus, a label on every field,
    announced errors, one h1 per page.
11. **Report:** files changed, check results, what still differs from Figma, Figma calls
    used. Tick the phase in docs/cms-plan.md and update Next steps in docs/handoff.md.
    Suggest a commit message; don't commit unless asked.

## Phase details

### next

For a new conversation that has none of the earlier context. Do these in order, then run
the phase under every rule above:

1. Run `ListAgents`, `git status` and `git log -3`. If another session is busy in this
   repo, stop and say so.
2. Read docs/handoff.md: the newest section, Next steps and Open questions.
3. The phase is the first unticked box in docs/cms-plan.md, both checklists, top to
   bottom. If every box is ticked, say so and stop.
4. Before planning, say in a few lines: the phase, what the last phase left uncommitted
   (from `git status`), and every decision the handoff still leaves open. Ask those
   questions first; do not decide them yourself.
5. Then follow that phase's block below, starting with rule 3 (plan, then wait).

### setup

- `pnpm check` is green. The local Supabase stack runs (`pnpm db:start`), `pnpm db:types`
  is current, and the E2E user exists (docs/handoff.md, How-to notes). If not, stop and
  say what's missing.
- The Figma file opens (one get_metadata call on page 1:2).
- List every mismatch between the plan and the repo with file:line.

### data

- `src/config/cms.config.ts` with the Posts collection from the plan, types in
  `src/type/cms.type.ts`, and the zod schema per collection built from the config in
  `src/model/cms.model.ts` (reuse the post slug and link rules).
- A migration for `cms_entries` (the plan's Data model) with RLS and grants.
- `src/repository/cms-entry.repository.ts`, `src/service/cms.service.ts` and
  `src/router/cms.router.ts` on `protectedProcedure`: list, get, create, saveDraft,
  publish and delete. Public reads (live entries, one live entry by slug) take the public
  client.
- Pure functions with node:test tests: the publish state, the changes list (old → new per
  field) and the schema built from the config.
- Database tests that skip without the local stack, like `test/e2e/database.spec.ts`:
  anon can't read drafts or write, a signed-in user can do everything, slugs stay unique.
- `supabase/seed.sql` with the 4 sample posts from Figma 4:31 (Draft, Changes not
  published, Published, Published). This answers the seed question in docs/handoff.md.
- The old blog keeps running on `posts` until the site phase.

### site

- `/blog` and `/blog/[slug]` read live, visible posts from `cms_entries` through the
  public client. They stay static with `revalidate = 3600`. Move the post view into one
  component that the preview route reuses.
- The preview route `/preview/[collection]/[id]` from the plan (How the site reads
  content). Add `/preview` to `protectedPathPrefixes` and check claims in the page.
- Remove the old posts code listed under Replace, then `pnpm db:reset` and
  `pnpm db:types`. The dashboard shows only Messages until the shell phase.
- Update `test/e2e/postgrest.mock.ts` for the new table.
- One end-to-end test with no new screens: sign in on `/login`, save a draft through the
  cms router, `/blog` doesn't show it, the preview route shows it, publish, `/blog` shows
  it.

### shell

- Add the new tokens from the plan to `src/app/globals.css` (light and dark, with
  `@theme` entries).
- The `/dashboard` layout with the sidebar from Figma 3:12: the Content group from the
  config, the Inbox group with Messages, View site, the user and Sign out (reuse
  `LogoutButton`). Keep the toast in the layout. Check claims in every page; the proxy is
  never the only check.
- `/dashboard` opens the first collection, `/dashboard/messages` shows
  `ContactMessageList`, and a single collection opens its editor.

### list

- `/dashboard/[collection]` from Figma 4:31: the title with the summary, Updated, Site,
  the row menu (Edit, Delete), extra columns from the config, and the New button.
- Empty, loading and error states. Delete asks first (alert dialog), says it takes the
  entry off the site right away, then shows a toast.

### editor

- `/dashboard/[collection]/new` and `/dashboard/[collection]/[id]` from Figma 5:152:
  cards and fields from the config (`richtext` uses `MarkdownEditor` the way `PostForm`
  did, keyed by id), checks from the zod schema, the publish state chip.
- Save draft never touches the site. It shows the toast "Draft saved", then calls
  `router.refresh()` (the Back fix in docs/architecture.md).
- Preview is a toggle that opens a live pane beside the form (docs/cms-plan.md, Editor
  revision). It's hidden for collections without a preview view.
- Warn before leaving with unsaved changes: closing the tab, the back link and the
  sidebar links.

### publish

- The publish check from Figma 14:425 on the real changes list. A first publish lists
  every field. Rich text shows only the paragraphs that changed.
- Publish shows the toast "Published", the chip turns to Published, and the site shows the
  change.

### review

- Every screen matches Figma at 1440, works from 1280 to 1535 and doesn't break at 1024.
- Security tests pass: anon can't read drafts or write, and signups stay closed.
- One end-to-end test clicks the whole journey: New post, Save draft, not on `/blog`,
  the Preview pane shows it, the publish check lists the changes, Publish, on `/blog`.
- `pnpm check`, `pnpm test:e2e` and `pnpm build` results pasted.
- docs/architecture.md: rewrite Blog (CMS) as the CMS section (the why). README: "Add a
  collection" in a few steps.
- Then say: "✅ Review is done. Next: copy the CMS into its first real site (the Hanapix
  lessons) and re-check revalidation on Cloudflare."

### single

- The migration `cms_entries_single` (`pnpm supabase migration new`, then
  `supabase migration up`, never a reset) and `pnpm db:types`.
- `single` and an optional `titleField` on a collection, `default` on a field. The two
  redirects in the dashboard pages. In the editor: the heading child, no back link for a
  single, the root error on CONFLICT when the collection has no slug field.
- Site: the `home` collection after `posts`, `home.data.ts`, `home.model.ts`,
  `home.type.ts`, `home-view.tsx`, and `/` reading it with `revalidate = 3600` and the
  `hasSupabaseEnv()` guard. The defaults are today's text, so `public.spec.ts` still passes.
- Tests go through the router, with no clicks on fields. Each single test first deletes the
  collection's rows.
- Also run the suite once against the mock (docs/handoff.md, How-to notes).

### theme

- The `color` type, `cmsColorSchema`, `cmsContrast`, the `contrast` key and the color
  control. The `theme` collection, `theme.data.ts`, `theme.model.ts`, `theme.type.ts`,
  `theme.util.ts` (`themeCss`), `site-shell.tsx`, the marketing layout, `providers.tsx`,
  the `.prose` block and the `body` rule in `globals.css`.
- Leave `/preview/[collection]/[id]` alone: theming it would name a collection in CMS code.
- List for the owner what changes with no palette edit (docs/cms-plan.md, Theme on the
  public site).
- Also run the suite once against the mock.

### canvas

- The full-screen editor at `/editor` for single collections (docs/cms-plan.md, Editor).
  Posts keep the form layout until `editor-all`.
- Create: `app/editor/layout.tsx`, `app/editor/page.tsx`,
  `app/editor/[collection]/[id]/page.tsx` (404 unless the collection is a single),
  `app/preview/[collection]/canvas/page.tsx`, `cms-canvas.config.tsx` (the views for `home`
  and `theme`), `cms-entry-canvas.tsx` and `cms-canvas-frame.tsx`.
- Change: `cms-entry-editor.tsx` (an optional `canvas` prop, the card state, `openCard`),
  the single redirects in the two dashboard pages, `/dashboard` (the first collection that
  is not a single), `"/editor"` in `protectedPathPrefixes` and in the `providers.tsx`
  check, the data attributes in `home-view.tsx`, the message schema, the types and
  `listSingleValues`.
- Every posts test in `cms.spec.ts` passes unchanged. The single and theme tests change
  (URLs, the back link, the section click). It adds the frame test.
- Also: the unit tests for the message schema, and `/editor`, `/editor/home/new` and
  `/preview/home/canvas` in the anonymous redirect test of `public.spec.ts`.
- Run the checks in docs/cms-plan.md, Open risks, while building.

### editor-all

- Add the `posts` view to `cms-canvas.config.tsx` and the data attributes to
  `post-view.tsx`. The list's New, Edit and title links point at `/editor`.
- The by-URL preview route draws from the canvas registry, so it gets the brand, and its
  Back to editor link points at `/editor`.
- The existing 250 ms typing pause applies, only for a collection with a `richtext` field.
- Delete: `app/dashboard/[collection]/[id]/page.tsx`, the form layout, the drawer and the
  pane in `cms-entry-editor.tsx`, `cms-entry-preview.tsx`, `use-cms-preview.ts`,
  `cms-preview.config.tsx`, `ui/sheet.tsx`, the `drawer` key, `previewable`, and the
  sidebar and Log out guards.
- Rewrite the two editor tests, the publish test and the journey test: the URLs, the
  Settings section button in place of the drawer,
  `frameLocator('iframe[title="Page preview"]')` in place of the pane, "Back to Blog" in
  place of "Blog".
- Rewrite docs/architecture.md, CMS editor, and the parts of docs/cms-plan.md that still
  describe the form, the drawer and the pane.

### fonts

- The `select` type, `font.data.ts`, `font.config.ts`, `font.type.ts`, the Fonts card, the
  font variables in `layout.tsx` and `globals.css`.
- Measure the CSS size before and after and report it.

### page-review

- One journey test that only clicks: the home text and a color, from the editor to the site.
- docs/architecture.md, README "Make a section editable", docs/handoff.md and its linked
  doc.
- Then say: "✅ The page editor is done. Next: copy it into its first real site."
