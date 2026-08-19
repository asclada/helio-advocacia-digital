# Fase 4.5 — Páginas dedicadas (`/areas-de-atuacao`, `/sobre`, `/contato`)

**Status:** Implementado, testado e verificado no browser (navegação,
âncoras `/contato#faq`/`/contato#contato`, `<title>` por página). Pendente
de revisão visual do Lucas — fecha a Fase 4 inteira.
**Depende de:** todas as sub-fases anteriores da Fase 4 (`Hero`,
`AreasAtuacao`, `Sobre`, `FaqContato`/`Faq`/`ContatoForm`), Fase 3
(`Header`, `Footer`, `NavDrawer`, `nav-links.ts`)
**Decisões confirmadas com o Lucas:** conteúdo reaproveitado das seções
já aprovadas da Home (sem copy jurídica nova); todos os links de
navegação (Header, Footer, CTA secundário do Hero) migram de âncora
(`#atuacao` etc.) para rota própria.

---

## 1. Contexto

Última sub-fase da Fase 4 — fecha a arquitetura "Home enxuta + páginas
dedicadas" decidida desde a Fase 4.1. O site atual é single-page, então
não existe conteúdo adicional pronto para essas 3 páginas: o ganho real
aqui é indexação/SEO (cada página com sua própria `<title>`/`description`,
URL própria, `<h1>` próprio), não profundidade de conteúdo nova.

**Duas mudanças de arquitetura junto com as páginas em si:**

1. **Navegação deixa de ser 100% âncora.** `NAV_ANCHORS` (`nav-links.ts`)
   ganha um campo `href` próprio, separado do `id` (que continua existindo
   só para o scroll-spy da Home via `useActiveSection`). Header, Footer,
   `NavDrawer` e o CTA secundário do Hero passam a usar `anchor.href` em
   vez de `` `#${anchor.id}` ``.
2. **Divisão "conteúdo reutilizável" vs. "wrapper específico da Home"**
   em `AreasAtuacao` e `Sobre` — mesmo padrão que `FaqContato` já usa
   desde a Fase 4.4 (lá, `Faq`/`ContatoForm` já são componentes puros,
   sem `id`/`border-t` embutidos; só o wrapper `FaqContato` carrega isso).
   Agora `AreasAtuacao`/`Sobre` recebem o mesmo tratamento, para servir
   tanto a Home quanto a página dedicada sem duplicar a copy jurídica
   (evita risco real de o conteúdo divergir entre os dois lugares).

---

## 2. `nav-links.ts` — `href` por anchor

```ts
export interface NavAnchor {
  id: string
  href: string
  headerLabel: string
  footerLabel: string
}

export const NAV_ANCHORS: NavAnchor[] = [
  { id: "atuacao", href: "/areas-de-atuacao", headerLabel: "Áreas de Atuação", footerLabel: "Áreas de Atuação" },
  { id: "sobre", href: "/sobre", headerLabel: "Sobre mim", footerLabel: "Sobre o Advogado" },
  { id: "faq", href: "/contato#faq", headerLabel: "Dúvidas", footerLabel: "Dúvidas Frequentes" },
  { id: "contato", href: "/contato#contato", headerLabel: "Contato", footerLabel: "Contato" },
]
```

**Sem página dedicada de FAQ isolada** (o roadmap só previa `/sobre`,
`/areas-de-atuacao`, `/contato`) — "Dúvidas" aponta para
`/contato#faq`, a mesma página, âncora para a coluna do FAQ (que ganha
`id="faq"` na página dedicada, igual à Home). "Contato" aponta para
`/contato#contato`, direto pro formulário — preserva o comportamento já
aprovado na Home (o clique pula o FAQ e vai direto pro formulário).

`NAV_ANCHOR_IDS` (usado pelo scroll-spy da Home) não muda.

---

## 3. `AreasAtuacao`/`Sobre` — separar conteúdo do wrapper da Home

Cada arquivo passa a exportar dois componentes (mesmo módulo, sem
arquivo novo):

- **`AreasAtuacaoContent`** / **`SobreContent`** — só o conteúdo (título +
  grid / foto + texto + credenciais), com um prop novo
  `headingLevel?: "h1" | "h2"` (default `"h2"`), repassado pro
  `SectionHeading`. Sem `id`, sem `border-t`, sem `Section` — quem chama
  decide o wrapper.
- **`AreasAtuacao`** / **`Sobre`** — o wrapper de sempre (`Section` com
  `id`/`scroll-mt`/`border-t`), agora só renderiza o `*Content`
  correspondente com `headingLevel="h2"` (comportamento idêntico ao
  atual — nenhuma mudança visual na Home).

`SectionHeading` ganha o prop `as?: "h1" | "h2"` (default `"h2"`) — mesmo
padrão já usado no `CardTitle` (`as?: "h2" | "h3" | "h4"`, Fase 2) para
trocar o elemento renderizado sem inventar uma prop nova.

