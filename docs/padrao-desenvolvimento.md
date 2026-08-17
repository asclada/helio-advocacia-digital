# Padrão de Desenvolvimento — Hélio Advocacia Digital

> Este documento é a fonte de verdade de **processo** do projeto. Toda sessão nova
> do Claude Code deve ler este arquivo, o roadmap master (`docs/roadmap.md`) e o
> handoff mais recente antes de começar a trabalhar. Não é opcional — é o padrão
> fixo do projeto a partir da Fase 2.

## Princípio central

Todo trabalho de implementação segue o ciclo:

```
SPEC → PLAN MODE → APROVAÇÃO → TESTE (red) → IMPLEMENTAÇÃO (green) → REVISÃO → COMMIT + HANDOFF
```

Regras não negociáveis:
- Nenhuma implementação começa sem plano aprovado.
- Nenhum plano é aprovado sem spec correspondente em `docs/specs/`.
- Nenhuma feature é considerada pronta sem teste passando.

---

## 1. Plan Mode (obrigatório)

- Toda sessão de execução no Claude Code que for **criar ou alterar código**
  começa em Plan Mode (`Shift+Tab` duas vezes, ou `/plan`).
- O plano deve referenciar explicitamente a spec correspondente em `docs/specs/`.
- Claude só sai do Plan Mode após aprovação explícita do Lucas no chat.
- Um plano válido lista:
  - Arquivos que serão criados/alterados
  - Ordem de implementação
  - Testes que serão escritos (e o que cada um valida)
  - Decisões em aberto ou riscos identificados
- Exceções (não exigem Plan Mode): correções triviais de 1 linha, ajuste de
  texto/conteúdo estático sem lógica, leitura/investigação de código existente.

## 2. SDD — Specs em `docs/specs/`

- Formato de arquivo: `docs/specs/[fase]-[feature].md`
  - Exemplo: `docs/specs/fase2-button.md`
