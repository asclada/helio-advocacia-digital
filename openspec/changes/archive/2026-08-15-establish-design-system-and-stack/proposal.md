## Why

Fase 0 (auditoria) concluiu que a base técnica atual — HTML estático sem
build e Tailwind via CDN — será descartada. Antes de construir qualquer
seção ou componente do novo site, o projeto precisa de uma stack técnica
formalmente decidida e de um design system (tokens de cor, tipografia e
espaçamento) que sirva de base consistente para todas as fases seguintes.
Sem isso, cada nova seção reinventaria decisões visuais e técnicas já
resolvidas na Fase 0.

## What Changes

- Adotar **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**
  como stack do site institucional (`helio-advocacia-digital`).
- O agente de triagem por IA roda externamente em **n8n** (mesmo padrão
  usado nos demais agentes de WhatsApp da Vibe Digital). O Next.js hospeda
  apenas a UI do widget de chat e uma API route de proxy que repassa
  mensagens para um webhook do n8n via variável de ambiente
  (`N8N_WEBHOOK_URL`) — sem gerenciar estado de conversa e sem chamar LLM
  diretamente.
- **Sem dependência direta de Supabase neste repositório**: o fluxo de
  dados real é `site → n8n → Supabase (do CRM, projeto separado e
  multi-tenant)`. O CRM é um produto próprio, reutilizável para outros
  clientes futuros, e fica fora do escopo desta fase e deste repositório.
- Formalizar os **tokens de design** herdados da Fase 0: paleta (navy +
  dourado), tipografia (Playfair Display, Inter, Cormorant Garamond) e uma
  escala de espaçamento, como configuração reutilizável (ex: `tailwind
  config` / tokens) em vez de valores hardcoded por seção.
- Não inclui construção de componentes de UI (botões, cards, CTA de
  WhatsApp) — isso fica para a Fase 2.

## Capabilities

### New Capabilities
- `site-foundation`: decisões estruturais da stack técnica do site
  (framework, linguagem, estilização, ponto único de integração externa
  com o agente de IA via n8n, e a exclusão explícita de Supabase como
  dependência direta deste repositório).
- `design-system`: tokens de design (paleta de cores, tipografia, escala
  de espaçamento) que servem de base para todas as seções e componentes
  construídos nas fases seguintes.

### Modified Capabilities
<!-- Nenhuma — projeto ainda não tem specs consolidadas em openspec/specs/. -->

## Impact

- Cria a estrutura inicial do projeto Next.js (ainda inexistente neste
  repositório): `package.json`, configuração de TypeScript, Tailwind e
  shadcn/ui.
- Define `N8N_WEBHOOK_URL` como variável de ambiente esperada pela API
  route de proxy do widget de chat (a própria integração com n8n é
  implementação de fase futura — aqui apenas se reserva o ponto de
  integração).
- Não afeta o site em produção atual (`asclada/site-helio-kleison-adv`),
  que continua no ar até o redesign estar pronto para substituí-lo.
- Não cria nenhum artefato do CRM (nem rotas, nem cliente Supabase) —
  confirmado como fora de escopo total desta fase.
