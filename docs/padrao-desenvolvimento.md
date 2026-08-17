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

## 5. Handoff entre sessões

Todo fim de sessão de trabalho real gera um arquivo:
`docs/handoffs/[data]-[fase]-[resumo].md`

Contendo:
- O que foi feito nesta sessão
- Testes criados (e status: passando/pendente)
- Decisões tomadas e por quê
- Próximo passo imediato (para a próxima sessão começar sem re-explicação)
- Link para a(s) spec(s) relevante(s)

Claude deve **proativamente sinalizar** quando a sessão está se aproximando de
um bom ponto de parada (contexto longo, feature concluída, ponto natural de
handoff) — não esperar o Lucas perceber sozinho.

---

## Checklist rápido (colar no início de cada sessão do Claude Code)

- [ ] Li o handoff da última sessão em `docs/handoffs/`?
- [ ] Existe spec para o que vou construir? Se não, paro e escrevo primeiro.
- [ ] Estou em Plan Mode antes de tocar em código?
- [ ] O plano foi aprovado pelo Lucas?
- [ ] Os testes foram escritos antes da implementação?
- [ ] Ao terminar: commit referenciando a spec + handoff atualizado?
