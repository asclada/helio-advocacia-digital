# Fase 1 — Design System e Stack (concluída)

**Data de conclusão:** 15 de agosto de 2026
**Change do OpenSpec:** `establish-design-system-and-stack`

## Technical Outcome

- Stack do site institucional decidida e implementada: Next.js (App
  Router) + TypeScript + Tailwind CSS v4 + shadcn/ui, com deploy pensado
  para Vercel.
- Paleta de cores (navy + dourado) e tipografia (Playfair Display, Inter,
  Cormorant Garamond) extraídas dos valores reais do site em produção
  (não reinventadas) e formalizadas como tokens centrais em
  `src/app/globals.css`, documentadas em `docs/design-tokens.md`.
- Tokens semânticos do shadcn/ui remapeados da paleta neutra padrão para a
  identidade navy + dourado do escritório.
- Ponto único de integração com o agente de triagem por IA criado:
  `src/app/api/chat/route.ts`, um proxy sem estado para um webhook n8n
  configurado via `N8N_WEBHOOK_URL`, com erro explícito quando a variável
  não está definida.
- Confirmado, por decisão explícita e por verificação no código, que este
  repositório não tem (nem deve ter) dependência direta de Supabase — o
  CRM é um produto separado e multi-tenant.
- Build de produção validado (`npm run build`), incluindo verificação de
  que o build falha com erro de tipo (TypeScript strict mode) e que a
  página inicial é pré-renderizada como HTML estático completo.
- `CLAUDE.md` do projeto atualizado com a stack decidida (seção 11, antes
  "A definir").

## Learning Outcome

Documentação e planos ficam desatualizados rápido: o `design.md` desta
change assumia Tailwind v3 (`tailwind.config.ts`), mas a ferramenta já
tinha mudado pra configuração de tema em CSS (`@theme`) quando a
implementação começou. Em vez de forçar a versão antiga só pra bater com
o plano escrito, a decisão certa foi adaptar a implementação e documentar
a mudança — o plano serve o trabalho, não o contrário.

Segundo aprendizado, sobre rigor: eu tinha uma proposta de paleta baseada
em referências visuais (Dribbble, sites de advocacia), mas o valor
correto de verdade estava no HTML do site que já está no ar. Sempre que o
dado real existir na fonte, ele deve ser puxado de lá — mesmo uma
aproximação que "parece razoável" não substitui o valor verdadeiro.
