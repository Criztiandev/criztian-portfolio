# Handoff: the dot-art redesign

> **For:** the next Claude Code session picking up this build.
>
> **Current phase:** **Phase 3, shapes, dot choreography and section motion.** Phases 0–2 are done (2026-09-28). Phase 1 is committed as `3f58984`. Phase 2 is the commit on `project/portfolio` after `99b3538`. Start Phase 3 with the hero pixel diff against `0a3c97a`.
>
> **Branch:** `project/portfolio`. **Baseline for pixel diffs:** `0a3c97a`.
>
> **Older rationale:** the previous handoff (the hero, quote, burst, editor and foundation) is in git at `0a3c97a:plans/handoff.md`. Read it with `git show 0a3c97a:plans/handoff.md`. The foundation and editor plans in `plans/` are finished history.

## What the owner asked for (2026-09-28)

The public page is rebuilt as one long scroll. Instead of images, dots form a shape in each signature section.

**The owner's rule:** the dot animation is the main show. As you scroll, it must always be framed in view and never cut off between sections.

This round is design only. The CMS for the new sections comes later.

### Page order and anchors

| #   | Section           | Anchor          | Dots                                                                        |
| --- | ----------------- | --------------- | --------------------------------------------------------------------------- |
| 1   | Hero              | `#home`         | the name (today's wordmark)                                                 |
| 2   | Quote             | `#quote`        | the spinning cube (kept)                                                    |
| 3   | My services       | `#services`     | one line-art shape per service                                              |
| 4   | Who am I          | `#about`        | a wireframe bust, slowly rotating, on the left; copy and stats on the right |
| 5   | Featured projects | `#project`      | dots frame the active project's plate                                       |
| 6   | How I work        | `#process`      | one shape that evolves through the 5 steps                                  |
| 7   | Let's connect     | `#connect`      | dust                                                                        |
| 8   | Testimonials      | `#testimonials` | dust                                                                        |
| 9   | FAQ               | `#faq`          | dust                                                                        |
| 10  | Blog              | `#blog`         | dust                                                                        |
| 11  | Get in touch      | `#contact`      | dust. `#contact` must stay on the form.                                     |
| 12  | Footer            | none            | the name re-forms                                                           |

### Owner decisions

- **The owner's screenshot** (stacked, rounded cards with orange tags) was context only.
  - Featured Projects is designed fresh.
  - Keep the black, monochrome, square system in DESIGN.md.
- **Shape style is literal line art**, stippled like the cube's edges:
  - Branding is a brand-mark seal.
  - Web design is a browser window.
  - Development is the code brackets `</>`.
  - The process shape evolves: a sound ring (listening), then a grid (planning), then a wireframe (visualising), then a cube (building), then a rocket (delivery).
- **The bust reference** was a stock "wireframe head" image.
  - Dots sit on mesh vertices, with stipple along the edge loops.
  - Contour rings run across the skull.
  - Dots are densest at the eyes, nose and lips.
  - The head faces front.
  - It is a **style reference only**: watermarked stock, never committed or shipped. Ask the owner to re-share it at the start of Phase 4.
  - It needs a head mesh with quad topology. Scans are triangle soup and read as noise.
- **Stats:** show three: 5+ years experience, 500+ projects done, 140 happy clients. The owner dropped a fourth ("96").
- **Voice:** first person "I" throughout. Change only pronouns and typos in the owner's copy.
- **Let's connect:** `mailto:criztiandev@gmail.com`, a constant in `src/data`.
- **No invented content.** Testimonials and blog posts have no real material yet, so they get visible placeholders ("Client quote to come", "Post to come"). This follows PRODUCT.md.
- **Content is hard-coded for now.** New sections live in `src/data/*.data.ts`, with types in `src/types/`.
  - The hero, quote, projects and theme keep rendering from `SiteContent`, and the editor keeps working.
  - Leave the site-content schema and the editor alone.

### The owner's copy

Typos are fixed and the voice is switched to "I". Use it as written.

- **My services**
  - **Branding.** "I craft impactful brand stories that connect with your audience and build long-term trust. Through strategic thinking and visual storytelling, your brand gains clarity, consistency and character."
    - Items: Visual content strategy · Research and testing · Competitive analysis · UI/UX strategy · Key messaging · Content strategy
  - **Web design.** "My design approach blends creativity with functionality, with no AI slop. Every layout, interaction and element is thoughtfully created to deliver seamless user experiences that reflect your brand identity."
    - Items: Responsive design · Wireframing and prototyping · Design systems and guidelines · Accessibility compliance · Motion and interaction design · Conversion-focused layout
  - **Development.** "From static sites to full CMS solutions, I develop high-performance, scalable websites tailored to your business needs, ensuring fast loading speeds, security and flexibility."
    - Items: Web development · SEO-friendly structure · CMS and dynamic content · Custom code extensions · Performance optimization · API integration
- **Who am I**
  - "I am Criztian."
  - "I specialize in crafting custom web solutions, including branding, web design and development tailored to meet your business."
  - Stats: 5+ years experience · 500+ projects done · 140 happy clients.
- **Featured projects:** "Showcasing my most impactful work."
- **How I work**
  1. **Listening to your vision.** "I begin by discussing your goals, audience and expectations to ensure my approach aligns perfectly with your vision."
  2. **Planning with purpose.** "I analyze trends, competitors and opportunities to craft a strategic roadmap tailored to your needs."
  3. **Visualizing your ideas.** "Creative concepts come to life as I design user-friendly and visually appealing solutions."
  4. **Bringing it to life.** "Using cutting-edge technologies, I develop and implement your project with precision and care."
  5. **Delivering success.** "After a seamless launch, I provide ongoing support and optimization to ensure long-term success."
- **Let's connect:** "Email me".
- **Testimonials:** "Testimonials that inspire confidence".
- **FAQ**
  1. **What is included in your branding services?** "My branding services include logo design, visual identity development, color palette selection, typography guidance and brand messaging to create a cohesive and impactful identity for your business."
  2. **How long does it take to complete a branding project?** "The timeline varies depending on the scope, but a typical branding project takes 4–6 weeks from initial consultation to final delivery."
  3. **Do you offer mobile-friendly designs?** "Yes. All my web designs are fully responsive and optimized for desktops, tablets and mobile devices to ensure a seamless user experience."
  4. **Can you redesign an existing website?** "Absolutely. I can revamp your current website to improve its functionality, aesthetics and performance while retaining key elements of your brand."
  5. **Do you provide custom development solutions?** "Yes. I specialize in creating custom web solutions tailored to your specific business needs, including e-commerce platforms, CMS integrations and more."
  6. **Will I be able to update the website on my own?** "Yes. I build websites on user-friendly platforms like Webflow or WordPress, so you can manage and update your site without technical expertise."
  7. **How do you approach digital marketing campaigns?** "I start with a deep understanding of your audience and goals, then craft data-driven strategies that include SEO, social media marketing and email campaigns."
  8. **What are the payment methods and plans for a project?** "I accept multiple payment methods, mostly PayPal, and can set up flexible payment plans based on the project's scale."
  9. **Do you offer discounts for long-term collaboration?** "Yes. I offer preferential pricing for clients in long-term collaborations. Contact me for details."
- **Blog:** "Stay ahead with the latest in digital marketing".
- **Get in touch:** "Let's start your project today".
  - Fields: name, email, service needed, and "What can I help you with?"

## The architecture this needs

### Why the engine changes first

Today's canvas is document-sized. It scrolls with the page and slides a window (`resolveCanvasWindowTop`) once `#project` is on screen. That keeps shapes glued to the document (the name, the card frames) free of wobble.

It cannot hold a shape in view. A shape in a sticky slot would jitter by the scroll delta on every frame of a fling, because its position would be re-read from `scrollY` on the main thread while the compositor scrolls the canvas.

The framing rule needs shapes held in view, so the model is inverted:

- **One `position: fixed` canvas the size of the viewport, behind everything.**
- **Every formed shape lives in a pinned (sticky) slot.**
  - A fixed canvas and a stuck element are both composited against the viewport.
  - A formed shape therefore has no dependence on `scrollY`, and neither lag nor wobble.
- **Between scenes the dots are in flight** on an eased, scroll-scrubbed position. There a one-frame lag is invisible, which is the same argument the scroll morph already relies on.
- **Nothing is ever clipped at a section edge**, because the canvas is the viewport.

### Canvas and stacking

- **Canvas classes:** `Hero` still renders the one canvas: `fixed top-0 left-0 w-full h-lvh -z-10`.
  - Size it from `lvh` once, so the mobile toolbar collapsing never resizes the backing store.
- **Stage attributes:** `isolate`, the named group `group/stage`, `data-status` and `data-scene` move to **SitePage's wrapper**.
  - The hook finds the stage with `canvas.closest("[data-status]")`, so SitePage stays a server component.
  - React never rewrites the attributes the hook sets, because their props don't change. This is the same as today's stage.
- **`Hero`'s root must not form a stacking context.** That means no `isolate`, no `z-index`, and no `transform`, `opacity` or `filter` animation.
  - The canvas's `-z-10` must resolve inside SitePage's wrapper, or the canvas paints over every later section.
  - `position: sticky` always creates a stacking context, so **the canvas must never be inside a sticky element** (for example `#home`).
- **Overscroll:** add `html { overscroll-behavior-y: none }`. Rubber-band overscroll on Safari and Chrome for macOS moves sticky DOM but not the fixed canvas, which would split the hero and footer names from their frames.
- **The canvas is opaque** (`alpha: false`, clears to black), so sections stay transparent. The mobile step blocks are the one deliberate exception (contract rule 8).
- **What this deletes:** the sliding window (`resolveCanvasWindowTop`, `uWindowTop`, the transform), the stage-height coupling, and the 1.5-viewport backing store.
  - The pixel ratio improves where `MAX_CANVAS_PIXELS` used to cap it: a 16" laptop goes from 1.75 to 2, and 1920×1080@2 goes from 1.5 to 2.

### Timeline

The timeline is pure and unit-tested, in `dot-field.rules.ts`.

- **What it reads:**
  - `[data-dot-scene]` containers.
  - An optional `data-dot-shapes="branding web-design development"` for multi-step scenes.
  - One `[data-dot-slot]` inside each scene's sticky frame. Dust scenes have no slot.
- **Pinned slot rect:** `x = slotRect.left`, `y = slotRect.top − frameRect.top + stickyTop`. It is correct whether or not the frame is stuck right now, because the slot moves with its frame.
- **Pin range:** `[containerDocTop − stickyTop, containerDocBottom − frameHeight − stickyTop]`, where `containerDocTop = containerRect.top + scrollY`.
  - This is only true under contract rules 1–2. A stuck frame's normal-flow position cannot be recovered, because both `getBoundingClientRect` and `offsetTop` include the sticky offset.
- **`stickyTop`:** a constant in `hero.data.ts`. It is 0 for the hero and 72 (the fixed header) for every other scene.
  - Every scene container's `scroll-margin-top` equals it, so an anchor jump lands exactly at pin start.
  - Today's `scroll-mt-20` (80px) would land 8px short, with `data-scene` reading `moving`.
- **Multi-step scenes:** split the pin range **equally** by step count. Never measure step rects: stuck rects lie.
- **Dust scenes:** anchored to the viewport, spanning the container's document range. They need no pin.
- **Transits:**
  - A transit fills the gap between one keyframe's range and the next.
  - It ends 1px before the next pin (`MORPH_LANDING_TOLERANCE_PX`). Fractional `svh` otherwise leaves `t` at 0.9999, the old `/#quote` bug.
- **One global position `p`** (segment index + `t`) is smoothed, and the from/to pair is derived from `p`.
  - Smoothing `t` while the pair switches makes dots jump.
  - `p` snaps when the target is more than one segment away, so a nav jump doesn't flash through every shape.
  - Generalise "deep link settles the intro" (today `morphTarget > 0`) to `p > 0`.
- **Heights:** never read `window.innerHeight` in the timeline. Take heights from svh-sized DOM rects.

### Shapes and buffers

- **The name stays on attribute 0, exactly as today.** Its lattice is exact and `uWordOrigin` is rounded to whole device pixels. The hero at rest must stay pixel-identical.
- **`aFrom` and `aTo`** (vec4) carry model `xyz` in [-1,1]³ and `w`, a seeded rank.
  - They are refilled with `bufferSubData` only when the segment changes, which is today's `cubeBuffer` path.
  - Don't use a float texture: it would add `texelFetch`, `gl_VertexID` index maths, a 2048-wide row limit and the NEAREST-filter trap for no gain.
- **Generation:**
  - Each shape is generated once, at a fixed `SHAPE_POINTS` count, by a seeded pure generator.
  - Points at or past `SHAPE_POINTS` are hidden.
  - Nothing is regenerated when the name is resampled.
- **Padding:**
  - The name is padded to `N = max(nameCount, SHAPE_POINTS)` by repeating point `i % nameCount`, flagged hidden.
  - Offsets are padded to `N` too.
  - Unpadded buffers either fail WebGL's range check or stack dots at `uWordOrigin`.
- **A keyframe's transform:** centre, half-size (vec2, so a frame shape can be non-uniform), rotation `mat3`, a perspective flag, a spin rate, and `uVisible`.
  - `uVisible` is a rank threshold derived from the slot's area. It keeps a small phone slot from packing thousands of 3px dots into a blob.
  - Depth light is generalised from the cube's `0.288675` (1/(2√3), a unit cube's radius) to a per-shape radius.
