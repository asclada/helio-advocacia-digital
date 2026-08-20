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
| 3 | Header, Nav e Footer | ✅ Concluída |
| 4 | Montagem das páginas do site | ✅ Concluída |
| 5 | Supabase — banco do CRM | ✅ Concluída |
| 6 | CRM — painel autenticado | ✅ Concluída |
| 7 | n8n — migração do agente de IA | ✅ Concluída |
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
- Token de cor para o futuro widget de chat (`--color-whatsapp`) já reservado no tema — a reserva de *z-index* (`--z-chat-widget`) só foi criada de fato na Fase 3, junto do Header/Footer que precisavam definir a ordem de camadas (correção factual registrada ao fechar a Fase 3)
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

## Fase 3 — Header, Nav e Footer ✅

**Objetivo:** construir a navegação e o rodapé do site, usando os componentes da Fase 2 como base.

**Spec:** `docs/specs/fase3-header-nav-footer.md`

**Checkpoints:**
- [x] **Header + Nav** — sticky, transição transparente→sólido (`bg-navy`+sombra) após 64px de scroll; nav com link ativo via scroll-spy (`IntersectionObserver`, hook `useActiveSection`); CTA "Fale Conosco" (`WhatsAppCta`, reutilizável, mensagem única do site); drawer mobile sobre `Dialog` do Base UI (focus trap, Esc, overlay e devolução de foco resolvidos pela própria lib). Testado (32 testes entre hooks, `WhatsAppCta`, `Header` e `NavDrawer`), documentado, commitado.
- [x] **Footer** — colunas de Identidade/Navegação/Contato (reaproveita os mesmos anchors do Header), ícone em cada contato (WhatsApp/Instagram/Facebook como SVG inline, e-mail/cidade/OAB via `lucide-react`), copyright e aviso legal da OAB (Provimento nº 205/2021), reserva de espaço/z-index do futuro widget de chat (sem lógica). `href`s de Instagram/Facebook/e-mail confirmados via fetch direto no site atual em produção. Testado (13 testes), documentado, commitado.

**Fora de escopo desta fase:** lógica funcional do widget de chat (só reserva de espaço/z-index), multi-idioma, qualquer seção de conteúdo nova (Áreas de Atuação/Sobre/FAQ/Contato são Fase 4) — por isso os anchors do nav (`#atuacao`, `#sobre`, `#faq`, `#contato`) ainda não têm `<section>` real pra apontar; a confirmação ponta a ponta do scroll/link ativo acontece só quando a Fase 4 criar essas seções (usando `scroll-mt-(--header-height)`, documentado na spec).

**Critério de conclusão da fase:** Header e Footer implementados, testados (`jest-axe` sem violações, comportamento de scroll/drawer/scroll-spy cobertos com mocks), documentados e commitados, com revisão visual aprovada. ✅ Atingido — 122 testes passando no total, `tsc`/`lint` limpos.

**Entregue:** Header sticky com nav por âncora e drawer mobile, e Footer de 3 colunas com reserva do widget de chat — navegação e rodapé completos do site, prontos para as páginas reais da Fase 4.

**Registro:** handoffs da Fase 3 em `docs/handoffs/`

---

## Fase 4 — Montagem das páginas do site ✅

**Objetivo:** montar as páginas reais (Home, Sobre, Áreas de Atuação, Contato) usando os componentes prontos, com o conteúdo jurídico já existente (reaproveitado da Fase 0).

**Decisão de arquitetura (fechada na sessão da Fase 4.1, confirmada na 4.5):** o site deixa de ser single-page com âncoras (padrão da Fase 3) e passa a ser **Home enxuta + páginas dedicadas** (`/`, `/sobre`, `/areas-de-atuacao`, `/contato`), usando rotas nativas do App Router — melhor indexação no Google para buscas locais do que uma âncora só. A Home contém versões resumidas de cada seção, cada uma linkando para sua página dedicada. Toda a navegação (Header, Footer, drawer mobile, CTA do Hero) usa as rotas reais, não mais âncoras.

