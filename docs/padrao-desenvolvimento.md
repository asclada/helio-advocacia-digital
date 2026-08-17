# Padrão de Desenvolvimento — Hélio Advocacia Digital

> Este documento é a fonte de verdade de **processo** do projeto. Toda sessão nova
> do Claude Code deve ler este arquivo junto com o handoff mais recente antes de
> começar a trabalhar. Não é opcional — é o padrão fixo do projeto a partir da Fase 2.

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
7. Commit referenciando a spec (ex: `feat(ui): implementa Button conforme fase2-button.md`)
8. Se for o fim da sessão de trabalho: escrever handoff em `docs/handoffs/`

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

---

## Checklist rápido (colar no início de cada sessão do Claude Code)

- [ ] Li o handoff da última sessão em `docs/handoffs/`?
- [ ] Existe spec para o que vou construir? Se não, paro e escrevo primeiro.
- [ ] Estou em Plan Mode antes de tocar em código?
- [ ] O plano foi aprovado pelo Lucas?
- [ ] Os testes foram escritos antes da implementação?
- [ ] Ao terminar: commit referenciando a spec + handoff atualizado?
