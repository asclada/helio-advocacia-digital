# PROJETO-ADVOGADO-HÉLIO
## Guia de execução + aprendizagem com Claude Code

> **Objetivo:** reconstruir o site do Dr. Hélio, migrar o agente de triagem do WhatsApp para um widget no site e criar um CRM autenticado para o advogado e a secretária, usando o projeto como laboratório real para aprender desenvolvimento full stack com IA.

---

# 1. Como usar este documento

Este não é um roteiro do tipo:

> "Claude, faça a Fase 4."

A regra deste projeto será:

> **Claude Code constrói comigo, não constrói no meu lugar.**

Para cada etapa:

1. Claude explica o objetivo.
2. Claude explica a arquitetura antes de alterar arquivos.
3. Claude implementa uma parte pequena.
4. Eu inspeciono o resultado.
5. Claude explica o que criou em linguagem didática.
6. Eu testo.
7. Eu faço perguntas.
8. Só então avançamos.

### Regra de ouro

**Nunca pedir uma fase inteira de uma vez.**

Uma fase pode ter várias tarefas. Cada tarefa deve gerar um pequeno ciclo:

`entender → planejar → implementar → explicar → testar → revisar → commit`

---

# 2. Arquitetura final do projeto

A arquitetura definida no documento original é:

```text
                    USUÁRIO
                       │
                       ▼
              SITE INSTITUCIONAL
                 Next.js + React
                       │
                       │ HTTPS
                       ▼
                  CHAT WIDGET
                       │
                       ▼
                     n8n
              orquestração da IA
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          Gemini             Supabase
                                CRM
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
                 E-mail                  CRM / Painel
                                           Next.js
                                              │
                                      advogado / secretária
```

O projeto original define que o agente sai do WhatsApp e passa a fazer a triagem dentro do site. O WhatsApp volta a ser atendimento manual. fileciteturn2file0L16-L22

O widget envia mensagens para um Webhook HTTP do n8n usando `session_id`; o n8n mantém a lógica de IA existente e muda principalmente a entrada/saída. fileciteturn2file0L70-L82

---

# 3. Stack recomendada

## Site

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui quando fizer sentido

## CRM

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase/PostgreSQL

## IA

- n8n
- Gemini
- Webhook HTTP

## Infra

- Vercel
- GitHub
- Supabase
- n8n já existente

---

# 4. NestJS ou Express?

## Decisão para este projeto: NÃO adicionar NestJS agora.

O CRM e o site podem usar o próprio Next.js para as necessidades de backend que surgirem.

O n8n já é o orquestrador do agente de IA.

Portanto:

```text
Next.js
 ├── frontend
 ├── páginas
 ├── componentes
 └── necessidades simples de backend/API

n8n
 └── lógica do agente de IA

Supabase
 ├── banco
 ├── autenticação
 └── segurança/RLS
```

### Por que não Express agora?

Express é excelente, mas adicionaria:

```text
Next.js
+
Express
+
servidor separado
+
deploy separado
+
mais decisões
```

sem resolver um problema real deste MVP.

### Por que não NestJS?

NestJS é ainda mais estruturado e interessante para backends maiores, mas acrescentaria uma camada arquitetural que você não precisa neste primeiro projeto.

### Quando estudar Node/Express/Nest?

Depois deste projeto, como etapa de aprofundamento.

O objetivo agora é aprender **como uma aplicação full stack funciona**, não colecionar frameworks.

---

# 5. Uma correção importante sobre "React ser JavaScript em versão framework"

React não é uma versão de JavaScript.

Pense assim:

```text
JavaScript
    ↓
linguagem

React
    ↓
biblioteca para construir interfaces

Next.js
    ↓
framework construído em cima do React
```

E:

```text
TypeScript
    ↓
JavaScript + sistema de tipos
```

Uma analogia simples:

> JavaScript é a língua. React é uma caixa de ferramentas para construir interfaces. Next.js é uma oficina completa que organiza várias partes do trabalho.

---

# 6. Separação dos dois projetos

## Projeto A: site

Continua sendo o site institucional.

Responsabilidades:

- páginas públicas
- conteúdo
- SEO
- design
- widget de triagem

