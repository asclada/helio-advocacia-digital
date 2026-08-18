# Fase 4.1 — Hero da Home

**Status:** Implementado e aprovado pelo Lucas na revisão visual (4 rodadas de ajuste pós-revisão) — testado (9 testes, `jest-axe` sem violações), `tsc`/`lint` limpos
**Depende de:** Fase 2 (Button, Badge, Container/Section), Fase 3 (Header — `--header-height`, `--z-header`, `NAV_ANCHOR_IDS`)
**Fonte de conteúdo:** copy do Hero do site atual (heliokleisonadvocacia.com.br), confirmada nesta sessão via fetch direto — nenhum artefato da Fase 0 tinha o texto literal registrado.

---

## 1. Contexto e decisão arquitetural

A Fase 4 muda a arquitetura do site: em vez de single-page com âncoras (decisão da Fase 3), o redesign vai para **Home enxuta + páginas dedicadas** (`/`, `/sobre`, `/areas-de-atuacao`, `/contato`), usando rotas nativas do App Router — melhor indexação no Google para buscas locais do que uma âncora dentro de uma página só. A Home passa a conter versões resumidas de cada seção, cada uma linkando para sua página dedicada (páginas dedicadas: Fase 4.5+, fora do escopo desta spec).

O Hero é a primeira seção da Home — abertura do funil, sem mudança de conteúdo/copy em relação ao site atual, só de tratamento visual.

**Direção visual (repaginada mais ampla, ver decisão registrada na memória do projeto):** referência principal de tom é a BCR Law LLP (bcrlawllp.com/law) — layout assimétrico, composição editorial. Referência secundária Substance Law (substancelaw.ca) — usada aqui só como precedente de comportamento para confirmar que nada no Hero ocupa o canto inferior direito reservado ao widget de chat (`--z-chat-widget`, Fase 8). Ario Law Firm foi descartada como referência — motion/animação exagerada não combina com o tom do Dr. Hélio. **Nota (revisada na rodada 4 de revisão visual):** a referência original também incluía headline em duas partes com tipografia mista (Playfair Display + Cormorant Garamond itálico) — testada em código e avaliada ao vivo por 3 rodadas de revisão, mas descartada no fim: o Lucas preferiu tipografia uniforme no headline inteiro (ver seção 4). O resto da direção BCR Law (assimetria, composição editorial) se mantém — só esse detalhe específico de mistura tipográfica no `<h1>` foi revertido.

---

## 2. Achado desta sessão: estado real do asset de imagem

O prompt de handoff da Fase 3 descrevia a foto do Dr. Hélio como "tratada, fundo removido, PNG com transparência, pronta desde a Fase 1". Ao abrir `temp-assets/foto-helio-original.png` nesta sessão, o fundo (parede de pedra) estava **intacto** — a descrição não correspondia ao estado real do arquivo.

**Resolvido nesta sessão:** fundo removido com `rembg` (modelo `bria-rmbg-2.0`, rodado localmente num venv Python isolado, descartável — não é dependência do projeto). Resultado verificado por inspeção do canal alpha (RGBA, 976×918px, ~59% dos pixels totalmente transparentes) — recorte limpo nos contornos (cabelo, óculos, ombros). Arquivo tratado salvo em `temp-assets/foto-helio-tratada.png`, ao lado do original (pasta `temp-assets/` é ignorada pelo Git — ver `.gitignore:41` — fica só como working file local).

**Decisão de imagem estática vs. vídeo (ponto em aberto do prompt original):** foto estática, não vídeo em loop. Justificativa: a foto já está pronta e tratada (após o achado acima), enquanto vídeo exigiria asset novo + otimização adicional — risco técnico maior numa fase que já está introduzindo a primeira imagem real do site (Core Web Vitals/LCP é critério de SEO relevante para captação local). Vídeo fica como evolução possível em fase futura, não decisão final.

---

