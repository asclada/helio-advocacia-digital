# Learning System

## 1. Propósito

Este sistema registra a evolução técnica real do Lucas durante o
desenvolvimento deste projeto: aprendizado, compreensão, aplicação prática,
descobertas e evolução de domínio sobre conceitos de desenvolvimento de
software, IA aplicada, automação e engenharia de software.

Ele **não é** um diário de atividades nem um histórico de conversas.

## 2. Diferença entre aprendizado e atividade

- **Atividade** = algo foi feito (uma tarefa executada, um arquivo criado,
  uma feature implementada). Isso já é rastreado por Git e por OpenSpec —
  não precisa ser repetido aqui.
- **Aprendizado** = o Lucas passou a entender, explicar ou aplicar algo que
  antes não dominava, com evidência observável disso.

Uma tarefa concluída não é, por si só, aprendizado registrável. Só vira
registro quando há evidência de compreensão ou aplicação real (ver seção 7).

## 3. O que deve ser registrado

- Conceitos técnicos compreendidos ou aplicados pela primeira vez.
- Mudanças de nível de domínio (ver seção 6), sempre com evidência.
- Descobertas relevantes durante debugging, implementação ou revisão.
- Verificações de aprendizagem que produziram evidência útil (explicações
  corretas, aplicação prática, decisões técnicas justificadas).

## 4. O que NÃO deve ser registrado

Este sistema não deve virar:

- log de comandos;
- log de prompts;
- histórico de conversas;
- lista de commits;
- lista de tarefas;
- documentação técnica do produto;
- especificação de produto;
- registro de decisões arquiteturais;
- catálogo de bugs.

Documentação técnica e decisões de arquitetura pertencem ao `openspec/`.
Histórico de código pertence ao Git. Metodologia e roadmap pertencem ao
`PROJECT-GUIDE.md`.

## 5. Quando uma learning session deve ser criada

Claude não cria uma session automaticamente após toda tarefa. Uma session em
`sessions/` só deve ser criada quando:

- houver aprendizado significativo e demonstrável;
- houver uma descoberta relevante;
- o Lucas solicitar explicitamente;
- ou uma verificação de aprendizagem produzir evidência útil.

## 6. Como Claude deve interagir com o sistema

- Claude pode **sugerir** uma verificação de aprendizagem (pergunta,
  previsão, explicação com as próprias palavras, pequena implementação).
- Claude **nunca declara** que o Lucas aprendeu ou dominou algo sem
  evidência observável.
- Claude não eleva um nível de domínio (seção 6) só porque um conceito foi
  mencionado, explicado por Claude, ou porque "apareceu no código".
- Ao registrar algo, Claude atualiza `progress.md` e, quando fizer sentido,
  cria uma entrada em `sessions/` seguindo o formato da seção 9.

## 7. Níveis de domínio

- **Conheço** — já vi e reconheço o conceito.
- **Entendo** — consigo explicar o conceito e compreender código que o
  utiliza.
- **Consigo fazer** — consigo aplicar o conceito sozinho em uma situação
  conhecida.
- **Consigo raciocinar** — consigo investigar problemas, tomar decisões e
  aplicar o conceito em situações novas.

"Aprendi X" não é suficiente para elevar o nível. A elevação de nível exige
evidência (seção 8).

## 8. Evidência

Sempre que possível, um aprendizado registrado deve ter evidência
observável, como:

- explicação correta feita pelo Lucas;
- aplicação prática de um conceito;
- debugging realizado pelo Lucas;
- implementação feita pelo Lucas;
- capacidade de analisar ou tomar uma decisão técnica.

Sem evidência, o registro não deve afirmar domínio — no máximo, descreve
exposição ao conceito.

## 9. Formato de uma learning session

Cada arquivo em `sessions/` deve seguir esta estrutura, preenchendo apenas o
que for aplicável:

```markdown
# [Título curto da session] — [data]

## Contexto
O que estava sendo feito quando o aprendizado ocorreu.

## O que foi aprendido
Conceito(s) envolvido(s).

## O que o Lucas consegue explicar
Em que medida ele consegue verbalizar o conceito com as próprias palavras.

## O que ainda não entende
Lacunas identificadas, se houver.

## Evidência prática
O que comprova o aprendizado (explicação, código, debugging, decisão).

## Nível de domínio atual
Um dos quatro níveis da seção 7, por conceito.

## Próximo passo
O que ajudaria a avançar para o próximo nível.
```

Nenhuma session foi criada ainda — este é apenas o formato para uso futuro.

## 10. Relação com os demais documentos

- **CLAUDE.md** — regras permanentes de comportamento do agente. Não é
  afetado por este sistema.
- **PROJECT-GUIDE.md** — metodologia de aprendizagem, roadmap e prompts de
  referência. O Learning System registra o resultado real de aprendizagem;
  o guia descreve o plano e as ferramentas para chegar lá.
- **openspec/** — requisitos, decisões e mudanças técnicas formalizadas.
  Fonte de verdade sobre o que o projeto é e o que foi decidido.
- **docs/learning/** (este sistema) — evolução e aprendizado pessoal do
  Lucas. Nunca é fonte de verdade para requisitos, arquitetura ou decisões
  técnicas do projeto.
- **Git** — histórico de alterações do código.
- **README.md da raiz** — documentação/apresentação do projeto.

Cada sistema responde por um tipo de informação; este documento não duplica
os demais.
