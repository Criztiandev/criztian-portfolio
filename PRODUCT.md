# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: prospective freelance clients** deciding whether to hire Criztian for a build. The best-fit clients are:

- **Early-stage founders** who need an MVP or a first product built.
- **Small businesses** that need a working product or site and have no in-house team.
- **Agencies** that subcontract or white-label development work.

Established companies with in-house teams are not a primary target.

Their job on the site is to judge, quickly, whether Criztian can take their project from idea to launch, and then to start a conversation.

**Secondary: the owner (Criztian)**, who is the single authenticated user. The owner signs in to `/dashboard` and edits public content in `/dashboard/editor` with a live preview, a draft and a publish step.

## Product Purpose

A personal portfolio that wins freelance work. It is one public scrolling page (home, belief quote, projects, services, process, about, testimonials, FAQ, contact) that ends in a contact form, and behind it a private owner dashboard for editing that content. Success means qualified clients leave convinced and send a message through the contact form.

## Positioning

**One person who builds whole products** (owner, 2026-09-29). Criztian sells branding, web design and development as one package, and takes a product from idea to launch. The one thing a client should remember is "I build whole products". Founders, small businesses and agencies are addressed equally.

The site is built the same way. It has a hand-built WebGL hero, a real auth and database layer, and a draft/publish content editor, so the portfolio is itself evidence of the claim.

**Feeling:** calm, precise, premium.

**Voice:** short, plain, precise, in the first person. The owner approves every line of public copy.

Decided (owner, 2026-09-29): the hero tagline becomes "I build whole products. Brand, design and code." The seeded one ("Crafting timeless digital experiences through design, strategy, and code.") matched word for word the Framer template the hero was modelled on (adriavale.framer.website). Phase 5 made the new line the seed default and wrote it into the owner's draft, and the Phase 5 e2e run published it locally.

## Operating Context

- Clients arrive on the public page, scroll through sections linked by anchors, and convert through the `#contact` form. That form is the only conversion path on the site.
- The owner edits content in a three-pane editor (section list, live iframe preview of the real page, config panel). Changes save to a draft and go live only on Publish.
- Everything runs locally today (Next.js dev server, Supabase in Docker). Nothing is deployed.

## Capabilities and Constraints

