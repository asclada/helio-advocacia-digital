# Handoff — 2026-08-20 — Fase 8 completa (widget de chat no site)

## Prompt pronto para a próxima sessão

```
Estou no projeto Hélio Advocacia Digital. A Fase 8 (widget de chat no site,
consumindo o agente já migrado na Fase 7) foi fechada nesta sessão —
verificada ponta a ponta em desktop e em celular real, com mensagens reais
trocadas com o agente de produção.

Antes de começar, leia:
- docs/roadmap.md do repo do site — Fase 8 já marcada concluída, com
  resumo do que foi entregue, os 3 bugs reais encontrados no celular e a
  nova pendência conhecida (retomada de conversa na janela da LGPD)
- docs/specs/fase8-widget-chat.md — spec enxuta aprovada por Lucas (prazo
  firme no dia), com as 4 decisões de design
- este handoff (2026-08-20-fase8-widget-chat.md) — cobre os 3 bugs reais
  de mobile, os ajustes visuais pós-revisão, e o ajuste feito diretamente
  no system message do agente n8n (produção, fora deste repositório)

Com a Fase 8 fechada, a próxima fase pendente no roadmap master é a
Fase 9 (integração ponta a ponta) — ainda sem escopo detalhado além do
objetivo geral do roadmap. Não presumir escopo da Fase 9 sem conversar
antes.
```

## Registro da sessão

### O que foi entregue

- **Widget de chat completo**: `src/components/chat/` — `chat-widget.tsx`
  (orquestrador), `use-chat-conversation.ts` (hook com TDD real — 9
  testes: geração/persistência de `conversa_id`, envio, mapeamento de
  `respostas`, os 3 caminhos de erro), `chat-chip.tsx`, `chat-notification-bubble.tsx`,
  `chat-panel.tsx` (`Dialog` do Base UI, não-modal, sem backdrop),
  `chat-message-bubble.tsx`. Montado uma vez em `src/app/layout.tsx`,
  substituindo a reserva estática do `Footer` (Fase 3).
- **Verificação end-to-end real**: conversas completas trocadas com o
  agente de produção via `localhost` e via IP de rede (simulando celular),
  incluindo LGPD, coleta de telefone, lista de opções do Bloco A.

### Três bugs reais de mobile, encontrados só no teste em celular real

Nenhum dos três apareceu nos testes anteriores (desktop, automação de
navegador) — só surgiram quando Lucas testou no próprio celular.

1. **`crypto.randomUUID()` indisponível em contexto inseguro.** O
   navegador desliga essa API fora de HTTPS/`localhost` — acessar o site
   pelo IP da rede local (`http://192.168.x.x:3000`, HTTP puro) é
   contexto inseguro. O clique no chip quebrava silenciosamente, sem
   nenhum feedback visual — exatamente o "não abre nada" relatado por
   Lucas, e muito provavelmente a causa também do menu lateral
   (`NavDrawer`, código da Fase 3, não tocado nesta sessão) ter parado de
   responder junto: um erro não tratado sobe o overlay de erro do Next.js
   em modo dev, que fica interceptando todos os toques seguintes até ser
   descartado. Corrigido com um fallback via `crypto.getRandomValues`
   (funciona em qualquer contexto) em `use-chat-conversation.ts`.
2. **Navegação interna inteira usava `<a href>` puro.** `Header`
   (desktop e drawer mobile), `Footer` e o CTA "Ver áreas de atuação" do
   Hero apontavam pras rotas reais (`/sobre`, `/areas-de-atuacao`,
   `/contato`) com `<a>` nativo em vez do `Link` do Next.js — isso força
   reload completo da página a cada navegação interna, remontando todo o
   React do zero, inclusive o widget de chat (apagava a conversa da
   memória; só o `conversa_id` sobrevivia via `localStorage`, por isso a
   saudação genérica reaparecia). Trocado por `Link` em todos os 4
   pontos — resolve ao mesmo tempo trocar de página, trocar de aba e
   minimizar o navegador, já que nenhum desses deveria remontar o React
   por si só, só a navegação quebrada estava causando isso.
3. **Chrome Android não encolhia o layout com o teclado aberto.** Sem
   configuração explícita, o navegador só ajusta a área *visível*, não o
   viewport de *layout* — o `100dvh` do painel do chat não recalculava, e
   a saudação inicial ficava empurrada pra fora da área visível atrás do
   teclado. Corrigido com `interactiveWidget: "resizes-content"` no
   `export const viewport` de `src/app/layout.tsx`.

