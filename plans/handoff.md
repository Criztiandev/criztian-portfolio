# Handoff: the dot-art redesign

> **For:** the next Claude Code session picking up this build.
>
> **Current phase:** **Phase 3, smooth scroll, shapes, dot choreography, section motion and the cursor.** Phases 0–2 are done (2026-09-28). Phase 1 is committed as `3f58984` and Phase 2 as `ba153d4`; both reached `main` in `5c2173c` (PR #1). Start Phase 3 with its pre-flight (the hero pixel diff against `0a3c97a`, the migration and the e2e baseline).
>
> **Branch:** `portfolio/phase-3`, cut from `main` at `5c2173c`. **Baseline for pixel diffs:** `0a3c97a`.
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
- **Accessibility:** `aria-hidden` goes only on decorative leaves (the canvas, empty slots, icons, step numbers) or on a visual duplicate of text that stays exposed. Never on a wrapper of readable content (gap review; Part 3 needs the duplicate case).
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
   - **Focusables too (gap review).** Every focusable inside a scene also carries `scroll-mt-18` (`FOCUS_RING_CLASS` does). This keeps a Shift-Tab target clear of the 72px fixed header, because `scroll-padding-top` is banned (Phase 3, Part 0).
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

- **Database steps.** Docker was down, so the migration is written but not applied, and `database.type.ts` is hand-edited. See the Phase 3 pre-flight.
- **The contact, editor and dashboard e2e specs** have not run, because they need Supabase.
- **The hero pixel diff against `0a3c97a`** was not re-run. It is the first check of Phase 3. Phase 2 changed token classes (same computed colours) and added fade wrappers held at opacity 1 at rest. It also changed the header's centre links on purpose, so a clean diff needs the header band masked (gap review; see the Phase 3 pre-flight).

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

- **Checks:** `pnpm typecheck` and `pnpm lint` are clean, and 271 unit tests pass. The Prettier check warns only on `.impeccable/hook.cache.json`. That was an open owner decision then; `ae0d4f7` has since ignored `.impeccable` in .gitignore.
- **e2e:** `hero.spec.ts`, `anchors.spec.ts` and `fit.spec.ts` pass 36/36 against a production build on :3100.
- **Measurement:** measured at 13 sizes, plus the WCAG 1.4.12 stylesheet at three of them, using the list in "Landmines". The result is 0 never-visible lines, 0 text overlaps, 0 clipped text, no horizontal overflow and no errors. The required phone sizes stay pinned with at least 27.8px spare. 400% zoom and text spacing flow.
- **Reviews:**
  - A five-lens adversarial review (contract, a11y, conventions, fidelity, data), with every finding verified by a skeptic: 14 confirmed (4 major), all fixed.
  - The impeccable finish review: recapture, then fix (the project count sat above the heading; it now sits below the lede), then ship. The ship covers that fix and the reviewed captures.
  - Captures are in `.impeccable/review/`, which is not committed.

### Phase 3: smooth scroll, shapes, dot choreography, section motion and the cursor

**The owner's direction (2026-09-28, after seeing Phase 2).** The layout is right, but the page feels static.

- The dot transitions must feel "wow and professional".
- Every section needs its own motion, sliding and award-level transitions, so the page feels alive.
- The dots stay the main show. Section motion supports them and never competes with them.
- Section motion moves here from Phase 6, so this phase is where the page comes alive.

**The owner's second direction (2026-09-28, while planning Phase 3).**

- **Smooth scroll.** "Stiff scroll feels like a chore." The page should glide, so a visitor takes the work in a little at a time. A library is allowed. See Part 0.
- **An adaptive cursor.** A circle that trails the pointer with a smooth drag, with micro-interactions on hover, adapting to each section and tied to the scroll. See Part 4.

**Splitting.** If this is too big for one conversation, split it at the part boundary:

- 3A: parts 0, 1 and 2 (smooth scroll, then the dots)
- 3B: parts 3 and 4 (the sections, then the cursor)

Ask the owner to confirm the motion choices in Part 3 and the cursor anatomy in Part 4 before building them. They are a proposal, not a sign-off.

**Decide first, at the start of 3A:** the Process step and shape sync (Part 2, "Step and shape sync"). Part 1's Process swap and Part 3's step handovers both depend on it. **Decided 2026-09-28: realign the split to the copy.**

**Planning review (2026-09-28).** Parts 0 and 4 were designed by a multi-agent workflow and then reviewed adversarially against the code and the Lenis and Motion sources. Every confirmed finding is folded into the text below. Corrections to Parts 1–3 found in the same review are folded in too and marked "(planning review)".

**Gap review (2026-09-28).** The owner asked for Phase 3 to be analysed and for the necessary missing features to be added.

- **How it ran.** A second multi-agent review read Phase 3 against the code through four lenses: owner asks, engineering, a11y and performance, and executability. One adversarial verifier per candidate checked the code and the `node_modules` sources, and a completeness critic ran last.
- **What survived.** 20 findings, folded in below and marked "(gap review)". Most are places where Phase 3 as written would break or fail its own acceptance, not missing visuals:
  - the no-JS check already fails
  - the pixel diff can't pass
  - the planned draw-on rank un-hides padded points
  - step handovers blank the copy
  - `fit.spec` goes red
  - two WCAG failures (2.5.3 and 2.4.11)
- **Owner decisions:**
  - **Three extras** the verifiers had dropped as not necessary go into Part 3: the mobile menu wipe-open, the contact success moment and a scroll-progress hairline.
  - **Reveals replay on re-entry** instead of playing once. This is a DESIGN.md change.
  - **The direction-aware sweep keeps the natural mirror,** so there is nothing to build.
  - **Scroll-spy defaults:** during a nav flight the dot steps under each link it passes, and it hides on sections with no centre link.
- **Verified as not necessary; don't re-propose these without new evidence:**
  - a spec for the arrival strike's state and loop sleep; the 0-RAF and pixel-diff acceptance already force a finite end
  - a fallback order for the phone frame budget; the trace decides. Do ask at the start of Part 2 whether the owner has an Android phone with USB debugging for the trace.
  - a Lenis `focusin` reset
  - a spin decision for the line-art shapes; it is tuning in `hero.data.ts`
  - a second hover grammar; Part 4's `action` state is the hover micro-interaction
  - making the header wait for the name on load; it would hide "Let's talk" behind a slow font
  - dust that drifts with the scroll
  - projects plate wipes; Phase 5 rebuilds the section
  - a live reduced-motion hook, a committed capture harness, an owner-decisions table and tuning-loop bookkeeping
  - WebGL context-loss restore
  - the Part 4 text nits
- **Real but optional, not folded in (owner's scope choice):**
  - Anything translated inside a `[data-fit-box]` (the 24px docking slide, line rises) counts toward the scrollHeight the fit gate reads. The unclipped slide leaves 2.8px of the 27.8px minimum spare, so wrap it in an `overflow-clip` parent before raising it.
  - Part 3's wording mismatch: testimonials have a rule and no plate, and a blog item has a plate and no separate rule. So "Hairlines draw … the testimonial and blog rules" and "the plates wipe open" each fit only one of the two.

#### Pre-flight (gap review)

Do this before Part 0, and record the results in the 3A done note.

1. **Hero pixel diff.** It is the first check, and the Part 2, 3 and 4 acceptance repeat it. Use the same capture as Phase 1 (1440×900, DPR 1 and 2, at rest and reduced motion) against `0a3c97a`, with these carve-outs and no others:
   - **Mask the fixed header band:** the top 72 CSS px, 144 device px at DPR 2. Phase 2 changed its centre links on purpose (`PORTFOLIO_PRIMARY_NAVIGATION`: Project, Blog, About, Contact became Services, About, Work, Process, Blog), and Part 3's nav dot and hairline change it again. The band doesn't overlap the name's dots at 1440.
   - **Mask the scroll cue's row** (the "Scroll to explore" line and its arrow, y 840–860 CSS px). Phase 2's token pass changed its colour from translucent `white/60` to the opaque `text-muted-foreground` (`rgb(153,153,153)`). That is the same grey on black, but Chromium anti-aliases text differently for a translucent colour, so the glyph edges differ by up to 35/255 at DPR 1 and 61/255 at DPR 2. The tagline kept its colour and matches exactly. This replaces Phase 1's 7×7 arrow allowance.
   - **A fixed ceiling on the name's dots.** At most 18 differing pixels at DPR 1 (at most 2/255) and 14 at DPR 2 (at most 1/255), all inside the name's box. Phase 1's fixed canvas causes them: the GL viewport went from the 1440×1422 document canvas to 1440×900, which moves a few point-edge pixels in rasterisation. Measured 2026-09-28 in Playwright's Chromium 1243. More pixels, a larger delta, or any dot pixel outside the name's box is drift.

   Every other pixel must match. If any other pixel differs, stop and find the cause.
   - **Pre-flight result (2026-09-28):** passed with exactly the residue above in all four cases (reduced motion matches motion at rest).
   - **How it was measured.** A bisect built `0a3c97a`, `3f58984` (Phase 1) and HEAD in throwaway worktrees, served on :3200, :3300 and :3100. Phase 1 → HEAD differs only in the cue row, and `0a3c97a` → Phase 1 only in the dots. Each build diffed against itself is 0.
   - **Correction to the Phase 1 done note:** its "zero-pixel diff at DPR 2" does not reproduce.
   - **Capture method:** a fresh `chromium` (`channel: "chromium"`) browser per case. Wait for `data-status="running"` and `document.fonts.ready`, then screenshot every 400ms until three consecutive frames are identical. Diff the RGBA of two decoded PNGs in a page canvas. One browser reused across DPR 2 cases crashed.

2. **Supabase:** `pnpm supabase:server`. If Docker Desktop is down, ask the owner to start it. Don't sign Part 0 off without it.
3. **Migration:** `pnpm exec supabase migration up --local`. It applies only pending migrations, here the nullable `service` column of `20260928120000_contact_messages_service.sql`, and keeps data.
   - **Never `pnpm db:reset`.** It re-seeds `site_content` as `draft = '{}'` (`20260920160000_site_content.sql:37`), which wipes the owner's draft and published content and `auth.users`.
4. **Types:** `pnpm db:types`, then `git diff src/types/database.type.ts` must be empty. That confirms the Phase 2 hand edit.
5. **Baseline:** the full `pnpm test:e2e` on a production build (see Landmines). Part 0's acceptance needs contact, editor and dashboard green, and they have never run in this redesign. Any failure here predates Part 0: fix it or record it before building Part 0, so that any later failure has one cause.

#### Part 0: smooth scroll

**Why a library.** `html { scroll-behavior: smooth }` (globals.css:152) smooths only anchor jumps and programmatic scrolls. Wheel steps are outside its scope, and wheel steps are the stiffness the owner means.

**Why first.** Part 2's tuning (`morphFollowRate`, the stagger, the sweep, burst and gather) depends on how wheel input reaches `scrollY`. Tuning on stepped wheels and then adding smoothing means tuning twice. Part 0 touches no engine file, so it goes green before the engine changes and any later regression has one cause.

**Sources.** `lenis.mjs` line numbers refer to `lenis@1.3.26/dist/lenis.mjs`. "Measured" means a Chromium probe of 1.3.26 run during planning.

- **Library: core `lenis@^1.3.26`.**
  - **It scrolls the real window.** Every frame is `window.scrollTo({ top, behavior: "instant" })` (lenis.mjs:532-541), with no transform. The sticky frames, the fixed canvas layer, the hook's `scrollY` reads (use-dot-field.hook.ts:643-657) and Motion's `useScroll` (hero.component.tsx:94, section-navigation.component.tsx:61) keep working. Measured: sticky and fixed `top` held still through a Lenis animation.
  - **Transform smoothers are out** (GSAP ScrollSmoother, Locomotive v4, smooth-scrollbar). They translate a content wrapper, which becomes a transformed ancestor of the canvas and every slot (rule 4). `fixed` then resolves against the wrapper, sticky loses its scroll container (rule 5), and `containerRect.top + scrollY` stops being a document position.
  - **`lenis/react` is out.** `ReactLenis` defaults `autoRaf` to true (lenis-react.mjs:45), and without `root` it wraps the page in divs, which puts a scroll container above the canvas.
  - **Pin `^1.3.26`.** Lenis 2.0 regroups the options and makes `autoRaf` and `anchors` default to true. A caret range never installs it.
  - **Don't import `lenis/dist/lenis.css`.** `html` and `body` are already `height: auto`, `/` has no iframes, and the keyboard hand-back's `stop()` is undone by `start()` in the same task, so `.lenis-stopped` never styles a frame. The one useful rule, `overscroll-behavior: contain` on opted-out scrollers, goes on those elements as a class.
- **Mount: `src/app/page.tsx` only.**
  - Render `<SmoothScroll />` after `<SitePage>` in a fragment. It lives in `src/features/portfolio/components/smooth-scroll.component.tsx`: a `"use client"` leaf that renders `null` and creates Lenis in an effect (the constructor reads `matchMedia`, lenis.mjs:382).
  - The editor preview renders `SitePage` through `SitePreview` (site-preview.component.tsx:76), so it never gets Lenis, and its `scrollIntoView` (site-preview.component.tsx:54) works as today. Not the root layout, which also wraps the dashboard. Not `SitePage`, which must stay a server component.
  - It renders no DOM, so it can't be an ancestor of the canvas or a slot, and the strict counts hold.
  - Keep the default `wrapper` (`window`) and `content`. Never pass a wrapper element.
- **Desktop pointers only.** Construct Lenis only when `(hover: hover) and (pointer: fine)` matches.
  - Why: even with `syncTouch: false`, Lenis adds `touchstart` and `touchmove` on `window` with `{ passive: false }` (lenis.mjs:255, 283-286). That opts the page out of Chrome's passive-by-default window touch listeners, so every touch scroll waits on the main thread. That is the coupling the fixed canvas exists to avoid, and phones gain nothing from Lenis because it hands touch back anyway.
  - Add `prefersFinePointer()` beside `prefersReducedMotion()` in browser-capability.rules.ts, with `FINE_POINTER_QUERY` in `src/data/motion.data.ts`. Part 4 uses the same helper.
  - Phones and tablets attach nothing, so the Phase 1 fling result still holds. A hybrid laptop pays one non-passive listener, which is acceptable on desktop hardware.
- **Options.**
  - **`lerp: SMOOTH_SCROLL_LERP`**, 0.1 (Lenis's default), in a new `src/data/motion.data.ts`, which Part 3 also fills. It is the only feel setting. 0.1 means `damp(…, 6, dt)` (lenis.mjs:85-89), an ease-out with τ ≈ 167ms. Don't switch to `duration` plus `SIGNAL_EASE`: an ease-in-out delays the first pixel of every wheel notch.
  - **`anchors: { onStart: wakeLoop }`.** It carries a callback, so it is built in the component, not in `src/data`.
  - Everything else stays at the 1.x default: `smoothWheel: true`, `syncTouch: false`, `autoRaf: false`, `allowNestedScroll: false`.
- **Loop: 0 RAF calls at rest.** `autoRaf` requests a frame every frame, forever (lenis.mjs:722-727). Measured: 61 calls/s idle, which fails "RAF at 0 fps at rest". `SmoothScroll` drives `lenis.raf` from its own loop, which sleeps:
  - **`tick(time)`** calls `lenis.raf(time)` and requests the next frame only while `lenis.isScrolling === "smooth"`. Otherwise it sets the frame id to 0.
  - **`wakeLoop()`** does nothing if a frame is pending. Otherwise it sets `lenis.time = 0` and requests a frame. Without the reset, `raf` computes `time − (this.time || time)` (lenis.mjs:723) across the whole idle gap. Measured: a 400px wheel landed in one frame. It mirrors the hook's `previousTimestamp = 0` (use-dot-field.hook.ts:639).
  - **What wakes it:** `lenis.on("virtual-scroll", wakeLoop)`, which fires for every wheel (and, on hybrids, every `touchmove`) before any early return (lenis.mjs:581), plus the anchor `onStart`.
  - **Keep it separate from the dot hook's loop; never merge them.** During a Lenis scroll both run: each write fires a native `scroll`, which the hook reads one frame later. That lag is invisible, because slots are pinned rects. Both sleep afterwards. Measured: 0 calls/s after settling.
  - **Cleanup:** cancel the pending frame, remove the listeners, then `lenis.destroy()`.
  - **Half-pixel stall (as built, Part 0 review).** In lerp mode Lenis finishes only when `Math.round(value) === Math.round(to)` (lenis.mjs:86-89). A target ending in exactly .5, approached from below, stalls a few ULPs short and never rounds up: `isScrolling` stays `"smooth"`, the loop runs forever and every native scroll is overwritten. Chrome reaches it through fractional wheel deltas (precision touchpads) and fractional anchor targets.
    - `tick` treats a non-wake frame with `|velocity| < SMOOTH_SCROLL_REST_VELOCITY` (0.001 px per frame, `motion.data.ts`) as finished and calls `stop()` then `start()`. The wake frame is skipped, because its `dt` is 0 and so its velocity is 0.
    - Integer targets finish at 0.012 px per frame or more even at 240 Hz, so the threshold never cuts a normal flight short.
    - No Lenis `scrollend` fires for a settled stall. The dot hook clears its snap on arrival instead.
    - `smooth-scroll.spec.ts` wheels 100.5px and fails on a build without this.
- **Anchors: Lenis owns every in-page anchor scroll.**
  - **Why not native.** While animating, Lenis overwrites scrolls it didn't make on its next frame (lenis.mjs:651-666). A nav click within about a second of a wheel would start a native smooth scroll that Lenis cancels at once. With `anchors`, the click retargets the running animation.
  - **Same landing as the hook.** Lenis subtracts the target's `scroll-margin-top` and the root's `scroll-padding-top` (lenis.mjs:783-786); the hook subtracts `scrollMarginTop` only (use-dot-field.hook.ts:725-733). Every anchor already has 72px (`scroll-mt-18`), so pass no `offset`. **Never add `scroll-padding-top` to `html`:** the landings would disagree and `data-scene` would read `moving` on arrival (rule 9). Measured: a click landed exactly at `top − 72`.
  - **The hash still updates.** Lenis doesn't call `preventDefault` (lenis.mjs:542-553), so native fragment navigation starts, and Lenis's first instant write takes over.
  - **Accepted gap:** Lenis ignores modifier keys, so a Ctrl-click on a nav link also scrolls this page, without the hook's snap.
- **The dot engine: no changes.**
  - **The snap is still set first.** The hook's `onAnchorClick` is a document capture listener (use-dot-field.hook.ts:872); Lenis's click listener is on `window` in the bubble phase (lenis.mjs:477). `jumpScrollTop` is set before Lenis starts, and `followTimelineProgress` snaps.
  - **`scrollend` doesn't clear the snap early, but only because of a Lenis internal.** Instant writes fire one native `scrollend` per frame (measured: 60 writes, 60 events). Lenis swallows them in a window capture listener while smoothing or idle (lenis.mjs:510-514) and dispatches one bubbling `CustomEvent("scrollend")` at the end (lenis.mjs:515-520). Measured over an anchor scroll: 70 `scroll`, 0 native `scrollend`, 1 custom. This is undocumented, so `scrollend` in `JUMP_CANCEL_EVENTS` (hero.data.ts:59-64) now depends on it. The nav-jump spec must watch the whole flight (see Tests) and must be re-run on every Lenis upgrade.
  - **Arrival clears the snap.** Lenis ends by setting the exact target (lenis.mjs:87-89), inside `MORPH_LANDING_TOLERANCE_PX`.
  - **A stale `scrollend` is dropped (as built, Part 0 review).** Lenis dispatches a flight's `scrollend` one frame after it completes, without checking whether a new flight has started (lenis.mjs:839-846). A nav click in that frame would get its snap cleared by the old flight's event. `SmoothScroll` adds a window capture listener that calls `stopImmediatePropagation()` on a `CustomEvent` `scrollend` while Lenis is still `"smooth"`; the real end still passes, because `reset()` has already set `isScrolling` to false.
  - **Wheel still clears the snap.** Lenis calls `preventDefault` on the wheel (lenis.mjs:627) but doesn't stop propagation.
  - **Double smoothing: keep `followTimelineProgress`.** In transits `p` trails the wheel by Lenis's τ ≈ 167ms plus the follow's τ = 100ms. The follow stays: it is the only smoothing for touch and keys, and its one-segment snap is how anchor jumps skip shapes. Pin ranges are unaffected, because the target there is a whole number. If the desktop morph feels late, raise `morphFollowRate` in Part 2 with Lenis on, then re-check a phone fling.
  - **Main thread.** Lenis scrolls on the main thread, so a slow transit frame now also stutters the desktop wheel. Part 2's 16ms frame budget covers desktop wheel scrolling too.
- **Keyboard stays native, plus one listener.** Lenis has no key handling; Space, PageDown, the arrows and Tab scroll natively and Lenis adopts those scrolls while idle. A window `keydown` listener in `SmoothScroll` calls `lenis.stop()` then `lenis.start()`, only while `lenis.isScrolling === "smooth"` (as built). Each runs the internal `reset()` (lenis.mjs:684-716), which is `private` in the 1.3.26 typings (lenis.d.ts:409), so `lenis.reset()` fails typecheck. Without it, a key pressed during a Lenis animation, including the scroll that brings a newly focused element into view, is overwritten on the next frame.
- **Reduced motion: no Lenis.** Don't construct it when `prefersReducedMotion()` is true. Lenis's own reduced-motion handling still eases the wheel (lenis.mjs:749-754; measured: 7 frames against 1 native). Listen for `change` on `readReducedMotionQuery()`: on `reduce`, cancel the frame and `destroy()`; on `no-preference`, construct it again.
- **No JavaScript.** Nothing loads. The wheel is native and anchor jumps are instant under the `idle` rule (globals.css:160-162), as today.
- **Focus clearance (gap review).** Part 0 bans `scroll-padding-top`, which is the platform's global fix for focus under a fixed header, so every focusable inside a scene needs its own `scroll-mt-18` (DOM contract rule 9).
  - **Three focusables miss it:** `FOOTER_LINK_CLASS` (portfolio.data.ts:40-41), the projects "Let's talk" CTA (projects-section.component.tsx:185-198) and the card's stretched link (:78-88, latent until a project has an https link). Add the one token to each.
  - **Why it bites.** The CTA sits in the projects frame, which unsticks once the list scrolls past. Shift-Tab back from "Email me" then scrolls it in at the top edge in Firefox, under the 72px header. That fails WCAG 2.4.11 on the path to the only conversion.
  - **Manual check** during the keyboard pass: in Firefox at 1440×900, Shift-Tab from "Email me" leaves "Let's talk" at 72px or lower.
- **Nested scrollers.** Lenis takes every wheel unless an element opts out. Add `data-lenis-prevent` and `overscroll-contain` to the mobile nav panel (section-navigation.component.tsx:233, which shows in narrow desktop windows too), and `data-lenis-prevent` to the message `Textarea` at its call site (contact.form.tsx:137-144; the props spread through the vendored `textarea.tsx`, which stays untouched). Not `allowNestedScroll`: it walks `getComputedStyle` up the DOM on every wheel.
- **Fit gate: unchanged.** Its instant `window.scrollBy` (scene-fit-gate.component.tsx:78-93) is adopted while Lenis is idle, which covers page load, deep links and every e2e path. Mid-wheel, Lenis overwrites it and the reader lands off by one scene's growth. That needs a resize, zoom or late font during a wheel, so it is accepted. If it shows up, call `lenis.stop()` then `lenis.start()` on window `resize` in `SmoothScroll`, as the keyboard hand-back does; keep the gate free of Lenis.
- **CSS and Next: unchanged.** Keep `html { scroll-behavior: smooth }`: Lenis writes with `behavior: "instant"`, which ignores it, and with `auto` the native fragment jump would land within 1px of `jumpScrollTop`, clear the snap (use-dot-field.hook.ts:650-653) before Lenis's first frame, and bring back the shape flash. Keep the `idle` and reduced-motion rules (globals.css:160-168) and `data-scroll-behavior="smooth"` (layout.tsx:26, route transitions only).
- **Rules for later work.**
  - `SmoothScroll` never scrolls on mount. The usual Next.js snippet (`lenis.scrollTo(0)` on mount or pathname change) breaks every hash landing.
  - Long programmatic scrolls go through an in-page anchor click. A bare `lenis.scrollTo` sets no `jumpScrollTop`, so it flashes through every shape.
  - Safari is untested: Lenis caps at 60fps there and has known trackpad lag (lenis #290). Check it in Phase 6.
- **Files.**
  - `package.json`: add `lenis@^1.3.26`.
  - New: `src/data/motion.data.ts`, `smooth-scroll.component.tsx`, `tests/unit/smooth-scroll.test.tsx`, `tests/e2e/smooth-scroll.spec.ts`.
  - Edited: `src/app/page.tsx`, `browser-capability.rules.ts`, `section-navigation.component.tsx`, `contact.form.tsx`, `tests/e2e/hero.spec.ts`, `tests/e2e/editor.spec.ts`. For focus clearance (gap review): `src/data/portfolio.data.ts`, `projects-section.component.tsx`, `tests/unit/site-page.test.tsx`.
  - CLAUDE.md: one bullet. Lenis runs on `/` only, for fine pointers, as core `lenis` driven by its own sleeping loop; it owns anchor scrolls; never give it a wrapper element; never add `scroll-padding-top`. Focus clearance comes from `scroll-mt-18` on each focusable, never `scroll-padding-top` (gap review).
- **Tests.**
  - **Existing specs are unaffected.** They scroll with instant `scrollTo` or `scrollIntoView` (hero.spec.ts:47-53, 101-105, 381-387; fit.spec.ts:156), which idle Lenis adopts. No spec uses the wheel. `hero.test.tsx`'s no-RAF checks never render `page.tsx`.
  - **Unit, `smooth-scroll.test.tsx`.** `vi.mock("lenis")` and the frame-queue pattern from scene-fit-gate.test.tsx. Constructed once with `SMOOTH_SCROLL_LERP`, and mount requests no frame. Nothing is constructed under reduced motion or a coarse pointer (`vi.spyOn(window, "matchMedia")`, because tests/setup.ts always returns false); a reduced-motion `change` constructs or destroys it. `virtual-scroll` requests one frame; a tick while `isScrolling === "smooth"` requests the next, any other state stops. `keydown` during a smooth scroll calls `stop()` then `start()`, and neither otherwise. Unmount cancels the frame and destroys.
  - **e2e, `smooth-scroll.spec.ts`** (Desktop Chrome). Wait on Lenis's own end state, never `waitForScrollRest`: its 20-frame heuristic resolves 1px early once the lerp is tuned to 0.05 or below (measured).
    - **Wheel.** Open `/#faq`, put the mouse at the centre and wheel once. Sample `scrollY` every frame. Expect more than 10 distinct frames and `lenis-smooth` on `<html>` during the flight. Then `expect.poll` until `lenis-smooth` is gone (or await the `scrollend` event whose `detail.lenisScrollEnd` is true), and expect the landing to equal the start plus the `deltaY` a window `wheel` listener saw. Don't hard-code 400: at device scale 2 the same wheel moves 200.
    - **Idle cost.** After that end state, a wrapped `requestAnimationFrame` counts 0 calls in 2s.
    - **Reduced motion, live.** Assert behaviour, not the `lenis` class: `destroy()` leaves a 400ms velocity timer that re-adds the class (lenis.mjs:493-503, 668-673; measured). After `emulateMedia({ reducedMotion: "reduce" })`, a window `wheel` listener registered after Lenis sees `defaultPrevented === false` and `scrollY` moves the full delta in one frame. Under `no-preference`, `defaultPrevented === true`. Keep a class check only under `test.use({ reducedMotion: "reduce" })`, where Lenis is never constructed.
    - **Nested scroller.** At 800×400, open the menu and wheel over the panel: the panel's `scrollTop` rises and `window.scrollY` stays put.
    - **Phones.** In the touch block (hero.spec.ts:397-403), `<html>` never gets the `lenis` class.
  - **`hero.spec.ts` nav jump (:219-266).** Today the observer resolves on the first `dust` (hero.spec.ts:236-239), which the snap writes before Lenis moves a pixel, so it can't see a mid-flight snap clear. Keep the observer connected until the `scrollend` whose `detail.lenisScrollEnd` is true (5s cap kept). Assert the trail contains `dust`, none of `JUMP_SKIPPED_SCENES`, and only `dust` from its first `dust` onwards. Then `#contact` sits at 72px ±1 and `location.hash` is `#contact`. This is the only guard on the Lenis `scrollend` suppression.
  - **`editor.spec.ts`.** The preview iframe's `<html>` has no `lenis` class.
  - **Unit, `site-page.test.tsx` (gap review).** Extend the rule 9 test (site-page.test.tsx:97-113). Render one project with an https link, so the card link exists. Then assert that every `[data-dot-scene] :is(a[href], button, summary, input, textarea, select)` that isn't `[tabindex="-1"]` or `[aria-hidden="true"]` has `scroll-mt-18` in its className. The ContactForm stub keeps the form fields out of scope; they already carry it. No e2e: Chrome centres a fully hidden focus target, so a Shift-Tab walk would pass without the fix.
- **Acceptance:**
  - `pnpm check`, the unit tests and every e2e spec pass, including contact, editor and dashboard with Supabase up.
  - A wheel animates over more than 10 frames and lands exactly on its delta.
  - 0 RAF calls per 2s at rest after a wheel in dust.
  - The nav jump to `#contact` never shows a skipped scene during the whole flight, lands at 72px ±1 and updates the hash.
  - Reduced motion and phones: the wheel and touch are native (not `defaultPrevented`).
  - The editor preview has no `lenis` class. The nav panel scrolls under the wheel at 800×400.
  - The owner wheels and trackpads through the page and signs off the feel. `SMOOTH_SCROLL_LERP` is the only knob.

#### Part 1: the shape library

- **Generators:** seeded, pure line-art generators that stipple along paths, like `generateCubePoints` along the cube's edges: the three service shapes and the five process shapes.
  - **Emit points in pen order now** (planning review, corrected in the gap review). Part 2's draw-on reads the pen order from the point's index (see Part 2, "Draw-on formation"), so each generator emits its points along the stroke from the start. `w` stays the seeded random rank. Otherwise the generators are rewritten in Part 2.
- **Swap:** change the scene shape constants in `src/data/page-sections.data.ts` (`SERVICES_SCENE_SHAPES` → `branding web-design development`, `PROCESS_SCENE_SHAPES` → `listening planning visualising building delivery`, gap review) and add the ids to `DOT_SHAPE_IDS` (hero.data.ts:76). An id the engine doesn't know is silently skipped (`parseSceneShapes`, dot-field.rules.ts:661-667).
  - **`building`** may reuse `CUBE_EDGES` and `writeEdgePoint`, but it emits edge by edge in arc-length order, not `generateCubePoints`' round-robin (`index % 12`, dot-field.rules.ts:413), which is not pen order. It keeps its own id and its own `DOT_SHAPE_TUNING` entry.
  - **Register all eight ids (gap review)** in the `DotGeneratedShapeId` union (hero.type.ts:3) and in `GENERATED_SHAPE_IDS` (hero.data.ts:78), as well as `DOT_SHAPE_IDS`. tsc then flags every `Record<DotGeneratedShapeId, …>` (`DOT_SHAPE_TUNING`, `buildShapeLibrary`, the renderer's `shapeBuffers` and `shapePoints`).
  - **`GENERATED_SHAPE_IDS` is the one list tsc doesn't check.** The renderer uploads buffers by iterating it (dot-field-renderer.service.ts:330-336), so an id missing from it renders blank with no error.
  - **Update the specs in the same commit (gap review).** A multi-shape scene reports its step's shape id as `data-scene` (dot-field.rules.ts:755), not the scene id, so the swap breaks:
    - `SCENE_WALK` in hero.spec.ts and `SCENE_DEEP_LINKS` in anchors.spec.ts: `#services → branding`, `#process → listening`
    - fit.spec.ts:302: `data-dot-shapes` becomes the new services string
    - `JUMP_SKIPPED_SCENES`: replace `services` and `process` with the eight step ids. This is tidying; the real guard is Part 0's "only `dust` from its first `dust` onwards".
- **Tuning:** every number goes in `hero.data.ts`.
- **Acceptance:**
  - reduced-motion screenshots show each shape formed in its own slot at 390, 820 and 1440 wide
  - unit tests per generator (planning review, corrected in the gap review): deterministic for a seed, exactly `SHAPE_POINTS` points, every point inside [-1,1]³, `w` in [0,1), and consecutive points adjacent along the path (gap below a bound)

#### Part 2: dot choreography

Make every morph an event, not a slide from one slot to the next.

- **Draw-on formation.** Each line-art generator emits its points in pen order, by arc length along the stroke (gap review). The arrival stagger uses that order, so a shape draws itself like a pen:
  - the seal traces its ring
  - the browser draws its frame, then its bar
  - the brackets write left to right

  Departure keeps today's left-to-right dissolve.

  **The pen key comes from the vertex index; `w` stays random** (gap review, replacing the planning review's "keep `uVisible` on a hash").
  - **The key.** The arrival pen key is `min(float(gl_VertexID) / float(SHAPE_POINTS), 1.0)`, with `SHAPE_POINTS` interpolated into the shader like `OFFSCREEN_CLIP_POSITION` (dot-field.vertex-shader.ts:1, :149). `drawArrays(POINTS, 0, pointCount)` (dot-field-renderer.service.ts:474) makes `gl_VertexID` the buffer index. The clamp keeps padded vertices past `SHAPE_POINTS` from stalling mid-fade. The "little jitter" is the existing `mix(key, randomKey, uMorphJitter)` (vertex-shader.ts:130).
  - **`w` keeps every current role.** `uVisible`, `randomKey` (jitter, arc) and `HIDDEN_RANK` keep reading it unchanged, so thinning stays even and padded points stay hidden. One division by `gl_VertexID` is not the texture index maths rejected under "Shapes and buffers". Cube, sphere and dust keep their emission order, which is already spatially random.
  - **Not for the name.** Any segment that touches the name (`hasName`, vertex-shader.ts:126-127) keeps today's `nameKey` sweep. Name points come out in raster order (dot-field.rules.ts:157-158), so a pen key would re-form the hero and the footer name row by row, and every point past `SHAPE_POINTS` would land at once. The pen key applies only when the target is a generated shape.
  - **Why the planning-review version failed.**
    - Padded duplicates carry `w = HIDDEN_RANK = 2`, and `fract(2 × 97.13) ≈ 0.26`. Comparing `uVisible` with that hash would show them whenever `uVisible > 0.26`, and it is often 1.
    - With `w` as path order, that hash is a sawtooth with a period of about 74 points. Thinning would keep and drop alternating runs of about 37 points, so strokes turn dashed, and the arc (which reads `randomKey`) would ripple along every stroke.

- **Burst and gather.** Mid-flight, add a seeded curl-noise displacement that peaks at `t = 0.5` and is zero at both ends. The dots loosen into a drifting cloud between shapes instead of sliding on clean arcs. Bound it so no dot leaves the viewport.
  - **Per dot, not per segment (gap review).** The envelope is `sin(π · eased)` on each dot's own eased flight, like the arc (dot-field.vertex-shader.ts:140), never the segment's `t`. A dot that hasn't left yet, or has already landed, has no displacement, so the part of the stroke drawn so far stays crisp. With the segment's `t`, at `t = 0.2` dots still waiting to leave would already sit at 59% of the peak, which undoes the draw-on.
- **Depth swell.** Dots lift toward the camera mid-flight: size and brightness rise a little. Dimness stays opacity, never MAX blending. It uses the same per-dot envelope (gap review).
- **Arrival strike.** On landing, a brief brightness flash that decays over about 300ms, like a lamp striking. Also give a small spring impulse through `stepDotPhysics`, so a formed shape settles with the same bounce as the pointer scatter.
- **Direction-aware sweep: nothing to build** (owner, 2026-09-28, gap review). Scrolling back already plays the sweep in reverse, right to left, because it is the same from/to pair with `t` falling (dot-field.rules.ts:803-824). Never flip a sweep key mid-flight: every dot's `localMorph` would jump and the dots would teleport.
- **Copy crossings** (the Phase 1 tuning point): transit dots must not cross the incoming or outgoing copy column at full brightness. Either dim dots over text boxes or bias the arcs toward the slot side.
- **Step and shape sync.** With the equal pin split, each shape is still fully formed at the scroll where its copy is aligned. But for Process's five steps, the first and last shape handovers land about 0.14 of a step (about 116px at 1440×900) away from the copy handovers. Decide before wiring the five shapes: accept that skew, or change the split:
  - put multi-step boundaries at `start + (k + 0.5)·pin/(n − 1)`
  - make the first and last intervals half length

  The change matches the copy pitch in both layouts and still measures no step rects. If you make it, update the rules tests.

  The split is not strictly equal today: `stepLength` is equal (dot-field.rules.ts:736), but `stepMorphShare: 0.4` (hero.data.ts:110) cuts transits out of the inner boundaries only, so the first and last steps are longer by `halfGap` (dot-field.rules.ts:737-751). Measure the skew from that, not from an equal split. This decision is taken at the start of 3A (see Splitting).

  **Decided (owner, 2026-09-28): realign to the copy.** Change the split as above, for every multi-step scene (Services and Process), before Part 1 wires the shapes. Keep `stepMorphShare`'s transits centred on the new boundaries, and update the rules tests.

- **Transits hidden behind opaque steps.** On portrait phones, the services → about transit runs entirely behind the last services step, which is opaque by design (rule 8), so the flight is invisible there. Choreograph around it: start the transit as the last step unsticks, or route the flight through the band.
  - **Process → dust has the same geometry** (gap review): the same `StepScene` last step (step-scene.component.tsx:83-92), followed directly by the dust container. Apply the same fix to both exits, keyed on the component rather than on a scene id.
- **Engine follow-ups from the Phase 2 fit work** (the engine was off-limits then):
  - `resolveViewportHeight` takes the tallest `frameHeight + stickyTop`. A frame that grows past `F` (text spacing, 400% zoom) therefore shifts dust boundaries, and `data-scene` reads `moving` early near them. The text stays readable.
  - Split steps that grow at short landscapes (740×304, 740×280) stretch the pin, so copy and shape drift apart in the tallest steps.
- **Invariants:** every number lives in `hero.data.ts`. Reduced motion is unchanged: no flight, and still shapes only inside pin ranges. The loop still sleeps at rest.
- **Acceptance:**
  - frame captures of every transit, name → cube → each service → about → project → each process step → dust → footer name, scrolling down and back up, at 1440 and 390, tuned with Part 0 on; the owner signs off "wow and professional" from them (gap review: the project transits, the exit to dust, the footer finale and the reverse direction were missing)
  - RAF at 0 fps at rest
  - the hero passes the pre-flight pixel diff. Part 2 rewrites the vertex shader and adds the strike, so 3A re-checks it rather than leaving a regression for 3B to find (gap review)
  - no transit frame over 16ms on a mid-range Android, and on desktop with a smoothed wheel (Part 0 puts the scroll on the main thread). Phase 4 names no method yet (planning review): use a Chrome Performance trace and count long frames, on the owner's phone.

#### Part 3: section motion

One motion grammar, authored once, in the signal-board world: things power on like lamps, lines draw like wire, and copy wipes in like the quote. No per-section novelty.

- **Headline power-on.** Every section `<h2>` lights up the way the wordmark does. It starts at the 14% ghost, and a feathered sweep (26px feather, `SIGNAL_EASE`, about 0.9s) lights it left to right as it enters.
  - Use a CSS mask on the heading itself. Don't split it into letters, so screen readers still read it whole.
  - Arming follows the Constraints below, for every reveal, not only headings (planning review, widened in the gap review).
  - The Projects h2 drops `QUOTE_REVEAL_VARIANTS` and takes the power-on, so it gets one reveal, not two (gap review).
- **Copy slides in.** Paragraphs rise line by line from behind a clip (100% up), staggered 60–80ms.
  - Line splitting must survive the WCAG 1.4.12 text-spacing re-measure (see Landmines) and re-split on resize (planning review). If it can't, rise per paragraph.
  - **SiteContent paragraphs rise per paragraph** (gap review). The Projects lede and the card summaries (projects-section.component.tsx:108-112, :170-178) come from SiteContent and change live in the editor preview, which re-renders `SitePage` on every message. A line splitter that re-splits only on resize would keep showing the old text there. Line splitting is only for static `src/data` copy.
- **Hairlines draw** left to right, staggered: the service items, the stats rule, the FAQ rows, the testimonial and blog rules. Use scaleX from the left on a dedicated rule element or a pseudo-element.
- **Step handovers** (Services, Process). The outgoing step's copy wipes out and the incoming one wipes in at the same scroll position as the shape morph, so copy and dots change together. In the portrait band, the incoming sticky step's content slides up 24px and wipes in when the outgoing shape leaves (see "Timing" below), wherever it is in its docking (gap review; docking is a scroll pitch, not the keyframe split).
  - The boundaries live only in the hook, and the portrait docking pitch `k·(F − band)` is not the keyframe split (planning review). Key the copy off the stage's `data-scene`, not off a second scroll computation.
  - **The exact rule** (gap review; the natural "lit when `data-scene` is my id" blanks every step on most paths). Each step `li` carries `data-step="<shape id>"`, taken from the scene's shapes by index.
    - **What is wiped:** a step's content, meaning the `li`'s children. Never the `li` itself, which is rule 8's sticky, opaque block.
    - **When:** only while the stage has `data-status=running` and `data-scene` equals the id of a sibling step in the same scene.
    - **Every other value leaves all steps lit:** `name` (server render, no WebGL2), `moving` (every transit, including a scroll that comes to rest mid-transit), a flowed scene's container id, any other scene, and an id frozen by context loss (status is then `unsupported`).
    - **Timing:** the incoming copy wipes in as the outgoing shape leaves, and the outgoing copy wipes out as the incoming shape lands. Both reverse on scroll back.
  - **Literal selectors.** Write the eight selectors literally in globals.css, e.g. `[data-status=running][data-scene=web-design] [data-dot-scene=services] [data-step]:not([data-step=web-design]) > *`. Never build class names from the shape constants: Tailwind can't see them, so it generates nothing.
- **About:** the stats count up (0 → 5+, 500+, 140) when the stats row enters view.
  - **The trigger** (gap review) is the same observer as every other reveal (`amount: 0`, margin 0 or more), never `data-scene`. A scroll that rests mid-transit leaves `data-scene` at `moving`, and a scene-keyed count would sit at 0 for as long as the reader stays. Under replay, the count re-arms (back to 0) only once the row has fully left the viewport.
  - **The real value never leaves the DOM** (gap review). The `<dd>` keeps "5+", "500+" and "140", transparent while armed or counting. The digits (0 while armed, then counting) are an `aria-hidden`, tabular-nums overlay rendered from a Motion value child. So assistive tech, find-in-page and translation never read "0 happy clients", and the real text reserves the width, which makes the old fixed-width note unnecessary.
  - Under `unpinned:` (no WebGL2, flow mode) and reduced motion, the final values show and nothing counts.
- **Let's connect:** the heading powers on, then the "Email me" action wipes in. The address flickers on character by character, like a departure board.
  - **Accessible text** (gap review, replacing the planning review's `aria-label`, which failed WCAG 2.5.3 Label in Name because the link's visible name is "Email me"). The link keeps "Email me" and has no `aria-label`. The address stays one real text node in its `<p>`, transparent while the flicker plays. The flicker is an `aria-hidden`, `select-none` overlay of character spans, removed when it settles. Assistive tech and select-all always get the address exactly once. Timings go in motion.data.ts.
- **FAQ:** answers open with an eased height where supported (`interpolate-size: allow-keywords` or a `::details-content` transition) and snap elsewhere. This is a named exception to the property list below.
  - **The plus is a state, not yet a motion** (gap review). `group-open/faq:rotate-45` (faq-section.component.tsx:45-50) has no transition, so it snaps. Add `motion-safe:transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]`, following the project card (projects-section.component.tsx:56-58).
  - **One duration, at most 0.4s,** shared by the plus and the height, recorded in motion.data.ts. The height is the one effect here that moves layout. Browsers forgive shifts only within 500ms of a click or key press, so this keeps CLS 0.
  - The height transition is `motion-safe` only, because `useReducedMotion()` doesn't reach CSS.
- **Testimonial and blog placeholders:** the plates wipe open from the bottom (`clip-path` inset), staggered.
- **Reading sections: heading parallax, in CSS** (gap review, replacing "scroll-linked parallax on the inner columns").
  - **Where:** the heading drifts only where it sits beside its content: FAQ (faq-section.component.tsx:20) and Get in touch (contact-section.component.tsx:17), at 48rem and up. Testimonials, Blog and Let's connect stack or centre their heading at every width, so they get none. The content column (the FAQ rows, the form) never moves. The drift is at most 40px, so the reading sections feel layered over the dust.
  - **How:** a keyframe on the individual `translate` property on `animation-timeline: view()`, in globals.css. Use `translate`, not `transform`, which would override an inline transform Motion writes on the same element.
    - Wrap it in `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference) and (min-width: 48rem)`, so browsers without scroll-driven animations get no drift.
    - The 40px lives in motion.data.ts and reaches the keyframe as a custom property.
    - If the heading's power-on is also a CSS animation, both share one `animation` declaration.
  - **Why not Motion:** `useScroll` plus `useTransform` on `y` is written from the main thread (`y` isn't an accelerated key, motion-dom accelerated-values.mjs:4-10), a frame behind a phone's compositor scroll. Neither `INSTANT_TRANSITION` nor `MotionConfig reducedMotion` reaches a scroll-bound value. The CSS version needs no client leaf.
  - Tune it with Part 0 on; on a stepped wheel, parallax looks cheap.
- **Nav:** a single lit dot slides under the active centre link as the page scrolls (scroll-spy). The only round thing on the site is a dot, apart from the cursor's ring if the owner approves Part 4.
  - There is no scroll-spy today (planning review). `activeSection` changes only on a click (portfolio-ui.store.ts:26-28, section-navigation.component.tsx:94-100), so `aria-current` shows the last click. Build the scroll-spy first, and correct DESIGN.md:271, which overstates it.
  - **Mechanism** (gap review):
    - **Resolver.** Resolve the active id inside the existing `useMotionValueEvent(scrollY)` handler (section-navigation.component.tsx:63-65), through a pure function in a rules file. The rule is the last of all ten `PORTFOLIO_NAVIGATION` targets, not the five centre links, whose `getBoundingClientRect().top` is 73px or less (the `scroll-mt-18` landing plus 1). The handler already fires when a deep link or restored scroll leaves `scrollY` above 0, so it needs no mount pass.
    - **Not `data-scene`.** One dust scene holds Connect through Contact, so it can't name Blog.
    - **A new store action.** Write through a new `setActiveSection` action (add it to the store and `PortfolioUiActions`) that leaves `isMobileNavOpen` alone. `selectSection` closes the menu (portfolio-ui.store.ts:28), so reusing it would shut an open menu mid-scroll. Clicks keep using `selectSection`.
    - **Owner defaults (2026-09-28).** The dot shows only when the active id is a centre link, and hides elsewhere. During a nav flight it steps under each centre link the page passes, which needs no extra code. The mobile panel keeps `aria-current` on all ten links.
  - The nav dot and the cursor's dot share size, colour and easing.
  - **Scroll-progress hairline** (owner extra, gap review). A 1px `aria-hidden` span on the header's bottom edge, `origin-left`, scaled on x only (`scale: 0 1` to `scale: 1 1`, so it stays 1px tall) on `animation-timeline: scroll(root)`.
    - Pure CSS: compositor-driven, no client leaf, 0 RAF.
    - **Wire Grey intensity** (foreground at 0.4), never Lamp White. The verifier warned that a moving full-width line competes with the dots and the nav dot, and DESIGN.md:127 keeps Lamp White for the one element that should read first.
    - Hidden where `@supports (animation-timeline: scroll())` fails. It stays under reduced motion, because it moves only with the reader's own scroll, like a scrollbar.
    - The header isn't an ancestor of the canvas or a slot, so rule 4 holds.
    - DESIGN.md: add a Components entry, and amend :118's "no scene counter, film strip" line to allow this one hairline.
- **Mobile menu wipe-open** (owner extra, gap review). The panel (section-navigation.component.tsx:227-238) wipes open top to bottom.
  - **The class string** is a constant in motion.data.ts: `[clip-path:inset(0)] transition-[clip-path] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] starting:[clip-path:inset(0_0_100%_0)] motion-reduce:transition-none`.
  - `@starting-style` gives the entry from the `hidden` attribute's `display: none`. Closing snaps, and there is no link stagger, because `renderLink` is shared with the desktop centre nav.
  - DESIGN.md:271 gets one clause.
  - Part 0's 800×400 nested-scroller spec waits for the computed clip-path to reach `inset(0)` before it wheels, because clip-path affects hit testing.
- **Footer:** the bar's links power on in a stagger when the bar enters view (gap review). The bar docks with the frame, so it lands with the name's re-form. Never key it on `data-scene`: without WebGL2, or after a context loss, `data-status` is `unsupported` and `data-scene` freezes (use-dot-field.hook.ts:284-293, 780-784).
- **Contact success moment** (owner extra, gap review). Today the form unmounts and a `role="status"` line replaces it (contact.form.tsx:65-71). That collapses the height, which is a layout shift on phones, and focus falls to `body`.
  - **Keep the height.** Stack the form and the acknowledgement in one grid cell (`[grid-area:1/1]`). On success the form becomes `invisible`, which also removes it from focus and the accessibility tree, so the cell keeps its height.
  - **Motion and focus.** The acknowledgement `<p tabIndex={-1}>` wipes in left to right in the quote grammar (instant under reduced motion) and receives focus. It carries `scroll-mt-18` (rule 9), so on a short phone the focus scroll doesn't park it under the header. The rule 9 unit guard skips `tabindex="-1"`, so this one is set by hand.
  - **Drop `role="status"`.** Focus already announces the message, and keeping both double-reads. WCAG 4.1.3 doesn't apply to a message that takes focus.
  - Update contact.spec.ts:35 to `getByText(CONTACT_ACKNOWLEDGEMENT)` plus `toBeFocused()`.
  - The anti-spam checks (honeypot, two-second minimum, rate limit) are untouched.
- **Constraints** (the DOM contract still binds):
  - Animate inner elements only: never a scene container, a frame, an ancestor of a slot, or an ancestor of the canvas (rule 4).
  - Animate `transform`, `clip-path`, `mask` and `opacity` only. Named exceptions: the FAQ answer's height, and the cursor ring's size (Part 4).
  - Motion lives in small client leaf components, so the sections stay server components.
  - Under `useReducedMotion()`, every effect renders its final state (`INSTANT_TRANSITION`).
  - Content must be visible without JavaScript. Reveals arm only after hydration, never from a server-rendered hidden state, and text is never opacity-hidden from assistive tech.
  - **The existing reveals already break that rule** (gap review). Motion writes `initial` into the server-rendered style (framer-motion use-visual-state.mjs), so without JS there is no nav, no name, no tagline, no quote and no Projects heading today.
    - Tag each element Motion styles with `data-reveal`:
      - the header and its three group children (section-navigation.component.tsx:177, 192, 196, 204)
      - the wordmark wrapper and the h1 (hero.component.tsx:184, 217)
      - the tagline (:239) and the cue (:262)
      - the quote `<p>` (quote-section.component.tsx:59) and the figcaption (:75)
      - every new Part 3 reveal
    - Add one rule to globals.css: `@media (scripting: none) { [data-reveal] { opacity: 1 !important; clip-path: none !important; transform: none !important } }`.
    - Tag the elements themselves, with no descendant `*`: the wildcard would force the hero ghost span's 0.14 opacity to 1 and undo `sr-only`.
    - The rule is inert while scripts run, so the JS path and the hero pixel diff don't change.
    - If a `javaScriptEnabled: false` context doesn't match `scripting: none`, ship the same rule as `<noscript><style>` in page.tsx.
  - **Nothing that must end visible waits on `data-scene` or a pin alone** (gap review). Without WebGL2 the hook returns before publishing a scene, so `data-scene` stays `name`. In flow mode a step scene reports its container id.
    - **What `unpinned:` covers** (globals.css:19-27): an unsupported stage, or a container with `data-fit="flow"`. Only `StepScene` renders the fit gate (step-scene.component.tsx:156), so it covers step copy on both paths, but About and the footer only on an unsupported stage. Under it, every step's copy, the stats and the footer links render their final state.
    - **About never flows.** At 400% zoom its frame grows to the container's height, so its pin shrinks to about 1px. That is why the count-up and the footer stagger trigger on view, not on a pin or on `data-scene`.
  - **Arming** (gap review, widening the planning review's heading rule to every reveal):
    - Every reveal arms only if its element is outside the viewport (above or below) at hydration. Under replay, "above" matters too: after a deep link, the sections above it still reveal on the way back up. That covers the heading power-on, paragraph rise, hairlines, plates, the footer stagger, the address flicker, the count-up, and the existing quote and projects-heading reveals.
    - Anything in view then (a deep link, or a reload's restored scroll) keeps its server-rendered final state until it first leaves the viewport.
    - Arm from the observer's first callback, or by writing a DOM attribute through a ref (the status-attribute pattern), never with synchronous setState in an effect.
    - While armed, a reveal's element carries `data-reveal="armed"`.
  - **Reveals replay on re-entry** (owner, 2026-09-28, gap review; replaces "reveals play once").
    - A reveal re-arms once its element has fully left the viewport, and plays again when it re-enters (`once: false`, `amount: 0`). `QUOTE_VIEWPORT` and `PROJECTS_HEADING_VIEWPORT` switch to the same behaviour, with margin 0 (hero.data.ts:273-277, portfolio.data.ts:12-16). With `once: false`, a negative margin would hide the quote while it is still in the bottom band on the way back up.
    - A nav jump can no longer use up the reveals it flies past.
    - Under reduced motion nothing replays; the final state stays.
    - Load animations (the header drop-in, the hero intro) are not scroll reveals and are unchanged.
    - DESIGN.md:258's "It plays once" is updated.
  - A `whileInView` margin must already hold at the element's pinned position (rule 11).
  - **Margins are 0 or more** (gap review). Never a negative bottom margin, the house precedent (`QUOTE_VIEWPORT` −20%, `PROJECTS_HEADING_VIEWPORT` −10%). A power-on heading resting in an excluded band would stay at the 14% ghost, about 1.3:1.
- **Tuning:** every duration, stagger and feather goes in `src/data/motion.data.ts` (Part 0 creates it). `SIGNAL_EASE`, `INSTANT_TRANSITION` and the existing variants stay in `hero.data.ts`; reuse `resolveMotionTransition` (motion.rules.ts:5). Use the impeccable skill's `animate` reference for the pass.
- **Tests** (gap review):
  - **fit.spec's two scan tests** ("pinned scenes under WCAG text spacing" and "pinned scenes at 400% zoom", fit.spec.ts:311-364) get `test.use({ reducedMotion: "reduce" })`, as hero.spec.ts:352 does.
    - The scan moves the page inside one synchronous evaluate (fit.spec.ts:151-156), so no IntersectionObserver, scroll handler or RAF runs during it. Armed reveals never fire, so line-rise clips and the quote wipe would read as never-visible lines. (`data-scene` stays `name`, which leaves step copy lit under the handover rule.)
    - Reduced motion renders every final state, which is the layout that WCAG 1.4.12 and 400% zoom are about. Don't loosen the scan instead.
    - The 375×548 overflow test stays motion-on, so armed steps are still measured. These scans don't prove a motion-on reveal fires; the armed guard below does.
  - **Unit:** the scroll-spy resolver (including a non-centre id such as `faq`), and a check that `setActiveSection` keeps the menu open.
  - **e2e scroll-spy** at 1440: an instant scroll to each of `#services`, `#about`, `#project`, `#process` and `#blog` makes that Primary link `aria-current`, loading `/#about` marks About, and at `#faq` no Primary link is current.
  - **e2e hairline:** its computed x scale is about 0 at the top and about 1 at the bottom of the page.
- **Docs:** reword CLAUDE.md:113 to the new `aria-hidden` rule (see "Kept invariants"). In DESIGN.md: :258 (replay, and the quote now reveals on entry with margin 0 instead of 20% in), :271 (scroll-spy, menu wipe), the hairline entry and :118. In this handoff: DOM contract rule 11's "it is now −10%" becomes 0 (gap review).
- **Acceptance:**
  - screen recordings of a full scroll at 1440 and 390, signed off by the owner
  - before that sign-off, Part 2's frame check is re-run with Part 3 on, over the same route: no transit frame over 16ms on the owner's phone or on desktop with a smoothed wheel, using a Chrome Performance trace. Part 3 starts DOM motion in the dots' heaviest frames, the landing frame that writes `data-scene` (gap review)
  - reduced-motion screenshots with the DOM copy laid out as in Phase 2. The canvas (Part 1 changes its shapes), the new nav dot and the hairline are excluded (planning review).
  - a no-JavaScript render shows all copy: in a `javaScriptEnabled: false` context, every `[data-reveal]` element and every section h2 has computed opacity 1, clip-path none, transform none and mask-image none (the power-on hides with a mask). Assert computed styles, not `toBeVisible`, which counts opacity 0 as visible (gap review)
  - with `getContext('webgl2')` stubbed to null by `addInitScript`, again after `WEBGL_lose_context.loseContext()`, and at 320×256 (step scenes flowed): every step's copy is unclipped, the stats end at 5+, 500+ and 140 once in view, and the footer nav, email link and Back to top end at full brightness (gap review)
  - at 1440 and 390, a scroll resting mid-transit in Services shows every step's copy unclipped. This needs a new assertion that lets frames run (gap review)
  - armed-reveal guard, in fit.spec.ts: after each step of a stepped top-to-bottom scroll, with frames between steps so observers fire, no `[data-reveal="armed"]` element intersects the viewport, at 1440×900, 390×664, 375×548 and 740×304 (gap review)
  - `toMatchAriaSnapshot` while the flicker runs: `#connect` has a link named "Email me" and a paragraph with the address exactly once. The About `<dl>` reads its real values before the scene forms. Scope both to their sections; the footer also renders the address (gap review)
  - after a contact submit, the acknowledgement is focused and the Get in touch section's height hasn't changed (gap review)
  - the hero passes the pre-flight pixel diff
  - CLS 0, and e2e green

#### Part 4: the adaptive cursor

**Placement.** Last in 3B, after Part 3:

- It reuses `motion.data.ts` and `prefersFinePointer()` from Part 0.
- Part 3's nav dot already needs the round-thing amendment, so DESIGN.md changes once.
- Its scroll behaviour is tuned with Part 0 on, and its push state is checked against Part 2's landings.

**The owner's ask:** a circle that trails the pointer with an eased lag ("smooth drag"), micro-interactions on hover, adapting to the section, tied to the scroll. It is built as asked. "Smooth drag" is read as the trailing follow, not drag-to-browse; drag-to-browse would belong to the Phase 5 deck.

**Design change, needs the owner's sign-off.** A hollow ring is a second round thing on the site. These lines change:

- DESIGN.md:104 and :214: "The only round thing on the site is a dot." → "The only round things on the site are dots and the cursor's ring."
- DESIGN.md:113: "Zero radius. Dots are the only curves." → "Zero radius. Dots and the cursor's ring are the only curves."
- DESIGN.md:212: "The one curve in the system is the dot" → "The curves in the system are the dot and the cursor's ring".
- DESIGN.md:311: "…The only round thing is a dot." → "…anywhere except a dot or the cursor's ring."
- A new "Cursor" entry under Components records the anatomy, the states and the 0.3s state transition (a new duration).
- Colour stays on-system: white under `mix-blend-mode: difference` is an inversion, not a hue (DESIGN.md:123, :139). No shadow (DESIGN.md:208).

**Anatomy.** `src/features/portfolio/components/adaptive-cursor.component.tsx` (`"use client"`, `AdaptiveCursor`): one fixed wrapper with two children.

- **The dot:** 6px, Lamp White, drawn at the raw pointer. It is the precise pointer in every state, so hiding the native cursor costs no precision.
- **The ring:** 36px, a 1px Lamp White hairline at 0.4 opacity (Wire Grey's intensity, DESIGN.md:135), on a spring behind the pointer. This is the smooth drag.
- **The wrapper:** `pointer-events-none fixed top-0 left-0 z-50 size-0 mix-blend-difference forced-colors:hidden`, carrying `data-cursor-state`, which the tests key off. `forced-colors:hidden` (gap review) keeps a lagging ring off the native pointer when High Contrast is switched on mid-visit.
- **Colour:** `bg-white` and `border-white` are hard-coded, the one exception to Phase 2's "no hard-coded white". White is the difference operand, so the cursor reads white on black and black on the Lamp White fills ("Let's talk", "Email me", submit; DESIGN.md:277, :281). The cursor sits outside the stage, where tokens follow the OS scheme (DESIGN.md:148), so `bg-foreground` could resolve dark and blend to nothing.
- **Size:** the ring animates `width` and `height`, not `scale`, so the hairline stays 1px from 36px up to a push ring of about 600px. It is a fixed, out-of-flow leaf, hence the named exception in Part 3's property list.

**States,** resolved in this order; the first match wins:

| State    | Trigger                                                                                                 | Dot                                                            | Ring                                           |
| -------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| `hidden` | the pointer is outside the page, the last pointer was not a mouse, or `elementFromPoint` returns `null` | hidden                                                         | hidden                                         |
| `field`  | `closest("input, textarea, select")`                                                                    | hidden                                                         | hidden; the native cursor shows                |
| `action` | `closest("a[href], button:not(:disabled), summary")`                                                    | stays, with its own `mix-blend-difference`: a hole in the disc | fills into a 56px lit disc at opacity 1        |
| `push`   | `closest("[data-dot-slot]")` and the stage has `data-push-radius`                                       | stays                                                          | grows to `2 × data-push-radius`, as a hairline |
| `idle`   | anything else                                                                                           | 6px                                                            | 36px hairline                                  |

- **`hidden` inputs.** A mouse `pointermove` sets `isPointerInside` true; `pointerleave` on `document.documentElement` sets it false. Scroll and landing re-resolves pass it through, so `hidden` holds until the next mouse move. Any `pointerdown` or `pointermove` whose `pointerType` isn't `mouse` (a pen, or a touchscreen laptop, where a tap sends no move) hides the cursor and removes `data-cursor` from `<html>`. Window `blur` is not a trigger: after alt-tabbing back with a still mouse, the visitor would see no pointer at all.
- **`action`** covers the nav links and "Let's talk", the menu button, a project card's stretched link (when it has an https link), "Email me", the footer links, the FAQ `summary` and the submit button. The dot staying matters most on the FAQ, whose rows sit edge to edge: the lagging disc can still be over the previous row.
- **`field`** covers the two inputs, the textarea and the select. The select is a field because its option list is a native popup the cursor can't follow.
- **`push`** covers the six slots. When the fit gate drops a scene to dust, the slot loses `data-dot-slot`, so the cursor falls back to `idle` with no extra code.
- **Transitions:** `{ duration: 0.3, ease: SIGNAL_EASE }` through `resolveMotionTransition`.

**How sections adapt.** Through what they contain. No `data-cursor` attributes and no section edits: slot scenes get the push ring, the reading sections get the disc on their links and FAQ rows, Get in touch keeps the native caret. This follows "No per-section novelty", and every section stays a server component.

**Dot states: the cursor follows the engine.**

- **`push`** shows only while the hook's `canPush()` holds (use-dot-field.hook.ts:498-510): the intro has settled, reduced motion is off, `p` is whole and the keyframe has a slot. The ring then outlines the crater.
- **`moving`** needs no state. Dots in flight ignore the pointer (DESIGN.md:243), and the attribute is absent while they fly. The ring lets go as the scene leaves and swells when the next shape lands under the pointer.
- The push follows the raw pointer (use-dot-field.hook.ts:741-753) and the ring follows the spring, so after a fast move the ring reaches the crater's centre about 0.3s later. That lag is the intended drag.

**Engine edit (the only one):**

- **`dot-field.rules.ts`:** extract `resolvePushRadius(inkHeight, tuning)` from `stepDotPhysics` (dot-field.rules.ts:184-185) and call it from both places.
- **A new `publishPushRadius(frame)`** beside `publishSceneState()`, called at the same two sites (use-dot-field.hook.ts:495, :605). `drawSingleFrame` keeps its built frame in a local and passes it. It keeps its own last-written value, independent of `sceneState`. It deletes `stage.dataset.pushRadius` when the frame is null or `!canPush()`, and otherwise writes `resolvePushRadius(frame.from.inkHeight, …) / pixelRatio`, rounded to whole CSS px, when that changes.
  - Not inside `publishSceneState`: it returns early when the scene id is unchanged (use-dot-field.hook.ts:485-487). The hero reads `name` from server render through the intro, so the radius would never be written there, a resize would leave it stale, and a reduced-motion toggle on a formed keyframe would never delete it.
  - No new GL-effect deps and no `useState`.
- **Bind `pointerover`** next to `pointermove`/`pointerdown` on each slot (use-dot-field.hook.ts:865-866), and remove it in cleanup, so a slot arriving under a still pointer starts the push without a move. Verify it in Chromium.
- **CLAUDE.md:** add `data-push-radius` to the stage's status attributes.

**Scroll:**

- **Re-hit-test.** In `useMotionValueEvent(scrollY, "change", …)` on `useScroll().scrollY` (the pattern at section-navigation.component.tsx:61-65), run `document.elementFromPoint(lastX, lastY)` and resolve the state again. A still pointer changes state as links and slots scroll under it. No window scroll listener of its own. Chromium's own `pointerover` arrived about 170ms late during a Lenis scroll, so the cursor doesn't wait for it.
- **Landing.** A `MutationObserver` on the stage (`attributeFilter: ["data-push-radius"]`) resolves again with the last target, because no scroll or pointer event marks the moment a shape forms.
- **Velocity.** In `idle` only, the ring stretches along the scroll axis: `useVelocity(scrollY)` at 0–2400 px/s maps to `scaleY` 1–1.3, clamped and smoothed by the same spring. In `action`, `push` and `field`, `scaleY` stays 1, so a push ring keeps marking the crater and its hairline stays 1px. `useScroll` reads the native scroll Lenis drives; the cursor never imports Lenis.

**Follow:**

- `useMotionValue` x and y are set in a passive window `pointermove`, so a move causes no React render. React state holds only the resolved state, set only when it changes.
- The ring binds `useSpring(x)` and `useSpring(y)` with `{ stiffness: 200, damping: 28, mass: 1, restDelta: 0.5 }`: critically damped, trailing by about 0.3s with no overshoot.
- **Leaving `hidden`,** call `.jump(clientX)` and `.jump(clientY)` on the ring's springs first, so the ring appears under the pointer instead of sliding in from (0,0) or from the exit point.
- **0 RAF at rest, no loop of its own.** A settled spring cancels its frame (motion-dom `FollowAnimation.mjs:139-146`), and `useVelocity` stops 30ms after the last scroll (motion-dom `value/index.mjs:9, :272-278`).

**Mount.** `src/app/page.tsx` renders `<AdaptiveCursor />` beside `<SmoothScroll />`, after `<SitePage />`.

- Only `/`: the editor preview renders `SitePage` directly, and the root layout also wraps the dashboard.
- A sibling of the stage, never an ancestor of the canvas or a slot (rule 4), so it may transform freely. The stage is `isolate` (site-page.component.tsx:35), so the header's `z-50` counts only inside it, and the wrapper's `z-50` paints above the whole page.
- A `div`, never a `canvas`. It never carries `data-status`, `data-scene`, a heading or a label, and reads the stage with `document.querySelector(DOT_STAGE_SELECTOR)`. The strict counts hold.
- Out of `Hero` and `SitePage`, so the no-RAF assertions in `hero.test.tsx` never mount it.

**Gating:**

- The effect starts only when `supportsCustomCursor()` is true: `prefersFinePointer()` plus `(forced-colors: none)`, as `CUSTOM_CURSOR_QUERY` in `motion.data.ts`. Phones, forced colours and the unit-test `matchMedia` mock get no listeners.
- The server renders the wrapper as `data-cursor-state="hidden"`. Nothing reads `matchMedia` during render, so there is no hydration mismatch (a `console.error` the e2e specs count).
- The first mouse `pointermove` sets `document.documentElement.dataset.cursor = "on"`. Unmount removes it. Until then, and without JavaScript, the native cursor stays, and the hero pixel diff and lit-pixel counts never see the cursor.

**Native cursor.** In `globals.css`, outside any layer, so it beats `cursor-pointer` on the FAQ `summary` and `@layer base`:

```css
@media (forced-colors: none) {
  html[data-cursor="on"],
  html[data-cursor="on"] * {
    cursor: none;
  }

  html[data-cursor="on"] :is(input, textarea, select) {
    cursor: auto;
  }
}
```

The native cursor stays on form fields, on touch and pen, in forced colours, without JavaScript, before the first move, and everywhere under `/dashboard`.

**The media query** (gap review). The gate checks forced colours once, when the effect starts, and nothing listens for a later change. Without the `@media` wrapper, switching High Contrast on after the first move (Alt+Shift+PrtScn) would leave `cursor: none` in force. In a dark contrast theme the dot's forced Canvas colour then blends away. With the wrapper, the native cursor returns with no JavaScript, which keeps the "forced colours keeps the native cursor" promise below.

**Reduced motion.** `useReducedMotion()` gates it explicitly, because `MotionConfig reducedMotion="user"` (motion.provider.tsx:8) doesn't reach `useSpring`. The ring binds the raw x and y (no lag), `scaleY` stays 1, state changes use `INSTANT_TRANSITION`, and `push` never shows because the hook never writes the attribute.

**Accessibility:**

- `pointer-events: none` on the wrapper. The slots keep their pointer events, and Playwright clicks still land.
- No ARIA: the cursor carries no text, so it takes no `aria-hidden`, role or label. The `aria-hidden` rule in "Kept invariants" (decorative leaves or visual duplicates only; gap review) stays true.
- Focus is untouched; the focus rings stay (DESIGN.md:283).
- Trade-off: hiding the native cursor drops the visitor's OS pointer size and colour. Forced colours keeps the native cursor, and the unlagged dot keeps precision.

**Skipped:**

- **Magnetic pull.** Not asked for, and moving a CTA moves its hit area under the pointer. If wanted later, pull the ring toward the CTA's centre, never transform the CTA.
- **Press feedback.** The ask was hover.

**Rules, types and data:**

- `src/features/portfolio/cursor.rules.ts`: `resolveCursorState({ element, pointerType, isPointerInside, pushRadius })` returns a `CursorState` by the priority above, reading only `element.closest(…)`. `resolveRingDiameter(state, pushRadius, tuning)` returns the ring's diameter.
- `src/types/portfolio.type.ts`: `CursorState` (`"hidden" | "field" | "action" | "push" | "idle"`), `CursorStateRequest`, `CursorTuning`.
- `src/data/motion.data.ts`: `CURSOR_TUNING` (sizes 6, 36 and 56; ring opacity 0.4; the spring; the transition; the stretch 2400 and 1.3), `CURSOR_ACTION_SELECTOR`, `CURSOR_FIELD_SELECTOR`, `CUSTOM_CURSOR_QUERY`. The slot selector stays `DOT_SLOT_SELECTOR`.

**Tests:**

- **Unit, `cursor-rules.test.ts`:** a non-mouse pointer, `isPointerInside: false` or a `null` element gives `hidden` whatever else holds; a `span` inside a `summary`, an `a[href]` or a `button` gives `action`, while an `a` without `href` or a disabled `button` gives `idle`; `input`, `textarea` and `select` give `field`, and `field` beats `action`; inside a slot, `push` with a radius and `idle` with `null`; ring diameters 36, 56 and `2 × radius`.
- **Unit, `dot-field-rules.test.ts`:** `resolvePushRadius` returns 300 at an ink height of 294, and the `stepDotPhysics` tests pass unchanged.
- **e2e, `cursor.spec.ts`** on Desktop Chrome, with a reduced-motion block, keyed off `data-cursor-state` and the stage's `data-push-radius`.
- Existing specs stay green without edits from Part 4: anchors.spec.ts:72-80, contact.spec.ts:33 and the pointer sweep at hero.spec.ts:299-328. Part 3's contact success moment changes contact.spec.ts:35, not this.

**Acceptance:**

- Before any pointer move: no `data-cursor` on `<html>`, the wrapper reads `hidden`, and the hero at rest passes the pre-flight pixel diff.
- Still exactly one canvas, one `[data-status]` and one `<h1>`.
- At 1440×900: the nav link, "Let's talk", the FAQ `summary` and the submit button give `action`, with the dot visible. Each contact field gives `field`, with computed `cursor` of `none` on `body` and `auto` on the input.
- On `/`, after `data-status="running"` and the intro, hovering the name gives `push`.
- On `/#quote` with `data-scene="cube"`, the slot gives `push`, and 0.5s later the ring's width is `2 × data-push-radius` ±1px. Switching emulated reduced motion on removes `data-push-radius`, and the state leaves `push`.
- With a still pointer, an instant `scrollTo` that brings a link under it changes the state within two frames.
- Over the outgoing slot mid-transit (`data-scene="moving"`): no `data-push-radius`, state `idle`.
- After the pointer leaves the page, a scroll keeps the state `hidden`.
- After a mouse move, a `pointerdown` with `pointerType: "touch"` gives `hidden` and removes `data-cursor`.
- 0 RAF calls per 2s at rest in dust, after moving the mouse and scrolling with Part 0 on.
- Under reduced motion, the ring's centre equals the pointer on the frame after a move.
- After a mouse move (`data-cursor="on"`), `emulateMedia({ forcedColors: "active" })` makes `body`'s computed `cursor` `auto` and the `[data-cursor-state]` wrapper `display: none`. Switch forced colours on after the move, or the gate stops `data-cursor` from ever being set and the test passes without the fix (gap review).
- A Chrome Performance trace on desktop with a smoothed wheel, Parts 3 and 4 on and the mouse over the page, over Part 2's route: no transit frame over 16ms. Part 4 adds a re-hit-test and the velocity stretch to every Lenis frame. Phones attach nothing, so they need no re-run (gap review).
- The editor preview contains no `[data-cursor-state]`. No console errors, and the e2e suite is green.

### Phase 4: the bust (Who am I)

- **Reference:** ask the owner to re-share the reference image.
- **Mesh:** source a **CC0** quad-topology head-and-shoulders mesh. MakeHuman and MPFB exports are CC0. The owner approves it against the reference.
- **Bake:** `scripts/bake-bust.mjs` samples the vertices plus stipple along the edges, normalises to [-1,1]³ and quantises to Int16, writing `public/shapes/bust.bin`.
- **Runtime:**
  - Fetch the file lazily after the first draw. A procedural latitude/longitude head stands in until it loads.
  - A slow yaw oscillation.
- **Performance:** measure physics, projection and uploads while pushing the bust on a mid-range Android. Phones jump from about 1.5k name points to `SHAPE_POINTS`.
- **Motion:** the bust forms with Phase 3's choreography. The bake emits its points along the edge loops from the face outward, so its draw-on follows them (the pen key is the point's index; see Part 2).

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
- **`aria-hidden` on a wrapper hides everything inside it.** It once hid the `<h1>`. Keep it on decorative leaves, or on a visual duplicate of text that stays exposed (the Part 3 flicker and count-up overlays), never on a wrapper of readable content.
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
- **Cursor anatomy (Part 4).** Two yeses are needed before building it: the trailing ring, a second round thing that needs the DESIGN.md changes listed in Part 4, and hiding the native cursor everywhere except form fields. No words are planned in the disc; if the owner wants a label on a target (for example the Phase 5 plates), the owner writes it.
- **Smooth-scroll feel (Part 0).** The owner signs off `SMOOTH_SCROLL_LERP` with a wheel and a trackpad.
- **Part 3 motion confirmation.** Before building Part 3, the owner confirms its motion choices. The confirmation now includes the step-handover timing and heading-only CSS parallax (FAQ and Get in touch, tablet and up, only in browsers with scroll-driven animations). The extras and replay are already decided (below); only their look is confirmed.
- **Decided 2026-09-28 (gap review).** These are recorded, not open:
  - reveals replay on re-entry
  - the direction-aware sweep keeps the natural mirror
  - the extras: the mobile menu wipe-open, the contact success moment and the scroll-progress hairline
  - the scroll-spy defaults: the dot hides off the centre links and steps under passed links during a flight
- **Positioning.** PRODUCT.md still says "Full-stack product builder", while the owner's new copy positions branding, web design and development. The owner decides; don't rewrite it unasked.
- **Projects heading in the live record.** The seed defaults are now "Featured projects" and "Showcasing my most impactful work.", but the published site-content row keeps its old text until the owner sets it in the editor.
- **Send message button voice.** It is the only action not in the uppercase, tracked Label voice of "Let's talk" and "Email me". DESIGN.md documents the sentence-case primary button, so changing it is a system change for the owner (finish review ceiling item).