**Services offered to clients** (the owner's copy, 2026-09-28; it replaces the earlier four services):

- Branding
- Web design
- Development

The owner's own summary: "I specialize in crafting custom web solutions, including branding, web design and development tailored to meet your business." Positioning reconciles this with the full-stack framing: the three services are one package that builds a whole product.

**Public site:**

- Single page. The anchors (`#home`, `#quote`, `#project`, `#services`, `#process`, `#about`, `#testimonials`, `#faq`, `#contact`) are the navigation. `#contact` must keep working because the e2e suite depends on it.
- **Order** (owner, 2026-09-29; built in Phase 5. The design is locked to mockup B, recorded in DESIGN.md, and Phases 6–10 in `plans/handoff.md` finish the dots, Services, How I work, the projects deck and the motion):
  1. Hero
  2. Belief quote
  3. Projects
  4. Services
  5. How I work
  6. About
  7. Testimonials
  8. FAQ
  9. Contact, with Let's connect's email merged in
  10. Footer

  Blog is hidden until real posts exist. About shows the owner's real photo, framed by dots like a project image. Testimonials pairs each client quote with the client's photo or logo, framed the same way. The layout follows mockup B ("Statement"): a huge statement on the left and one dot object on the right.

- The list below describes the page as built today.
- Every screen below the hero is the B statement split: a small section label, one big statement on the left and one object on the right (the object comes first on a phone).
- Hero: the name rendered as a dot-matrix WebGL wordmark whose dots scatter from a cursor or a finger and spring back. It falls back to a real text `<h1>` when WebGL2 is unavailable; with reduced motion the dots render still.
- Belief quote (`#quote`, not in the nav): scrolling out of the hero morphs the name's dots into a turning dot cube beside one owner-editable statement. The seed is a visible placeholder ("[Your belief line, in your own words]"); the owner supplies the real line.
- Work (`#project`): one screen per visible project ("Work · 01 / 03"), with the title as the statement, the summary, tag and stack, and a 10:7 plate on the right. A project without a valid image shows a monochrome placeholder plate with an "Image placeholder" chip. The three seeded cards are visible placeholders ("Project one", "[What you built, and for whom]"). The dots frame the plate as it lands.
- My services (`#services`): Branding, Web design and Development, each with the owner's short copy and six items, as steps scrolling past a pinned dot shape (restyled to B in Phase 7).
- How I work (`#process`): the owner's five numbered steps on a turning orbit, each with its dot shape formed beside the step's numeral (above the orbit on a phone; restyled to B in Phase 8).
- Who am I (`#about`): "I am Criztian.", the owner's line, a bracketed "[Your story, in your own words]" and three stats (5+ years experience, 500+ projects done, 140 happy clients), beside a black-and-white placeholder photo plate with a "[Your photo]" chip.
- Testimonials (`#testimonials`): one bracketed placeholder quote as the statement, its bracketed attribution, and a "[Client photo or logo]" plate.
- FAQ (`#faq`): the owner's nine questions in native disclosures, beside a big "FAQ".
- Get in touch (`#contact`): "Let's start your project today.", the "Or email me" line (Let's connect merged in), and the form.
- Blog is hidden from the page and the nav until real posts exist; its code stays.
- Contact form: name, email, a required "Service needed" select (Branding, Web design, Development, Something else) and "What can I help you with?". The service is stored with the message and shown in the notification.
- Contact form anti-spam: a honeypot, a two-second minimum time-to-submit, and a limit of five submissions per hour per hashed IP. These are deliberate; do not weaken them.
- Contact notifications are written as local HTML previews. No email is actually sent yet.

**Owner side:**

- Single owner account and public signup is disabled.
- Editable today: the hero (name, and a rich-text tagline with bold and italic only), the quote (text, and an optional author), the projects (up to six, each with a title, tag, summary, stack line, https link, image and alt text) and a curated set of six theme colours. The projects heading and intro were retired in Phase 5 (the label "Work" stands in); the schema still stores them.
- Project images are referenced, not uploaded: a file committed to `public/projects/` (for example `/projects/shop.webp`) or an https URL. Anything else shows the placeholder plate.
- Draft and published states only, with no version history.
- The content schema is built so that making another section editable is a data change, not a rewrite.

**Not built yet** (deferred on purpose, see README):

- hosted deployment
- live email
- reading contact messages in the dashboard
- a blog rendering pipeline
- editing the Services, About, Process, Testimonials, FAQ, Blog and Get in touch copy (hard-coded in `src/data/page-sections.data.ts` for now; the CMS for them comes later)

**Terminology:** _owner_, _draft_, _published_, _section_, _site content_.

## Brand Commitments

- The name **Criztian** is the hero wordmark and the site's identity.
- Public copy is owner-controlled. The hero, quote, projects and theme copy lives in the site-content record (seed defaults in `src/data/`); the other sections are hard-coded in `src/data/page-sections.data.ts` until the CMS phase.

## Evidence on Hand

The owner has all of the following, but **none of it is in the repo yet**:

- shipped projects
- written case studies
- testimonials and named clients
- blog posts

The Project section is built and editable, seeded with three placeholder cards. Services, About, Process and FAQ carry the owner's copy. Testimonials, the About story and photo, and the belief line show visible bracketed placeholders until the owner supplies real material; Blog is hidden until real posts exist.

Future work must get the real material from the owner. Never invent project names, client names, quotes, logos, metrics or outcomes to fill these sections.

**On its way (owner, 2026-09-29):**

- a tagline and a belief line in the owner's words
- the owner's story and a photo for About
- client quotes they have permission to use
- real projects, later

Until the projects arrive, the cards stay placeholders with neutral placeholder images.

## Product Principles

1. **Proof over claims.** Freelance clients hire on evidence. Shipped projects and case studies do the persuading, and the site's own engineering backs up the full-stack claim.
2. **Never fabricate.** Every project, client, testimonial and number comes from the owner's real material. Gaps stay visible until they are filled.
3. **One builder, whole stack.** Present the three services as one person owning a product end to end, not as a list of disconnected skills.
4. **Every path ends in a conversation.** Each section should move a qualified client toward the contact form.
5. **Owner-editable by default.** New public content should go through the site-content schema so the owner can change it without touching code.

## Accessibility & Inclusion

The target is **WCAG 2.2 AA** for the public site.

Already in place:

- real anchor navigation that works from the keyboard
- `prefers-reduced-motion` respected globally (`MotionConfig reducedMotion="user"`), with a separate check for the dot field
- an accessible text `<h1>` behind the WebGL canvas
- the canvas alone marked `aria-hidden`