## Projeto B: CRM

Projeto Next.js separado.

Responsabilidades:

- login
- usuários
- leads
- triagens
- dashboard
- permissões

O plano original define explicitamente um novo projeto Next.js para o CRM, publicado separadamente na Vercel. fileciteturn2file0L188-L198

---

# 7. Supabase: não misturar os projetos

O CRM terá um **projeto Supabase separado** do banco operacional atualmente usado pelo agente.

Isso é uma decisão importante.

O CRM será preparado desde já para multi-tenant:

```text
clients
   │
   ├── leads
   │      └── triagens
   │
   └── profiles
```

O schema inicial definido no plano é:

```text
clients
  id
  nome
  nicho

leads
  id
  client_id
  nome
  telefone
  email
  origem
  status
  created_at

triagens
  id
  lead_id
  resumo_ia
  dados_extraidos
  transcript
  created_at

profiles
  id
  nome
  role
  client_id
```

fileciteturn2file0L103-L110

---

# 8. Segurança

Este projeto trabalha com dados potencialmente sensíveis de clientes de um escritório.

Por isso:

- Supabase Auth para autenticação.
- RLS para limitar acesso aos dados.
- `client_id` como fronteira de tenant.
- `service_role_key` **nunca** no frontend.
- secrets somente em variáveis de ambiente.
- dados fictícios durante desenvolvimento.

O plano original escolhe Supabase justamente por combinar Postgres, Auth e Row Level Security. fileciteturn2file0L84-L101

---

# 9. Como conversar com Claude Code

## PROMPT-MESTRE

Copie este prompt no início da sessão do Claude Code:

```text
Estamos trabalhando no PROJETO-ADVOGADO-HÉLIO.

Este projeto é também meu laboratório de aprendizagem. Eu tenho uma base de HTML, CSS e JavaScript, mas ainda estou aprendendo desenvolvimento profissional com React, TypeScript, Next.js, APIs, banco de dados, autenticação, Git e arquitetura full stack.

Sua função NÃO é apenas executar tarefas. Quero que você seja simultaneamente:

1. Senior Developer / Tech Lead
2. Pair Programmer
3. Professor particular
4. Code Reviewer

REGRA PRINCIPAL:
Não implemente grandes blocos do projeto sem me explicar primeiro o que vamos fazer.

Para cada tarefa, siga este ciclo:

FASE A — CONTEXTO
- Explique o que estamos tentando construir.
- Explique por que isso existe na arquitetura.
- Explique quais arquivos/partes do sistema provavelmente serão afetados.

FASE B — PLANO
- Apresente um plano curto antes de editar.
- Se houver uma decisão arquitetural importante, apresente as opções e recomende uma.
- Não tome decisões importantes silenciosamente.

FASE C — IMPLEMENTAÇÃO
- Faça uma implementação pequena e incremental.
- Evite alterar arquivos não relacionados.
- Preserve código existente que ainda será necessário.
- Não faça refatorações gigantescas sem necessidade.

FASE D — EXPLICAÇÃO
Depois de implementar:
- explique resumidamente o que foi criado;
- explique os arquivos principais;
- explique as partes mais importantes do código;
- use linguagem didática;
- assuma que eu sei programação básica, mas ainda não tenho fluência profissional;
- não explique cada linha de código;
- use exemplos simples quando um conceito for novo.

FASE E — TESTE
- diga exatamente o que eu preciso executar/testar;
- forneça comandos quando necessário;
- diga o resultado esperado;
- se houver interface visual, diga o que devo observar;
- se houver banco/API, diga como validar.

FASE F — APRENDIZAGEM
Depois do teste, faça 3 a 5 perguntas curtas para verificar se eu entendi.
Não entregue imediatamente as respostas.
Se eu errar, explique.

FASE G — CHECKPOINT
Só considere a tarefa concluída quando:
- implementação funciona;
- teste passou;
- eu entendi minimamente o que foi feito;
- não existem erros óbvios.

Depois sugira o commit adequado.

REGRAS DE ENSINO:
- Nunca esconda complexidade importante atrás de "a IA resolveu".
- Se gerar código complexo, explique o conceito por trás dele.
- Se eu pedir para você corrigir um bug, primeiro tente me ensinar a localizar o problema antes de simplesmente corrigir.
- Quando possível, pergunte "o que você acha que está acontecendo?" antes de revelar a resposta.
- Se houver uma solução mais simples, prefira a solução simples.
- Não introduza bibliotecas só porque elas são populares.
- Não crie abstrações prematuras.
- Não transforme o projeto em uma arquitetura empresarial desnecessariamente complexa.

REGRAS DE IA:
Eu quero aprender a trabalhar profissionalmente com IA, não depender cegamente dela.
Sempre diferencie:
- código que eu deveria entender;
- código de infraestrutura/configuração que basta eu saber usar;
- código complexo que precisa ser explicado conceitualmente.

Quando eu disser "não entendi", explique novamente usando um exemplo menor e isolado.

Quando eu disser "quero aprender", mude para modo professor.

Quando eu disser "quero fazer sozinho", pare de gerar código e me dê apenas requisitos, pistas e critérios de aceitação.

Quando eu disser "debug", não corrija imediatamente. Primeiro me ajude a diagnosticar.

Quando eu disser "review", faça uma revisão como Senior Engineer.

Antes de cada tarefa, me diga:
- O que vamos construir?
- Por que precisamos disso?
- O que eu vou aprender?
- Como vou testar?
```