- **Vertex shader:** mixes from → to with today's staggered sweep, arc and easing. The spring offsets are still added **after** the mix, so one spring drives every shape.
- **Pointer:**
  - It pushes only while a shape is formed.
  - `projectCubePoints` becomes a generic `projectShapePoints` that uses the shader's exact maths.
  - The push radius comes from the slot's size, as the cube's does from `cubeSide × cubeInkRatio` today.

### Loop, motion and status

- **Sleep:** the loop sleeps when every dot is at rest, `p` is a whole number, the formed shape has no spin, and no pointer is active.
- **Observers:**
  - The IntersectionObserver goes, because a fixed canvas always intersects. `visibilitychange` stays.
  - One ResizeObserver watches the stage. The projects MutationObserver goes.
- **Static drawing:** `isStatic = reducedMotion || paused`, so Phase 6's pause toggle reuses the path.
  - When static, draw only when the keyframe for the current scroll position changes.
  - Draw a keyframe only while `scrollY` is inside its pin range, and clear the canvas otherwise. A shape drawn at its pinned rect while its section scrolls away would hang over the next section's copy.
- **Status attributes:**
  - The stage carries `data-status` (`idle`, `running` or `unsupported`) and `data-scene`, which is the formed keyframe's id or `moving`.
  - `data-scene` replaces `data-morph` and `data-burst`.
  - The canvas keeps `data-point-count`.
