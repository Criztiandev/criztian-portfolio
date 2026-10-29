# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** owners of US customer-facing small businesses: restaurants, cafés, wineries, inns, shops and salons, including ones that sell online. About 1–20 people, no in-house developer, the owner decides alone.

- How they arrive: mostly on a phone, from a cold email that contains a concept redesign of their own business (main channel). Upwork is the backup channel.
- Their job on this site: check "is this person real, good, and affordable?", then book a call.
- What they want: to come across as good as they really are, and to turn visitors into bookings, calls and visits.
- What they worry about: the designer disappears, surprise bills, a site they can't change, a designer who won't get their business.
- Their words: more customers, look legit, bookings, update it myself, "my web guy disappeared".
- The belief to change: "Custom, beautiful sites are for big brands; small places get a template."

**Second:** referrers (past clients, partners). **Third:** design peers and Awwwards fans (credibility). When wow fights clarity, the owner wins.

## Product Purpose

Criztian's own portfolio site, brand name **Criztian**. He is a solo designer-developer who designs, builds and launches custom websites for US small businesses.

- **Goal line:** get US owners of customer-facing small businesses to **book a discovery call**.
- **Success:** booked calls per month, counted in Cal.com. Target: 3 a month within 3 months of launch.
- **Launch target:** about Tue, Nov 17, 2026.

## Positioning

> Criztian is the only web studio that gives US small businesses big-brand design and real engineering, built in-house, and theirs to own.

- vs DIY builders (Squarespace, Wix, about $16–23/mo): a template look.
- vs restaurant platforms (Popmenu $179–499/mo, BentoBox): rented, monthly forever.
- vs US agencies ($5,000–15,000): he wins only on size and price, so the work (J&T, Roudon-Smith) has to carry the proof.

## Operating Context

- Home plus case-study pages (`/work/[slug]`), a blog (`/blog`), a 404 page and a Privacy page (with a cookies section).
- **Main action:** "Book a call" opens the Cal.com booking over the page: https://cal.com/criztian/discovery, a free 20-minute video call (Cal Video). There is no contact form.
- **Prices (from):** Starter $1,500 (up to 3 pages, 2 rounds) · Standard $2,500 (up to 5 pages, 3 rounds, editor) · Premium $4,000 (up to 7 pages, 4 rounds, editor, blog, brand refresh) · care plan $150/month, optional.
- **Backup actions:** see the work (J&T live link, Roudon-Smith screens), check prices, email hello@criztian.dev (after the domain is bought).
- The repo started as a copy of his website template. The CMS (dashboard, editor, Supabase) stays, so he can edit content himself and show owners the editor they would get.

## Capabilities and Constraints

- Page max 1440 px, centered. Background bands stay full-bleed. Breakpoints: phone 390 (works 360–767), tablet 768 (768–1279), desktop 1440 (1280 and up).
- Experience: scroll-driven on the hero and the Work section only (desktop; tablet and phone have no pin), light motion everywhere else, reduced motion respected.
- Speed beats motion: if motion slows the phone page, the motion goes.
- **The public site must keep working when the database is down.** Supabase free projects pause after 7 days with no activity.
- The Philippines is kept quiet on the site, and never faked (no US address, no pretending to be local).
- Never promise visibility, rankings or SEO results. Promise bookings, calls and visits (what the site controls).
- "See your redesign before you pay" is an outreach move only. It never appears on the site.
- Founding price: the first 3 clients get the Starter for $800, in return for a written review and a case study. Outreach only (cold email or the call), never on the site. It ends after client #3.
- No Web3, crypto or gambling anywhere.
- Still undecided (they stay as labeled placeholders): the analytics tool, the launch date.

## Brand Commitments

- Name: **Criztian**. Wordmark in Anton. Short mark "C." with a Signal Red period.
- ARE: Reliable · Warm · Skilled · Bold (Bold is the look only; the voice stays calm). NOT: Flashy · Cheap · Salesy. Archetype: Creator. Metaphor: Porsche 911.
- Voice: a calm pro on your side. Plain words, no hype, real numbers.
- Use: bookings, customers, your place, straight answers, yours to keep. Avoid: digital experiences, 10x, guaranteed, conversion, leads, crafting, elevate, seamless.
- Reply-time promise: 24 hours.
- Visual system: DESIGN.md and docs/brand.md, both taken from the Figma file, which is the single source of truth.

## Evidence on Hand

- **J&T Express** concept redesign, live: https://criztian-jnt-express-concept.vercel.app (screens in `public/images/work/jnt-*`).
- **Roudon-Smith Winery** concept redesign, Figma only, labeled "Design only" (screens in `public/images/work/roudon-smith-*`).
- 4+ years building for the web, including 2+ years of websites and apps for healthcare and finance teams.
- Photos: the hero portrait and the About photo are AI restyles of his real face (his decision). Both must pass a friends' "that's you" check before launch.
- **Absent, never fabricate:** testimonials, client logos, paid-client case studies, review counts, the "43 sites" day-job stat (NDA).

## Product Principles

1. The owner wins: when wow fights clarity, clarity wins.
2. Results over polish: a fast phone page beats heavy animation.
3. Honest by default: real numbers, labeled concepts, no surprise bills, no invented proof.
4. One action: every section leads to "Book a call".
5. Yours to keep: the files, hosting and domain are in the client's name.

## Accessibility & Inclusion

WCAG AA contrast (red text only at 24 px and up), keyboard works everywhere, visible focus (2 px Paper White ring, 2 px offset), one h1, reduced motion respected, tap targets at least 44 px.
