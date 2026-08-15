# LinkedIn Workflow

## 1. Propósito

Este workflow identifica e estrutura experiências reais do projeto que têm
potencial para se tornar conteúdo público no LinkedIn — histórias que
demonstrem aprendizado real, evolução prática, raciocínio técnico, tomada de
decisão, resolução de problemas, capacidade de investigar, capacidade de
construir e capacidade de aprender com erros.

Ele é uma **camada editorial sobre evidências reais** produzidas pelo
projeto. Não gera conteúdo, não decide sozinho, não publica.

## 2. Escopo

Este sistema **não é**:

- um calendário editorial;
- uma ferramenta de social media management;
- um gerador automático de conteúdo;
- um substituto do Learning System.

Ele **não deve**:

- exigir frequência de postagem;
- definir horários de postagem;
- registrar métricas de likes/seguidores;
- criar calendário editorial obrigatório;
- criar dezenas de templates;
- obrigar todo commit a virar post.

## 3. Relação com os demais sistemas

- **Learning System** (`docs/learning/`) responde: *"o que eu aprendi e
  quais evidências demonstram esse aprendizado."*
  **LinkedIn Workflow** responde: *"quais experiências e aprendizados têm
  potencial para serem comunicados publicamente."*
  Um candidato pode referenciar uma learning session, mas não deve duplicar
  o conteúdo inteiro dela.

- **Git/GitHub** é a evidência histórica do que foi feito. Um candidato
  pode referenciar commits relevantes, mas não deve reproduzir o histórico
  Git.

- **OpenSpec** é o que foi formalmente especificado e construído. Um
  candidato pode referenciar uma spec/change quando ela for parte relevante
  da história.

Este workflow nunca é fonte de verdade sobre requisitos, arquitetura,
aprendizado ou decisões técnicas — ele apenas aponta para essas fontes.

## 4. Princípios obrigatórios

1. **Evidence First** — todo conteúdo potencial nasce de algo que realmente
   aconteceu no projeto.
2. **Learning Before Publishing** — aprendizado e experiência devem ser
   registrados/identificados antes de virarem conteúdo público.
3. **No Forced Content** — o projeto nunca é alterado, expandido ou
   manipulado apenas para produzir conteúdo para LinkedIn.
4. **Traceability** — sempre que possível, um candidato aponta para a
   evidência que o sustenta (learning session, commit, OpenSpec change/spec,
   implementação, decisão técnica documentada).
5. **Public-Safe by Design** — o workflow é público e nunca registra
   credenciais, secrets, API keys, tokens, dados reais de clientes, dados
   pessoais, informações jurídicas confidenciais, dados internos sensíveis
   do escritório ou detalhes de infraestrutura que possam comprometer
   segurança.
6. **Recruiter-Readable** — o objetivo é estruturar histórias que
   demonstrem aprendizado real, evolução prática, raciocínio técnico,
   tomada de decisão, resolução de problemas, investigação, construção e
   aprendizado com erros.

## 5. O que é um "Post Candidate"

Um **Post Candidate** é o registro estruturado de uma experiência real do
projeto com potencial editorial para LinkedIn — não é o post em si, é a
matéria-prima avaliada antes de qualquer decisão de publicação.

## 6. O que deve ser capturado

- Um evento real do projeto com evidência observável.
- Contexto suficiente para entender o problema, o raciocínio e o resultado.
- Referência(s) à evidência que sustenta o candidato.

## 7. O que não deve ser capturado

- Conteúdo fictício ou hipotético.
- Declarações genéricas sem evidência ("aprendi X", "usei Y", "construí Z"
  sem processo por trás).
- Dados sensíveis (ver seção 10).
- Duplicação integral de uma learning session, de um histórico de commits
  ou de uma spec/change do OpenSpec.

## 8. Critérios para relevância potencial

Um bom candidato não é necessariamente algo grande. Pode ser:

- um erro importante;
- uma mudança de entendimento;
- uma decisão difícil;
- uma descoberta;
- uma investigação;
- uma primeira implementação;
- um marco;
- uma situação em que a prática contradisse uma expectativa.

O único requisito não negociável: **precisa haver evidência real.**

