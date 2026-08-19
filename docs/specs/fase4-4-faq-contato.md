# Fase 4.4 — Dúvidas Frequentes + Contato (resumo na Home)

**Status:** Implementado, testado (TDD completo — `Faq`/`ContatoForm`) e
verificado no browser. Pendente de revisão visual do Lucas.
**Depende de:** Fase 2 (`Section`, `Field`/`FieldLabel`/`FieldError`, `Input`,
`Button`), Fase 3 (anchors `faq` e `contato` já reservados em
`NAV_ANCHOR_IDS`), Fase 4.2/4.3 (`SectionHeading`, padrão de hairline
entre seções)
**Fonte de conteúdo:** copy e estilo extraídos do site atual
(heliokleisonadvocacia.com.br), confirmados nesta sessão via inspeção
direta do CSS computado (mesmo método usado nas Fases 4.2/4.3).

---

## 1. Contexto e escopo

O roadmap master listava a Fase 4.4 só como "CTA/Contato". Ao pesquisar o
site atual para seguir o mesmo padrão visual (pedido explícito do Lucas
ao aprovar a Fase 4.3), ficou claro que, na estrutura real do site, FAQ e
Contato são **uma única seção de 2 colunas** (FAQ à esquerda, formulário
de contato à direita) — não duas seções separadas. Isso também bate com
um anchor que já estava reservado desde a Fase 3 e nunca tinha ganhado
checkpoint próprio no roadmap: `faq` (rótulo "Dúvidas"/"Dúvidas
Frequentes" no Header/Footer). Esta sub-fase absorve os dois, fechando os
4 anchors do nav (`atuacao`, `sobre`, `faq`, `contato`) de uma vez.

**Decisão confirmada com o Lucas:** o formulário de contato será
**completo e funcional na validação**, mesmo sem backend ainda (a
integração com n8n é a Fase 7). Ao validar os campos e clicar em "Enviar
mensagem", **nada é enviado de fato** — se os campos forem válidos, o
`submit` só é interceptado (`preventDefault`) e nada mais acontece
(decisão explícita do Lucas: nenhuma mensagem de sucesso falsa, nenhum
atalho via WhatsApp). Fica óbvio, para quem revisar, que a integração
real é trabalho futuro (Fase 7).

**Diferente das sub-fases anteriores, esta introduz os primeiros Client
Components do projeto** (`"use client"`) — o accordion do FAQ tem estado
de item aberto/fechado, e o formulário tem estado de validação. Hero,
`AreasAtuacao` e `Sobre` são Server Components (sem interação real).
Consequência direta: **esta sub-fase não se qualifica para a exceção de
TDD** que as anteriores usaram — cai na categoria obrigatória da seção 3
do `padrao-desenvolvimento.md` ("toda lógica de negócio: formulários,
validações" e "todo componente de UI reutilizável"). Ciclo red/green
completo para o `Accordion` (novo componente de `ui/`) e para a validação
do formulário.

---

## 2. Descobertas técnicas — reaproveitando primitivas do Base UI em vez de construir do zero

- **Accordion:** `@base-ui/react/accordion` já existe como dependência
  (`@base-ui/react`, já usado por `Button`/`Input`/`Field`/`NavDrawer`) e
  cobre exatamente este caso — `Accordion.Root` (por padrão, só um item
  aberto por vez — `multiple=false` é o default, igual ao comportamento
  do site atual) > `Accordion.Item` > `Accordion.Header` > `Accordion.Trigger`
  + `Accordion.Panel`. **Não precisa de nenhum estado customizado** — o
  ícone "+"/"×" é só um ícone `Plus` (`lucide-react`) rotacionado 45°
  via `group-data-[panel-open]:rotate-45` (truque documentado no próprio
  Base UI), sem trocar de ícone.
- **Formulário/validação:** `@base-ui/react/form` (`Form`) +
  `Field.Root`/`Field.Error` (já usado desde a Fase 2, `ui/field.tsx`) já
  fazem toda a validação via **atributos HTML nativos** (`required`,
  `type="email"`, `minLength`) — o navegador/Base UI bloqueia o submit e
  exibe `Field.Error` automaticamente se algum campo for inválido; **não
  precisa de nenhuma função de validação customizada** (`onChange`
  handlers, regex manual, `useState` de erro por campo). Reduz bastante o
  risco desta sub-fase em relação ao que parecia inicialmente.
- **Select do "Assunto":** Base UI tem um primitivo `select`, mas é um
  listbox custom completo (trigger/popup/posicionamento) — **decisão:
  não usar**. O `<select>` nativo já resolve um dropdown estático de 4
  opções com acessibilidade de teclado de graça, e é exatamente o que o
  site atual usa. `Select` novo em `ui/` é um wrapper estilizado do
  `<select>` nativo, não do primitivo Base UI.
- **Textarea:** Base UI não tem primitivo de textarea. `Textarea` novo em
  `ui/` é um `<textarea>` nativo estilizado (mesmas classes-base do
  `Input`), integrado ao `Field` via `Field.Control render={<Textarea />}`
  (mesmo mecanismo de troca de elemento que `CardTitle`/`Section` já usam
  com a prop `as`, mas aqui é a API `render` do próprio Base UI).

---

## 3. Conteúdo (copy — extraído do site atual, não reescrito)

**FAQ (coluna esquerda):**

| Pergunta | Resposta |
|---|---|
| Posso cancelar um seguro que veio embutido no meu empréstimo sem que eu tenha autorizado? | Se o seguro foi imposto como condição para a liberação do crédito - ou seja, se você não teve a opção real de recusar - isso configura venda casada, prática vedada pelo Código de Defesa do Consumidor (art. 39, I). Nesses casos, é possível anular a cobrança e recuperar os valores pagos indevidamente. |
| Descobri um empréstimo em meu nome que nunca contratei. O que fazer? | Reúna os extratos e comprovantes que mostram a cobrança e procure orientação jurídica o quanto antes. É possível contestar a dívida, incluindo casos de idade adulterada no contrato, e reverter os descontos indevidos. |
| Um consignado foi liberado no benefício do INSS de um dependente menor de idade. Isso é permitido? | Somente com autorização judicial. Um representante legal não pode contratar crédito consignado em nome de menor de idade por conta própria, mesmo que tenha assinado o contrato pessoalmente. É possível bloquear os descontos e reaver os valores cobrados irregularmente. |
| O atendimento online tem a mesma validade jurídica do presencial? | Sim. Procurações, documentos e reuniões podem ser conduzidos digitalmente com total validade legal, permitindo o acompanhamento completo do caso de qualquer lugar do Brasil. |

Eyebrow: "Dúvidas Frequentes" · Título: "Perguntas comuns"

**Contato (coluna direita):**

Eyebrow: "Contato" · Título: "Fale com o escritório"

| Campo | Tipo | Placeholder | Validação |
|---|---|---|---|
| Nome completo | texto | "Seu nome" | `required`, `minLength={2}` |
| WhatsApp | texto | "(84) 90000-0000" | `required`, `minLength={8}` |
| E-mail | `type="email"` | "voce@email.com" | `required` (validação de formato nativa do `type="email"`) |
| Assunto | `<select>` | — (já vem com a 1ª opção selecionada) | sempre válido (sem opção em branco) |
| Mensagem | `<textarea>` | "Conte brevemente sobre o seu caso" | `required`, `minLength={10}` |

Opções do "Assunto" (mesma ordem do site atual): "Venda Casada de
Seguro", "Empréstimo Fraudado", "Consignado a Menor de Idade (INSS)",
"Outro assunto".

Botão: "Enviar mensagem" (`Button` `variant="primary"`, já existente —
ver seção 5 sobre a decisão de não replicar o gradiente do site atual).
Nota de consentimento abaixo do botão: "Ao enviar, você concorda com o
contato do escritório para tratar da sua solicitação."

---

## 4. Estrutura visual e composição

- **Uma `Section`** com `id="faq"`, `className="scroll-mt-(--header-height) border-t border-foreground/5"`
  (mesmo padrão das Fases 4.2/4.3) — o anchor `#faq` aponta pro topo da
  seção inteira (comportamento correto: no mobile empilhado, é onde o
  bloco de perguntas começa).
- **Grid:** `grid grid-cols-1 gap-16 md:grid-cols-2` — diferente da Sobre
  (assimétrica), aqui é uma divisão igual (mesma proporção do site
  atual, `lg:grid-cols-2`, adaptada para `md:` como o resto do projeto).
- **Coluna 1 (FAQ):** `SectionHeading` (`align="left"`, eyebrow "Dúvidas
  Frequentes", título "Perguntas comuns") + `Accordion` com os 4 itens.
  **Sem a foto ilustrativa de pessoas conversando** que o site atual tem
  nesta coluna — nenhum asset disponível/tratado para isso, mesmo
  raciocínio já usado para não incluir ícones por área na Fase 4.2 (não
  inventar asset sem decisão explícita).
- **Coluna 2 (Contato):** um `<div id="contato" className="scroll-mt-(--header-height)">`
  **dentro** da coluna, como segundo alvo de anchor independente do
  `#faq` da seção — no mobile (colunas empilhadas), clicar em "Contato"
  no nav pula direto pro formulário, sem passar pelas 4 perguntas do
  FAQ; no desktop, os dois anchors levam pra mesma linha (colunas lado a
  lado), o que é o comportamento correto. Dentro: `SectionHeading`
  (`align="left"`, eyebrow "Contato", título "Fale com o escritório") +
  `ContatoForm`.
- **Cartão do formulário:** `rounded-2xl border border-border bg-card p-6 sm:p-8`
  (mesmo tratamento de superfície já usado no `Card`/selos da Sobre).
  Campos Nome/Mensagem em largura cheia; WhatsApp + E-mail lado a lado
  (`grid grid-cols-1 sm:grid-cols-2 gap-4`, mesmo breakpoint usado nos
  outros grids do projeto).

---

## 5. Componentes novos — o que vira primitiva em `ui/` e o que fica inline

**Vira primitiva reutilizável em `ui/`** (mesmo critério já usado pro
`Card`/`SectionHeading`: uso confirmado em mais de um lugar — aqui, o
segundo uso confirmado é a página dedicada `/contato` da Fase 4.5+, ainda
nesta sessão):

| Componente | Base | Observação |
|---|---|---|
| `Textarea` | `<textarea>` nativo | Mesmas classes-base do `Input` (`ui/input.tsx`), adaptadas para múltiplas linhas (`min-h-24`, sem `h-9` fixo). |
| `Select` | `<select>` nativo | Mesmas classes-base do `Input`. **Decisão:** não usa o primitivo `@base-ui/react/select` (seção 2) — API própria: `options: { label: string; value: string }[]`. |

**Fica inline no componente que usa** (mesmo precedente do `Dialog` no
`NavDrawer`, Fase 3 — `src/components/layout/nav-drawer.tsx`: compostos
do Base UI usados direto onde só há 1 caso de uso confirmado, sem virar
wrapper em `ui/`):

- **`Accordion`** (`@base-ui/react/accordion`) — só usado em `Faq`, sem
  segundo caso de uso confirmado. `Accordion.Root` (só 1 item aberto por
  vez, `multiple=false` é o default do Base UI, igual ao site atual) >
  `Accordion.Item` > `Accordion.Header` > `Accordion.Trigger` +
  `Accordion.Panel`. Ícone `Plus` (`lucide-react`) rotaciona 45° via
  `group-data-[panel-open]:rotate-45` — não troca de ícone, só rotaciona.
- **`Form`** (`@base-ui/react/form`) — só usado em `ContatoForm`, mesmo
  raciocínio.

**Botão de envio reaproveita o `Button` `variant="primary"` já existente**
(`ui/button.tsx`), não replica o gradiente diagonal do site atual
(`linear-gradient(110deg, gold → gold-light → gold-dark)`) — o projeto já
tem uma decisão de design travada pro botão primário (fundo sólido
`bg-primary`) desde a Fase 2, usada em todo o site até aqui (Hero,
Header). Trocar só neste botão quebraria a consistência que o resto do
projeto já construiu; manter é a mesma lógica já aplicada ao ícone do
selo de credencial na Sobre (Font Awesome → `lucide-react`, adaptado ao
vocabulário visual do projeto em vez de replicado pixel a pixel).

---

## 6. Arquitetura de arquivos

- `src/components/ui/textarea.tsx` + `.test.tsx` (novo)
- `src/components/ui/select.tsx` + `.test.tsx` (novo)
- `src/components/sections/faq-contato.tsx` (novo, Server Component —
  monta `Section`/grid/`SectionHeading`s, importa os dois Client
  Components abaixo)
- `src/components/sections/faq.tsx` (novo, `"use client"` — `Accordion`
  do Base UI usado direto, com os 4 itens fixos)
- `src/components/sections/contato-form.tsx` (novo, `"use client"` —
  `Form` do Base UI usado direto, com os 5 campos e o botão)
- `src/components/sections/faq.test.tsx`,
  `src/components/sections/contato-form.test.tsx`,
  `src/components/sections/faq-contato.test.tsx` (novos)
- `src/app/page.tsx` — passa a renderizar `<FaqContato />` logo após
  `<Sobre />`

---

## 7. Critérios de aceite (para orientar os testes)

**`Accordion` (TDD completo — componente de UI reutilizável, com estado):**
- [ ] Renderiza todos os itens fechados por padrão (painel não visível/
      `aria-expanded="false"`)
- [ ] Clicar num item abre o painel dele (`aria-expanded="true"`, texto
      da resposta acessível)
- [ ] Clicar num item aberto fecha ele de volta
- [ ] Abrir um item fecha o que estava aberto antes (só 1 por vez,
      comportamento default do Base UI, não `multiple`)
- [ ] Ícone reflete o estado (rotação no item aberto)
- [ ] Navegação por teclado funciona (Tab entre triggers, Enter/Space
      para abrir/fechar) — herdado do Base UI, teste confirma que não foi
      quebrado pela estilização
- [ ] `jest-axe` sem violações, com pelo menos um item aberto

**`ContatoForm` (TDD completo — lógica de negócio/validação):**
- [ ] Tentar enviar com campos obrigatórios vazios mostra as mensagens de
      erro correspondentes (`Field.Error`) e **não** dispara o `onSubmit`
      customizado (evento é bloqueado pela validação nativa)
- [ ] E-mail com formato inválido mostra erro e bloqueia o envio
- [ ] Preencher todos os campos corretamente e enviar chama o
      `onSubmit` (testável via `preventDefault` + um spy), sem nenhuma
      mensagem de sucesso ou navegação — nada visível muda além de o
      evento ser interceptado (decisão da seção 1)
- [ ] Campo "Assunto" tem as 4 opções corretas, primeira selecionada por
      padrão
- [ ] `jest-axe` sem violações

**`Faq`/`FaqContato` (composição):**
- [ ] `Faq` renderiza as 4 perguntas/respostas corretas (seção 3)
- [ ] `FaqContato` renderiza `SectionHeading`s corretos nas 2 colunas
- [ ] `Section` tem `id="faq"` e a coluna de contato tem `id="contato"`,
      ambos com `border-t`/`scroll-mt` corretos (seção 4)
- [ ] Grid é 1 coluna em mobile e 2 em `md:`
- [ ] `jest-axe` sem violações na composição completa

---

## 8. Fora de escopo desta sub-fase

- Envio real do formulário (Fase 7 — integração n8n).
- Imagem ilustrativa na coluna do FAQ (sem asset).
- Página dedicada `/contato` (Fase 4.5+).
- Qualquer persistência/log do que foi digitado no formulário.

---

## 9. Ajuste pós-revisão visual (rodada 1)

O Lucas pediu 2 correções no campo "Assunto":

1. **Nenhuma opção pré-selecionada** — a implementação original vinha
   com "Venda Casada de Seguro" já selecionada (primeira opção do
   array), então um lead que não mexesse no campo enviaria esse assunto
   por engano. Corrigido: `Select` ganhou um prop `placeholder` — quando
   informado, vira a 1ª `<option>` (desabilitada, `value=""`), sem
   nenhuma opção real pré-selecionada. Combinado com `required` no
   campo, a mesma validação nativa já usada nos outros campos (seção 2)
   passa a cobrir também o Assunto — **sem nenhuma lógica de validação
   nova**: um `<select required>` com a opção vazia selecionada já é
   `valueMissing` para o navegador, exatamente o mesmo mecanismo que já
   valida Nome/WhatsApp/E-mail/Mensagem. `FieldError` novo: "Selecione
   um assunto."
2. **Texto ilegível na lista suspensa (branco sobre branco)** — achado
   real, não hipotético: a lista de um `<select>` nativo é desenhada
   pelo navegador/SO fora da árvore de estilo normal da página, então
   ela não herdava o fundo escuro do tema — só a cor do texto (clara)
   chegava até lá, sobre o fundo branco padrão do navegador. Corrigido
   com `bg-navy` explícito em cada `<option>` (confirmado via
   `getComputedStyle` no browser real, não só no jsdom dos testes:
   `background-color: rgb(2, 6, 23)` = `#020617` = token `navy` em
   todas as options).

`Select` (`ui/select.tsx`) e `ContatoForm` (`sections/contato-form.tsx`)
atualizados; testes novos em ambos cobrindo o placeholder obrigatório e
o bloqueio de envio sem assunto selecionado.
