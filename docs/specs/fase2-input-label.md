# Spec — Fase 2: Input + Label

Status: em planejamento
Depende de: `docs/specs/fase2-componentes-ui-base.md` (visão geral da Fase 2)
Referência de handoff: docs/handoffs/2026-08-17-fase2-card.md

## Objetivo

Fornecer os componentes de campo de formulário — label, input de texto,
texto de apoio e mensagem de erro — usados no formulário de contato. É o
componente mais complexo da Fase 2: precisa de validação, estados de erro
visíveis e acessibilidade de formulário real (não só visual), diferente dos
quatro componentes anteriores, que não lidam com entrada de dados do
usuário.

## Casos de uso reais no site

Formulário de contato (Fase 4, ainda não montado — os casos abaixo vêm da
spec geral da Fase 2, não de uma página já existente):

- **Nome completo** — campo de texto obrigatório. Erro real: campo vazio
  enviado (`valueMissing`).
- **E-mail** — campo de texto obrigatório com formato validado
  (`type="email"`). Dois erros reais possíveis: campo vazio
  (`valueMissing`) e formato inválido (`typeMismatch`).
- **Telefone** — campo de texto, mesma estrutura do e-mail, sem validação
  de formato nesta spec (fora de escopo — ver seção final).

O campo **Mensagem** (provavelmente `<textarea>`, não `<input>`) fica fora
do escopo desta spec — ver "Fora de escopo".

## Decisões de design

### Base técnica (opções apresentadas e decididas em sessão)

Duas opções foram avaliadas: montar `Input`/`Label` à mão (`<label htmlFor>`
+ `<input>`, com `id`, `aria-invalid` e `aria-describedby` calculados e
testados manualmente neste componente) ou usar o primitivo
`@base-ui/react/field` (mesmo fornecedor já adotado pelo `Button`, que usa
`@base-ui/react/button` desde a Fase 1). **Decidido: Base UI Field.**

**Por quê:** `Field.Root`/`Field.Label`/`Field.Description`/`Field.Error`
resolvem a fiação de acessibilidade de formulário automaticamente — geram
`id`s únicos, associam `Label` ao `Input` (testável via `getByLabelText`,
sem precisar declarar `htmlFor` manualmente), calculam `aria-invalid` a
partir do `ValidityState` nativo do HTML, e montam `aria-describedby`
apontando para a descrição/erro visíveis. Essa lógica já é testada pela
própria Base UI — reimplementá-la à mão neste componente seria pagar duas
vezes pelo mesmo problema (escrever e depois testar uma fiação de
acessibilidade que já existe, pronta, na mesma família de primitiva que o
projeto já adotou). Confirmado, antes de decidir, que isso **não reduz
liberdade de estilização**: Base UI é headless (não define nenhuma
aparência própria) — cada parte aceita `className` do mesmo jeito que o
`Button` já aceita hoje, incluindo `className` como função do estado
(`(state) => ...`), o que dá até mais controle do que o padrão atual do
`Button` (que depende do seletor CSS `aria-invalid:`).

### Estrutura da API (mesmo padrão de composição do Card)

| Componente | Base UI por baixo | Elemento | Arquivo |
|---|---|---|---|
| `Field` | `Field.Root` | `<div>` | `src/components/ui/field.tsx` |
| `FieldLabel` | `Field.Label` | `<label>` | `src/components/ui/field.tsx` |
| `FieldDescription` | `Field.Description` | `<p>` | `src/components/ui/field.tsx` |
| `FieldError` | `Field.Error` | `<div>` | `src/components/ui/field.tsx` |
| `Input` | `@base-ui/react/input` `Input` | `<input>` | `src/components/ui/input.tsx` |

**Por que dois arquivos, não um só:** mesmo raciocínio já usado para
separar `Container`/`Section` em dois arquivos dentro do mesmo checkpoint
do roadmap — `Input` é um primitivo standalone (reutilizável fora de um
`Field`, no futuro, se surgir um caso de uso real), enquanto
`FieldLabel`/`FieldDescription`/`FieldError` só existem em função de um
`Field`. A divisão espelha a divisão dos pacotes Base UI por baixo
(`@base-ui/react/field` vs. `@base-ui/react/input`).

**Nomenclatura com prefixo `Field*`** (`FieldLabel`, `FieldDescription`,
`FieldError`) em vez de `Label`/`Description`/`Error` soltos — mesmo
raciocínio já usado no `Card` (`CardTitle`, `CardDescription`): deixa
explícito, no nome do componente, que a peça só faz sentido dentro de um
`Field`, e evita colisão de nome genérico (`Error`, `Description`) que um
dia outro componente da Fase 2+ possa querer usar com outro significado.

### Estados visuais do `Input`