---

# 10. Prompt para iniciar cada tarefa

Use:

```text
Vamos iniciar a próxima tarefa do PROJETO-ADVOGADO-HÉLIO.

Antes de alterar qualquer código:

1. diga exatamente qual é o objetivo desta tarefa;
2. explique onde ela se encaixa na arquitetura;
3. diga o que vou aprender;
4. diga quais arquivos você pretende criar/alterar;
5. explique os conceitos novos que provavelmente aparecerão;
6. proponha um plano de implementação pequeno;
7. espere minha confirmação antes de executar.
```

Isso evita o clássico:

> "Claude, faça o CRM."

e cinco minutos depois existe uma floresta de arquivos que você nunca viu na vida.

---

# 11. Prompt para modo "me ensine antes"

```text
Antes de implementar, quero uma mini-aula.

Explique este conceito como se eu fosse um desenvolvedor iniciante que já entende HTML, CSS e JavaScript básico.

Use:
- linguagem simples;
- um exemplo pequeno;
- uma analogia quando ajudar;
- depois conecte o exemplo ao nosso projeto.

Não escreva ainda a implementação completa.

No final, faça 3 perguntas para verificar se eu entendi.
```

---

# 12. Prompt para modo debugging

```text
Entramos em modo DEBUG.

Não corrija o problema imediatamente.

Primeiro:

1. liste os sintomas;
2. diga quais camadas podem estar causando o problema;
3. me ensine quais evidências devemos coletar;
4. me diga o que devo verificar no DevTools/logs/network/banco;
5. faça perguntas para eu tentar localizar o problema.

Só depois de investigarmos quero que você proponha a correção.

Quando chegarmos à solução, explique por que o bug aconteceu e como eu poderia reconhecê-lo no futuro.
```

---

# 13. Prompt para revisão de código

```text
Faça uma code review deste trecho como um Senior Developer revisando o código de um Junior.

Não reescreva tudo.

Classifique os problemas:

🔴 crítico
🟠 importante
🟡 melhoria
🟢 bom

Para cada problema:
- explique o que está errado;
- explique por que importa;
- mostre um exemplo simples;
- diga como eu deveria pensar sobre isso.

Depois me dê uma lista curta de alterações para eu tentar fazer primeiro.

Só escreva a solução completa se eu pedir.
```

---

# 14. Prompt para quando você quiser tentar sozinho

```text
Quero implementar esta funcionalidade sozinho.

Não escreva o código.

Me dê:
- requisitos;
- critérios de aceitação;
- arquivos que provavelmente vou precisar alterar;
- conceitos que devo pesquisar;
- 3 pistas graduais caso eu trave.

Se eu pedir "pista 1", dê somente a primeira pista.
Se eu pedir "pista 2", dê a segunda.
Só forneça código quando eu pedir explicitamente.
```

---

