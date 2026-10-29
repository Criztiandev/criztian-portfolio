@AGENTS.md

# Criztian portfolio

Criztian's own one-page portfolio. Read in this order: `PRODUCT.md` (who it's for, the goal), `DESIGN.md` and `docs/brand.md` (the visual system), `docs/website-plan.md` (every section with its real copy, motion notes, cut list), `docs/build-plan.md` (phases, Figma node IDs, realign list), `docs/handoff.md` (decisions, open questions, links, assets). The template's own docs (`docs/architecture.md`, `docs/cms-plan.md`, `docs/template-handoff.md`) still describe how the code and the CMS work.

## Design rules

- Every section: the outer element holds the full-width background; inside it, one container `mx-auto max-w-page px-4 md:px-8 xl:px-10`. Here `max-w-page` = **1920 px** (content max 1840 inside the 40 px gutters), set in the fourth pack (2026-10-29). Reading text (Body, Body/Large) is capped at 720 px (`max-w-[720px]` or a `max-w-prose`-style token); the big parts stretch.
- Breakpoints: base = phone, `md` = tablet (768), `xl` = desktop (1280), `2xl` = large (1536). Don't use `sm` or `lg`.
- Build each section mobile-first: Phone frame to base classes, Tablet to `md:`, Desktop to `xl:`, then Large at `2xl:` from the Large 1920 frames (the giant name and giant words scale with `clamp()`, see docs/brand.md).
- Every value comes from the spacing scale or a token. No arbitrary values like `rounded-[20px]` unless the reason is written in docs. The giant hero name uses the `clamp()` sizes in docs/brand.md.
- Content (text, prices, links, image paths) lives in `src/data/*.data.ts`, never inside components, so the CMS can save the same shape.
- Images: the files in `public/`; empty slots use `public/images/placeholder.svg`. No outside placeholder services.
- Headings use `text-wrap: balance`, so no last word sits alone on its line.

## Build rules

- Build from `docs/build-plan.md`: one phase per run, in order. Plan first, wait for OK, then build. Change only what the phase covers.
- Figma is the reference, the codebase is the rules: load the figma-design-to-code skill before `get_design_context`. Use the project's tokens and components, never raw hex or pixel values when a token exists.
- Honest content: the copy comes from `docs/website-plan.md`. Never invent testimonials, numbers, logos or reviews. Placeholders stay labeled.
- Check once, at the end of the phase: the check scripts, plus one browser run comparing only what this phase built with Figma at 390, 768, 1440 and 1920. Don't re-check what already passed.
- Accessibility floor: WCAG AA contrast, real buttons and links, keyboard works, visible focus, alt text, one h1 per page and an h2 per section, reduced motion respected.
- The public site must keep working when the database is down.
- impeccable is set to code-first (`.impeccable/config.json`): Figma is the comp; never generate a new visual direction.
- When a phase is done: tick it in `docs/build-plan.md`, report the files changed and the check results, suggest a commit message, and stop.

## Project structure

```
src/
  app/          routes only (page.tsx, layout.tsx, route.ts)
  components/   React components, kebab-case, no scope suffix; ui/ is shadcn output
  hooks/        client hooks (use-*.ts)
  data/         static content constants, no I/O
  config/       site constants and env readers
  model/        zod schemas shared by forms and tRPC input
  type/         every named TypeScript type, plus the generated database.type.ts
  util/         pure functions with no I/O that every layer and node:test can import
  error/        AppError and the Postgrest mapper
  repository/   the only code that queries tables; functions take the client as `db`
  service/      business logic, one function per use case
  router/       tRPC routers: validate with a model, call a service or repository
  lib/          adapters named after their tool: supabase/, trpc/, tiptap.ts,
                react-markdown.ts, utils.ts
  proxy.ts      Next proxy (session refresh), must live next to app/
public/
  brand/        logo SVGs (wordmark, mark, icon)
  images/       hero/, about/, work/ and placeholder.svg
```

File names are `name.scope.ts` with a singular scope (`contact.model.ts`, `contact-message.repository.ts`). Names a tool sets stay as they are. Named types live only in `src/type`. Full rules: `docs/architecture.md`.
