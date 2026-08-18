# Fase 3 — Header, Nav e Footer

**Status:** Plan Mode concluído — decisões travadas, pronto para TDD
**Depende de:** Fase 2 (componentes base — Button, Badge, Card, Input/Label, Container/Section)
**Fonte de conteúdo:** site atual (heliokleisonadvocacia.com.br), auditado na Fase 0 e reconfirmado nesta sessão via fetch direto. Copy e estrutura de navegação **não mudam** — só a implementação (design system + tecnologia) muda.

**Nota sobre nomenclatura de cor:** os termos "gold-600" e "navy-950" usados abaixo (herdados da sessão de planejamento) são informais — o tema só define 3 tokens brutos de dourado (`gold`/`gold-light`/`gold-dark`, ver `docs/specs/fase2-button.md`) e um único `navy` de fundo. "gold-600" mapeia para o token `gold`; "navy-950" mapeia para o token `navy`. Nenhum token de cor novo é necessário nesta fase.

---

## 1. Contexto e decisão arquitetural

O site atual é uma **landing page de seção única** (single-page), não um site multi-página. A navegação do Header e do Footer aponta para âncoras internas da mesma página:

| Link | Âncora | Seção |
|---|---|---|
| Áreas de Atuação | `#atuacao` | Cards com as 3 frentes de atuação (venda casada de seguro, empréstimo fraudado, consignado a menor) |
| Sobre mim | `#sobre` | Bio do Dr. Helio Kleison |
| Dúvidas | `#faq` | Perguntas frequentes |
| Contato | `#contato` | Formulário de contato |

Essa decisão arquitetural (single-page com scroll) **se mantém** na reconstrução — é um padrão adequado para site de advocacia solo, com todo o funil (apresentação → prova social/autoridade → objeções → conversão) em uma rolagem só.

**Implicação técnica:** como não há mudança de rota entre as seções, o "link ativo" da navegação não pode ser resolvido comparando URL — precisa ser feito com `IntersectionObserver` (a API do browser que detecta quando um elemento entra/sai da área visível da tela), monitorando qual `<section id="...">` está mais visível no viewport no momento, e destacando o link correspondente no Header.

---

## 2. Header

### 2.1 Conteúdo (copy — não muda)

- **Logo/marca:** monograma "HK" + nome "Helio Kleison" + tagline "ADVOCACIA & CONSULTORIA" (duas linhas de texto ao lado do monograma)
- **Nav:** Áreas de Atuação · Sobre mim · Dúvidas · Contato (âncoras, ver tabela acima)
- **CTA:** "Fale Conosco" com ícone de WhatsApp, abre `https://wa.me/5584994776673` com mensagem pré-preenchida. **Decidido em Plan Mode:** uma única mensagem genérica, reaproveitada em todo o site (Header e Footer) — `"Olá, vim pelo site e gostaria de mais informações."`. Justificativa: a Fase 0 já determinou que os CTAs de WhatsApp, hoje hardcoded em cada seção do site atual, viram "um componente único reutilizável"; o texto literal das mensagens antigas por seção não foi capturado em nenhum artefato da auditoria, então padronizar uma mensagem é a forma mais direta de honrar essa decisão sem inventar conteúdo que não existe registrado.

### 2.2 Comportamento

- **Posicionamento:** `fixed`/`sticky` no topo (`top-0`), permanece visível durante todo o scroll
- **Altura:** token fixo `--header-height` em `globals.css` (`@theme inline`). **Decidido em Plan Mode:** `72px` (`4.5rem`) — espaço suficiente para o lockup do logo (monograma + 2 linhas de texto) e o CTA em alvo de toque confortável.
  - **Atenção:** toda seção-alvo de âncora (`#atuacao`, `#sobre`, `#faq`, `#contato`) precisa de `scroll-margin-top` igual à altura do header, senão o scroll da âncora vai parar com o título da seção escondido atrás do header fixo. Essas seções ainda não existem (chegam na Fase 4) — quando forem criadas, cada `<section id="...">` deve usar a classe `scroll-mt-(--header-height)`, a mesma variável CSS que o Header já consome.
