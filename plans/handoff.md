# Handoff: after Phase 13

> **For:** the next Claude Code session on this build, and the owner.
>
> **Current phase:** none yet. Phases 1–13 are built and committed. The owner picks what comes next from "What comes next" (asked on 2026-10-04); record the pick there and scope it as Phase 14.
>
> **Branch:** `portfolio/phase-3`, three commits ahead of `origin/portfolio/phase-3` (Phase 12 `428c480`, Phase 13 `cae9989` and the archive `0fe3057`). Nothing newer is pushed, and `portfolio/phase-3` is not merged into `main`.
>
> **History:** the full handoff through Phase 13 is `git show cae9989:plans/handoff.md`: the direction and the owner's answers, the owner's copy, the architecture, the DOM contract, every phase's scope and done note, and every decision in the owner's words. This file carries over only what is still open. When CLAUDE.md, DESIGN.md or PRODUCT.md point to `plans/handoff.md` or "the handoff" for something this file doesn't carry (the architecture, the DOM contract and its numbered rules, "Direction", the timeline, the sketch geometry or a phase's notes), they mean that archived copy. Older notes: `git show 0f198b2:plans/handoff.md` (Phases 1–3) and `git show 0a3c97a:plans/handoff.md` (the hero, quote, burst and editor).
>
> **How this file works:** each phase is one conversation. Before building, ask the owner the phase's open questions with the ask tool, and never invent content. At the end, run the acceptance, write a done note under the phase (what shipped, the evidence, what is open), move "Current phase" forward and give the owner the next prompt. Ask before committing. PowerShell 5.1 splits `git commit -m` at quotes, so write the message to a file and use `git commit -F`.
>
> **Acceptance:** each phase lists its own when it is scoped. When it sets none, the default is: `pnpm check` and the unit tests are green; the e2e suite is green on a production build at :3100, with `draft = published` before and after; the hero pixel diff is 0 against the previous phase (`cae9989` for Phase 14; the method is under the landmines); and the owner signs off.

## Start here

Paste this into a new conversation to resume:

```text
Continue the portfolio after Phase 13. Read CLAUDE.md, then plans/handoff.md, PRODUCT.md and DESIGN.md.
First run git status, check ListAgents for a workflow the previous session left running, and check what is listening on ports 3000, 3100, 3102 and 3201.
Then ask me what comes next from "What comes next" in the handoff, unless "Current phase" already names it.
Ask me before committing.
```

## Where things stand (2026-10-04)

- **Built:** Phases 1–13, from the dot engine to the contact inbox. What each phase built is in the archive's "What is built today" and its done notes.
- **Last evidence** (Phase 13, 2026-10-02): `pnpm check` is clean and 653 unit tests pass. The full e2e suite passed 344 of 344 on Phase 13's first-round build, served from a sibling copy at :3102, because old servers held :3100 and :3201 at the time. The final build, as committed, ran only the inbox, contact, dashboard and editor specs (18 of 18), and the inbox spec over three repeats and once more against an empty inbox. That round changed only inbox code, its tests and contact's log key, so the public specs from the full run stand, but the committed tree has had no full run. The hero pixel diff was 0 against Phase 12.
- **Servers:** only the owner's `pnpm dev` (`next dev --webpack`, started 2026-10-04 at 09:55) listens, on :3000. :3100 (the Phase 12 build), :3102 (Phase 13) and :3201 (Phase 11) are free: those servers are gone, so the next e2e run can use :3100.
- **Leftovers on disk,** outside the repo. Ask the owner before deleting any of them:
  - `E:\Project\criztian-baseline-build`: a git worktree at `0a3c97a` with its own install and a webpack build, the hero pixel baseline. Serve it with `pnpm exec next start -p 3200` and the `.env.local` variables loaded.
  - `E:\Project\criztian-phase10-78f4973`: a git worktree, now at `ef06f1a` (Phase 11), with `.env.local` copied in and `node_modules` junctioned to this repo's. It is the previous-phase baseline, served on :3201: check out the commit to diff against (`cae9989` for Phase 14), then rebuild it with `next build --webpack`, because Turbopack rejects the junction.
  - `E:\Project\criztian-phase13-e2e`: the Phase 13 e2e copy (not git), with `node_modules` junctioned to this repo's. Its cleanup was left to do.
  - `E:\Project\criztian-portfolio-audit`: an older copy (not git), with `node_modules` junctioned to this repo's.
  - `E:\Project\criztian-baseline-0a3c97a` and `E:\Project\criztian-phase1-3f58984`: leftover `node_modules` folders with no source tree (not git). Both have dangling package links (2,198 each), so neither can build.

  **Removing them safely:** for the three folders whose `node_modules` is a junction into this repo (`criztian-phase10-78f4973`, `criztian-phase13-e2e` and `criztian-portfolio-audit`), run `[System.IO.Directory]::Delete("<folder>\node_modules", $false)`, check that no reparse points remain (none had another on 2026-10-04), then remove the folder. Windows PowerShell 5.1's recursive `Remove-Item` can follow a junction into its target, so removing the folder first can empty this repo's `node_modules`. `criztian-baseline-build` and the two older folders have a real `node_modules` with 2,198 pnpm junctions each, all pointing inside their own folder, so for those check that no junction points outside the folder, then remove it. After removing a worktree's folder, run `git worktree prune` in this repo.

