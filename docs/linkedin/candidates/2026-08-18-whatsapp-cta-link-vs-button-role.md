# Link ou botão? Um aviso do console que quase virou o bug errado

- **Data:** 2026-08-18
- **Categoria:** Problem → Solution
- **Status:** Captured
- **Fase do projeto (se aplicável):** Fase 3 — Header, Nav e Footer (checkpoint do Header/CTA de WhatsApp)

## Resumo do acontecimento

O CTA "Fale Conosco" foi construído reaproveitando o `Button` da Fase 2
(`render={<a href={waLink} />}`, o mesmo prop polimórfico já testado no
`Button` para trocar o elemento renderizado). Na revisão visual no
navegador, o overlay de erro do Next.js mostrou um aviso real do Base UI:
o componente esperava um `<button>` nativo porque `nativeButton` estava
`true` por padrão, e renderizar um `<a>` nesse estado "quebra a semântica
de botão, o que pode afetar formulários e acessibilidade" — a própria
lib sugeria `nativeButton={false}` como correção.

Aplicar essa correção "óbvia" quebrou 3 testes: o link deixou de ter
`role="link"` e passou a ter `role="button"`. Investigando o porquê, ficou
claro que `nativeButton={false}` é o Base UI compensando a perda da
semântica nativa de botão ao injetar `role="button"` — o que é exatamente
o comportamento errado aqui, porque o CTA é uma navegação real (abre o
WhatsApp em nova aba via `href`), não uma ação sem navegação. A correção
usada não foi a sugerida pelo aviso: em vez de `Button` com `render`, o
CTA passou a reaproveitar só `buttonVariants` (a função de estilo,
exportada do `Button`) num `<a>` nativo — que já tem a role de link
correta de graça, sem nenhum aviso.

## O que foi aprendido

Um aviso de dev tool aponta um problema real, mas a correção que ele
sugere nem sempre é a correção certa para aquele caso específico — vale a
pena entender o *porquê* do aviso (o que `nativeButton={false}` realmente
muda por baixo dos panos) antes de aplicá-lo, em vez de silenciar o
console e seguir. A distinção WAI-ARIA entre `link` (navegação) e
`button` (ação sem navegação) foi o critério que decidiu qual dos dois
caminhos era o correto.

## Evidência

- Aviso original do Base UI capturado na revisão visual (overlay de erro
  do Next.js, sessão do dia).
- 3 testes de `whatsapp-cta.test.tsx` quebrando com `nativeButton={false}`
  (role mudou de `link` pra `button`), depois voltando a passar com a
  solução final (`buttonVariants` + `<a>` nativo).
- Implementação final: `src/components/ui/whatsapp-cta.tsx` (comentário
  no código documenta o raciocínio).
- Commit: `f16baef` — feat(layout): implementa Header sticky com nav por
  âncora e drawer mobile.

## Fonte / rastreabilidade

- Implementação: `src/components/ui/whatsapp-cta.tsx`,
  `src/components/ui/whatsapp-cta.test.tsx`
- Commit: `f16baef`

## Por que isso é relevante

Mostra raciocínio sobre acessibilidade (ARIA) além de "os testes
passaram" — a decisão certa exigiu entender a diferença semântica entre
link e botão, não só reagir ao aviso do console. É um exemplo concreto de
não aceitar a primeira sugestão de uma ferramenta sem entender a causa.

## Público / ângulo possível

Outro dev iniciante aprendendo acessibilidade web (diferença real entre
`role="link"` e `role="button"`, e por que ela importa pra quem usa leitor
de tela); recrutador técnico observando raciocínio de acessibilidade
aplicado, não só "componente funciona".

## Observações de privacidade

Nenhum dado sensível envolvido — é sobre uma decisão técnica de
acessibilidade num componente de UI genérico (CTA de WhatsApp), sem
menção a clientes reais ou dados internos do escritório.
