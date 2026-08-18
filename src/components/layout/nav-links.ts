/**
 * Fonte única dos 4 anchors do site (docs/specs/fase3-header-nav-footer.md,
 * seção 1). Header e Footer usam rótulos literais diferentes para o mesmo
 * anchor (ex: "Sobre mim" no Header vs. "Sobre o Advogado" no Footer) — a
 * spec define os dois textos como copy fixa, então cada local lê o campo
 * certo em vez de duplicar o array inteiro.
 */
export interface NavAnchor {
  id: string
  headerLabel: string
  footerLabel: string
}

export const NAV_ANCHORS: NavAnchor[] = [
  { id: "atuacao", headerLabel: "Áreas de Atuação", footerLabel: "Áreas de Atuação" },
  { id: "sobre", headerLabel: "Sobre mim", footerLabel: "Sobre o Advogado" },
  { id: "faq", headerLabel: "Dúvidas", footerLabel: "Dúvidas Frequentes" },
  { id: "contato", headerLabel: "Contato", footerLabel: "Contato" },
]

/**
 * Array de ids extraído em escopo de módulo (referência estável) para
 * `useActiveSection` — se fosse recalculado inline a cada render do Header
 * (`NAV_ANCHORS.map(...)` direto no JSX), o hook reconectaria o
 * IntersectionObserver a cada render por causa da nova referência de array.
 */
export const NAV_ANCHOR_IDS = NAV_ANCHORS.map((anchor) => anchor.id)
