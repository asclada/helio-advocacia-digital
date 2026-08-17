# Spec — Fase 2: Badge

Status: em planejamento
Depende de: `docs/specs/fase2-componentes-ui-base.md` (visão geral da Fase 2)
Referência de handoff: docs/handoffs/2026-08-17-fase2-button.md

## Objetivo

Fornecer o componente de selo de credibilidade usado no site — pequenas marcações
informativas que comunicam confiança (ex: "OAB/RN ativo", "+15 anos de
experiência"). Diferente do `Button`, o `Badge` **não é interativo**: não é
clicável, não recebe foco de teclado, não tem estado de hover — ele só exibe
uma informação curta. Por isso os critérios de foco visível/hover da spec
geral da Fase 2 não se aplicam aqui; contraste AA continua se aplicando
(é texto real, lido por qualquer visitante e por leitor de tela).

## Casos de uso reais no site

- Selos de credibilidade no Hero, ao lado ou abaixo do CTA principal: "OAB/RN
  ativo", "+15 anos de experiência" (`docs/specs/fase2-componentes-ui-base.md`).
- Nenhum outro caso de uso confirmado ainda (ex: badge dentro de `Card`) — se
  surgir na Fase 4 (montagem das páginas), a spec é revisada então.

## Decisão de design (cor)

Opções de tratamento visual foram avaliadas antes de travar a decisão (ver
sessão de trabalho). Escolhido: **contorno dourado**, reaproveitando a mesma
combinação de tokens que o `Button` já usa no hover do `secondary`
(`border-gold` + `bg-gold/5` + `text-gold-light`) — aqui aplicada como o
**estado de repouso único** do Badge, já que ele não tem hover.

| Elemento | Token | Valor |
|---|---|---|
| Borda | `border-gold` | `#b89452` |
| Fundo | `bg-gold/5` | `gold` a 5% de opacidade |
| Texto | `text-gold-light` | `#e4d1a3` |
| Forma | `rounded-full` | pílula |

**Por que essa combinação e não um contorno neutro (`border-border`) ou uma
pílula preenchida sólida (`bg-secondary`):** o Badge existe para comunicar um
sinal de confiança — ele precisa se destacar como "isto é uma credencial", não
se misturar ao restante do layout como um elemento estrutural neutro
(`border-border`/`navy-line`, usado em bordas/divisores comuns). Uma pílula
sólida (`bg-secondary`/`navy-surface`) competiria visualmente com o mesmo
token usado em cards elevados, criando ambiguidade de hierarquia. O contorno
dourado já é o vocabulário visual que o `Button` usa para "isto está
ativo/em destaque" (hover do `secondary`) — reaproveitá-lo aqui, como estado
fixo, mantém consistência entre os dois componentes sem inventar uma cor
nova, e cumpre literalmente o pedido da spec geral da Fase 2 de o Badge
"reaproveitar o padrão de cor do Button".

**Por que nenhuma prop `variant`:** só há um caso de uso confirmado ("selo de
credibilidade"), sempre com a mesma cor. Mesmo princípio já usado no `Button`
(não adicionar uma prop `size` sem caso de uso real): não construir uma
segunda variante de cor hipotética agora. Se um caso de uso real pedir uma
segunda cor no futuro, isso é uma extensão futura da spec.

**Por que sem `cva` (diferente do `Button`):** `cva` existe para orquestrar
múltiplas variantes. Com um único estilo fixo, uma string de classes simples
mesclada via `cn()` é suficiente e mais direta — introduzir `cva` aqui seria
abstração sem necessidade atual.

## API

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `children` | `ReactNode` | — | Conteúdo textual do badge |
| `className` | `string` | — | Mesclado via `cn()`, nunca substitui as classes base |
| ...demais props nativas de `<span>` | — | — | Repassadas diretamente (`aria-label`, `id`, etc.) |

Elemento renderizado: `<span data-slot="badge">` — não `<button>`, não
`role` interativo. Sem prop `render`/`as`: não há caso de uso confirmado de
trocar o elemento (diferente do `Button`, que precisa virar `<a>` para
navegação por âncora).

## Critérios de aceite (testáveis)

- [ ] Renderiza `children` corretamente
- [ ] Renderiza como `<span>` por padrão
- [ ] Aplica as classes de estilo fixas (`border-gold`, `bg-gold/5`,
      `text-gold-light`, `rounded-full`)
- [ ] Nenhuma cor hardcoded fora dos tokens semânticos/brutos já documentados
      em `docs/design-tokens.md`
- [ ] Não entra na ordem de tabulação por teclado (sem `tabIndex`, sem `role`
      interativo) — não é um elemento focável
- [ ] Repassa `className` extra via `cn()` sem remover as classes base
- [ ] Repassa demais props nativas (`aria-label`, `id`, etc.) para o elemento
      renderizado
- [ ] Contraste AA verificado entre `text-gold-light` e o fundo do badge
      (`bg-gold/5` sobre `navy`) — reaproveita o mesmo cálculo já feito na
      spec do Button para essa combinação de tokens (~13:1, WCAG 2.1)
- [ ] Passa em `jest-axe` sem violações
- [ ] Snapshot test

## Fora de escopo / não fazer nesta spec

- **Prop `variant`/cor alternativa** — nenhum segundo caso de uso confirmado
  ainda (ver "Decisão de design" acima).
- **Ícone dentro do badge** — nenhum asset ou caso de uso confirmado (mesmo
  raciocínio usado para não incluir slot de ícone no `Button`).
- **Interatividade** — o Badge não é clicável, não tem estado de hover/foco,
  e não tem affordance de remoção (sem "x" para dispensar). Se um caso de
  uso futuro pedir um badge removível/clicável, isso é um componente
  diferente ou uma extensão explícita desta spec, não o comportamento padrão.
