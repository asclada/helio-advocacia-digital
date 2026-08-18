import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Hero } from "@/components/sections/hero"

describe("Hero", () => {
  it("renderiza o headline inteiro com tipografia uniforme (mesma fonte, peso e tamanho)", () => {
    render(<Hero />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(
      "Ao seu lado na defesa do seu patrimônio contra abusos bancários e juros abusivos"
    )
    expect(heading.className).toMatch(/\bfont-display\b/)
    expect(heading.className).toMatch(/\bfont-medium\b/)
    expect(heading.className).toMatch(/\btext-foreground\b/)
    expect(heading.className).not.toMatch(/\bitalic\b/)
    expect(heading.className).not.toMatch(/\bfont-serif\b/)
  })

  it("restringe o destaque dourado à palavra 'patrimônio'", () => {
    render(<Hero />)

    const highlight = screen.getByText("patrimônio")
    expect(highlight.className).toMatch(/\btext-gold-light\b/)
  })

  it("renderiza o texto de apoio", () => {
    render(<Hero />)

    expect(
      screen.getByText(/Assessoria jurídica especializada para quem sofre/)
    ).toBeInTheDocument()
  })

  it("CTA primário abre o WhatsApp com a mensagem única do site", () => {
    render(<Hero />)

    const link = screen.getByRole("link", { name: /Falar agora no WhatsApp/i })
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/5584994776673?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
    )
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("CTA secundário aponta para a âncora #atuacao", () => {
    render(<Hero />)

    const link = screen.getByRole("link", { name: "Ver áreas de atuação" })
    expect(link).toHaveAttribute("href", "#atuacao")
  })

  it("renderiza os 3 badges de confiança", () => {
    render(<Hero />)

    expect(screen.getByText("Natal/RN")).toBeInTheDocument()
    expect(screen.getByText("Atendimento Online")).toBeInTheDocument()
    expect(screen.getByText("OAB/RN 20.357")).toBeInTheDocument()
  })

  it("renderiza o retrato do Dr. Hélio com alt descritivo", () => {
    render(<Hero />)

    expect(screen.getByAltText("Advogado Hélio Kleison")).toBeInTheDocument()
  })

  it("ancora o retrato na borda inferior do Hero em desktop (margem negativa cancela o padding do Section)", () => {
    render(<Hero />)

    const wrapper = screen.getByAltText("Advogado Hélio Kleison").closest(".relative")
    expect(wrapper?.className).toMatch(/\bmd:-mb-32\b/)
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Hero />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
