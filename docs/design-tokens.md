# Design Tokens — Fase 1

Tokens de design do site institucional do escritório Hélio Kleison
Advocacia. Todos os valores abaixo vivem em `src/app/globals.css` (Tailwind
v4 usa configuração de tema em CSS, via `@theme`, em vez de
`tailwind.config.ts`) e nas fontes carregadas em `src/app/layout.tsx`.

## Origem dos valores

A Fase 0 (`docs/fase-0-auditoria.md`) determinou que a paleta (navy +
dourado) e a tipografia (Playfair Display, Inter, Cormorant Garamond) do
site atual deveriam ser reaproveitadas. Os valores exatos (hex codes,
pesos de fonte) não estavam documentados em nenhum artefato do projeto —
foram extraídos diretamente do `tailwind.config` inline no HTML do site em
produção (`https://www.heliokleisonadvocacia.com.br`), não inventados.

## Paleta de cores

### Escala bruta (`bg-navy-*`, `text-gold-*`, etc.)

| Token          | Valor     | Uso no site atual                          |
|----------------|-----------|---------------------------------------------|
| `navy`         | `#020617` | Fundo principal (dominante)                  |
| `navy-deep`    | `#01030a` | Texto sobre fundos claros; tom mais escuro   |
| `navy-surface` | `#0b1220` | Painéis/cards elevados sobre o fundo navy    |
| `navy-line`    | `#1e293b` | Bordas/divisores sutis                       |
| `gold`         | `#b89452` | Acentos, bordas de destaque, CTAs            |
| `gold-light`   | `#e4d1a3` | Texto de destaque (títulos, links) — o mais usado |
| `gold-dark`    | `#997637` | Variante escura do dourado                   |
| `whatsapp`     | `#25d366` | Verde oficial do WhatsApp, para o componente de CTA único (ver Fase 0 — "CTAs de WhatsApp") |

### Tokens semânticos do shadcn/ui (`bg-primary`, `text-foreground`, etc.)

Os componentes do shadcn/ui consomem tokens semânticos (`--background`,
`--primary`, `--secondary`, etc.), não a paleta bruta diretamente. Esses
tokens foram remapeados da paleta neutra padrão do shadcn para a
identidade navy + dourado:

| Token semântico | Mapeado para |
|---|---|
| `background` / `card` / `popover` | `navy` / `navy-surface` |
| `foreground` / `card-foreground` | `#f3f4f6` (cinza claro, mesmo tom mais usado no site atual: `text-gray-100`) |
| `primary` | `gold`, com `primary-foreground` em `navy-deep` |
| `secondary` | `navy-surface`, com `secondary-foreground` em `gold-light` |
| `accent` | `gold-light`, com `accent-foreground` em `navy-deep` |
| `muted` | `navy-line`, com `muted-foreground` em `#9ca3af` |
| `border` / `input` / `ring` | `navy-line` / `navy-line` / `gold` |

**Decisão:** o site atual não tem alternância de tema claro/escuro — navy
+ dourado é a identidade visual única e fixa do site. Por isso, o boilerplate
`.dark { ... }` gerado pelo `shadcn init` foi removido em vez de mantido
sem uso: manter código morto para um recurso (toggle de tema) que não foi
pedido violaria o princípio de não construir para requisitos hipotéticos.
Se um toggle de tema for solicitado no futuro, isso é uma decisão de
produto nova, tratada como change própria.

## Tipografia

| Token (`font-*`) | Fonte | Pesos carregados | Uso |
|---|---|---|---|
| `font-display` | Playfair Display | 500, 600, 700 (+ 500 itálico) | Títulos (`h1`–`h3`) — confirmado no site atual, todo heading usa esta fonte |
| `font-serif` | Cormorant Garamond | 500 (+ 500 itálico) | Uso pontual/decorativo (a Fase 0 listou como parte da identidade; uso de baixa frequência no site atual, token mantido para a Fase 2 decidir onde aplicar) |
| `font-sans` | Inter | 300, 400, 500, 600, 700 | Corpo de texto — fonte padrão do `<html>` (`@apply font-sans` em `globals.css`) |

Os pesos/estilos carregados via `next/font/google` em `layout.tsx`
replicam exatamente a URL do Google Fonts usada pelo site atual
(`family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;1,500`).

## Espaçamento

**Decisão (task 2.3):** nenhuma escala de espaçamento customizada foi
criada nesta fase. O site atual não definia uma escala própria (usava a
escala padrão do Tailwind via CDN), e não há, até agora, um caso concreto
de layout que a escala padrão do Tailwind (`p-4`, `gap-6`, `py-24`, etc.)
não resolva. Criar uma escala customizada agora seria antecipar uma
necessidade que ainda não existe — ver `design.md` (Risks / Trade-offs).
Se a Fase 2 encontrar um gap real na escala padrão, a escala pode ser
estendida no mesmo bloco `@theme` em `globals.css` onde vivem os demais
tokens.

## Onde usar

- Para componentes shadcn/ui e a maioria dos elementos de UI: prefira os
  tokens semânticos (`bg-primary`, `text-foreground`, `border-border`).
- Para replicar exatamente o vocabulário visual do site atual (ex:
  `bg-navy-surface`, `text-gold-light`) em seções construídas à mão na
  Fase 2: use a escala bruta diretamente.
- Nunca hardcode um hex/rgb novo — se um tom necessário não existir aqui,
  adicione o token em `globals.css` primeiro (ver `design-system` spec —
  requisito de tokens centralizados).
