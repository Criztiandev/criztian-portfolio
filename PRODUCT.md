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

A personal portfolio that wins freelance work. It is one public scrolling page (home, project, about, services, blog, contact) that ends in a contact form, and behind it a private owner dashboard for editing that content. Success means qualified clients leave convinced and send a message through the contact form.

## Positioning

**Full-stack product builder.** Criztian ships complete products: frontend, backend, auth and data, not just the visible layer. The site is built the same way. It has a hand-built WebGL hero, a real auth and database layer, and a draft/publish content editor, so the portfolio is itself evidence of the claim.

Open decision: the seeded hero tagline ("Crafting timeless digital experiences through design, strategy, and code.") matches word for word the Framer template the hero was modelled on (adriavale.framer.website). It is placeholder text, not the owner's voice, and it also leans toward design and strategy rather than end-to-end product building. It is owner-editable content; replace it with the owner's own words.

## Operating Context

- Clients arrive on the public page, scroll through sections linked by anchors, and convert through the `#contact` form. That form is the only conversion path on the site.
- The owner edits content in a three-pane editor (section list, live iframe preview of the real page, config panel). Changes save to a draft and go live only on Publish.
- Everything runs locally today (Next.js dev server, Supabase in Docker). Nothing is deployed.

## Capabilities and Constraints

**Services offered to clients:**

- full product builds (idea to launch)
- web app and SaaS feature work inside existing products
- marketing sites and landing pages
- ongoing retainers for maintenance and iteration

**Public site:**

- Single page. The six anchors (`#home`, `#project`, `#about`, `#services`, `#blog`, `#contact`) are the navigation. `#contact` must keep working because the e2e suite depends on it.
- Hero: the name rendered as a dot-matrix WebGL wordmark whose dots scatter from a cursor or a finger and spring back. It falls back to a real text `<h1>` when WebGL2 is unavailable; with reduced motion the dots render still.
- Contact form anti-spam: a honeypot, a two-second minimum time-to-submit, and a limit of five submissions per hour per hashed IP. These are deliberate; do not weaken them.
- Contact notifications are written as local HTML previews. No email is actually sent yet.

**Owner side:**

- Single owner account and public signup is disabled.
- Editable today: the hero (name, rich-text tagline with bold and italic only, scroll label, works label, disciplines) and a curated set of six theme colours.
- Draft and published states only, with no version history.
- The content schema is built so that making another section editable is a data change, not a rewrite.

**Not built yet** (deferred on purpose, see README):

- hosted deployment
- live email
- reading contact messages in the dashboard
- a blog rendering pipeline

**Terminology:** _owner_, _draft_, _published_, _section_, _site content_.

## Brand Commitments

- The name **Criztian** is the hero wordmark and the site's identity.
- Public copy is owner-controlled. It lives in the site-content record, with the seed defaults in `src/data/`.

## Evidence on Hand

The owner has all of the following, but **none of it is in the repo yet**:

- shipped projects
- written case studies
- testimonials and named clients
- blog posts

The Project, About, Services and Blog sections are still placeholder text in `src/features/portfolio/components/site-page.component.tsx`.

Future work must get the real material from the owner. Never invent project names, client names, quotes, logos, metrics or outcomes to fill these sections.

## Product Principles

1. **Proof over claims.** Freelance clients hire on evidence. Shipped projects and case studies do the persuading, and the site's own engineering backs up the full-stack claim.
2. **Never fabricate.** Every project, client, testimonial and number comes from the owner's real material. Gaps stay visible until they are filled.
3. **One builder, whole stack.** Present the four services as one person owning a product end to end, not as a list of disconnected skills.
4. **Every path ends in a conversation.** Each section should move a qualified client toward the contact form.
5. **Owner-editable by default.** New public content should go through the site-content schema so the owner can change it without touching code.

## Accessibility & Inclusion

The target is **WCAG 2.2 AA** for the public site.

Already in place:

- real anchor navigation that works from the keyboard
- `prefers-reduced-motion` respected globally (`MotionConfig reducedMotion="user"`), with a separate check for the dot field
- an accessible text `<h1>` behind the WebGL canvas
- the canvas alone marked `aria-hidden`