### Sobre autenticidade

O workflow favorece posts que mostrem processo e raciocínio, não apenas
declarações de resultado. Sempre que possível, a narrativa deve conseguir
responder:

- qual era o problema?
- o que eu pensava inicialmente?
- o que aconteceu?
- o que investiguei?
- o que descobri?
- qual decisão tomei?
- o que mudou no meu entendimento?
- qual evidência existe?

Essas perguntas são **critérios de qualidade**, não um formulário
obrigatório para todo candidato.

## 9. Regras de rastreabilidade

Sempre que possível, um candidato deve apontar para a evidência que o
sustenta:

- learning session (`docs/learning/sessions/...`);
- commit (hash);
- OpenSpec change/spec;
- implementação específica;
- decisão técnica documentada.

Um candidato sem nenhuma evidência rastreável não deve avançar no pipeline
além de `Captured`.

## 10. Regras de segurança e privacidade

O repositório é público e representa um projeto real de um escritório de
advocacia. Nenhuma entrada, em nenhum estado do pipeline, pode registrar:

- credenciais;
- secrets;
- API keys;
- tokens;
- dados reais de clientes;
- dados pessoais;
- informações jurídicas confidenciais;
- dados internos sensíveis do escritório;
- detalhes de infraestrutura que possam comprometer segurança.

**Quando houver conflito entre potencial de conteúdo e confidencialidade, a
confidencialidade sempre vence.**

## 11. Fluxo geral do sistema

```
evento real no projeto
        ↓
observação/sinalização (Claude ou Lucas)
        ↓
Post Candidate criado em docs/linkedin/candidates/
        ↓
avaliação (pipeline.md)
        ↓
decisão humana de publicar ou não
```

O sistema **identifica oportunidades de conteúdo, mas nunca publica
automaticamente**. A decisão final de publicação é sempre humana.

## 12. Estados do pipeline

Ver `pipeline.md` para a definição completa dos estados (`Captured`,
`Evaluating`, `Approved`, `Drafted`, `Published`) e das transições entre
eles.

## 13. Responsabilidade humana

Claude pode sugerir que um evento tem potencial de virar candidato e pode
ajudar a estruturar o registro. Claude **nunca decide sozinho** que algo
deve ser publicado, **nunca escreve o post final** sem solicitação
explícita, e **nunca move um candidato para `Published`** — essa transição
só ocorre depois que o Lucas publicou manualmente no LinkedIn.

## 14. Formato de um Post Candidate

Cada arquivo em `candidates/` deve conter, no mínimo:

```markdown
# [Título provisório]

- **Data:** [AAAA-MM-DD]
- **Categoria:** [Learning | Building | Problem → Solution | Technical Decision | Milestone]
- **Status:** [Captured | Evaluating | Approved | Drafted | Published]
- **Fase do projeto (se aplicável):** [referência à fase do PROJECT-GUIDE.md]

## Resumo do acontecimento
O que aconteceu, em poucas frases.

## O que foi aprendido
O conceito, prática ou entendimento que evoluiu.

## Evidência
O que comprova que isso realmente aconteceu (explicação dada, código,
debugging, decisão tomada).

## Fonte / rastreabilidade
Referência concreta: learning session, commit (hash), OpenSpec change/spec,
implementação.

## Por que isso é relevante
Por que essa experiência vale ser comunicada publicamente.

## Público / ângulo possível
Para quem essa história fala e sob que ângulo (ex: recrutador técnico,
outro dev iniciante, cliente em potencial).

## Observações de privacidade
Confirmação explícita de que não há dado sensível, ou o que precisa ser
generalizado/removido antes de publicar.
```

Nenhum arquivo de exemplo foi criado — este é apenas o formato para uso
futuro.

## 15. Categorias iniciais

- **Learning** — compreensão de um conceito novo.
- **Building** — construção de algo concreto.
- **Problem → Solution** — um problema real e como foi resolvido.
- **Technical Decision** — uma decisão técnica e o raciocínio por trás dela.
- **Milestone** — um marco relevante do projeto.

Nenhuma categoria adicional deve ser criada sem necessidade real
demonstrada.