## What comes next (the owner picks)

The owner named five tracks (2026-10-04). Each is one conversation, and a small one can share a conversation with another.

### A. The owner's material

**Waiting on the owner:**

- the belief line (the quote, seeded as "[Your belief line, in your own words]");
- the story and a photo for About (today the bracketed "[Your story, in your own words]" and a "[Your photo]" plate);
- client quotes the owner has permission to use, each with the client's name, role and company, and a photo or logo;
- real projects: the title, tag, summary, stack line, https link, image and alt text. The image is an https URL, or a file directly in `public/projects/` named in lowercase letters, digits and hyphens and ending .avif, .webp, .png, .jpg or .jpeg (`PROJECT_IMAGE_PATH_PATTERN`). Any other path shows the placeholder, with no error;
- the cursive logo, saved as `public/brand/logo.svg` (approved in Phase 10; `public/brand/` doesn't exist yet).

**Decisions that wait on it:**

- **About's photo in black and white** (Phase 4 decision 2): confirm when the photo arrives.
- **Several testimonials:** the label counts the quotes once there is more than one ("Testimonials · 01 / 03", owner, Phase 5), but how one quote gives way to the next isn't designed; today the section renders the first quote only. Design it when the real quotes arrive.
- **A long belief line** wraps at 11ch with no size step by length (Phase 5).
- **A long project title** flows the deck sooner: titles take the default statement size with no step down by length, up to 60 characters (Phase 9).
- **The logo:** wire it into the header brand. Keep "Criztian" as the accessible name, render it in Lamp White (a CSS mask or `currentColor`) at the placeholder's height, and update DESIGN.md's Brand line (Phase 10).
- **The Phase 5 copy** (open since Phase 5): the local record still holds the copy the e2e suite published in Phase 5, the approved tagline and the bracketed placeholders. Keeping it or restoring the pre-Phase 5 copy is still the owner's call. The backup is `.local/phase5/site-content-backup.json` (copied on 2026-10-04 from an old session's temp scratchpad). Its published tagline is the template line PRODUCT.md retired, so the material replaces both.

**Where it goes:**

- The quote, the projects, the FAQ, Let's connect and Contact's copy are site content. Locally the stored record overrides the seed defaults, so the owner publishes the material in the editor. The seed defaults in `src/data/site-content.data.ts` show only while `published` is null or invalid, as on a new hosted project before its first publish, so update them too if the owner wants a fresh deployment to start from the material.
- About's story and stats, the testimonials, and the Services and How I work copy are hard-coded in `src/data/page-sections.data.ts`. Image files go in `public/`, beside the placeholders in `public/about/` and `public/testimonials/`.
- Put the material in exactly as the owner gives it (fix only typos and pronouns), and update PRODUCT.md "Evidence on Hand". Never invent a name, quote, logo, number or outcome.
- The owner's source copy and the approved short drafts are in the archive ("The owner's copy").
- The owner's material may sit unpublished in the draft, and `editor.spec.ts` publishes the whole draft, so check `draft = published` before any e2e run (landmines).