**Checkpoints:**
- [x] **Fase 4.1 — Hero da Home** — headline em frase única (Playfair Display, tipografia uniforme, destaque dourado só em "patrimônio"), retrato do Dr. Hélio com fundo removido e ancorado na borda inferior do Hero, CTA duplo (WhatsApp + rota `/areas-de-atuacao`), selo de confiança. Spec: `docs/specs/fase4-1-hero.md` (4 rodadas de ajuste pós-revisão visual documentadas).
- [x] **Fase 4.2 — Áreas de Atuação** (resumo na Home) — grid estático de 3 cards (decisão: substitui o carrossel cogitado na Fase 3), hover com elevação + moldura dourada, componente `SectionHeading` criado (reaproveitado pelas sub-fases seguintes). Spec: `docs/specs/fase4-2-areas-atuacao.md`.
- [x] **Fase 4.3 — Sobre** (resumo na Home) — retrato circular (mesma foto original do Hero, sem tratamento novo), 2 parágrafos + 3 selos de credencial. Spec: `docs/specs/fase4-3-sobre.md`.
- [x] **Fase 4.4 — Dúvidas Frequentes + Contato** (resumo na Home) — accordion de FAQ (`@base-ui/react/accordion`) e formulário de contato completo com validação nativa (`Field`/`Form` do Base UI), sem envio real ainda (aguarda integração n8n da Fase 7). Primeiros Client Components do projeto — TDD completo (ciclo red/green real). Spec: `docs/specs/fase4-4-faq-contato.md`.
- [x] **Fase 4.5 — Páginas dedicadas** (`/areas-de-atuacao`, `/sobre`, `/contato`) — reaproveitam o conteúdo já aprovado da Home (sem copy jurídica nova), cada uma com `<title>`/`description` própria. Nav reduzido de 4 para 3 itens ("Dúvidas" e "Contato" unificados em "FAQ/Contato", já que levavam pro mesmo lugar — libera um slot pro nav para um assunto futuro, ex: blog). Spec: `docs/specs/fase4-5-paginas-dedicadas.md`.

**Entregue:** site institucional completo — Home (Hero + Áreas de Atuação + Sobre + FAQ/Contato) e as 3 páginas dedicadas, com SEO próprio por página, navegação 100% funcional entre elas, e formulário de contato com validação real (envio pendente da Fase 7). 200 testes passando no total, `jest-axe` sem violações em nenhuma página, `tsc`/`lint` limpos.

CTA continua apontando para WhatsApp até o widget da Fase 8 estar pronto. Deploy como preview na Vercel, não produção ainda.

**Registro:** handoffs e specs da Fase 4 em `docs/handoffs/` e `docs/specs/fase4-*.md`.

---

## Fase 5 — Supabase — banco do CRM ✅

**Objetivo:** criar o projeto Supabase do CRM (separado do que hoje serve o agente via Evolution API), com schema, Auth e RLS.

