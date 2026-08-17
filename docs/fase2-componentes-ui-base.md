# Spec — Fase 2: Componentes de UI Base

Status: em planejamento
Depende de: Fase 1 (Design System) — concluída
Referência de handoff: docs/handoffs/[preencher quando existir]

## Objetivo

Construir o conjunto mínimo de componentes de UI reutilizáveis que servirão de
base para todas as páginas do site (Home, Sobre, Áreas de Atuação, Contato).
Cada componente deve usar exclusivamente os tokens do design system da Fase 1
(cores navy/gold, tipografia Playfair Display / Inter / Cormorant Garamond) —
nunca cores ou espaçamentos "soltos" fora do token system.

## Escopo desta fase (componentes)

1. **Button** — variantes: primary (gold), secondary (navy outline), ghost
2. **Card** — usado para áreas de atuação, depoimentos, credenciais
3. **Badge** — credenciais/selos (ex: "OAB ativo", "20 anos de experiência")
4. **Input + Label** — formulário de contato
5. **Container/Section wrapper** — grid responsivo padrão para todas as seções

Fora de escopo nesta fase (fica para Fase 3+): Header/Nav, Footer, o widget de
chat IA (mas o token de cor do chat bubble e z-index devem ser reservados nos
componentes desde já, conforme decisão já registrada no design system).

## Casos de uso reais no site

- Botão "Falar com advogado" (CTA principal, variant gold) no Hero
- Botão secundário "Ver áreas de atuação" (variant navy outline)
- Cards de áreas de atuação (Direito Civil, Trabalhista, etc.) em grid
- Badges de credibilidade no Hero (ex: "OAB/RN", "+15 anos")
- Formulário de contato com Input + Label validado

## Critérios de aceite (testáveis)

Para cada componente:
- [ ] Renderiza corretamente com props mínimas e com todas as variantes
- [ ] Usa apenas classes/tokens do tema custom (nenhuma cor hardcoded fora do
      Tailwind config gerado na Fase 1)
- [ ] Estado de foco visível via teclado (`:focus-visible`) em elementos
      interativos (Button, Input)
- [ ] Contraste mínimo AA entre texto e fundo em todas as variantes de cor
- [ ] Passa em `jest-axe` sem violações
- [ ] Snapshot test cobrindo cada variante

## Decisões de design referenciadas (Fase 1)

- Paleta: navy-950 (fundo), gold-600 (CTA/destaque) — ver `tailwind.config`
- Tipografia: Playfair Display (headlines), Inter (corpo/UI), Cormorant
  Garamond itálico (subtítulos editoriais)
- Reserva para chat widget: z-index e token de cor de bubble já definidos no
  tema — componentes desta fase não devem usar esses valores reservados

## Ordem de implementação sugerida

1. Container/Section (base estrutural, sem lógica — desbloqueia visualizar os demais)
2. Button (mais usado, maior superfície de teste: variantes + estados)
3. Badge (simples, reaproveita padrão de cor do Button)
4. Card (composição — pode usar Button dentro)
5. Input + Label (mais complexo: validação, estados de erro, acessibilidade de forms)

## Fora de escopo / não fazer nesta fase

- Não integrar o formulário de contato com o proxy n8n ainda (isso é lógica de
  submissão, entra em fase própria)
- Não construir o Header/Nav ainda
- Não fazer testes de regressão visual (Playwright) — cedo demais, poucos
  componentes ainda para justificar o overhead
