# Fase 4.2 — Áreas de Atuação (resumo na Home)

**Status:** em planejamento (Plan Mode pendente de aprovação)
**Depende de:** Fase 2 (`Card`, `Section`, `Container`), Fase 3 (`--header-height`, anchor `atuacao` já reservado em `NAV_ANCHOR_IDS`), Fase 4.1 (`Hero`, cujo CTA secundário já aponta para `#atuacao`)
**Fonte de conteúdo:** copy das 3 áreas de atuação do site atual (heliokleisonadvocacia.com.br), confirmada nesta sessão via fetch direto — nenhum artefato do projeto tinha o texto literal registrado.

---

## 1. Contexto e decisão de escopo

Decisão tomada em conversa antes desta spec: a ideia original registrada no
handoff da Fase 3 (carrossel horizontal com arraste) foi **substituída por
um grid estático de cards**. Motivo: dia de aceleração do ritmo do projeto
(Fase 4 completa + Supabase + CRM + n8n na mesma sessão de trabalho, se der
tempo — ver decisão registrada no prompt desta sessão). Um carrossel com
estado/interação exigiria TDD completo (ciclo red/green, categoria
obrigatória da seção 3 do `padrao-desenvolvimento.md`); um grid estático
sem lógica se qualifica pela mesma exceção que o Hero usou (ver seção 6).
A ideia de carrossel fica registrada como evolução visual possível para
depois do site estar no ar — não descartada em definitivo.

Esta seção é a versão **resumo** na Home. A versão completa (página
dedicada `/areas-de-atuacao`, com mais profundidade por área) é escopo da
Fase 4.5+, dentro da mesma sessão combinada.

---

## 2. Conteúdo (copy — extraído do site atual, não reescrito)

| Área | Texto |
|---|---|
| Art. 1º - Venda Casada de Seguro | "Contratação de seguro ou produto não solicitado imposta como condição para liberar o empréstimo. Atuação para anular a cobrança e recuperar valores pagos indevidamente." |
| Art. 2º - Empréstimo Fraudado | "Idade adulterada no contrato ou empréstimo lançado em nome de quem nunca o contratou. Defesa para contestar a dívida e reverter os descontos indevidos." |
| Art. 3º - Consignado a Menor de Idade (INSS) | "Crédito consignado liberado por representante legal sem autorização judicial. Atuação para bloquear descontos e reaver os valores cobrados irregularmente." |

Título de seção: **"Áreas de Atuação"** (mesmo rótulo já usado no
Header/Footer via `NAV_ANCHORS`, seção 1 do `nav-links.ts`).
Texto de apoio (confirmado via fetch direto do site atual, texto literal):
**"Direito Bancário e do Consumidor, com foco em:"** — introduz os 3 cards,
reforçando que a área de atuação do Dr. Hélio é uma só (Direito Bancário e
do Consumidor) e os cards são exemplos concretos dentro dela, não áreas
distintas entre si.

**Decidido nesta sessão:** manter o prefixo "Art. Nº" nos títulos dos
cards, exatamente como aparece no site atual — preservado como parte da
copy jurídica, não descartado como decoração de menu.

---

## 3. Estrutura visual e composição

- **Grid:** 3 colunas em desktop (`md:grid-cols-3`), 1 coluna em mobile —
  reaproveita o `Card` da Fase 2 exatamente como a spec do `Card` já previu
  esse caso de uso (`docs/specs/fase2-card.md`, seção "Casos de uso reais").
  `gap-6` entre cards (mesma escala usada no espaçamento interno do `Card`).
- **Cada card:** `CardHeader` com `CardTitle` (nome da área) + `CardContent`
  com o texto da área. Sem `CardFooter`/ação — a página dedicada por área
  ainda não existe nesta sub-fase (só nasce na 4.5+ desta mesma sessão), e
  um card inteiro não é clicável (fora de escopo do `Card`, já registrado
  na spec da Fase 2).
