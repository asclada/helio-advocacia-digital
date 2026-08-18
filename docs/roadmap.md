# Roadmap — Hélio Advocacia Digital

> **Este é o roadmap master do projeto.** Documento único de referência para saber em que fase/checkpoint o projeto está, o que já foi entregue e o que falta. Atualizado ao final de cada checkpoint concluído.
>
> Não confundir com:
> - `docs/padrao-desenvolvimento.md` — como trabalhamos (Plan Mode + SDD + TDD, regras de processo, estilo de comunicação)
> - `PROJECT-GUIDE.md` — metodologia de aprendizagem e prompts de referência para conversar com o Claude Code
> - `docs/specs/*.md` — especificação técnica detalhada de cada componente/feature
> - `docs/handoffs/*.md` — registro de cada sessão individual de trabalho

## Visão geral do projeto

Reconstrução completa da presença digital do escritório Hélio Kleison Advocacia, em três frentes:

1. **Site institucional** — migração de HTML puro para Next.js + React + TypeScript, com redesign visual completo (design system próprio, navy/gold, tipografia editorial)
2. **CRM autenticado** — painel para o advogado e a secretária gerenciarem leads, com banco de dados próprio (Supabase)
3. **Widget de triagem por IA** — chat no site conectado ao agente de IA já existente no n8n, migrando a lógica atual (que roda via Evolution API/WhatsApp) para conexão direta n8n ↔ site, alimentando o CRM com os dados capturados

O projeto é simultaneamente entrega real para o cliente e laboratório de aprendizagem full-stack.

---

## Status geral

| Fase | Nome | Status |
|---|---|---|
| 0 | Auditoria | ✅ Concluída |
| 1 | Design System | ✅ Concluída |
| 2 | Componentes de UI Base | ✅ Concluída |
| 3 | Header, Nav e Footer | ⏳ Não iniciada |
| 4 | Montagem das páginas do site | ⏳ Não iniciada |
| 5 | Supabase — banco do CRM | ⏳ Não iniciada |
| 6 | CRM — painel autenticado | ⏳ Não iniciada |
| 7 | n8n — migração do agente de IA | ⏳ Não iniciada |
| 8 | Widget de chat no site | ⏳ Não iniciada |
| 9 | Integração ponta a ponta | ⏳ Não iniciada |
| 10 | Deploy de produção e QA final | ⏳ Não iniciada |

---

## Fase 0 — Auditoria ✅

**Objetivo:** entender o estado real do site atual antes de reconstruir.

**Entregue:**
- Confirmado: site atual é HTML estático + Tailwind via CDN, sem framework, hospedado na Vercel via repo `asclada/site-helio-kleison-adv`
- Ativos reaproveitáveis identificados: copy jurídico, paleta navy+gold, tipografia (Playfair Display / Inter / Cormorant Garamond), número de WhatsApp, estrutura de seções
- Toda infraestrutura de código marcada para descarte (rebuild do zero)

**Registro:** `docs/fase-0-auditoria.md` — commit `3601ef0`

---

## Fase 1 — Design System ✅

**Objetivo:** travar a linguagem visual (tokens, paleta, tipografia) antes de construir qualquer componente ou página.

**Entregue:**
- Stack de UI definida: shadcn/ui + Tailwind com tema 100% customizado (sem defaults)
- Paleta navy/gold traduzida em tokens reais no Tailwind config
- Tipografia definida: Playfair Display (headlines), Inter (corpo/UI), Cormorant Garamond itálico (subtítulos editoriais)
- Reserva de z-index e token de cor para o futuro widget de chat, já feita no tema (evita retrofit na Fase 8)
- Direção do Hero prototipada como referência visual (asimétrico, navy-950, foto do Dr. Hélio, CTA gold)

**Registro:** handoff da Fase 1 (ver `docs/handoffs/`)

---

## Fase 2 — Componentes de UI Base ✅

**Objetivo:** construir os componentes reutilizáveis que vão sustentar todas as páginas, seguindo Plan Mode + SDD + TDD (padrão fixado a partir desta fase — ver `docs/padrao-desenvolvimento.md`).

**Spec:** `docs/specs/fase2-componentes-ui-base.md`

**Checkpoints:**
- [x] **Setup de testes** — Vitest + Testing Library + jest-axe configurados e validados
- [x] **Container/Section** — wrapper estrutural (`size`: narrow/default/wide; `spacing`: compact/default/spacious). Testado, documentado, commitado.
- [x] **Button** — variantes primary/secondary/ghost, com refinamento de hover (borda intensifica para `gold` no `secondary`, `ghost` ganha borda sutil no hover, `hover:scale-105` compartilhado por todas as variantes). Testado (13 testes), documentado, commitado.
- [x] **Badge** — selos de credibilidade (ex: "OAB ativo", "+15 anos"), contorno dourado (`border-gold`/`bg-gold/5`/`text-gold-light`), sem variantes. Testado (8 testes), documentado, commitado.
- [x] **Card** — áreas de atuação, depoimentos, credenciais. Subcomponentes de composição (`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`), `bg-card`+`border-border`, `h-full`+`mt-auto` para alinhar rodapés entre cards de conteúdo desigual numa grid (ajuste pós-revisão visual). Testado (17 testes), documentado, commitado.
- [x] **Input + Label** — formulário de contato. Base UI Field (`Field`/`FieldLabel`/`FieldDescription`/`FieldError`, associação label↔input e `aria-invalid`/`aria-describedby` automáticos) + `Input`, mesma família de primitiva do `Button`. Dois achados reais de contraste corrigidos com script (não estimado): borda de repouso usa `border-muted-foreground` (não `border-input`, que falha os 3:1 exigidos por ser componente interativo — diferente do `Card`) e o texto de `FieldError` usa `text-foreground` (não `text-destructive`, que falha os 4.5:1 de texto AA). Testado (23 testes), documentado, commitado.