- **Strict counts:** exactly one `<canvas>`, one `[data-status]` and one `<h1>` on the page.
- **No WebGL2:** the text `<h1>` fallback, and the canvas stays hidden.

### Kept invariants

These still hold, and CLAUDE.md explains each one:

- **Two effects in `use-dot-field.hook.ts`** plus the tiny colour effect; never merge them.
- **The font gate:** `document.fonts.load()` then `check()`, on the primary family only.
- **Raw WebGL2:** no three.js, react-three-fiber or ogl.
- **Tuning:** every tuning number lives in `src/data/hero.data.ts`.
- **Accessibility:** `aria-hidden` goes on the canvas only.
- **No `useState` in the hook.**
- **Blending:** source-over, with dimness expressed as opacity.

## The DOM contract

Every section that takes part in the timeline follows these rules. The engine trusts them, and a dev-only assert checks rules 1–3.

1. **The container.** A scene is a `[data-dot-scene="<id>"]` container with an `id` anchor and `scroll-margin-top` equal to its `stickyTop`. It has **no padding**.
2. **The frame.** The container's **first child** is the sticky frame, with no margins:
   - Scenes: `sticky top-18 h-[calc(100svh-4.5rem)] self-start`.
   - The hero: `top-0 h-svh`.
3. **The slot.** The frame holds exactly one `[data-dot-slot]`. Dust scenes hold none.
4. **No animated ancestors.** Nothing animates `transform`, `opacity` or `filter` on:
   - the container
   - the frame
   - any ancestor of a slot
   - any ancestor of the canvas

   `getBoundingClientRect` includes transforms, and these properties also create stacking contexts. Motion reveals (`LIFT_VARIANTS`, `QUOTE_REVEAL_VARIANTS`) go on inner text only.