### Ajustes visuais de rodadas de revisão (mesmo padrão da Fase 4.1)

- Quebras de linha (`\n`) das respostas do agente preservadas na UI
  (`whitespace-pre-wrap`) — o HTML colapsava tudo numa linha só, mesmo o
  agente já mandando texto formatado em blocos.
- Ênfase `*texto*` (padrão WhatsApp que o agente ainda usa) convertida
  pra negrito real (`<strong>`) na renderização, sem mexer no agente.
- Foto do Hero: linha de base sutil sob o retrato no mobile (recriando a
  mesma leitura de "chão" que a margem negativa (`md:-mb-8`) já dá no
  desktop, encostando na borda da próxima seção) — uma primeira tentativa
  com margem negativa mobile chegou a *sobrepor* o CTA do WhatsApp, foi
  revertida.
- Chip do chat com brilho pulsante permanente (`animate-ping` discreto +
  glow), pra se anunciar como clicável o tempo todo.
- `text-balance` no título do Hero e no `SectionHeading` compartilhado
  (usado também por Sobre e FAQ/Contato) — evita a última linha curta
  "flutuando" sozinha; o título de Áreas de Atuação também teve o
  tamanho reduzido um passo (`text-3xl→2xl` / `sm:text-4xl→3xl`) pra
  caber em 1 linha no desktop e 2 no mobile.
- Espaço entre o header fixo e o início do Hero reduzido
  (`pt-24 md:pt-32` → `pt-8 md:pt-12`).
- Nome do escritório corrigido de "Hélio" pra "Helio" (sem acento) em
  todo o site — chat, metadados, textos alternativos de imagem.

### Ajuste no agente do n8n (produção, fora deste repositório)

Aplicado via API do n8n (mesma credencial/mecanismo da Fase 7,
`D:/n8n-fase8-ajustes/`, fora dos repos git por conter lógica de negócio
sensível — backup do workflow antes e depois de cada mudança preservado
lá). Duas mudanças no `systemMessage` do node `AGENTE DE I.A.`:

1. **Correção de acentuação**: as 9 ocorrências de "Hélio" trocadas por
   "Helio". Verificado antes de aplicar que nenhum outro node/condição/
   query do workflow inteiro depende dessa grafia exata (varredura
   recursiva de todos os campos de todos os nodes).
2. **Seção 8 do prompt reescrita.** O texto antigo ("Comportamento em
   Follow-up de Inatividade") descrevia o mecanismo do Watchdog removido
   na Fase 7 — nunca mais era acionado, texto morto. Substituído por
   "Retomada de conversa interrompida": como a conversa já fica inteira
   na memória do agente por `conversa_id` (`Simple Memory` do LangChain),
   não foi preciso nenhum nó novo — só ensinar o agente a reconhecer, pela
   própria memória, quando uma mensagem de abertura ("oi") chega numa
   conversa que já tem nome coletado, e nesse caso cumprimentar pelo nome
   e perguntar se quer continuar ou começar do zero.

**Duas rodadas de teste real contra produção** (script descartável em
`D:/n8n-fase8-ajustes/`, fora dos repos git):
- v1 (sem marcação de prioridade explícita): não disparou no cenário
  "reload durante a pergunta de LGPD pendente" — o agente insistiu em
  pedir a confirmação da LGPD.
- v2 (com `REGRA CRÍTICA — NÃO QUEBRE`, citando explicitamente o Bloco
  0.1 e o Bloco H): mesmo resultado no cenário da LGPD pendente. **Mas
  funcionou perfeitamente** no cenário "reload no meio do fluxo, sem
  pergunta de sim/não pendente" (depois de dar telefone, dentro do Bloco
  A) — greeting correto pelo nome + oferece continuar/nova triagem.

### Limitação conhecida (aceita, não é bug)

