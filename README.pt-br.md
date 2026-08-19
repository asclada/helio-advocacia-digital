🇺🇸 [English](README.md) | 🇧🇷 Português

# Hélio Kleison Advocacia — Redesign do Site

Site institucional do escritório do advogado Hélio Kleison, reconstruído de uma página HTML estática para uma aplicação Next.js com design system real, testes automatizados e um processo de desenvolvimento documentado.

## O que é este projeto

Hoje o escritório qualifica leads manualmente pelo WhatsApp: toda mensagem recebida — independente da relevância — consome o tempo do advogado ou da secretária para ser lida, entendida e respondida antes que qualquer triagem de verdade aconteça. É esse o problema que este projeto existe para resolver.

A solução completa tem três partes:

1. **Este site** — uma presença pública redesenhada, mais rápida e mais profissional (este repositório).
2. **Um widget de qualificação de leads por IA** — um chat no site que conduz a triagem inicial automaticamente, construído sobre um workflow no n8n (fora deste repositório).
3. **Um CRM** — um produto separado, multi-tenant, onde o advogado e a secretária acompanham os leads qualificados e o histórico de conversas (fora deste repositório).

**Este repositório é só o site.** Ele não tem banco de dados nem dependência direta de nenhuma camada de persistência. Sua única lógica de servidor é uma única rota de proxy sem estado que encaminha mensagens de chat para um webhook externo do n8n — o workflow do n8n é dono da lógica de IA, e um repositório separado do CRM (Supabase/Postgres) é dono dos dados. Veja [Arquitetura](#arquitetura) abaixo.

## Stack técnica

Confirmado a partir do `package.json` e das configurações do projeto — nada listado aqui é planejado ou não utilizado.

- **Framework:** [Next.js](https://nextjs.org) 16.3.1 (App Router), React 19.2.8, TypeScript
- **Estilização:** Tailwind CSS v4 (tema definido em `src/app/globals.css` via `@theme`, não `tailwind.config.ts`)
- **Componentes:** convenções do [shadcn/ui](https://ui.shadcn.com) sobre primitivos do [`@base-ui/react`](https://base-ui.com), estilizados com `class-variance-authority` (variantes) e `clsx` + `tailwind-merge` (merge de classes)
- **Ícones:** `lucide-react`
- **Testes:** [Vitest](https://vitest.dev) + `@testing-library/react` + `@testing-library/user-event` (comportamento), `jest-axe` (acessibilidade) + `jsdom`
- **Lint:** ESLint 9 com `eslint-config-next`
- **Deploy alvo:** Vercel

## Arquitetura

```
Usuário
  │
  ▼
Site (Next.js, este repo)
  │
  │  POST /api/chat  — proxy sem estado, sem chamadas de LLM, sem persistência
  ▼
Workflow n8n (webhook, externo)
  │  dono da lógica de triagem por IA e das chamadas de LLM
  ▼
Banco de dados do CRM — Supabase/Postgres (repositório separado)
```

Este repositório nunca conversa com um banco de dados. O único código de backend aqui é `src/app/api/chat/route.ts`, que encaminha as mensagens do widget de chat para uma URL de webhook lida da variável de ambiente `N8N_WEBHOOK_URL` e retorna a resposta do n8n como veio. Se essa variável não estiver definida, a rota falha explicitamente em vez de falhar silenciosamente.

## Processo de desenvolvimento

Este projeto segue **Spec-Driven Development (SDD) + Test-Driven Development (TDD)**: todo componente de UI ou lógica de negócio começa com uma spec escrita em `docs/specs/`, passa por uma revisão em Plan Mode antes de qualquer código ser escrito, tem seus testes escritos primeiro (red), depois é implementado até passar (green), depois é revisado.

Detalhe completo do processo: [`docs/padrao-desenvolvimento.md`](docs/padrao-desenvolvimento.md).

## Estado atual

- **Fase 0 — Auditoria:** concluída. Confirmada a stack real do site atual no ar (HTML estático, Tailwind via CDN, Formspree no formulário de contato) e o que reaproveitar no redesign (copy, paleta navy/dourado, tipografia, número de WhatsApp) versus o que reconstruir do zero.
- **Fase 1 — Design System:** concluída. Stack decidida (Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui); tokens de design (paleta navy/dourado, tipografia Playfair Display / Inter / Cormorant Garamond) extraídos dos valores reais do site no ar e centralizados em `src/app/globals.css` (ver `docs/design-tokens.md`); rota de proxy sem estado `/api/chat` criada; confirmado e documentado que este repositório não tem dependência de Supabase/banco de dados.
- **Fase 2 — Componentes de UI base:** concluída. Os 5 componentes base construídos seguindo o processo Plan Mode + SDD + TDD fixado a partir desta fase (ver `docs/padrao-desenvolvimento.md`): wrapper de layout `Container`/`Section`, `Button` (variantes primary/secondary/ghost), `Badge` (selos de credibilidade), `Card` (subcomponentes de composição, altura alinhada em grids), `Input` + `Label` (pronto pro formulário de contato — construído sobre `@base-ui/react/field` para associação automática label↔input e fiação de acessibilidade de estado de validação). 77 testes passando, zero violações de `jest-axe`, `tsc`/`lint` limpos.
- **Fase 3 — Header, Nav e Footer:** concluída. Header sticky com nav por âncora via scroll-spy (`IntersectionObserver`) e drawer mobile sobre o `Dialog` do Base UI (focus trap, Esc, fechamento por overlay e devolução de foco resolvidos pela própria lib); CTA de WhatsApp reutilizável; Footer de 3 colunas (identidade/navegação/contato, cada item de contato com ícone) com o aviso legal da OAB (Provimento nº 205/2021) e a reserva de posição/z-index do futuro widget de chat (sem lógica ainda). 122 testes passando no total, zero violações de `jest-axe`, `tsc`/`lint` limpos.
- **Fase 4 — Montagem das páginas:** concluída. Conteúdo real da Home (Hero, Áreas de Atuação, Sobre, FAQ/Contato) mais 3 páginas dedicadas (`/areas-de-atuacao`, `/sobre`, `/contato`) com metadata de SEO própria, reaproveitando a mesma copy já aprovada — nenhum conteúdo jurídico novo foi inventado. A navegação do site (Header, Footer, drawer mobile, CTA do Hero) agora aponta pras rotas reais, não mais âncoras dentro da página. O formulário de contato tem validação real no cliente (restrições HTML nativas via `Field`/`Form` do Base UI), mas ainda sem envio de fato — isso é ligado na Fase 7, quando a integração com n8n existir. 200 testes passando no total, zero violações de `jest-axe` em todas as páginas, `tsc`/`lint` limpos.
- **Fases 5–10** (banco de dados do CRM, painel do CRM, migração do agente de IA para o site, o widget de chat em si, integração ponta a ponta, QA de produção): não iniciadas.

Detalhe completo, fase a fase: [`docs/roadmap.md`](docs/roadmap.md).

## Como rodar localmente

```bash
npm install
npm run dev      # inicia o servidor de desenvolvimento
npm run test     # roda a suíte de testes do Vitest
npm run lint     # roda o ESLint
```

Um arquivo `.env.example` lista as variáveis de ambiente que o projeto lê (atualmente só `N8N_WEBHOOK_URL`, usada pela rota de proxy do chat). Copie para `.env.local` e preencha com seus próprios valores — nenhum valor real está commitado neste repositório.

## Licença / autoria

Construído por Lucas Santana (Vibe Digital) — um projeto freelancer real para este cliente, e também um registro público de aprendizado de desenvolvimento full-stack. Não publicado sob licença open-source.
