import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { FaqContato } from "@/components/sections/faq-contato"

describe("FaqContato", () => {
  it("renderiza o SectionHeading do FAQ e o do Contato", () => {
    render(<FaqContato />)

    expect(screen.getByText("Dúvidas Frequentes")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Perguntas comuns" })
    ).toBeInTheDocument()

    expect(screen.getByText("Contato")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Fale com o escritório" })
    ).toBeInTheDocument()
  })

  it("a seção tem id='faq' com fronteira, e a coluna de contato tem id='contato'", () => {
    const { container } = render(<FaqContato />)

    const section = container.querySelector("section")
    expect(section?.id).toBe("faq")
    expect(section?.className).toMatch(/\bborder-t\b/)
    expect(section?.className).toMatch(/\bborder-foreground\/5\b/)

    const contato = container.querySelector("#contato")
    expect(contato).not.toBeNull()
    expect(contato?.className).toMatch(/scroll-mt-\(--header-height\)/)
  })

  it("o grid usa 2 colunas em desktop (md:grid-cols-2)", () => {
    const { container } = render(<FaqContato />)

    const grid = container.querySelector(".grid")
    expect(grid?.className).toMatch(/md:grid-cols-2/)
  })

  it("não tem violações de acessibilidade na composição completa", async () => {
    const { container } = render(<FaqContato />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