A retomada de conversa **não** dispara de forma confiável na janela
estreita entre a pessoa dar o nome e confirmar o aviso de LGPD (Bloco
0.1) — o agente insiste em pedir a confirmação, mesmo com a regra de
prioridade explícita no prompt. Funciona normalmente em qualquer outro
ponto do fluxo (testado e confirmado no Bloco A). Hipótese: a instrução
já existente do Bloco 0.1 ("pergunte de novo se a resposta não for clara")
tem mais força sobre o modelo do que a nova regra, mesmo com reforço
textual — mesma categoria de não-determinismo de LLM que a Fase 7 já
tinha encontrado no gate de contato do Bloco H (que por isso tem reforço
estrutural no Postgres, não só no prompt). Duas rodadas de prompt
testadas sem sucesso nesse recorte específico; Lucas decidiu aceitar como
limitação por ora, sem data prevista pra retomar. Registrado em
`docs/roadmap.md`, seção "Pendências conhecidas".

### Testes e verificação

- `use-chat-conversation.test.ts`: 9 testes, TDD real (red confirmado
  antes da implementação).
- Suíte completa: 208/208 passando ao final da sessão — inclui um teste
  do Hero que estava quebrado desde a Fase 4 (`md:-mb-16` vs. o valor
  real `md:-mb-8`), corrigido de passagem ao mexer no mesmo trecho.
- `tsc`/`lint`/`build` limpos.
- Verificação manual: desktop (automação de navegador — com limitação
  conhecida de não conseguir emular viewport mobile nesta sessão) e
  celular real do Lucas (prints em
  `D:\projeto-completo-advogado-helio\PRINTS TESTES`), incluindo conversa
  real completa com o agente de produção.
- Dados de teste gerados: várias linhas de teste em `triagens`/`leads`
  no Supabase do CRM, tanto dos meus testes quanto dos do Lucas — somam
  ao lote que a Fase 7 já tinha sinalizado pra limpar antes do uso real.

### Outcome (CLAUDE.md §8)

- **Technical Outcome**: widget de chat completo em produção, com 3 bugs
  reais de mobile corrigidos (contexto inseguro do `crypto.randomUUID`,
  navegação interna sem `Link` quebrando o estado do widget, teclado
  Android escondendo conteúdo), mais um conjunto de ajustes visuais pós-
  revisão e uma melhoria no prompt do agente n8n (retomada de conversa
  reconhecida pela própria memória, sem node novo no workflow).
- **Learning Outcome**: sessão de revisão crítica real do Lucas — não só
  testou no celular (achou os 3 bugs de mobile e o problema de fluidez do
  texto do Hero antes de mim), como fez uma pergunta de revisão técnica
  genuína sobre a mudança no n8n: se a nova regra de prioridade
  ("retomada vem antes de qualquer bloco") poderia entrar em conflito com
  a `REGRA CRÍTICA` já existente do Bloco H, pedindo que eu justificasse
  com um cenário concreto antes de aplicar. Isso levou a uma correção
  real no texto (nomear o Bloco H explicitamente, não só "qualquer
  bloco") antes de ir pra produção — evidência de compreensão real de um
  conceito de engenharia de prompt (precedência/conflito entre regras),
  não só confiança cega no meu output. Candidato forte a registro no
  Learning System — sinalizando, não registrando ainda (ver seção
  seguinte).

### Candidato a LinkedIn (sinalizando, não registrando ainda)

Dois momentos com potencial editorial real nesta sessão: (1) o bug do
`crypto.randomUUID` em contexto inseguro — uma categoria de bug que só
aparece testando fora de `localhost`, fácil de generalizar como lição pra
quem testa em rede local; (2) a pergunta do Lucas sobre conflito entre
duas regras críticas no mesmo prompt — um exemplo real e concreto de como
raciocinar sobre precedência de instruções em engenharia de prompt, tema
que rende bem em conteúdo técnico. Conforme `docs/linkedin/pipeline.md`,
a fila ainda tem o post de introdução geral do projeto aguardando decisão
do Lucas antes de qualquer post no meio da história — não registrei
candidato novo agora, só sinalizando aqui pra não se perder (mesma
observação já feita no handoff da Fase 7, que também tem candidatos
represados esperando essa decisão).

### Próximo passo imediato

Fase 8 fechada, verificada ponta a ponta. Próxima fase pendente é a Fase
9 (integração ponta a ponta) — sem escopo definido ainda, próxima sessão
de planejamento começa por aí, em conversa.

### Links

- Spec: `docs/specs/fase8-widget-chat.md`
- Roadmap master: `docs/roadmap.md`, seção Fase 8 + "Pendências
  conhecidas"
- Ajustes no n8n (fora do Git): `D:/n8n-fase8-ajustes/`