## 3. Conteúdo (copy — não muda)

| Elemento | Texto |
|---|---|
| Headline (tipografia uniforme, Playfair Display — ver seção 4) | "Ao seu lado na defesa do seu **patrimônio** contra abusos bancários e juros abusivos" (só "patrimônio" em destaque dourado) |
| Texto de apoio | "Assessoria jurídica especializada para quem sofre com seguros embutidos sem autorização no empréstimo, contratos fraudados em seu nome ou consignado liberado a menor de idade sem autorização judicial. Atendimento presencial em Natal/RN e online para todo o Brasil." |
| CTA primário | "Falar agora no WhatsApp" (reaproveita `WhatsAppCta`) |
| CTA secundário | "Ver áreas de atuação" |
| Selo de confiança (3 badges) | "Natal/RN" · "Atendimento Online" · "OAB/RN 20.357" |

**Decidido nesta sessão — headline como frase única:** o texto ainda tem duas metades de sentido (o que o escritório faz + a dor específica do cliente), mas isso hoje só existe no conteúdo/copy — não há mais divisão tipográfica entre elas (ver seção 4, rodada 4). Copy do site atual mantida literalmente, sem reescrita.

**Decidido nesta sessão — alvo do CTA secundário:** `href="#atuacao"`, reaproveitando o comportamento de âncora/scroll-spy que o Header já resolve desde a Fase 3 (`NAV_ANCHOR_IDS`). Quando a Fase 4.2 criar a seção real de Áreas de Atuação na Home (com `id="atuacao"` e `scroll-mt-(--header-height)`, conforme já documentado na spec da Fase 3), o link passa a funcionar ponta a ponta sem mudança nesta spec. Migra para rota própria (`/areas-de-atuacao`) só na Fase 4.5+, quando a página dedicada existir.

**Decidido nesta sessão — selo de confiança no Hero:** sim, usando o componente `Badge` já pronto da Fase 2 (contorno dourado), abaixo dos CTAs. Mantém prova social visível na primeira dobra sem depender de scroll até a seção Sobre (Fase 4.3).

---

## 4. Estrutura visual e composição

