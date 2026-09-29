# Handoff: the dot-art redesign

> **For:** the next Claude Code session picking up this build.
>
> **Current phase:** **Phase 7, the Services restyle and one scroll rule.** Phase 6 is done: every dot object is drawn in one material and tells the one-product story, and its done note lists what is open. The design is locked to mockup B ("Statement", with `B-desktop-1` as the reference); the renders are in `plans/mockups/`. To resume, paste the prompt under "Start here".
>
> **Branch:** `portfolio/phase-3`. The direction lock, this phase plan and the mockup renders are committed in `29e7284`, on top of Phase 3's `0f198b2`. Phase 4's DESIGN.md rewrite is `6d11e7c`, Phase 5 is `ca4d45c`, and Phase 6 is the commit after it. Nothing is pushed.
>
> **How this file works:** each phase is one conversation. It lists its scope, the owner inputs it needs and its acceptance. It ends with the prompt that starts the next conversation. When a phase ends, write its done note under it, move "Current phase" forward, and give the owner the next prompt.
>
> **History:** the full notes for Phases 1–3 are in git: `git show 0f198b2:plans/handoff.md`. That covers the pre-flight, Parts 0–4, the planning and gap reviews, and the Departure Board, Signal Wire, Services thread and Orbit redirects. The hero, quote, burst and editor rationale is in `git show 0a3c97a:plans/handoff.md`.

## Start here

Paste this into a new conversation to resume the current phase:

```text
Continue the portfolio redesign: Phase 7, the Services restyle and one scroll rule.
Read CLAUDE.md (especially the Services and glide-lock paragraphs), then plans/handoff.md ("Direction", "The DOM contract", Phase 6's done note and "Phase 7"), and DESIGN.md.
Build Phase 7 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 8, and end your reply with Phase 8's prompt from the handoff.
Ask me before committing.
```

## Direction (owner redirect #4, 2026-09-29)

**Why.** A four-lens audit (visual system, story and voice, design lineage, motion) read the live page at 1440 and 390. A synthesis and a critic followed. The findings:

- **No idea above the sections.** Each section was designed alone against its own reference: the hero from adriavale, the shapes from jeffmilanes, the orbit from buckssauce, and the lower half from landing-page blocks. The owner chose every piece deliberately; nobody checked how they add up.
- **DESIGN.md fixes only the surface.** Black, square, Antonio/Geist and brightness hold everywhere, but there is no layout rule, so the composition axis changes at almost every section.
- **The dots change material four times.** The name is an LED lattice, the shapes are chalk stipple, the About/Projects sphere is a particle globe and the dust is a starfield. The shapes are icons of each section's title, and the cube and browser repeat.
- **How I work is alien because of two parts,** both confirmed by the owner:
  - the white label plates, the brightest surface on the page
  - the dot shape shrunk to a corner "mascot"

  The owner likes the big hollow numbers and the turn.

- **The page follows four scroll rules:** scrubbed, triggered and locked, scrubbed again, and free.

**The owner's answers.**

| Question                     | Answer                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| One thing a client remembers | I build whole products                                                                                                                      |
| What I sell                  | Branding, web design and development, as one package                                                                                        |
| Client                       | Founders, small businesses and agencies equally                                                                                             |
| Feeling                      | Calm, precise, premium                                                                                                                      |
| Big idea                     | The dots build one product: the name's dots build one product stage by stage and come home to the name                                      |
| Orbit                        | The orbit joins the page. The white plates and the corner dots go; the big hollow numbers and the turn stay                                 |
| Motion                       | Every section moves, in one style: the left-to-right light sweep for text, the pen-order draw for dots                                      |
| Scroll                       | Trigger, play, no lock. A shape plays by itself on arrival, and the reader can always keep scrolling. This replaces the Services glide lock |
| Emphasis                     | Big bold text for emphasis                                                                                                                  |
| Voice                        | Short, plain, precise. First person. The owner approves every line                                                                          |
| Order                        | Work first                                                                                                                                  |
| Rebuild                      | Restyle, keep the engine                                                                                                                    |
| About                        | A real photo, no dots. The bust is cancelled                                                                                                |
| Material                     | The owner will send real projects, a belief line, their story and photo, and client words. Projects stay placeholders, with images, for now |
| Next step                    | Whole-page mockups before any build                                                                                                         |

**The page rule.** Every screen shows one dot object and one big, bold statement. Everything else is quiet signage.

- **Big type is emphasis only:** the name, the belief line, one statement per section and the How I work numerals.
- **Every section label is quiet signage,** the same on every section: a small, tracked `<h2>` such as "My services · 02 / 03". This replaces "My services" being the only small label. The statement is the big type.
- **One motion style:** the light sweep (about 0.9s, `SIGNAL_EASE`) for text and the pen-order draw for dots. No new per-section tricks.
- **The dots draw ideas and frame real things.**
  - **Ideas are drawn in dots:** the name, the cube, the product being built.
  - **Real things are framed by dots:** a project image, the owner's photo, a client's photo or logo.
  - Every screen is plain black: no dotted background texture.
- **One scroll rule:** trigger, play, no lock.
- **Monochrome stays.** This is a default taken from "calm, premium"; the owner was not asked about colour.

**Order.**

1. Hero (`#home`)
2. Belief quote (`#quote`)
3. Projects (`#project`)
4. Services (`#services`)
5. How I work (`#process`)
6. About (`#about`)
7. Testimonials (`#testimonials`)
8. FAQ (`#faq`)
9. Contact (`#contact`), with Let's connect's email merged in, so the page ends once
10. Footer

- **Nav:** Work · Services · Process · About · FAQ, plus "Let's talk".
- **Blog** is hidden from the page and the nav until real posts exist; its code stays.