| Estado | Classes | Origem |
|---|---|---|
| Repouso | `border-muted-foreground` | ver "Contraste" abaixo — `border-input`/`border-border` (mesmo token do `Card`) falha o contraste mínimo aqui |
| Foco (teclado) | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` | idêntico ao `Button` — mesmo token `ring` (`gold`), mesma decisão de foco visível já validada |
| Inválido | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` | idêntico ao `Button` — `aria-invalid` já é calculado automaticamente pelo `Field` a partir do `ValidityState` |
| Desabilitado | `disabled:pointer-events-none disabled:opacity-50` | idêntico ao `Button` |

Dimensão: `h-9` (mais alto que o `h-8` do `Button` — um campo de texto
precisa de mais espaço vertical pra digitação confortável que um botão),
`w-full` (diferente do `Button`, que é `inline-flex` do tamanho do
conteúdo — um campo de formulário ocupa a largura do contêiner pai por
padrão; isso é esperado de todo caso de uso real, nenhum formulário da
Fase 4 usa um input de largura fixa curta).

### Cor do texto de erro (`FieldError`) — opções apresentadas e decididas em sessão

Três opções foram avaliadas para o texto da mensagem de erro:
`text-destructive` (aceitando um contraste abaixo do AA — ver "Contraste"),
um novo token de vermelho mais claro (decisão de design system, fora do
escopo desta spec de componente), ou `text-foreground` (mesma cor do texto
normal). **Decidido: `text-foreground`, com `font-medium`** (peso, não cor,
diferencia o erro do `FieldDescription` — mesmo raciocínio já usado no
`CardTitle`, que se diferencia por tipografia/peso em vez de cor reservada).

**Por quê:** `text-destructive` mede **3.93–4.23:1** de contraste contra os
fundos do site (calculado nesta sessão — ver "Contraste"), abaixo dos
**4.5:1** exigidos pelo WCAG AA pra texto de tamanho normal
(`FieldError` usa `text-sm`, que não se qualifica como "texto grande" nem
em negrito). Usar `text-foreground` garante ~18:1 de contraste — sobra
enorme — e desloca a comunicação visual do erro para a borda/`ring`
vermelhos do `Input` (que já mudam para `border-destructive`/
`ring-destructive` no estado inválido, e esses **sim** passam no requisito
de 3:1 aplicável a bordas de componente interativo). Vantagem adicional:
o WCAG também recomenda (critério 1.4.1) nunca depender só de cor pra
comunicar algo crítico — com essa decisão, o erro é comunicado por três
sinais redundantes (borda vermelha do campo, texto da mensagem, e posição
abaixo do campo específico), nenhum deles dependente de um contraste
limítrofe.

### Espaçamento

`Field` usa `flex flex-col gap-1.5` (mesmo espaçamento vertical apertado já
usado no `CardHeader`, apropriado para label + campo + apoio, que formam um
bloco visualmente coeso).

## API

| Componente | Elemento | Props próprias | Descrição |
|---|---|---|---|
| `Field` | `<div>` | — (repassa props do `Field.Root` da Base UI: `name`, `validate`, `disabled`, `invalid` controlado, etc.) | Agrupa label + input + apoio + erro de um campo. `data-slot="field"`. |
| `FieldLabel` | `<label>` | — | Associada automaticamente ao `Input` do mesmo `Field` (sem `htmlFor` manual). `data-slot="field-label"`. |
| `Input` | `<input>` | — (repassa props nativas: `type`, `placeholder`, `required`, `name`, etc.) | Campo de texto. Funciona dentro ou fora de um `Field`. `data-slot="input"`. |
| `FieldDescription` | `<p>` | — | Texto de apoio, sempre visível. `data-slot="field-description"`. |
| `FieldError` | `<div>` | `match` (herdado do `Field.Error` da Base UI: `"valueMissing"`, `"typeMismatch"`, `true`, etc.) | Mensagem de erro, visível apenas quando o `match` correspondente é verdadeiro. `data-slot="field-error"`. |

Todos os componentes aceitam `className` (mesclado via `cn()`) e repassam
demais props nativas/da Base UI do elemento correspondente. Nenhum tem
prop `variant` própria — mesmo raciocínio já usado no `Badge`/`Card`.

## Contraste (verificado com script, não estimado)

Mesma fórmula de luminância relativa do WCAG 2.1 já usada nas specs do
`Button`/`Card`, calculada via script nesta sessão (conversão OKLCH→sRGB
para o token `destructive`, que é definido em OKLCH em `globals.css`):