- **Layout desktop (`md:` e acima):** grid assimétrico de 2 colunas — texto (headline + apoio + CTAs + badges) à esquerda, ocupando a maior parte da largura; retrato do Dr. Hélio à direita, alinhado à borda do container (assimetria vem da imagem "quebrar" o alinhamento simétrico do grid, não de rotação/tilt). Um `bg-gold/10 blur-3xl` sutil atrás do retrato evita a sensação de imagem "flutuando sozinha" sobre o fundo navy — decoração mínima, sem token novo (usa opacidade sobre o token `gold` já existente).
- **Layout mobile (abaixo de `md:`):** empilhado — 1) headline + apoio, 2) retrato, 3) CTAs, 4) badges. Ordem prioriza a mensagem antes da imagem, mas mantém o retrato visível cedo (não joga a foto para o fim do bloco).
- **Altura do Hero:** sem `min-h-screen` forçado — o bloco usa `Section` com `spacing="spacious"` (`py-24 md:py-32`, já existente na Fase 2) e deixa o conteúdo real (headline + retrato) definir a altura. Justificativa: forçar altura de viewport inteira sem vídeo de fundo deixaria espaço vazio sempre que o conteúdo não preencher a tela — o BCR Law usa altura cheia porque tem vídeo preenchendo o fundo; aqui o fundo é sólido (`navy`), então altura cheia não tem a mesma função.
- **Tamanho do retrato (ajuste pós-revisão visual, 2 rodadas):** a primeira versão limitava a largura do retrato a `max-w-sm` (384px), menor que a própria coluna direita do grid (~467px de largura real, medida em desktop). Removido esse teto artificial na 1ª rodada — o retrato passou a ocupar 100% da coluna (`w-full`, sem `max-w-*`), crescendo ~22%. Na 2ª rodada, mesmo preenchendo a coluna inteira, ainda sobrava espaço negativo generoso ao redor da figura (acima da cabeça, nas laterais) — a coluna em si precisava ficar maior, não só o preenchimento dela. Ajustado o próprio ratio do grid de `md:grid-cols-[3fr_2fr]` para `md:grid-cols-[13fr_12fr]`: a coluna da imagem cresce exatamente +20% (a coluna de texto encolhe proporcionalmente, de ~700px para ~607px de largura em desktop — ainda confortável para o texto de apoio, que já usa `max-w-xl`). Sem risco de perda de qualidade em nenhuma das duas rodadas: o arquivo fonte (`public/images/dr-helio-portrait.png`) está em 976×918px, acima do que qualquer largura de coluna deste grid vai pedir — o `next/image` sempre otimiza a partir do arquivo original, então o teto real de qualidade é a resolução do arquivo, não o CSS.
- **Tipografia do headline (ajuste pós-revisão visual, 4 rodadas — decisão final: tipografia 100% uniforme):** a primeira versão dava pesos tipográficos bem diferentes às duas partes (parte 1 em negrito/`text-gold-light`, parte 2 em itálico leve/`text-foreground`), e o resultado destoava — lia como duas frases de peso diferente, quebrando o fluxo de leitura. Rodada 1: peso e cor unificados (`font-medium`/`text-foreground` nas duas partes), destaque dourado restrito à palavra "patrimônio". Rodada 2: corrigido um resíduo esquecido na rodada 1 — a parte 2 ainda tinha um override de tamanho (`text-3xl sm:text-4xl`) menor que o herdado pela parte 1; removido, as duas passaram a herdar o mesmo `text-4xl sm:text-5xl` do `<h1>`. **Rodada 4:** mesmo com peso/cor/tamanho já unificados, a mistura de família tipográfica em si (Playfair Display reto na parte 1 vs. Cormorant Garamond itálico na parte 2 — a única diferença tipográfica que ainda restava, herdada da referência BCR Law original, seção 1) seguia destoando na revisão ao vivo. Removida também: o `<h1>` inteiro passou a usar só `font-display` (Playfair Display), sem itálico, numa única `<span>` de texto corrido — não há mais nenhuma divisão tipográfica dentro do headline, só o destaque de cor pontual em "patrimônio". Resultado: frase única, uniforme em fonte/peso/tamanho/cor, com um único ponto de ênfase (a cor), replicando o padrão do site atual em produção.
- **Ancoragem do retrato na borda inferior do Hero (ajuste pós-revisão visual, rodada 3):** com o tamanho já resolvido (rodadas 1-2), o retrato ainda "flutuava" solto dentro do Hero, cercado de espaço vazio em todos os lados — lia como um recorte colado, não como parte natural da composição. Ajustado para o retrato encostar exatamente na borda inferior do `Section` (fronteira com a seção seguinte, ainda por definir na Fase 4.2), independente da cor/estilo dessa próxima seção. Técnica: `md:items-end` no grid (troca do `items-center` anterior) alinha o retrato à base do seu próprio track antes de mais nada; `md:-mb-32` no wrapper do retrato cancela exatamente o `md:py-32` (padding-bottom) do `Section` (`spacing="spacious"`) — os dois valores são propositalmente iguais (8rem/128px), não coincidência, e precisam mudar juntos se a spacing do Section mudar (mesmo padrão de acoplamento manual já usado em `--header-height`/`HEADER_HEIGHT_PX`, documentado em `src/lib/layout-tokens.ts`). **Vantagem desta técnica sobre `position: absolute`:** como só a margem do retrato muda (o padding do `Section` continua intacto para todo o resto), o bloco de texto/CTAs/badges nunca perde a margem inferior normal — não precisou de nenhum ajuste próprio para "subir", só o retrato ignora essa faixa de espaço. Escopado só para `md:` — no mobile o retrato continua no fluxo normal empilhado (spec, bullet "Layout mobile" acima), sem ancoragem especial.
- **Ponto de atenção monitorado (mesma rodada 3):** com o retrato ancorado embaixo, seu comprimento (proporção 976:918 aplicada à largura da coluna) pode superar a altura natural do bloco de texto ao lado, forçando o grid a esticar levemente as 3 linhas de texto pra acomodar o item que abrange as três (comportamento padrão do CSS Grid para item que ocupa múltiplas linhas maior que a soma delas). Nas dimensões atuais o excesso é pequeno (dezenas de pixels distribuídos entre 3 linhas) — não deve produzir um recorte dominando a seção, mas é o primeiro lugar a olhar se a proporção parecer desbalanceada na revisão visual.
- **Confirmação da reserva do widget de chat:** nenhum elemento do Hero é `fixed`/`sticky` nem ocupa o canto inferior direito da tela — os CTAs e badges ficam no fluxo normal do documento, dentro do `Container`. Sem conflito com `--z-chat-widget` (Fase 8).
- **Decisão registrada — sem efeito piscante/glow no CTA de WhatsApp:** avaliado e descartado deliberadamente na revisão visual, não é uma pendência. O destaque chamativo (glow/pulse) fica reservado para o widget de chat da Fase 8, que é o elemento que realmente precisa competir por atenção nessa altura da jornada; dois elementos piscando ao mesmo tempo destoaria do tom sóbrio do site. Não reabrir esta discussão nas próximas sub-fases sem uma razão nova.