- **Transição visual ao rolar:** header nasce com fundo transparente sobre o Hero (a foto de fundo com a balança da justiça faz mais sentido sem uma faixa sólida por cima) → após um scroll threshold, ganha fundo sólido (`navy`, token único de fundo do tema) + sombra sutil. **Decidido em Plan Mode:** threshold de `64px` — dentro do range de 60-80px já cogitado, baixo o suficiente para a transição parecer responsiva ao início do scroll.
- **Link ativo:** destaque visual (cor `gold-light`, mais `aria-current="true"` para leitores de tela) no link correspondente à seção visível, via `IntersectionObserver`
- **CTA:** botão "Fale Conosco" com ícone de WhatsApp, cor `gold` (adaptado do verde WhatsApp original para manter consistência com o design system — mesmo tom do `Button` `primary`)

### 2.3 Responsivo — Nav Mobile (Drawer)

- Abaixo do breakpoint mobile, nav central desaparece e é substituída por ícone hambúrguer (☰)
- Clique abre **drawer lateral** (padrão de mercado: painel deslizando da direita, sobre overlay escurecido)
- Dentro do drawer: os mesmos 4 links de navegação empilhados verticalmente + CTA "Fale Conosco" em destaque
- Fechamento por: ícone ✕, clique no overlay, tecla `Esc`
- **Acessibilidade:** foco preso dentro do drawer enquanto aberto (focus trap), foco retorna ao botão hambúrguer ao fechar, `aria-expanded`/`aria-controls` no botão hambúrguer, `role="dialog"` + `aria-modal="true"` no drawer
- **Decidido em Plan Mode:** `Dialog` da Base UI (`@base-ui/react/dialog`, mesma família de primitiva já usada no Button/Input) como base do Drawer. Confirmado no código-fonte instalado: com `modal: true` (padrão), o `Dialog.Root` já resolve focus trap, scroll lock, `role="dialog"`/`aria-modal`, devolução de foco ao trigger ao fechar e fechamento por Esc — sem reimplementar nada disso à mão, mesmo padrão que o Base UI Field já tinha resolvido para acessibilidade de formulário na Fase 2.

---

## 3. Footer

### 3.1 Conteúdo (copy — não muda, aviso legal reescrito mantendo o sentido)

**Coluna 1 — Identidade**
- Nome "Helio Kleison"
- Descrição curta: advocacia especializada em Direito Bancário, atendimento presencial em Natal/RN e online para todo o Brasil

**Coluna 2 — Navegação**
- Mesmos 4 links âncora do header (Áreas de Atuação, Sobre o Advogado, Dúvidas Frequentes, Contato)

**Coluna 3 — Contato**
- Telefone/WhatsApp: (84) 99477-6673 (link `wa.me`, mesma mensagem única definida em 2.1)
- Instagram: @heliokleison.advocacia
- Facebook: Helio Kleison Advogado
- E-mail: heliokleison.advocacia@gmail.com
- Cidade: Natal/RN
- OAB/RN 20.357

**Linha inferior**
- Copyright: "© Helio Kleison Advocacia e Consultoria Jurídica. Todos os direitos reservados."
- **Aviso legal OAB (Provimento nº 205/2021):** reescrever mantendo o sentido jurídico intacto — em especial as duas garantias que o texto original estabelece: (1) que o site tem caráter meramente informativo, e (2) que isso não configura publicidade irregular nem promessa/garantia de resultado. Este texto deve ser revisado com atenção antes do commit final, já que é uma exigência regulatória da OAB, não apenas copy de marketing.

### 3.2 Reserva para o widget de chat AI (não implementar ainda)