`Faq` e `ContatoForm` **não precisam de mudança** — já são componentes
puros desde que foram criados na Fase 4.4 (o `id`/`border-t` mora só no
`FaqContato`, o wrapper da Home).

---

## 4. As 3 páginas

Todas seguem o mesmo esqueleto: `<main className="flex flex-1 flex-col pt-(--header-height)">`
(mesmo padrão do `src/app/page.tsx`) envolvendo uma `Section
spacing="spacious"` com o conteúdo promovido a `<h1>`.

### `src/app/areas-de-atuacao/page.tsx`

```tsx
export const metadata: Metadata = {
  title: "Áreas de Atuação",
  description:
    "Direito Bancário e do Consumidor: venda casada de seguro, empréstimo fraudado e consignado a menor de idade sem autorização judicial.",
}
```

`<Section id="atuacao" spacing="spacious"><AreasAtuacaoContent headingLevel="h1" /></Section>`
— `id="atuacao"` mantido (sem função de scroll-mt aqui, já que não há
nada acima pra pular; serve só pro `useActiveSection` do Header
continuar destacando "Áreas de Atuação" como item ativo do nav enquanto
o visitante está nesta página).

### `src/app/sobre/page.tsx`

```tsx
export const metadata: Metadata = {
  title: "Sobre o Advogado",
  description:
    "Dr. Helio Kleison, OAB/RN 20.357 — advocacia especializada em Direito Bancário, atendimento presencial em Natal/RN e online para todo o Brasil.",
}
```

`<Section id="sobre" spacing="spacious"><SobreContent headingLevel="h1" /></Section>`

### `src/app/contato/page.tsx`

```tsx
export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o escritório Hélio Kleison Advocacia — WhatsApp, e-mail ou formulário de contato.",
}
```

Reaproveita `Faq` e `ContatoForm` diretamente (já são componentes puros),
com o mesmo grid de 2 colunas já usado no `FaqContato` da Home, mas com
o "Contato" promovido a `<h1>` (é o assunto principal da URL) e o "Dúvidas
Frequentes" continuando `<h2>` (conteúdo de apoio na mesma página):

```tsx
<Section id="contato" spacing="spacious">
  <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
    <div id="faq" className="scroll-mt-(--header-height) flex flex-col gap-8">
      <SectionHeading eyebrow="Dúvidas Frequentes" title="Perguntas comuns" align="left" />
      <Faq />
    </div>
    <div className="flex flex-col gap-8">
      <SectionHeading as="h1" eyebrow="Contato" title="Fale com o escritório" align="left" />
      <ContatoForm />
    </div>
  </div>
</Section>
```

---

## 5. `layout.tsx` — title template

```ts
export const metadata: Metadata = {
  title: {
    default: "Helio Kleison Advocacia",
    template: "%s | Helio Kleison Advocacia",
  },
  description: "Escritório de advocacia Hélio Kleison",
}
```

Cada página filha só precisa de `title: "Sobre o Advogado"` (por
exemplo) — o Next.js compõe o `<title>` final
("Sobre o Advogado | Helio Kleison Advocacia") automaticamente.

---

## 6. Fora de escopo desta sub-fase

- Qualquer CTA/copy nova além do que já existe na Home (decisão
  confirmada — reaproveitar, não expandir).
- Sitemap.xml / robots.txt (não pedido, fora do escopo desta sessão).
- Breadcrumbs.
- Imagem ilustrativa do FAQ (mesma decisão já registrada na Fase 4.4).

---

## 7. Critérios de aceite

- [ ] `nav-links.ts` exporta `href` por anchor; Header/Footer/NavDrawer/
      CTA secundário do Hero usam `anchor.href` (ou a rota direta, no
      caso do Hero) em vez de `` `#${id}` ``
- [ ] `SectionHeading` aceita `as="h1"`, renderizando `<h1>` em vez de
      `<h2>`
- [ ] `AreasAtuacaoContent`/`SobreContent` existem, aceitam
      `headingLevel`, e `AreasAtuacao`/`Sobre` (wrappers da Home)
      continuam renderizando exatamente igual a antes (`headingLevel="h2"`
      implícito, mesmo `id`/`border-t`)
- [ ] `/areas-de-atuacao`, `/sobre`, `/contato` renderizam com exatamente
      1 `<h1>` cada, conteúdo idêntico ao da Home (mesma copy)
- [ ] Cada página tem `metadata.title`/`description` própria; o
      `<title>` final aparece como "X | Helio Kleison Advocacia"
- [ ] Clicar em cada item do nav (Header/Footer/mobile drawer) navega
      pra rota correta a partir de qualquer página
- [ ] `jest-axe` sem violações em cada página nova
- [ ] Todos os testes existentes de `AreasAtuacao`/`Sobre`/`Header`/
      `Footer`/`Hero` continuam passando sem alteração de asserção (só a
      forma como o href é montado muda internamente)

