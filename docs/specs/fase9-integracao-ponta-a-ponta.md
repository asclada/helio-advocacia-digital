# Fase 9 — Integração Ponta a Ponta

Diferente da Fase 8 (prazo apertado, escopo enxuto), esta fase é sobre
confiança no sistema antes do lançamento real — mantém o rigor de teste da
Fase 7, não a velocidade da Fase 8.

## 1. Objetivo

Validar o sistema completo já montado (site + widget + agente de IA + CRM)
funcionando junto, do jeito que um usuário real vai experienciar — não mais
testar peças isoladas. Inclui uma peça de funcionalidade nova identificada
ao revisar o objetivo original desta fase no roadmap: notificação por
e-mail ao Dr. Hélio quando um lead é concluído, que nunca chegou a ser
construída nas fases anteriores.

## 2. Escopo

A fase roda em duas etapas sequenciais, não em paralelo. Motivo: a Etapa B
mexe no workflow de produção do n8n (mesmo workflow sensível da Fase 7, com
guards estruturais já corrigidos uma vez) — rodar tudo junto com a validação
do sistema existente dificultaria isolar causa caso algo quebre (regressão
do sistema já existente vs. bug da feature nova). A Etapa B só começa após
checkpoint explícito de aprovação ao final da Etapa A.

### Etapa A — Validação do sistema existente

#### 2.1 Testes de fluxo completo, mobile e desktop

- Percorrer o site publicado no Vercel (não mais localhost/dev) em pelo
  menos um dispositivo mobile real e um desktop.
- Confirmar que todas as seções, navegação e o widget de chat funcionam de
  ponta a ponta no ambiente mais próximo de produção.

#### 2.2 Conversas simuladas pelo caminho real do site

- Reaproveitar os 6 cenários da spec da Fase 7 (completa, retomada, fora de
  escopo, ignora-telefone-depois-fornece, recusa total, só e-mail) — rodando
  através do widget de verdade, não via curl direto no n8n.
- Confirmar em cada um: o agente responde corretamente, o lead é gerado
  quando esperado, e os campos gravados no banco batem com o que foi
  conversado (mesma checagem campo-a-campo que pegou os bugs reais na
  Fase 7).

#### 2.3 Verificação no CRM

- Cada lead gerado nos testes aparece corretamente na listagem e no painel
  de detalhe (Fase 6.2).
- Conferir que os dois bugs da Fase 7 (desalinhamento de campos, emissão
  prematura do marcador de conclusão) continuam corrigidos sob uso real.

#### 2.4 Verificação da correção de retomada de conversa

- Confirmar que o comportamento de "oi" após reload funciona como esperado
  no fluxo real do site (não só no teste isolado já feito na Fase 8).
- A limitação conhecida (janela entre nome e confirmação de LGPD) já está
  aceita e registrada em "Pendências conhecidas" — não é critério de
  aceite desta fase, só não regride além do que já foi observado.

#### Checkpoint da Etapa A

Sistema existente confirmado funcionando, sem regressões — **aprovação
explícita de Lucas necessária antes de iniciar a Etapa B.** Se a Etapa A
revelar algum problema, a Etapa B não começa até o problema ser resolvido.

### Etapa B — Notificação por e-mail ao concluir lead

Só inicia após aprovação explícita do checkpoint da Etapa A.

#### 2.5 Notificação por e-mail ao concluir um lead (funcionalidade nova)

Peça de escopo que faltava desde o objetivo original da Fase 9 no roadmap
master e nunca foi construída em nenhuma fase anterior — decisão tomada em
conversa nesta sessão de planejamento.

**Decisões de design (aprovadas por Lucas):**
- **Destinatário:** só o Dr. Hélio, por enquanto (não a secretária).
- **Disparo:** nó de e-mail nativo do n8n (SMTP/Gmail), sem serviço
  transacional dedicado — decisão consciente de simplicidade para começar;
  revisitar se o volume de leads justificar Resend/SendGrid no futuro.