# 15. Prompt para entender código gerado pela IA

```text
Explique este código para mim sem fazer uma explicação linha por linha.

Quero entender:

1. qual é o objetivo;
2. qual é a entrada;
3. qual é o processamento;
4. qual é a saída;
5. quais partes são mais importantes;
6. quais partes são apenas boilerplate;
7. onde poderia dar erro;
8. qual conceito de programação eu deveria aprender para entender melhor isso.

Depois crie uma versão MUITO menor do mesmo conceito, apenas para estudo.
```

---

# 16. Prompt para aceitar código de IA com responsabilidade

Sempre que Claude gerar uma parte importante, use:

```text
Agora faça uma auditoria didática do código que você acabou de criar.

Quero saber:

- O que eu obrigatoriamente preciso entender como desenvolvedor?
- O que é apenas configuração?
- O que é boilerplate?
- Onde estão os pontos de segurança?
- Onde estão os pontos de falha?
- Quais decisões arquiteturais foram tomadas?
- Que perguntas um entrevistador poderia me fazer sobre isso?
```

---

# 17. FASE 0 — Preparação

## Objetivo

Descobrir exatamente o estado atual antes de reconstruir qualquer coisa.

O plano original pede confirmar a stack atual, levantar assets e garantir que o trabalho será feito em preview/branch antes da produção. fileciteturn2file0L146-L155

## Prompt

```text
Vamos começar a FASE 0 do PROJETO-ADVOGADO-HÉLIO.

Não altere código ainda.

Quero que você faça uma auditoria do projeto atual.

Descubra:
1. qual é a stack atual;
2. estrutura de pastas;
3. como o projeto é executado localmente;
4. como está conectado à Vercel;
5. se existe Git;
6. qual branch está em produção;
7. quais páginas existem;
8. quais assets existem;
9. onde estão os CTAs do WhatsApp;
10. quais partes podemos reaproveitar.

Explique tudo para mim.

No final, produza:
- diagnóstico;
- riscos;
- o que manter;
- o que substituir;
- próximo passo.

Não implemente nada ainda.
```

### Checkpoint

Você deve conseguir responder:

> "Como o site atual funciona?"

---

# 18. FASE 1 — Design System

## Objetivo

Criar a linguagem visual antes de sair construindo páginas.

O plano prevê tokens de cor/tipografia e componentes básicos reutilizáveis. fileciteturn2file0L157-L165

## Componentes iniciais

- Button
- Card
- Badge
- Input

## Prompt

```text
Vamos iniciar a FASE 1.

Antes de codificar:

1. analise a identidade atual;
2. proponha uma direção visual sóbria e profissional para advocacia;
3. explique paleta, tipografia, espaçamento e hierarquia;
4. explique o conceito de design tokens;
5. proponha os componentes base.

Não implemente ainda.

Quero aprovar a direção primeiro.
```

Depois:

```text
Agora implemente somente os tokens e os componentes base.

Depois explique:
- onde os tokens vivem;
- como Tailwind usa esses valores;
- por que componentes reutilizáveis existem;
- como o site e o CRM poderão compartilhar a mesma linguagem visual.

Depois me dê um teste visual simples.
```

---

# 19. FASE 2 — Redesign

A Home deve vir primeiro. O CTA permanece apontando para o WhatsApp durante esta fase e só será trocado quando o widget estiver pronto. fileciteturn2file0L167-L175

## Estratégia

Não pedir:

> "Redesign o site inteiro."

Faça:

```text
Home
↓
Sobre
↓
Áreas de atuação
↓
Contato
↓
demais páginas
```

## Prompt

```text
Vamos construir a Home.

Antes de criar:

1. liste as seções;
2. explique a função de cada seção;
3. diga quais componentes serão reutilizados;
4. diga como a responsividade será tratada;
5. diga quais elementos são importantes para conversão;
6. preserve o conteúdo jurídico existente quando possível.

Depois implemente somente a Home.

Não altere ainda o CTA do WhatsApp.
```

### Checkpoint

A Home precisa:

- funcionar desktop;
- funcionar mobile;
- estar visualmente aprovada;
- estar em Preview Deployment;
- não quebrar o site atual.

