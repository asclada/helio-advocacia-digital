/**
 * Fonte única dos anchors do site (docs/specs/fase3-header-nav-footer.md,
 * seção 1). Header e Footer usam rótulos literais diferentes para o mesmo
 * anchor (ex: "Sobre mim" no Header vs. "Sobre o Advogado" no Footer) — a
 * spec define os dois textos como copy fixa, então cada local lê o campo
 * certo em vez de duplicar o array inteiro.
 *
 * `id` e `href` são coisas diferentes desde a Fase 4.5
 * (docs/specs/fase4-5-paginas-dedicadas.md): `id` continua identificando a
 * seção correspondente na Home (usado só pelo scroll-spy via
 * `useActiveSection`), enquanto `href` é o destino real do link de
 * navegação — a página dedicada de cada assunto, não mais uma âncora
 * dentro da Home.
 *
 * De 4 para 3 itens (Fase 4.5, rodada 2): "Dúvidas" e "Contato" levavam
 * pra mesma página (`/contato`, seções diferentes por âncora) — o Lucas
 * decidiu unificar num único item de nav ("FAQ/Contato"), liberando um
 * slot no menu para um assunto futuro (ex: blog) em vez de manter dois
 * links redundantes apontando pro mesmo destino.
 */
export interface NavAnchor {
  id: string
  href: string
  headerLabel: string
  footerLabel: string
}

export const NAV_ANCHORS: NavAnchor[] = [
  {
    id: "atuacao",
    href: "/areas-de-atuacao",
    headerLabel: "Áreas de Atuação",
    footerLabel: "Áreas de Atuação",
  },
  { id: "sobre", href: "/sobre", headerLabel: "Sobre mim", footerLabel: "Sobre o Advogado" },
  { id: "faq", href: "/contato", headerLabel: "FAQ/Contato", footerLabel: "FAQ/Contato" },
]

/**
 * Array de ids extraído em escopo de módulo (referência estável) para
 * `useActiveSection` — se fosse recalculado inline a cada render do Header
 * (`NAV_ANCHORS.map(...)` direto no JSX), o hook reconectaria o
 * IntersectionObserver a cada render por causa da nova referência de array.
 */
export const NAV_ANCHOR_IDS = NAV_ANCHORS.map((anchor) => anchor.id)
