# Handoff — 2026-08-18 — Fase 4 completa (Home + páginas dedicadas)

## Prompt pronto para a próxima sessão

```
Estou no projeto Hélio Advocacia Digital. A Fase 4 (site institucional
completo — Home + páginas dedicadas) foi fechada na sessão anterior.
Esta é uma sessão NOVA, sobre um domínio técnico diferente: Fase 5 —
criar o banco de dados do CRM no Supabase (schema, tabelas, RLS). Por
regra do projeto, cada bloco (frontend do site / Supabase / painel do
CRM / integração n8n) é uma sessão separada, para não misturar domínios
técnicos muito diferentes no mesmo contexto — não continue nem
referencie detalhes de implementação do site institucional além do que
for necessário pra entender o schema (ex: quais dados o formulário de
contato já coleta).

Antes de começar, leia:
- docs/roadmap.md (roadmap master — Fase 4 concluída; Fase 5 ainda é só
  esqueleto de escopo provável, precisa de spec própria antes de
  qualquer código)
- docs/padrao-desenvolvimento.md (padrão de processo: Plan Mode + SDD +
  TDD, comunicação didática, handoff em dois blocos — mesmo padrão vale
  pra este novo domínio)
- docs/handoffs/2026-08-18-fase4-completa.md (este handoff)
- CLAUDE.md do projeto, seção 11 (Stack e Architecture) — confirma que
  este repositório do site institucional NÃO tem cliente de banco de
  dados direto; o Supabase é um projeto/repositório separado, e o fluxo
  real é site → n8n → Supabase (do CRM)

A Fase 5 ainda não tem spec — o roadmap master só lista o escopo
provável (schema inicial de clients/leads/triagens/profiles, Supabase
Auth, RLS, client_id como preparação multi-tenant). Antes de qualquer
código, a conversa precisa definir o escopo real e escrever uma spec,
seguindo o mesmo ciclo (spec → Plan Mode → aprovação → implementação).

Um dado útil pra desenhar o schema de "leads": o formulário de contato
do site institucional (`src/components/sections/contato-form.tsx`,
Fase 4.4) já define os campos que um lead preenche — nome completo,
WhatsApp, e-mail, assunto (Venda Casada de Seguro / Empréstimo
Fraudado / Consignado a Menor de Idade / Outro assunto) e mensagem —
provavelmente o ponto de partida pra pensar a tabela `leads`.
```

## Registro da sessão

### O que foi feito

Sessão longa e acelerada (decisão do Lucas no início: combinar as
sub-fases 4.2–4.5 numa sessão só, mantendo pontos de parada de revisão
visual entre cada uma). Fechou a Fase 4 inteira:

**Deploy (antes da Fase 4.2):** projeto conectado à Vercel (time
`asclada's projects`, plano Hobby, sem domínio próprio) via browser
automation — preview automático em cada push pra `main`:
https://helio-advocacia-digital.vercel.app.

**Fase 4.2 — Áreas de Atuação (resumo na Home):** grid estático de 3
cards (decisão: substitui o carrossel cogitado na Fase 3 — sem
estado/interação, então TDD leve, mesma exceção do Hero). Título e
subtítulo extraídos do site atual via inspeção de CSS computado.
Componente `SectionHeading` criado nesta sub-fase (eyebrow + título),
depois estendido com props `align` e `as` nas sub-fases seguintes —
virou o padrão repetido em Sobre e FAQ/Contato. Hover de elevação +
moldura dourada replicado com valores exatos extraídos do site atual
(`getComputedStyle`/`cssRules`, não estimados). Linha sutil
(`border-t border-foreground/5`) adicionada entre Hero e Áreas de
Atuação depois que o Lucas notou o retrato do Hero "flutuando" sem
nenhuma fronteira visual — virou o padrão de separação entre todas as
seções da Home a partir daqui.

**Fase 4.3 — Sobre (resumo na Home):** retrato circular — achado real:
a foto original (`temp-assets/foto-helio-original.png`, sem tratamento)
já era a mesma foto usada no avatar circular do site atual, só copiada
pra `public/images/dr-helio-sobre.png`, sem precisar de tratamento
novo. 2 parágrafos + 3 selos de credencial (ícones `lucide-react`).
Retrato reduzido ~33% (de ~522px pra 352px de diâmetro) numa rodada de
ajuste, depois que ficou desproporcional ao resto da seção.

**Fase 4.4 — Dúvidas Frequentes + Contato:** primeira seção com estado
real — accordion de FAQ (`@base-ui/react/accordion`, usado direto, sem
virar `ui/accordion.tsx` — só 1 caso de uso confirmado, mesmo
precedente do `Dialog` no `NavDrawer`) e formulário de contato completo
(`@base-ui/react/form` + `Field`/`FieldControl` — este último, novo em
`ui/field.tsx`, achado real de TDD: elementos nativos como
`Textarea`/`Select` não recebem `id`/`aria-labelledby` automaticamente
do `Field` como o `Input` recebe). Validação 100% nativa (atributos
HTML + `ValidityState`), sem nenhuma função de validação customizada.
**Decisão confirmada com o Lucas:** sem backend ainda (Fase 7), o
submit válido só intercepta o evento (`preventDefault`) e não faz mais
nada — sem mensagem de sucesso falsa. Primeiros Client Components do
projeto — TDD completo de verdade (red confirmado antes de cada
implementação, não a exceção de conteúdo estático das sub-fases
anteriores). Correção pós-revisão: campo "Assunto" não vinha mais com
nenhuma opção pré-selecionada (tinha "Venda Casada de Seguro" por
engano) e a lista suspensa nativa renderizava texto claro sobre fundo
branco do navegador (achado real, corrigido com `bg-navy` explícito em
cada `<option>`).

