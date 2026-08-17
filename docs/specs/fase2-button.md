# Spec — Fase 2: Button

Status: em planejamento
Depende de: `docs/specs/fase2-componentes-ui-base.md` (visão geral da Fase 2)
Referência de handoff: docs/handoffs/2026-08-17-fase2-container-section.md

## Objetivo

Fornecer o componente de ação principal do site — usado em todo CTA (Call To
Action, "chamada para ação": o elemento que convida o visitante a agir, ex.
"Falar com advogado") e em ações secundárias/terciárias de menor destaque.
Diferente de `Container`/`Section`, este componente tem cor, estado
interativo (hover, foco, desabilitado) e é o principal ponto de conversão do
site — por isso os critérios genéricos de foco visível e contraste AA da
spec da Fase 2 se aplicam integralmente aqui.

## Base técnica

O esqueleto gerado pelo shadcn na Fase 1 (`src/components/ui/button.tsx`)
já usa `Button` do pacote `@base-ui/react/button` como primitivo, não a tag
`<button>` nativa diretamente. `@base-ui/react` é uma biblioteca de
componentes "headless" (sem estilo próprio, só comportamento/acessibilidade
— quem estiliza é o Tailwind por cima). Dois pontos relevantes que essa
base já resolve, e que portanto **não** precisam ser reimplementados aqui:

- Semântica e atributos ARIA de botão corretos por padrão.
- Suporte a um prop `render`, que permite trocar o elemento HTML renderizado
  (ex: `<a href="#areas-atuacao">` em vez de `<button>`) sem precisar de uma
  prop `as` própria — útil para o CTA secundário "Ver áreas de atuação", que
  navega para uma âncora em vez de disparar uma ação de formulário.

## Casos de uso reais no site

- CTA principal "Falar com advogado" no Hero — `variant="primary"`, maior
  destaque visual da página (única cor sólida totalmente preenchida do
  design system, reservada para a ação mais importante).
- CTA secundário "Ver áreas de atuação" no Hero — `variant="secondary"`,
  ao lado do primário, com destaque visual menor. Provavelmente renderizado
  via `render={<a href="#areas-atuacao" />}` para navegar por âncora até a
  seção correspondente (ver `fase2-componentes-ui-base.md`, caso de uso de
  navegação por âncora).
- `variant="ghost"`: exigido pelo escopo da Fase 2
  (`fase2-componentes-ui-base.md`), mas **sem caso de uso concreto
  confirmado ainda** na Home. Uso provável futuro: ação terciária de baixo
  destaque (ex: "Cancelar" em um diálogo, ou um link de ação dentro de um
  `Card`). Implementado agora para fechar o conjunto de variantes pedido
  pela spec geral, mas sem inventar um caso de uso que ainda não existe.

## API

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Estilo visual do botão |
| `className` | `string` | — | Mesclado via `cn()`, nunca substitui as classes base |
| `children` | `ReactNode` | — | Conteúdo do botão |
| ...demais props nativas de `<button>` | — | — | Repassadas pelo primitivo `@base-ui/react/button` (`disabled`, `type`, `onClick`, etc.) |
| `render` (herdado do Base UI) | `ReactElement \| ComponentRenderFn` | — | Troca o elemento renderizado (ex: `<a>`) sem precisar de uma prop `as` própria — ver "Base técnica" |

Não há prop `size` nesta versão — ver "Fora de escopo".

## Decisões de design (variantes de cor)

Todas usam exclusivamente tokens semânticos já definidos na Fase 1
(`docs/design-tokens.md`) — nenhuma cor nova é introduzida.

| Variant | Fundo | Texto | Borda | Hover |
|---|---|---|---|---|
| `primary` | `bg-primary` (gold) | `text-primary-foreground` (navy-deep) | nenhuma | `bg-gold-dark` |
| `secondary` | transparente | `text-secondary-foreground` (gold-light) | `border-border` (navy-line) | borda intensifica para `border-gold` + tingimento `bg-gold/5` |
| `ghost` | transparente | `text-secondary-foreground` (gold-light) | nenhuma (transparente) | ganha `border-gold/30` (sutil) + `bg-secondary/60` |

Todas as variantes também ganham `hover:scale-105` — ver "Refinamento de
hover" abaixo.

**Por que `secondary` é um "outline" e não um preenchimento sólido**, mesmo
o token semântico `secondary` do Fase 1 mapear para `navy-surface` (um
fundo sólido): a spec geral da Fase 2 pede explicitamente "secondary (navy
outline)" — um botão de contorno, não preenchido, para ficar visualmente
subordinado ao `primary` sólido ao lado dele no Hero. A solução usa os
*mesmos* tokens semânticos (`border-border`, `text-secondary-foreground`,
`bg-secondary` no hover) só que aplicados de um jeito diferente (borda em
vez de preenchimento em repouso) — continua sendo composição de tokens
existentes, não uma cor nova inventada fora do sistema.

**Por que `ghost` também usa `text-secondary-foreground` (gold-light) em
vez de `text-foreground` (branco)**: manter a identidade dourada em
qualquer botão com texto colorido — no site atual, `gold-light` já é o tom
mais usado para texto de destaque e links (`docs/design-tokens.md`). Um
`ghost` em branco puro romperia esse padrão sem motivo.

### Refinamento de hover (revisão pós-implementação)

Depois da primeira implementação, revisão do Lucas identificou que o hover
de `secondary` (borda sumindo) e a ausência total de qualquer sinal de
hover em `ghost` estavam fracos como feedback de interação. Ajustes,
decididos antes da reimplementação:

