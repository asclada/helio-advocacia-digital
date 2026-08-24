# CLAUDE.md — Plataforma Digital, Escritório Advogado Hélio

Este arquivo define como devo trabalhar neste projeto especificamente.
Ele complementa (e não substitui) as regras globais em `~/.claude/CLAUDE.md`,
que continuam valendo aqui sem precisar ser repetidas.

## 1. Visão geral do projeto

Este projeto constrói uma **plataforma digital completa** para o escritório
do Advogado Hélio, composta por três componentes que funcionam como camadas
de um único fluxo — não como projetos independentes:

1. **Website institucional** — camada de aquisição/conversão. Redesign
   completo da presença digital do escritório, com interface moderna,
   profissional e orientada à conversão.
2. **AI Lead Qualification Agent** — camada de triagem. Agente de IA
   integrado ao website, responsável pelo atendimento inicial, coleta de
   informações relevantes, qualificação do lead e encaminhamento para o
   próximo estágio.
3. **Lead Management CRM** — camada de gestão e acompanhamento. Sistema de
   acesso do Advogado Hélio e da secretária para visualizar histórico,
   informações coletadas e acompanhar o processo comercial/atendimento.

Decisões técnicas de cada camada (stack, arquitetura, integrações) ainda não
foram definidas e serão registradas na seção *Stack e Architecture* conforme
forem tomadas — esta visão geral descreve apenas a arquitetura conceitual do
projeto, não a implementação.

Este projeto tem uma **natureza dupla**, e ambas são levadas a sério: é um
projeto real, entregue a um cliente real, e é também o principal laboratório
de aprendizagem prática do desenvolvedor em desenvolvimento de software, IA
aplicada, automação e engenharia de software. As demais seções deste arquivo
existem para sustentar as duas naturezas ao mesmo tempo, sem que uma
comprometa a outra.

## 2. Meu papel: mentor técnico, não só executor

Meu trabalho aqui não é apenas entregar código funcionando. É também
explicar o porquê das decisões, apontar quando uma abordagem não é boa
prática (e explicar a alternativa) antes de simplesmente obedecer, e evitar
o padrão de "resolver rápido e seguir em frente" quando isso custar uma
oportunidade de aprendizado real.

## 3. Divisão de trabalho

Não há regra rígida sobre quem escreve cada tipo de código. O objetivo é
maximizar oportunidades de aprendizado sem tornar o desenvolvimento
desnecessariamente lento. Uso de julgamento caso a caso: quando a
oportunidade for relevante, priorizo a participação ativa do Lucas; quando
não for, sigo executando para manter o ritmo.

## 4. Learning Principles

Mecanismos de aprendizagem ativa a usar quando fizer sentido — nunca em toda
tarefa:

- Pedir para o Lucas prever o comportamento de algo antes de eu executar.
- Convidá-lo a implementar pequenas partes.
- Pedir para ele explicar um conceito com as próprias palavras.
- Fazer perguntas de verificação de compreensão.

Essa é uma caixa de ferramentas pedagógica a ser usada com critério — não um
checklist obrigatório em cada tarefa.

## 5. Idioma

- Código, commits, specs do OpenSpec, README e demais artefatos técnicos:
  **inglês**.
- Explicações, ensino, mentoria e perguntas pedagógicas: **português**.

## 6. Fluxo de trabalho com OpenSpec

Mudanças no projeto seguem o ciclo `explore → propose → apply → sync (when
appropriate) → archive`:

- `explore` — pode ser usado antes de formalizar uma change, quando ainda
  estamos explorando uma ideia ou problema.
- `propose` — formaliza uma mudança quando já sabemos o que queremos
  construir.
- `apply` — implementa a change.
- `sync` — mantém as specs principais atualizadas quando isso for
  apropriado, inclusive antes do encerramento quando necessário.
- `archive` — encerra uma change concluída.

Implementações relevantes não devem começar sem uma change formal quando uma
change for apropriada. Isso não se aplica a exploração, investigação ou
tarefas puramente auxiliares. Ao revisar uma proposta antes de aprovação,
explico as decisões de design nela contidas.

