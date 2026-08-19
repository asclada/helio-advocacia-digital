# Primeiro painel autenticado do projeto: Next.js + Supabase Auth + RLS

- **Data:** 2026-08-19
- **Categoria:** Milestone
- **Status:** Captured
- **Fase do projeto (se aplicável):** Fase 6 — Painel autenticado (repositório `helio-advocacia-crm`)

## Resumo do acontecimento
A Fase 6 entregou o primeiro painel autenticado do projeto: login com
Supabase Auth, proteção de rotas via `proxy.ts` (o antigo `middleware.ts`
renomeado no Next.js 16) reforçada por uma segunda checagem de sessão no
Server Component do layout protegido (defense-in-depth), uma tabela de
leads com ordenação/busca via TanStack Table, e uma tela de detalhe
read-only. Toda a lógica de negócio (validação de login, proteção de
sessão, tabela, detalhe) foi construída com TDD — teste antes da
implementação — incluindo `jest-axe` em todos os componentes interativos.
A fase atravessou duas sessões (a primeira ficou sem limite de uso no
meio da implementação); a retomada funcionou porque a sessão anterior
tinha deixado um plano de implementação completo e aprovado documentado
em arquivo, além da spec já commitada — a sessão seguinte só precisou ler
os dois documentos pra continuar exatamente de onde parou, sem redecidir
nada.

## O que foi aprendido
Que a autorização real de acesso a dados sensíveis (dados de leads de um
escritório de advocacia) não deve depender só de uma camada — o padrão
usado foi checar a sessão duas vezes (proxy de rota + Server Component),
porque o próprio Supabase recomenda isso: o proxy sozinho não impede que
o payload de uma Server Component renderizada vaze antes do redirect.
Também ficou claro, na prática, o valor de um plano de implementação
persistido em arquivo (fora do contexto da conversa) quando uma sessão
longa é interrompida no meio — é o que permitiu a segunda sessão retomar
sem perda de contexto nem redecisão.

## Evidência
- Spec aprovada: `docs/specs/fase6-painel-autenticado.md` (repo do CRM).
- Suíte de testes: 29 testes (incluindo `jest-axe`) cobrindo login,
  proteção de sessão, tabela de leads e detalhe — todos verdes.
- `tsc --noEmit`, `npm run lint` e `npm run build` limpos.
- Verificação manual completa com os 3 usuários reais do escritório
  (login, bloqueio sem sessão, erro genérico em credencial inválida,
  navegação, logout invalidando a sessão de fato).

## Fonte / rastreabilidade
- Spec: `docs/specs/fase6-painel-autenticado.md`.
- Plano de implementação aprovado (retomado entre as duas sessões).
- Commit(s) de encerramento da Fase 6 no repositório `helio-advocacia-crm`.

## Por que isso é relevante
É o primeiro momento do projeto em que "dados reais de um cliente real"
entram em jogo de verdade (leads já triados pela IA) — a decisão de
duplicar a checagem de sessão em vez de confiar só no proxy é um exemplo
concreto de raciocínio sobre segurança em camadas, não só "fazer
funcionar". A continuidade entre sessões via plano documentado também é
um exemplo prático de um problema real de trabalhar com um assistente de
IA em tarefas longas, e como mitigá-lo.

## Público / ângulo possível
Outro dev iniciante trabalhando com Next.js/Supabase (ângulo técnico:
defense-in-depth em proteção de rota); recrutador técnico avaliando
maturidade de decisões de arquitetura, não só "consegue fazer funcionar";
outros devs usando assistentes de IA em tarefas longas (ângulo de
processo: como manter continuidade sem perder decisões já tomadas).

## Observações de privacidade
Nenhum dado real de lead, nome de usuário, e-mail, senha, chave ou URL de
projeto foi incluído neste candidato. Nenhuma alteração necessária antes
de publicar — mas por regra já registrada do projeto, este candidato
específico (meio da história do CRM) deve esperar a existência de um
post geral de apresentação do projeto antes de ser publicado, pra não
introduzir a audiência no meio de uma narrativa sem contexto inicial.