- **`secondary`**: em vez de a borda desaparecer no hover
  (`hover:border-transparent`, comportamento original), ela **intensifica**
  para `border-gold` — fica mais presente, não menos. Ganha também um leve
  tingimento de fundo (`bg-gold/5`, 5% de opacidade) em vez do preenchimento
  sólido original (`bg-secondary`), para não competir com o preenchimento
  100% sólido do `primary`.
- **`ghost`**: hoje não tem nenhuma borda em nenhum estado. Ganha uma borda
  sutil (`hover:border-gold/30`, 30% de opacidade — mais fraca que a do
  `secondary`, para preservar a hierarquia de destaque: `primary` > `secondary`
  > `ghost`) que só aparece no hover, mantendo o preenchimento leve que já
  existia (`bg-secondary/60`).
- **Escolha do tom `gold` (não `gold-light` nem `gold-dark`)**: o tema não
  tem uma escala numerada de dourado (`gold-600` etc.) — só os 3 tokens
  brutos já documentados em `docs/design-tokens.md`. `gold-light` já é a
  cor do texto dessas duas variantes (reutilizá-lo na borda reduziria a
  distinção entre "isto é texto" e "isto é borda"); `gold-dark` já é a cor
  de hover do `primary` (reutilizá-lo aqui misturaria a identidade visual
  dos dois estados de hover). `gold` (tom médio, `#b89452`) está livre para
  esse papel e ecoa a cor do CTA principal sem duplicar seu uso.
- **`hover:scale-105` em todas as variantes**: adicionado na string de
  classes *base* do `cva` (compartilhada por todas as variantes), não
  repetido em cada variante — reforça que é um comportamento do sistema de
  botões como um todo, não uma escolha por variante. Acompanhado de
  `duration-200` (200 milissegundos) para a transição ficar perceptível
  mas não lenta.

### Contraste (verificado, não estimado)

Contraste calculado via fórmula de luminância relativa do WCAG 2.1
(`docs/design-tokens.md` não tinha essa verificação registrada ainda —
fica documentada aqui pela primeira vez):

| Combinação | Contraste | Limite | Resultado |
|---|---|---|---|
| `gold` bg / `navy-deep` texto (`primary` em repouso) | ~7.3:1 | 4.5:1 (texto normal) | passa com folga |
| `gold-dark` bg / `navy-deep` texto (`primary` hover) | ~4.9:1 | 4.5:1 (texto normal) | passa |
| `gold-light` texto / `navy` fundo de página (`secondary`/`ghost` em repouso) | ~13.4:1 | 4.5:1 (texto normal) | passa com folga larga |
| `gold` borda / `navy` fundo de página (`secondary` hover) | ~7.1:1 | 3:1 (contorno de componente interativo, WCAG 1.4.11) | passa com folga |
| `gold-light` texto / `bg-gold/5` sobre `navy` (`secondary` hover) | ~13:1 (tingimento de 5% não move o fundo perceptivelmente) | 4.5:1 (texto normal) | passa com folga larga |

## Critérios de aceite (testáveis)

- [ ] Renderiza `children` corretamente
- [ ] Renderiza como elemento `<button>` por padrão (`getByRole("button")`)
- [ ] Cada `variant` (`primary`/`secondary`/`ghost`) aplica um conjunto de
      classes de cor distinto entre si (nenhum par de variantes produz a
      mesma classe de `bg-*`/`border-*`/`text-*`)
- [ ] Nenhuma cor hardcoded fora dos tokens semânticos (`bg-primary`,
      `border-border`, `text-secondary-foreground`, etc. — nunca hex, nunca
      classe de cor bruta do Tailwind como `bg-yellow-600`)
- [ ] Estado de foco visível via teclado (`:focus-visible`) presente em
      todas as variantes (classe base herdada do esqueleto shadcn:
      `focus-visible:border-ring focus-visible:ring-3 ring-ring/50`)
- [ ] Estado `disabled` aplica `disabled:opacity-50 disabled:pointer-events-none`
      e o elemento fica de fato não-interativo (`toBeDisabled()`)
- [ ] Suporta `render` (prop herdada do Base UI) para trocar o elemento
      renderizado — testável renderizando como `<a href="#test">` e
      confirmando `getByRole("link")`
- [ ] Repassa `className` extra via `cn()` sem remover as classes base
- [ ] Repassa demais props nativas (`onClick`, `type`, `aria-*`) para o
      elemento renderizado
- [ ] Passa em `jest-axe` sem violações, para cada variante
- [ ] Snapshot test cobrindo cada `variant`
- [ ] Todas as variantes aplicam `hover:scale-105` a partir da string de
      classes base compartilhada (não repetida por variante)
- [ ] `secondary` aplica `hover:border-gold` e `hover:bg-gold/5` (não
      mais `hover:border-transparent`/`hover:bg-secondary`)
- [ ] `ghost` aplica `hover:border-gold/30`, ausente no estado de repouso

## Fora de escopo / não fazer nesta spec

- **Prop `size`** — não há ainda dois CTAs no site que precisem de tamanhos
  visivelmente diferentes entre si (mesmo princípio já usado em
  `Container`/`Section`: não construir para uma necessidade hipotética). Se
  surgir um caso real, isso é uma extensão futura da spec.
- **Estado de loading** (spinner, `aria-busy`) — só entra quando a
  integração do formulário de contato com o proxy n8n for implementada
  (fase própria, fora do escopo de "componentes de UI base").
- **Slot de ícone** — nenhum caso de uso confirmado ainda usa ícone dentro
  de um botão.
