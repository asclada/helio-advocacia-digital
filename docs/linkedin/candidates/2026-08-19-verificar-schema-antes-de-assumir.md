# Conferir o código real evitou duas migrações desnecessárias na mesma sessão

- **Data:** 2026-08-19
- **Categoria:** Technical Decision
- **Status:** Captured
- **Fase do projeto (se aplicável):** Fase 6.1 — Arquivamento de leads (CRM)

## Resumo do acontecimento

Ao planejar a Fase 6.1 do CRM (arquivar um lead), a spec inicial partiu
da memória da sessão anterior: "precisa de um novo valor de status e
uma nova política de RLS de `UPDATE`". Antes de escrever a spec de
verdade, a migration real da Fase 5 foi relida — e os dois pressupostos
já estavam resolvidos: o valor de status já existia no `check
constraint`, e a política de RLS já cobria `UPDATE` (era uma política
única "para tudo", não uma por operação). Resultado: a fase inteira
ficou sem nenhuma migration de schema.

Minutos depois, na mesma sessão, o mesmo padrão se repetiu: a ideia era
que o banco do CRM "ainda não tinha" os campos completos da triagem que
hoje chegam por WhatsApp. Comparar a estrutura real da tabela com uma
referência da triagem completa mostrou que todos os campos já existiam
— a única coisa genuinamente nova era um campo de resumo que nunca
tinha sido cogitado antes.

## O que foi aprendido

A mesma lição apareceu duas vezes na mesma sessão: memória de conversa
anterior (ou suposição razoável sobre o que "deveria" faltar) não é
substituto de reler o estado real do código antes de planejar uma
mudança. Nos dois casos, o trabalho puxado por essa checagem foi menor
do que o presumido — não porque a suposição fosse absurda, mas porque
ela nunca tinha sido verificada contra a fonte de verdade.

## Evidência

- `docs/specs/fase6.1-arquivamento-leads.md` (repo `helio-advocacia-crm`),
  seção 2.1, documenta o achado do schema.
- `docs/handoffs/2026-08-19-fase6.1-arquivamento-leads.md` (mesmo repo)
  registra o segundo achado (schema da triagem completa já coberto).

## Por que isso é relevante

É um hábito técnico simples, mas fácil de pular sob pressão de "ir
rápido" — e o próprio pedido de acelerar essa fase é o que tornaria
mais tentador pular a checagem. Serve como contraponto prático: checar
antes de implementar não é burocracia, é o que evitou trabalho real
(duas migrações que não precisavam existir).

## Público / ângulo possível

Outro dev iniciante ou júnior — reforça um hábito concreto (reler o
estado real antes de assumir escopo) em vez de um conselho abstrato
("sempre verifique suas suposições").

## Observações de privacidade

Sem dados sensíveis. Não há menção a dados reais de cliente, números de
telefone, nomes de leads ou qualquer conteúdo do print de referência
usado durante a sessão — só a estrutura de schema (nomes de colunas já
públicos no próprio repositório) e o raciocínio técnico.
