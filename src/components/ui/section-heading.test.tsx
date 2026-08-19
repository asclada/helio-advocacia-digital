import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { SectionHeading } from "@/components/ui/section-heading"

describe("SectionHeading", () => {
  it("renderiza o eyebrow pequeno em maiúsculas e cor gold", () => {
    render(<SectionHeading eyebrow="Áreas de Atuação" title="Título" />)

    const eyebrow = screen.getByText("Áreas de Atuação")
    expect(eyebrow.className).toMatch(/\btext-xs\b/)
    expect(eyebrow.className).toMatch(/\buppercase\b/)
    expect(eyebrow.className).toMatch(/\btext-gold\b/)
  })

  it("renderiza o título como <h2>, maior que o eyebrow", () => {
    render(<SectionHeading eyebrow="Eyebrow" title="Direito Bancário e do Consumidor, com foco em:" />)

    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveTextContent(
      "Direito Bancário e do Consumidor, com foco em:"
    )
    expect(heading.className).toMatch(/\btext-3xl\b/)
  })

  it("centraliza o bloco por padrão (align='center')", () => {
    const { container } = render(<SectionHeading eyebrow="Eyebrow" title="Título" />)

    const wrapper = container.firstElementChild
    expect(wrapper?.className).toMatch(/\btext-center\b/)
  })

  it("com align='left', alinha à esquerda sem o wrapper centralizado", () => {
    const { container } = render(
      <SectionHeading eyebrow="Eyebrow" title="Título" align="left" />
    )

    const wrapper = container.firstElementChild
    expect(wrapper?.className).toMatch(/\btext-left\b/)
    expect(wrapper?.className).not.toMatch(/\btext-center\b/)
    expect(wrapper?.className).not.toMatch(/\bmx-auto\b/)
  })

  it("com as='h1', renderiza o título como <h1> (página dedicada)", () => {
    render(<SectionHeading eyebrow="Eyebrow" title="Título" as="h1" />)

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Título")
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<SectionHeading eyebrow="Eyebrow" title="Título" />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
