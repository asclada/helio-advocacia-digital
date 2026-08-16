## Context

See `proposal.md` — Why. This repo currently has no application code, only
docs, OpenSpec scaffolding, and a `temp-assets/` folder with one image
(`foto-helio-original.png`). The AI triage agent and the CRM are both
explicitly out of scope of this repo and this phase (see proposal —
Impact): the agent lives in n8n, the CRM is a separate multi-tenant
project. This design covers only the site's own foundation and design
tokens.

## Goals / Non-Goals

**Goals:**
- Lock the site's technical stack so Fase 2 (components) and later phases
  build on a stable foundation.
- Turn the Fase 0 visual identity (navy + gold, Playfair Display / Inter /
  Cormorant Garamond) into reusable, centrally-defined tokens.
- Define exactly one integration seam with the external AI agent (a proxy
  API route + one env var), so the boundary between "this repo" and
  "n8n/CRM" stays explicit and hard to blur later.

**Non-Goals:**
- Building any UI component (buttons, cards, WhatsApp CTA) — Fase 2.
- Building the chat widget's actual UI or the n8n workflow itself — later
  phases.
- Any CRM code, schema, or Supabase client — different repo entirely.

## Decisions

### Framework: Next.js (App Router)
Alternatives considered: Astro (better raw static-site performance for a
mostly-content site), plain Vite + React SPA.

Chosen Next.js because the site needs one thing Astro makes more friction
to add later: a server-side API route acting as a same-origin proxy to the
n8n webhook (avoids exposing the webhook URL to the browser and sidesteps
CORS). Astro supports server endpoints too, but Next.js's API routes map
directly to Vercel serverless functions with zero extra config, and the
current site already deploys on Vercel (see `docs/fase-0-auditoria.md`),
so there's no new deployment tooling to learn. A pure SPA was rejected
outright: marketing pages need to be crawlable without JS (see
`site-foundation` spec), which requires SSR/SSG.

### Styling: Tailwind CSS + shadcn/ui
Tailwind continues what the current site already used, but now through a
real build step (PostCSS + purge) instead of the CDN build the Fase 0
audit flagged for removal. shadcn/ui was chosen over a traditional
component library (e.g. MUI, Chakra) because its components are copied
into the repo as editable source rather than installed as an opaque
dependency — components can be freely customized to the navy/gold identity
and remain fully visible in the codebase.

### Language: TypeScript
Standard choice for a Next.js project; also directly relevant to
`ADS` coursework. Strict mode enforced at build time per the
`site-foundation` spec's type-checked build requirement.

### Design tokens as Tailwind theme config, not scattered CSS
Color, typography, and spacing tokens will live in one place —
`tailwind.config` theme extension (plus CSS custom properties if a token
needs to be read at runtime, e.g. for a chart or non-Tailwind context) —
rather than hardcoded per component. This is the direct implementation of
the `design-system` spec's centralization requirements. Concretely:
- **Color**: navy + gold mapped to named theme colors (e.g.
  `primary`/`accent`), not raw hex scattered across files.
- **Typography**: Playfair Display, Inter, Cormorant Garamond mapped to
  named `fontFamily` tokens with documented usage (headings vs. body vs.
  accent).
- **Spacing**: rely on Tailwind's default spacing scale unless a specific
  gap in it is identified — introducing a fully custom scale is deferred
  until a real layout need proves the default scale insufficient.

### No Supabase client in this repo
Already decided in conversation with the user (see proposal — Why /
Impact): the data flow is `site → n8n → CRM's Supabase`, so this repo has
no direct read/write path to Supabase. Revisit only if a future,
concretely identified need arises (e.g. the site needing to read CRM data
directly) — not preemptively.

## Risks / Trade-offs

- **[Risk]** Chat widget proxy has no code yet to validate the
  `N8N_WEBHOOK_URL` contract (request/response shape) → **Mitigation**:
  this phase only reserves the seam (env var + spec requirement); the
  actual proxy implementation and its contract are validated when the
  widget is built in a later phase, against the real n8n workflow.
- **[Risk]** Deferring a custom spacing scale could mean revisiting theme
  config later if Tailwind defaults don't fit the design → **Mitigation**:
  low cost to change, since spacing values are centralized in the same
  theme config touched for color/typography.

## Migration Plan

- No production system is affected: the current live site
  (`asclada/site-helio-kleison-adv`) keeps running unchanged until the
  redesign is ready to replace it.
- This phase scaffolds the Next.js app inside the current repo
  (`advogado-helio-website-redesign`), alongside the existing
  `docs/`, `openspec/`, and `temp-assets/` directories.
- Rollback, if needed, is simply not merging/deploying the new app —
  nothing external depends on it yet.