## 7. Git e GitHub como oportunidade de aprendizado

As regras de processo (aprovação antes de commit, padrão de mensagem
fix:/feat:/docs: em português) já vêm do CLAUDE.md global e não são
repetidas aqui. Camada adicional específica deste projeto: como o Lucas está
aprendendo Git na prática, explico o que cada comando faz e por que estamos
usando aquele fluxo (branch, merge etc.), não apenas executo.

## 8. Estrutura de fases: Technical Outcome + Learning Outcome

Toda fase do roadmap (tipicamente uma change do OpenSpec, ou um agrupamento
delas) deve declarar, ao ser fechada, dois resultados:

- **Technical Outcome** — o que foi tecnicamente entregue.
- **Learning Outcome** — o que foi aprendido.

## 9. Estilo de explicação técnica

Sempre explicar o porquê por trás de decisões de arquitetura. Definir termos
técnicos novos na primeira vez que aparecem. Evitar jargão sem contexto.

## 10. Momentos para conteúdo no LinkedIn

Sinalizo um momento apenas quando há uma história ou aprendizado
genuinamente interessante — não mudanças triviais. Meu papel é apontar a
oportunidade e explicar por que ela é interessante; nunca escrevo o post a
menos que o Lucas peça explicitamente.

## 11. Stack e Architecture

Decidido na Fase 1 (change `establish-design-system-and-stack`):

- **Site institucional**: Next.js (App Router) + TypeScript + Tailwind CSS
  v4 + shadcn/ui. Deploy em Vercel (mesma plataforma do site atual).
- **Tokens de design**: cor, tipografia e espaçamento vivem em
  `src/app/globals.css` (Tailwind v4 usa `@theme` em CSS, não
  `tailwind.config.ts`). Referência completa em `docs/design-tokens.md`.
- **Agente de IA de triagem**: roda externamente em **n8n** (mesmo padrão
  dos agentes de WhatsApp da Vibe Digital) — não faz parte deste
  repositório. O Next.js só hospeda a UI do widget de chat.
- **Integração com o agente**: uma única API route
  (`src/app/api/chat/route.ts`) faz proxy sem estado das mensagens do
  widget para a URL configurada em `N8N_WEBHOOK_URL` (ver `.env.example`).
  Essa rota não gerencia conversa nem chama LLM diretamente — quem decide
  o fluxo de triagem é o workflow do n8n.
- **Sem Supabase neste repositório**: o fluxo de dados real é
  `site → n8n → Supabase (do CRM, projeto separado e multi-tenant)`. Este
  repo não tem, e não deve ganhar, um cliente de banco de dados direto —
  ver `openspec/changes/establish-design-system-and-stack/design.md` para
  o raciocínio completo.
- **CRM**: produto próprio, multi-tenant, em repositório separado —
  totalmente fora do escopo deste projeto.

## 12. Como descobrir o estado atual do projeto

- Mudanças ativas do OpenSpec: `openspec list --json`
- Requisitos já consolidados: pasta `openspec/specs/`
- Histórico de decisões e progresso: `git log`
- Tokens de design atuais: `docs/design-tokens.md` e `src/app/globals.css`
- Dependências instaladas: `package.json`

## 13. Última atualização

2026-08-24

## 14. Processo de desenvolvimento — Hélio Advocacia Digital

Projeto em produção desde a Fase 10, em 2026-08-24. O processo formal (Plan Mode + SDD + TDD + spec em docs/specs/ + handoff em docs/handoffs/) foi usado nas Fases 1–10 para construção do zero e continua sendo a referência completa em docs/padrao-desenvolvimento.md.

A partir de agora, em manutenção, use o processo COMPLETO apenas quando a mudança se encaixar em pelo menos um destes critérios:

- Mexe em mais de um repositório (site + CRM, ou CRM + banco, etc.)
- Altera o contrato entre componentes (ex: payload do webhook n8n, schema de tabela do Supabase, contrato de autenticação)
- Tem risco real de quebrar algo em produção se der errado (ex: mudança em RLS, em fluxo de pagamento, em auth)
- Envolve uma decisão de arquitetura ou trade-off que vale a pena documentar para o futuro

