🇺🇸 English | 🇧🇷 [Português](README.pt-br.md)

# Hélio Kleison Advocacia — Website Redesign

Institutional website for Hélio Kleison's law office, rebuilt from a static HTML page into a Next.js application with a real design system, automated tests, and a documented development process.

## What this project is

The office currently qualifies leads manually over WhatsApp: every inquiry — regardless of how relevant it is — takes the lawyer's or the secretary's time to read, understand, and respond to before any real triage happens. That's the problem this project exists to solve.

The full solution has three parts:

1. **This website** — a redesigned, faster, more professional public site (this repository).
2. **An AI lead-qualification widget** — a chat widget on the site that handles initial triage automatically, built on an n8n workflow (not part of this repository).
3. **A CRM** — a separate, multi-tenant product where the lawyer and secretary review qualified leads and conversation history (not part of this repository).

**This repository is the website only.** It has no database and no direct dependency on any persistence layer. Its only server-side logic is a single stateless proxy route that forwards chat messages to an external n8n webhook — the n8n workflow owns the AI logic, and a separate CRM repository (Supabase/Postgres) owns the data. See [Architecture](#architecture) below.

## Tech stack

Confirmed from `package.json` and project config — nothing listed here is planned or unused.

- **Framework:** [Next.js](https://nextjs.org) 16.3.1 (App Router), React 19.2.8, TypeScript
- **Styling:** Tailwind CSS v4 (theme defined in `src/app/globals.css` via `@theme`, not `tailwind.config.ts`)
- **Components:** [shadcn/ui](https://ui.shadcn.com) conventions on top of [`@base-ui/react`](https://base-ui.com) primitives, styled with `class-variance-authority` (variants) and `clsx` + `tailwind-merge` (class merging)
- **Icons:** `lucide-react`
- **Testing:** [Vitest](https://vitest.dev) + `@testing-library/react` + `@testing-library/user-event` (behavior), `jest-axe` (accessibility) + `jsdom`
- **Linting:** ESLint 9 with `eslint-config-next`
- **Deploy target:** Vercel

## Architecture

```
User
  │
  ▼
Website (Next.js, this repo)
  │
  │  POST /api/chat  — stateless proxy, no LLM calls, no persistence
  ▼
n8n workflow (webhook, external)
  │  owns AI triage logic and LLM calls
  ▼
CRM database — Supabase/Postgres (separate repository)
```

This repository never talks to a database. The only backend code here is `src/app/api/chat/route.ts`, which forwards the chat widget's messages to a webhook URL read from the `N8N_WEBHOOK_URL` environment variable and returns the n8n response as-is. If that variable isn't set, the route fails explicitly instead of failing silently.

## Development process

This project follows **Spec-Driven Development (SDD) + Test-Driven Development (TDD)**: every UI component or piece of business logic starts with a written spec in `docs/specs/`, goes through a Plan Mode review before any code is written, gets its tests written first (red), then implemented until green, then reviewed.

Full process detail: [`docs/padrao-desenvolvimento.md`](docs/padrao-desenvolvimento.md).

## Current status

- **Phase 0 — Audit:** done. Confirmed the live site's actual stack (static HTML, Tailwind via CDN, Formspree for the contact form) and what to carry over into the redesign (copy, navy/gold palette, typography, WhatsApp number) versus rebuild from scratch.
- **Phase 1 — Design System:** done. Stack decided (Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui); design tokens (navy/gold palette, Playfair Display / Inter / Cormorant Garamond) extracted from the live site's actual values and centralized in `src/app/globals.css` (see `docs/design-tokens.md`); the stateless `/api/chat` proxy route created; confirmed and documented that this repo has no Supabase/database dependency.
- **Phase 2 — Base UI components:** done. All 5 base components built following the Plan Mode + SDD + TDD process fixed from this phase on (see `docs/padrao-desenvolvimento.md`): `Container`/`Section` layout wrapper, `Button` (primary/secondary/ghost), `Badge` (credibility badges), `Card` (composition subcomponents, height-aligned in grids), `Input` + `Label` (contact-form-ready — built on `@base-ui/react/field` for automatic label↔input association and validation-state accessibility wiring). 77 tests passing, zero `jest-axe` violations, `tsc`/`lint` clean.
- **Phase 3 — Header, Nav and Footer:** done. Sticky Header with scroll-spy anchor nav (`IntersectionObserver`) and a mobile drawer built on Base UI's `Dialog` (focus trap, Esc, overlay close and focus return handled by the library itself); a reusable WhatsApp CTA; a 3-column Footer (identity/navigation/contact, each contact item with an icon) with the OAB legal notice (Provimento nº 205/2021) and the reserved position/z-index for the future chat widget (no logic yet). 122 tests passing in total, zero `jest-axe` violations, `tsc`/`lint` clean.
- **Phase 4 — Page assembly:** done. Real Home content (Hero, Areas of Practice, About, FAQ/Contact) plus 3 dedicated pages (`/areas-de-atuacao`, `/sobre`, `/contato`) with their own SEO metadata, reusing the same approved copy — no new legal content invented. Site navigation (Header, Footer, mobile drawer, Hero CTA) now points at real routes instead of in-page anchors. The contact form has real client-side validation (native HTML constraints via Base UI's `Field`/`Form`) but no working submission yet — that's wired up in Phase 7 once the n8n integration exists. 200 tests passing in total, zero `jest-axe` violations across every page, `tsc`/`lint` clean.
- **Phase 5 — Supabase CRM database:** done, in a separate new repository ([`asclada/helio-advocacia-crm`](https://github.com/asclada/helio-advocacia-crm), private) — the CRM database and, from Phase 6 on, its authenticated panel live apart from this site repo. Schema: `leads` (one flat row per AI-triaged lead) and `profiles` (linked to Supabase Auth), no multi-tenant prep, Row Level Security verified for authenticated, anonymous, and service-role access.
- **Phase 6 — CRM authenticated panel:** done, in the CRM repo. Login for the office's 3 real users via Supabase Auth, a `/clientes` leads table (TanStack Table, sort/search) and a lead-detail side panel. Extended twice: lead archiving (6.1) and a `resumo` field with a full-triage side panel replacing the old detail page (6.2).
- **Phase 7 — AI agent migration:** done. The triage agent moved from WhatsApp/Evolution API to a synchronous HTTP webhook consumed by this site's `/api/chat` proxy, writing to the correct CRM Supabase project (`leads` + a new `triagens` table). Structured JSON output now populates every lead field, and conclusion is gated on having at least one contact method (phone or e-mail). The old inactivity follow-up ("Watchdog") was dropped with no replacement — no equivalent exists for a request/response HTTP model.
- **Phase 8 — Chat widget:** done. The floating chat widget (chip, notification bubble, panel) lives in this repo and talks to the already-migrated n8n webhook — real end-to-end conversations verified on desktop and on real mobile devices. Known limitation: conversation resumes with a name greeting and a continue-or-restart choice on reload, except in the narrow window between giving your name and confirming the LGPD notice, where the agent still re-asks for that confirmation instead — same category of accepted LLM non-determinism as the Watchdog gap above, documented in the n8n system prompt.
- **Phases 9–10** (end-to-end integration, production QA): not started.

Full phase-by-phase detail: [`docs/roadmap.md`](docs/roadmap.md).

## Running locally

```bash
npm install
npm run dev      # starts the dev server
npm run test     # runs the Vitest suite
npm run lint     # runs ESLint
```

An `.env.example` file lists the environment variables the project reads (currently just `N8N_WEBHOOK_URL`, used by the chat proxy route). Copy it to `.env.local` and fill in your own values — no real values are committed to this repository.

## License / authorship

Built by Lucas Santana (Vibe Digital) — a real freelance project for this client, and also a public learning log for full-stack development practice. Not published under an open-source license.