---

## 5. Tratamento da imagem (técnico)

- **Origem → destino (parte do escopo desta sub-fase):** `temp-assets/foto-helio-tratada.png` (working file local, fora do Git — `.gitignore:41`) é **movido** (não copiado — não faz sentido manter duas cópias do mesmo PNG tratado) para `public/images/dr-helio-portrait.png`, que passa a ser o caminho definitivo, committado, consumido pelo `next/image` no `Hero`. `temp-assets/foto-helio-original.png` (sem tratamento) permanece em `temp-assets/` como registro do asset bruto, sem uso pelo site.
- Pasta `public/` ainda não existe no projeto — criada nesta fase, primeiro asset real de imagem do site.
- Componente `next/image` (otimização automática de imagem do Next.js — gera variantes responsivas e lazy-load automático, exceto quando marcado para carregar cedo).
- **Correção (achado em Plan Mode):** este projeto roda Next.js 16, que **depreciou a prop `priority` em favor de `preload`** (confirmado em `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`, tabela de versões `v16.0.0` — ver aviso no `CLAUDE.md` do projeto sobre não assumir a API de treino do Next.js sem checar os docs embutidos). `preload={true}` habilitado — o Hero é a primeira seção visível (above the fold), então a imagem entra no cálculo de LCP (Largest Contentful Paint, uma das métricas de Core Web Vitals); `preload` insere um `<link>` de preload no `<head>` para ela carregar o quanto antes, pulando o lazy-loading padrão.
- `alt="Advogado Hélio Kleison"` — descreve quem aparece na foto (não é imagem puramente decorativa, então não leva `alt=""`).
- Dimensões reais do arquivo tratado: 976×918px — usadas como `width`/`height` do `next/image` para evitar layout shift (CLS, outra métrica de Core Web Vitals) antes da imagem carregar.

---

## 6. Arquitetura de arquivos

- `src/components/sections/` (novo diretório) — primeira vez que o projeto tem seções de conteúdo de página, diferente de `layout/` (chrome presente em toda página — Header/Footer) e `ui/` (primitivas reutilizáveis — Button/Badge/Card). `sections/` é onde vivem os blocos de conteúdo específicos de uma página (Hero, e nas próximas sub-fases, os resumos de Áreas de Atuação/Sobre/Contato).
- `src/components/sections/hero.tsx` — sem props (conteúdo estático, uso único na Home; não há necessidade de generalizar antes de existir um segundo caso de uso real).
- `public/images/dr-helio-portrait.png` — novo diretório `public/`.
- `src/app/page.tsx` — passa a renderizar `<Hero />` no lugar do placeholder atual.

