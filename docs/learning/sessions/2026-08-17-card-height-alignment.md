# CSS Grid stretch + mt-auto para alinhamento de rodapé em cards — 2026-08-17

## Contexto

Durante a revisão visual do componente `Card` (Fase 2 — Componentes de UI
Base), montado num grid de 2 colunas com os dois casos de uso reais da spec
(um card com um parágrafo extra de conteúdo, outro com badges), o Lucas
percebeu que os botões "Saiba mais" de cada card apareciam em alturas
diferentes.

## O que foi aprendido

- Comportamento **padrão** do CSS Grid: `align-items: stretch` faz cada
  item de uma linha do grid ocupar a altura total daquela linha (definida
  pelo item mais alto) — sem precisar ser declarado explicitamente, é o
  valor default.
- Padrão `mt-auto` dentro de um container `flex flex-col`: empurra um
  elemento (o footer) para o fim do espaço vertical disponível, absorvendo
  qualquer sobra.
- A combinação dos dois (`Card` com `h-full flex flex-col` + `CardFooter`
  com `mt-auto`) resolve o alinhamento de rodapés entre cards de conteúdo
  desigual — mas só **dentro da mesma linha do grid**: cards em linhas
  diferentes não são forçados a ter a mesma altura entre si.

## O que o Lucas consegue explicar

Diagnosticou corretamente, sem ajuda, a causa raiz do problema ("`Card` é
só `flex flex-col` sem altura definida, então cada subcomponente ocupa
exatamente o espaço do seu próprio conteúdo — o `CardFooter` cai onde o
conteúdo termina, sem noção da altura dos cards vizinhos") e propôs a
correção técnica certa antes de qualquer sugestão da IA (`h-full` no
`Card`, `mt-auto` no `CardFooter`, citando explicitamente a dependência do
`items-stretch` padrão do grid). Na sequência, testou o próprio
entendimento com uma pergunta de caso de borda (cards com 7 linhas vs. 2
linhas de texto) antes de aceitar a explicação como correta.

## O que ainda não entende

Não foi testado ainda: comportamento em cenários fora do CSS Grid puro (ex:
dentro de um flex container sem `items-stretch` explícito, ou com
`grid-auto-rows` customizado) — não surgiu na sessão, fica como lacuna não
verificada.

## Evidência prática

Diagnóstico e proposta de correção escritos pelo próprio Lucas (mensagem da
sessão, antes de qualquer implementação da correção); pergunta de
verificação de caso de borda feita antes de aceitar a explicação dada.

## Nível de domínio atual

CSS Grid `align-items: stretch` + padrão `mt-auto` para rodapé fixo em
card: **Consigo raciocinar** — diagnosticou um bug real observando
comportamento visual, sem que a causa estivesse documentada em lugar
nenhum do projeto, e verificou a solução com um caso de borda próprio antes
de aceitá-la.

## Próximo passo

Aplicar o mesmo raciocínio (comportamento de stretch/alinhamento) num
cenário de grid com linhas incompletas (ex: 3 cards num grid de 2 colunas,
onde a última linha tem só 1 item) para confirmar que o entendimento
generaliza para esse caso também.