- Toda spec contém, no mínimo:
  - **Objetivo** — o que essa feature/componente resolve
  - **Casos de uso** — cenários reais de uso no site
  - **Critérios de aceite** — testáveis, não vagos (ex: "botão deve ter estado
    de foco visível e contraste mínimo AA" em vez de "botão deve ser acessível")
  - **Decisões de design referenciadas** — link para o token/decisão do design
    system que essa spec usa (cor, tipografia, espaçamento)
- Specs são versionadas no Git. Mudança de spec = commit próprio, separado da
  implementação, com mensagem clara (`docs: atualiza spec do Button para incluir variante loading`).
- Specs pequenas e focadas (um componente ou uma feature por arquivo) — não
  um mega-documento por fase inteira.

## 3. TDD — quando é obrigatório

**Obrigatório para:**
- Todo componente de UI reutilizável (Button, Card, Input, Badge, etc.)
- Toda lógica de negócio (formulários, integração com n8n, validações, parsing)
- Acessibilidade de componentes interativos (`jest-axe` ou equivalente)

**Não obrigatório, mas recomendado:**
- Conteúdo estático puro (texto, seções sem lógica) — nesse caso, um snapshot
  test simples já é suficiente, não precisa de TDD completo.

**Camadas de teste do projeto (nessa ordem de prioridade):**
1. **Comportamento/contrato** (Vitest + Testing Library) — o componente
   renderiza certo, responde a props, dispara eventos corretos.
2. **Acessibilidade automatizada** (`jest-axe`) — crítico para um site de
   advocacia, que precisa ser sério e acessível.
3. **Regressão visual** (Playwright/Chromatic) — só entra a partir da fase em
   que houver páginas completas montadas, não é necessário para componentes
   isolados da Fase 2.

## 4. Sequência padrão por feature/componente

1. Escrever ou atualizar a spec em `docs/specs/`
2. Abrir sessão Claude Code em Plan Mode, referenciando a spec
3. Lucas aprova o plano (ou pede ajuste)
4. Claude escreve o(s) teste(s) primeiro — devem falhar (red)
5. Claude implementa até o teste passar (green)
6. Lucas faz revisão visual/funcional
7. Se for o fim da sessão de trabalho: avaliar Learning System e LinkedIn
   Workflow (ver seção 8) — **antes** de escrever o handoff
8. Escrever handoff em `docs/handoffs/` (ver seção 6 — sempre antes da
   sugestão de commits)
9. Commit referenciando a spec (ex: `feat(ui): implementa Button conforme fase2-button.md`)

## 5. Estilo de comunicação e explicação técnica

Contexto: o Lucas está aprendendo desenvolvimento de software do zero. Por
isso, toda explicação técnica dada durante o trabalho neste projeto — no
Claude Code e em sessões de apoio no Claude Chat — é didática **por
padrão**, não como cortesia pontual quando alguém pede. Regras concretas:

- Nenhum jargão técnico aparece sem explicação. Ex: não dizer "memoiza o
  componente" sem antes explicar, em uma frase, o que isso significa e por
  que importa no contexto específico.
- Todo termo técnico novo é contextualizado na primeira vez que aparece na
  conversa — uma definição breve, não um parágrafo à parte.
- Toda decisão técnica vem acompanhada do porquê, não só do o quê. Ex: não
  basta "usei `useMemo` aqui" — precisa vir junto "porque X seria
  recalculado a cada render, o que causaria Y".
- Critério de sucesso: o Lucas deve conseguir reexplicar o conceito depois,
  com as próprias palavras — inclusive em contexto de entrevista de
  emprego. Se uma explicação não passaria nesse teste, ela não está
  didática o suficiente.

Isso complementa a seção 9 do `CLAUDE.md` do projeto ("Estilo de
explicação técnica"), que já registra o princípio geral — esta seção
formaliza a prática como parte do padrão de processo e adiciona o
critério de verificação (reexplicar com as próprias palavras).

Não se aplica a artefatos técnicos em si (mensagens de commit, specs,
nomes de variáveis/funções no código) — esses seguem a convenção técnica
normal definida na seção "Idioma" do `CLAUDE.md`, sem precisar de
"tradução didática" embutida no artefato.

## 6. Handoff entre sessões

Todo fim de sessão de trabalho real gera um arquivo:
`docs/handoffs/[data]-[fase]-[resumo].md`, com dois blocos:

1. **Prompt pronto para a próxima sessão** — no topo do arquivo, dentro de
   um bloco de código, pronto para o Lucas colar como primeira mensagem da
   próxima sessão do Claude Code. Não é um registro histórico, é a
   instrução de retomada em si. Deve conter: em qual projeto/fase está,
   quais arquivos ler antes de começar (padrão de processo, spec(s)
   relevante(s), este próprio handoff), um resumo de uma linha do que a
   sessão anterior deixou pronto, e a tarefa concreta imediata a começar.
2. **Registro da sessão** — o corpo do arquivo, em prosa, contendo:
   - O que foi feito nesta sessão
   - Testes criados (e status: passando/pendente)
   - Decisões tomadas e por quê
   - Próximo passo imediato (mesma tarefa do prompt do topo, aqui com mais
     contexto/detalhe)
   - Link para a(s) spec(s) relevante(s)

### Quando sugerir escrever, proativamente

Claude deve **proativamente sugerir escrever o handoff**, sem esperar o
Lucas pedir, em qualquer uma destas situações:
- A sessão está se aproximando de um bom ponto de parada natural (contexto
  longo, feature concluída, ponto natural de handoff).
- O Lucas sinaliza que vai encerrar a sessão — diz que vai parar, ou digita
  `/exit` — e ainda não existe handoff escrito cobrindo o trabalho feito
  nesta sessão.

No segundo caso, a sugestão precisa vir **antes** de qualquer confirmação
de saída, não depois — o objetivo é nunca perder uma sessão sem handoff
por falta de aviso.

### Ordem no fechamento de sessão: handoff antes da sugestão de commits

O handoff é sempre a **primeira coisa escrita** ao encerrar uma sessão —
antes de qualquer sugestão de como dividir os commits. Dois motivos:

1. O handoff resume a sessão inteira, incluindo decisões de última hora
   (ex: um refinamento de design feito depois da implementação original já
   estar pronta) — sugerir commits antes de escrever o handoff arrisca
   esquecer essas decisões na mensagem de commit.
2. O próprio handoff é um dos arquivos que entra nos commits — ele precisa
   existir antes de eu conseguir listar corretamente quais arquivos fazem
   parte de qual commit.

---

## 7. Roadmap master (`docs/roadmap.md`)

`docs/roadmap.md` é o documento único de referência de **em que fase e
checkpoint o projeto está** — todas as fases numeradas (0 a 10), status de
cada uma, e checkboxes de checkpoint dentro das fases mais próximas (fases
distantes ficam só como esqueleto de escopo provável, intencionalmente,
até a fase anterior concluir e o escopo real ser definido em conversa).

Não confundir com:
- `docs/padrao-desenvolvimento.md` (este arquivo) — **como** trabalhamos.
- `docs/specs/*.md` — especificação técnica de cada componente/feature.
- `docs/handoffs/*.md` — registro de cada sessão individual.

Regras:
- Lido no início de **toda** sessão, junto com este arquivo e o handoff
  mais recente (ver nota no topo deste documento).
- Ao final de cada checkpoint ou fase concluída, as checkboxes e o status
  correspondente no roadmap são atualizados como parte do commit daquele
  checkpoint — o mesmo tratamento que já damos ao handoff.

## 8. Sistemas complementares: Learning, LinkedIn e OpenSpec

Três sistemas de documentação existem no projeto além dos já descritos
acima. Os dois primeiros tinham ficado esquecidos desde a criação inicial
— nunca tinham sido incorporados ao fluxo real de sessão até esta seção
ser escrita (2026-08-17). Esta seção formaliza isso.

### 8.1 Learning System (`docs/learning/`)

Registra evolução real de aprendizado do Lucas — não é log de atividade
(isso já é Git/roadmap). Fonte de verdade completa: `docs/learning/README.md`
(critérios de aprendizado real nas seções 2 e 5; níveis de domínio na
seção 7; regras de evidência na seção 8).

**Gatilho:** ao final de cada checkpoint/componente concluído, **antes de
escrever o handoff**, avaliar se algo na sessão atende aos critérios das
seções 7-8 do `docs/learning/README.md` — evidência real de compreensão
ou aplicação (explicação do Lucas, debugging feito por ele, decisão técnica
justificada), não apenas "a tarefa foi feita".

**Regra:** se atender, **perguntar** ao Lucas se devo criar a session em
`docs/learning/sessions/` (formato: seção 9 do README) e atualizar
`docs/learning/progress.md`. Nunca criar automaticamente — a decisão de
registrar é sempre do Lucas.

### 8.2 LinkedIn Workflow (`docs/linkedin/`)

Identifica experiências reais do projeto com potencial editorial para
LinkedIn — camada editorial sobre evidências reais, nunca gera conteúdo
nem publica sozinho. Fonte de verdade completa: `docs/linkedin/README.md`
(princípios na seção 4; critérios de "Post Candidate" na seção 8; formato
na seção 14); estados do pipeline em `docs/linkedin/pipeline.md`.

**Gatilho:** no mesmo momento da avaliação do Learning System (final de
checkpoint, antes do handoff), avaliar se algo no checkpoint atende aos
critérios de relevância potencial da seção 8 do `docs/linkedin/README.md`
— um erro importante, uma decisão difícil, uma descoberta, uma primeira
implementação, um marco, ou uma situação em que a prática contradisse uma
expectativa.

**Regra:** se atender, **sinalizar** o candidato potencial ao Lucas e
**perguntar** se devo registrar em `docs/linkedin/candidates/`, seguindo o
formato da seção 14 do README. Claude nunca decide sozinho publicar ou
criar um candidato sem perguntar — essa regra já está no design do
sistema (seção 13 do README); esta seção só garante que o sistema seja de
fato consultado a cada checkpoint, em vez de ficar esquecido.

### 8.3 OpenSpec (`openspec/`) — pausado conscientemente

Fluxo de especificação formal (`explore → propose → apply → sync → archive`,
já descrito na seção 6 do `CLAUDE.md` do projeto), usado na Fase 0-1
(`openspec/changes/archive/2026-08-15-establish-design-system-and-stack/`,
sincronizado em `openspec/specs/design-system` e `openspec/specs/site-foundation`).

**Decisão (2026-08-17):** o openspec fica pausado a partir da Fase 2 —
não reativado agora. `docs/specs/*.md` + Plan Mode/TDD (seções 1-4 deste
documento) são o fluxo real de especificação a partir daqui. Container/
Section e Button **não** ganham change/spec retroativa no openspec — o
conteúdo já arquivado da Fase 0-1 permanece como histórico, sem edição.
Nota equivalente registrada em `openspec/config.yaml` (campo `context`),
pra qualquer sessão futura que abra o openspec diretamente também ver essa
decisão. Sem gatilho de avaliação por checkpoint, diferente de 8.1/8.2 —
se a pausa for revertida no futuro, isso volta a ser uma decisão explícita
em conversa, não uma reativação automática.

### Não confundir os quatro sistemas

- `docs/roadmap.md` — **em que fase/checkpoint** o projeto está.
- `docs/specs/*.md` + `openspec/` — **o que** foi/será especificado e
  construído (requisitos, critérios de aceite, decisões técnicas).
- `docs/learning/` — **o que o Lucas aprendeu**, com evidência.
- `docs/linkedin/` — **o que vale virar conteúdo público**, a partir do
  que já aconteceu nos outros três.

## Checklist rápido (colar no início de cada sessão do Claude Code)

- [ ] Li o roadmap master (`docs/roadmap.md`) para saber em que fase/checkpoint o projeto está?
- [ ] Li o handoff da última sessão em `docs/handoffs/`?
- [ ] Existe spec para o que vou construir? Se não, paro e escrevo primeiro.
- [ ] Estou em Plan Mode antes de tocar em código?
- [ ] O plano foi aprovado pelo Lucas?
- [ ] Os testes foram escritos antes da implementação?
- [ ] Ao terminar: avaliei Learning System e LinkedIn Workflow (seção 8),
      escrevi o handoff primeiro, depois sugeri o commit referenciando a
      spec + roadmap atualizado?
