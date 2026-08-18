# Spec — Fase 2: Card

Status: em planejamento
Depende de: `docs/specs/fase2-componentes-ui-base.md` (visão geral da Fase 2)
Referência de handoff: docs/handoffs/2026-08-17-fase2-badge.md

## Objetivo

Fornecer o componente de agrupamento visual usado para exibir conteúdo
relacionado em blocos — áreas de atuação, depoimentos de clientes e
credenciais do escritório. Diferente do `Badge` (um selo curto, sem
estrutura interna) e do `Button` (uma única ação), o `Card` precisa
acomodar **três formas de conteúdo reais e diferentes entre si** (ícone +
título + descrição; citação + autor; título + texto de credencial) — por
isso, diferente dos dois componentes anteriores, ele é composto por
subcomponentes em vez de um único elemento fixo.

## Casos de uso reais no site

- **Áreas de atuação** (Home): grid de cards, cada um com título (ex.
  "Direito Civil"), descrição curta, e possivelmente uma ação secundária
  ("Saiba mais") usando `Button` `variant="ghost"` dentro do `CardFooter`.
- **Depoimentos**: cards com o texto do depoimento (`CardContent`) e o
  nome/informação do cliente (`CardHeader`/`CardTitle`).
- **Credenciais**: cards com título e descrição da credencial, mesma forma
  estrutural das áreas de atuação, sem ação.

Nenhum desses três ainda está montado numa página real (isso é Fase 4) —
os três casos vêm da spec geral da Fase 2
(`docs/specs/fase2-componentes-ui-base.md`), não de layout já existente.

## Decisões de design

### Tratamento visual (opções apresentadas e decididas em sessão)

Três opções foram avaliadas: só borda (sem preenchimento), só preenchimento
(sem borda), e preenchimento + borda. **Decidido: preenchimento + borda
sutil.**

| Elemento | Token | Valor |
|---|---|---|
| Fundo | `bg-card` | `navy-surface` (`#0b1220`) |
| Texto | `text-card-foreground` | `#f3f4f6` |
| Borda | `border-border` | `navy-line` (`#1e293b`) |
| Forma | `rounded-lg` | mesmo raio do `Button` (`--radius`, `0.625rem`) |

**Por quê:** `navy` (fundo da página, `#020617`) e `navy-surface` (fundo do
card, `#0b1220`) são muito próximos em luminância — preenchimento sozinho
arriscava o card "sumir" visualmente, principalmente em telas com brilho
baixo. A borda (`border-border`, o mesmo token neutro que o `Badge` já
rejeitou para si por ser "confundível com estrutura comum" — exatamente o
papel que o `Card` precisa aqui, já que ele *é* estrutura, não um selo de
confiança) garante que o limite do card fique legível independente do
contraste de fundo. Todos os tokens já existiam desde a Fase 1
(`docs/design-tokens.md`, seção "Tokens semânticos do shadcn/ui") — nenhuma
cor nova é introduzida.

### Estrutura da API (opções apresentadas e decididas em sessão)

Duas opções foram avaliadas: um único componente flexível (como o `Badge`)
ou subcomponentes de composição no padrão shadcn. **Decidido: subcomponentes
de composição** — `Card`, `CardHeader`, `CardTitle`, `CardDescription`,
`CardContent`, `CardFooter`.

