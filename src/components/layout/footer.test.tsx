import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Footer } from "@/components/layout/footer"
import { NAV_ANCHORS } from "@/components/layout/nav-links"

describe("Footer", () => {
  it("renderiza a coluna de identidade, com o nome em destaque dourado", () => {
    render(<Footer />)

    const name = screen.getByText("Helio Kleison")
    expect(name).toBeInTheDocument()
    expect(name.className).toMatch(/\btext-gold-light\b/)
    expect(
      screen.getByText(/advocacia especializada em Direito Bancário/i)
    ).toBeInTheDocument()
  })

  it("os títulos das colunas Navegação e Contato ficam em dourado", () => {
    render(<Footer />)

    expect(screen.getByText("Navegação").className).toMatch(/\btext-gold-light\b/)
    expect(
      screen.getByText("Contato", { selector: "span" }).className
    ).toMatch(/\btext-gold-light\b/)
  })

  it("renderiza os 3 links de navegação com os footerLabels e hrefs corretos", () => {
    render(<Footer />)

    for (const anchor of NAV_ANCHORS) {
      expect(
        screen.getByRole("link", { name: anchor.footerLabel })
      ).toHaveAttribute("href", anchor.href)
    }
  })

  it("renderiza o link de WhatsApp com a mesma mensagem única do site, com ícone", () => {
    render(<Footer />)

    const link = screen.getByRole("link", { name: /99477-6673/ })
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/5584994776673?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
    )
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(link.querySelector("svg")).toBeInTheDocument()
  })

  it("renderiza o link do Instagram, com ícone", () => {
    render(<Footer />)

    const link = screen.getByRole("link", { name: "@heliokleison.advocacia" })
    expect(link).toHaveAttribute("href", "https://instagram.com/heliokleison.advocacia")
    expect(link.querySelector("svg")).toBeInTheDocument()
  })

  it("renderiza o link do Facebook, com ícone", () => {
    render(<Footer />)

    const link = screen.getByRole("link", { name: /helio kleison advogado/i })
    expect(link).toHaveAttribute("href", "https://www.facebook.com/heliokleison.advocacia")
    expect(link.querySelector("svg")).toBeInTheDocument()
  })

  it("renderiza o link de e-mail, com ícone", () => {
    render(<Footer />)

    const link = screen.getByRole("link", { name: "heliokleison.advocacia@gmail.com" })
    expect(link).toHaveAttribute("href", "mailto:heliokleison.advocacia@gmail.com")
    expect(link.querySelector("svg")).toBeInTheDocument()
  })

  it("renderiza cidade e OAB, com ícone", () => {
    render(<Footer />)

    const city = screen.getByText("Natal/RN")
    const oab = screen.getByText("OAB/RN 20.357")
    expect(city.closest("span, div")?.querySelector("svg")).toBeInTheDocument()
    expect(oab.closest("span, div")?.querySelector("svg")).toBeInTheDocument()
  })

  it("renderiza a linha de copyright", () => {
    render(<Footer />)

    expect(
      screen.getByText(
        "© Helio Kleison Advocacia e Consultoria Jurídica. Todos os direitos reservados."
      )
    ).toBeInTheDocument()
  })

  it("renderiza o aviso legal da OAB (Provimento 205/2021)", () => {
    render(<Footer />)

    expect(screen.getByText(/Provimento nº 205\/2021/)).toBeInTheDocument()
    expect(screen.getByText(/caráter exclusivamente informativo/i)).toBeInTheDocument()
    expect(screen.getByText(/não configuram publicidade irregular/i)).toBeInTheDocument()
  })

  it("reserva o espaço/z-index do futuro widget de chat, sem nenhum conteúdo", () => {
    const { container } = render(<Footer />)

    const reserved = container.querySelector('[data-slot="chat-widget-reserve"]')
    expect(reserved).toBeInTheDocument()
    expect(reserved).toBeEmptyDOMElement()
    expect(reserved?.className).toMatch(/\bz-\(--z-chat-widget\)/)
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Footer />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot", () => {
    const { container } = render(<Footer />)

    expect(container.firstElementChild).toMatchSnapshot()
  })
})