- **Gatilho:** logo após o node que grava o lead com `status = 'concluido'`
  no Supabase (mesmo ponto que já tem o guard estrutural da Fase 7
  garantindo telefone/e-mail presente) — um lead só gera e-mail se de fato
  foi concluído, nunca em triagem abandonada ou fora de escopo.
- **Conteúdo do e-mail:** nome do lead, telefone e/ou e-mail informado,
  área de interesse (quando coletada) e o campo `resumo` (Fase 6.2) quando
  populado pelo agente — a confirmar durante a implementação se o node de
  saída estruturada da Fase 7 já popula `resumo` de forma confiável; se não
  popular, o e-mail sai sem essa linha em vez de travar o envio.
- **Sem link direto para o CRM no e-mail** nesta fase — Dr. Hélio já acessa
  o CRM por rotina; adicionar o link é melhoria trivial para depois, não
  crítica agora.

**Onde a mudança acontece:** workflow de produção do n8n, fora deste
repositório — mesmo padrão de execução da Fase 7/8 (script descartável em
pasta local fora do Git, **backup do workflow antes e depois da mudança**).

**Reverificação restrita aos cenários relevantes:** dos 6 cenários originais
da Fase 7, só "completa" e "só e-mail" geram lead com sucesso — são os
únicos que passam pelo ponto onde o nó de e-mail atua. Reexecutar apenas
esses dois, com objetivo restrito a: (a) confirmar que o e-mail dispara
corretamente nesses casos, e (b) confirmar que não houve regressão no guard
estrutural do `[[TRIAGEM_CONCLUIDA]]`. Os cenários que terminam sem lead
(fora de escopo, recusa total) não precisam ser re-rodados nesta etapa.

### 2.6 Limpeza de dados de teste

Executada por último, depois de Etapa A e Etapa B completas.

- Mesma rotina já estabelecida: qualquer lead/triagem gerado nos testes
  desta fase é limpo do banco antes de considerar a fase encerrada.
- Aproveitar para limpar também o lote acumulado das Fases 7 e 8, já
  sinalizado como pendente nos respectivos handoffs.

## 3. Fora de escopo (fica para a Fase 10)

- Domínio oficial, subdomínio do CRM, decisão de plano Vercel.
- Qualquer ajuste de infraestrutura de deploy.
- Notificação por e-mail para a secretária, link direto ao CRM no corpo do
  e-mail, ou troca para serviço transacional dedicado.

## 4. Critérios de aceite

### Aceite Etapa A

- [ ] Site publicado percorrido de ponta a ponta em 1 mobile real + 1
      desktop, todas as seções/navegação/widget funcionando.
- [ ] 6 cenários da Fase 7 reexecutados pelo widget real, com verificação
      campo-a-campo no Supabase.
- [ ] Cada lead de teste conferido no CRM (listagem + painel de detalhe).
- [ ] Retomada de conversa ("oi" após reload) confirmada no fluxo real do
      site, fora da janela conhecida de limitação (LGPD).
- [ ] **Checkpoint:** aprovação explícita de Lucas registrada antes de
      iniciar a Etapa B.

### Aceite Etapa B

- [ ] E-mail de notificação chega ao Dr. Hélio quando um lead é concluído,
      com os campos definidos na seção 2.5.
- [ ] E-mail **não** dispara em triagens abandonadas/fora de escopo.
- [ ] Cenários "completa" e "só e-mail" reexecutados após a mudança no n8n,
      confirmando disparo do e-mail e ausência de regressão no guard
      estrutural do `[[TRIAGEM_CONCLUIDA]]`.
- [ ] Backup do workflow do n8n preservado (antes e depois da mudança).
- [ ] Todo dado de teste gerado nesta fase (e o lote acumulado de
      Fases 7-8) limpo do Supabase antes de encerrar a fase.