**Prompt:**

```text
Continue the portfolio: I'm sending real material. Read CLAUDE.md, then plans/handoff.md (track A and "Landmines still live") and PRODUCT.md "Evidence on Hand".
Put my material in exactly as I give it (fix only typos and pronouns): [the belief line, story, photo path, client quotes with names and permission, project details, logo path].
Tell me what to publish in the editor, or update the seed defaults if they are still seed; the rest of the copy goes in src/data and the image files in public/. Update PRODUCT.md "Evidence on Hand" and the handoff, and run pnpm check and the affected tests (e2e only after the landmines' draft = published check).
Ask me before committing.
```

### B. The login's open redirect

- **The hole:** the login page reads `?next=` unchecked (`src/app/(auth)/login/page.tsx`), and `LoginForm` calls `router.replace(next ?? DASHBOARD_PATH)` after a successful sign-in (`src/features/auth/components/login.form.tsx`). So `/login?next=https://elsewhere` sends the owner off the site the moment they sign in, which a phishing link can use. It predates Phase 13, which noticed it while building the inbox and left it as the owner's call (Phase 13's done note, Open).
- **What sets it legitimately:** only the proxy, which sends an anonymous visitor to `/login?next=<pathname>` (`src/lib/supabase/supabase.proxy.ts`), so a real `next` is always a path under `/dashboard`. `/auth/confirm` is already safe: it allowlists its own `next` (`resolveNextPath`, only `/reset-password`).
- **The fix** (the owner's call): accept `next` only when it is a same-origin path under `/dashboard`, and fall back to the dashboard otherwise, so `https://…`, `//host`, `/\host` and any other path all land on `/dashboard`. One pure rule with a unit test, applied where the login page reads `next`, and an e2e check that `/login?next=https://example.com` lands on `/dashboard` after signing in (with the logged-in specs' throwaway user).

### C. Live email for deployment

- **Today:** `createEmailAdapter()` (`src/server/integrations/email/email.adapter.ts`) always returns the preview adapter (`email-preview.adapter.ts`), which writes each notification as HTML to `.local/email-previews/` and sends nothing. Nothing acts on `EMAIL_MODE` yet. `src/config/env.server.ts` only requires it to be `preview`, so the host must still set it, and `tests/unit/env.test.ts` checks that `resend` is refused. The `EmailAdapter` type, whose result allows only `previewed`, is in `src/types/contact.type.ts`. The inbox shows each message's notification status from `notified_at` and `notify_error`.
- **Why before launch:** a deployed disk may be read-only or wiped, so the preview can't stand in for email there. A Resend adapter was the plan; CLAUDE.md lists it as deliberately not added until it is asked for.
- **Ask the owner first:** the provider (Resend, or another); the sending domain, its DNS (SPF, DKIM and DMARC) and the from-address; whether only the owner is notified (`OWNER_EMAIL`), or the sender also gets a confirmation (new copy, which the owner writes); and where the key lives on the host.
- **Keep:** the preview mode for local work and e2e, so a test never sends real mail; the anti-spam checks; the redacting logger.
- **Separate:** Supabase's own auth mail (the password reset) needs SMTP and the repo's recovery template on the hosted project (track E).

### D. Dot shapes for the breathers (a design first)