**Por quê, diferente do `Badge`:** o `Badge` tinha uma única forma de
conteúdo confirmada (texto curto), então uma prop `variant` ou subestrutura
seriam abstração sem uso real. O `Card` já tem **três** formas de conteúdo
reais e diferentes confirmadas na spec geral da Fase 2 (área de
atuação/depoimento/credencial) — sem subcomponentes, cada lugar que usa o
`Card` reinventaria seu próprio espaçamento interno (gap entre título e
descrição, padding do rodapé), arriscando inconsistência entre os três
casos. O `CardFooter` também dá um lugar fixo e testável para compor um
`Button` dentro, conforme pedido pela spec geral ("pode usar Button
dentro").

**`CardTitle` aceita prop `as` (`"h2" | "h3" | "h4"`), default `"h3"`** —
mesmo padrão já usado no `Container` (prop `as` para trocar o elemento
renderizado sem inventar uma prop nova). Default `h3` porque o caso mais
concreto (grid de áreas de atuação) fica dentro de uma seção com `h2`
próprio; a prop existe para não travar a hierarquia de heading quando um
caso futuro (ex: depoimento, onde o "título" é o nome do cliente, não
necessariamente um heading semântico de peso) precisar de outro nível.

**Título usa `text-card-foreground` (quase branco), não `gold`/`gold-light`**
— `gold`/`gold-light` já são o vocabulário visual reservado para CTA e selo
de confiança (`Button` primary, `Badge`). Usar a mesma cor no título de todo
card diluiria esse significado (deixaria de sinalizar "isto é uma ação ou
credencial" para virar só "cor de título qualquer"). Título de card usa a
mesma cor de texto padrão do conteúdo (`text-card-foreground`), com
diferenciação vindo da tipografia (`font-display`, Playfair Display — a
mesma fonte de heading do resto do site) e peso (`font-semibold`), não de
cor. Esta é uma decisão revisável na etapa de revisão visual (passo 6 do
padrão de processo), não travada de forma irreversível.

### Espaçamento interno

`Card` usa `flex flex-col gap-6 py-6`, com cada subcomponente (`CardHeader`,
`CardContent`, `CardFooter`) aplicando `px-6` — o espaçamento vertical entre
seções vem do `gap-6` do pai, não de margin em cada filho. Escala padrão do
Tailwind (`docs/design-tokens.md` — "Espaçamento": nenhuma escala
customizada foi criada na Fase 1, decisão que segue valendo aqui).

### Altura consistente em grid (ajuste pós-revisão visual)

Revisão visual com os dois casos de uso reais lado a lado (área de atuação
com parágrafo extra vs. credenciais com badges) mostrou que, sem regra de
altura, cada `Card` ocupava só a altura do próprio conteúdo — o `CardFooter`
(com o `Button`) "caía" em alturas diferentes entre os cards, quebrando o
alinhamento visual em uma grid. Ajuste:

- **`Card`** ganha `h-full` (além do `flex flex-col` já existente) — ocupa
  toda a altura disponível na célula do grid pai. Depende de o grid/flex
  consumidor usar `items-stretch` (comportamento **padrão** do CSS Grid e do
  Flexbox — não precisa ser declarado explicitamente por quem usa o `Card`).
- **`CardFooter`** ganha `mt-auto` — empurra o rodapé para a base do card,
  absorvendo a sobra vertical gerada pelo `h-full`, independente de quanto
  conteúdo `CardHeader`/`CardContent` tiverem.

**Por que isso é comportamento padrão do `Card`, não responsabilidade de
quem consome:** os três casos de uso reais confirmados (área de atuação,
depoimento, credencial) sempre aparecem agrupados em grid/lista — nenhum
caso real usa o `Card` isolado, fora de um conjunto onde o alinhamento
importa. Resolver isso uma vez no componente evita que cada tela que monta
uma grid de cards precise reimplementar a mesma regra de `h-full`/`mt-auto`
por conta própria.

## API

| Componente | Elemento | Props próprias | Descrição |
|---|---|---|---|
| `Card` | `<div>` | — | Container raiz. `data-slot="card"`. |
| `CardHeader` | `<div>` | — | Agrupa título + descrição. `data-slot="card-header"`. |
| `CardTitle` | `<h3>` (default) | `as?: "h2" \| "h3" \| "h4"` | Título do card. `data-slot="card-title"`. |
| `CardDescription` | `<p>` | — | Texto de apoio, cor `text-muted-foreground`. `data-slot="card-description"`. |
| `CardContent` | `<div>` | — | Corpo principal do card (texto, citação, etc). `data-slot="card-content"`. |
| `CardFooter` | `<div>` | — | Rodapé, tipicamente com `Button`. `data-slot="card-footer"`. |

Todos os componentes: aceitam `className` (mesclado via `cn()`, nunca
substitui as classes base) e repassam demais props nativas do elemento HTML
correspondente (`id`, `aria-*`, etc.). Nenhum tem prop `variant` — mesmo
raciocínio já usado no `Badge` (sem segunda forma de cor confirmada).

## Contraste (verificado, não estimado)

Mesma fórmula de luminância relativa do WCAG 2.1 já usada na spec do
`Button`:

| Combinação | Contraste | Limite | Resultado |
|---|---|---|---|
| `text-card-foreground` (`#f3f4f6`) / `bg-card` (`#0b1220`) | ~17:1 | 4.5:1 (texto normal) | passa com folga larga |
| `text-muted-foreground` (`#9ca3af`) / `bg-card` (`#0b1220`) — usado em `CardDescription` | ~7.4:1 | 4.5:1 (texto normal) | passa com folga |
| `border-border` (`#1e293b`) / `bg-card` (`#0b1220`) | ~1.3:1 | não aplicável (WCAG 1.4.11 cobre limites de componentes interativos; o `Card` não é interativo, e seu limite não é a única forma de identificar o agrupamento — o conteúdo agrupado já cumpre esse papel) | intencionalmente sutil, não uma falha de acessibilidade |

## Critérios de aceite (testáveis)

- [ ] `Card` renderiza `children` e como `<div data-slot="card">` por padrão
- [ ] `Card` aplica as classes fixas de estilo (`bg-card`, `border-border`,
      `rounded-lg`)
- [ ] `Card` aplica `h-full flex flex-col` (ocupa a altura total da célula
      do grid pai) e `CardFooter` aplica `mt-auto` (fica sempre na base do
      card) — garante rodapés alinhados entre cards de altura de conteúdo
      diferente numa mesma grid
- [ ] `CardHeader`, `CardContent`, `CardFooter` renderizam `children` como
      `<div>` com o `data-slot` correspondente
- [ ] `CardTitle` renderiza como `<h3>` por padrão; com `as="h2"` renderiza
      como `<h2>` (testável via `container.querySelector`)
- [ ] `CardDescription` renderiza como `<p>` com `text-muted-foreground`
- [ ] Composição completa renderiza corretamente aninhada: `Card` >
      `CardHeader` (com `CardTitle` + `CardDescription`) + `CardContent` +
      `CardFooter` (com um `Button` dentro) — teste de integração
- [ ] Nenhuma cor hardcoded fora dos tokens semânticos já documentados em
      `docs/design-tokens.md`
- [ ] Cada subcomponente mescla `className` extra via `cn()` sem remover as
      classes base
- [ ] Cada subcomponente repassa props nativas (`aria-label`, `id`, etc.)
- [ ] `jest-axe` sem violações na composição completa (incluindo o `Button`
      no `CardFooter`)
- [ ] Snapshot test da composição completa

## Fora de escopo / não fazer nesta spec

- **`CardAction`** (slot de ação isolado no canto do header, padrão mais
  recente do shadcn) — nenhum caso de uso confirmado que precise de uma
  ação separada do `CardFooter`; se surgir, é extensão futura.
- **Variante de card clicável/link inteiro** — os três casos de uso
  confirmados têm no máximo um `Button` dentro do `CardFooter`; nenhum
  precisa do card inteiro ser uma área clicável.
- **Imagem/thumbnail dentro do card** — nenhum asset ou caso de uso
  confirmado ainda (mesmo raciocínio já usado para não incluir slot de
  ícone no `Button`/`Badge`).
- **Grid/layout de múltiplos cards** — isso é responsabilidade de quem usa
  o `Card` (provavelmente via `Container`), não do componente em si.