| Combinação | Contraste | Limite aplicável | Resultado |
|---|---|---|---|
| `text-foreground` (`#f3f4f6`) / `bg-background` (`#020617`) | 18.33:1 | 4.5:1 (texto normal) | passa com folga larga |
| `text-muted-foreground` / `bg-background` — placeholder, `FieldDescription` | 7.95:1 | 4.5:1 (texto normal) | passa com folga |
| `border-muted-foreground` / `bg-background` — borda do `Input` em repouso | 7.95:1 | 3:1 (componente interativo, WCAG 1.4.11) | passa com folga larga |
| `border-input`/`border-border` (`navy-line`) / `bg-background` — **não usado**, ver decisão acima | 1.38:1 | 3:1 (componente interativo, WCAG 1.4.11) | **falharia** — por isso não é usado aqui, diferente do `Card` |
| `border-destructive`/`ring-destructive` (`#e7000b`) / `bg-background` — borda do `Input` inválido | 4.23:1 | 3:1 (componente interativo, WCAG 1.4.11) | passa |
| `text-destructive` / `bg-background` — **não usado no `FieldError`**, ver decisão acima | 4.23:1 (3.93:1 contra `bg-card`) | 4.5:1 (texto normal) | **falharia** — por isso `FieldError` usa `text-foreground` |

**Diferença importante em relação ao `Card`:** o `Card` tinha justificado
usar `border-border` (`navy-line`, ~1.3:1) porque o WCAG 1.4.11 só exige
3:1 pra **componentes interativos**, e `Card` não é interativo. `Input` é
um componente interativo — por isso o mesmo token que era aceitável no
`Card` é uma falha real de acessibilidade aqui, e a borda de repouso usa
`border-muted-foreground` em vez disso.

## Critérios de aceite (testáveis)

- [ ] `Field` renderiza `children` como `<div data-slot="field">` por padrão
- [ ] `FieldLabel` associa automaticamente ao `Input` do mesmo `Field` —
      testável via `screen.getByLabelText(...)`, sem `htmlFor`/`id`
      declarados manualmente no teste
- [ ] `Input` renderiza como `<input>`, aceita `type`/`placeholder`/demais
      props nativas, aplica classes fixas de estado (repouso, foco,
      inválido, desabilitado)
- [ ] `Input` aplica `w-full` e `h-9`
- [ ] Estado de foco visível via teclado (`focus-visible:ring`) presente
- [ ] Campo obrigatório vazio, ao ser validado (`Field` com `validationMode`
      padrão via submit, ou `actionsRef.validate()`), fica com
      `aria-invalid="true"` no `Input` e exibe o `FieldError` com
      `match="valueMissing"` correspondente
- [ ] Campo de e-mail com valor de formato inválido, ao ser validado, exibe
      o `FieldError` com `match="typeMismatch"` correspondente
- [ ] `FieldError` não aparece antes de o campo ser validado (não mostra
      erro prematuro num campo ainda não tocado)
- [ ] `FieldDescription` renderiza texto de apoio com `text-muted-foreground`,
      visível independente do estado de validação
- [ ] `FieldError` renderiza com `text-foreground` (não `text-destructive`
      — ver "Cor do texto de erro" acima), testável via classe aplicada
- [ ] Composição completa (`Field` > `FieldLabel` + `Input` +
      `FieldDescription` + `FieldError`) renderiza a árvore esperada, nos
      estados válido e inválido
- [ ] `jest-axe` sem violações na composição completa, nos estados válido e
      inválido
- [ ] Nenhuma cor hardcoded fora dos tokens semânticos documentados em
      `docs/design-tokens.md`
- [ ] Cada componente mescla `className` extra via `cn()` sem remover as
      classes base
- [ ] Snapshot test da composição completa em cada estado (padrão, com erro)

## Fora de escopo / não fazer nesta spec

- **`Textarea`** (campo "Mensagem" do formulário de contato) — elemento
  HTML diferente (`<textarea>`, não `<input>`), fora do escopo literal
  "Input + Label" da spec geral da Fase 2. Se necessário na Fase 4, é
  extensão própria, reaproveitando o mesmo `Field`/`FieldLabel`/
  `FieldDescription`/`FieldError` já prontos aqui (só o `Input` muda de
  elemento).
- **Validação de formato do telefone** — nenhuma máscara ou regex de
  telefone brasileiro confirmada como requisito ainda; o campo usa a mesma
  estrutura do e-mail, sem validação de formato própria por enquanto.
- **Submissão do formulário / integração com o proxy n8n** — já listado
  como fora de escopo na spec geral da Fase 2; isso é lógica de página
  (Fase 4) ou de integração (fases futuras), não do componente de campo.
- **Indicador visual de campo obrigatório** (ex: asterisco no
  `FieldLabel`) — nenhum caso de uso confirmado pediu isso; se surgir, é
  extensão futura, mesmo raciocínio já usado pra não adicionar afordances
  não pedidas no `Button`/`Badge`/`Card`.
- **Ícone de erro/sucesso dentro do `Input`** — nenhum caso de uso
  confirmado; a comunicação do estado de erro já é redundante o bastante
  (borda + `ring` + mensagem de texto) sem precisar de um ícone extra.