**Fora de escopo desta fase:** Header/Nav, Footer, widget de chat (mas tokens já reservados desde a Fase 1), integração do formulário com n8n, testes de regressão visual (Playwright).

**Critério de conclusão da fase:** os 5 componentes implementados, testados (jest-axe sem violações, snapshot por variante, contraste AA), documentados e commitados. ✅ Atingido — 77 testes passando no total, `jest-axe` sem violações em nenhum componente, `tsc`/`lint` limpos.

**Entregue:** os 5 componentes de UI base do site (`Container`/`Section`, `Button`, `Badge`, `Card`, `Input`+`Label`) prontos, testados e documentados, estabelecendo o padrão de processo (Plan Mode + SDD + TDD, `docs/padrao-desenvolvimento.md`) que passa a valer para o resto do projeto a partir daqui.

**Registro:** handoffs da Fase 2 em `docs/handoffs/` (`2026-08-17-fase2-setup-testes.md`, `2026-08-17-fase2-container-section.md`, `2026-08-17-fase2-button.md`, `2026-08-17-fase2-badge.md`, `2026-08-17-fase2-card.md`, `2026-08-17-fase2-input-label.md`)

---

## Fase 3 — Header, Nav e Footer ⏳

**Objetivo:** construir a navegação e o rodapé do site, usando os componentes da Fase 2 como base.

**Spec:** a escrever quando a Fase 2 concluir.

**Provável escopo:** Header com navegação responsiva (menu mobile), Footer com informações institucionais/contato, ambos usando tokens do design system.

---

## Fase 4 — Montagem das páginas do site ⏳

**Objetivo:** montar as páginas reais (Home, Sobre, Áreas de Atuação, Contato) usando os componentes prontos, com o conteúdo jurídico já existente (reaproveitado da Fase 0).

**Provável escopo:** Home primeiro (prioridade — é onde cai o tráfego), depois as demais. CTA continua apontando para WhatsApp até o widget da Fase 8 estar pronto. Deploy como preview na Vercel, não produção ainda.

---

## Fase 5 — Supabase — banco do CRM ⏳

**Objetivo:** criar o projeto Supabase do CRM (separado do que hoje serve o agente via Evolution API), com schema, Auth e RLS.

**Provável escopo (a confirmar em spec própria):**
- Schema inicial: `clients`, `leads`, `triagens`, `profiles`
- Supabase Auth para login do advogado e da secretária
- Row Level Security como fronteira de acesso
- `client_id` como preparação para multi-tenant desde o início

---

## Fase 6 — CRM — painel autenticado ⏳

**Objetivo:** construir o painel que o Dr. Hélio e a secretária vão usar: login, lista de leads, detalhe de triagem, gestão de status, permissões por papel (role).

**Provável escopo:** projeto Next.js separado do site institucional, publicado à parte na Vercel.

---

## Fase 7 — n8n — migração do agente de IA ⏳

**Objetivo:** migrar a lógica do agente, hoje conectado via Evolution API (WhatsApp), para receber e responder diretamente do site — o WhatsApp volta a ser atendimento manual.

**Provável escopo:** troca da entrada/saída do fluxo n8n (de Evolution API para Webhook HTTP recebendo do widget do site), mantendo a lógica de IA existente (Gemini), gravando os dados extraídos no Supabase do CRM (Fase 5).

---

## Fase 8 — Widget de chat no site ⏳

**Objetivo:** construir o widget de chat (estilo WhatsApp, pop-up no canto inferior) no site institucional, consumindo o fluxo do n8n já migrado na Fase 7.

**Provável escopo:** UI do widget (usando token de cor e z-index já reservados desde a Fase 1), gestão de `session_id` para manter conversas, estados de loading/erro, envio para o Webhook do n8n.

---

## Fase 9 — Integração ponta a ponta ⏳

**Objetivo:** validar o fluxo completo funcionando: usuário conversa no widget → n8n processa com IA → dados gravados no Supabase → advogado/secretária veem no CRM → notificação (e-mail) disparada.

---

## Fase 10 — Deploy de produção e QA final ⏳

**Objetivo:** checklist final antes de considerar o projeto pronto para uso real do cliente.

**Provável escopo:** QA de site (desktop/mobile/SEO/acessibilidade/performance), QA de widget (abre/envia/recebe/erro/sessão/encerramento), QA de CRM (login/logout/proteção de rota/permissões/responsividade), QA de backend (webhook/validação/IA/Supabase/e-mail/logs). Troca de domínio/DNS se aplicável.

---

## Como este documento é mantido

- Ao final de cada checkpoint (ex: um componente da Fase 2 fechado), o Claude Code atualiza a checkbox correspondente nesta lista e o status da fase, como parte do commit daquele checkpoint.
- Ao final de cada fase completa, o status na tabela geral muda para ✅, e um breve resumo "Entregue" é adicionado à seção da fase (como nas Fases 0 e 1 acima).
- Fases 3 em diante começam como esqueleto ("Provável escopo") e são detalhadas em spec própria (`docs/specs/faseN-*.md`) quando a fase anterior concluir e a conversa entre Lucas e o Claude Chat definir o escopo real — evita especular decisões antes da hora.
- Se novos checkpoints ou fases surgirem no meio do caminho (decisão tomada em conversa que não estava prevista aqui), este arquivo é atualizado para refletir isso, mantendo a numeração de fases já usada nas specs existentes.
