# Fase 4.3 — Sobre o Advogado (resumo na Home)

**Status:** Implementado e aprovado pelo Lucas (1 rodada de ajuste
pós-revisão visual — retrato/seção reduzidos, ver seção 9)
**Depende de:** Fase 2 (`Section`), Fase 3 (anchor `sobre` já reservado em
`NAV_ANCHOR_IDS`), Fase 4.2 (`SectionHeading`, padrão de hairline entre
seções — ambos reaproveitados aqui, ver seção 1)
**Fonte de conteúdo:** copy e estilo extraídos do site atual
(heliokleisonadvocacia.com.br), confirmados nesta sessão via inspeção
direta do CSS computado (mesmo método usado na Fase 4.2).

---

## 1. Contexto — seguindo o padrão fixado na Fase 4.2

O Lucas confirmou, ao aprovar a Fase 4.2, que as próximas seções da Home
(esta e a Fase 4.4) devem **seguir o mesmo padrão visual** já validado:
tokens de cor (`gold` para destaque, `border-foreground/5` como fronteira
entre seções), tipografia (`font-display` para headings), e o componente
`SectionHeading` (eyebrow pequeno + título grande). Diferente da Fase 4.2
(grid centralizado), esta seção usa um **layout assimétrico de 2 colunas**
(foto + texto) — mesma família visual do Hero, mas com os lados invertidos
(lá o texto vem primeiro e a foto à direita; aqui a foto vem primeiro e o
texto à direita), criando alternância editorial ao longo do scroll da
Home. Por isso o `SectionHeading` ganha um novo `align="left"` nesta
sub-fase (ver seção 4) — o alinhamento centralizado da Fase 4.2 não se
aplica a um layout de 2 colunas.

## 2. Achado desta sessão: asset de imagem já existe, sem precisar de tratamento novo

`temp-assets/foto-helio-original.png` (976×918px, mantido como registro
do asset bruto desde a Fase 4.1, sem uso pelo site até agora) é **a mesma
foto exata** (mesma pose, mesmo fundo de pedra, mesma gravata vermelha)
usada no avatar circular da seção "Sobre" do site atual — confirmado por
comparação visual direta. Diferente do Hero (que precisou do fundo
removido via `rembg` para a técnica de ancoragem), esta seção usa a foto
**com o fundo original intacto**, recortada em círculo via CSS
(`rounded-full object-cover`) — não precisa de nenhum tratamento novo.

**Copiada** (não movida — diferente do fluxo da Fase 4.1) para
`public/images/dr-helio-sobre.png`. Cópia, não movimentação, porque
`temp-assets/foto-helio-original.png` pode servir de fonte para outros
recortes futuros (ex: página dedicada `/sobre`, Fase 4.5+) — diferente da
foto tratada do Hero, que já tinha um único uso definido.

---

## 3. Conteúdo (copy — extraído do site atual, não reescrito)

| Elemento | Texto |
|---|---|
| Eyebrow | "Sobre o Advogado" |
| Título (`<h2>`) | "Dr. Helio Kleison" (sem acento em "Helio" — grafia do site atual, mantida como está; diferente de "Hélio" usado em textos corridos como o `alt` do Hero, mas essa é a grafia do próprio site de produção para o nome estilizado) |
| Parágrafo 1 | "Advogado inscrito na **OAB/RN sob o nº 20.357**, com atuação dedicada ao Direito Bancário — uma área que exige rigor técnico para enfrentar instituições financeiras e buscar equilíbrio em contratos desiguais." (trecho em negrito = destaque `text-gold-light`, como no site atual) |
| Parágrafo 2 | "Atende de forma presencial em Natal/RN e, para clientes de todo o Brasil, oferece consultoria e acompanhamento processual 100% online, com a mesma atenção e transparência de um atendimento pessoal." |

**3 selos de credencial (stat tiles), com ícone:**

| Ícone (`lucide-react`) | Rótulo | Valor |
|---|---|---|
| `Scale` (já usado no Footer, mesmo vocabulário visual) | OAB/RN | 20.357 |
| `Landmark` | Foco | Direito Bancário |
| `Globe` | Atendimento | Natal/RN + Online |

---

## 4. Estrutura visual e composição

- **Grid assimétrico de 2 colunas (`md:` e acima):** `md:grid-cols-[9fr_11fr] gap-14 md:items-center` — foto na coluna esquerda (~45%), texto na direita (~55%), mesma proporção do site atual (lá é `0.9fr/1.1fr` no breakpoint `lg:`; adaptado para `md:` aqui, consistente com o breakpoint que o resto do projeto já usa desde o Hero/Áreas de Atuação). Mobile: empilha (foto em cima, texto embaixo).
- **Foto:** `aspect-square rounded-full object-cover`, ocupando a largura total da coluna esquerda (sem teto de `max-w-*`, mesmo raciocínio já usado no Hero — o arquivo fonte tem resolução de sobra pra qualquer largura de coluna que este grid pedir).
- **Bloco de texto (coluna direita):** `SectionHeading` com `align="left"` (eyebrow "Sobre o Advogado" + título "Dr. Helio Kleison"), seguido dos 2 parágrafos (`text-muted-foreground`, com o trecho "OAB/RN sob o nº 20.357" do parágrafo 1 em `text-gold-light`), seguido da grade de 3 selos de credencial.
- **Selos de credencial:** `grid grid-cols-3 gap-4` (sempre 3 colunas, mesmo em mobile — são compactos o suficiente), cada um `flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-4 py-4 text-center` (adaptado do site atual: lá o selo é só `border border-white/10` sem preenchimento; aqui ganha `bg-card`, mesmo raciocínio já documentado na spec do `Card` — fundo sólido evita o selo "sumir" contra o `navy` de fundo da página). Ícone (`text-gold`, tamanho `20`) acima do rótulo (`text-xs text-muted-foreground`) e do valor (`text-sm font-medium text-foreground`).
- **`id="sobre"` no `Section`**, com `scroll-mt-(--header-height)` e `border-t border-foreground/5` — mesmo padrão de fronteira decidido na Fase 4.2 (spec, seção 6.2), primeira vez que o anchor `#sobre` (reservado desde a Fase 3) aponta pra algo real.