---

# 20. FASE 3 — Supabase CRM

Aqui começa uma das partes mais importantes para seu aprendizado.

O plano cria um Supabase separado e configura:

- `clients`
- `leads`
- `triagens`
- `profiles`
- Auth
- RLS. fileciteturn2file0L177-L186

## Antes de executar

Peça:

```text
Explique para mim:

1. o que é PostgreSQL;
2. o que é uma tabela;
3. o que é chave primária;
4. o que é foreign key;
5. o que é relacionamento;
6. o que é Supabase Auth;
7. o que é RLS;
8. por que RLS é especialmente importante neste CRM.

Use um exemplo pequeno de "clientes e pedidos".

Não crie nada ainda.
```

Depois:

```text
Agora vamos implementar o banco.

Faça em etapas pequenas.

Primeiro:
- clients

Depois:
- leads

Depois:
- triagens

Depois:
- profiles

Depois:
- relacionamentos

Depois:
- RLS

Depois:
- Auth

Após cada etapa:
1. explique;
2. me diga como testar;
3. espere eu confirmar.
```

### Checkpoint obrigatório

Criar um lead de teste.

Confirmar que:

> usuário A vê seus dados e usuário sem permissão não vê.

---

# 21. FASE 4 — CRM

O CRM começa simples:

```text
Login
  ↓
Dashboard
  ↓
Leads
  ↓
Detalhe da triagem
```

O plano original define lista de leads, detalhe da triagem e deploy separado. fileciteturn2file0L188-L198

## Prompt inicial

```text
Vamos iniciar o CRM.

Antes de criar telas:

1. explique a arquitetura do projeto Next.js;
2. explique como autenticação conversa com Supabase;
3. explique como o frontend busca dados;
4. explique como RLS protege esses dados;
5. desenhe o fluxo:

login → sessão → consulta → Supabase → resultado.

Depois proponha a primeira tela.

Não implemente tudo de uma vez.
```

### Ordem

1. projeto Next.js;
2. Supabase client;
3. login;
4. proteção de rota;
5. layout do painel;
6. lista de leads;
7. detalhe do lead;
8. status;
9. filtros;
10. dashboard.

---

# 22. FASE 5 — n8n

O plano é preservar o workflow atual e alterar a borda:

```text
Evolution
   ↓
Webhook HTTP
```

e:

```text
resposta WhatsApp
   ↓
JSON via Respond to Webhook
```

O workflow antigo deve permanecer como backup/desativado. fileciteturn2file0L200-L212

## Prompt

```text
Vamos adaptar o agente.

Antes de alterar o workflow:

1. explique como o workflow atual funciona;
2. identifique entrada;
3. identifique processamento;
4. identifique memória/histórico;
5. identifique chamada ao modelo;
6. identifique saída;
7. identifique onde ocorre a gravação de dados.

Depois explique a diferença entre:

Evolution Webhook
e
HTTP Webhook.

Não altere nada ainda.
```

Depois:

```text
Agora vamos duplicar o workflow.

Importante:
NÃO altere o workflow original.

Vamos modificar somente a cópia.

Faça uma mudança por vez:
1. trigger;
2. payload;
3. processamento;
4. resposta JSON;
5. gravação no CRM;
6. e-mail.

Após cada mudança, teste.
```

### Teste isolado

Use Postman/curl.

Payload:

```json
{
  "session_id": "teste-001",
  "mensagem": "Olá, preciso falar com um advogado."
}
```

Só conecte o site depois que:

```text
Webhook
   ↓
IA
   ↓
Supabase
   ↓
Email
```

estiver funcionando sozinho.

---

# 23. FASE 6 — Widget React

O plano define:

- `session_id`;
- `crypto.randomUUID()`;
- `sessionStorage`;
- POST para n8n;
- loading;
- erro;
- teste antes de conectar o CTA. fileciteturn2file0L214-L222

## Antes do código

Peça:

```text
Explique para mim como funciona uma aplicação de chat.

Quero entender:

1. estado das mensagens;
2. input;
3. request HTTP;
4. response;
5. loading;
6. erro;
7. session_id;
8. sessionStorage.

Use um exemplo de chat extremamente simples.

Depois conecte mentalmente esse exemplo ao nosso widget.
```