5. **Overflow.** Ancestors of sticky elements use `overflow: visible` or `clip` only. `hidden`, `auto` and `overflow-x-hidden` silently stop the pin.
6. **Named groups only.** Tailwind groups are named (`group/stage`). An unnamed `group` on the page wrapper would make every unnamed `group-*` react to the whole page.
7. **Coverage.** Every section belongs to a scene; dust counts. No transit may stretch across unassigned sections as a half-formed smear.
8. **The mobile band.** In the portrait layout, the slot is a band just below the header at `top-18`, and the step blocks are `sticky` directly below the band on an opaque ground, so copy never enters the band. Conditions:
   - The step list ends where the container ends, or the last step unsticks into the band.
   - Each step's height is at most `svh − band − 72`.
   - Choose the layout by height as well as width, with the custom variants in `globals.css`, never `md:`:
     - `split` is `(min-width: 48rem), (max-height: 30rem) and (min-width: 34rem)`. A 740×360 landscape phone is split; 320×256 (400% zoom) is portrait.
     - `short` is `(max-height: 30rem), (width < 48rem) and (max-height: 38rem)`. It tightens the step type and the band, so small phones (375×548, 360×560) stay pinned.
   - No links inside steps. A covered link could still take focus (WCAG 2.4.11).
   - `StepScene` implements this. Its maths: the frame and the list share one grid cell, the list starts `--band` below the top, each step is `F − band` tall, and step `k` sticks at `k·(F − band)`. The last step unsticks together with the frame. Split uses the same pitch with `F`-tall steps in the second column.
9. **In-scene anchors.** Every `id` inside a scene has `scroll-margin-top` equal to that scene's `stickyTop` (`scroll-mt-18`). A larger margin lands before the pin starts. `data-scene` then reads `moving`, and if a spinning shape is the outgoing one, the loop never sleeps.
10. **Dust scene endings.** The last section of a dust scene is at least one frame tall (`min-h-[calc(100svh_-_4.5rem)]`). Otherwise its anchor lands in the transit to the next scene, with a half-formed shape over it. `#contact` needed this.
11. **Reveals on pinned elements.** A pinned element never moves, so a `whileInView` margin must already hold at its pinned position. The projects heading sat at 65% of a phone screen behind a −40% margin and never revealed; it is now −10%.
12. **Frames that can grow, grow.** A single-frame scene (Quote, About, footer) and a split step use `min-h-[…]`, never a fixed `h-[…]`, and so does its container. Zoom or WCAG text spacing then lengthens the pin instead of clipping or overlapping the copy. The engine re-reads frame and container heights on every measure.
13. **The fit gate.** A portrait band step cannot grow: it is sticky, and a taller step is covered by the next one. So `StepScene` renders `SceneFitGate` (a hidden `<span>`) as its **last** child. The frame stays first. How it works:
    - It checks every `[data-fit-box]` step.
    - If one overflows, it sets `data-fit="flow"` on the container, removes `data-dot-slot` from the slot and sets `data-dot-shapes="dust"`. The engine re-reads both attributes on its next measure, so the scene becomes a plain dust scene. It never sees a hidden 0×0 slot.
    - When everything fits again, it restores both attributes.
    - The check runs in `requestAnimationFrame`, scheduled by a ResizeObserver and by `document.fonts.ready`. It never mutates layout inside the observer callback, because that raises ResizeObserver loop errors, which the e2e specs count as page errors.
    - The `unpinned` variant styles flow mode and the no-WebGL path with one class list.
    - Any new sticky, fixed-height copy box must join the gate or follow rule 12.

In-page anchor clicks snap the timeline to the destination scene (`onAnchorClick` in the hook). A smooth nav scroll therefore does not flash through every shape on the way. The snap is cleared on arrival, `scrollend`, wheel, touch or a key press.

## Phases

Each phase is meant to be one conversation. Update **Current phase** at the top and add a short "done" note under the phase before handing over.

### Phase 1: the engine (done, 2026-09-28)

**Goal:** the architecture above, running on today's page.

**Scope:**

- **Hero and quote:**
  - Pin the hero: a `110svh` container with `#home` sticky, so the name and tagline stay together until today's 10% morph start.
  - Pin the quote.
  - Both keep their current look.
- **Projects:** `#project` becomes a pinned scene whose slot holds a placeholder stippled sphere. Its cards scroll in the copy column. The frames and burst are gone; the real deck is Phase 5.
- **Dust:** the About, Services and Blog placeholders plus `#contact` form one dust scene.
- **Footer:** add a minimal footer scene where the name re-forms under a second transform.
- **Delete:**
  - burst, sparks, dust rect, claims and the frames uniforms
  - `aScene`, `resolveSceneTargets`, `resolveClaimTarget`, `resolveFrameShare`, `resolveCanvasWindowTop`
  - the IntersectionObserver and MutationObserver
  - their unit tests
