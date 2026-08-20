# Handoff — 2026-08-20 — Fase 9, Etapa A concluída

## Prompt pronto para a próxima sessão

```
Estou no projeto Hélio Advocacia Digital. A Etapa A da Fase 9 (validação
do sistema existente — site publicado, 6 cenários da Fase 7 pelo widget
real, CRM, retomada de conversa) foi concluída e o checkpoint já foi
aprovado por mim em 2026-08-20. Pode começar direto pela Etapa B
(notificação por e-mail).

Antes de começar, leia:
- docs/roadmap.md — seção Fase 9, com o resumo dos 3 bugs da Etapa A e
  o escopo da Etapa B
- docs/specs/fase9-integracao-ponta-a-ponta.md — spec completa, seção
  2.5 tem as decisões de design da Etapa B já aprovadas (destinatário,
  provedor, gatilho, conteúdo do e-mail)
- este handoff (2026-08-20-fase9-etapa-a.md) — detalhe técnico completo
  dos 3 bugs da Etapa A, do diagnóstico de latência, e do ajuste de logo
  pedido no meio da sessão
```

## Registro da sessão

### O que foi entregue

- **Etapa A da Fase 9 validada de ponta a ponta**: site publicado no
  Vercel percorrido em desktop e celular real (Lucas); os 6 cenários da
  Fase 7 (completa, retomada, fora de escopo, ignora-telefone-depois-
  fornece, recusa total, só e-mail) reexecutados pelo widget de verdade,
  com verificação campo-a-campo; retomada de conversa pós-Fase 8
  reconfirmada; leads conferidos no CRM (rodado localmente, já que ainda
  não tem deploy — decisão que fica pra Fase 10).
- **3 bugs reais encontrados e corrigidos** (detalhe abaixo).
- **2 ajustes adicionais fora do escopo original**, pedidos por Lucas no
  meio da sessão: fix de CSS no chat e troca do logo do header.

### Bug 1 — `N8N_WEBHOOK_URL` ausente em produção

A variável de ambiente nunca tinha sido configurada no projeto Vercel de
produção — só existia no `.env` local. Resultado: todo `POST /api/chat`
retornava 500 (`"Chat is not configured: N8N_WEBHOOK_URL is not set"`),
para qualquer visitante real do site. Encontrado na primeiríssima
mensagem de teste da Etapa A. Corrigido por Lucas direto no dashboard da
Vercel (env var + redeploy) — confirmado via `fetch` direto no
`/api/chat` antes de retomar os testes.

### Bug 2 — Agente pulava nome/LGPD/telefone quando a 1ª mensagem já descrevia o problema

O mais sério dos três. Causa raiz: a regra "Reconhecimento de mensagem
vinda de anúncio" do Bloco A do system message do n8n (criada na era
WhatsApp, pra tráfego pago com mensagem pré-preenchida do tipo "preciso
de ajuda com meu contrato, tem seguro embutido") instruía a IA a pular a
lista numerada do Bloco A e "seguir direto para o Bloco B" quando a
primeira mensagem já era clara sobre o problema. A instrução não deixava
explícito que essa exceção afeta *só* a pergunta específica do Bloco A —
o modelo generalizou de forma inconsistente: no Cenário 1 (primeira
mensagem já descrevendo o problema) o agente ainda pediu nome/LGPD/
telefone normalmente; no Cenário 6 (mesmo padrão de mensagem inicial),
pulou tudo isso, indo direto da confirmação do problema pras perguntas
de triagem — só percebido porque o resumo final saiu com
`Nome: [Nome não informado na etapa inicial]`.

Mais grave que os desvios de não-determinismo já documentados nas Fases
7/8: nessa conversa específica, **o consentimento LGPD nunca chegou a
ser solicitado nem registrado**. É a terceira vez que esse mesmo padrão
de ambiguidade aparece (gate de contato do Bloco H na Fase 7; janela de
retomada vs. LGPD na Fase 8; agora isto) — uma instrução curta e distante
("siga direto para o Bloco B") tem mais peso pro modelo do que a regra
geral "não pule blocos" da Seção 5, mesmo essa sendo mais abrangente.

**Correção:** frase de desambiguação explícita adicionada logo depois da
instrução original do Bloco A, mesmo padrão de "IMPORTANTE"/"REGRA
CRÍTICA" já usado na Seção 8 — deixando claro que a exceção afeta só a
pergunta do Bloco A, nunca os Blocos 0/0.1/0.2. Aplicada em produção via
script com âncora exata e backup do workflow antes/depois (mesmo
processo da Fase 7/8), em `D:/n8n-fase9-ajustes/` (fora do Git, mesmo
motivo de sempre — lógica de negócio sensível). Revalidado com sucesso
repetindo a mesma abertura de conversa que causou o bug (Cenário 6
reteste): nome/LGPD/telefone pedidos normalmente, resumo final saiu com
o nome correto.

### Bug 3 — Bolha do chat com scroll horizontal em texto sem espaços

Encontrado por Lucas testando pelo celular contra produção (print em
`D:\projeto-completo-advogado-helio\PRINTS TESTES\erro-tamanho-chat.png`).
Um e-mail longo digitado pelo usuário não quebrava de linha dentro da
bolha — criava uma barra de rolagem horizontal em vez de quebrar o
texto. Causa: `whitespace-pre-wrap` (adicionado na Fase 8 pra preservar
quebras de linha das respostas do agente) preserva quebras *existentes*,
mas não força a quebra de um token sem espaços que excede a largura da
bolha. Corrigido com `break-words` em `chat-message-bubble.tsx` — não
foi necessário alterar o tamanho do painel (a hipótese inicial de
aumentar o widget foi descartada; o problema era puramente de CSS de
quebra de texto).