**TDD:** as páginas em si (composição, sem lógica nova) seguem a mesma
exceção de conteúdo estático já usada em toda a Fase 4. A extração
`*Content`/`headingLevel` e a troca de `href` são refactors mecânicos
sobre componentes já testados — cobertos por testes novos que confirmam
o comportamento (não é lógica de negócio nova, mas merece asserção
própria por mudar a estrutura de props pública dos componentes).

---

## 8. Achados reais durante a implementação (não previstos na spec original)

1. **Ordem de heading quebrada em `/areas-de-atuacao`** — `jest-axe`
   pegou de verdade: promover `SectionHeading` pra `<h1>` sem também
   ajustar o `CardTitle` dos cards (fixo em `<h3>`) pulava do `<h1>`
   direto pro `<h3>`, sem `<h2>` no meio (regra `heading-order`).
   Corrigido: `AreasAtuacaoContent` agora deriva o nível do `CardTitle`
   a partir do `headingLevel` (`h1` → cards em `h2`; `h2`, o caso da
   Home, → cards continuam em `h3`) — usa o prop `as` que o `CardTitle`
   já tinha desde a Fase 2, sem prop nova.
2. **Ordem do DOM em `/contato`** — a primeira versão mantinha a coluna
   do FAQ (`<h2>`) à esquerda e a do Contato (`<h1>`) à direita, mesma
   ordem visual da Home. Mas isso colocava o `<h2>` **antes** do `<h1>`
   na ordem de leitura/DOM — estranho para quem navega por heading num
   leitor de tela (chegaria em "Perguntas comuns" antes de qualquer
   `<h1>` da página). Corrigido: coluna do Contato (assunto principal da
   URL) vem primeiro no DOM (e visualmente, à esquerda); FAQ em segundo.
   `jest-axe` não acusa isso automaticamente (a regra `heading-order` só
   pega saltos de nível, não ordem-antes-do-h1) — foi revisão manual.

---

## 9. Ajuste pós-revisão visual (rodada 1) — "Dúvidas" e "Contato" viram 1 item de nav só

O Lucas notou que "Dúvidas" e "Contato" já levavam pro mesmo lugar
(`/contato`, diferindo só na âncora `#faq`/`#contato`) — dois itens de
nav pra um destino só. Decisão: unificar num único item, **"FAQ/Contato"**,
liberando um slot no menu (hoje 3 itens, não mais 4) para um assunto
futuro (ex: uma página de blog).

- `NAV_ANCHORS` (`nav-links.ts`) perde as entradas separadas `faq`/
  `contato`; vira uma só (`id: "faq"`, `href: "/contato"`,
  `headerLabel`/`footerLabel: "FAQ/Contato"`). O `href` deixa de
  precisar de âncora (`#faq`/`#contato`) — a página inteira é o destino
  agora, sem necessidade de pular pra uma metade específica.
- `src/app/contato/page.tsx` — `metadata.title` passa de "Contato" para
  "FAQ/Contato" (aparece na aba como "FAQ/Contato | Helio Kleison
  Advocacia"). O `<h1>` da página continua "Fale com o escritório" — o
  nome "FAQ/Contato" identifica a página no nav/aba, não substitui a
  copy já aprovada dentro dela (mesmo padrão já usado em `/sobre`: nav
  diz "Sobre mim", `<h1>` da página é "Dr. Helio Kleison").
- A seção `FaqContato` da Home (`src/components/sections/faq-contato.tsx`)
  **não muda** — continua com os dois `id`s (`faq`/`contato`) internos,
  que seguem válidos como destino de link direto/compartilhamento mesmo
  sem nenhum nav apontando pra eles especificamente.

---

## 10. Ajuste pós-revisão visual (rodada 2) — logo do Header não voltava pra Home

O Lucas notou que clicar no monograma "HK" ou no nome "Helio Kleison /
Advocacia & Consultoria" no Header não levava pra Home. Causa: o `<a>`
do logo (`header.tsx`) tinha `href="#"` desde a Fase 3 — inofensivo
enquanto o site era single-page (âncora vazia só rolava pro topo da
própria página), mas quebrado agora que existem 4 páginas reais: em
qualquer página que não fosse a Home, `href="#"` não navegava a lugar
nenhum de útil.

Corrigido para `href="/"` — e, ao trocar, o ESLint (`@next/next/no-html-link-for-pages`)
acusou que um link interno estático deveria usar `<Link>` do
`next/link` em vez de `<a>` puro (navegação client-side do Next.js, sem
recarregar a página inteira). Trocado. Teste novo confirma o `href`.

**Observação para revisão futura, não corrigida agora (fora do pedido
desta rodada):** os demais links internos do site (nav do Header/Footer/
drawer via `anchor.href`, CTA secundário do Hero) continuam como `<a>`
puro, não `<Link>` — o ESLint não acusa esses porque o `href` vem de uma
variável (`anchor.href`), não de uma string literal que a regra consiga
analisar estaticamente. Tecnicamente todos ganhariam navegação
client-side mais rápida se virassem `<Link>`, mas isso é um refactor à
parte, não pedido nesta correção.