- **The owner's words** (Phase 12, 2026-10-01): the breathers are room "we can add more dot shapes" to. Not built, because it is new dot art: it needs a design on a Claude Design canvas first, the method the owner liked in Phases 4 and 12 (a written brief, real material cropped from the live engine, new shapes sketched in the chalk stipple, then a canvas with at most two variants that differ in one dimension).
- **What a breather is today:** a 75svh top margin on every scene after the hero (25svh before Let's connect, after FAQ's own hold), from one rule in `globals.css`. Only the dots cross it, on the scrubbed flight between two scenes, and the new title sweeps in only as its section rises from the foot of the screen. The old section's copy has swept out by then, except where it stays lit through the transit after it (`resolveRevealRange`): FAQ's rows, until the handshake has formed (`isReadAfterPin`); a pinned frame that grew past the viewport (`isGrown`: the quote, About or Testimonials on a landscape phone, at 400% zoom or with text spacing); and a scene with no slot (an emptied deck, or a scene the fit gate flowed). So a shape in the breather before Let's connect can share the screen with lit FAQ rows. The breather stays, plain black, under reduced motion and the pause, and it is 0 without WebGL2 or scripting.
- **Rules a design must keep:**
  - Space, not a pin: nothing holds the scroll, and the breather stays a margin, so pin ranges, anchor landings and the scroll-spy measure as before (DOM contract rule 1). It never depends on `data-fit`.
  - One dot object per screen, and the Draw-and-Frame Rule: ideas are drawn, real things are framed, and no screen has a background texture. A shape in a breather is a new beat in the dot story (DESIGN.md, "The Dot Story").
  - Motion follows the scroll: nothing pops. Measure every reveal in scroll px at 1440×900 and 390×844, and treat anything under about 100px as a pop (the house rule since the arrival title's 41px sweep: "sudden pop out hurts my eye", owner, Phase 12).
  - The fast-wheel guarantee has almost no slack at 390×844: the title starts at the foot of the screen just as Services' last list line clears the header. Anything that shortens the clear stretch fails section-motion's fast-wheel test, "never leaves Services' copy lit on screen under How I work's arriving title on a fast wheel" (in "the breather at 390x844").
  - A drawing has at most `SHAPE_POINTS` (12,000) dots.
  - Retuning a breather's size changes the tests that pin it (see "Known small issues").
- **Engine note:** the timeline knows scenes (`[data-dot-scene]` containers, each formed shape in a pinned slot) and the transits between them, and the breather is empty space inside a transit (DOM contract rule 7). A shape there is new ground: settle with the design whether it is a new kind of keyframe or part of the flight, before any code.
- **Tooling:** `.local/phase12/` (git-ignored): `sketch.js` mirrors the engine's generators (the chalk stipple and the text sampler), `render.mjs` renders a jobs file to PNG in full Chromium, `jobs-final.mjs` holds the Phase 12 geometry and `spec.md` the Phase 12 canvas spec. Also there: `engine-render.mjs`, which renders shapes with the engine's own rules and sampler, and `breather/`, the probes that measured the breathers on a fast wheel and the title's sweep.
- **Ask the owner first:** which breathers get a shape (all of them or a few), what each one says, whether it holds still or draws with the scroll, and whether it replaces the flight or rides it.

### E. Device checks and deployment

**Device checks** (the owner's, open since Phases 7–11):

- **Scroll tests:** Services, How I work and the projects deck, on a wheel, a trackpad and a phone. Nothing should ever hold the scroll; a step plays by itself once the scroll passes 12% into a transit; between two projects the frame unwinds and redraws round the new plate in place. While scrolling How I work, confirm the ring's drifting dots (Phase 4 decision 3).
- **Copy crossings on a phone** (Phase 11): the incoming dots could meet the outgoing copy's last lines at the very end of a transit, because both frames were moving then. Phase 12's breathers (75svh, 25svh before Let's connect) now leave the old section above the screen when a transit ends, so check it once on a phone, with a fast scroll too, and drop this line if it is gone.
- **The Android frame trace and fling test:** USB debugging on, `adb reverse tcp:3100 tcp:3100` and `adb forward tcp:9222 localabstract:chrome_devtools_remote`, then `node .local/phase11/android-trace.mjs` against a production build on :3100. The lead from Phase 11: at 4× CPU throttling, style recalculation took 7.8ms a frame against 1.2ms of script, from the registered custom properties the scroll timelines animate.
- **The iPhone (Safari 26) checklist:** `.local/phase11/iphone-checklist.md`, at the PC's LAN address on port 3100. Windows Firewall may need to allow Node on private networks. It dates from Phase 11: it has no step for FAQ's conversation drawing and downward opening, Let's connect, the service chips, LET'S BUILD or the breathers, and it hard-codes `http://192.168.1.2:3100`. Bring it up to date before sending it.
- **The recordings' sign-off** ("wow and professional"): `.local/phase10/recordings/` and `.local/phase11/recordings/`, at 1440×900 and 390×844. They predate Phase 12's ending and breathers, which the owner signed off on 2026-10-02, so record the whole page afresh from a production build before asking.
- **LET'S BUILD on a big monitor:** above about 1,445px wide the sign stays about 1,100px wide while the name keeps growing, because a drawing has at most 12,000 dots.
- **For the owner to see** (built as designed; change only on request):
  - the deck flows as a reading list on landscape phones at 740×360 (by 2px), 740×304 and 667×320, while 740×280 pins; a small cut to the card's copy would keep 740×360 pinned;
  - Contact's gather shows only where the whole form fits one pinned frame (desktop, tablets, a 390×844 phone); smaller phones get a plain black section, so a pin never hides the submit button.

**Deployment** (the owner handles it, 2026-10-01; checked against the code on 2026-10-04):

- **Hosting** for Next.js 16 that runs a Node server on Node 24 or later, with pnpm 10: `.nvmrc` is 24, `package.json` sets `engines.node` to `>=24` and `packageManager` to `pnpm@10.34.5`, and pnpm refuses to install on an older Node. `/` is prerendered (`force-static`) and refreshed by `revalidatePath("/")` on publish, so the host must support on-demand revalidation.
- **The build reads the published content,** so the build environment needs every variable below and must reach the hosted Supabase. A build that can't reach it prerenders the seed defaults until the next publish.
- **A hosted Supabase project:**
  - the five migrations in `supabase/migrations/`;
  - the content: the migration creates the `site_content` row empty (`draft = '{}'`, no `published`), so the hosted `/` shows the seed defaults until the owner publishes in the hosted editor. Anything published only in the local editor stays in the local database;
  - `max_rows` of at least 1000 in the API settings: the inbox's "Show older" cap (`INBOX_MAX_SHOWN`, 975) relies on it;
  - auth's `site_url` and redirect URLs (today `http://localhost:3000`, `/auth/confirm` and `/reset-password` in `supabase/config.toml`). Set `site_url` to the deployed origin, the same as `NEXT_PUBLIC_APP_URL`: the password-reset link is built from it;
  - signup disabled with the global switch (`[auth] enable_signup = false` in `supabase/config.toml`), and the owner's account created by hand. Keep the email provider on: it also carries sign-in and the password reset (`[auth.email] enable_signup = true`);
  - new `sb_` keys (legacy `eyJ…` keys are rejected);
  - SMTP for auth mail (the password reset);
  - the recovery email template: the subject "Reset your password" and the body of `supabase/templates/recovery.html`, whose link is `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`. `config.toml` sets it for the local stack only. A hosted project sends its default template, whose `{{ .ConfirmationURL }}` link never gives `/auth/confirm` a `token_hash`, so every reset would end on "That link was not valid. Request a new one.";
  - backups;
  - a check that the inbox migration's column grants applied: the owner's session must not select `ip_hash` (`tests/e2e/inbox.spec.ts` checks it).
- **Environment:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `OWNER_EMAIL` and `EMAIL_MODE` (it must be `preview` today; track C).
- **The client address:** `readClientAddress` (`src/features/contact/contact.rules.ts`) trusts the first `x-forwarded-for` entry, then `x-real-ip`, for the rate limit. The host must overwrite that header, or the rate limit must read the host's trusted header instead.
- **Live email** (track C) and **the open redirect** (track B) before launch.
- **A domain, DNS and HTTPS.**
- **Merging `portfolio/phase-3` into `main`,** and pushing, once the owner signs off.
- **The owner's material** (track A) before launch.
- **Before launch:** re-check the image-variant hang (landmines) on the host, and run the e2e suite against a preview deployment. The suite publishes the draft (landmines) and creates and deletes a throwaway user (CLAUDE.md, "e2e state"), so give the preview its own Supabase project, and `EMAIL_MODE=preview` so the contact specs send no real mail (on a read-only disk the preview only records "Notification failed", which no spec checks). Point a throwaway Playwright config at the preview's URL with no `webServer`, and put that project's `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` in the shell: the specs reach Supabase directly (`tests/e2e/owner-account.ts`), and with no `SUPABASE_SECRET_KEY` set they load `.env.local`, the local project.

## Open owner decision (outside the tracks)

- **Instant focus scrolls page-wide?** A quick Tab then Shift+Tab between Send message and the footer's first link leaves Send message focused off-screen while the native smooth focus scroll to the footer finishes. It needs a held Tab under about 300ms and predates Phase 12. Making focus scrolls instant page-wide fixes it, but it changes the page's feel, so it is the owner's call. Contact's own focus scrolls are already instant.

## Known and accepted

Each was accepted in its phase. Leave them unless the owner asks.

- **Where scenes flow** (the fit gate working as designed): Services on landscape phones, 320px-wide phones and with text spacing at laptop sizes; How I work also with text spacing at 1920×1080, because the stacked wheel is height-hungry; the deck on the landscape phones above.
- **How I work's numeral** gets small on short laptops (144px at 1366×657), so the shape keeps its room.
- **Focus wins while focused** (the owner's rule, Phase 9): after a click on a project title, the first arrow-key scroll makes the link `:focus-visible` in Chrome, so the board holds that project while the dots move on, until focus leaves. The same happens when Space or PageDown scrolls while a card link has keyboard focus.
- **The cube's pen order:** its 7,200 dots sit in the first 60% of the pen order, so scrolling back up from Work draws the cube over the first 60% of that flight (too slight to change, Phase 6).
- **The ending** (Phase 12): the sign's dots are uniform, without the name's coverage edge (that needs a shader change); the FAQ phone list covers the pinned drawing as it scrolls; Contact flows wherever the whole form can't pin; in the 1301–1332px band the chips wrap once one is chosen; the chips' invalid border is subtle, and the message carries the error.
- **The inbox** (Phase 13): "Show older" grows one window up to `INBOX_MAX_SHOWN` (975), so past 975 messages in one view the oldest can't be listed (the upgrade is a keyset cursor plus a client-side append); each action costs two list renders (`replace`, then a refresh that invalidates the back/forward cache; keep it).
- **Script weight:** 378 KB gzipped on `/` (react-dom, Next's runtime, Motion, Lenis and the contact form's stack). `zod/mini` or a form without the tRPC client would cut more, but the measured budget doesn't need it (Phase 11).
- **The Phase 4 canvas** still shows B1's left-hand ring; DESIGN.md's Wheel Rule records the change (Phase 8).

## Known small issues (not scheduled)

- **The editor preview:** going from no visible project to one draws no frame until the next resize, because the hook only watches the slots it found at start-up (since Phase 6). The public page never changes its count at runtime.
- **A grown About frame on the split layout** (landscape phones) centres its plate across both grid rows (`split:self-center`), so part of the plate and its dot frame can sit below the fold while pinned (Phase 5). Testimonials uses the same layout.
- **Without JavaScript,** a submit is a POST that delivers nothing (the fields never reach the URL).
- **Under reduced motion or the pause:** `--scene-reveal` can go stale (`resolveContainerReveal` reads the live progress, `publishSceneState` the static index), though nothing reads it then; the nav dot lands on the second frame after an instant scroll (Motion's `layoutId` projection paints the old spot once); the cursor's springs keep stepping, which costs frames only.
- **The cursor's `useScroll` and `useVelocity`** also run on phones, with no DOM writes, listeners or frames at rest (Phase 10).
- **Test gaps** (Phase 12): `fit.spec`'s line scan can't include FAQ (closed answers keep zero-height rects); `editor.spec` doesn't edit the FAQ, Let's connect or Contact panels (unit tests cover the FAQ panel).
- **The tests pin the breathers:** `motion-fallbacks` and `section-motion` keep the breathers' 0.75 and Let's connect's 0.25 as constants (`BREATHER_VIEWPORT_SHARE`, `CONNECT_BREATHER_VIEWPORT_SHARE`), and `step-motion-rules.test.ts` checks the literal 75svh and 25svh. So a retune changes `globals.css` and all three. When `FAQ_HOLD_CLASS` changes with Let's connect's breather, `site-page.test.tsx` checks its literal class and `ending.spec.ts` checks that the drawing holds for at least a quarter of a screen (`HOLD_VIEWPORT_SHARE`).

## Landmines still live

These are the ones CLAUDE.md doesn't already cover.

**Running and measuring:**

- **e2e without touching the dev server:**
  1. Build with `pnpm build`. It can run beside `pnpm dev`, because Next 16 writes dev output to `.next/dev`. Don't rebuild `.next` while `next start` serves it: stop the server first.
  2. Serve it with `pnpm exec next start -p 3100`.
  3. Point a throwaway Playwright config at it: an absolute `testDir` of `tests/e2e`, a `baseURL` of `http://localhost:3100`, and no `webServer` (`.local/playwright.3100.config.ts` is one).

  If :3100 is held by a server this session didn't start, don't stop it (auto mode may refuse anyway): copy the tree to a same-drive sibling (robocopy without `node_modules`, `.next`, `.git`, `.local` or `.env.local`), junction its `node_modules` to this repo's, build it with `next build --webpack` with the `.env.local` variables loaded in the shell, and serve it on a free port (Phase 13 used :3102 with `.local/phase13/playwright.3102.config.ts`). A server this session started can be stopped by its PID once its command line is checked.

- **Before an e2e run, check `draft = published` in `site_content`,** and ask the owner if they differ: `editor.spec.ts` publishes the whole draft. `node .local/phase9/draft-diff.mjs`, run from the repo root with Supabase up, only reads, and prints `equal: true` or the paths that differ. The deck test needs at least two titled projects in the draft. Run alone, it leaves the "unpublished changes" flag on with equal content, because the flag compares timestamps, not content (`hasUnpublishedChanges`).
- **A background server outlives its task:** when a background `next start` hits the task time limit, `node` keeps listening. Find it with `Get-NetTCPConnection -LocalPort 3100 -State Listen`, check its command line, and stop that PID before rebuilding.
- **Keep parallel Playwright agents to about four.** Eight at once crashed Chromium (`Target crashed`, exit 0xC0000142) from machine load, not from the tests.
- **Capture in full Chromium** (`channel: "chromium"`), not the headless shell: its SwiftShader paints alpha-0 holes where an opaque sticky step overlaps the fixed canvas. The e2e specs pass on either.
- **Playwright's WebKit can't run on this machine:** Windows' Smart App Control refuses its unsigned `ssl-60.dll` and `zlib1.dll`. Safari proof comes from the owner's iPhone. Don't disable Smart App Control: it is the owner's setting, and it can't simply be switched back on.
- **With JavaScript off in Playwright,** `page.addStyleTag` hangs and `requestAnimationFrame` from `page.evaluate` never fires. Inject a `<style>` through `evaluate`, and poll.
- **Touch scrolls for recordings:** CDP `Input.synthesizeScrollGesture` with `gestureSourceType: "touch"` scrolls nothing in this Chromium. Drive swipes with `Input.dispatchTouchEvent`, as `.local/phase10/record.mjs` does.
- **Tailwind 4's `!` utilities are `!important` inside `@layer utilities`,** so a test can't override them with an injected unlayered `!important` rule. Break them by removing the class instead.
- **Measure fit at real heights, not only nominal sizes.** Re-measure every layout change to a pinned scene at 375×548, 360×560 and 390×664; 740×304, 740×280 and 667×320; 320×256 (400% zoom); and 360×640, 740×360 and 1440×900 with a WCAG 1.4.12 text-spacing stylesheet injected. `tests/e2e/fit.spec.ts` covers the gate.
- **A production server can hang on image variants:** after one full e2e run, a server timed out on two uncached `_next/image` variants until it was restarted. If a plate shows black in a capture, request its `_next/image` URL with curl before suspecting the page, and restart the server before capturing. Check it again on the host before launch.

**The hero pixel diff:**

- **Diff visual regressions; don't eyeball them.** Capture the canvas with `getImageData` in a throwaway Playwright script, before and after. That caught two sub-pixel regressions that screenshots hid.
- **The method:** against `0a3c97a` and against the previous phase's commit, at DPR 1 and 2, at rest and with reduced motion, masking the 72px header band and the scroll cue's row. Against `0a3c97a` the name differs in 20 pixels at DPR 1 (up to 2/255) and 24 at DPR 2 (up to 1/255), all inside the name's box, as measured since Phase 5; anything more is drift. Against the previous phase it has been 0 since Phase 5.
- **The script** is `.local/phase13/pixel-diff.mjs <candidate URL> <baseline URL>` (for example `http://localhost:3100 http://localhost:3201`), run from the repo root. It prints the JSON report and writes its PNGs to `.local/phase13/pixel/`, so copy it to the new phase's folder, change those two paths and create that `pixel` folder first. The baselines are the worktrees under "Where things stand", served on :3200 and :3201.

**Shell:**

- **`Set-Content -Encoding utf8` writes a BOM** in Windows PowerShell 5.1. Use the Write and Edit tools.
- **`UID` is read-only in bash.** A `UID=$(...)` capture fails silently.

**Code and data:**

- **TypeScript loses narrowing** of a captured `const` inside a hoisted `function` declaration. After the null guard, use an explicitly typed alias (`const container: HTMLElement = containerElement`). The hook does this throughout; don't "clean it up".
- **`motion/react` ships no `"use client"`.** Import it only from client components; `src/providers/motion.provider.tsx` carries the directive.
- **`data-thread` under reduced motion:** the hook republishes it only when the static keyframe changes, so inside a transit it can lag the committed target. Nothing in `src` reads it today: the captions, cards and position counts read `--reveal-*`, and only the e2e specs read `data-thread` (`step-motion`, `section-motion`, `section-title`). Before keying anything visible on it, publish it on every reduced-motion scroll (Phase 7).
- **Never `pnpm db:reset`** on the owner's data: it re-seeds `site_content` with `draft = '{}'` and wipes `auth.users`. Apply a new migration with `pnpm exec supabase migration up --local`, then `pnpm db:types`.

**Sessions and agents:**

- **A finished conversation's background workflow keeps running,** and a previous session can wake up when its workflow finishes (Phases 10 and 12). Before resuming, check `ListAgents` and the previous session's `C:\Users\crizt\.claude\projects\e--Project-criztian-portfolio\<session id>\subagents\workflows\*\journal.jsonl` (this file was written in session `06f0cb28-0d4f-4e91-a1bd-4b6e911e31c0`); re-read this file before editing it, and tell the owner not to reply in the old session.
- **The account's usage limit can stop a workflow mid-run** (Phase 12: six e2e agents failed at once, leaving a partial spec edit on disk). Check `git diff tests/` before re-running, give the next run its exact failure list (run the old suite once yourself first: it costs no agent tokens), and keep this file current while big workflows run.
- **The Design canvases are private.** Only the owner can share them (Share menu). Read their comments with the artifact comments tool, and never publish site code to them.

## References

- **Design canvases:** the Phase 4 mockups, with B1 and every section's artboards, https://claude.ai/artifact/JfBhfHpocuCtfDmcTkahob; and "Portfolio · The ending" (Phase 12), https://claude.ai/artifact/MMQCiqBruMwzB2E5cob9uT.
- **Mockup renders:** `plans/mockups/`.
- **Local evidence** (git-ignored): `.local/phase5/` to `.local/phase13/` hold each phase's captures, recordings, review results, probes, tooling and backups.