### Diagnóstico sem ação corretiva — latência na mensagem de encerramento

Lucas notou que a mensagem final (depois de confirmar o resumo) demorou
quase 1 minuto, enquanto o resto da conversa sempre respondeu rápido.
Investigado via API de execuções do n8n (`/api/v1/executions`): numa
execução real, o nó `Google Gemini Chat Model` sozinho levou 54.0s dos
54.3s totais — todo o resto do workflow (Postgres, roteamento, resposta
ao site) levou menos de 0.1s cada. Não é gargalo de infraestrutura: é a
única mensagem do fluxo inteiro em que o modelo precisa gerar tudo de
uma vez — mensagem curta de encerramento + `RESUMO_INTERNO` (10 linhas)
+ JSON `DADOS_ESTRUTURADOS` (12 campos) + marcador técnico. Aceito como
comportamento esperado (mesma categoria "não é bug, é como o LLM
funciona" já usada pra outros itens do projeto) — uma correção
estrutural real (separar em duas chamadas ao modelo) seria uma mudança
de arquitetura maior, não justificada só por ~50s no fim de uma
conversa de vários minutos.

### Ajuste adicional 1 — logo do header

Pedido por Lucas no meio da sessão, fora do escopo original da Etapa A.
Trocado o monograma "HK" de texto (`font-display`, cor gold) pela
submarca oficial do escritório — recortada do arquivo de referência
(`D:\projeto-completo-advogado-helio\referencias\Submarca HELIO
KLEISON.jpg`), círculo completo com o texto "HELIO KLEISON · ADVOCACIA E
CONSULTORIA JURÍDICA" ao redor do monograma HK (espada + balança), fundo
transparente via `sharp` (crop + máscara circular de alpha) — funciona
sem emenda visível nos dois estados do header (transparente sobre o
Hero, sólido depois de rolar), já que o fundo da página inteira é a
mesma cor navy em ambos os casos. Novo asset em
`public/images/submarca-hk.png`. Mesmo componente (`Header`) serve
desktop e mobile, sem duplicação de código.

Duas rodadas de recorte: a primeira isolou só o monograma (sem o anel de
texto), mas cortava as pernas do H e do K; Lucas pediu pra usar a
submarca inteira em vez de tentar isolar o monograma — solução mais
simples e sem risco de corte.

### Testes e verificação

- 208/208 testes passando (suíte completa), incluindo o teste do
  `Header` atualizado (de `getByText("HK")` para verificação do `<img>`
  com `src` contendo `submarca-hk`, já que o monograma virou imagem
  decorativa — `alt=""`, mesma lógica do `aria-hidden` original, dado
  que o nome do escritório já aparece em texto ao lado).
- `tsc`/`lint` limpos.
- Verificação manual: desktop via automação de navegador (produção e
  local); mobile real por Lucas contra produção, incluindo o teste que
  achou o Bug 3.

### Outcome (CLAUDE.md §8)

- **Technical Outcome**: Etapa A da Fase 9 validada ponta a ponta, com 3
  bugs reais corrigidos (env var ausente em produção, ambiguidade de
  prompt causando pulo de LGPD/nome, CSS de quebra de linha no chat) e 2
  ajustes adicionais (diagnóstico de latência documentado sem correção
  necessária; logo do header trocado pela submarca oficial). Etapa B
  (notificação por e-mail) definida na spec, ainda não implementada.
- **Learning Outcome**: terceira ocorrência do mesmo padrão de bug de
  engenharia de prompt no projeto (Bloco H na Fase 7, janela LGPD na
  Fase 8, Bloco A nesta fase) — uma instrução curta e próxima do ponto
  de decisão ("siga direto para X") tem mais peso pro modelo do que uma
  regra geral distante ("não pule blocos"), mesmo esta sendo mais
  abrangente. A correção nas três vezes foi a mesma: uma frase de
  desambiguação explícita bem no ponto onde a ambiguidade nasce, não um
  reforço genérico em outro lugar do prompt. Virou um padrão reconhecível
  o suficiente pra valer registro formal (ver seção seguinte).

### Candidato a LinkedIn

Padrão real e repetido (3 ocorrências, 3 fases diferentes) de um mesmo
tipo de bug de engenharia de prompt — instrução local de "siga direto
para X" sobrepondo regra geral distante, resolvido sempre da mesma
forma (desambiguação explícita no ponto de decisão, não reforço
genérico). Tema técnico forte, storytelling fácil (achar um bug real
testando, diagnosticar a causa raiz no prompt, corrigir com precisão
cirúrgica). Conforme `docs/linkedin/pipeline.md`, a fila ainda tem o
post de introdução geral do projeto represado aguardando decisão do
Lucas — não registrei candidato novo formalmente agora, só sinalizando
aqui (mesma observação já feita nos handoffs das Fases 7 e 8).

### Próximo passo imediato

Etapa A concluída e documentada. **Checkpoint aprovado por Lucas em
2026-08-20**, ainda na mesma sessão — próxima sessão começa direto pela
Etapa B (notificação por e-mail), sem precisar reconfirmar. Ver seção
2.5 da spec para as decisões de design já aprovadas (destinatário,
provedor, gatilho, conteúdo do e-mail).

### Links

- Spec: `docs/specs/fase9-integracao-ponta-a-ponta.md`
- Roadmap master: `docs/roadmap.md`, seção Fase 9
- Ajustes no n8n (fora do Git): `D:/n8n-fase9-ajustes/`
- Print do bug do chat: `D:\projeto-completo-advogado-helio\PRINTS
  TESTES\erro-tamanho-chat.png`
- Arquivo de referência da submarca:
  `D:\projeto-completo-advogado-helio\referencias\Submarca HELIO
  KLEISON.jpg`
