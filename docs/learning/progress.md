# Progress — Learning System

Painel de evolução real de aprendizagem do Lucas neste projeto. Não é o
roadmap do projeto (isso vive em `PROJECT-GUIDE.md`) nem a lista de
requisitos/mudanças técnicas (isso vive em `openspec/`). Aqui só entra o que
já foi demonstrado com evidência, conforme os critérios definidos em
`README.md`.

Este arquivo é atualizado por Claude apenas quando há evidência de
aprendizado — nunca automaticamente após uma tarefa concluída.

## Fase atual

Fase 4 — Montagem das páginas do site, em andamento (Fase 4.1 — Hero da Home
— concluída; Fase 4.2 — Áreas de Atuação — é o próximo checkpoint).

## Conceitos em aprendizagem

_Nenhum conceito registrado ainda._

| Conceito | Nível de domínio | Evidência |
|---|---|---|
| — | — | — |

## Habilidades práticas

| Habilidade | Nível de domínio | Evidência |
|---|---|---|
| CSS Grid (`align-items: stretch`) + padrão `mt-auto` para alinhar rodapés entre cards de conteúdo desigual numa mesma linha de grid | Consigo raciocinar | [docs/learning/sessions/2026-08-17-card-height-alignment.md](sessions/2026-08-17-card-height-alignment.md) |
| Ancoragem de elemento na borda de um container (`align-self`/`position: absolute`) e raciocínio sobre efeitos colaterais de posicionamento em elementos irmãos | Entendo | [docs/learning/sessions/2026-08-18-hero-anchoring-technique.md](sessions/2026-08-18-hero-anchoring-technique.md) |

## Checkpoints de aprendizagem

_Nenhum checkpoint de aprendizagem atingido ainda._

## Evidências de evolução

- 2026-08-17 — diagnóstico independente da causa raiz de um bug de
  alinhamento visual no componente `Card` (Fase 2), com correção técnica
  proposta pelo próprio Lucas e verificada por uma pergunta de caso de
  borda antes de aceitar a explicação. Ver
  [sessão completa](sessions/2026-08-17-card-height-alignment.md).
- 2026-08-18 — durante a revisão visual do Hero (Fase 4.1), propôs sem
  ajuda duas técnicas CSS candidatas (`align-self: end`, `position:
  absolute`) para ancorar um elemento na borda de um container, e
  antecipou um efeito colateral real (impacto em elementos irmãos que
  compartilham padding) — ainda não verificado se explica por que a
  técnica alternativa usada evita esse efeito colateral. Ver [sessão
  completa](sessions/2026-08-18-hero-anchoring-technique.md).

---

Estado inicial: nenhuma competência foi registrada até o momento. Este
painel só deve crescer conforme aprendizado real e demonstrável ocorrer,
nunca por antecipação.
