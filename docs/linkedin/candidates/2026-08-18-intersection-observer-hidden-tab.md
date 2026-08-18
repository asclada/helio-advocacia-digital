# O "bug" que só existia porque a aba estava em segundo plano

- **Data:** 2026-08-18
- **Categoria:** Problem → Solution
- **Status:** Captured
- **Fase do projeto (se aplicável):** Fase 3 — Header, Nav e Footer (checkpoint do Header — scroll-spy do nav)

## Resumo do acontecimento

O link ativo do nav (destacar em dourado a seção visível no scroll) usa
`IntersectionObserver`, testado com um mock em Vitest — os testes
passavam. Na revisão manual no navegador (automação via extensão Chrome),
o comportamento simplesmente não aparecia: nenhum link ficava ativo,
mesmo com seções reais injetadas na página e o scroll sendo movido de
verdade via JavaScript.

A investigação eliminou hipóteses na ordem errada primeiro (timing de
render, ordem de execução do `useEffect`, se os elementos existiam no DOM
no momento certo) até chegar num teste isolado: instanciar um
`IntersectionObserver` puro, direto no console da página, observando um
elemento visível — e nenhum callback disparava, nem o inicial (que a
spec do browser garante disparar sempre). Isso apontou pra fora do
código: `document.hidden` estava `true` e `document.hasFocus()` `false`
— a aba controlada pela automação roda em segundo plano do ponto de vista
do Chrome, e o browser suspende `IntersectionObserver` (entre outras APIs
ligadas a render) em abas assim, como otimização de performance.

## O que foi aprendido

Nem todo comportamento que "não funciona" na revisão manual é bug de
código — o ambiente de teste em si pode ter uma limitação que imita
perfeitamente um bug real. A forma de desambiguar foi isolar a menor
reprodução possível (um `IntersectionObserver` "cru", sem nenhum código
da aplicação envolvido) antes de continuar desconfiando do próprio hook.
Também reforçou por que os testes automatizados (que usam um mock de
`IntersectionObserver`, não a API real do browser) são, nesse caso
específico, uma fonte de confiança mais forte que a revisão manual no
navegador.

## Evidência

- Sequência de chamadas de investigação da sessão (checar
  `getBoundingClientRect`, injetar `IntersectionObserver` puro no
  console, checar `document.hidden`/`document.hasFocus()`).
- 10 testes de `use-active-section.test.ts` (com mock) permanecem verdes
  durante todo o episódio — nunca precisaram de correção.
- Commit: `f16baef` — feat(layout): implementa Header sticky com nav por
  âncora e drawer mobile.

## Fonte / rastreabilidade

- Implementação: `src/hooks/use-active-section.ts`,
  `src/hooks/use-active-section.test.ts`
- Mock usado nos testes: `src/test/intersection-observer-mock.ts`
- Commit: `f16baef`

## Por que isso é relevante

É uma história de debugging real: descartar a hipótese mais óbvia (o
código está errado) só depois de isolar a causa numa reprodução mínima
fora da aplicação. Também ilustra um limite pouco falado de automação de
browser para QA visual (abas em segundo plano não são um ambiente 100%
equivalente a uso real).

## Público / ângulo possível

Outro dev iniciante aprendendo a isolar causa raiz com reprodução mínima
antes de "corrigir" o próprio código; recrutador técnico observando
processo de debugging metódico, não só o resultado final funcionando.

## Observações de privacidade

Nenhum dado sensível envolvido — é sobre uma característica de
performance do próprio Chrome e uma API de browser genérica
(`IntersectionObserver`), sem menção a clientes reais ou dados internos
do escritório.
