# Handoff — 2026-08-20 — Fase 10 em andamento (sessão pausada)

Sessão interrompida no meio da Fase 10 — Lucas precisou sair. Retomar
direto pelo ponto bloqueado abaixo.

## Prompt pronto para a próxima sessão

```
Estou no projeto Hélio Advocacia Digital, no meio da Fase 10 (deploy de
produção). Já fiz: domínio do site movido pro projeto novo (confirmado
no ar, SSL válido, widget testado), e o CRM já foi deployado pela
primeira vez na Vercel. Falta resolver o subdomínio painel. do CRM, que
está em "Invalid Configuration", e depois testar o login dos 3 usuários.

Leia docs/handoffs/2026-08-20-fase10-deploy-producao.md pro detalhe
completo do que falta.
```

## Registro da sessão

### O que foi entregue

**Spec criada:** `docs/specs/fase10-deploy-producao.md`, com duas decisões
já aprovadas por Lucas:
- Plano Vercel: **Hobby por agora** (custo adiado conscientemente).
- Bug conhecido da Etapa B (widget sem timeout/retry): **pendência aceita**,
  fora de escopo desta fase.

**Site — domínio oficial:**
- Lucas moveu `heliokleisonadvocacia.com.br` do projeto Vercel do site
  antigo para o do redesign (`helio-site`), direto pelo dashboard — sem
  passo manual no Registro.br porque os nameservers já apontavam para a
  Vercel desde antes.
- Verificado via browser real: site carrega no domínio oficial, SSL
  válido, conteúdo do redesign correto.
- Widget de chat testado ponta a ponta no domínio novo: mensagem real
  enviada, agente respondeu (fluxo de triagem iniciou normalmente).
  Conversa **não foi completada de propósito**, para não gerar lead de
  teste no Supabase. Confirma que a troca de domínio não quebrou nada —
  `src/app/api/chat/route.ts` não tem lógica amarrada a domínio (sem
  checagem de `Origin`, sem URL hardcoded), só depende de
  `N8N_WEBHOOK_URL`, então o risco de CORS/env cogitado na spec era baixo
  na prática.

**CRM — primeiro deploy:**
- Repositório `asclada/helio-advocacia-crm` importado na Vercel, mesma
  conta/time do projeto do site.
- Env vars cadastradas: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (valores pegos no Supabase dashboard,
  projeto "Helio Advocacia CRM" → Settings → API).
- `SUPABASE_SERVICE_ROLE_KEY`, que aparece no `.env.example` do repo do
  CRM, foi conferida no código (`grep` em `src/`) e **não é usada em
  lugar nenhum do app** — é documentação residual da Fase 5 (a chave real
  é usada pelo n8n, fora deste app). Não foi cadastrada na Vercel, não
  precisa ser.

### Bloqueio atual — subdomínio do CRM

`painel.heliokleisonadvocacia.com.br` foi adicionado ao projeto do CRM na
Vercel, mas ficou em **"Invalid Configuration"**. A tela de Domains mostra
o registro que falta:

```
Type: CNAME
Name: painel
Value: 4ff470440e79bb74.vercel-dns-017.com.
```

**Causa:** mesmo com os nameservers do domínio já apontando para a Vercel
(ela é autoritativa pela zona toda), esse registro específico ainda não
tinha sido criado quando Lucas checou — pode ser só timing (a Vercel cria
sozinha por ser dona da zona) ou pode precisar ser cadastrado manualmente.

**Como resolver na próxima sessão:**
1. Primeiro, checar se resolveu sozinho — recarregar a página de Domains
   do projeto do CRM na Vercel.
2. Se continuar "Invalid Configuration": ir em **Vercel → Team/conta →
   Domains** (página do time, não do projeto) → `heliokleisonadvocacia.com.br`
   → seção **DNS Records** → adicionar manualmente o registro CNAME acima.
   Importante: isso é diferente de mexer no Registro.br — como os
   nameservers já são da Vercel, quem guarda os registros agora é o
   próprio painel da Vercel, não mais o registrador.
3. Depois de válido, SSL é emitido automaticamente. Confirmar isso antes
   de seguir para o teste de login.

### Pendente depois de resolver o subdomínio

- [ ] Acessar `painel.heliokleisonadvocacia.com.br` e confirmar SSL válido.
- [ ] Testar login dos 3 usuários (Dr. Hélio, secretária, Lucas) no
      subdomínio novo — nenhum login foi testado ainda nesta fase.
- [ ] Fechar a spec (`docs/specs/fase10-deploy-producao.md`), marcar os
      critérios de aceite, atualizar `docs/roadmap.md` para ✅ e registrar
      Technical/Learning Outcome (CLAUDE.md §8).
- [ ] Perguntar a Lucas sobre commit — só a spec e o roadmap foram tocados
      neste repo até agora (nenhum código mudou); as mudanças reais desta
      fase são só configuração no dashboard da Vercel, fora do Git.

### Outcome (CLAUDE.md §8) — parcial, fase ainda não fechada

Não aplicável ainda — fase em andamento, sem checkpoint fechado.

### Links

- Spec: `docs/specs/fase10-deploy-producao.md`
- Roadmap master: `docs/roadmap.md`, seção Fase 10
- Handoff da Fase 9 / Etapa B: `docs/handoffs/2026-08-20-fase9-etapa-b.md`