- **Rewrite:**
  - `src/types/hero.type.ts`
  - the renderer, both shaders, the hook and the rules
  - `tests/unit/hero.test.tsx` (the stage is now SitePage's wrapper)
  - the `data-morph`/`data-burst` assertions and the `#quote > div` selectors in `tests/e2e/hero.spec.ts`

**Files:**

- `src/features/portfolio/hooks/use-dot-field.hook.ts` (1194 lines)
- `src/features/portfolio/dot-field.rules.ts` (763)
- `src/features/portfolio/services/dot-field-renderer.service.ts` (439)
- `src/features/portfolio/shaders/*.ts`
- `src/data/hero.data.ts`
- `src/types/hero.type.ts`
- `site-page.component.tsx`, `hero.component.tsx`, `quote-section.component.tsx`, `projects-section.component.tsx`
- `src/app/globals.css`
- `tests/unit/dot-field-rules.test.ts` (1046)
- `tests/unit/hero.test.tsx`
- `tests/e2e/hero.spec.ts`

**Acceptance:**

- **Pixel identity:** a zero-pixel diff of the hero at rest and of the reduced-motion hero, at 1440×900 with DPR 1 and 2, against `0a3c97a` built in a throwaway worktree. Compare against the baseline, not the previous phase, so drift can't accumulate.
- **Deep link:** `/#quote` gives `data-scene="cube"`.
- **Scene sequence:** scrolling the whole page steps `data-scene` through `name → moving → cube → … → footer`, with no console or GL errors.
- **No clipping:** screenshots mid-transit at 390, 820 and 1440 wide show nothing clipped.
- **Idle cost:** RAF measured at 0 fps at rest in the dust scene.
- **Reduced motion:** each keyframe draws only inside its pin range.
- **Unit tests** for the pin range, slot rect, equal step split, landing tolerance, the `p` → segment mapping and snap, `projectShapePoints` against the shader's maths, and name padding.
- **Real phones:** the owner flings through the page on a real phone. Screenshots cannot show jitter.

**Done note.** Everything above is met except two items, both still open:

- **The real-phone fling test.** The owner has to do it.
- **The e2e specs that need Supabase** (contact, editor, dashboard). Docker Desktop was not running, so only `hero.spec.ts` ran.

Evidence:

- **Checks:** `pnpm typecheck`, `pnpm lint` and the Prettier check are clean. 241 unit tests pass. `hero.spec.ts` passes 15/15 against a production build on :3100. The spec now includes lit-pixel checks on the cube slot, the canvas opacity, a nav jump that must skip the cube and projects, and `/#contact` landing on dust.
- **Pixel diff against `0a3c97a`:**
  - DPR 2 is a zero-pixel diff for the hero at rest and for the reduced-motion hero.
  - DPR 1 differs in 12 pixels, by at most 6/255, all inside a 7×7 box at (796–802, 849–855). That is the scroll cue's arrow SVG. `#home` is now sticky, so that SVG rasterises slightly differently. The dots are identical.
- **Scenes and idle cost:** the full `data-scene` sequence (name, moving, cube, moving, project, moving, dust, moving, footer) was checked at 390, 740×360, 820 and 1440. At rest the loop runs 0 RAF calls per 2s in the hero and in dust, and 120 per 2s with the cube spinning.
- **Adversarial review:** 12 findings confirmed and all fixed:
  - the sphere's depth light (now a per-shape `depthRadius`)
  - dust filling only svh of the lvh canvas
  - `#about` landing 8px short (rule 9)
  - nav jumps flashing through shapes (the snap above)
  - a reduced-motion toggle freezing displaced dots
  - the canvas clear colour (it now clears to the theme's page background)
  - the mobile projects sphere being covered, and its CTA being focusable under the card list
  - frames overflowing short viewports (height media queries)
  - tests that could not see an invisible canvas

Tuning points found by eye, left for later phases:

- **The hero tagline scrolls up through the dissolving name.** The name now dissolves in place, held in view. In the Phase 2 hero pass, fade the tagline and cue as the hero unpins, or tune `morphStagger`.
- **Mid-transit dots cross outgoing copy**, for example the quote text on the way to Projects. This is inherent to held-in-view transits; tune in Phase 6.
- **Mobile Projects is a placeholder.** The black card list rises over the pinned frame like a curtain. The sphere shows first, and the "Let's talk" button is hidden below `md`. Phase 5 replaces it.
- **Hard-coded white text on a theme-coloured ground.** The hero, quote, projects and footer still hard-code `text-white` / `white/xx`, while the canvas now clears to the theme's page background. A light theme would put white text on light. Fold this into Phase 2's token pass.

### Phase 2: page structure, content and system (done, 2026-09-28)

**Scope:**

- **Sections:**
  - Build every section in the final order with the copy above.
  - Use on-system layouts, with the impeccable skill for the design pass.
  - Leave empty slots that follow the contract. The timeline picks them up with no engine edits.
- **Nav:**
  - Centre links: Services · About · Work (`#project`) · Process · Blog, plus "Let's talk" to `#contact`.
  - The mobile panel lists every anchor.
  - `PortfolioSection` keeps `about` and `contact` for the tests.
- **Footer:** the name slot, nav, email and ©. The footer name is decorative or a `<p>`, never a second `<h1>`.
- **FAQ:** native `<details>/<summary>`. It needs no JavaScript and still opens in the editor preview, whose `pointer-events` block does not cover `summary`.
- **Contact service field:** a native `<select>` for the service needed (Branding / Web design / Development / Something else). It touches:
  - `contact.schema.ts`, `contact.form.tsx` and the insert in `contact.service.ts`
  - a migration adding a column and check constraint, then `pnpm db:types`
  - the email template
  - the fixtures in `contact-schema.test.ts`, `contact-notification.test.ts` and `email-preview.test.ts`, and `contact.spec.ts`

  Never weaken the anti-spam checks.

- **Token drift:** set `--radius: 0`, point `--font-heading` at the display face, and stop the public wrapper following the OS scheme (DESIGN.md "Known drift").
- **Delete:**
  - `PLACEHOLDER_SECTIONS`
  - `openMobileNav`
  - the unused `ContactMessageRow` and `ContactMessageInsert`
  - `fontMono`
  - three copies of `resolveTransition`, replaced by one helper
- **Docs:** update the PRODUCT.md and DESIGN.md sections the new content changes. The services and positioning now follow the owner's copy, not PRODUCT.md's old four services.

**Acceptance:**

- **Sizes:** check 360×640, 740×360, 820 and 1440 with the longest copy.
- **Anchors:** a smoke test that every anchor resolves.
- **Contact:** the contact e2e submits with a service.
- **Strict counts:** still one canvas, one `[data-status]` and one `<h1>`.

**Done note (2026-09-28).** Everything in scope is built. Three items are still open:

- **Database steps.** Docker was down, so the migration is written but not applied, and `database.type.ts` is hand-edited. See "Open owner decisions".
- **The contact, editor and dashboard e2e specs** have not run, because they need Supabase.
- **The hero pixel diff against `0a3c97a`** was not re-run. It is the first check of Phase 3. Phase 2 changed only token classes (same computed colours) and added fade wrappers held at opacity 1 at rest.

What shipped:

- **Sections.** Every section is built, in the final order, with the owner's copy verbatim.
  - My services and How I work are `StepScene`s.
  - Who am I is a pinned split with the stats as a `<dl>`.
  - Let's connect, Testimonials, FAQ, Blog and Get in touch share one dust scene.
  - The footer has the name slot, nav, email and ©.
  - Services, About and Process hold the placeholder `sphere` until Phases 3–4. `parseSceneShapes` silently skips unknown ids, so each shape is swapped by changing one constant in `src/data/page-sections.data.ts`.
- **Nav and forms.**
  - Five centre links plus "Let's talk", moved to `lg`, because the links need about 845px. The mobile panel lists all ten anchors and scrolls when it is taller than the viewport.
  - A required native "Service needed" select, with monochrome errors (glyph plus `role="alert"`, and `--destructive` set to the foreground on the stage).
- **Token pass.**
  - `--radius: 0`, `--font-heading` pointing at Antonio, and no hard-coded white or black on the public page.
  - The stage carries `dark` and `scheme-dark`, and `html:has([data-status])` keeps the root scrollbar dark.
  - `--input` is set to `--border`, so field outlines pass 3:1.
- **Hero.** The tagline and cue fade as the hero unpins, which was the Phase 1 tuning point. They stay at opacity 1 without WebGL2.
- **Height-aware layout and the fit gate** (rules 8, 12 and 13): the `split`, `short` and `unpinned` variants, `min-h` frames, and `SceneFitGate`.
  - The gate scroll-anchors its own flips, so a deep link below a flipping scene lands.
  - `html:has([data-status="idle"]) { scroll-behavior: auto }` keeps the page-load hash jump instant, because a smooth load scroll can't be redirected after the gate flips.
- **Deletions:**
  - `PLACEHOLDER_SECTIONS`
  - `openMobileNav`
  - the unused contact row and insert types
  - `fontMono`
  - three `resolveTransition` copies, now `resolveMotionTransition` in `motion.rules.ts`

Evidence:

- **Checks:** `pnpm typecheck` and `pnpm lint` are clean, and 271 unit tests pass. The Prettier check warns only on `.impeccable/hook.cache.json`, which is an open owner decision.
- **e2e:** `hero.spec.ts`, `anchors.spec.ts` and `fit.spec.ts` pass 36/36 against a production build on :3100.
- **Measurement:** measured at 13 sizes, plus the WCAG 1.4.12 stylesheet at three of them, using the list in "Landmines". The result is 0 never-visible lines, 0 text overlaps, 0 clipped text, no horizontal overflow and no errors. The required phone sizes stay pinned with at least 27.8px spare. 400% zoom and text spacing flow.
- **Reviews:**
  - A five-lens adversarial review (contract, a11y, conventions, fidelity, data), with every finding verified by a skeptic: 14 confirmed (4 major), all fixed.
  - The impeccable finish review: recapture, then fix (the project count sat above the heading; it now sits below the lede), then ship. The ship covers that fix and the reviewed captures.
  - Captures are in `.impeccable/review/`, which is not committed.

### Phase 3: shapes, dot choreography and section motion

**The owner's direction (2026-09-28, after seeing Phase 2).** The layout is right, but the page feels static.

- The dot transitions must feel "wow and professional".
- Every section needs its own motion, sliding and award-level transitions, so the page feels alive.
- The dots stay the main show. Section motion supports them and never competes with them.
- Section motion moves here from Phase 6, so this phase is where the page comes alive.

**Splitting.** If this is too big for one conversation, split it at the part boundary:

- 3A: parts 1 and 2 (the dots)
- 3B: part 3 (the sections)

Ask the owner to confirm the motion choices below before building part 3. They are a proposal, not a sign-off.

#### Part 1: the shape library

- **Generators:** seeded, pure line-art generators that stipple along paths, like `generateCubePoints` along the cube's edges: the three service shapes and the five process shapes.
- **Swap:** change the scene shape constants in `src/data/page-sections.data.ts` (`services` → `branding web-design development`, `process` → its five ids) and add the ids to `DOT_SHAPE_IDS`. An id the engine doesn't know is silently skipped (see the Phase 2 note).
- **Tuning:** every number goes in `hero.data.ts`.
- **Acceptance:** reduced-motion screenshots show each shape formed in its own slot at 390, 820 and 1440 wide.

#### Part 2: dot choreography

Make every morph an event, not a slide from one slot to the next.

- **Draw-on formation.** Each line-art generator ranks its points by arc length along the stroke (`w` = path order plus a little jitter). The arrival stagger uses that rank, so a shape draws itself like a pen:
  - the seal traces its ring
  - the browser draws its frame, then its bar
  - the brackets write left to right

  Departure keeps today's left-to-right dissolve.

- **Burst and gather.** Mid-flight, add a seeded curl-noise displacement that peaks at `t = 0.5` and is zero at both ends. The dots loosen into a drifting cloud between shapes instead of sliding on clean arcs. Bound it so no dot leaves the viewport.
- **Depth swell.** Dots lift toward the camera mid-flight: size and brightness rise a little. Dimness stays opacity, never MAX blending.
- **Arrival strike.** On landing, a brief brightness flash that decays over about 300ms, like a lamp striking. Also give a small spring impulse through `stepDotPhysics`, so a formed shape settles with the same bounce as the pointer scatter.
- **Direction-aware sweep:** the dissolve direction follows the scroll direction.
- **Copy crossings** (the Phase 1 tuning point): transit dots must not cross the incoming or outgoing copy column at full brightness. Either dim dots over text boxes or bias the arcs toward the slot side.
- **Step and shape sync.** With the equal pin split, each shape is still fully formed at the scroll where its copy is aligned. But for Process's five steps, the first and last shape handovers land about 0.14 of a step (about 116px at 1440×900) away from the copy handovers. Decide before wiring the five shapes: accept that skew, or change the split:
  - put multi-step boundaries at `start + (k + 0.5)·pin/(n − 1)`
  - make the first and last intervals half length

  The change matches the copy pitch in both layouts and still measures no step rects. If you make it, update the rules tests.

- **Transits hidden behind opaque steps.** On portrait phones, the services → about transit runs entirely behind the last services step, which is opaque by design (rule 8), so the flight is invisible there. Choreograph around it: start the transit as the last step unsticks, or route the flight through the band.
- **Engine follow-ups from the Phase 2 fit work** (the engine was off-limits then):
  - `resolveViewportHeight` takes the tallest `frameHeight + stickyTop`. A frame that grows past `F` (text spacing, 400% zoom) therefore shifts dust boundaries, and `data-scene` reads `moving` early near them. The text stays readable.
  - Split steps that grow at short landscapes (740×304, 740×280) stretch the pin, so copy and shape drift apart in the tallest steps.
- **Invariants:** every number lives in `hero.data.ts`. Reduced motion is unchanged: no flight, and still shapes only inside pin ranges. The loop still sleeps at rest.
- **Acceptance:**
  - frame captures of name → cube → each service → about → each process step, at 1440 and 390
  - RAF at 0 fps at rest
  - no transit frame over 16ms on a mid-range Android (Phase 4's measuring method)

#### Part 3: section motion

One motion grammar, authored once, in the signal-board world: things power on like lamps, lines draw like wire, and copy wipes in like the quote. No per-section novelty.

- **Headline power-on.** Every section `<h2>` lights up the way the wordmark does. It starts at the 14% ghost, and a feathered sweep (26px feather, `SIGNAL_EASE`, about 0.9s) lights it left to right as it enters.
  - Use a CSS mask on the heading itself. Don't split it into letters, so screen readers still read it whole.
- **Copy slides in.** Paragraphs rise line by line from behind a clip (100% up), staggered 60–80ms.
- **Hairlines draw** left to right, staggered: the service items, the stats rule, the FAQ rows, the testimonial and blog rules. Use scaleX from the left on a dedicated rule element or a pseudo-element.
- **Step handovers** (Services, Process). The outgoing step's copy wipes out and the incoming one wipes in at the same scroll position as the shape morph, so copy and dots change together. In the portrait band, the incoming sticky step's content slides up 24px and wipes in as it docks.
- **About:** the stats count up (0 → 5+, 500+, 140) once the scene pins. Give the number a fixed width so the row doesn't jitter.
- **Let's connect:** the heading powers on, then the "Email me" action wipes in. The address flickers on character by character, like a departure board.
- **FAQ:** answers open with an eased height where supported (`interpolate-size: allow-keywords` or a `::details-content` transition) and snap elsewhere. The plus turns into a cross.
- **Testimonial and blog placeholders:** the plates wipe open from the bottom (`clip-path` inset), staggered.
- **Reading sections:** scroll-linked parallax on the inner columns. The heading column and the content column drift at slightly different rates, 40px at most, so the reading sections feel layered over the dust.
- **Nav:** a single lit dot slides under the active centre link as the page scrolls (scroll-spy). The only round thing on the site is a dot.
- **Footer:** the bar's links power on in a stagger while the name re-forms.
- **Constraints** (the DOM contract still binds):
  - Animate inner elements only: never a scene container, a frame, an ancestor of a slot, or an ancestor of the canvas (rule 4).
  - Animate `transform`, `clip-path`, `mask` and `opacity` only.
  - Motion lives in small client leaf components, so the sections stay server components.
  - Under `useReducedMotion()`, every effect renders its final state (`INSTANT_TRANSITION`).
  - Content must be visible without JavaScript. Reveals arm only after hydration, never from a server-rendered hidden state, and text is never opacity-hidden from assistive tech.
  - Reveals play once.
  - A `whileInView` margin must already hold at the element's pinned position (rule 11).
- **Tuning:** every duration, stagger and feather goes in a new `src/data/motion.data.ts`. Use the impeccable skill's `animate` reference for the pass.
- **Acceptance:**
  - screen recordings of a full scroll at 1440 and 390
  - reduced-motion screenshots identical to the Phase 2 layout
  - a no-JavaScript render shows all copy
  - the hero at rest still pixel-identical to `0a3c97a`
  - CLS 0, and e2e green

### Phase 4: the bust (Who am I)

- **Reference:** ask the owner to re-share the reference image.
- **Mesh:** source a **CC0** quad-topology head-and-shoulders mesh. MakeHuman and MPFB exports are CC0. The owner approves it against the reference.
- **Bake:** `scripts/bake-bust.mjs` samples the vertices plus stipple along the edges, normalises to [-1,1]³ and quantises to Int16, writing `public/shapes/bust.bin`.
- **Runtime:**
  - Fetch the file lazily after the first draw. A procedural latitude/longitude head stands in until it loads.
  - A slow yaw oscillation.
- **Performance:** measure physics, projection and uploads while pushing the bust on a mid-range Android. Phones jump from about 1.5k name points to `SHAPE_POINTS`.
- **Motion:** the bust forms with Phase 3's choreography. Its draw-on rank follows the edge loops from the face outward.

### Phase 5: the Featured Projects deck

- **The deck:** a pinned deck where the active project swaps by scroll inside one plate slot.
- **Dot frame:** the dots frame the plate as a `frame` shape: the rect's perimeter, with a non-uniform scale.
- **Accessibility:** cards stay in DOM order for screen readers. Under reduced motion, or without JavaScript, the deck is a plain list.
- **Reuse:** keep `projects.rules.ts` (https-only links and images, visible-project selection).
- **Motion:** the active project swaps with Phase 3's wipe grammar, and the frame's dots draw around the plate in path order.

### Phase 6: polish and proof

- **Motion polish:** tune what Phase 3 authored, on real devices. The heading reveals, the stat count-up and the FAQ easing moved to Phase 3.
- **Checks:**
  - mobile tuning
  - the editor-preview check (its iframe is about 686px wide, so "Desktop" shows the mobile layout)
  - performance
  - accessibility
- **Owner decision:** a square "Pause motion" toggle for WCAG 2.2.2, because the cube and the bust spin endlessly. It uses the `isStatic` path.
- **Docs:** the final rewrite of DESIGN.md, the CLAUDE.md "Hero dot field" block, and the README.

## Landmines still live

These are the ones CLAUDE.md doesn't already cover:

- **e2e without touching the dev server:**
  1. Build with `pnpm build`. It can run beside `pnpm dev`, because Next 16 writes dev output to `.next/dev`.
  2. Serve it with `pnpm exec next start -p 3100`.
  3. Point a throwaway Playwright config at it: an absolute `testDir` of `tests/e2e`, a `baseURL` of `http://localhost:3100`, and no `webServer`.

  Delete `.next/cache/fetch-cache` before the build, or it replays a stale published document.

- **Diff visual regressions; don't eyeball them.** Capture the canvas with `getImageData` in a throwaway Playwright script, before and after. That is how two sub-pixel regressions were caught that screenshots hid.
- **PowerShell 5.1 splits `git commit -m` at quotes** (the apostrophe in "Let's"). Write the message to a file and use `git commit -F <file>`.
- **`Set-Content -Encoding utf8` writes a BOM** in Windows PowerShell 5.1. Use the Write and Edit tools.
- **`UID` is read-only in bash.** A `UID=$(...)` capture fails silently.
- **TypeScript loses narrowing** of a captured `const` inside a hoisted `function` declaration. After the null guard, use an explicitly typed alias (`const container: HTMLElement = containerElement`). The hook already does this throughout; don't "clean it up".
- **`motion/react` ships no `"use client"`.** Import it only from client components; `src/providers/motion.provider.tsx` carries the directive.
- **`aria-hidden` on a wrapper hides everything inside it.** It once hid the `<h1>`. Keep it on the canvas alone.
- **`pnpm check` fails on `.impeccable/hook.cache.json`,** a design-plugin cache. Adding `.impeccable/` to `.prettierignore` fixes it; the owner hasn't asked for that yet.
- **The local Supabase may have no users.** `auth.users` was empty on 2026-09-20. Logged-in specs create their own throwaway user; never ask for the owner's password.
- **Turbopack flags one build warning:** `path.join(process.cwd(), …)` in `email-preview.adapter.ts`. It is harmless locally; fix it before deploying.
- **Capture in full Chromium, not the headless shell.** Playwright's default `chromium-headless-shell` (SwiftShader) paints alpha-0 holes wherever an opaque sticky step overlaps the fixed canvas inside the isolated stage, so they look like white blocks. Use `channel: "chromium"` for screenshots and pixel checks. The e2e specs pass on either.
- **Measure fit at real heights, not only nominal sizes.** Phase 2 passed at 360×640 and 740×360, then failed on an iPhone SE's real svh (about 548) and a landscape phone with its URL bar (740×304). Every layout change to a pinned scene is re-measured at all of these:
  - 375×548, 360×560 and 390×664
  - 740×304, 740×280 and 667×320
  - 320×256 (400% zoom)
  - 360×640, 740×360 and 1440×900 with a WCAG 1.4.12 text-spacing stylesheet injected

  `tests/e2e/fit.spec.ts` covers the gate.

## Open owner decisions

- **Pause motion toggle** for WCAG 2.2.2 (Phase 6).
- **The quote text** is still the placeholder "Your quote about life goes here." The owner edits it in the editor.
- **Hero tagline:** the seeded tagline matches the Framer template word for word (PRODUCT.md). It needs the owner's own words.
- **Real material:** projects, screenshots, testimonials and blog posts.
- **The published-content read is cached** for a year. Tag it and call `revalidateTag` on publish, or make it uncached (which makes `/` dynamic).
- **`.impeccable/` in `.prettierignore`.**
- **Positioning.** PRODUCT.md still says "Full-stack product builder", while the owner's new copy positions branding, web design and development. The owner decides; don't rewrite it unasked.
- **Projects heading in the live record.** The seed defaults are now "Featured projects" and "Showcasing my most impactful work.", but the published site-content row keeps its old text until the owner sets it in the editor.
- **Database steps for the service field** (Docker was down in Phase 2):
  1. Apply `20260928120000_contact_messages_service.sql`.
  2. Run `pnpm db:types` and confirm it matches the hand-edited `service` lines in `database.type.ts`.
  3. Run the contact, editor and dashboard e2e specs.
- **Send message button voice.** It is the only action not in the uppercase, tracked Label voice of "Let's talk" and "Email me". DESIGN.md documents the sentence-case primary button, so changing it is a system change for the owner (finish review ceiling item).