---

## 5. `SectionHeading` — novo prop `align`

Estendido (não recriado) para suportar os dois casos de uso já confirmados:

```ts
interface SectionHeadingProps {
  eyebrow: string
  title: string
  align?: "center" | "left"   // novo — default "center" (mantém Fase 4.2 sem mudança)
  className?: string
}
```

`align="center"` (default): comportamento inalterado da Fase 4.2
(`mx-auto max-w-2xl items-center text-center`). `align="left"`:
`items-start text-left`, sem `mx-auto`/`max-w-2xl` (a largura já vem da
coluna do grid pai). Continua sem estado/variantes de lógica — mesma
exceção de TDD já documentada (seção 7).

---

## 6. Arquitetura de arquivos

- `src/components/sections/sobre.tsx` (novo) — Server Component, sem
  props, mesmo padrão de `Hero`/`AreasAtuacao`.
- `src/components/sections/sobre.test.tsx` (novo).
- `src/components/ui/section-heading.tsx` — editado (novo prop `align`).
- `src/components/ui/section-heading.test.tsx` — editado (novo teste para
  `align="left"`).
- `public/images/dr-helio-sobre.png` (novo, copiado de
  `temp-assets/foto-helio-original.png`, ver seção 2).
- `src/app/page.tsx` — passa a renderizar `<Sobre />` logo após
  `<AreasAtuacao />`.

---

## 7. Critérios de aceite (para orientar os testes)

- [ ] `Sobre` renderiza `SectionHeading` com `align="left"`, eyebrow
      "Sobre o Advogado" e título "Dr. Helio Kleison"
- [ ] Renderiza os 2 parágrafos de texto corretos (seção 3), com "OAB/RN
      sob o nº 20.357" destacado em `text-gold-light` dentro do parágrafo 1
- [ ] Renderiza os 3 selos de credencial com ícone, rótulo e valor
      corretos (seção 3)
- [ ] Renderiza a foto via `next/image`, `alt` descritivo, recortada em
      círculo (`rounded-full`)
- [ ] `Section` tem `id="sobre"` e `border-t border-foreground/5` (torna o
      anchor do Header/Footer funcional pela primeira vez)
- [ ] Grid é 1 coluna em mobile (foto em cima) e 2 colunas em `md:`
- [ ] Nenhuma violação `jest-axe`
- [ ] `SectionHeading` com `align="left"` renderiza `items-start text-left`
      sem o wrapper centralizado (`mx-auto max-w-2xl text-center`) da Fase
      4.2 — teste novo em `section-heading.test.tsx`

**Nota sobre TDD:** mesma exceção de conteúdo estático já documentada na
spec da Fase 4.2 (seção 6/7) — `Sobre` não introduz estado nem lógica
condicional, só compõe `Section`, `SectionHeading` e os selos de
credencial (markup novo, mas sem variantes/lógica). Teste de
render/snapshot + `jest-axe`, não ciclo red/green completo.

---

## 8. Fora de escopo desta sub-fase

- Página dedicada `/sobre` (Fase 4.5+).
- Qualquer recorte/tratamento adicional da foto além do `object-cover`
  circular via CSS.
- Depoimentos de clientes (nenhum caso de uso confirmado ainda).

---

## 9. Ajuste pós-revisão visual (rodada 1)

O Lucas pediu para reduzir a seção como um todo em torno de 30%. **Causa
identificada:** o retrato era o elemento mais volumoso da seção — sem
nenhum teto de tamanho (`w-full` dentro de uma coluna de grid de 9fr),
ele renderizava a ~522px de diâmetro em telas largas (`Container` padrão
= `max-w-7xl`, coluna 1 = 9/20 do espaço interno), e em mobile (layout
empilhado, antes do breakpoint `md:`) chegava a ocupar a largura inteira
do container — bem maior que qualquer outro elemento visual já construído
no site (Hero, Áreas de Atuação).

**Ajustes:**
- Retrato ganhou teto de tamanho: `max-w-[22rem]` (352px), com `mx-auto`
  para ficar centralizado dentro da própria coluna (tanto no grid
  empilhado do mobile quanto na coluna do desktop). Redução de ~33% em
  relação ao diâmetro anterior (522px → 352px), dentro da faixa pedida.
- Proporção do grid ajustada de `md:grid-cols-[9fr_11fr]` para
  `md:grid-cols-[7fr_13fr]` — a coluna da foto encolhe para caber melhor
  ao redor do novo tamanho fixo do retrato (evita sobra de espaço vazio
  ao lado dele), e a coluna de texto ganha mais respiro.
- `gap-14` → `gap-10` entre as colunas, proporcional à redução geral.

**Não alterado:** tamanho de fonte do título/parágrafos/selos — o pedido
foi sobre o tamanho da seção como um todo, e o retrato já era, sozinho, o
suficiente para explicar a desproporção; reduzir texto também arriscaria
prejudicar a hierarquia e a legibilidade já aprovadas.