## Depois

```text
Agora vamos criar o componente ChatWidget.

Construa primeiro somente:
- interface;
- input;
- botão;
- lista de mensagens.

Depois explique.

Só depois conectaremos ao webhook.
```

Segundo passo:

```text
Agora conecte o widget ao webhook.

Antes explique:
- fetch;
- POST;
- JSON;
- async/await;
- loading;
- tratamento de erro.

Depois implemente.
```

---

# 24. FASE 7 — Integração final

Só nesta fase:

```text
CTA
 ↓
Widget
 ↓
n8n
 ↓
IA
 ↓
Supabase
 ↓
CRM
 ↓
Email
```

O plano original exige um teste ponta a ponta antes de religar o tráfego pago. fileciteturn2file0L224-L237

## Prompt

```text
Estamos na FASE 7.

Antes de alterar o CTA:

Faça uma checklist de produção.

Precisamos confirmar:
- site;
- widget;
- webhook;
- IA;
- session_id;
- Supabase;
- RLS;
- CRM;
- login;
- email;
- domínio;
- variáveis de ambiente;
- workflow antigo desativado;
- logs;
- tratamento de erro.

Depois vamos executar um teste ponta a ponta com lead FICTÍCIO.

Não use dados reais ainda.
```

---

# 25. Teste ponta a ponta

Simule:

```text
Usuário entra no site
        ↓
Clica no CTA
        ↓
Widget abre
        ↓
Usuário conversa
        ↓
n8n processa
        ↓
IA responde
        ↓
Triagem termina
        ↓
Lead criado
        ↓
Triagem salva
        ↓
Email enviado
        ↓
CRM mostra lead
```

Só depois disso:

> produção.

---

# 26. Git: regra do projeto

Cada tarefa relevante termina com commit.

Exemplo:

```text
feat: create CRM database schema

feat: add Supabase authentication

feat: create leads dashboard

feat: add AI chat widget

feat: connect chat widget to n8n webhook
```

Não faça:

```text
final-final-agora-vai
```

---

# 27. Como usar branches

Exemplo:

```text
main
│
├── feature/design-system
├── feature/home-redesign
├── feature/crm-auth
├── feature/crm-leads
├── feature/ai-widget
└── feature/n8n-webhook
```

A Vercel pode gerar Preview Deployments para branches, permitindo testar sem mexer na produção. O plano original recomenda exatamente esse fluxo. fileciteturn2file0L150-L155

---

# 28. O que você deve aprender de cada etapa

| Etapa | Conceitos |
|---|---|
| Auditoria | Git, estrutura de projeto |
| Design System | componentes, tokens, Tailwind |
| Home | React, props, composição |
| Next.js | routing, layouts, server/client |
| Supabase | PostgreSQL, SQL |
| RLS | segurança, autorização |
| Auth | sessão, autenticação |
| CRM | CRUD, estado, queries |
| n8n | webhooks, APIs |
| Widget | fetch, async/await |
| IA | integração de APIs |
| Deploy | Vercel, env vars |
| Testes | unit/integration/E2E |
| Git | branches, commits, PR |
| Debug | DevTools, logs, Network |

---

# 29. O que você NÃO precisa decorar

Não tente memorizar:

- sintaxe inteira do React;
- APIs inteiras do Next.js;
- documentação do Supabase;
- todos os métodos de JavaScript;
- comandos infinitos do Git;
- todas as opções do Tailwind.

Desenvolvedor profissional consulta documentação.

O que você precisa desenvolver é:

> **capacidade de raciocínio.**

---

# 30. O que você precisa conseguir explicar

Ao final, você deve conseguir explicar:

### Frontend

> "O usuário interage com um componente React."

### API

> "O frontend envia uma requisição HTTP."

### n8n

> "O webhook recebe e inicia o workflow."

### IA

> "O workflow envia contexto para o modelo e processa a resposta."

### Banco

> "O resultado estruturado é persistido no PostgreSQL."

### Segurança

> "RLS limita quais registros cada usuário pode consultar."

### CRM

> "O Next.js consulta o Supabase e apresenta os dados."

