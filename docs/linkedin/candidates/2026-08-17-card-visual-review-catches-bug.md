# Testes verdes não bastam: um bug de alinhamento que só apareceu na revisão visual

- **Data:** 2026-08-17
- **Categoria:** Problem → Solution
- **Status:** Captured
- **Fase do projeto (se aplicável):** Fase 2 — Componentes de UI Base (checkpoint do `Card`)

## Resumo do acontecimento

O componente `Card` foi implementado seguindo o ciclo SDD+TDD do projeto:
spec escrita, testes escritos primeiro (red), implementação até passar
(green) — 15 testes cobrindo renderização, composição, acessibilidade
(`jest-axe`) e snapshot, todos verdes. Só na revisão visual manual,
montando os dois casos de uso reais lado a lado num grid (um card com um
parágrafo extra de conteúdo, outro com badges), ficou evidente que os
botões "Saiba mais" de cada card apareciam em alturas diferentes — os
testes automatizados não detectaram isso porque cada um validava o `Card`
isoladamente, não a composição de vários cards juntos.

## O que foi aprendido

Testes automatizados garantem comportamento e contrato de um componente
isolado; não garantem composição visual correta quando vários componentes
do mesmo tipo aparecem juntos (ex: numa grid). A causa raiz — CSS Grid
`align-items: stretch` sendo o comportamento padrão, e a necessidade de
`h-full` no container + `mt-auto` no rodapé para aproveitar esse stretch —
foi diagnosticada pelo próprio Lucas durante a revisão, não pela suíte de
testes.

## Evidência

- Diagnóstico e proposta de correção escritos pelo Lucas antes de qualquer
  sugestão da IA (mensagem da sessão).
- [docs/learning/sessions/2026-08-17-card-height-alignment.md](../../learning/sessions/2026-08-17-card-height-alignment.md)
- `docs/specs/fase2-card.md`, seção "Altura consistente em grid (ajuste
  pós-revisão visual)".
- Implementação corrigida em `src/components/ui/card.tsx` (`h-full` no
  `Card`, `mt-auto` no `CardFooter`), com 2 testes novos cobrindo o
  comportamento (ciclo red→green mantido mesmo para o ajuste pós-revisão).

## Fonte / rastreabilidade

- Spec: `docs/specs/fase2-card.md`
- Learning session: `docs/learning/sessions/2026-08-17-card-height-alignment.md`
- Implementação: `src/components/ui/card.tsx`, `src/components/ui/card.test.tsx`

## Por que isso é relevante

É uma história concreta de processo de desenvolvimento, não só de código:
por que a revisão humana continua parte do ciclo mesmo com uma suíte de
testes automatizados robusta (TDD) rodando 100% verde. Mostra também
disciplina de manter o ciclo red→green mesmo para um ajuste pequeno
descoberto depois da "primeira versão pronta", em vez de só editar o
arquivo e seguir em frente.

## Público / ângulo possível

Outro dev iniciante aprendendo a diferença entre "testado" e "visualmente
correto"; recrutador técnico observando disciplina de processo (SDD+TDD+
revisão humana) mesmo em um projeto pessoal/freelancer.

## Observações de privacidade

Nenhum dado sensível envolvido — é puramente sobre um componente de UI
genérico (`Card`) e comportamento de CSS. Sem menção a clientes reais,
dados jurídicos ou infraestrutura do escritório.