**The dot story** (the mockup canvas's first artboard shows it):

1. The name.
2. The idea (the cube).
3. The finished products (the dots frame each project plate).
4. Brand, design and code: the thread builds one product through the mark, the mark in a page layout, and the layout opening into code.
5. Five steps of the same page: a loose ring (listening), a grid (planning), a wireframe (visualising), the built page (building), the page lifting off on a trail of dots (delivery).
6. Real people: the dots frame the owner's photo (About), then a client's photo or logo (Testimonials).
7. FAQ is plain black: the dots are out of the way while people read.
8. The dots gather round the form.
9. The name comes home.

**Per section.**

- **Hero:** kept as it is. The tagline is replaced by the owner's own line.
- **Quote:** kept, with the cube as "the idea". The owner's belief line replaces the placeholder.
- **Projects:**
  - It moves up.
  - The placeholder cards get neutral monochrome placeholder images, clearly placeholders. No invented names, clients or outcomes.
  - The dots frame the active plate.
- **Services:**
  - The one-line thread and the triggered draw stay.
  - The three shapes become three stages of one product.
  - Numbered items replace the tag cloud, and the copy is cut short.
  - The glide lock goes.
- **How I work:**
  - The orbit's turn and the big hollow numerals stay.
  - The white plates and bullets go, and the step title becomes plain big Antonio.
  - The ring is drawn as a row of dim dots.
  - The dot shape returns to centre stage at full size.
  - The five shapes become five states of one page.
  - The turn becomes triggered, like Services.
- **About:**
  - "I am Criztian." as the statement on the left, with the story and stats under it.
  - The owner's real photo on the right, framed by dots like a project plate. The photo itself is never made of dots.
  - The sphere and the bust go.
- **Testimonials:**
  - The client's words as the statement on the left, with the attribution under them.
  - The client's photo or logo on the right, framed by dots.
  - Bracketed placeholders until the owner sends real quotes, with permission.
- **FAQ:** the owner confirms that each answer is still true. It is their copy.
- **Contact:** the email line sits beside the form.

**Parked (not cancelled):**

- the adaptive cursor (old Part 4)
- the cursive logo
- the Connect address flicker, which brought back the rejected departure board
- heading parallax
- any other new per-section effect

The owner decides on each in Phase 10.

**Standing rules** (carried from the first brief):

- **No invented content.** Gaps stay as visible placeholders (PRODUCT.md "Never fabricate").
- **The owner's own words.** Voice is first person. Shortened drafts need the owner's OK before they ship.
- **Where content lives.** The hero, quote, projects and theme render from `SiteContent` (the editor). Every other section is hard-coded in `src/data/*.data.ts`, with types in `src/types/`. Leave the site-content schema and the editor alone unless a phase says otherwise.
- **Stats:** three, the owner's: 5+ years experience, 500+ projects done, 140 happy clients.
- **Email:** `mailto:criztiandev@gmail.com`, a constant in `src/data`.

## The owner's copy

Typos are fixed and the voice is switched to "I". This is the source text.

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

### Short drafts (approved by the owner, 2026-09-29)

The mockups use these, and the owner approved them all. Use them in place of the long versions above wherever they apply.

- **Hero tagline:** "I build whole products. Brand, design and code."
- **Branding:** "Brand stories that connect with your audience and build long-term trust."
- **Web design:** "Creative and functional, with no AI slop. Every layout and interaction is made for your brand."
- **Development:** not drafted yet (the mockups don't show it).
- **Bringing it to life:** "I build your project with precision and care."
- **Delivering success:** "I launch it, then keep supporting and improving it."
- **About:** "Branding, web design and development, made for your business."
- **Section labels:**
  - "Work · 01 / 03"
  - "My services · 02 / 03"
  - "How I work · 04 / 05"
  - "Who am I"
  - "Testimonials · 01 / 03"
  - "FAQ"
  - "Get in touch"
- **Contact:** "Or email me: criztiandev@gmail.com"

## What is built today

- **Phase 1, the engine** (`3f58984`), and **Phase 2, page structure and system** (`ba153d4`), reached `main` in `5c2173c` (PR #1). They cover:
  - one fixed canvas with a scroll timeline
  - every section in the old order
  - the fit gate
  - the token pass
- **Phase 3** on `portfolio/phase-3`:
  - Part 0, Lenis smooth scroll (`39f62f5`)
  - Part 1, the line-art shape library (`00d54b9`)
  - Part 2, the dot choreography: pen draw-on, burst, swell and strike (`f33d351`)
  - the Services thread with its glide lock, and the How I work orbit (`0f198b2`)
- **Phase 5** (`ca4d45c`): the B page order, the approved copy and the B surface for the quote, Work, About, Testimonials, FAQ, Contact, the header and the footer (see its done note).
- **Phase 6** on `portfolio/phase-3`: the one-product dot shapes in one material, the plate frames, the Contact gather as its own gated scene, and FAQ on plain black (see its done note).
- **Not built:** old Part 3 (section motion, now Phase 10) and old Part 4 (the cursor, parked).
- **Last evidence (2026-09-29):**
  - 366 unit tests pass and `pnpm check` is clean.
  - e2e was green on a production build at :3100, with Supabase up.
  - The hero pixel diff against `0a3c97a` held with the pre-flight carve-outs (header band, cue row, and the name-dot ceiling). The method is in the history.

**Carried-over open items,** each assigned to a phase:

| Item                                                                                                                    | Phase    |
| ----------------------------------------------------------------------------------------------------------------------- | -------- |
| Services curtain bug: under reduced motion, earlier captions ride up over the slot (`not-last:mb-*` → `not-first:mt-*`) | 7        |
| Copy crossings: transit dots cross copy columns at full brightness                                                      | 11       |
| `resolveViewportHeight` with grown frames shifts dust boundaries: fixed in Phase 5, it reads the shortest pinned frame  | done (5) |
| Transit captures of every scene, both directions, and the owner's "wow and professional" sign-off                       | 11       |
| The 16ms frame trace on the owner's phone (ask for an Android with USB debugging)                                       | 11       |
| Safari 26 on an iPhone (scroll-driven animations, Lenis at 60fps)                                                       | 11       |
| The real-phone fling test (Phase 1)                                                                                     | 11       |
| The smooth-scroll feel sign-off (`SMOOTH_SCROLL_LERP`)                                                                  | 11       |
| The published-content read is cached for a year (tag it and `revalidateTag` on publish, or make it uncached)            | 11       |
| The Projects heading in the live record still has old text: retired with the intro (owner, Phase 5)                     | done (5) |
| Existing reveals hide content without JavaScript (`data-reveal` plus `@media (scripting: none)`)                        | 10       |

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
  - Each shape is generated once, by a seeded pure generator, at its tuned `pointCount` (Phase 6: 12,000 for the drawings, 7,200 for the cube). `SHAPE_POINTS` is the largest count and the buffer size.
  - Points past a shape's own count are padded and hidden.
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
- **Static drawing:** `isStatic = reducedMotion || paused`, so a pause toggle reuses the path.
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
- **Accessibility:** `aria-hidden` goes only on decorative leaves (the canvas, empty slots, icons, step numbers) or on a visual duplicate of text that stays exposed. Never on a wrapper of readable content.
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
   - `ServicesSection` and `ProcessSection` implement this in their unstaged layouts. Process's maths: the frame and the list share one grid cell, the list starts `--orbit-step-top` below the top (the band, or the heading and slot in split), each step is `F − step-top` tall and sticks at `step-top`, and `not-first:mt-[pitch − (F − step-top)]` keeps step `k` docking at `k·pitch`. Space docked curtains with `margin-top`, never `margin-bottom`: a sticky element's margin box must stay inside its containing block, so a bottom margin pushes every stuck curtain up by that margin as the list ends. The last step unsticks together with the frame.
9. **In-scene anchors.** Every `id` inside a scene has `scroll-margin-top` equal to that scene's `stickyTop` (`scroll-mt-18`). A larger margin lands before the pin starts. `data-scene` then reads `moving`, and if a spinning shape is the outgoing one, the loop never sleeps.
   - **Focusables too.** Every focusable inside a scene also carries `scroll-mt-18` (`FOCUS_RING_CLASS` does). This keeps a Shift-Tab target clear of the 72px fixed header, because `scroll-padding-top` is banned.
10. **Dust scene endings.** The last section of a dust scene is at least one frame tall (`min-h-[calc(100svh_-_4.5rem)]`). Otherwise its anchor lands in the transit to the next scene, with a half-formed shape over it. `#contact` needed this until Phase 6; now FAQ is the dust scene's only section and carries it at every width.
11. **Reveals on pinned elements.** A pinned element never moves, so a `whileInView` margin must already hold at its pinned position. The old projects heading sat at 65% of a phone screen behind a −40% margin and never revealed until it moved to −10%; Phase 5 retired that heading and its reveal.
12. **Frames that can grow, grow.** A single-frame scene (Quote, About, Testimonials, footer) uses `min-h-[…]`, never a fixed `h-[…]`. Contact is the exception and follows rule 13 instead: its gather needs the whole form in one pinned frame, and a grown frame would hide the submit button for the length of the pin. Its pin length comes from a fixed spacer after the frame (`PIN_SPACER_CLASS`: 50svh; 60svh for the quote, 25svh for the footer; hidden without WebGL), never from a container `min-h`: a grown frame then keeps its whole pin instead of dropping it to zero (Phase 5 review). Work's frame is an exception: it is fixed and holds only the slot, and its project screens sit in normal flow with `min-h`, so they grow instead. Step boxes are the other exception: they are fixed and join the gate (rule 13), because a step that grows would move the next step's docking point. Zoom or WCAG text spacing then lengthens the frame instead of clipping or overlapping the copy. The engine re-reads frame and container heights on every measure.
13. **The fit gate.** A docked step cannot grow: it is sticky, and a taller step is covered by the next one. So each step scene (`ServicesSection`, `ProcessSection`) renders `SceneFitGate` (a hidden `<span>`) as its **last** child. The frame stays first. `ContactSection` does the same, with its fixed-height frame as the fit box (Phase 6). How it works:
    - It checks every `[data-fit-box]` step.
    - If one overflows, it sets `data-fit="flow"` on the container, removes `data-dot-slot` from the slot and sets `data-dot-shapes="dust"`. The engine re-reads both attributes on its next measure, so the scene becomes a plain dust scene. It never sees a hidden 0×0 slot.
    - When everything fits again, it restores both attributes.
    - The check runs in `requestAnimationFrame`, scheduled by a ResizeObserver (on the container, each box's children and the slot) and by `document.fonts.ready`. It never mutates layout inside the observer callback, because that raises ResizeObserver loop errors, which the e2e specs count as page errors.
    - When a switch moves an element that has focus inside the scene (a Contact field whose errors just appeared or cleared), the gate scrolls by the same amount, then scrolls it into view if a stuck frame made that inexact; otherwise it keeps a reader who is past the scene in place (Phase 6).
    - The `unpinned` variant styles flow mode and the no-WebGL path with one class list.
    - Any new sticky, fixed-height copy box must join the gate or follow rule 12.
14. **Staged step scenes.** Under the `staged` variant a step scene's copy sits on one board instead of scrolling:
    - **The board** is the container's second child, a sibling of the frame, never an ancestor of the slot. It is sticky, transparent, and ends with the container, so it pins on exactly the frame's pin range. The orbit's board is frame-tall at `top-18` and `pointer-events-none` because it covers the frame and the engine listens for pointer events on the slot itself. Only the numeral, plate and paragraph take pointer events when staged (the numeral so fit.spec's `elementFromPoint` scan can reach its digits); unstaged, the whole curtain does, so covered text can't be hovered or selected. The split slot must stay clear of the numeral's box (0.96em wide, starting 0.078em above the ink), not just its ink.
    - **The container height is explicit** and equals the Phase 2 height: `F + (n − 1)·pitch`, where pitch is `F − band` in portrait and `F` in split. Staging on or off therefore never moves a pin, an anchor landing or the slot rect, and the engine needs no re-measure.
    - **Measured before staging.** The hook's first measure (use-dot-field.hook.ts:331) and the gate's first check run while the stage is `idle`; `running` (:1173) switches `staged` on later and triggers neither. So the slot rect, the container height and every step box must be identical in both modes. `step-motion.spec.ts` flips the stage attribute and compares them.
    - **Copy motion reads only the container's `--step-scene` view timeline** (`view-timeline-inset: 4.5rem 0`, so `exit-crossing 0` is the pin start), through `exit-crossing` length offsets in `--pitch` units from `resolveStepHandover`. Nothing in the stylesheet keys on `data-scene`. (Phases 7 and 8 replace the scrubbed copy motion with triggered transitions keyed on `data-thread`; update this rule then.)
    - **Rule 8 in staged mode:** the board is transparent. Nothing scrolls under the band during the pin, so the opaque ground isn't needed, and the portrait exit transits are visible. The opaque sticky steps remain in the fallback layout.
    - **Rules 12–13:** the Services board and each orbit step are fixed-height `[data-fit-box]`es, so an overflow flows the scene through the gate. The orbit board itself is not a fit box: its rotated neighbours would count toward its `scrollHeight`. It is `overflow: clip`, so they never widen the page.

In-page anchor clicks snap the timeline to the destination scene (`onAnchorClick` in the hook). A smooth nav scroll therefore does not flash through every shape on the way. The snap is cleared on arrival, `scrollend`, wheel, touch or a key press.

## Phases

Each phase is one conversation.

- **Before building:** ask the owner the phase's open questions with the ask tool. Never invent content.
- **At the end:**
  1. Run the acceptance.
  2. Write a short done note under the phase: what shipped, the evidence and what is open.
  3. Move "Current phase" at the top forward.
  4. Give the owner the next phase's prompt, which is the code block at the end of the phase.
- **Committing:** ask before committing. PowerShell 5.1 splits `-m` at quotes, so write the message to a file and use `git commit -F`.

### Phase 4: direction and mockups (done)

**Goal.** The owner picks the look from whole-page mockups, approves the short copy, and DESIGN.md is rewritten to the picked system before any section code changes.

**Done (2026-09-29):**

- **The audit and the brief:** the "Direction" section above.
- **PRODUCT.md:** positioning, voice, planned order and the material on its way.
- **A feedback memory:** whole-page mockups before building.
- **The mockup canvas** https://claude.ai/artifact/JfBhfHpocuCtfDmcTkahob (private; the owner can share it from its Share menu):
  - **"The dot story":** the whole sequence of dot objects.
  - **A, "Stage":** the quote composition everywhere. A large centred dot object with one big statement below it.
  - **B, "Statement":** a very large left-aligned statement with the dot object beside it; stacked on a phone.
  - **Four artboards each** (desktop and phone, two halves each), showing:
    - the new order
    - the reworked How I work
    - Services' one-product shapes
    - the reading screens
    - the About photo
  - **A sticky note** listing the drafts to approve.
  - **How the art was made:**
    - The name and the cube are crops of the live engine.
    - The new shapes are sketches in the same chalk-stipple material. They were drawn by a scratch Canvas2D script that no longer exists; "Shape geometry" in Phase 6 records their geometry.

**The owner's pick (2026-09-29): B, "Statement".** In the owner's words: "I love the B1. It leads to my design. B1 is the thing that I want and I love." B1 is `B-desktop-1`: Hero, Belief, Work, Services and How I work. When asked about the rest, the owner said: "I love the B1 whole design, make it the same like that." So B2 and the phone artboards were matched to B1 the same day:

- **Plain black everywhere:** the dotted grid background is gone.
- **About:** the statement on the left, with the photo on the right framed by dots like a project plate.
- **Testimonials:** turned into the same split, with a dot-framed "[Client photo or logo]" plate on the right.
- **Phone:** each object comes first, as in B1's phone screens.
- **The dot story's tile 12** now reads "Real people".

**Locked (owner, 2026-09-29): "B · Statement · Desktop 1/2, I still love this, please lock on this design."** B1 is the reference for every future screen. When a later phase is unsure how something should look, match B1.

- **Renders in the repo:** `plans/mockups/b-desktop-1.jpg` (the reference), `b-desktop-2.jpg`, `b-phone-1.jpg`, `b-phone-2.jpg` and `dot-story.jpg`.
- **The source of truth for exact markup** is the canvas, on the owner's account. Artboards `B-desktop-1.dc.html` and the rest are readable with the Artifact tool (`read` with a `path`).

What B means, as the mockups built it:

- **Desktop:** a two-column split.
  - **Left column** (about x 40–760): the label `<h2>` at the top left, then the statement very large and left-aligned, with body and details under it.
  - **Statement sizes:** 176px; the belief line 136px (max 11ch); FAQ 240px; contact 128px on three lines.
  - **Right column** (about x 800–1400): the dot object, large and vertically centred. The dot-framed plates (the project image at 700×490, the About photo at 480×600, the client plate at 440×440) and the contact form sit there too. The testimonial statement is 120px.
- **How I work (B):** the hollow numeral about 340px on the left, centred on the dotted ring (circle centre x 440), with the title and body under it. The dot shape is about 560px on the right, beside the ring and not in a corner. Only the previous numeral peeks in at the left edge.
- **Phone:** left-aligned throughout.
  - **Order:** the dot object first, full width, then the statement at 72px (belief 52px, FAQ 110px, contact 52px), then the details.
  - **How I work:** the ring stays centred, with a 150px numeral and a 44px title.
- **Kept from both variants:** the hero exactly as today, the label style, the numbered item lists, and the header and footer.

**Decisions (owner, 2026-09-29):**

1. **The short drafts:** approved ("yes").
2. **The About photo:** black and white. The question was "black and white or colour?" and the owner answered "yes"; this takes the first option, which also keeps the monochrome rule. Confirm when the photo arrives.
3. **How I work's ring:** its dots drift with the scroll all the time. Again "yes" to an either/or question, read as the first option. Confirm when the owner scrolls Phase 8.
4. **Contact:** yes, the dots gather round the form. Contact becomes its own scene with a slot (Phase 6).
5. **The About stats:** count up (Phase 10).

**Scope (what remains).**

- Update "Direction" and PRODUCT.md if the DESIGN.md work turns up anything they miss.
- **Rewrite DESIGN.md to the picked system:**
  - the page rule
  - a Statement type role, with sizes from the picked variant, for desktop and phone
  - the section label as the one `<h2>` style
  - the hollow numerals kept, and the plate exception removed
  - the ring as dim dots (update the Square Signal Rule: "dots, and rings drawn in dots")
  - "the dots draw ideas and frame real things", with plain black behind every screen
  - one motion style and one scroll rule
  - the new nav and order
  - Components: rewrite Thread (no glide lock), Orbit (no plates, dots centred, triggered turn), Projects (the deck with a dot frame), About (the photo framed by dots) and Testimonials (the quote as the statement, a framed client plate); remove the bust
  - References: say that adriavale, jeffmilanes and buckssauce are history, and that the one idea is "the dots build one product"
- **Leave these alone:** code, tests and CLAUDE.md. CLAUDE.md changes with each phase that changes behaviour.

**Acceptance.**

- `pnpm format:check` passes.
- The owner has read the DESIGN.md changes and said yes.

**Done note (2026-09-29).**

- **Shipped:**
  - **DESIGN.md rewritten to B.** It covers:
    - the page rule, the one idea and the references as history
    - Rule Grey for dividers
    - the Statement, Numeral, Title, Item and Section label roles (Headline is gone)
    - the statement split and the new order
    - "dots, and rings drawn in dots"
    - a Motion section with the One-Motion and One-Scroll rules
    - the Dot Story and the Draw-and-Frame Rule
    - Thread, Orbit, Projects, About, Testimonials, FAQ and Contact rewritten for B
  - A status note at its top says which parts the code doesn't show yet.
  - **PRODUCT.md:** the planned order no longer waits on mockups, and the tagline is recorded as decided.
  - **This handoff:** the gaps below were added to Phases 5, 8 and 11 and to "Open owner decisions".
- **Evidence:**
  - `pnpm format:check` passes.
  - A five-lens review of the draft read it against its sources:
    - the Phase 4 scope
    - fidelity to the canvas markup
    - code truth
    - regressions against the old DESIGN.md
    - accessibility and product
  - An adversarial judge then went through the findings: 61 raised, 33 confirmed and fixed, 28 rejected as duplicates, target-state or nitpicks.
  - The owner said yes.
- **What the review changed from the first draft:**
  - Statement sizes are caps, not fixed points. In the split a statement sizes from its column, and a word that can't wrap steps down: "Development" needs about 144px on desktop.
  - FAQ is the named exception to the page rule and the One-Statement Rule.
  - Numerals are hollow, so the ring shows through.
  - Form text stays 16px on phones (iOS zoom).
  - The focus ring is half-strength Lamp White. The shadcn `--ring` fails WCAG 1.4.11 on the public stage today.
  - Reveals and the stats count-up replay on re-entry, as decided on 2026-09-28.
  - The ring's dash gap is in `pathLength` units.
  - The Services shapes' sway joins the WCAG 2.2.2 gap.
- **Open:**
  - The Send message button's voice.
  - How several testimonials step through.
  - The Projects heading and intro, which B has no place for (Phase 5 asks).
  - `.impeccable/design.json` has been stale since Phase 3; regenerate it in Phase 11's docs pass.

**Next conversation prompt (starts Phase 5):**

```text
Continue the portfolio redesign: Phase 5, page structure and copy.
Read CLAUDE.md, then plans/handoff.md ("Direction", "The DOM contract", Phase 4's done note and "Phase 5"), PRODUCT.md and DESIGN.md.
Follow the mockup pick and the approved copy recorded in Phase 4. Ask me Phase 5's open questions first.
Build Phase 5 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 6, and end your reply with Phase 6's prompt from the handoff.
Ask me before committing.
```

### Phase 5: page structure and copy

**Goal.** The page runs in the new order, with the new section set and the approved copy. The reading sections take the picked composition. The dot shapes don't change yet: Projects keeps its placeholder sphere until Phase 6.

**Owner inputs.**

- Confirm the placeholder project images (the monochrome plates from the mockups, or others).
- The Projects heading and intro. B shows neither: the label "Work · 01 / 03" stands in for the heading, and the intro has no slot (DESIGN.md, Projects). Ask whether the editor's heading drives the label's name and the intro is retired, or both are retired. Only if they stay, ask the owner to publish "Featured projects" and "Showcasing my most impactful work." in the editor. The schema stays as it is either way.

**Scope.**

- **`SitePage` order:**
  1. Hero
  2. Quote
  3. Projects
  4. Services
  5. How I work
  6. About: a pinned single-frame scene, its slot on the photo
  7. Testimonials: a new pinned single-frame scene, its slot on the client plate
  8. one dust scene holding FAQ and Contact
  9. Footer
  - **About and Testimonials follow rule 12** (`min-h` frames). Their slots keep the placeholder sphere until Phase 6 brings the `frame` shape.
  - **Rules 7 and 10 still hold:** every section is covered, and `#contact` is at least one frame tall.

- **Nav** (`src/data/portfolio.data.ts` navigation):
  - Primary: Work, Services, Process, About, FAQ.
  - The mobile panel lists every remaining anchor. Keep the `about` and `contact` `PortfolioSection` ids the tests use.
- **Blog:** remove it from the page and the nav. Keep `blog-section.component.tsx` and its data for later.
- **Connect:** merge into Contact. The "Or email me" line goes beside the form, and `ConnectSection` leaves the page. Keep `OWNER_EMAIL_HREF`.
- **About:**
  - the photo plate on the right (B), with a placeholder image and a bracketed "[Your photo]" chip until the photo arrives; the file goes under `public/about/` and shows in black and white (Phase 4 decision 2)
  - the statement "I am Criztian."
  - the approved copy
  - the stats as a `<dl>`
  - the slot sits on the photo plate
- **Testimonials:** the B split, with the quote as the statement and a placeholder client plate with a "[Client photo or logo]" chip on the right.
- **Backgrounds:** no texture anywhere.
- **Projects:**
  - three neutral monochrome placeholder images in `public/projects/`, set in the seed defaults (`src/data/site-content.data.ts`)
  - the owner re-publishes in the editor so the live record shows them
  - the section label and statement layout from the pick; the cards stay a list until Phase 9
- **Copy:**
  - apply the approved drafts to `src/data/page-sections.data.ts`
  - the tagline and quote live in `SiteContent`: the owner updates them in the editor, or the seed defaults change if they are still seed
- **Typography:** add the Statement role and the label `<h2>` style as shared classes in `src/data/page-sections.data.ts`. Apply them to Quote, Projects, About, Testimonials, FAQ and Contact. Services and How I work change in Phases 7 and 8.
  - **The Statement scale:** in the split it sizes from its column (container units), with a rem term for zoom. The mockup sizes are caps (DESIGN.md, Statement). Check each statement at the fit sizes and at 768×1024 and 1024×768.
- **Surface** (DESIGN.md's status note lists what the code still shows):
  - Body at 18px from 768px and 15px on a phone.
  - Title at 56px and 44px.
  - Cue at 11px with 0.22em tracking at every width.
  - Rule Grey as its own token for dividers (the header rule, the lists, the FAQ rows, the stats and the footer). `--border` and `--input` stay Wire Grey.
  - Nav links stay Lit Grey on the solid header, and the brand's © is Dim Grey.
  - The Contact action's padding is 10px × 20px.
  - The form:
    - 44px fields with 12px padding, 16px text below 768px and 15px from 768px
    - a 112px message box
    - a full-width 48px submit
    - a form box that grows (at least 520×440)
    - a Lit Grey chevron
  - `--ring` points at the foreground with the other public token overrides, so the vendored controls get the half-strength Lamp White focus ring (WCAG 1.4.11).
  - Footer items are at least 44px tall below 1024px.
  - The 80rem section cap goes. Set the maximum content width beyond 1440 and keep the column ratios below it, then record both in DESIGN.md.
- **Tests:**
  - `site-page.test.tsx`: order, no Blog, no Connect, one `<h1>`, rule 9 focusables
  - `anchors.spec.ts`: the anchor list and deep links
  - `hero.spec.ts` `SCENE_WALK`: the new order, with About after How I work (its slot on the photo plate) and Testimonials as a new scene
  - `fit.spec.ts`: About and Testimonials pin as single-frame scenes (rule 12)
  - `contact.spec.ts`
- **Docs:** update the CLAUDE.md lines that name the old order or the Connect and Blog sections.

**Acceptance.**

- `pnpm check` and the unit tests pass.
- Every e2e spec passes on a production build at :3100 with Supabase up (see Landmines).
- The fit sizes in Landmines pass.
- The hero pixel diff holds, with the header band masked because the nav changed.
- Strict counts hold: one canvas, one `[data-status]`, one `<h1>`.
- Captures at 1440 and 390 match the picked mockup's structure.

**Done note (2026-09-29).**

- **Owner answers** (asked first, all recorded under "Open owner decisions"):
  - The Projects heading and intro are retired: they left the page and the editor panel, and the schema still stores them.
  - Until Phase 9's deck, Work is one B screen per project.
  - The plates use the mockup's placeholders: the grey glow for projects, the circle for the photo, the stripes for the client plate.
  - The owner's draft was written for them to review and publish (below).
  - The submit button is uppercase.
  - Testimonials shows no count while it has one quote.
  - All nine FAQ answers are still true.
- **Shipped:**
  - **Order:** Hero, Quote, Work, Services, How I work, About, Testimonials (a new `testimonials` scene), a dust scene holding FAQ and Contact, then the footer.
    - Nav: Work, Services, Process, About, FAQ. The menu panel lists all eight anchors.
    - Blog left the page and the nav; its component and data stay. `ConnectSection` is deleted, and its email line sits beside the form.
  - **The B split** for the quote, Work, About, Testimonials, FAQ and Contact, built from shared constants in `page-sections.data.ts` (`SCREEN_*`, `STATEMENT_*`, `SECTION_LABEL_CLASS`, `BODY_CLASS`, `TITLE_CLASS`, `CUE_CLASS`, `PLATE_*`).
    - Statements size from their column (the table in DESIGN.md, Statement).
    - Content stops at 100rem; the columns are 6fr : 5fr, and 31fr : 35fr for Work.
    - Services and How I work keep their Phase 3 layout, classes and 80rem cap until Phases 7 and 8; only their copy changed.
  - **Work:** a label per screen ("Work · 01 / 03"; the first is the `<h2>`, the rest are `aria-hidden`), the title as the statement, the summary, tag and stack, and a 10:7 plate.
    - The pinned frame holds only the slot, at the plate's rect.
    - A project without a valid image shows `/projects/placeholder.webp` with an "Image placeholder" chip. This is a fallback, so the seed and the owner's draft store no image paths.
    - On a phone the screens are top-aligned and opaque, so the copy never crosses the formed sphere.
  - **About:** a pinned single frame with "I am Criztian.", the approved line, "[Your story, in your own words]" and the stats as a `<dl>`. On the right is a 4:5 black-and-white placeholder plate with a "[Your photo]" chip, its slot under the image.
  - **Testimonials:** "“[A client's words, with their permission]”" as the statement, "[Client name] · [Role, company]", and a 1:1 "[Client photo or logo]" plate.
  - **Copy:** the approved short drafts for Branding, Web design, Bringing it to life, Delivering success and About, the section labels and the Contact line. Development keeps its long copy, since it has no short draft yet.
  - **Surface:**
    - type: Body 15/18px, Title 44/56px, Cue 11px at 0.22em everywhere (the hero cue too)
    - tokens: Rule Grey as `--rule` for every divider, and `--ring` pointing at the foreground
    - header: Lit Grey links in both states, a Dim Grey ©, the Contact action at 10×20
    - form: 44px fields (16px text below 768, 15px from 768), a 112px message box, a 48px uppercase full-width submit, a form box of at least 520×440 with 32px padding, a Lit Grey 12px chevron, name and email side by side from a 28rem form, and invalid fields that brighten on keyboard focus
    - footer: items at least 44px tall below 1024px, a full-bleed Rule Grey rule, and two wrapped rows on short landscape screens
  - **Seeds and the owner's draft:** the tagline "I build whole products. Brand, design and code.", the belief placeholder "[Your belief line, in your own words]", and the bracketed project placeholders are the seed defaults. The same values were written into the local draft only. The final e2e run then published them, because `editor.spec.ts` publishes the whole draft (see Landmines), so the local page shows them now. The pre-Phase 5 row is backed up if the owner wants the old published copy back.
  - **Engine:** `resolveViewportHeight` takes the shortest pinned frame, not the tallest, so a grown frame no longer moves a dust boundary. This closes that carried-over item: a grown About frame had put `/#contact` on `moving`.
  - **Pins that survive growth:** single-frame scenes get their pin from `PIN_SPACER_CLASS` after the frame (rule 12 updated), not from a container `min-h`.
- **Evidence:**
  - `pnpm check` is clean and 373 unit tests pass.
  - e2e: all 115 specs pass on a production build at :3100 (a same-drive copy, webpack build, Supabase up).
    - New specs: the scene walk in the new order, deep links to every scene, About and Testimonials at all ten fit sizes (frame never clipped, no overlapping lines, every line visible), statement word fit at twelve sizes, and invalid-field focus.
    - `step-motion.spec`'s arrival fling now starts from the last project screen.
  - **Hero pixel diff:** Phase 5 against `6d11e7c` is 0 pixels at DPR 1 and 2, at rest and with reduced motion (header band and cue row masked). Against `0a3c97a` it is 20 pixels at DPR 1 (up to 2/255) and 24 at DPR 2 (up to 1/255), all in the name's box. `6d11e7c` measures exactly the same, so the residue predates Phase 5 (see Landmines).
  - **Strict counts** (one canvas, one `[data-status]`, one `<h1>`): `site-page.test.tsx` and `anchors.spec.ts`.
  - **Frame growth:** measured at 1920×1080, 1536×864, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 820×1180 and 390×844/664. No pinned frame grows at any of them. Frames grow only at the short fit sizes and 400% zoom, as rule 12 allows, and their pins keep their length.
  - **Captures** at 1440×900 and 390×844 match B's structure screen by screen.
  - **A six-lens review with adversarial verification:** DOM contract, B fidelity, accessibility, conventions, tests and scope.
    - 31 findings raised, 13 confirmed after verification (some confirmed twice, across lenses). All are fixed; the invalid-field focus fix was confirmed in the browser.
    - The rejected ones were duplicates, contradicted an owner decision, or are Phase 6/9 work: the sphere hidden under the plates, the Work slot drift, and a single-project pin.
- **Open:**
  - **Owner:** keep the copy the e2e run published, or ask for the old published copy back.
  - The Development short draft is not written yet.
  - **Phase 6:** the plate slots, Work's opaque phone screens and Contact's own scene (notes under Phase 6).
  - On landscape phones and at 400% zoom a grown About frame centres its plate, so part of the plate can sit below the fold while pinned. Phase 6's frame will show it.
  - A long owner belief line wraps at 11ch with no size step by length. Decide when the real line arrives.
  - Testimonials renders the first quote only.

**Next conversation prompt (starts Phase 6):**

```text
Continue the portfolio redesign: Phase 6, the one-product dot shapes.
Read CLAUDE.md, then plans/handoff.md ("Direction", "The dot story", "The DOM contract", Phase 5's done note and "Phase 6"), and DESIGN.md.
Open the mockup canvas https://claude.ai/artifact/JfBhfHpocuCtfDmcTkahob for the look of every shape.
Build Phase 6 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 7, and end your reply with Phase 7's prompt from the handoff.
Ask me before committing.
```

### Phase 6: the one-product dot shapes

**Goal.** Every dot object tells the one-product story in one material. The engine's architecture doesn't change: this is shape data, generators, tuning and one dust change.

**Shape geometry** (the mockup sketches, in model units, for `LINE_ART_SHAPES` in `hero.data.ts`; the ids stay, the strokes change). These values are y-down; the model is y-up. As built, four places differ to match the mockup renders, and the Phase 6 done note lists them:

- **The page** (the object that Services and How I work build):
  - a frame 1.8 × 1.2 (x −0.9…0.9, y −0.6…0.6)
  - a header rule at y −0.42
  - the mark small at the header's left: a circle r 0.045 at (−0.79, −0.51) and a square 0.07 at (−0.75, −0.545)
  - three short nav dashes at the header's right (x 0.42–0.5, 0.56–0.64, 0.7–0.8, y −0.51)
  - a hero block (x −0.78…0.28, y −0.3…0.1)
  - an image block (x 0.38…0.78, y −0.3…0.1)
  - three column blocks (y 0.2…0.5; x −0.78…−0.32, −0.23…0.23, 0.32…0.78)
- **`branding`, the mark:** a circle r 0.56 at (−0.16, −0.12) in front (z +0.1), and a square 0.92 from (−0.2, −0.24) behind it (z −0.1). A 3/4 view with perspective and a slow sway, like today's service shapes.
- **`web-design`, the layout:** the page with its mark, slightly turned.
- **`development`, the code:** the page pushed back (z −0.45, offset −0.22, −0.16) with a code panel in front (z +0.45, offset +0.32, +0.2). The panel is a 1.1 × 0.9 frame with a title rule and ten indented rows of one to three dashes (indents 0 1 2 2 1 2 3 3 2 0 × 0.07). An exploded 3/4 view.
- **`listening`:** a loose, dim ring of scattered points. About 62% on an ellipse (radius 0.5, 1.25 × 0.9 aspect), with the rest scattered inside it. Points, not strokes: this is a scattered generator, not line art.
- **`planning`:** the page frame with a 4 × 3 grid (verticals at x −0.45, 0, 0.45; rules at y −0.2, 0.2).
- **`visualising`:** the page without its mark: outlines only.
- **`building`:**
  - the page with its mark
  - hatched text lines in the hero block (rows every 0.06 from y −0.24)
  - two lines in each column
  - an X in the image block

  It no longer reuses the cube, and it stops spinning, so the loop can sleep in How I work.

- **`delivery`:** the built page, smaller and tilted up, with a narrowing trail of points under it (a launch). Points, spreading from 0.04 to 0.34 wide and fading downward.
- **`frame` (new):** a rectangle perimeter with a non-uniform half-size. It is used on the Projects plate (10:7), the About photo (4:5) and the Testimonials plate (1:1); the slot's rect sets the proportions.
- **Dust:** B1 is plain black, so the dust behind FAQ and Contact goes very dim or away. Decide from captures with the owner; no dotted grid texture.
- **Contact gather** (the owner said yes in Phase 4):
  - Contact becomes its own single-frame scene: rule 12's `min-h` frame, with its slot on the form box. (As built, the frame is fixed and gated under rule 13, because a grown pinned frame hid the submit button on phones; see the done note.)
  - Its shape is a perimeter frame with points scattered around it.
  - `#contact` still lands on it (rule 10 moves with it).

**Scope.**

- **Generators:**
  - Every line-art shape keeps pen order.
  - The two scattered shapes (`listening`, the `delivery` trail) are seeded point generators.
  - Register every new id in all four places: the `DotGeneratedShapeId` union, `DOT_SHAPE_IDS`, `GENERATED_SHAPE_IDS` (tsc doesn't check this one) and `DOT_SHAPE_TUNING`.
- **Projects, About and Testimonials:** each slot is its plate, and `frame` replaces the placeholder sphere. The sphere is deleted once nothing uses it. What Phase 5 left for this:
  - **About and Testimonials:** the slot is the plate's own rect, the plate's first child, under the image. A frame drawn 18px outside the plate (12px on a phone) needs either the shape's half-size to exceed the slot or the slot to grow by that margin. Under the image the slot gets no pointer events, so decide whether the frame takes the pointer push.
  - **Work:** the pinned frame holds the slot at the plate's rect, and the project screens slide past it. A formed frame therefore frames each plate only as it lands, until Phase 9's deck.
  - **Work on a phone:** the screen list is opaque (`bg-background` below `split`), because the project copy scrolled over the formed sphere (Phase 5 review). That also hides a frame drawn round the plate. Decide how the phone frame shows without copy crossing it.
  - **Contact:** still inside the FAQ dust scene; the gather makes it its own scene (below).
- **Tuning:** every number in `hero.data.ts`. Match the mockup's stroke weight (the cube is the reference).
- **Tests:**
  - `line-art-shapes.test.ts`: determinism, count, bounds, rank, pen order, every id uploaded
  - the scene ids in `hero.spec.ts` and `anchors.spec.ts`
  - the loop sleeping in How I work (`building` no longer spins)

**Acceptance.**

- Reduced-motion contact sheets at 390, 820 and 1440 show every shape formed in its slot and matching the mockup.
- Transit strips (Services 1 → 2 → 3, Process 1 → 5) show the page being built.
- 0 RAF at rest in How I work and in dust.
- The hero pixel diff holds.
- `pnpm check`, the unit tests and e2e are green.

**Done note (2026-09-29).**

- **Owner answers** (asked first; recorded under "Open owner decisions"):
  - Phase 5 was committed on its own first (`ca4d45c`).
  - Work on a phone shows the frame through a clear window round each plate.
  - Frames stay still under the pointer.
  - The dust behind FAQ goes away. The captures offered today's 45%, a very dim 15% and none; the owner chose none.
  - The Services B layout stays in Phase 7.
- **Shipped:**
  - **One material, one product.** Every drawing is the cube's chalk stipple, generated once per shape, seeded and in pen order.
    - The pages share their strokes: line-art shapes are layers of strokes, each with an offset and a scale.
    - Branding is the mark (a circle in front of a square), web design the page with its mark, and development the page stepped back behind a code panel.
    - How I work's five states are a scattered ring (listening), a gridded page (planning), the page's outlines (visualising), the built page (building, which no longer reuses the spinning cube) and the built page launched on a narrowing trail (delivery).
    - `listening`, `delivery` and `gather` are seeded point generators.
    - The sphere is deleted.
  - **Plate frames:** a new `frame` shape on the Work, About and client plates. It sits `min(18px, 5% of the plate's short side)` outside the plate (`resolveFrameOutset`, `DOT_FRAME_OUTSET`), with its proportions set by the slot. Its pointer push never fires, because the real thing sits over its slot.
  - **Work on a phone:** the list is no longer opaque.
    - Each screen is full-bleed, `isolate` and `overflow-clip`.
    - An `aria-hidden` ring 24px round the plate spreads the background colour over the rest of the screen.
    - So the pinned frame shows round a plate as it lands, wipes off and back on between projects, and copy never crosses it.
    - The label sits 24px above the plate (was 12), so the frame's top line never shows through it as a screen lands.
    - Forced colours drop `box-shadow`, so there the phone screens turn opaque and hide the frame.
    - With no visible project, Work has no slot and falls back to dust, rather than framing an empty rectangle.
  - **Contact is its own scene (`contact`, shape `gather`):** a dotted perimeter round the form box, with points scattered outward that thin with distance. The slot is the form box, `pointer-events-none`, under the form. On a phone the form sits 80px below the email line, so the scatter clears it.
    - **A deliberate change from the scope:** the frame is fixed-height and joins the fit gate (rule 13), where the scope asked for rule 12's `min-h` frame.
    - **Why:** measured, Contact's content is 694–714px tall on phones against pinned frames of 476–592px, so a grown pinned frame would hide the submit button for the whole pin. With the gate, the gather pins on desktop, on tablets and on a 390×844 phone. Smaller phones, landscape phones, 400% zoom, text spacing, and error messages that outgrow the frame flow it as plain black.
    - The gate now also watches its slot. When a switch moves a focused field (errors appearing on submit at 390×844, or clearing as the reader fixes them), the gate scrolls by the same amount and then into view, so the field never jumps under the header.
  - **FAQ** is the dust scene's only section. It is one frame tall at every width (rule 10 moved to it), and the dust draws nothing.
  - **Engine:**
    - `pointCount` per shape: 12,000 for the drawings, while the cube keeps its reference 7,200, and `SHAPE_POINTS` is the buffer size. The page drawings match the cube's weight: roughly 2 to 3 dots per pixel of stroke at 1440, as the cube has, in a band of 0.015 in model units.
    - `staticYaw` is the resting pose with or without motion, so a still shape never changes pose when reduced motion switches.
    - The depth light is fitted to the flat pages.
    - Every number is in `hero.data.ts`.
  - **Geometry:** the "Shape geometry" above is y-down; the model is y-up, so y is negated. Four places differ from the notes, each to match the mockup renders:
    - Development's layers are `[-0.186, 0.119, -0.35]` and `[0.462, -0.237, 0.35]` at scale 0.79, so the panel overlaps the page's right third. The notes' offsets put it over the page's centre.
    - The branding square sits at z −0.3, so it reads behind the circle.
    - Delivery's trail runs from −0.15 to −0.54, 0.04 → 0.36 wide.
    - The gather's perimeter sits at 0.84 of the model square.
- **Evidence:**
  - `pnpm check` is clean and 376 unit tests pass.
  - **e2e on a production build at :3100** (a same-drive copy, webpack build, Supabase up, draft = published). The final run: all 130 specs pass. Two earlier runs failed only on new tests that were still being corrected.
    - New specs:
      - the scene walk and deep links with `contact`, and the nav jump skipping `dust`
      - RAF at rest in listening, building and dust (0 frames over 500ms)
      - Contact's gate at seven sizes, with every error showing at 1024×768, and when its form box outgrows the frame
      - a focused field staying on screen as errors flow the form and as fixing them pins it again
      - Work's phone screens staying opaque in forced colours
    - The line scans now skip only real `sr-only` boxes, such as the form's honeypot, and fail on a scan that finds no text.
  - **A five-lens review** (engine and DOM contract, conventions, accessibility, tests, fidelity and docs), each lens followed by an adversarial skeptic. It raised 28 findings and confirmed 15, which come to 12 distinct problems because two lenses found some of the same ones. All 12 are fixed. The ones that mattered:
    - My first line scan had skipped every line under `display: contents`, so the About, Testimonials and Contact checks passed vacuously on split layouts.
    - Contact's gate moved a focused field off screen when errors flowed it.
    - Work's phone window vanished in forced colours.
    - The frame's top line showed through the phone label.
    - An empty Work drew a frame round nothing.
    - Four stale doc lines.
  - **Hero pixel diff:** 0 pixels against Phase 5 (`ca4d45c`) at DPR 1 and 2, at rest and with reduced motion. Against `0a3c97a` it is 20 pixels (up to 2/255) and 24 (up to 1/255), all in the name's box, the same as Phase 5 measured.
  - **Contact sheets** (reduced motion) at 1440×900, 820×1180 and 390×844 show every shape formed in its slot. They are in `.local/phase6/contact-sheet-*.png`, git-ignored.
  - **Transit strips:** Services branding → web design → development shows the mark unwinding as the page draws, then the page stepping back as the code panel draws. Process listening → delivery shows the page's five states; between them the dots still take the scrubbed burst flight until Phase 8. The strips are in `.local/phase6/strip-*.png`.
- **Open:**
  - Phase 7 re-checks the Services drawings in the B slot, and Phase 8 the page states at centre stage (both noted in their scopes).
  - Between How I work states the dots scatter and re-form rather than build on the same outline. Phase 8's threaded turn draws them in pen order.
  - Contact on small phones shows no gather (see "Open owner decisions").
  - The cube's 7,200 dots sit in the first 60% of the pen order, so when the reader scrolls back up from Work, the cube draws in over the first 60% of that flight. The review judged it too slight to change.
  - The image-variant hang in the landmines.

**Next conversation prompt (starts Phase 7):**

```text
Continue the portfolio redesign: Phase 7, the Services restyle and one scroll rule.
Read CLAUDE.md (especially the Services and glide-lock paragraphs), then plans/handoff.md ("Direction", "The DOM contract", Phase 6's done note and "Phase 7"), and DESIGN.md.
Build Phase 7 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 8, and end your reply with Phase 8's prompt from the handoff.
Ask me before committing.
```

### Phase 7: the Services restyle and one scroll rule

**Goal.** Services speaks the page's language, and the scroll is never taken from the reader.

**Scope.**

- **Layout** from the pick:
  - the label `<h2>` "My services · 0k / 03"
  - the statement (the service name)
  - the approved short copy
  - the six items as a numbered list with hairlines
  - the shape large and centred (A) or beside the copy (B)

  The caption board keeps rule 14, and the fit gate and the `split` and `short` variants still decide the layout.

- **No lock:**
  - **Remove from `smooth-scroll.component.tsx`:** the glide on `DOT_THREAD_COMMIT_EVENT`, meaning the Lenis `scrollTo(…, { lock: true })`, the phone RAF glide with `overflow: hidden`, and the `WHEEL_GESTURE_QUIET_MS` hold.
  - **Remove from the hook:** the event and `announceThreadCommit`, unless Phase 8 needs them.
  - **Keep:** `resolveTriggeredTarget`, `followTriggeredProgress`, arrivals as commits, and the captions keyed on `data-thread`. A shape triggers, then plays by itself, and a fast scroll simply carries on.
  - Delete the constants and tests that belong only to the lock.
- **The curtain bug** (carried over): under reduced motion, earlier captions ride up over the slot. Change `not-last:mb-[…]` to `not-first:mt-[…]` (plus `staged:mt-0` and `unpinned:mt-0`), and add a curtain sweep to `step-motion.spec.ts`, like Process's.
- **The shapes in the new slot:** Phase 6 tuned the three Services drawings in the Phase 3 slot (full width between the heading and the captions). Re-check `THREAD_LINE_ART_TUNING.sizeRatio` and the pose in the B slot (600×480 at 1440, 280px on a phone), so the page reads about 420px wide as in B1.
- **Docs:** CLAUDE.md's "Services is triggered" and "The glide lock" paragraphs, DESIGN.md's Thread, and rule 14 here.

**Acceptance.**

- `step-motion.spec.ts` passes:
  - a stopped scroll past the trigger finishes the drawing and the caption
  - a nudge below the trigger doesn't trigger
  - a fast wheel is never held
  - the reduced-motion curtain sweep
- `smooth-scroll.spec.ts` and its unit test pass without the lock.
- The fit sizes pass.
- `pnpm check`, the unit tests and e2e are green.
- The owner scrolls it on a wheel, a trackpad and a phone.

**Next conversation prompt (starts Phase 8):**

```text
Continue the portfolio redesign: Phase 8, How I work restyle and the triggered turn.
Read CLAUDE.md (the orbit paragraphs), then plans/handoff.md ("Direction", "The DOM contract" rule 14, Phase 7's done note and "Phase 8"), and DESIGN.md's Orbit.
Build Phase 8 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 9, and end your reply with Phase 9's prompt from the handoff.
Ask me before committing.
```

### Phase 8: How I work restyle and the triggered turn

**Goal.** The orbit belongs to the page: the dots are the show, the hollow numerals are the big type, and the turn follows the same trigger rule as Services.

**Scope.**

- **Restyle** (`process-section.component.tsx`, globals.css `orbit-*`):
  - Remove the white plate and its two dots; the step title becomes plain Antonio in lamp white.
  - Keep the hollow numerals.
  - Draw the ring as a row of dim round dots: one circle with round caps and a `0 N` dash array, instead of the fine dash and tick pair.
  - Move the dot slot back to centre stage at full size, with desktop composed like the phone: the shape above, the numeral on the ring, the title and copy below. In variant B, the shape sits beside the ring, full size and vertically centred.
  - Re-derive `--orbit-step-top` and the slot rect, and keep the staged and unstaged boxes identical (rule 14).
- **The triggered turn:**
  - Add `process: { share, isThread: true }` to `DOT_SCENE_MOTION`, so the hook commits process steps and publishes `data-thread` for them too.
  - Replace the scroll-driven `orbit-turn`, `orbit-digit` and `orbit-reveal` animations with CSS transitions keyed on the stage's `data-thread`, using literal selectors as the Services captions do.
  - The ring's dots drift with the scroll all the time, as the ticks do today (Phase 4 decision 3, to be confirmed when the owner scrolls it).
  - No lock.
  - **Crossings between two thread scenes.** `isThreadSegment` has no same-scene check. Once process is a thread scene, the Services → How I work crossing (and, after Phase 9, Projects → Services) becomes a triggered thread segment instead of a scrubbed burst flight. Decide which it should be, and update DESIGN.md's Thread "Entry and exit" and the One-Scroll Rule.
- **The shapes at full size:** Phase 6 tuned the five page states in today's phone band and small desktop corner slot. Re-check `PROCESS_LINE_ART_TUNING` (size, pose and the depth light) once the slot is centre stage. Between two states the dots take the scrubbed burst flight today; once the turn is threaded they draw in pen order, like Services.
- **The ring's dots** are one circle with round caps and a 3px stroke, dashed `0 <gap>`. With `pathLength` 3600, the gap is in path units (3600 × 10 ÷ the circumference in px), so it reads as a dot every 10px of arc (DESIGN.md, Shapes).
- **Docs:** CLAUDE.md's "How I work's orbit" paragraphs, DESIGN.md's Orbit, and rule 14 here.

**Acceptance.**

- `step-motion.spec.ts`'s orbit tests are rewritten, and they pass:
  - one turn per commit
  - the active step whole and hit-testable when formed
  - staged and unstaged boxes identical
  - reduced-motion curtains
  - 740×280 flow
  - forced colours
- The fit sizes pass. The loop sleeps at rest.
- `pnpm check`, the unit tests and e2e are green.
- The owner scrolls it.

**Next conversation prompt (starts Phase 9):**

```text
Continue the portfolio redesign: Phase 9, the projects deck.
Read CLAUDE.md, then plans/handoff.md ("Direction", "The DOM contract", Phase 8's done note and "Phase 9"), and DESIGN.md's Projects.
Build Phase 9 as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 10, and end your reply with Phase 10's prompt from the handoff.
Ask me before committing.
```

### Phase 9: the projects deck

**Goal.** Projects is a pinned deck. The active project swaps by trigger inside one plate slot, and the dots draw the frame round it in pen order.

**Scope.**

- **A multi-step scene** with one keyframe per visible project (up to six, from `SiteContent`). It is a thread scene like Services: triggered, never locked.
- **Captions:** the project's title as the statement, its summary, tag and stack are captions keyed on `data-thread`. The image swaps with the light-sweep wipe.
- **The owner edits projects in the editor as today.** The schema doesn't change. Keep `projects.rules.ts` (https-only links and images, visible-project selection).
- **Fallbacks:**
  - Cards stay in DOM order for screen readers.
  - With reduced motion, without JavaScript or without WebGL2, the deck is a plain list.
  - A card with an https link stays one link.
- **The fit gate and rule 14 apply,** since this is a new step scene.
- **The editor preview** still renders the section: its iframe is about 686px wide, so it shows the phone layout.

**Acceptance.**

- New e2e: one project per commit, the list fallback, the fit sizes, and the editor preview.
- `pnpm check`, the unit tests and e2e are green.
- The owner scrolls it.

**Next conversation prompt (starts Phase 10):**

```text
Continue the portfolio redesign: Phase 10, section motion in one style.
Read CLAUDE.md, then plans/handoff.md ("Direction", "The DOM contract", Phase 9's done note and "Phase 10"), and the old Part 3 design with `git show 0f198b2:plans/handoff.md` (section "Part 3: section motion").
Ask me Phase 10's open questions first. Build it as scoped and meet its acceptance, then write its done note, move "Current phase" to Phase 11, and end your reply with Phase 11's prompt from the handoff.
Ask me before committing.
```

### Phase 10: section motion in one style

**Goal.** Every section moves in the one style (the light sweep for text, the pen draw for dots), and content is visible without JavaScript.

**Owner inputs.**

- The parked items, one yes or no each:
  - heading parallax
  - the adaptive cursor (old Part 4)
  - the cursive logo
- The look of the scroll-progress hairline and the nav dot.

**Scope** (from old Part 3; its constraints, arming rules, tests and acceptance still apply, read them in git):

- **Keep:**
  - the statement and heading power-on sweep
  - copy rising per paragraph (per paragraph for `SiteContent` copy)
  - hairlines drawing
  - reveals replaying on re-entry
  - the arming rules
  - the no-JS fix: `data-reveal` plus `@media (scripting: none)`
  - the scroll-spy with the nav dot and `setActiveSection`
  - the scroll-progress hairline
  - the mobile menu wipe-open
  - the contact success moment (keep the height, focus the acknowledgement)
  - the FAQ answer height and the plus transition
  - the About stats counting up (owner, Phase 4). The real value never leaves the DOM; the counting digits are an `aria-hidden` overlay, as old Part 3 specifies
- **Drop:**
  - the Connect address flicker (Connect is gone)
  - the testimonial and blog plate wipes (Blog is hidden; Testimonials is a statement)
  - Part 3's step-handover items (superseded)
- **Build the parked items** only on the owner's yes.

**Acceptance.** Old Part 3's acceptance, adjusted for the new sections:

- the no-JS computed-style check
- the WebGL-off and context-loss checks
- the armed-reveal guard
- the aria snapshots
- the contact focus
- CLS 0
- the hero pixel diff
- e2e green
- screen recordings at 1440 and 390, signed off by the owner

**Next conversation prompt (starts Phase 11):**

```text
Continue the portfolio redesign: Phase 11, polish and proof.
Read CLAUDE.md, then plans/handoff.md ("What is built today" carried-over items, Phase 10's done note and "Phase 11"), PRODUCT.md and DESIGN.md.
Ask me Phase 11's open questions first. Work through it as scoped, then write its done note, move "Current phase" to "Deployment (to plan)", and tell me what deployment needs.
Ask me before committing.
```

### Phase 11: polish and proof

**Goal.** The page is tuned on real devices, proven accessible and fast, and documented, so it's ready to deploy.

**Owner inputs.**

- An Android phone with USB debugging for the 16ms trace.
- An iPhone with Safari 26.
- A decision on a square "Pause motion" toggle (WCAG 2.2.2, because the cube spins and the Services shapes sway endlessly). It uses the `isStatic` path and stops both.

**Scope.**

- **The carried-over items** in "What is built today":
  - copy crossings
  - transit captures in both directions and the owner's "wow and professional" sign-off
  - the 16ms trace
  - Safari 26
  - the real-phone fling test
  - the smooth-scroll feel sign-off
  - the published-content cache (tag it and call `revalidateTag` on publish)
- **An accessibility pass** to WCAG 2.2 AA: keyboard, screen reader, zoom, text spacing and forced colours.
- **A performance pass:** idle RAF, the frame budget, and image weights (the project and About images).
- **Fix the Turbopack build warning** in `email-preview.adapter.ts`.
- **Docs:** the final DESIGN.md and its sidecar `.impeccable/design.json` (stale since Phase 3), the CLAUDE.md "Hero dot field" block, and the README.

**Acceptance.**

- Every carried-over item is closed or recorded as accepted.
- `pnpm check`, the unit tests and e2e are green.
- The owner signs off the whole page on desktop and phone.

**Next:** deployment isn't planned yet (hosting, a live email adapter, reading contact messages in the dashboard). Plan it with the owner in its own conversation.

### Anytime: the owner's material

Use this whenever the owner sends material. It can run between any two phases.

```text
Continue the portfolio redesign: I'm sending real material. Read CLAUDE.md, then plans/handoff.md ("Direction", "Standing rules" and "The owner's copy") and PRODUCT.md "Evidence on Hand".
Put my material in exactly as I give it (fix only typos and pronouns): [paste the tagline, belief line, story, photo path, client quotes with names and permission, or project details here].
Tagline, quote and projects go through the editor's site content: tell me what to publish there, or update the seed defaults if they are still seed. The rest goes in src/data. Update PRODUCT.md "Evidence on Hand" and the handoff's copy section, run pnpm check and the affected tests, and remind me which phase is current.
Ask me before committing.
```

## Landmines still live

These are the ones CLAUDE.md doesn't already cover:

- **e2e without touching the dev server:**
  1. Build with `pnpm build`. It can run beside `pnpm dev`, because Next 16 writes dev output to `.next/dev`.
  2. Serve it with `pnpm exec next start -p 3100`.
  3. Point a throwaway Playwright config at it: an absolute `testDir` of `tests/e2e`, a `baseURL` of `http://localhost:3100`, and no `webServer`.

  Delete `.next/cache/fetch-cache` before the build, or it replays a stale published document.

- **Diff visual regressions; don't eyeball them.** Capture the canvas with `getImageData` in a throwaway Playwright script, before and after. That is how two sub-pixel regressions were caught that screenshots hid.
- **The hero pixel diff** is against `0a3c97a`. Mask the 72px header band and the scroll cue's row. The name's dots may differ by at most 18 pixels at DPR 1 (up to 2/255) and 14 at DPR 2 (up to 1/255), all inside the name's box. Anything more is drift. The full method is in the history.
  - **Measured 2026-09-29 (Phase 5):** `6d11e7c` (Phase 4, before any Phase 5 change) already differs from `0a3c97a` in 20 pixels at DPR 1 (up to 2/255) and 24 at DPR 2 (up to 1/255), all inside the name's box. So the ceiling moved before Phase 5, in the environment or an earlier phase; it was not isolated further. All three builds read the same published record, which by then held the one-line Phase 5 tagline. Phase 5 against `6d11e7c` is a zero-pixel diff at DPR 1 and 2, at rest and with reduced motion. Diff each phase against the previous commit as well as against `0a3c97a`.
  - **Measured 2026-09-29 (Phase 6):** against Phase 5 (`ca4d45c`, a throwaway worktree served on :3201 and removed afterwards) the hero is a zero-pixel diff at DPR 1 and 2, at rest and with reduced motion. Against `0a3c97a` it is the same 20 pixels at DPR 1 (up to 2/255) and 24 at DPR 2 (up to 1/255), all inside the name's box. The script is `.local/phase6/pixel-diff.mjs` (git-ignored).
  - **Ready baseline:** `E:\Project\criztian-baseline-build` is a git worktree at `0a3c97a` with its own `node_modules` (a real install) and a webpack build; serve it with `pnpm exec next start -p 3200` and the `.env.local` variables loaded. The older `E:\Project\criztian-baseline-0a3c97a\node_modules` has dangling package links and no `.bin`, so it cannot build.
  - **Capture:** a page screenshot per case once three consecutive frames match (the script used in Phase 5 is recreated easily from "How it was measured" in the history).
- **PowerShell 5.1 splits `git commit -m` at quotes** (the apostrophe in "Let's"). Write the message to a file and use `git commit -F <file>`.
- **`Set-Content -Encoding utf8` writes a BOM** in Windows PowerShell 5.1. Use the Write and Edit tools.
- **`UID` is read-only in bash.** A `UID=$(...)` capture fails silently.
- **TypeScript loses narrowing** of a captured `const` inside a hoisted `function` declaration. After the null guard, use an explicitly typed alias (`const container: HTMLElement = containerElement`). The hook already does this throughout; don't "clean it up".
- **`motion/react` ships no `"use client"`.** Import it only from client components; `src/providers/motion.provider.tsx` carries the directive.
- **`aria-hidden` on a wrapper hides everything inside it.** It once hid the `<h1>`. Keep it on decorative leaves, or on a visual duplicate of text that stays exposed, never on a wrapper of readable content.
- **The e2e suite publishes the owner's draft.** `editor.spec.ts` edits the name, publishes, restores it and publishes again, so whatever else sits unpublished in the draft goes live. In Phase 5 that published the draft written for the owner to review. Before an e2e run, check `draft = published` in `site_content`, and ask the owner before running if they differ.
- **The local Supabase may have no users.** `auth.users` was empty on 2026-09-20. Logged-in specs create their own throwaway user; never ask for the owner's password.
- **Never `pnpm db:reset`** on the owner's data. It re-seeds `site_content` as `draft = '{}'` and wipes `auth.users`. Apply new migrations with `pnpm exec supabase migration up --local`.
- **A production server can hang on image variants.** After one full e2e run, the Phase 6 server at :3100 timed out on two uncached `_next/image` variants (the About and client placeholders at `w=384`), while other uncached variants and Phase 5's server answered at once. Every later request for those two keys hung until the server was restarted; after a restart they load at every width. It was not isolated further. If a plate shows black in a capture, request its `_next/image` URL with curl before suspecting the page. Check this again before deploying.
- **Turbopack flags one build warning:** `path.join(process.cwd(), …)` in `email-preview.adapter.ts`. It is harmless locally; fix it before deploying.
- **Capture in full Chromium, not the headless shell.** Playwright's default `chromium-headless-shell` (SwiftShader) paints alpha-0 holes wherever an opaque sticky step overlaps the fixed canvas inside the isolated stage, so they look like white blocks. Use `channel: "chromium"` for screenshots and pixel checks. The e2e specs pass on either.
- **Measure fit at real heights, not only nominal sizes.** Phase 2 passed at 360×640 and 740×360, then failed on an iPhone SE's real svh (about 548) and a landscape phone with its URL bar (740×304). Every layout change to a pinned scene is re-measured at all of these:
  - 375×548, 360×560 and 390×664
  - 740×304, 740×280 and 667×320
  - 320×256 (400% zoom)
  - 360×640, 740×360 and 1440×900 with a WCAG 1.4.12 text-spacing stylesheet injected

  `tests/e2e/fit.spec.ts` covers the gate.

- **The mockup canvas is private.** Only the owner can share it (Share menu). Read its comments with the artifact comments tool; never publish site code to it.

## Open owner decisions

- **Check the Phase 5 copy that went live locally (owner):** the e2e run published the draft Phase 5 wrote (the new tagline, the belief placeholder and the bracketed project placeholders), because `editor.spec.ts` publishes the whole draft. Keep it, or ask for the pre-Phase 5 published copy back (the row was backed up in the Phase 5 session).
- **Testimonials with several quotes:** the label counts them once there is more than one (owner, Phase 5), but how one quote gives way to the next is not designed. Decide when the real quotes arrive.
- **To confirm later:** the black-and-white photo, when it arrives, and the drifting ring, when Phase 8 is scrolled.
- **Contact on small phones (Phase 6, for the owner to see):** the gather shows wherever the whole form fits one pinned frame (desktop, tablets, a 390×844 phone). Below that the section flows as plain black and the gather gives way, so a pin never hides the submit button.
- **Phase 10:** heading parallax, the adaptive cursor, the cursive logo.
- **Phase 11:** the pause-motion toggle (WCAG 2.2.2).
- **Material:** the belief line, the story and photo, client quotes, real projects.
- **Decided, recorded:**
  - Phase 6 (owner, 2026-09-29): Phase 5 committed on its own first; Work on a phone shows the frame through a clear window round each plate; frames never scatter under the pointer; the dust behind FAQ goes away (plain black); the Services B layout stays in Phase 7
  - Phase 5 (owner, 2026-09-29): the Projects heading and intro are retired; Work is one screen per project until the deck; the mockup's placeholder plates; the draft is written for the owner to publish; the submit button is uppercase; Testimonials shows no count while it has one quote; all nine FAQ answers are still true
  - positioning (PRODUCT.md)
  - reveals replay on re-entry
  - the direction-aware sweep keeps the natural mirror
  - the scroll-spy defaults (the dot hides off the centre links and steps under passed links during a flight)
  - the extras: the menu wipe-open, the contact success moment and the scroll-progress hairline