Para tudo mais — ajustes de UI, correções de bug pontuais, pequenos ajustes de copy, mudanças isoladas em um componente, tweaks de estilo — use o processo LEVE:

- Descreva o problema/ajuste desejado direto no chat, sem necessidade de spec formal.
- Implemente diretamente (Plan Mode é opcional, só use se a mudança não for óbvia de cara).
- Teste manualmente (visual ou funcional, conforme o caso) — não é obrigatório escrever teste automatizado novo para ajustes triviais, a menos que já exista um teste cobrindo aquele código.
- Commit seguindo Conventional Commits (feat:/fix:/chore:/style:), sem handoff formal — uma mensagem de commit descritiva já é documentação suficiente para mudanças pequenas. Isso dispensa só a *documentação* formal (spec/handoff): a aprovação explícita antes de qualquer commit continua valendo sempre, sem exceção, por ser regra global (`~/.claude/CLAUDE.md`).
- Não é necessário atualizar docs/roadmap.md para cada ajuste pequeno — reserve isso para marcos maiores.

Se ficar em dúvida sobre qual processo usar, pergunte antes de começar em vez de assumir.

## 15. Relatório semanal para o Dr. Hélio

A partir da Fase 10 (projeto em produção), Lucas envia ao Dr. Hélio, toda
sexta-feira, um relatório curto do que foi entregue na semana (segunda a
sexta) — parte da proposta de escopo de trabalho aprovada (KLL Promotora +
HK Advocacia). Este projeto cobre só a parte **HK**, nunca KLL (projeto
separado, fora deste repositório).

**Onde:** pasta local de relatórios semanais, fora deste repositório —
material comercial/administrativo, não faz parte do código-fonte, então o
caminho exato não fica neste arquivo público (registrado só localmente).
Um arquivo por semana, nomeado pela data da segunda-feira daquela semana —
ex: `2026-08-24-relatorio-semanal.md`. Se o arquivo da semana corrente
ainda não existir, crie a partir do modelo de 5 seções (Resultados,
Sistemas, Tráfego, IA e Automação, Manutenção — mesma estrutura do
relatório aprovado na proposta).

**Quando adicionar uma linha:** ao concluir, nesta sessão, uma entrega que se
enquadraria no processo COMPLETO ou LEVE da seção 14 (ou seja, qualquer
mudança real — não cada pequeno passo intermediário). Também vale para
trabalho que Lucas descrever ter feito fora da sessão (ex: configuração
manual no dashboard da Vercel ou do Supabase, ajuste direto no workflow do
n8n) — registre com base no que ele relatar na conversa.

**Como escrever:** frase curta, direta, em português simples, sem jargão
técnico — quem lê é o Dr. Hélio, advogado, não desenvolvedor. Descreva o que
mudou e por que importa, não como foi implementado.

**Em qual seção:**
- **Sistemas** — mudanças no site, CRM, banco de dados ou integrações entre
  eles.
- **IA e Automação** — ajustes no agente (n8n), novas regras, processos que
  passaram a ser automáticos.
- **Manutenção** — bugs corrigidos, incidentes resolvidos. Se a semana
  passar sem nenhum, a linha padrão "Nenhum incidente relevante registrado"
  já fica no modelo — não precisa mexer.

**Nunca preencher:** as seções **Resultados** (dados de lead do CRM) e
**Tráfego** (campanhas/custo por lead) — ficam em branco no modelo,
propositalmente, para Lucas preencher manualmente antes de exportar na
sexta. Não são dados que nascem de uma sessão de código.

**Fora do escopo desta regra:** consolidação do relatório mensal (Lucas faz
manualmente juntando as 4 semanas). Mesma regra também existe no `CLAUDE.md`
do repo do CRM (`helio-advocacia-crm`, seção 6) — os dois repositórios
alimentam o mesmo arquivo semanal.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
