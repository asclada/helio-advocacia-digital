# LinkedIn Workflow — Pipeline

Painel operacional dos Post Candidates. Ver `README.md` para os princípios,
o formato de candidato e as regras de segurança que governam este pipeline.

Todas as filas abaixo começam vazias. Este arquivo é atualizado apenas
quando um candidato real existir e transitar de estado — nunca por
antecipação.

## Estados

### Captured
Um evento real do projeto foi identificado como potencialmente relevante e
um arquivo foi criado em `candidates/` com o mínimo de contexto e, se
possível, uma referência de evidência. Ainda não foi avaliado.

**Transição para `Evaluating`:** quando houver contexto suficiente para
avaliar o candidato contra os critérios de relevância e rastreabilidade do
`README.md`.

### Evaluating
O candidato está sendo avaliado quanto a: existência de evidência real,
rastreabilidade, valor da história (processo/raciocínio, não só resultado),
e segurança/privacidade.

**Transição para `Approved`:** quando o candidato atende aos critérios
(evidência real, rastreável, public-safe) e o Lucas concorda que vale a
pena estruturar como post.
**Transição de volta/descarte:** se não houver evidência suficiente ou se
houver risco de privacidade não contornável, o candidato não avança — pode
ficar parado em `Evaluating` ou ser removido.

### Approved
O candidato foi validado como relevante e seguro para virar conteúdo
público. Ainda não existe texto de post.

**Transição para `Drafted`:** quando um rascunho de post for escrito a
partir do candidato.

### Drafted
Existe um rascunho de post baseado no candidato, pronto para revisão final
do Lucas.

**Transição para `Published`:** somente depois que o Lucas publicar
manualmente no LinkedIn. Esta transição nunca é feita unilateralmente por
Claude.

### Published
O post foi efetivamente publicado no LinkedIn. Estado final do candidato.

## Filas atuais

### Captured
- [Testes verdes não bastam: um bug de alinhamento que só apareceu na revisão visual](candidates/2026-08-17-card-visual-review-catches-bug.md) — 2026-08-17, Fase 2 (`Card`)
- [Link ou botão? Um aviso do console que quase virou o bug errado](candidates/2026-08-18-whatsapp-cta-link-vs-button-role.md) — 2026-08-18, Fase 3 (Header/CTA de WhatsApp)
- [O "bug" que só existia porque a aba estava em segundo plano](candidates/2026-08-18-intersection-observer-hidden-tab.md) — 2026-08-18, Fase 3 (Header/scroll-spy)
- [Primeiro painel autenticado do projeto: Next.js + Supabase Auth + RLS](candidates/2026-08-19-fase6-painel-autenticado-crm.md) — 2026-08-19, Fase 6 (painel autenticado, repo do CRM)

### Evaluating
_Vazia._

### Approved
_Vazia._

### Drafted
_Vazia._

### Published
_Vazia._

---

Primeiro candidato criado em 2026-08-17 (ver fila `Captured` acima).
