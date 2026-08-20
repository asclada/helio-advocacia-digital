# Fase 8 — Widget de Chat no Site

Spec enxuta, dado o prazo firme de hoje (decisão do Lucas, ver conversa) — não
tem o nível de detalhe da Fase 7.

## 1. Objetivo

Construir o widget de chat flutuante que conecta o site ao agente de triagem
por IA já migrado e ativo em produção na Fase 7 (`route.ts` → n8n),
substituindo a reserva de espaço/z-index do Footer por um componente
funcional. Prioridade: funcionar bem em mobile (maioria do tráfego do site),
não elaborar visualmente além do necessário.

## 2. Casos de uso

- Visitante chega no site, vê um balão de notificação junto ao chip ("Olá,
  posso te ajudar?") — o painel não abre sozinho.
- Visitante clica no balão (fora do X) ou no chip → painel abre: header com
  foto/nome do Dr. Hélio, saudação inicial estática, campo de input pronto.
- Visitante fecha o balão pelo X sem interagir → balão some, chip continua
  disponível pra abrir o painel depois.
- Visitante envia uma mensagem → bolha do usuário aparece imediatamente,
  indicador de loading enquanto aguarda, cada item de `respostas` vira uma
  bolha do agente separada, com timestamp.
- Chamada ao backend falha (rede ou erro HTTP) → bolha de erro genérica,
  widget continua utilizável, pode tentar de novo. **Cobre também a
  primeira mensagem real da conversa**: como o `conversa_id` já existe
  desde a abertura do painel (seção 3) e a saudação é só estática/local,
  não existe um caminho especial pra "primeira mensagem" — ela usa o
  mesmo `sendMessage`/tratamento de erro de qualquer mensagem seguinte,
  sem estado extra pra travar se falhar.
- Visitante fecha e reabre o painel (mesma visita ou visita futura) → mesmo
  `conversa_id` reaproveitado do `localStorage` — só o id persiste, não o
  histórico visual das bolhas.
- Mobile: teclado abre ao focar o input sem esconder o campo, mensagens
  continuam roláveis, áreas de toque do chip/balão/botão de enviar
  confortáveis.

## 3. Decisões de design (critério próprio, autorizado pelo Lucas dado o prazo)

- **Chip:** círculo fixo, canto inferior direito, cor `--color-gold` (acento
  da marca) — não `--color-whatsapp` (verde), pra não confundir com o CTA de
  WhatsApp já existente no Header/Footer (canal separado, atendimento
  manual).
- **Painel:** reaproveita `Dialog` do Base UI (mesmo padrão do `NavDrawer`),
  mas com `modal={false}` e sem `Backdrop` — o site continua navegável com o
  painel aberto, comportamento padrão de widget de chat (diferente do drawer
  de nav, que bloqueia a página de propósito).
- **z-index:** usa o token já reservado `--z-chat-widget` (Fase 1/3); o
  `<div data-slot="chat-widget-reserve">` do `footer.tsx` é removido,
  substituído pelo componente real.
- **Painel mobile:** `height: 100dvh` (viewport dinâmico) em vez de `100vh`,
  pra respeitar o teclado virtual sem JS extra; input como último item de
  uma coluna flex (não `position: fixed` isolado), pra subir naturalmente
  acima do teclado.
- **Avatar do header do painel:** reaproveita `/images/dr-helio-sobre.png`
  (já tratado como retrato circular na Fase 4.3).
- **Saudação inicial do painel:** texto estático client-side, não chama o
  backend — evita gastar uma chamada real ao agente por algo que não é
  decisão de triagem.
- **Balão de notificação:** aparece ao montar o widget, sem delay/timer, sem
  lógica de "já viu antes" — mantido simples de propósito, dado o escopo de
  hoje.

## 4. Componentes novos (`src/components/chat/`)

- `chat-widget.tsx` — orquestrador (client component): estado de
  aberto/fechado, mensagens, loading, erro, notificação.
- `use-chat-conversation.ts` — hook: gera/lê `conversa_id` do
  `localStorage`, mantém lista de mensagens, expõe `sendMessage`, `loading`,
  `error`.
- `chat-chip.tsx` — botão circular.
- `chat-notification-bubble.tsx` — balão de notificação com X.
- `chat-panel.tsx` — painel (`Dialog`), header, lista de mensagens, input.
- `chat-message-bubble.tsx` — uma bolha (usuário/agente), com timestamp.

`ChatWidget` é montado uma vez em `src/app/layout.tsx`, ao lado de
`Header`/`Footer`.

## 5. Contrato com o backend (sem mudança em `route.ts`)

- Requisição: `POST /api/chat` com `{ conversa_id, mensagem }`.
- Resposta esperada: `{ respostas: string[] }` — cada item vira uma bolha do
  agente.
- Erro (fetch falha, status não-2xx, ou JSON inesperado): tratado de forma
  uniforme como falha genérica, sem tentar parsear detalhe do erro.

## 6. Testes (escopo reduzido, decisão explícita dado o prazo — mesmo
   precedente já aberto na Fase 6.1)

- TDD só em `use-chat-conversation.ts` (lógica de negócio: geração/persistência
  de `conversa_id`, envio, mapeamento de `respostas` em mensagens, tratamento
  de erro) — é a peça que corresponde a "lógica de negócio/integração com
  n8n", que `padrao-desenvolvimento.md` (seção 3) marca como obrigatório.
- Resto (chip, balão, painel, bolhas, responsividade mobile) verificado
  manualmente por você no navegador, incluindo mobile real.
- Sem `jest-axe`/snapshot nesta fase, só por prazo — não é o novo padrão do
  projeto daqui pra frente.

## 7. Fora de escopo

Animações elaboradas além do básico de abrir/fechar, indicador de
"digitando...", persistência de histórico visual entre sessões,
refinamento pixel-a-pixel contra substancelaw.ca no desktop.

## 8. Critérios de aceite

- [ ] Chip visível em toda página, canto inferior direito, cor gold, área de
      toque ≥44px.
- [ ] Balão de notificação aparece ao carregar, com X que fecha só o balão
      (chip continua disponível).
- [ ] Clique no balão (fora do X) ou no chip abre o painel.
- [ ] Painel: header com foto+nome do Dr. Hélio, saudação estática inicial,
      lista de bolhas, input fixo na base, botão de enviar.
- [ ] `conversa_id` gerado na primeira abertura, persistido em
      `localStorage`, reaproveitado em aberturas seguintes.
- [ ] Envio: bolha do usuário aparece imediatamente, loading enquanto
      aguarda, cada item de `respostas` vira uma bolha do agente com
      timestamp.
- [ ] Falha de rede/HTTP: bolha de erro genérica, widget não trava, próximo
      envio volta a funcionar normalmente.
- [ ] Mobile real: teclado não esconde o input, painel ocupa a tela sem
      cortar conteúdo, scroll de mensagens funciona.
- [ ] `tsc`/`lint`/`build` limpos; testes do hook passando.