- **`id="atuacao"` no `Section`** (`scroll-mt-(--header-height)`, técnica já
  documentada na spec da Fase 3) — é o alvo real do CTA secundário do Hero
  (`href="#atuacao"`) e do link "Áreas de Atuação" do Header/Footer. Esta é
  a primeira seção do projeto onde esse anchor passa a apontar para algo de
  verdade (até aqui, `#atuacao` existia mas não tinha destino real na Home).
- **Título da seção (`<h2>`):** "Áreas de Atuação", `font-display`, mesma
  família do `<h1>` do Hero, seguindo o padrão editorial já estabelecido.
- **Espaçamento vertical:** `Section` com `spacing="default"` (não
  `"spacious"` como o Hero — esta não é a seção de abertura do funil).

---

## 4. Arquitetura de arquivos

- `src/components/sections/areas-atuacao.tsx` (novo) — Server Component,
  sem props, mesmo padrão do `Hero` (conteúdo estático, uso único na Home).
- `src/components/sections/areas-atuacao.test.tsx` (novo).
- `src/app/page.tsx` — passa a renderizar `<AreasAtuacao />` logo após o
  `<Hero />`.

---

## 5. Fora de escopo desta sub-fase

- Página dedicada `/areas-de-atuacao` (Fase 4.5+).
- Qualquer link individual por área (só existe quando a página dedicada
  existir).
- Ícone por área — nenhum ativo/ícone confirmado ainda; se surgir demanda
  visual na revisão, decidir então (mesmo raciocínio já usado para não
  incluir slot de ícone no `Card`/`Badge` nas fases anteriores).
- Carrossel/interação de arraste (decisão desta sessão, seção 1).

---

## 6. Ajuste pós-revisão visual (rodada 1)

Após a primeira implementação, o Lucas pediu 4 correções, comparando com
`heliokleisonadvocacia.com.br` (site atual) ao vivo. Valores exatos
extraídos via CSS computado do site atual (não estimados):

1. **Título "Áreas de Atuação" em maiúsculas** — mantém o tamanho atual
   (`text-3xl`, decisão do Lucas: "pode ficar com tamanho maior igual está
   agora"), só ganha `uppercase`. Diferente do site atual (lá esse texto é
   o "eyebrow" pequeno, `text-xs uppercase tracking-[0.3em]
   text-gold-light/70`) — aqui é uma adaptação, não cópia literal: o Lucas
   decidiu manter esse título grande como o h2 principal da seção, só
   maiúsculo.
2. **Texto de apoio ("Direito Bancário e do Consumidor, com foco em:")
   maior** — de sem tamanho definido (herdava `text-base`, 16px) para
   `text-lg` (18px). No site atual esse é o heading principal
   (`text-2xl sm:text-3xl`), mas aqui ele continua como subtítulo — só
   cresce um pouco, sem inverter a hierarquia com o h2.
3. **Prefixo "Art. Nº" menor, separado do título** — deixa de ser parte da
   string do `CardTitle` ("Art. 1º - Venda Casada de Seguro") e vira um
   elemento próprio acima do título, replicando o estilo do site atual:
   `font-display text-sm text-gold/60`, com uma barra vertical dourada à
   esquerda (gradiente `gold-light` → `gold-dark`, 2px, opacidade 60% —
   classe `.art-rule` do site atual, recriada aqui com utilitários
   `before:` do Tailwind em vez de uma classe CSS customizada nova).
