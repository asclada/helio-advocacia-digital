# Spec — Fase 2: Container / Section

Status: em planejamento
Depende de: `docs/specs/fase2-componentes-ui-base.md` (visão geral da Fase 2)
Referência de handoff: docs/handoffs/2026-08-17-fase2-setup-testes.md

## Objetivo

Fornecer o wrapper estrutural padrão usado por toda página do site (Home,
Sobre, Áreas de Atuação, Contato) para dar consistência de largura máxima,
padding horizontal responsivo e espaçamento vertical entre seções — sem
repetir essas classes manualmente em cada página.

Diferente de Button/Badge/Card, este componente não tem cor, variante de
tema ou interatividade — é puramente estrutural. Os critérios de aceite
genéricos da spec da Fase 2 (foco visível, contraste AA) não se aplicam
aqui pelos motivos explicados na seção correspondente abaixo.

## Composição

Dois componentes, compostos:

- **`Container`** — controla largura máxima e padding horizontal. Pode ser
  usado sozinho (ex: dentro de um `<header>` de navegação, fora do escopo
  desta fase, mas a API já suporta isso via prop `as`).
- **`Section`** — elemento semântico `<section>` que controla o espaçamento
  vertical entre blocos da página. Por padrão, envolve seus filhos em um
  `Container` (evita ter que aninhar os dois manualmente em toda página),
  mas isso pode ser desativado.

## Casos de uso reais no site

- Cada seção da Home (Hero, Áreas de Atuação, Credenciais, Contato) é um
  `<Section>` com conteúdo centralizado. O Hero usa `spacing="spacious"`
  para mais respiro vertical de impacto; as demais usam o `spacing`
  padrão.
- Uma seção de texto corrido (ex: bloco "Sobre" com biografia) usa
  `<Section><Container size="narrow">` para manter linhas de leitura mais
  curtas do que um grid de cards.
- Uma seção com grid largo de cards (Áreas de Atuação) usa o `size`
  padrão ou `"wide"`.
- Navegação por âncora (ex: link do menu para `#areas-atuacao`) depende de
  cada `Section` aceitar `id` e um nome acessível (`aria-label` ou
  `aria-labelledby` apontando pro heading da seção).

## API

### `Container`

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `as` | `"div" \| "header" \| "main" \| "footer"` | `"div"` | Elemento HTML renderizado |
| `size` | `"default" \| "narrow" \| "wide"` | `"default"` | Largura máxima: `narrow` (leitura de texto), `default` (grids padrão), `wide` (showcases largos) |
| `className` | `string` | — | Mesclado via `cn()`, nunca substitui as classes base |
| `children` | `ReactNode` | — | — |

Sempre aplica: `mx-auto w-full px-4 sm:px-6 lg:px-8` (padding horizontal
responsivo + centralização), independente do `size`.

### `Section`

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `as` | `"section" \| "div"` | `"section"` | Elemento HTML renderizado |
| `spacing` | `"compact" \| "default" \| "spacious"` | `"default"` | Padding vertical: `compact` para blocos menores/aninhados, `default` para seções de página completas, `spacious` para seções que precisam de mais respiro vertical (ex: Hero) |
| `container` | `boolean` | `true` | Se `true`, envolve `children` em um `<Container>` |
| `containerSize` | `"default" \| "narrow" \| "wide"` | `"default"` | Repassado ao `Container` interno quando `container` é `true` |
| `className` | `string` | — | Mesclado via `cn()`, aplicado no elemento `<section>`/`<div>` externo |
| `children` | `ReactNode` | — | — |

Repassa `id`, `aria-label`, `aria-labelledby` e demais props HTML padrão
(`React.ComponentProps<"section">`) para o elemento raiz — necessário para
âncoras de navegação e nome acessível da landmark.

## Critérios de aceite (testáveis)

- [ ] `Container` renderiza `children` e aplica `mx-auto w-full px-4 sm:px-6 lg:px-8` em todas as variantes de `size`
- [ ] `Container` aplica a classe de largura máxima correta para cada valor de `size` (`default`/`narrow`/`wide`), cada uma resultando em um valor diferente
- [ ] `Container` renderiza a tag correta conforme `as` (`div` por padrão)
- [ ] `Section` renderiza um elemento `<section>` por padrão (verificável via role `region` quando houver nome acessível, ou via tag)
- [ ] `Section` aplica o espaçamento vertical correto para `spacing="compact"`, `spacing="default"` e `spacing="spacious"`
- [ ] `Section` envolve `children` em `Container` por padrão; com `container={false}`, renderiza `children` direto, sem o wrapper
- [ ] `Section` repassa `id`, `aria-label`, `aria-labelledby` e `className` para o elemento raiz
- [ ] Nenhuma cor hardcoded fora do token system — o componente não define nenhuma classe de `bg-*`/`text-*` própria (cor é responsabilidade de quem consome)
- [ ] Passa em `jest-axe` sem violações, tanto para `Container` isolado quanto para `Section` com `aria-label` definido
- [ ] Snapshot test cobrindo cada combinação relevante de variante (`Container` × `size`; `Section` × `spacing`, `container`)

### Critérios genéricos não aplicáveis (com justificativa)

- **Foco visível (`:focus-visible`)** — não aplicável. `Container`/`Section`
  não são elementos interativos/focáveis; não recebem `tabIndex` nem
  disparam eventos de foco.
- **Contraste AA** — não aplicável no nível deste componente. Ele não
  define cor de texto ou fundo; contraste é responsabilidade do conteúdo
  passado como `children` por quem consome o componente, e será validado
  nos componentes que de fato definem cor (Button, Badge, Card) e,
  futuramente, nas páginas montadas via Playwright + axe (ver limitação já
  documentada no handoff de setup de testes).

## Decisões de design referenciadas (Fase 1)

- Nenhum token de cor é usado diretamente por este componente (ver acima).
- Fase 1 decidiu não criar uma escala de espaçamento customizada
  (`docs/design-tokens.md`, seção "Espaçamento") — os valores de padding
  vertical/horizontal deste componente usam a escala padrão do Tailwind
  (`px-4`, `py-16`, etc.), não uma escala nova.

## Fora de escopo / não fazer nesta spec

- Grid interno de colunas (ex: `grid-cols-3`) — cada seção define seu
  próprio layout de conteúdo; `Container`/`Section` só controlam largura
  máxima e espaçamento externo.
- Background alternado entre seções (ex: navy vs navy-surface) — não há
  caso de uso confirmado ainda para isso ser uma prop; se surgir, quem
  consome passa via `className` até virar um padrão repetido o bastante
  para justificar uma prop `background` própria.