### Deploy

> "Git dispara o deployment da Vercel."

Se você consegue explicar isso, já está aprendendo arquitetura de verdade.

---

# 31. Checklist de segurança

Antes de produção:

- [ ] nenhuma service role key no frontend
- [ ] nenhuma API key hardcoded
- [ ] `.env` no `.gitignore`
- [ ] RLS habilitado
- [ ] policies testadas
- [ ] autenticação testada
- [ ] autorização testada
- [ ] validação de input
- [ ] tratamento de erros
- [ ] logs sem dados sensíveis
- [ ] dados de teste removidos
- [ ] backups considerados
- [ ] domínio HTTPS
- [ ] workflow antigo do WhatsApp desativado

---

# 32. Checklist de qualidade

Antes de considerar o projeto pronto:

## Site

- [ ] desktop
- [ ] mobile
- [ ] SEO básico
- [ ] acessibilidade básica
- [ ] performance
- [ ] CTA
- [ ] widget

## Widget

- [ ] abre
- [ ] envia
- [ ] recebe
- [ ] loading
- [ ] erro
- [ ] sessão
- [ ] mobile
- [ ] encerramento da triagem

## CRM

- [ ] login
- [ ] logout
- [ ] proteção de rota
- [ ] leads
- [ ] detalhe
- [ ] status
- [ ] permissões
- [ ] responsividade

## Backend

- [ ] webhook
- [ ] validação
- [ ] IA
- [ ] Supabase
- [ ] email
- [ ] logs

---

# 33. Como transformar este projeto em portfólio

Não publique somente:

> "Site de advogado."

Apresente como:

## Lead Qualification Platform

**Stack:**
Next.js · React · TypeScript · Tailwind · Supabase · PostgreSQL · n8n · Gemini

**Features:**

- website institucional;
- AI lead qualification;
- custom chat widget;
- persistent conversation sessions;
- automated lead extraction;
- CRM;
- authentication;
- role-based access;
- PostgreSQL;
- Row Level Security;
- email notifications;
- Vercel deployment.

Isso demonstra muito mais competência.

---

# 34. Como se preparar para entrevista usando este projeto

Depois de cada fase, peça:

```text
Agora faça uma entrevista técnica baseada SOMENTE no que acabamos de construir.

Faça perguntas de Junior/Associate.

Não me dê as respostas.

Avalie:
- fundamentos;
- entendimento arquitetural;
- debugging;
- segurança;
- decisões técnicas.
```

Perguntas que provavelmente aparecerão:

- Por que Next.js?
- Por que TypeScript?
- Por que Supabase?
- O que é RLS?
- O que é uma API REST?
- O que é um webhook?
- Como o widget mantém a sessão?
- Por que a service role key não pode ir para o frontend?
- Como você protegeria uma rota?
- Como investigaria uma API retornando 500?
- Como você faria deploy?
- Como você organizou o banco?
- Por que o CRM é separado do site?

Você deverá responder usando **seu próprio projeto**.

---

# 35. Regra contra "vibe coding"

IA pode escrever 300 linhas em segundos.

Isso não significa que você deve aceitar 300 linhas.

Antes de aceitar uma implementação grande, pergunte:

```text
Qual é a menor implementação que resolve esse problema?
```

Depois:

```text
Existe alguma abstração aqui que ainda não precisamos?
```

E:

```text
Eu conseguiria explicar esse código para um Senior?
```

Se a resposta for não:

> pare e aprenda.

---

# 36. Regra dos 3 níveis

Para cada tecnologia, classifique seu conhecimento:

### Nível 1 — reconhecer

> "Sei o que é."

### Nível 2 — usar

> "Consigo implementar com documentação/IA."

### Nível 3 — explicar e depurar

> "Consigo entender o fluxo e investigar problemas."

Seu objetivo para este projeto:

### JavaScript

Nível 3

### TypeScript

Nível 2 → 3

### React

Nível 2 → 3

### Next.js

Nível 2

### SQL

Nível 2

### Supabase

Nível 2

### Git

Nível 2

### n8n

Nível 2 → 3

### IA/APIs

Nível 2 → 3

Isso é uma meta realista.