4. **Hover do card (elevação + moldura dourada)** — replica a regra exata
   do site atual (`.card-hover:hover`, extraída via `getComputedStyle`/
   `cssRules`, não estimada): `transform: translateY(-6px)` +
   `border-color: var(--gold)` (`#b89452`, mesmo token já usado no projeto
   — não é uma cor nova), com transição
   `0.4s cubic-bezier(0.2, 0.8, 0.2, 1)`. Aplicado via `className` nas
   instâncias do `Card` dentro de `AreasAtuacao`, não no componente `Card`
   compartilhado (`ui/card.tsx`) — os outros casos de uso do `Card`
   (depoimentos, credenciais, Fase 2) não pediram esse comportamento, e
   nada garante que devam ter o mesmo hover só porque reaproveitam o
   mesmo componente base. Consistente com a memória do projeto sobre
   hover ("estados interativos devem intensificar presença, não
   desaparecer") — a elevação + borda dourada é exatamente esse padrão.
5. **Bloco de título centralizado** — o `<h2>` + `<p>` de apoio passam a
   ficar num wrapper `mx-auto max-w-2xl text-center`, igual ao site atual
   (`text-center mb-16 max-w-2xl mx-auto`), em vez de alinhados à esquerda
   como estavam.

**Não incluído nesta rodada (fora do que foi pedido):** ícones por área
(shield/prédio/mão com cifrão no site atual) — segue como decisão em
aberto já registrada na seção 5 ("Fora de escopo"), não foi pedido nesta
correção.

---

## 6.1 Ajuste pós-revisão visual (rodada 2) — hierarquia do cabeçalho e novo componente `SectionHeading`

O Lucas pediu mais 2 correções após ver a rodada 1 no ar:

1. **Inverter a hierarquia visual do cabeçalho:** "Áreas de Atuação"
   estava grande demais (era o `<h2>`) e "Direito Bancário e do
   Consumidor, com foco em:" pequeno demais (`text-lg`) — o Lucas queria
   o oposto: "essa parte é importante e precisa de um destaque maior que
   o áreas de atuação". Isso, na prática, faz este projeto adotar a
   **mesma hierarquia do site atual** (lá "Áreas de Atuação" já era o
   eyebrow pequeno, e "Direito Bancário..." já era o heading grande) —
   diferente da rodada 1, que tinha decidido deliberadamente inverter
   essa hierarquia. Trocamos de decisão porque, ao ver ao vivo, ficou
   claro que o texto mais específico (a área de expertise real) merece
   mais peso do que o rótulo genérico da seção.
2. **Extrair um componente `SectionHeading` reutilizável** — o Lucas
   confirmou que esse padrão (eyebrow pequeno + título grande,
   centralizados) vai se repetir nas Fases 4.3 (Sobre) e 4.4 (Contato),
   também inspiradas no site atual. Com 3 usos confirmados de antemão
   (não hipotéticos), extrair agora evita duplicar o mesmo bloco de JSX
   3 vezes — mesmo raciocínio já usado para justificar a extração do
   `Card` na Fase 2 (`docs/specs/fase2-card.md`: "três formas de conteúdo
   reais e diferentes confirmadas").

**`src/components/ui/section-heading.tsx`** (novo) — recebe `eyebrow` e
`title` como props, sem variantes/estado. Valores de estilo extraídos do
CSS computado do site atual (mesma fonte da rodada 1, não estimados):

| Elemento | Classes | Origem |
|---|---|---|
| Eyebrow (`<p>`) | `text-xs uppercase tracking-[0.3em] text-gold` | Site atual usa `text-gold-light/70`; o Lucas pediu explicitamente a cor `gold` (não `gold-light`) da nossa paleta, sem opacidade reduzida |
| Título (`<h2>`) | `font-display text-3xl font-medium text-foreground sm:text-4xl` | Maior que o eyebrow e maior que a versão da rodada 1 (`text-lg`) — cresce em 2 passos na escala tipográfica para garantir o destaque pedido |
| Wrapper | `mx-auto flex max-w-2xl flex-col items-center gap-3 text-center` | Mesmo container centralizado já usado na rodada 1 (`text-center mb-16 max-w-2xl mx-auto` no site atual) |

Vive em `components/ui/` (não `components/sections/`) porque, diferente do
`Hero`/`AreasAtuacao` (blocos de conteúdo específicos de uma página), o
`SectionHeading` não carrega copy própria — é um padrão estrutural/
tipográfico reutilizável entre seções, mesmo papel que `Section`/
`Container`/`Card` já cumprem.

**TDD:** tratado com a mesma exceção de conteúdo estático/composição
puro já documentada nas seções 6/7 desta spec — sem `useState`/lógica
condicional, só duas props de texto. Testado com render + `jest-axe`
(`section-heading.test.tsx`), não ciclo red/green completo.

`AreasAtuacao` passa a consumir `<SectionHeading eyebrow="Áreas de
Atuação" title="Direito Bancário e do Consumidor, com foco em:" />` no
lugar do bloco de `<h2>`/`<p>` inline da rodada 1.

---

## 6.2 Ajuste pós-revisão visual (rodada 2, item 2) — fronteira entre Hero e Áreas de Atuação

O Lucas notou que o retrato do Dr. Hélio (ancorado na borda inferior do
Hero desde a Fase 4.1) voltou a parecer "flutuando" depois que a Fase 4.2
foi implementada. **Diagnóstico:** `body` usa um único `bg-background`
(`navy`, `#020617`) sólido para a página inteira (`globals.css`, `@layer
base`) — nem `Hero` nem `AreasAtuacao` definem cor de fundo própria, então
as duas seções são visualmente idênticas, sem nenhuma fronteira. A técnica
de ancoragem por margem negativa (spec da Fase 4.1, seção 4) sempre
dependeu de existir uma fronteira perceptível para o retrato "encostar" —
sem ela, a margem negativa continua funcionando tecnicamente (o retrato
está de fato na borda), mas não há nada visível ali para o olho reconhecer
como uma borda.

**Opções apresentadas e decisão:** três opções foram avaliadas (linha
sutil no topo / mudança de tom de fundo / as duas combinadas). **Decidido:
linha sutil** (`border-t border-foreground/5` no `Section` de
`AreasAtuacao`) — replica exatamente a técnica que o site atual usa em
toda transição de seção (`border-t border-white/5`, confirmado via
inspeção do CSS computado), sem introduzir uma segunda cor de fundo no
projeto. Mantém a linguagem visual minimalista já estabelecida (memória do
projeto: preferência por ajustes sutis, um destaque de cada vez) e resolve
o problema na origem — uma fronteira real para a margem negativa do Hero
"encostar".

**Isso também define o padrão para as próximas fronteiras entre seções da
Home** (Áreas de Atuação → Sobre, Sobre → Contato, Fases 4.3/4.4): cada
seção nova, ao ser criada, ganha `border-t border-foreground/5` no
`Section`, não uma cor de fundo diferente.

## 7. Critérios de aceite (para orientar os testes)

- [ ] `AreasAtuacao` renderiza o título da seção ("Áreas de Atuação") como
      `<h2>` em maiúsculas (`uppercase`), seguido do texto de apoio
      ("Direito Bancário e do Consumidor, com foco em:") em `text-lg`;
      ambos dentro de um bloco centralizado (`text-center`)
- [ ] Renderiza exatamente 3 `Card`, um por área, cada um com o prefixo
      ("Art. Nº") como elemento próprio (não concatenado ao título) e o
      título/texto corretos (conteúdo da seção 2)
- [ ] Cada `Card` tem `hover:border-gold` e `hover:-translate-y-1.5` (a
      moldura dourada + elevação replicadas do site atual, seção 6)
- [ ] `Section` tem `id="atuacao"` (torna o anchor do Header/Footer/CTA do
      Hero funcional pela primeira vez)
- [ ] Grid é 1 coluna em mobile e 3 colunas em `md:` (verificável via classe
      `md:grid-cols-3`)
- [ ] Nenhuma violação `jest-axe`

**Nota sobre TDD nesta sub-fase:** com a decisão de grid estático (seção 1),
`AreasAtuacao` não introduz estado (`useState`/`useEffect`) nem lógica
condicional — só compõe `Section`, `Container`, `Card` (e subcomponentes),
todos já testados. Qualifica para a mesma exceção que o Hero usou
(`docs/specs/fase4-1-hero.md`, seção 8): teste de render/snapshot +
`jest-axe`, não o ciclo red/green completo. Isso **não é precedente
automático** para as próximas sub-fases (4.3/4.4) — cada uma precisa
reavaliar este critério contra o que realmente vai construir (ex: se
"Contato" ganhar um formulário real conectado a alguma lógica, ele volta
para a categoria obrigatória de TDD completo, mesmo raciocínio já registrado
para o carrossel descartado nesta seção).