---

## 7. Fora de escopo desta sub-fase

- Seções de Áreas de Atuação, Sobre e CTA/Contato da Home (Fases 4.2–4.4)
- Páginas dedicadas (`/sobre`, `/areas-de-atuacao`, `/contato`) — Fase 4.5+
- Vídeo de fundo no Hero (avaliado e adiado — ver seção 2)
- Qualquer lógica do widget de chat (só a confirmação visual de que o Hero não compete com o canto reservado)
- Testes de regressão visual (Playwright) — entram quando houver páginas completas montadas, por padrão do projeto (`docs/padrao-desenvolvimento.md`, seção 3)

---

## 8. Critérios de aceite (para orientar os testes)

- [ ] `Hero` renderiza o headline inteiro como frase única, com tipografia 100% uniforme (`font-display`, `font-medium`, `text-foreground`, mesmo tamanho herdado do `<h1>`, sem itálico) — a única variação no headline é o destaque pontual `text-gold-light` na palavra "patrimônio"
- [ ] Texto de apoio presente e correto
- [ ] CTA primário (`WhatsAppCta`) presente, abrindo o link `wa.me` correto, sem efeito de glow/pulse (decisão registrada na seção 4)
- [ ] CTA secundário presente, `href="#atuacao"`
- [ ] 3 badges de confiança presentes com o texto correto
- [ ] Imagem do Dr. Hélio renderiza via `next/image`, com `alt` descritivo, `preload={true}` habilitado (não `priority`, depreciado no Next.js 16 — ver seção 5), ocupando a largura total da coluna (sem teto de `max-w-*`)
- [ ] Nenhuma violação `jest-axe`
- [ ] Layout mobile empilha na ordem definida (headline+apoio → retrato → CTAs → badges); layout desktop usa grid assimétrico de 2 colunas

**Nota sobre TDD nesta sub-fase (critério explícito, para servir de precedente às próximas sub-fases):** `docs/padrao-desenvolvimento.md`, seção 3, define:

> **Obrigatório para:**
> - Todo componente de UI reutilizável (Button, Card, Input, Badge, etc.)
> - Toda lógica de negócio (formulários, integração com n8n, validações, parsing)
> - Acessibilidade de componentes interativos (`jest-axe` ou equivalente)
>
> **Não obrigatório, mas recomendado:**
> - Conteúdo estático puro (texto, seções sem lógica) — nesse caso, um snapshot test simples já é suficiente, não precisa de TDD completo.

O `Hero` se qualifica para a segunda categoria: não introduz nenhum hook novo, nenhum estado (`useState`/`useEffect`), nenhuma lógica condicional além de composição — só monta `Section`, `Container`, `WhatsAppCta` e `Badge`, todos já testados em fases anteriores. Por isso o critério de aceite desta spec (seção 8) pede teste de render/snapshot + `jest-axe`, não o ciclo red/green completo. `jest-axe` continua obrigatório de qualquer forma — é a terceira categoria da lista acima, e não depende de a seção ter lógica ou não.

**Isso não é precedente automático para as próximas sub-fases.** A Fase 4.2 (Áreas de Atuação) já está desenhada como carrossel horizontal (ver `docs/handoffs/2026-08-18-fase3-header-footer.md` e o prompt desta sessão) — um carrossel tem estado (item ativo/posição) e interação (arrastar, navegar), o que o enquadra em "toda lógica de negócio" e provavelmente também em "componente de UI reutilizável", ambos na categoria obrigatória. Fases futuras precisam reavaliar este critério contra o conteúdo real que vão construir, não herdar a exceção do Hero por analogia.
