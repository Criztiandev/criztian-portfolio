# Handoff: the dot-art redesign

> **For:** the next Claude Code session picking up this build.
>
> **Current phase:** **New elements (to scope with the owner).** Phase 11 is done (see its done note). The owner handles deployment; the checklist is under "Deployment (the owner's)". The owner's device checks and the recordings' sign-off are still open. The design is locked to mockup B ("Statement", with `B-desktop-1` as the reference), except How I work's centred wheel (owner, Phase 8); the renders are in `plans/mockups/`. To start, paste the prompt under "Start here".
>
> **Branch:** `portfolio/phase-3`. The direction lock, this phase plan and the mockup renders are committed in `29e7284`, on top of Phase 3's `0f198b2`. Phase 4's DESIGN.md rewrite is `6d11e7c`, Phase 5 is `ca4d45c`, Phase 6 is `bb808b1`, Phase 7 is `32efb4b`, Phase 8 is `e8cbbe5`, Phase 9 is `684db97`, Phase 10 is `78f4973` and Phase 11 is one commit on top of it, made on the owner's OK. Nothing is pushed, and `portfolio/phase-3` is not merged to `main` yet.
>
> **How this file works:** each phase is one conversation. It lists its scope, the owner inputs it needs and its acceptance. It ends with the prompt that starts the next conversation. When a phase ends, write its done note under it, move "Current phase" forward, and give the owner the next prompt.
>
> **History:** the full notes for Phases 1–3 are in git: `git show 0f198b2:plans/handoff.md`. That covers the pre-flight, Parts 0–4, the planning and gap reviews, and the Departure Board, Signal Wire, Services thread and Orbit redirects. The hero, quote, burst and editor rationale is in `git show 0a3c97a:plans/handoff.md`.

## Start here

Paste this into a new conversation to start the current phase:

```text
Continue the portfolio: I'm adding new elements.
Read CLAUDE.md, then plans/handoff.md (Phase 11's done note, "New elements", "The DOM contract" and "Landmines still live"), PRODUCT.md and DESIGN.md.
Ask me what the new elements are, where they go and what they say before building anything; never invent their content.
Then scope them as the next phase in plans/handoff.md and build it.
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
- **Development:** "High-performance, scalable websites tailored to your business." (the owner picked it from three cuts of the long copy, Phase 7)
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
- **Phase 6** (`bb808b1`): the one-product dot shapes in one material, the plate frames, the Contact gather as its own gated scene, and FAQ on plain black (see its done note).
- **Phase 7** (`32efb4b`): Services on the B statement split, the glide lock removed (trigger, play, no lock) and the reduced-motion curtain bug fixed (see its done note).
- **Phase 8** (`e8cbbe5`): How I work as a centred wheel (owner), no plates, the ring drawn in dots, the shape at full size above the numeral, and the turn triggered and played by the dots' own progress (see its done note).
- **Phase 9** (`684db97`): the projects deck, one step per visible project on a sticky board, `project-k` step ids, the frame unwound and redrawn in place (`isRedrawSegment`, `uRedraw`), the keyboard rule, and the Phase 5 list as the fallback (see its done note).
- **Phase 10** (`78f4973`): every section's text swept by the dots, the About count-up, the desktop copy drift, the scroll-spy with the nav dot, the scroll-progress hairline, the menu wipe, the contact success moment, the FAQ disclosure, the no-JS fix and the adaptive cursor (old Part 4) (see its done note).
- **Phase 11** (the commit on top of `78f4973`): the big arriving section titles, the pause-motion toggle, the small cursor over the dots, How I work's exit, the uncached published read, the accessibility and performance passes, and the docs (see its done note).
- **Last evidence (2026-10-01, Phase 11):**
  - 515 unit tests pass and `pnpm check` is clean.
  - e2e is green on a production build at :3100, with Supabase up (275 specs).
  - The hero pixel diff held: 0 pixels against Phase 10. The method is in the history and the landmines.

**Carried-over open items,** each assigned to a phase:

| Item                                                                                                                       | Phase     |
| -------------------------------------------------------------------------------------------------------------------------- | --------- |
| Services curtain bug: under reduced motion, earlier captions ride up over the slot (`not-last:mb-*` → `not-first:mt-*`)    | done (7)  |
| Copy crossings: transit dots cross copy columns at full brightness                                                         | done (11) |
| `resolveViewportHeight` with grown frames shifts dust boundaries: fixed in Phase 5, it reads the shortest pinned frame     | done (5)  |
| Transit captures of every scene, both directions, and the owner's "wow and professional" sign-off                          | owner     |
| The 16ms frame trace on the owner's phone (ask for an Android with USB debugging)                                          | owner     |
| Safari 26 on an iPhone (scroll-driven animations, Lenis at 60fps)                                                          | owner     |
| The real-phone fling test (Phase 1)                                                                                        | owner     |
| The smooth-scroll feel sign-off (`SMOOTH_SCROLL_LERP`)                                                                     | done (11) |
| The published-content read is cached for a year (tag it and `revalidateTag` on publish, or make it uncached)               | done (11) |
| The Projects heading in the live record still has old text: retired with the intro (owner, Phase 5)                        | done (5)  |
| Existing reveals hide content without JavaScript (`data-reveal` plus `@media (scripting: none)`)                           | done (10) |
| A cold load at 1440×900 shifts the hero once (CLS 0.008): the tagline wraps to two lines in `Geist Fallback`, one in Geist | done (11) |

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
  - A step's keyframe id is its shape, or `<scene>-<k>` (`formatSceneStepId`) when its scene repeats the shape, as the projects deck does (Phase 9).
- **Dust scenes:** anchored to the viewport, spanning the container's document range. They need no pin.
- **Transits:**
  - A transit fills the gap between one keyframe's range and the next.
  - It ends 1px before the next pin (`MORPH_LANDING_TOLERANCE_PX`). Fractional `svh` otherwise leaves `t` at 0.9999, the old `/#quote` bug.
- **One global position `p`** (segment index + `t`) is smoothed, and the from/to pair is derived from `p`.
  - Smoothing `t` while the pair switches makes dots jump.
  - `p` snaps only when one scroll event moves the target more than one segment (a nav jump, a scrollbar drag), so a jump doesn't flash through every shape. Continuous scrolling never snaps (Phase 7 bug fix): a snap on the committed target teleported the Services drawings on a fast scroll.
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
  - Between two thread keyframes of one scene with the same shape (`isRedrawSegment`), `uRedraw` 1 drops the flight and unwinds, then redraws, the shape in pen order by opacity alone (Phase 9, the projects deck).
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

   `getBoundingClientRect` includes transforms, and these properties also create stacking contexts. Motion reveals (`LIFT_VARIANTS`) go on inner text only, and the copy drift (Phase 10) animates only the children of a copy column.

5. **Overflow.** Ancestors of sticky elements use `overflow: visible` or `clip` only. `hidden`, `auto` and `overflow-x-hidden` silently stop the pin.
6. **Named groups only.** Tailwind groups are named (`group/stage`). An unnamed `group` on the page wrapper would make every unnamed `group-*` react to the whole page.
7. **Coverage.** Every section belongs to a scene; dust counts. No transit may stretch across unassigned sections as a half-formed smear.
8. **The top band.** Where the copy docks as curtains, the label and the slot form a band at the top of the frame, and the step blocks are `sticky` directly below it (at `step-top`) on an opaque ground, so copy never enters the band. In Services' split the band is the label alone, since the slot is in the other column; How I work's band is the label and its centred slot at every width. Conditions:
   - The step list ends where the container ends, or the last step unsticks into the band.
   - Each step's height is at most `F − step-top`, where `F` is the frame (`svh − 72`).
   - Choose the layout by height as well as width, with the custom variants in `globals.css`, never `md:`:
     - `split` is `(min-width: 48rem), (max-height: 30rem) and (min-width: 34rem)`. A 740×360 landscape phone is split; 320×256 (400% zoom) is portrait.
     - `short` is `(max-height: 30rem), (width < 48rem) and (max-height: 38rem)`. It tightens the frame's insets, the step type and the copy budgets (`--caption-stacked`, `--orbit-copy`), so small phones (375×548, 360×560) stay pinned.
   - No links inside docked steps. A covered link could still take focus (WCAG 2.4.11). The deck's title links are allowed, because its cards never dock: unstaged they are a list sliding past the slot, and staged the keyboard rule (rule 14) brings a focused link's card onto the board.
   - `ServicesSection` and `ProcessSection` implement this in their unstaged layouts; `ProjectsSection` has no curtains, and its unstaged layout is the Phase 5 list. Services' maths: each caption is `--caption` tall and sticks at `--caption-top` (the foot of a portrait frame, or one row gap under the label in the split's left column, where it never meets the slot), with its bottom inset as padding so the stuck curtains end with the frame, and `not-first:mt-[pitch − caption]` docks caption `k` at `k·pitch`. Process's maths: the frame and the list share one grid cell, the list starts `--orbit-step-top` below the top (right under the label and the centred slot, at every width since Phase 8), each step is `F − step-top` tall and sticks at `step-top`, and `not-first:mt-[pitch − (F − step-top)]` keeps step `k` docking at `k·pitch`. Space docked curtains with `margin-top`, never `margin-bottom`: a sticky element's margin box must stay inside its containing block, so a bottom margin pushes every stuck curtain up by that margin as the list ends. The last step unsticks together with the frame.
9. **In-scene anchors.** Every `id` inside a scene has `scroll-margin-top` equal to that scene's `stickyTop` (`scroll-mt-18`). A larger margin lands before the pin starts. `data-scene` then reads `moving`, and if a spinning shape is the outgoing one, the loop never sleeps.
   - **Focusables too.** Every focusable inside a scene also carries `scroll-mt-18` (`FOCUS_RING_CLASS` does). This keeps a Shift-Tab target clear of the 72px fixed header, because `scroll-padding-top` is banned.