**Fase 4.5 — Páginas dedicadas (`/areas-de-atuacao`, `/sobre`,
`/contato`):** reaproveitam o conteúdo já aprovado da Home (decisão
confirmada: sem copy jurídica nova). Refactor: `AreasAtuacao`/`Sobre`
divididos em conteúdo puro (`*Content`, prop `headingLevel`) + wrapper
da Home, mesmo padrão que `FaqContato`/`Faq`/`ContatoForm` já usavam.
Navegação inteira (Header, Footer, drawer mobile, CTA do Hero) migrada
de âncora pra rota real. 2 achados reais de acessibilidade via
`jest-axe`: heading pulando de `<h1>` pra `<h3>` sem `<h2>` no meio
(corrigido derivando o nível do `CardTitle` do `headingLevel`), e um
`<h2>` do FAQ aparecendo antes do `<h1>` da página na ordem do DOM
(corrigido invertendo a ordem das colunas). **Correção pós-revisão:**
"Dúvidas" e "Contato" no nav levavam pro mesmo lugar — unificados num
único item, "FAQ/Contato", liberando um slot no menu pra um assunto
futuro (ex: blog).

**Correções pontuais depois da Fase 4 fechada:** logo do Header tinha
`href="#"` desde a Fase 3 (inofensivo no site single-page antigo,
quebrado agora com páginas reais) — corrigido pra `<Link href="/">`.
Retrato do Hero ajustado em 2 rodadas rápidas (proporção da coluna de
imagem, depois `padding-bottom` do Hero reduzido) pra ficar numa altura
mais próxima do bloco de texto — ajustes cosméticos feitos sem a
bateria completa de testes/lint, a pedido explícito do Lucas (ritmo
salvo em memória pra próximas sessões: `feedback_pace-small-tweaks`).

### Testes criados (e status)

**200/200 testes passando**, `jest-axe` sem violações em nenhuma
página/componente, `tsc`/`lint` limpos. TDD completo (red/green real)
em `Faq` e `ContatoForm` (Fase 4.4, primeiros Client Components);
exceção de conteúdo estático (snapshot + `jest-axe`, sem ciclo
red/green formal) nas demais seções, mesmo critério já documentado
desde o Hero.

### Decisões tomadas e por quê

Todas documentadas em detalhe nas specs de cada sub-fase
(`docs/specs/fase4-2-areas-atuacao.md` até `fase4-5-paginas-dedicadas.md`,
cada uma com seções de "ajuste pós-revisão visual" registrando as
rodadas de correção). Resumo das decisões mais estruturais:
- Grid estático em vez de carrossel (Áreas de Atuação) — menos TDD,
  ritmo mais rápido.
- Formulário completo com validação real, mas sem envio de fato até a
  Fase 7 — decisão explícita do Lucas contra a sugestão inicial (que
  era redirecionar pro WhatsApp com os dados pré-preenchidos).
- Navegação migrada de âncora pra rota real, e "Dúvidas"/"Contato"
  unificados — reduz de 4 pra 3 itens de nav, com um slot livre pro
  futuro.

### Learning System e LinkedIn Workflow

Não avaliados nesta sessão — ritmo acelerado do dia (decisão do Lucas
logo no início, "vamos acelerar"), sem pausa dedicada pra essa
avaliação entre os checkpoints. Retomar a avaliação normal nas próximas
sessões.

### `docs/roadmap.md` e READMEs atualizados

- Fase 4 marcada `✅ Concluída` na tabela de status e na seção
  detalhada, com "Entregue" resumindo o que cada sub-fase contribuiu.
- `README.md`/`README.pt-br.md`, seção "Current status"/"Estado atual",
  atualizados (estavam desatualizados desde a Fase 3 — ainda diziam
  "Fases 4-10 not started" e "homepage renders a placeholder").

### Próximo passo imediato

Fase 4 encerrada. Conforme o plano do Lucas pro dia, o próximo bloco
(**Fase 5 — banco de dados do CRM no Supabase**) é uma **sessão nova e
separada** — não uma continuação desta. Ainda não tem spec; a próxima
sessão precisa definir o escopo real em conversa antes de qualquer
código (ver prompt de retomada no topo deste arquivo).

### Links

- Specs da Fase 4: `docs/specs/fase4-2-areas-atuacao.md`,
  `fase4-3-sobre.md`, `fase4-4-faq-contato.md`,
  `fase4-5-paginas-dedicadas.md`
- Roadmap master: [docs/roadmap.md](../roadmap.md)
- Padrão de processo: [docs/padrao-desenvolvimento.md](../padrao-desenvolvimento.md)
- Preview no ar: https://helio-advocacia-digital.vercel.app
