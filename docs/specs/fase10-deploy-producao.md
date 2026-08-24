# Fase 10 — Deploy de Produção e QA Final

Modo rápido, escopo enxuto — prazo firme: site precisa estar no ar sob o
domínio oficial ainda hoje (2026-08-20). Diferente da Fase 9 (rigor de teste
completo), esta fase reaproveita a validação funcional já feita na Etapa A e
foca só no que a troca de domínio/infra pode quebrar.

## 1. Objetivo

Cutover do site e do CRM dos domínios temporários (`*.vercel.app`) para os
domínios oficiais do escritório, com decisão de plano Vercel e QA mínimo
restrito ao que muda nesta fase.

## 2. Escopo

### 2.1 Domínio do site

Apontar `heliokleisonadvocacia.com.br` para o projeto Vercel do site
institucional (repo `helio-site`). Configurar DNS no registrador, aguardar
propagação, confirmar SSL emitido automaticamente pela Vercel.

### 2.2 Subdomínio do CRM

Apontar `painel.heliokleisonadvocacia.com.br` para o projeto Vercel do CRM
(repo `helio-advocacia-crm`). Mesmo processo do item 2.1.

### 2.3 Plano Vercel

**Decisão (aprovada por Lucas em 2026-08-20): permanece Hobby por agora.**
Hobby tecnicamente não licencia uso comercial nos termos de serviço da
Vercel — risco aceito conscientemente para não travar o lançamento de hoje
com uma decisão de custo recorrente. Revisitar upgrade para Pro depois do
lançamento, sem data definida.

### 2.4 QA pós-cutover (restrito ao que mudou)

- Acessar o site pelo domínio novo (não mais `.vercel.app`) e confirmar que
  carrega, sem erro de certificado.
- Confirmar que o widget de chat funciona no domínio novo. Checagem
  específica pedida por precaução (troca de domínio pode expor CORS ou
  variável de ambiente amarrada à URL antiga) — inspeção do
  `src/app/api/chat/route.ts` mostra que o proxy não tem nenhuma lógica
  amarrada a domínio (sem checagem de `Origin`, sem URL hardcoded, só
  depende de `N8N_WEBHOOK_URL`), o que baixa o risco, mas o teste manual
  continua sendo feito por ser barato e cobrir outras causas possíveis.
- Acessar o CRM pelo subdomínio novo e confirmar login funcionando para os
  3 usuários (Dr. Hélio, secretária, Lucas).

**Não repetir:** os 6 cenários completos da Fase 7/9 nem a bateria de
campo-a-campo no Supabase — já validados na Etapa A e não mudam com troca de
domínio.

## 3. Fora de escopo

- Qualquer coisa que não seja domínio, SSL, plano Vercel, ou a checagem
  mínima de que o cutover não quebrou nada.
- **Bug conhecido da Etapa B** (UI do widget trava em "Enviando..." sem
  timeout/retry quando o agente demora muito) — decisão explícita de Lucas
  em 2026-08-20: fica como pendência aceita, não é regressão nova desta
  fase. Ver `docs/roadmap.md`, seção "Pendências conhecidas".
- Upgrade para plano Pro da Vercel (ver 2.3).
- Notificação por e-mail para a secretária, link direto ao CRM no e-mail,
  troca para serviço transacional dedicado (fora de escopo desde a Fase 9).

## 4. Critérios de aceite

- [x] Site acessível via `heliokleisonadvocacia.com.br`, SSL válido.
- [x] CRM acessível via `painel.heliokleisonadvocacia.com.br`, SSL válido,
      login funcionando para os 3 usuários.
- [x] Widget de chat funcional no domínio novo (1 teste manual, não
      bateria completa).
- [x] Plano Vercel: Hobby confirmado como decisão consciente (não omissão).

## 5. Fechamento

**Concluído em 2026-08-24.** O bloqueio do handoff de 2026-08-20 (subdomínio
`painel.` em "Invalid Configuration") resolveu — o registro CNAME propagou na
zona DNS da Vercel, SSL emitido automaticamente. Login confirmado para os 3
usuários (Dr. Hélio, secretária, Lucas) no subdomínio novo.

### Technical Outcome

Cutover completo dos dois domínios temporários (`*.vercel.app`) para os
domínios oficiais do escritório: site em `heliokleisonadvocacia.com.br` e CRM
em `painel.heliokleisonadvocacia.com.br`, ambos com SSL válido emitido
automaticamente pela Vercel. Login verificado para os 3 usuários reais no
domínio de produção. Plano Vercel Hobby mantido como decisão consciente.
Nenhuma mudança de código nesta fase — só configuração de infraestrutura
(DNS/domínios) nos dashboards da Vercel.

### Learning Outcome

Quando um domínio já tem os nameservers delegados a um provedor (aqui, a
Vercel), os registros DNS individuais (como o CNAME de um subdomínio) passam
a ser gerenciados no painel desse provedor, não mais no registrador — o
registrador só continua sendo o dono do domínio, não da zona DNS. Isso também
explica por que a resolução do bloqueio não exigiu nenhuma ação manual nova
além de aguardar a própria Vercel propagar o registro, já que ela era
autoritativa pela zona inteira.
