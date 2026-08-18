import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { WhatsAppCta } from "@/components/ui/whatsapp-cta"

describe("WhatsAppCta", () => {
  it("gera o href do wa.me com a mensagem padrão codificada", () => {
    render(<WhatsAppCta />)

    const link = screen.getByRole("link", { name: /fale conosco/i })
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/5584994776673?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
    )
  })

  it("aceita uma mensagem customizada via prop", () => {
    render(<WhatsAppCta message="Olá, quero falar com o Dr. Hélio." />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/5584994776673?text=Ol%C3%A1%2C%20quero%20falar%20com%20o%20Dr.%20H%C3%A9lio."
    )
  })

  it("abre em nova aba com rel seguro", () => {
    render(<WhatsAppCta />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("renderiza 'Fale Conosco' por padrão", () => {
    render(<WhatsAppCta />)

    expect(screen.getByText("Fale Conosco")).toBeInTheDocument()
  })

  it("permite sobrescrever o texto via children", () => {
    render(<WhatsAppCta>Chamar no WhatsApp</WhatsAppCta>)

    expect(screen.getByText("Chamar no WhatsApp")).toBeInTheDocument()
    expect(screen.queryByText("Fale Conosco")).not.toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<WhatsAppCta />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("size default usa o tamanho compacto do Button", () => {
    render(<WhatsAppCta />)

    const link = screen.getByRole("link")
    expect(link.className).toMatch(/\bh-8\b/)
    expect(link.className).not.toMatch(/\bh-10\b/)
  })

  it("size lg aumenta o CTA para ser o elemento de maior destaque (Header, drawer)", () => {
    render(<WhatsAppCta size="lg" />)

    const link = screen.getByRole("link")
    expect(link.className).toMatch(/\bh-10\b/)
    expect(link.className).toMatch(/\btext-base\b/)
  })
})