**Repositório novo:** a partir desta fase, o CRM (banco + futuro painel da Fase 6) vive em um repositório separado do site institucional — [`asclada/helio-advocacia-crm`](https://github.com/asclada/helio-advocacia-crm), privado. Este roadmap master continua neste repo (site) como referência única das 3 camadas do projeto; specs, migrations e handoffs da Fase 5 em diante vivem no repo novo.

**Escopo real (spec em `helio-advocacia-crm/docs/specs/fase5-supabase-schema.md`, decisão fechada em conversa em 2026-08-19, revisando o esqueleto provável que estava aqui antes):**
- Duas tabelas, não quatro: `leads` (registro único e "achatado" da triagem completa — sem tabela separada de `triagens`) e `profiles` (ligada a `auth.users`, com `role` já preparado mas sem uso em RLS ainda). Sem tabela `clients`.
- **Sem `client_id`/preparação multi-tenant** — o CRM atende só o escritório do Dr. Hélio, um único tenant.
- RLS: os 3 acessos (Dr. Hélio, secretária, Lucas) com o mesmo nível de permissão — CRUD completo em `leads`, sem diferenciar por `role` nesta fase.
- n8n escreve em `leads` via **service role key** (contorna RLS), não como usuário autenticado — decisão documentada para a Fase 7 não precisar redecidir.
- Migrations via **Supabase CLI**, versionadas em `supabase/migrations/` no repo novo (não pelo dashboard do Supabase).

**Entregue:** projeto Supabase "Helio Advocacia CRM" (região `sa-east-1`) criado; migration única com as tabelas `leads`/`profiles`, `check constraints` e as 3 policies de RLS aplicada via `supabase db push`; todos os critérios de aceite verificados manualmente (CRUD de usuário autenticado, bloqueio total de usuário anônimo, bypass da `service_role` key, `check constraints`, restrição de `profiles` à própria linha); 3 usuários reais criados no Supabase Auth com `profiles` correspondentes (Dr. Hélio/advogado, Mary/secretaria, Lucas/admin). Ambiente sem Docker — CLI instalado como dev dependency via npm, trabalho direto contra o projeto na nuvem.

**Registro:** spec e handoff no repo novo — `helio-advocacia-crm/docs/specs/fase5-supabase-schema.md` e `helio-advocacia-crm/docs/handoffs/2026-08-19-fase5-schema-supabase.md`.

---

## Fase 6 — CRM — painel autenticado ✅

**Objetivo:** construir o painel que o Dr. Hélio e a secretária vão usar para ver os leads já triados pelo agente de IA.

**Escopo real (spec em `helio-advocacia-crm/docs/specs/fase6-painel-autenticado.md`, revisado em conversa em 2026-08-19, mais enxuto que o esqueleto provável que estava aqui antes):** login com os 3 usuários já existentes no Supabase Auth, sidebar com um único item ("Clientes"), página `/clientes` (tabela dos leads `status = 'concluido'`, ordenação e busca por nome) e `/clientes/[id]` (detalhe read-only, todos os campos, "Não informado" nos nulos). **Gestão de status/arquivamento de lead e permissões por `role` ficaram deliberadamente fora do escopo** — não são pendência da Fase 6, viram uma fase nova (número a definir), com spec própria a ser escrita quando chegar a vez.

**Entregue:** projeto Next.js 16 (React 19, Tailwind v4, shadcn/ui sobre Radix UI — divergência intencional do site institucional, que usa Base UI) no repositório `helio-advocacia-crm`; autenticação via `@supabase/ssr` com proteção de rota em duas camadas (`proxy.ts` — renomeação de `middleware.ts` a partir do Next.js 16 — mais recheck de sessão no Server Component do layout protegido, defense-in-depth); tabela de leads com TanStack Table (ordenação por `concluida_em` decrescente, busca por nome); página de detalhe com todos os campos do schema. Construído com TDD (teste antes da implementação) em toda a lógica de negócio, com `jest-axe` nos componentes interativos — 29 testes passando, `tsc`/`lint`/`build` limpos. Verificado manualmente com os 3 usuários reais do escritório (login, bloqueio de acesso sem sessão, erro genérico em credencial inválida, navegação lista → detalhe, 404 em id inexistente, logout invalidando a sessão de fato).

**Registro:** spec e handoff no repo do CRM — `helio-advocacia-crm/docs/specs/fase6-painel-autenticado.md` e `helio-advocacia-crm/docs/handoffs/2026-08-19-fase6-painel-autenticado.md`.

### Fase 6.1 — Arquivamento de leads ✅

Extensão direta do painel da Fase 6 (não é a Fase 7 abaixo, que continua sendo a migração do agente n8n): primeira mutação de dado do painel — botão "Arquivar cliente" no detalhe do lead, com modal de confirmação, nova rota `/clientes/arquivados` e item correspondente na sidebar. Achado relevante: nenhuma migration de schema foi necessária — o valor `'arquivado'` em `leads.status` e a permissão de `UPDATE` para usuários autenticados já existiam desde a migration da Fase 5, então todo o trabalho ficou restrito a código de aplicação. Testes automatizados restritos ao essencial (fluxo de arquivar e filtro parametrizado da tabela), decisão explícita do Lucas para agilizar uma fase pequena. Verificado manualmente pelo Lucas com um lead de teste inserido via SQL direto no Supabase (não existe, e não deveria existir, forma de criar lead pela UI — só o n8n grava leads reais).

**Registro:** spec no repo do CRM — `helio-advocacia-crm/docs/specs/fase6.1-arquivamento-leads.md`.

### Fase 6.2 — Campo Resumo + modal de triagem completa ✅

Segunda extensão direta do painel da Fase 6, motivada por dois pedidos
do Lucas que surgiram ao verificar manualmente a 6.1: um campo novo
`leads.resumo` (síntese da triagem, preenchido pelo agente de IA só a
partir da Fase 7 — aqui a coluna nasce vazia) com fallback "Cliente não
detalhou o problema" quando vazio, e a troca da navegação de
`/clientes/[id]` (página cheia) por um painel lateral (`Sheet`) com
estado local, aberto ao clicar numa linha em `/clientes` ou
`/clientes/arquivados`, sem mudar a URL — a rota `/clientes/[id]` foi
removida. O botão "Arquivar cliente" (Fase 6.1) migrou para dentro
desse painel e passou a só aparecer quando o lead ainda não está
arquivado (achado da fase: sem essa regra, o botão apareceria também
sobre leads já arquivados, sem ação válida). TDD completo (diferente da
6.1) — 41 testes passando, `jest-axe` no painel, `tsc`/`lint`/`build`
limpos. Verificado manualmente pelo Lucas com leads de teste inseridos
via SQL, incluindo um com `resumo` preenchido e outro sem.

**Registro:** spec no repo do CRM — `helio-advocacia-crm/docs/specs/fase6.2-resumo-e-modal-triagem.md`.

---

## Fase 7 — n8n — migração do agente de IA ✅

**Objetivo:** migrar a lógica do agente, hoje conectado via Evolution API (WhatsApp), para receber e responder diretamente do site — o WhatsApp volta a ser atendimento manual.

**Escopo real (spec em `helio-advocacia-crm/docs/specs/fase7-n8n-migracao-agente.md`, revisado e ampliado em conversa ao longo da sessão):** troca da entrada/saída do fluxo n8n (Evolution API → webhook HTTP síncrono consumido pelo `route.ts` do site), nova tabela `triagens` enxuta no Supabase do CRM (credencial Postgres trocada da instância pausada `agente-adv-helio` para o projeto correto), remoção de ~35 nós específicos de WhatsApp/grupo/Watchdog/áudio, e dois pedidos de escopo que entraram no meio da sessão (não previstos na proposta original): (1) saída estruturada em JSON (`DADOS_ESTRUTURADOS`) pro Gemini popular os 8 campos de `leads` que ficariam vazios, e (2) regra de encerramento condicionado a contato — a triagem só conclui com telefone ou e-mail confirmado, dado o lançamento do dia seguinte exigir leads acionáveis desde o primeiro dia.

**Dois bugs reais encontrados e corrigidos durante os testes** (não só cosméticos — ver handoff pra detalhe técnico completo): parâmetros posicionais do Postgres desalinhados quando um valor de texto livre continha vírgula (ex: "Salvador, BA"), corrigido trocando string concatenada por array de parâmetros; e emissão prematura do marcador técnico de conclusão pelo Gemini antes do contato ser de fato coletado, mitigada (não eliminada — é não-determinismo do LLM) com um guard estrutural no Postgres que impede a triagem de ser marcada concluída sem `whatsapp`/`email` presente.

**Entregue:** workflow em produção, ativo, testado ponta a ponta com 6 cenários (completa, retomada, fora de escopo, contato fornecido tardiamente, recusa total, só e-mail) e uma verificação end-to-end real via `route.ts` do site (não só direto contra o n8n). `N8N_WEBHOOK_URL` configurado no site. Watchdog de inatividade abandonado nesta fase, sem substituto — vira pendência futura (ver seção "Pendências" abaixo).

**Registro:** spec e handoff no repo do CRM — `helio-advocacia-crm/docs/specs/fase7-n8n-migracao-agente.md` e `helio-advocacia-crm/docs/handoffs/2026-08-20-fase7-n8n-migracao-agente.md`.

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

## Pendências conhecidas

- **Watchdog de inatividade** — o agente original (WhatsApp) tinha um mecanismo de acompanhamento que cutucava o cliente depois de 10 minutos sem resposta durante a triagem. Abandonado deliberadamente na Fase 7 (decisão registrada na spec `fase7-n8n-migracao-agente.md`, seção 2): não existe equivalente direto num modelo de request/response HTTP como o webhook do widget, e reconstruir isso exigiria outro mecanismo (polling, SSE) fora do escopo daquela fase. Sem data prevista para retomar — revisar quando/se o abandono de conversas no widget (Fase 8+) se mostrar um problema real de negócio.

---

## Como este documento é mantido

- Ao final de cada checkpoint (ex: um componente da Fase 2 fechado), o Claude Code atualiza a checkbox correspondente nesta lista e o status da fase, como parte do commit daquele checkpoint.
- Ao final de cada fase completa, o status na tabela geral muda para ✅, e um breve resumo "Entregue" é adicionado à seção da fase (como nas Fases 0 e 1 acima).
- Fases 3 em diante começam como esqueleto ("Provável escopo") e são detalhadas em spec própria (`docs/specs/faseN-*.md`) quando a fase anterior concluir e a conversa entre Lucas e o Claude Chat definir o escopo real — evita especular decisões antes da hora.
- Se novos checkpoints ou fases surgirem no meio do caminho (decisão tomada em conversa que não estava prevista aqui), este arquivo é atualizado para refletir isso, mantendo a numeração de fases já usada nas specs existentes.