10. **Dust scene endings.** The last section of a dust scene is at least one frame tall (`min-h-[calc(100svh_-_4.5rem)]`). Otherwise its anchor lands in the transit to the next scene, with a half-formed shape over it. `#contact` needed this until Phase 6; now FAQ is the dust scene's only section and carries it at every width.
11. **Reveals are drawn by the dots.** Since Phase 10 no section text reveals on an observer, a margin or a timer: it sweeps from its scene's `--scene-reveal`, so a pinned element can never wait for a margin it doesn't cross. (That was this rule's old hazard: the retired projects heading sat at 65% of a phone screen behind a −40% margin and never revealed.) A scene without a slot, or a pinned frame that grew past the viewport under rule 12 (`isGrown`), stays lit through the transit after it (`resolveRevealRange`), because a grown frame's lower lines only come into view after its pin.
12. **Frames that can grow, grow.** A single-frame scene (Quote, About, Testimonials, footer) uses `min-h-[…]`, never a fixed `h-[…]`. Contact is the exception and follows rule 13 instead: its gather needs the whole form in one pinned frame, and a grown frame would hide the submit button for the length of the pin. Its pin length comes from a fixed spacer after the frame (`PIN_SPACER_CLASS`: 50svh; 60svh for the quote, 25svh for the footer; hidden without WebGL), never from a container `min-h`: a grown frame then keeps its whole pin instead of dropping it to zero (Phase 5 review). Work's frame is an exception: it is fixed and holds only the slot. Its cards are fixed-height step boxes, one frame each (`PROJECT_CARD_CLASS`), and join the gate (rule 13); they grow from a one-frame minimum only when `unpinned` or without JavaScript (Phase 9). Step boxes are the other exception: they are fixed and join the gate (rule 13), because a step that grows would move the next step's docking point. Zoom or WCAG text spacing then lengthens the frame instead of clipping or overlapping the copy. The engine re-reads frame and container heights on every measure.
13. **The fit gate.** A docked step cannot grow: it is sticky, and a taller step is covered by the next one. A deck card cannot grow either: the cards share one frame-tall board, and in the list a taller card would slide its plate off the pinned slot. So each step scene (`ProjectsSection`, `ServicesSection`, `ProcessSection`) renders `SceneFitGate` (a hidden `<span>`) as its **last** child. The frame stays first. `ContactSection` does the same, with its fixed-height frame as the fit box (Phase 6). How it works:
    - It checks every `[data-fit-box]` step or card.
    - If one overflows, it sets `data-fit="flow"` on the container, removes `data-dot-slot` from the slot and sets `data-dot-shapes="dust"`. The engine re-reads both attributes on its next measure, so the scene becomes a plain dust scene. It never sees a hidden 0×0 slot.
    - When everything fits again, it restores both attributes.
    - Its cleanup clears `data-fit` and restores the slot attribute but never writes `data-dot-shapes`: React writes the new value whenever `shapes` changes, which is the only time the cleanup runs. Writing the old value back left an emptied deck (the editor hiding every project) on its stale frames, with no slot (Phase 9 review).
    - The check runs in `requestAnimationFrame`, scheduled by a ResizeObserver (on the container, each box's children and the slot) and by `document.fonts.ready`. It never mutates layout inside the observer callback, because that raises ResizeObserver loop errors, which the e2e specs count as page errors.
    - When a switch moves an element that has focus inside the scene (a Contact field whose errors just appeared or cleared), the gate scrolls by the same amount, then scrolls it into view if a stuck frame made that inexact; otherwise it keeps a reader who is past the scene in place (Phase 6).
    - The `unpinned` variant styles flow mode and the no-WebGL path with one class list.
    - Any new sticky, fixed-height copy box must join the gate or follow rule 12.
14. **Staged step scenes.** Under the `staged` variant a step scene's copy sits on one board instead of scrolling:
    - **The board** is the container's second child, a sibling of the frame, never an ancestor of the slot. It is sticky, transparent, and ends with the container, so it pins on exactly the frame's pin range. The orbit's board is frame-tall at `top-18` and `pointer-events-none` because it covers the frame and the engine listens for pointer events on the slot itself. Only the title and paragraph take pointer events when staged, and a step's own sweep clips them while it is hidden, so a hidden step never takes a hit; the numeral takes none, so a turning neighbour can't steal the slot's pointer. Unstaged, the whole curtain does, so covered text can't be hovered or selected. The slot must stay clear of the numeral's box (0.96em wide, starting 0.078em above the ink), not just its ink: the slot's height drops `max(0, 0.078em − 0.5rem)` of the numeral from `--orbit-slot`, so it ends at or above the box's top while `--orbit-step-top` stays put (Phase 8 review). The deck's board is the `<ol data-deck>`: frame-tall at `top-18`, `pointer-events-none`, with every card stacked in one grid cell. Only the swept lines and the plate take pointer events, and a hidden card's sweep clips them. Its plates sit exactly on the slot, and the slot itself is `pointer-events-none`, because a plate is clipped away mid-hop and a pointer that reached the slot would scatter the next frame (Phase 9 review).
    - **The container height is explicit:** `F + (n − 1)·pitch`, where pitch is `F − step-top + 0.75rem` in portrait and `F` in split. The deck's pitch is `F` at every width, so its container is `n·F` (`--steps`), or `auto` when `unpinned` or without JavaScript. Staging on or off therefore never moves a pin, an anchor landing or the slot rect, and the engine needs no re-measure.
    - **Animated decoration is ink, not copy.** The gate re-checks while staged too (on resize and font load), so nothing animated inside a fit box may add to its `scrollHeight`. The orbit numeral carries `contain: layout`, which turns its digits' assemble transforms into ink overflow. Without it, 67 wide sizes between 900 and 975px tall flowed How I work to the reading list (Phase 7 fix). Phase 8's geometry no longer overflows there without it, so `step-motion.spec.ts` asserts the containment directly. The copy drift's column carries `contain: layout` for the same reason, since Contact's frame is a fit box (Phase 10 review).
    - **Measured before staging.** The hook's first measure (`readLayout`, at the top of the GL effect) and the gate's first check run while the stage is `idle`; setting `data-status="running"` (in the geometry effect) switches `staged` on later and triggers neither. So the slot rect, the container height and every step box must be identical in both modes. `step-motion.spec.ts` flips the stage attribute and compares them, including the deck's cards, and puts every staged plate on the slot.
    - **Copy motion.** All three step scenes are drawn by the dots' own progress, never on a timer or the scroll timeline. Since Phase 10 every other scene's text is drawn the same way, from `--scene-reveal` (CLAUDE.md, "Every section's text sweeps with the dots"). The hook writes `--reveal-<keyframe id>` (the shape, or `project-k` in the deck) on each thread scene's container (`resolveThreadReveal`), and literal selectors in globals.css map it to `--caption-reveal` for Services' captions, the deck's cards (`[data-caption="project-k"]`, up to `PROJECTS_MAX`; the count, the caption lines and `plate-sweep` read it) and both labels' position counts. While a deck link has `:focus-visible`, every card's reveal is 0 but the focused card's, which is 1 (owner, Phase 9). For the orbit it also writes `--thread-turn` (`resolveThreadTurn`), and the `orbit-step` utility derives each step's rotation, `--orbit-assemble` and `--orbit-lit` from it (Phase 8). The container's `--screen` view timeline (`view-timeline-inset: 4.5rem 0`; it was `--step-scene` until Phase 11) drives the ring's drift, and the label's arrival title (Phase 11); nothing else in a step scene runs on it. Nothing in the stylesheet keys on `data-scene`.
    - **Services' board** is the caption box itself: `--caption` tall, sticky at `--caption-top`, with the frame's bottom inset (`--screen-bottom`) as its padding so it ends exactly with the container. In the split it covers only the left column under the label, so the slot on the right is never under it.
    - **Rule 8 in staged mode:** the board is transparent. Nothing scrolls under the band during the pin, so the opaque ground isn't needed, and the portrait exit transits are visible. The opaque sticky steps remain in the fallback layout. The deck's phone windows (`PROJECT_PLATE_WINDOW_CLASS`) hide while staged, and its forced-colours ground turns transparent.
    - **Rules 12–13:** the Services board, each orbit step and each project card (`article[data-fit-box]`) are fixed-height `[data-fit-box]`es, so an overflow flows the scene through the gate. The orbit board itself is not a fit box: its rotated neighbours would count toward its `scrollHeight`. It is `overflow: clip`, so they never widen the page.

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

**Done note (2026-09-29).**

- **Owner answers** (asked first):
  - Phase 6 was committed on its own first (`bb808b1`).
  - Development's short copy is "High-performance, scalable websites tailored to your business." The owner picked it from three cuts of their long copy.
- **Shipped:**
  - **Services on the B split** (`services-section.component.tsx`):
    - The label `<h2>` "My services" carries an `aria-hidden` position count ("· 02 / 03", `data-position`). It shows only on the staged board, where it wipes with the captions. Curtains and the reading list show just "My services", because curtains follow the scroll and the count follows the trigger.
    - Each service name is an `<h3>` statement. BRANDING measures 3.71em and DEVELOPMENT 4.98em, so the default factor overflowed at 768–1024 wide. Two new statement sizes fix that: `service` (23cqi in the split) for Branding and Web design, and `longWord` (16.5cqi) for Development.
    - The short copy is in Body. The six items are an `<ol>` in the new `ITEM_CLASS`, each with an `aria-hidden` tabular Dim Grey number and a Rule Grey hairline, in two columns once the copy column is 30rem wide.
    - The slot is 5:4 on the right (600×480 at 1440). On a phone it sits above the copy, at most 280px wide.
    - The geometry lives on the container. `SCREEN_INSET_CLASS` repeats `SCREEN_CLASS`'s paddings as `--screen-top` and `--screen-bottom`, and `--caption-top` and `--caption` place the board. Phone caption heights are tiered on `--caption-stacked`: 25.5rem, 21.75rem from 38 to 44rem tall, and 18.25rem on short phones, with tighter item rows to match. So a 390×664 phone keeps a 200px slot; the first cut gave it 140.
    - The caption board keeps rule 14: it is the second child, sticky, and ends exactly with the container.
  - **No lock:**
    - `SmoothScroll` is back to its Part 0 version (`39f62f5`).
    - The hook no longer announces commits. `DOT_THREAD_COMMIT_EVENT`, `resolveThreadCommit`, `isThreadKeyframeIndex`, `resolveKeyframeRestTop`, `threadArriveSeconds`, `DotThreadCommitDetail` and `WHEEL_GESTURE_QUIET_MS` are deleted.
    - Their tests went with them: 10 unit tests and three e2e tests (the wheel glide, the phone glide, and the arrival fling that stopped on Branding).
    - `resolveTriggeredTarget`, `followTriggeredProgress`, arrivals as commits and the `data-thread` captions are unchanged.
  - **The curtain bug:** fixed with `not-first:mt-[pitch − caption]`, with each curtain's bottom inset as padding so the stuck curtains end with the frame. To check the new sweep catches it, the old `not-last:mb` spacing went back in temporarily. The sweep caught captions riding up to 362px over the slot at 390×664 and 235px over the label at 1440×900, and was clean again once the fix was restored.
  - **Shapes in the B slot:** `THREAD_LINE_ART_TUNING.sizeRatio` went from 0.46 to 0.47. The page now draws about 417px wide at 1440 (B1: about 420) and the code stage 420px. The pose is unchanged.
  - **Dead code:** `SECTION_LEDE_CLASS` and `LABEL_CLASS`, which only the old Services used.
  - **Docs:**
    - CLAUDE.md: "No lock", "Services' B layout" and Sections.
    - DESIGN.md: the status note, the Statement tables, Item and Thread.
    - PRODUCT.md: the Services line.
    - This handoff: rules 8 and 14, and the Development draft.
- **Evidence:**
  - `pnpm check` is clean and 374 unit tests pass: 376, less the 10 lock tests and the 2 `followTimelineProgress` tests, plus 10 new ones.
  - **e2e:** all 136 specs pass on a production build at :3100 (a same-drive copy, webpack build, Supabase up, `draft = published` before and after). The suite ran after the review fixes and again after each of the three fixes that followed the owner's checks.
  - **The acceptance, test by test:**
    - A stopped scroll past the trigger finishes the drawing and the caption, and a nudge below the trigger doesn't trigger: "finishes a service drawing by itself when the scroll stops", at 1440×900, 390×664 and 375×548.
    - A fast wheel is never held (new). Fifteen notches over 1.5 pitches land within 2px of their delta. `lenis-locked`, `lenis-stopped` and `overflow: hidden` never appear in any frame, and Development then plays by itself.
    - A touch scroll past the trigger is never held (new): the scroll stays where it stopped and Web design plays by itself.
    - The reduced-motion curtain sweep (new), at 1440×900 and 390×664: no curtain covers the slot or the label, and no position count shows.
    - `smooth-scroll.spec.ts` and its unit test pass without the lock.
    - The fit sizes pass. `fit.spec.ts`'s word-fit sweep now covers the Services statements at twelve sizes.
  - **Also new in `step-motion.spec.ts`:**
    - The staged and unstaged boxes are identical.
    - The board sits one row gap under the label and ends with the frame.
    - Only the active step's count is hit-testable.
  - **Where Services pins** (measured on the dev server):
    - It pins at 1920×1080, 1440×900, 1366×768, 1366×657, 1280×720, 1024×768, 820×1180, 768×1024, 390×844, 390×664, 360×640, 375×548 and 360×560.
    - It flows at 740×360, 740×304, 740×280, 667×320, 320×256 and 320×568.
    - With WCAG text spacing it also flows at 1440×900, 1024×768 and 360×640; 1920×1080 still pins.
  - **Captures** at 1440×900, 1024×768, 390×844 and 390×664 match B1 and B's phone screen. They are in `.local/phase7/shots/`, git-ignored.
  - **A five-lens review** (DOM contract, lock removal, accessibility, conventions, and fidelity with docs), each lens followed by an adversarial skeptic. Six findings came down to three distinct problems, all confirmed and fixed:
    - The position count followed `data-thread` while the curtains follow the scroll, so under reduced motion it read "02 / 03" above Branding for about 440px of scroll. Four lenses found it independently. The fix shows the count only on the staged board, with an e2e assertion.
    - A unit test could pass with no `<ol>` at all.
    - DESIGN.md's "Where it pins" misstated when text spacing and 320px-wide phones flow the scene.
  - **The hero pixel diff was not re-run:** Phase 7 changed no hero code (the component, the sampler, the shaders and the name tuning are untouched).
- **Bug fix after the owner's first scroll ("speed scrolling doesn't render properly"):**
  - **Cause:** `followTriggeredProgress` fell back to the snapping follow whenever the committed target was more than one shape ahead of the drawing. The lock used to stop a fast scroll from getting there. Without it, a fast wheel committed Development while Web design was still drawing, and the dots teleported to Development in one frame. Captured frame by frame: going down Web design was never drawn, and going up Branding appeared the same way. The same rule would snap on fast entries from Work and from How I work, because the trigger moves the target a whole shape ahead of the scroll.
  - **Fix:** the rule never snaps now. Inside a thread it plays in pen order and hurries in proportion to how far behind it is (`threadHurrySeconds` 0.15), then draws the committed shape at its own 1.6s pace. Elsewhere it follows smoothly. The hook snaps only when one scroll event moves the target more than one segment (a nav jump), which is what the old snap was for. `followTimelineProgress` is gone.
  - **Proof:** fast wheels down, back up, out into How I work, in from Work and back up from How I work, captured on the dev server (`.local/phase7/fling/strip-*.png`), all draw every shape in order with no jump. The fast-wheel e2e test now also asserts that Development forms at least half a draw after it is committed. With the fix it forms 1,884ms after the commit. With the old snap put back temporarily, it formed 0ms after, so the test fails there. Four new unit tests cover the rule.
- **Second fix after the owner's scroll** ("when I enter Branding the shape is forming but the text is not there… make sure that the text animation, dot animation and scroll are sync"):
  - **Cause:** the captions ran on their own clock. They were CSS transitions keyed on the committed shape: the old caption wiped out 0.35s after the commit, and the new one waited 0.88s, then swept for 0.9s. Measured on the dev server, the old text vanished while its drawing was still on screen, and there was about 0.75s of drawing with no text before the new name swept in. Entering Branding from Work, the dots flew in for 1.3s with no text at all.
  - **Fix:** the dots' progress now draws the text. `resolveThreadReveal` gives each Services shape a reveal of 1 while the dots form it, eased to 0 half a hop away. The hook writes it as `--reveal-<shape>` on the Services container, and only when a value changes. `caption-line` turns it into each line's clip and slide, staggered by `CAPTION_LINE_STAGGER`. The caption timers (`CAPTION_SHOW_DELAY_SHARE`, `CAPTION_SHOW_SECONDS`, `CAPTION_HIDE_SECONDS`) are gone, and so are the transitions.
  - **Proof:** re-measured, the old text wipes out as its drawing unwinds and the new name sweeps in as its drawing forms: fully in at 6.55s, with the drawing formed at 6.87s. Entering Branding, the text sweeps in with the arriving dots. The only textless moment is about 0.28s at the pen's midpoint, when the drawing itself is half one shape and half the other. A new e2e test runs at every staged size and checks, on every animation frame, four things:
    - the two captions never show at once;
    - the old caption stays whole until its drawing starts to unwind;
    - the new name starts at least 300ms before its drawing forms;
    - the new name is fully in within 50ms of the drawing forming.
- **Third fix: How I work showed as a plain list** (the owner's screenshot, about 1474 wide). This bug predates Phase 7: the Phase 6 build flows the same way.
  - **Cause:** the orbit numerals' assemble animation slides unassembled digits 0.4em down and tilts them. Those transforms added 2–19px to each step's `scrollHeight`. The gate re-checks while staged whenever something resizes or the fonts finish loading, so on wide screens between 900 and 975px tall (the numeral grows with the height there) it read the moving digits as copy that doesn't fit, and flowed How I work to the reading list.
  - **Fix:** `contain: layout` on the numeral, so its transformed digits are ink overflow. The digits animate exactly as before: mid-turn frames are a zero-pixel diff against the Phase 6 build. Real copy overflow (text spacing, zoom) is outside the numeral and still flows the scene.
  - **Proof:**
    - A sweep of 725 sizes (1024–2560 wide, 600–1300 tall, resizing while staged): without the fix, 67 flowed although their unstaged layout fits. With it, none flow, and the staged verdict matches the unstaged one at every size.
    - A new e2e test resizes a 1474×880 window to 1474×900, 1680×950 and 1920×975 while the page is staged, and How I work stays pinned.
- **Open:**
  - **Owner:** scroll Services on a wheel, a trackpad and a phone. This is the last acceptance item.
  - **Where Services flows:** landscape phones, 320px-wide phones, and text spacing at laptop sizes show the reading list with no dots, where the Phase 3 layout pinned landscape phones. That is the gate working as designed. Revisit only if the owner wants the dots there.
  - **For Phase 8:** under reduced motion the hook republishes `data-thread` only when the static keyframe changes, so inside a transit it can lag the committed target. Nothing visible reads it outside `staged` now. Keep it that way, or publish on every reduced-motion scroll, before keying anything visible on `data-thread` outside the staged board.

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
  - Keep `contain: layout` on the numerals (or on whatever decoration animates inside a step box), or the fit gate's staged re-checks flow the scene again (rule 14).
  - Replace the scroll-driven `orbit-turn`, `orbit-digit` and `orbit-reveal` animations with the dots' own progress, as the Services captions read `--reveal-<shape>` (Phase 7). Don't use timed CSS transitions: the owner rejected text that runs on its own clock ("make sure that the text animation, dot animation and scroll are sync").
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

**Done note (2026-09-29).**

- **Owner answers:**
  - Phase 7 was committed on its own first (`32efb4b`).
  - After seeing the first build, which followed B1's left-hand ring: "I like this to be center rather than on the left side so the rotation is genuine." Asked where the shape goes, the owner chose it centred above the numeral, with the neighbouring steps dim at both edges. This is DESIGN.md's new Wheel Rule. It supersedes two scope bullets above: "In variant B, the shape sits beside the ring", and the ring's dash in `pathLength` units (the ring is dashed in px; a path-unit gap can't follow a vw radius in CSS).
- **Shipped:**
  - **Restyle** (`process-section.component.tsx`):
    - The white plates, their dots and the bullets are gone. Step titles are Title type in Lamp White (32px on `short` phones), and the paragraph is Body.
    - The label is "How I work" with an `aria-hidden` position count ("· 04 / 05") on the staged board. The count is keyed to `--reveal-<shape>`, like Services'.
    - **The ring** is one Wire Grey circle with a 3px round-capped stroke, dashed `0 10px`, running from the ring's top to the frame's foot. Its dots drift with the scroll (`orbit-spin`, now the only scroll-timeline animation).
    - **A centred wheel at every width:**
      - The label is top-left. The slot is centred, as wide as the content and at most twice its height, and takes the height the step leaves (up to 268px on a phone, 416px on desktop). It ends above the numeral's box.
      - The numeral is centred on the top of the ring, with the title and body under it. The neighbours wait on the rim at both edges on desktop and off screen on phones.
      - The geometry is in `--orbit-*` variables on the container. Staged and unstaged boxes stay identical.
    - Under reduced motion, a docked numeral's black ground now hides the digits of the curtain it covers. They had peeked 1–2px above it.
  - **The triggered turn:**
    - `process: { share: 0.4, isThread: true, hasTurn: true }`, so the hook commits How I work's steps and publishes `data-thread` for them.
    - `resolveThreadTurn` is the dots' own position in the scene, eased on the signal ease: −1 on the flight in, up to the last step. The hook writes it as `--thread-turn` on the orbit's container, only when it changes.
    - The `orbit-step` utility turns it into each step's rotation about the circle centre, plus:
      - `--orbit-assemble`: the digits' assemble and the title's sweep. It runs one step ahead, so both neighbours wait assembled.
      - `--orbit-lit`: the brightness, and the paragraph's sweep.
    - Nothing runs on a clock, and there is no lock. The numerals keep `contain: layout`.
    - Gone: the scroll-driven turn, digit and reveal animations, the nested turn wrappers, `resolveStepHandover` and its helpers, `ORBIT_RING_PATH_LENGTH`, `StepHandover`, `SECTION_TITLE_CLASS`, `SECTION_BODY_CLASS` and `--signal-ease`.
  - **Crossings between two thread scenes stay a scrubbed flight (decided).** Keyframes carry their `scene`, and `isThreadSegment` threads two steps only inside one scene. During a crossing both frames are moving, so a shape played ahead of the scroll would hang at the next pinned slot over the outgoing copy. DESIGN.md's Thread "Entry and exit" and the One-Scroll Rule say so.
  - **The shapes at full size:** `PROCESS_LINE_ART_TUNING.sizeRatio` went from 0.45 to 0.58, so the page is about 270px wide at 1440×900 and on a 390×844 phone. The pose and the depth light read well in the captures and are unchanged. Between two states the dots now draw in pen order, like Services.
  - **Docs:**
    - CLAUDE.md: the orbit paragraphs, the triggered scenes, Sections, the `aria-hidden` list and the view-timeline note.
    - DESIGN.md: the status note, the Wheel Rule, Numeral, Title, the ring in Shapes, the One-Scroll Rule, Thread's entry and exit, and Orbit.
    - This handoff: rules 8 and 14.
- **Evidence:**
  - `pnpm check` is clean and 380 unit tests pass. New ones cover the crossing rule, `resolveThreadTurn`, the orbit stylesheet and the process label.
  - **e2e:** all 139 specs pass on a production build at :3100 (a same-drive copy, webpack build, Supabase up, `draft = published`).
    - The rewritten orbit tests:
      - one turn per commit, at every formed step, at 1440×900, 390×664, 375×548 and 1920×1080;
      - the active step whole and hit-testable, the neighbours turned and dim on both sides, the step two ahead hidden, and the slot clear and on top of hit testing;
      - the turn playing by itself past the trigger (not before it), never running back, taking at least half a draw, and landing with its drawing;
      - staged and unstaged boxes identical;
      - reduced-motion curtains that never cover the label or the slot, with exactly step `k`'s title showing at each docked position;
      - 740×280 flow;
      - forced colours, with each formed title hit-testable;
      - `contain: layout` on every numeral.
    - **Mutation check** (in the throwaway copy): snapping the turn to whole steps failed the landing test (0ms against a floor of 800ms). Hiding the next step failed "next numeral not waiting on the rim".
  - **Where it pins** (dev server):
    - It pins at 1920×1080, 1440×900, 1366×768, 1366×657, 1280×720, 1024×768, 820×1180, 768×1024, 390×844, 390×664, 360×640, 375×548 and 360×560.
    - It flows at 320×568, 740×360, 740×304, 740×280, 667×320 and 320×256, and with WCAG text spacing at every size tested (1920×1080, 1440×900, 1024×768 and 360×640).
  - **The loop sleeps at rest** in listening and building (`hero.spec.ts`, 0 RAF over 500ms).
  - **Hero pixel diff:** 0 pixels against Phase 7 (`32efb4b`, a throwaway worktree on :3201) at DPR 1 and 2, at rest and with reduced motion. Against `0a3c97a` it is the same 20 pixels (up to 2/255) and 24 (up to 1/255), all in the name's box, as Phases 5–7 measured.
  - **Captures** at 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844, 390×664 and 375×548, plus frame strips of a turn. They are in `.local/phase8/shots/`, git-ignored.
  - **A five-lens review** (engine, layout and DOM contract, accessibility, tests, conventions and docs), each lens followed by an adversarial skeptic. It raised 25 findings and confirmed 23, which come to 15 distinct problems. All 15 are fixed:
    - The numeral's box poked into the slot's foot, where the unstaged digits took the slot's pointer. The slot now ends above the box.
    - Two tests could pass vacuously: forced colours checked the titles at scroll 0, and the reduced-motion curtains never asserted which step docks.
    - `--thread-turn` was written on Services too (now only where `hasTurn`), and `--signal-ease` was dead.
    - The turn sampler could miss the formed frame by one frame.
    - The previous neighbour was never asserted as shown, and `contain: layout` was no longer guarded.
    - Stale docs: rule 8's band, rule 14's slot sentence, the reading-list numeral size, the short-phone copy budget, the `aria-hidden` list and the view-timeline note.
- **Open:**
  - **Owner:** scroll How I work on a wheel, a trackpad and a phone (the last acceptance item), and confirm the drifting ring dots (Phase 4 decision 3). Services' scroll test (Phase 7) is still open too.
  - The mockup canvas still shows B1's left-hand ring; DESIGN.md's Wheel Rule records the change.
  - **Where How I work flows:** with text spacing it now flows at 1920×1080 too, where Services still pins. The stacked wheel is height-hungry. The gate is working as designed.
  - On short laptops the numeral gets small (144px at 1366×657) so the shape keeps room.

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

**Done note (2026-09-30).**

- **Owner answers** (asked first; recorded under "Open owner decisions"):
  - Phase 8 was committed on its own first (`e8cbbe5`).
  - Between two projects the frame unwinds with the old project and redraws round the new plate.
  - Tabbing onto a hidden project's link shows that project. This replaces DESIGN.md's earlier "keeps every hidden caption out of the tab order", which would have dropped the other projects' links from screen readers too.
- **Shipped:**
  - **The deck** (`projects-section.component.tsx`). `#project` is a thread scene (`DOT_SCENE_MOTION.project`, share 0.72, like Services), with one `frame` step per visible project (`buildDeckShapes`) and a container `--steps` frames tall.
    - The first child is the sticky frame, as before: a label spacer and the one slot at the plate's rect. The slot is now `pointer-events-none`.
    - The second child is `<ol data-deck>`. Staged, it is the board: sticky, one frame tall, with the cards stacked in one grid cell. Unstaged (reduced motion, no scroll-driven animations, short screens, no JavaScript, no WebGL2, the gate's flow), it is the Phase 5 list, sliding past the pinned slot with the phone windows.
    - Each card is a fixed-height `article[data-fit-box]` (`PROJECT_CARD_CLASS`), so the gate flows the deck when a card can't fit. The cards grow instead when `unpinned` or without JavaScript.
    - With one visible project there is no deck (an inline `--caption-reveal: 1`); with none the scene is dust, as before.
  - **One project per commit.** The engine names a step `formatSceneStepId(scene, k)` when its scene repeats a shape, so `data-scene`, `data-thread` and `--reveal-project-k` read `project-1`…`project-n`, while Services and How I work keep their shape ids and a lone project keeps `project`.
  - **The redraw.** Between two thread keyframes of one scene with the same shape (`isRedrawSegment`), `uRedraw` drops the flight, and the vertex shader unwinds the frame in pen order over the first half of the hop and redraws it over the second, by opacity alone (`redrawEdge` 0.02). A hop back plays it in reverse. With `uRedraw` 0 the maths is unchanged.
  - **The captions** are drawn by the dots' own progress, as Phase 7 ruled, not keyed on `data-thread` as this phase's scope said. `[data-caption="project-k"]` maps `--reveal-project-k` (literal selectors up to `PROJECTS_MAX`) to the card's label count, title, summary and tag row (`caption-line`), and to a clip-only wipe of its plate (`plate-sweep`), so the image never slides inside its frame. The old card wipes out over the first half of the hop and the new one sweeps in over the second. The later labels' "Work" is `inline-block staged:invisible`, so only the count changes.
  - **Links:** the title is the link (`PROJECT_TITLE_LINK_CLASS`), with a hover underline. Its `::after` carries the hit area, the 3px ring and the forced-colours outline: over the card in the list, over the title on the board. The keyboard rule is two `:has(:focus-visible)` rules in globals.css. Every card stays in DOM, tab and reading order.
  - **Shared helper:** `buildLineStyle` moved into `step-motion.rules.ts`; Services, How I work and the deck had one copy each.
  - **Docs:** CLAUDE.md (the triggered scenes, the ids and the redraw, Sections > Projects), DESIGN.md (the status note, Projects, the swap, the One-Scroll Rule, Thread's entry and exit, plate frames, where it pins), PRODUCT.md (the Work line, and the How I work line stale since Phase 8), and this handoff (the timeline and shader notes, rules 8, 12, 13 and 14, a landmine and the owner decisions).
- **Evidence:**
  - `pnpm check` is clean and 410 unit tests pass (380 at Phase 8). The new ones cover the step ids, `isRedrawSegment`, the deck's trigger and reveal rules, `buildDeckShapes`, the stylesheet (every `project-k` rule up to `PROJECTS_MAX`, the keyboard rules in order, `plate-sweep` never sliding), the deck markup against the engine's ids, and an emptied deck staying on dust.
  - **e2e:** 174 specs pass on a production build at :3100 (a same-drive copy, webpack build, Supabase up, `draft = published` before and after). The new deck tests:
    - one project per commit at 1440×900, 390×664 and 375×548: only the committed card revealed and hit-testable (title, summary, tag row, plate and count), the others not;
    - a stop past the trigger commits and plays by itself, a nudge below it doesn't, both ways, taking at least half a draw, and the scroll never moves or is held;
    - the sync: two cards never show at once, the old card stays whole until its reveal falls, and the new title and plate land within 50ms of the drawing;
    - the redraw itself: lit pixels in a band over the frame's top edge drop to 0–1% of the formed count mid-hop and come back, both ways (with `uRedraw` forced to 0 in a WebGL shim they stay at 98%);
    - a pointer parked on the plate across a hop never reaches the slot, and the loop sleeps after the landing strike;
    - staged and unstaged boxes identical, every staged plate on the slot;
    - the keyboard rule with the real link classes: each tabbed link reveals only its card, shows its ring inside the title, and hands the board back on blur, with the scroll unchanged;
    - the list under reduced motion, without WebGL2 and without JavaScript (cards in order, at least one frame tall, nothing clipped);
    - forced colours: the list's screens opaque, the board's clear with the rings hidden and "Work" never blanked;
    - the fit sizes (below) and the editor preview: the deck in the phone layout, and blanking project 2's title live drops it to two cards, then restores it.
  - **Mutation checks:** the test agents ran each new test against a regression, applied in a throwaway copy of the spec, in the page, or as a stash of the source, and every one failed. The unit set was run against 23 mutations of `src` in a scratch copy.
  - **Hero pixel diff:** 0 pixels against Phase 8 (`e8cbbe5`, a worktree on :3201) at DPR 1 and 2, at rest and with reduced motion, so the shader change leaves the name untouched. Against `0a3c97a` it is the same 20 pixels (up to 2/255) and 24 (up to 1/255), all in the name's box.
  - **Where it pins** (placeholder titles): 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 820×1180, 768×1024, 390×844, 390×664, 360×640, 375×548, 360×560, 320×568 and 740×280. It flows at 740×360 (by 2px), 740×304, 667×320 and 320×256. With WCAG text spacing it pins at 1920×1080, 1440×900 and 360×640, and flows at 1024×768 and 740×360.
  - **Captures:** the deck at rest at 1440×900 and 390×844, a frame strip of a hop (the frame unwinding clockwise from the top-left as the image wipes out, then redrawing as the next sweeps in), and the reduced-motion list. They are in `.local/phase9/`, git-ignored.
  - **A five-lens review** (engine and DOM contract, accessibility, conventions and simplicity, tests, docs), each finding reproduced before it was reported and checked again before it was fixed. It raised 26 findings, which come to 23 distinct problems once the overlaps between lenses are merged. 21 are fixed. One is recorded as a consequence of the owner's keyboard rule, and one as a pre-Phase 9 editor edge (both under Open). The ones that mattered:
    - A pointer resting over the plate mid-hop reached the slot (the plate is clipped away then), scattered the next frame and kept the loop drawing for about 3s. The slot is now `pointer-events-none`, like Contact's.
    - The gate's cleanup wrote the old `data-dot-shapes` back, so hiding every project in the editor left the preview drawing frames round nothing. The cleanup no longer writes the shapes.
    - In forced colours the later labels' invisible "Work" painted a text backplate that blanked the `<h2>`'s "Work" while staged.
    - The forced-colours focus outline sat on the link, where the title's sweep clipped its left edge; it is on the `::after` now.
    - Nothing tested the redraw itself, the pointer, or the deck without JavaScript; the forced-colours tests were duplicated in two specs.
    - Stale docs: the redraw's scope, the fallback's card height, the step-scene frame, the backward hop, PRODUCT.md, and rules 8 and 12–14 here.
- **Open:**
  - **Owner:** scroll the deck on a wheel, a trackpad and a phone (the last acceptance item). Services (Phase 7) and How I work (Phase 8) are still waiting for theirs.
  - **Focus wins while focused** (the owner's rule). After a mouse click on a title, the first arrow-key scroll makes the link `:focus-visible` in Chrome, so the board holds that project while the dots move on, until focus leaves. The same happens when Space or PageDown scrolls while a card link has keyboard focus.
  - **Going from no visible project to one** in the editor preview draws no frame until the next resize, because the section stays one frame tall and the hook only watches the slots it found at start-up. This dates from Phase 6's conditional slot. The public page never changes its count at runtime.
  - **Landscape phones** at 740×360 (by 2px), 740×304 and 667×320 show the reading list, while 740×280 pins (see "Open owner decisions").
  - **A long owner title** flows the deck sooner: titles take the default statement size with no step down by length (up to 60 characters). Decide when the real projects arrive.
  - The editor's "unpublished changes" flag compares timestamps, not content (see the landmine).

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

**Done note (2026-09-30).**

- **Owner answers** (asked first; recorded under "Open owner decisions"):
  - Phase 9 was committed on its own first (`684db97`).
  - **Text reveal: "with the dots".** The dots' own progress draws every section's label, statement and copy: in as the section's dots land, out as they leave, replayed on every visit. Body copy sweeps per paragraph, never a line rise, and the stats count with it. This replaces old Part 3's timed, observer-armed reveals: the arming rules, the `data-reveal="armed"` guard and the observer margins are gone, and the one-style guard replaces the armed guard.
  - **Sweep edge:** hard, everywhere (`caption-line`).
  - **Scroll-progress hairline:** 1px Wire Grey (the foreground at 40%).
  - **Nav dot:** 6px Lamp White, shared with the cursor's dot (size, colour and `INDICATOR_TRANSITION`).
  - **Heading parallax:** first "no", then "I think we add parallax". Asked where, the owner chose every single-frame screen (the quote, About, Testimonials, FAQ, Contact), desktop only. It is built as the copy drift.
  - **Adaptive cursor:** yes, as old Part 4 designs it.
  - **Cursive logo:** yes, from the owner's own SVG at `public/brand/logo.svg`. It hasn't arrived, so it isn't wired (see Open).
- **Shipped:**
  - **Engine:** `resolveSceneRange`, `resolveRevealRange`, `resolveSceneReveal` and `resolvePushRadius` in `dot-field.rules.ts`. The hook writes `--scene-reveal` on every scene container and `data-push-radius` on the stage while `canPush()`, and slots also listen to `pointerover`. A scene without a slot, or a pinned frame that grew past the viewport (`isGrown`, a review fix), stays lit through the transit after it.
  - **CSS (`globals.css`):**
    - the `swept:` variant, and `[data-dot-scene]` → `--scene-lit` → `--caption-reveal` with its `:focus-visible` rule;
    - `caption-line` with `--caption-last`, a ±100% vertical clip allowance, and a focused line that drops its clip;
    - `stat-count` (`@property --stat-count`: the number in `::before`, the suffix pinned in `::after`);
    - `screen-timeline`, and `copy-drift` with `contain: layout`;
    - `scroll-progress`, the `@media (scripting: none)` reset, the native-cursor rule, and one `--ease-signal` token for every CSS transition.
  - **Sections:**
    - Every label word, statement and copy line sweeps, including the About stats row (whose rule draws with it), the FAQ rows and the footer bar. A lone project card follows its scene's reveal too.
    - The quote is a server component with no Motion, and the timed reveal constants are deleted.
    - The About counts are an `aria-hidden` counter overlay (`parseStatCount`).
    - The FAQ disclosure eases height and the plus over 0.35s.
    - The five single-frame screens drift on desktop.
  - **Header:**
    - `setActiveSection` replaces `selectSection`, and clicks only close the menu.
    - The scroll-spy is `resolveActiveSection` in `navigation.rules.ts`, measuring each section against its own `scroll-margin-top`.
    - The nav dot is a `layoutId` `motion.span`, in the Primary nav only.
    - Also: the hairline, the menu wipe, and `data-reveal` on the header, its groups and the four hero Motion elements.
  - **Contact:** the form turns `invisible` in a shared grid cell. The acknowledgement takes focus through a module-level callback ref and sweeps in with `@starting-style`. The form is `method="post"`, so a submit without JavaScript no longer puts personal data in the URL.
  - **Cursor:** `AdaptiveCursor` (mounted only in `src/app/page.tsx`), `cursor.rules.ts` and `supportsCustomCursor()`.
  - **Docs:** CLAUDE.md, DESIGN.md (the status note, Motion, the Square Signal Rule for the cursor ring, the sections, Navigation and a new Cursor entry), PRODUCT.md, and this handoff (DOM contract rules 4, 11 and 14, the carried-over items and the landmines).
- **Evidence:**
  - `pnpm check` is clean and 499 unit tests pass (410 at Phase 9).
  - **e2e:** 245 specs pass on a production build at :3100 (a same-drive copy, webpack build, Supabase up), run serially in 12.7 minutes, with `draft = published` before and after. A full run before the review fixes passed 239 of 239. The new specs:
    - `section-motion.spec.ts` (21):
      - formed scenes show their text whole and the other scenes' text hidden, at 1440×900 and 390×844, and each step scene's label word is whole at every step;
      - the sweep follows the dots both ways and replays;
      - the one-style guard: a stepped scroll at 1440×900, 390×664, 375×548 and 740×304, with every formed scene's lines whole;
      - keyboard focus lights the scene and unclips the focused line;
      - the About stats: the counts at their targets, each overlay as wide as its real value, a count mid-arrival, the aria snapshot and forced colours;
      - reduced motion;
      - the grown-frame guard: every quote, About and Testimonials line whole at some stop in full view, at 740×304, 640×304, 320×256 and 1440×900 with text spacing.
    - `motion-fallbacks.spec.ts` (15):
      - no JavaScript, WebGL2 off, context loss (which also drops the push radius) and 320×256;
      - the copy drift: positive on arrival, none while pinned, negative on leaving, and none on phones or under reduced motion. Every column is layout-contained, and a raised drift never flows Contact;
      - the FAQ disclosure and its snap;
      - CLS 0 at 1440×900 and 390×844, counted from the moment the fonts are loaded.
    - `navigation.spec.ts` (11):
      - the scroll-spy and the one nav dot at every section, and the deep link;
      - a nav flight stepping in order;
      - reduced motion and forced colours;
      - the hairline, the menu wipe, and an open menu following the spy.
    - `cursor.spec.ts` (22): old Part 4's acceptance on today's page.
    - **Changed:**
      - `hero.spec`: the quote's sweep.
      - `contact.spec`: the focused acknowledgement, and a 390×844 submit that keeps the section's and slot's heights.
      - `smooth-scroll.spec`: waits for the menu wipe.
      - `editor.spec`: no cursor in the editor or its preview.
  - **Mutation checks:** every new test was shown to fail against a break applied in the page (an injected rule, attribute or custom property, or an emulated media feature). The review's new guards were also shown to fail on the build from before the review fixes and to pass after it.
  - **Hero pixel diff:** 0 pixels against Phase 9 (`684db97`, a worktree on :3201) at DPR 1 and 2, at rest and with reduced motion. Against `0a3c97a` it is the same 20 pixels (up to 2/255) and 24 (up to 1/255), all in the name's box.
  - **Recordings** for the owner's sign-off, in full Chromium, git-ignored:
    - `.local/phase10/recordings/phase10-1440x900.webm`: a wheel scroll, 84s.
    - `.local/phase10/recordings/phase10-390x844.webm`: touch swipes, 81s.
  - **A five-lens review** (engine and DOM contract, accessibility, conventions and simplicity, tests, docs), each lens followed by an adversarial skeptic. It raised 22 findings. The skeptics confirmed 15, which come to 14 distinct problems once the engine and accessibility lenses' shared finding is merged; all 14 are fixed. The ones that mattered:
    - **Grown frames were never read whole.** Where rule 12 grows a single-frame screen past the viewport (landscape phones, 400% zoom, text spacing), its lower lines came into view only after its pin, while the sweep was already wiping them out. About's stats read "1+ 123+ 34" at 740×304, and were never readable at 320×256 or with text spacing. Those keyframes are now `isGrown` and stay lit through the transit after them (`resolveRevealRange`), like the FAQ.
    - **The copy drift's containment was a false claim.** The column's `@container` contains nothing, so a large drift could flow Contact on the next gate check. `copy-drift` now gives its column `contain: layout`, and the docs say so.
    - **A lost WebGL context left `data-push-radius` on the stage,** so the cursor showed a push ring over the text name. `markUnsupported` deletes it, and `canPush()` returns false on a lost context. That also closes a race where a resize before React's cleanup wrote "0".
    - **A lone project card ignored the scene's reveal.** Its inline `--caption-reveal: 1` (`buildShownCaptionStyle`) is gone.
    - **Tests:** the spy's unit tests now land at 90px, so a fixed offset fails them. The stat overlay's width is checked against the real value, and a vacuous unit test was deleted.
    - **Conventions:** one `--ease-signal` token replaced four hand-copied eases, and `resolveThreadTurn` reuses `resolveSceneRange`.
    - **Docs:** the caption-stagger rule, the stat overlay's geometry, the no-JS rule (the cursor and the drift), DESIGN.md's motion rules (three ways, and the two named property exceptions) and Contact's box.
  - **Found and fixed while finishing the specs:** the About counter moved its "+" each time the count gained a digit, a layout shift at both widths. The number is now in `::before` and the suffix is pinned in `::after`, so each `dd` is `relative w-fit`. The settled overlay is pixel-identical to the real value.
- **Open:**
  - **Owner:**
    - Sign off the two recordings (the last acceptance item).
    - The scroll tests for Services (Phase 7), How I work (Phase 8) and the deck (Phase 9) are still waiting.
  - **The cursive logo** hasn't arrived. When the owner saves `public/brand/logo.svg`, wire it into the header brand: keep "Criztian" as the accessible name, render it in Lamp White (a CSS mask or `currentColor`) at the placeholder's height, and update DESIGN.md's Brand line.
  - **A cold load at 1440×900 shifts the hero once** (CLS 0.008, source `#home > div`): the tagline wraps to two lines in `Geist Fallback` and to one in Geist. It is the same at `0a3c97a` and Phase 9, so it goes to Phase 11's performance pass. The CLS specs count from the moment the fonts are loaded.
  - **Stale reveal under reduced motion:** `resolveContainerReveal` uses the live `progress` while `publishSceneState` uses `staticIndex`, so `--scene-reveal` can go stale there. Nothing reads it then, because `swept:` and `staged:` both need motion allowed.
  - **Reduced-motion details:**
    - The nav dot lands on the second frame after an instant scroll: Motion's `layoutId` projection paints the old spot once, then snaps, with no slide.
    - If reduced motion turns on while the cursor ring is in push, that one shrink still animates for 0.3s.
    - The cursor's springs keep stepping, which costs frames only.
    - The cursor's `useScroll` and `useVelocity` also run on phones, with no DOM writes, listeners or frames at rest.
  - **Without JavaScript,** the copy drift still runs (plain CSS that hides nothing), and a submit is a POST that still delivers nothing, as before.
  - **Data-folder convention:** `section-navigation.component.tsx` still defines `MOBILE_PANEL_ID`, `SOLID_AFTER_SCROLL_PX` and the header variants inline. This predates Phase 10.

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

**Done note (2026-10-01).**

- **Owner answers** (asked first, and during the phase; recorded under "Open owner decisions"):
  - Phase 10 was committed on its own first (`78f4973`).
  - **The cursor over the dots** ("a giant circle … I want it consistent size, small"): the ring stays the 36px idle ring over every dot object. Links, buttons and FAQ questions keep the 56px disc. The owner checked it on the dev server: right.
  - **Section titles** ("hard to identify … a big title first, then small as you scroll"): bold Antonio labels that arrive as a big title and dock into the label. It took three rounds:
    1. The title showed for the whole arrival. The owner: it overlapped the old section and the flying dots.
    2. It waited for the old section's text to wipe out, with a black halo against the dots. Approved, then: "it should take time for the title to emphasise it".
    3. It holds about four times longer, and the section's copy waits for it. Approved ("Yes, this is it").
  - **Pause motion:** yes, a square toggle in the header, remembered by the browser. The owner checked it: right.
  - **Smooth scroll:** keep `SMOOTH_SCROLL_LERP` 0.1 (signed off).
  - **Devices:** an Android phone and an iPhone, used at the end of the phase. Playwright's WebKit was to stand in for Safari meanwhile, but it can't run on this machine (see the landmines).
- **Shipped:**
  - **Section titles:**
    - `SECTION_LABEL_CLASS` is bold Antonio (18px, 20px from 768px, in the same 16px line box).
    - `swept:section-title` on each titled scene container animates `--title-grow` and `--title-hold` on its `--screen` timeline.
    - `section-title-word` scales the word from its bottom-left corner up to `min(8rem, 17cqi, 14svh)` and carries the black `--title-halo`.
    - `section-title-count` hides the position count until the word docks.
    - `--title-gate` holds back `--scene-lit` and all 14 literal step reveals.
    - Every labelled scene container now carries `screen-timeline`, including Projects, Services and How I work. Process's own `--step-scene` timeline is gone, and `orbit-spin` runs on `--screen`.
  - **Pause motion (WCAG 2.2.2):**
    - `setMotionPaused`, `isMotionPaused` and `subscribeMotionPreference` in `browser-capability.rules.ts`. `prefersReducedMotion()` includes the pause.
    - `useIsMotionPaused` and `usePrefersReducedMotion` (`use-motion-preference.hook.ts`), and the `MotionToggle` in the header's right-hand wrapper.
    - A `beforeInteractive` restore script in the root layout, and `MotionConfig` set to "always" while paused.
    - CSS: `staged`, `swept`, `copy-drift` and smooth `scroll-behavior` exclude the pause, and `motion-safe`/`motion-reduce` are redefined.
    - Every listener that read the media query now subscribes to both: the dot hook, the cursor, SmoothScroll and SceneFitGate.
  - **Cursor:** the `push` state, `data-push-radius` and the cursor's landing observer are gone.
  - **Copy crossings:** How I work's `--orbit-assemble` and `--orbit-lit` are capped by `--scene-lit`, so the wheel's copy wipes out with its dots instead of staying lit through the exit.
  - **Published-content cache:** the admin client fetches with `cache: "no-store"` and `/` exports `dynamic = "force-static"`. Tags weren't used: tag state lives in memory, so a fresh build would replay the stale document anyway.
  - **CLS:** the hero tagline's box is `md:max-w-[35rem]`, so it is one line in both Geist and `Geist Fallback`.
  - **Turbopack warning:** `/* turbopackIgnore: true */` on the preview directory's `process.cwd()`. The tRPC route's trace fell from 287 files to 107, with no project files.
  - **Accessibility audit** (four lenses: keyboard, semantics, reflow and visual, each with an adversarial skeptic). It raised 10 findings; the skeptics confirmed 7, and all 7 are fixed:
    - **A failed or pending submit dropped focus to `<body>`.** The button is `focusableWhenDisabled`. "Sending…" is announced through an always-mounted `role="status"`, and the submit error is tied to the button with `aria-describedby`.
    - **How I work's label was painted over by its first step** whenever the scene flows (text spacing, zoom). The step list is `unpinned:static`.
    - **The position count slid in over the shrinking word.** Its opacity factor went from 20 to 80.
    - **In a light forced-colours palette, the black canvas stayed the page ground,** so the header buttons and their focus outlines vanished at the top. Under forced colours the canvas layer is invisible and the text `<h1>` shows instead. The toggle and the menu button carry `focus-visible:outline-hidden`, so forced colours draw an outline.
    - **The mobile menu marked the current section by brightness alone.** The current panel link is underlined.
    - **Forced colours:** Send's focus showed only as a border colour change, and the select's chevron went white on white. Both are fixed.
    - The two refuted semantics findings were fixed anyway: each field has `aria-invalid` (false until an error shows) and `aria-describedby` to its error. The refuted reflow finding (Testimonials' big title at text spacing) needed no change: `17cqi` stays.
  - **Conventions:** the header's inline constants moved to `navigation.data.ts` and `motion.data.ts`, and the hero's to `hero.data.ts` (`HERO_*`). This closes Phase 10's open data-folder item.
  - **Docs:** CLAUDE.md, DESIGN.md (tokens, hierarchy, the One-Statement exceptions, the four-way One-Motion Rule, the pause, the halo, the cursor and the header), PRODUCT.md, the README, the regenerated `.impeccable/design.json`, and this handoff.
  - **Performance:** the client `Hero` rendered the tagline through Tiptap, which shipped Tiptap, ProseMirror and the whole site-content schema to every visitor. `SitePage` now renders it and passes `taglineHtml` down (CLAUDE.md, Site content). Script on `/` fell from 500 KB to 378 KB gzipped.
- **Evidence:**
  - `pnpm check` is clean and 515 unit tests pass (499 at Phase 10).
  - **e2e:** 275 specs on a production build at :3100 (Turbopack, Supabase up, `draft = published` before and after).
    - The full run passed 273. The two failures were section-motion's own model, which predated the copy gate: its sweep model now folds `--title-gate` into each line's expected reveal, and the About count probe moved from 0.8 to 0.9 of the transit, because the stats now wait for the title. The spec then passed 21 of 21.
    - After the tagline moved to `SitePage`: the hero and fallback specs passed 35 of 35 and the editor spec 5 of 5.
    - **New:**
      - `section-title.spec.ts` (20: ten tests at 1440×900 and 390×844). The word is docked at every anchor and hidden while the outgoing text wipes out. It is big, whole and in the viewport through the hold, and never over its frame's slot, plate or statement. The copy waits for it, it docks by 92% of the entry and grows again on the way back. FAQ never grows, nor does anything under reduced motion or the pause, and nothing shifts layout.
      - `motion-pause.spec.ts` (11): the toggle's size and place at both widths, Enter and Space, the remembered pause through a reload, the cube's loop stopping and restarting, the Services captions unstaged, Lenis stopped, About's copy still, the tab order, and the toggle hidden under reduced motion, without JavaScript and outlined in forced colours.
    - **Changed:** the cursor spec (the push tests became idle-ring checks), motion-fallbacks (no push radius), section-motion (the title hold and the gate) and step-motion (the reveal read through the gate).
    - **Mutation checks:** every new test was shown to fail against a deliberate break of the page and to pass without it. The last four title tests were re-checked on the final build with an injected rule each: the word always shown, no gate, the dock moved to 99% of the entry, and no growth. Each made its test fail.
  - **Hero pixel diff:** 0 pixels against Phase 10 (`78f4973`, a worktree on :3201) at DPR 1 and 2, at rest and with reduced motion, before and after the tagline move.
  - **Accessibility:** 7 confirmed findings, all fixed (see Shipped). The audit covered the keyboard (tab order, focus visibility, the menu and the deck), the accessibility tree, axe at nine formed stops (running and paused), 200% and 400% zoom, text spacing, and forced colours in both palettes.
  - **Performance** (full Chromium on this PC against the production build with the cache disabled; `.local/phase11/perf.mjs`):
    - **Cold load:** CLS 0 at 1440×900 and 390×844, counted from navigation (it was 0.008 at 1440×900). LCP is 0.98s and 0.81s locally.
    - **Weight:**
      - 504 KB on first load: 378 KB script gzipped, 56 KB fonts, 18 KB CSS and 25 KB HTML. It was 626 KB.
      - The plates load lazily: 8.5 KB at 1440×900 and 51 KB at 390×844 (DPR 3) after a full scroll.
      - Each plate gets the next variant up from the pixels it needs (750w for 700px, 640w for 480px, 1200w for 1026px), so `sizes` is right. The three placeholder sources are 79–92 KB WebP.
    - **Idle RAF:** 0 per second at rest in every scene except two, both moving by design: the cube (it spins) and Services (it sways) run at 60 per second. The pause stops both.
    - **Frame budget** (a wheel scroll from top to bottom):
      - At 1× CPU, p99 is 16.8ms with no frame over 20ms, at both sizes.
      - At 4× CPU throttling at 390×844, p95 is 33ms, 19% of frames take over 20ms and 1% over 34ms.
      - Style recalculation costs 7.8ms a frame against 1.2ms of script. That is the lead for the Android trace: the registered custom properties that the scroll timelines animate.
  - **Copy crossings:** captures before and after the fix, in both directions, are in `.local/phase11/transits/`.
  - **Recordings** for the owner's sign-off, in full Chromium, git-ignored: `.local/phase11/recordings/phase11-1440x900.webm` (a wheel scroll) and `phase11-390x844.webm` (touch swipes).
- **Open:**
  - **Owner, on devices** (the "owner" rows of the carried-over table):
    - The Android frame trace and fling test: USB debugging on, `adb reverse tcp:3100 tcp:3100` and `adb forward tcp:9222 localabstract:chrome_devtools_remote`, then `node .local/phase11/android-trace.mjs`.
    - The iPhone (Safari 26) checklist, `.local/phase11/iphone-checklist.md`, at the PC's LAN address on port 3100. Windows Firewall may need to allow Node on private networks.
    - Sign off the Phase 10 and Phase 11 recordings: the "wow and professional" sign-off.
    - The scroll tests for Services, How I work and the deck (open since Phases 7 to 9).
  - **Copy crossings accepted:**
    - On a phone, the incoming dots can meet the outgoing copy's last lines at the very end of a transit. Both frames are moving then, so this is architectural.
    - The sparse dust between FAQ and Contact crosses the FAQ rows.
  - **Script weight:** 378 KB gzipped is react-dom, Next's runtime, Motion, Lenis and the contact form's stack (tRPC, TanStack Query, React Hook Form and Zod). `zod/mini` or a form without the tRPC client would cut more, but the measured budget doesn't need it.
  - **The cursive logo** hasn't arrived (Phase 10).
  - **Still as Phase 10 left them:** the stale reveal under reduced motion, the nav dot's second-frame landing, the cursor's springs stepping, and a no-JavaScript submit that delivers nothing. The push-ring shrink is gone with the push state.

### Deployment (the owner's)

The owner handles deployment (owner, 2026-10-01). This is the checklist, for the owner and for any session the owner asks to help.

**Goal.** The page and the owner's dashboard run on a public host, with real email and readable contact messages, and nothing that runs locally today is weakened.

**What it needs** (checked against the code on 2026-10-01):

- **Hosting** for Next.js 16 (a Node server or a platform that runs one). `/` is prerendered and refreshed by `revalidatePath("/")` on publish, so the host must support on-demand revalidation.
- **A hosted Supabase project:**
  - the four migrations in `supabase/migrations/`
  - auth's `site_url` and redirect URLs (today `localhost:3000`, plus `/auth/confirm` and `/reset-password`)
  - signup disabled, and the owner's account created by hand
  - new `sb_` keys (legacy `eyJ…` keys are rejected)
  - SMTP for auth mail (password reset)
  - backups
- **Environment:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `OWNER_EMAIL` and `EMAIL_MODE`. `EMAIL_MODE` only accepts `preview` today.
- **A live email adapter:** `EmailAdapter` has only the preview, which writes HTML to `.local/email-previews/` and sends nothing. A deployed disk may be read-only or wiped, so a live adapter must exist before launch (the Resend adapter waits for this).
- **Reading contact messages:** they are stored in `contact_messages`, but the dashboard has no view of them yet.
- **The client address:** `readClientAddress` trusts the first `x-forwarded-for` entry for the rate limit. The host must overwrite that header, or the rate limit must read the host's trusted header instead.
- **A domain, DNS and HTTPS.**
- **Merging `portfolio/phase-3` into `main`** once the owner signs off.
- **The owner's material** before launch (the placeholders are marked in PRODUCT.md "Evidence on Hand"): the logo, the photo, the belief line and story, client quotes with permission, and real projects.
- **Before launch:** re-check the image-variant hang (landmines) on the host, and run the e2e suite against a preview deployment.

### New elements (to scope)

The owner is adding more elements to the page (owner, 2026-10-01). Nothing is scoped yet. The next conversation asks what they are, where they go and what they say, then writes the phase here with its scope, owner inputs and acceptance, like the phases above. Every new section follows the DOM contract and the fit rules; the prompt is under "Start here".

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
  3. Point a throwaway Playwright config at it: an absolute `testDir` of `tests/e2e`, a `baseURL` of `http://localhost:3100`, and no `webServer` (`.local/playwright.3100.config.ts` is one).

  Since Phase 11 the published read is uncached, so a build no longer replays a stale document and `.next/cache/fetch-cache` needs no deleting. Don't rebuild `.next` while `next start` serves it: stop the server first.

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
- **The e2e suite publishes the owner's draft.** `editor.spec.ts` edits the name, publishes, restores it and publishes again, so whatever else sits unpublished in the draft goes live. In Phase 5 that published the draft written for the owner to review. Before an e2e run, check `draft = published` in `site_content`, and ask the owner before running if they differ. Since Phase 9, the editor's deck test blanks project 2's title in the draft, checks the preview's deck and restores the title before the hero round trip publishes; it needs at least two titled projects in the draft. Run alone, it leaves the "unpublished changes" flag on with the content still equal, because the flag compares timestamps, not content (`hasUnpublishedChanges`).
- **The local Supabase may have no users.** `auth.users` was empty on 2026-09-20. Logged-in specs create their own throwaway user; never ask for the owner's password.
- **Never `pnpm db:reset`** on the owner's data. It re-seeds `site_content` as `draft = '{}'` and wipes `auth.users`. Apply new migrations with `pnpm exec supabase migration up --local`.
- **A production server can hang on image variants.** After one full e2e run, the Phase 6 server at :3100 timed out on two uncached `_next/image` variants (the About and client placeholders at `w=384`), while other uncached variants and Phase 5's server answered at once. Every later request for those two keys hung until the server was restarted; after a restart they load at every width. It was not isolated further. If a plate shows black in a capture, request its `_next/image` URL with curl before suspecting the page. Check this again before deploying.
- **Playwright's WebKit cannot run on this machine.** Windows' Smart App Control ("An Application Control policy has blocked this file") refuses its unsigned `ssl-60.dll` and `zlib1.dll`, so `webkit.launch()` fails its host check, and with the check skipped the browser exits at once. Safari proof comes from the owner's iPhone (`.local/phase11/iphone-checklist.md`). Don't disable Smart App Control to get round it: that is the owner's system setting, and it can't simply be switched back on.
- **Capture in full Chromium, not the headless shell.** Playwright's default `chromium-headless-shell` (SwiftShader) paints alpha-0 holes wherever an opaque sticky step overlaps the fixed canvas inside the isolated stage, so they look like white blocks. Use `channel: "chromium"` for screenshots and pixel checks. The e2e specs pass on either.
- **Measure fit at real heights, not only nominal sizes.** Phase 2 passed at 360×640 and 740×360, then failed on an iPhone SE's real svh (about 548) and a landscape phone with its URL bar (740×304). Every layout change to a pinned scene is re-measured at all of these:
  - 375×548, 360×560 and 390×664
  - 740×304, 740×280 and 667×320
  - 320×256 (400% zoom)
  - 360×640, 740×360 and 1440×900 with a WCAG 1.4.12 text-spacing stylesheet injected

  `tests/e2e/fit.spec.ts` covers the gate.

- **The mockup canvas is private.** Only the owner can share it (Share menu). Read its comments with the artifact comments tool; never publish site code to it.
- **A finished conversation's background workflow keeps running** (Phase 10). The first Phase 10 conversation ended its turn while its e2e agents still worked, and they went on editing specs and running against :3100 for about 45 minutes. That collided with the next session, which the first conversation then took for a rogue agent. Before resuming, check `ListAgents` and the previous session's `subagents/workflows/*/journal.jsonl` for agents still running.
- **A background server outlives its task.** When a background `next start` hits the task time limit, only the shell wrapper stops: `node` keeps listening on the port. Find it with `Get-NetTCPConnection -LocalPort 3100 -State Listen`, check its command line, and stop that PID before rebuilding `.next`.
- **Keep parallel Playwright agents to about four.** Eight at once crashed Chromium (`Target crashed`, exit 0xC0000142) from machine load, not from the tests.
- **Tailwind 4's `!` utilities are `!important` inside `@layer utilities`,** so a test can't override them with an injected unlayered `!important` rule: a layered important declaration beats an unlayered one. Break them by removing the class instead.
- **With JavaScript off in Playwright,** `page.addStyleTag` hangs and `requestAnimationFrame` from `page.evaluate` never fires. Inject a `<style>` through `evaluate`, and poll.
- **Touch scrolls for recordings:** CDP `Input.synthesizeScrollGesture` with `gestureSourceType: "touch"` scrolls nothing in this Chromium. Drive swipes with `Input.dispatchTouchEvent`, as `.local/phase10/record.mjs` does.

## Open owner decisions

- **Check the Phase 5 copy that went live locally (owner):** the e2e run published the draft Phase 5 wrote (the new tagline, the belief placeholder and the bracketed project placeholders), because `editor.spec.ts` publishes the whole draft. Keep it, or ask for the pre-Phase 5 published copy back (the row was backed up in the Phase 5 session).
- **Scroll Services (Phase 7, for the owner):** on a wheel, a trackpad and a phone. Nothing should ever hold the scroll; a drawing plays by itself once the scroll passes 12% into a transit.
- **Testimonials with several quotes:** the label counts them once there is more than one (owner, Phase 5), but how one quote gives way to the next is not designed. Decide when the real quotes arrive.
- **Scroll How I work (Phase 8, for the owner):** on a wheel, a trackpad and a phone. A step turns in by itself once the scroll passes 12% into a transit, and nothing holds the scroll.
- **Scroll the projects deck (Phase 9, for the owner):** on a wheel, a trackpad and a phone. A project commits once the scroll passes 12% into a transit and plays by itself; the frame unwinds and redraws round the new plate in place; nothing holds the scroll.
- **Where the deck flows (Phase 9, for the owner to see):** landscape phones at 740×360 (by 2px), 740×304 and 667×320 show the reading list with no dots, while 740×280 pins, because the statement's height cap shrinks the title there. A small cut to the card's copy would keep 740×360 pinned. Revisit only if the owner wants the dots there.
- **To confirm later:** the black-and-white photo, when it arrives, and the drifting ring dots, when the owner scrolls How I work.
- **Contact on small phones (Phase 6, for the owner to see):** the gather shows wherever the whole form fits one pinned frame (desktop, tablets, a 390×844 phone). Below that the section flows as plain black and the gather gives way, so a pin never hides the submit button.
- **Phase 10 (for the owner):** sign off the two screen recordings in `.local/phase10/recordings/` (1440×900 and 390×844); save the cursive logo as `public/brand/logo.svg` so a session can wire it (see Phase 10's done note).
- **Phase 11 (for the owner):** the Android trace and fling test, the iPhone checklist, and the sign-off of the Phase 10 and Phase 11 recordings (see Phase 11's done note, Open).
- **Material:** the belief line, the story and photo, client quotes, real projects.
- **Decided, recorded:**
  - Phase 11 wrap-up (owner, 2026-10-01): commit Phase 11 as it stands, with the device checks still open; the owner handles deployment; more elements come next
  - Phase 11 (owner, 2026-09-30): Phase 10 committed on its own first (`78f4973`); the cursor ring stays the small idle ring over the dots; section titles in bold Antonio that arrive big and dock into the label, the old section's text wiping out first, a black halo against the dots, a long hold, and the section's copy waiting for the title; a pause-motion toggle in the header, remembered by the browser; `SMOOTH_SCROLL_LERP` stays 0.1; devices checked by the owner at the end
  - Phase 10 (owner, 2026-09-30): Phase 9 committed on its own first (`684db97`); section text sweeps with the dots (in as they land, out as they leave, replayed every visit, body per paragraph, the stats counting with it); a hard edge for every text sweep; a 1px Wire Grey scroll-progress hairline; a 6px Lamp White nav dot shared with the cursor dot; parallax on every single-frame screen, desktop only (the owner first said no, then "I think we add parallax"); the adaptive cursor as old Part 4 designs it; the cursive logo, from the owner's own SVG
  - Phase 9 (owner, 2026-09-29): Phase 8 committed on its own first; between two projects the frame unwinds with the old project and redraws round the new plate, in place, and never flies; tabbing onto a hidden project's link brings that project onto the board, so every card stays in the tab order and the screen-reader order
  - Phase 8 (owner, 2026-09-29): Phase 7 committed on its own first; How I work is a centred wheel ("so the rotation is genuine"), with the shape centred above the numeral and the neighbouring steps dim at both edges
  - Phase 7 (owner, 2026-09-29): Phase 6 committed on its own first; Development's short copy is "High-performance, scalable websites tailored to your business."
  - Phase 6 (owner, 2026-09-29): Phase 5 committed on its own first; Work on a phone shows the frame through a clear window round each plate; frames never scatter under the pointer; the dust behind FAQ goes away (plain black); the Services B layout stays in Phase 7
  - Phase 5 (owner, 2026-09-29): the Projects heading and intro are retired; Work is one screen per project until the deck; the mockup's placeholder plates; the draft is written for the owner to publish; the submit button is uppercase; Testimonials shows no count while it has one quote; all nine FAQ answers are still true
  - positioning (PRODUCT.md)
  - reveals replay on re-entry
  - the direction-aware sweep keeps the natural mirror
  - the scroll-spy defaults (the dot hides off the centre links and steps under passed links during a flight)
  - the extras: the menu wipe-open, the contact success moment and the scroll-progress hairline
