## 1. Project Scaffold

- [x] 1.1 Initialize Next.js app (App Router, TypeScript) inside this repo
- [x] 1.2 Configure Tailwind CSS with PostCSS build (replacing the old CDN
      approach)
- [x] 1.3 Initialize shadcn/ui in the project
- [x] 1.4 Verify strict TypeScript mode is enabled and the build fails on
      a deliberately introduced type error, then remove it

## 2. Design Tokens

- [x] 2.1 Define navy + gold color tokens in the Tailwind theme config
- [x] 2.2 Define typography tokens for Playfair Display, Inter, and
      Cormorant Garamond, with documented usage (headings/body/accent)
- [x] 2.3 Confirm Tailwind's default spacing scale is sufficient for the
      planned layout; document the decision (custom scale deferred per
      design.md)
- [x] 2.4 Write a short design-tokens reference (e.g.
      `docs/design-tokens.md`) documenting the color, typography, and
      spacing tokens for use in Fase 2

## 3. Site Foundation Seam

- [x] 3.1 Create the chat widget proxy API route (forwards to
      `N8N_WEBHOOK_URL`, no state, no direct LLM calls)
- [x] 3.2 Add `N8N_WEBHOOK_URL` to `.env.example` (not a real value) and
      document it in the project's own `CLAUDE.md` (done together with
      5.1, same edit)
- [x] 3.3 Handle the missing-env-var case with an explicit error response
- [x] 3.4 Confirm no Supabase (or other DB/CRM) client dependency exists
      in `package.json`

## 4. Verification

- [x] 4.1 Confirm a marketing page (e.g. a placeholder home page) renders
      full HTML content without JavaScript (view source / disable JS)
- [x] 4.2 Run `openspec validate establish-design-system-and-stack
      --strict` and fix any reported issues

## 5. Documentation

- [x] 5.1 Update this project's `CLAUDE.md` — Stack e Architecture
      section (currently "A definir") with the decisions from this change
- [x] 5.2 Record Technical Outcome + Learning Outcome for Fase 1 per
      `CLAUDE.md` — Estrutura de fases (both recorded in
      `docs/fase-1-design-system.md`)