- Reservar token de posição (`bottom-right`, com offset das bordas) e `z-index` acima do conteúdo normal do footer.
- **Decidido em Plan Mode — ordem de z-index:** header (`--z-header: 40`) < reserva do widget de chat (`--z-chat-widget: 30`, abaixo do header também) < drawer mobile (`--z-drawer: 50`, acima de tudo). Racional: o drawer é modal — enquanto aberto, deve cobrir também a posição reservada do widget; a bolha do chat some visualmente atrás do backdrop do drawer e volta a aparecer ao fechar. Isso também corrige uma imprecisão do roadmap master: a Fase 1 só reservou o token de **cor** do widget (`--color-whatsapp`), não um z-index — a reserva de z-index é criada agora, nesta fase, e é ela quem realmente cumpre esse critério de aceite.
- Nenhuma lógica de chat, bolha visual ou componente é implementado nesta fase — só o espaço/token reservado no design system para uso futuro (um `<div>` vazio, posicionado, sem conteúdo).

---

## 3.3 Arquitetura de arquivos (decidido em Plan Mode)

- `src/components/layout/` (novo diretório): `header.tsx`, `nav-drawer.tsx`, `footer.tsx`, `nav-links.ts` — são composição de página (chrome), diferente das primitivas reutilizáveis de `src/components/ui/` (Button, Card, Input...).
- `src/components/ui/whatsapp-icon.tsx` + `whatsapp-cta.tsx` — ficam em `ui/` porque são genéricos: Header e Footer os consomem igualmente, e fases futuras (Hero, Contato) provavelmente também vão precisar.
- `src/hooks/use-scrolled.ts` + `src/hooks/use-active-section.ts` — primeira vez que o projeto usa hooks customizados; extraídos do componente `Header` para serem testáveis isoladamente (jsdom não roda `IntersectionObserver` nativamente, então a lógica de scroll-spy precisa estar isolada de JSX para ser mockada nos testes).
- Breakpoint mobile/desktop: `md:` (768px, padrão do Tailwind) — sem necessidade de customizar a escala de breakpoints do tema.

---

## 4. Fora de escopo desta fase

- Lógica funcional do widget de chat AI (só reserva de espaço/z-index)
- Multi-idioma (site é só PT-BR)
- Qualquer nova seção de conteúdo (Header/Footer referenciam seções que ainda serão construídas nas próximas fases — Hero já está com direção definida na Fase 1/2, as demais seções — Áreas de Atuação, Sobre, FAQ, Contato — são fases futuras)

---

## 5. Critérios de aceite (para orientar os testes/TDD)

- [ ] Header renderiza fixo no topo em qualquer ponto do scroll
- [ ] Header transiciona de transparente → sólido+sombra após threshold de scroll
- [ ] Link ativo do nav reflete corretamente a seção visível durante o scroll (testado com seções sintéticas — ver nota abaixo)
- [ ] CTA "Fale Conosco" abre o link `wa.me` correto em nova aba
- [ ] Abaixo do breakpoint mobile, nav vira ícone hambúrguer
- [ ] Drawer abre com focus trap, fecha com ✕/overlay/Esc, e devolve foco ao hambúrguer
- [ ] Nenhuma violação `jest-axe` em Header, Drawer e Footer
- [ ] Footer contém todos os links e informações de contato corretos, com `href` válidos (wa.me, mailto, redes sociais)
- [ ] Aviso legal da OAB presente e revisado
- [ ] Token de reserva do widget de chat existe no design system, sem componente implementado

**Nota sobre testabilidade nesta fase:** os anchors (`#atuacao`, `#sobre`, `#faq`, `#contato`) ainda não existem como `<section>` reais na página — só chegam na Fase 4. Por isso o critério "clique/tap em cada link rola suavemente até a seção correta, sem esconder o título atrás do header" não é verificável ponta a ponta nesta fase: os `href`s corretos e a lógica de link ativo/`scroll-margin-top` ficam prontos e testados isoladamente (com seções sintéticas nos testes automatizados), mas a comprovação visual completa só acontece quando a Fase 4 criar as seções reais com `scroll-mt-(--header-height)` (ver nota em 2.2).