---

# 37. Regra para quando Claude fizer algo que você não conhece

Não diga apenas:

> "Tá bom."

Pergunte:

```text
Você acabou de usar [CONCEITO].

Eu não conheço isso.

Antes de continuar, me explique:
- o que é;
- por que usamos;
- o que aconteceria sem ele;
- exemplo simples;
- como isso aparece no nosso projeto.
```

Essa pergunta simples vai transformar Claude de "gerador de código" em tutor.

---

# 38. O projeto deve ter checkpoints

Nunca avance se o checkpoint não passou.

```text
FASE 0
Auditoria concluída
      ↓
FASE 1
Design system aprovado
      ↓
FASE 2
Home aprovada
      ↓
FASE 3
Banco + RLS funcionando
      ↓
FASE 4
CRM funcionando
      ↓
FASE 5
n8n funcionando isoladamente
      ↓
FASE 6
Widget funcionando
      ↓
FASE 7
Integração ponta a ponta
      ↓
PRODUÇÃO
```

---

# 39. O objetivo educacional real

O objetivo NÃO é você terminar este projeto sabendo escrever cada linha manualmente.

O objetivo é terminar sabendo:

```text
problema
   ↓
requisito
   ↓
arquitetura
   ↓
quebra em tarefas
   ↓
implementação
   ↓
teste
   ↓
debug
   ↓
review
   ↓
deploy
```

E usando IA em cada etapa.

Esse é o músculo profissional que você quer desenvolver.

---

# 40. Primeira ação prática

Quando abrir o Claude Code no projeto atual, **não peça para ele começar o redesign**.

Cole primeiro o **PROMPT-MESTRE** deste documento.

Depois:

```text
Agora execute somente a FASE 0.

Não altere código.

Faça a auditoria do projeto atual e me explique o que encontrou.
```

Quando terminar, você volta com o resultado.

A partir daí, cada etapa será feita como uma pequena aula prática.

---

# 41. Estado atual do projeto

## Decisões já tomadas

- [x] Agente sai do WhatsApp
- [x] WhatsApp volta a ser manual
- [x] Widget no site
- [x] n8n continua como orquestrador
- [x] Supabase separado para CRM
- [x] CRM multi-tenant desde o início
- [x] `client_id` genérico
- [x] e-mail + badge como notificação padrão
- [x] WhatsApp interno somente como add-on futuro
- [x] Site e CRM como projetos Next.js separados
- [x] Vercel para hospedagem
- [x] RLS
- [x] Supabase Auth

Essas decisões estão documentadas no plano original. fileciteturn2file0L139-L155

## Ainda precisa decidir/verificar

- [ ] stack exata atual do site
- [ ] estado do Git
- [ ] estrutura atual do projeto
- [ ] assets
- [ ] conteúdo
- [ ] direção visual final
- [ ] domínio/DNS
- [ ] plano Vercel adequado para uso comercial
- [ ] detalhes finais do schema
- [ ] estratégia de email
- [ ] política de retenção dos dados
- [ ] critérios finais de acesso por role

---

# 42. Uma última regra

**Não tenha pressa para terminar o projeto.**

Tenha pressa para entender.

Se Claude Code produzir uma aplicação perfeita em dois dias e você não souber explicar:

> "como o login funciona?"

o projeto não cumpriu sua função educacional.

Se levar duas semanas a mais, mas você terminar entendendo:

> frontend → API → n8n → IA → banco → RLS → CRM → deploy

então você saiu do projeto com algo muito mais valioso do que um site funcionando.

Você saiu com **experiência prática que consegue defender numa entrevista**.

---

## Próximo comando

```text
Estamos começando o PROJETO-ADVOGADO-HÉLIO.

Leia as regras de aprendizagem deste documento.

Execute somente a FASE 0.

Não altere nenhum arquivo.

Faça uma auditoria completa do projeto atual e me explique:

1. stack;
2. estrutura;
3. fluxo atual;
4. deploy;
5. Git;
6. páginas;
7. assets;
8. CTA;
9. integrações;
10. riscos.

Depois me diga exatamente qual será a primeira tarefa de implementação.

Não avance para ela ainda.
```
