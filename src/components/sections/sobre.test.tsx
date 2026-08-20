import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Sobre, SobreContent } from "@/components/sections/sobre"

describe("Sobre", () => {
  it("renderiza o eyebrow e o título (align='left')", () => {
    render(<Sobre />)

    expect(screen.getByText("Sobre o Advogado")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Dr. Helio Kleison" })
    ).toBeInTheDocument()
  })

  it("renderiza os 2 parágrafos, com 'OAB/RN sob o nº 20.357' destacado em gold-light", () => {
    render(<Sobre />)

    const highlight = screen.getByText("OAB/RN sob o nº 20.357")
    expect(highlight.className).toMatch(/\btext-gold-light\b/)

    expect(
      screen.getByText(/com atuação dedicada ao Direito Bancário/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Atende de forma presencial em Natal\/RN/)
    ).toBeInTheDocument()
  })

  it("renderiza os 3 selos de credencial com rótulo e valor corretos", () => {
    render(<Sobre />)

    expect(screen.getByText("OAB/RN")).toBeInTheDocument()
    expect(screen.getByText("20.357")).toBeInTheDocument()

    expect(screen.getByText("Foco")).toBeInTheDocument()
    expect(screen.getByText("Direito Bancário")).toBeInTheDocument()

    expect(screen.getByText("Atendimento")).toBeInTheDocument()
    expect(screen.getByText("Natal/RN + Online")).toBeInTheDocument()
  })

  it("renderiza a foto com alt descritivo, recortada em círculo", () => {
    render(<Sobre />)

    const image = screen.getByAltText("Advogado Helio Kleison")
    expect(image.className).toMatch(/\brounded-full\b/)
  })

  it("a seção tem id='sobre' e a linha de fronteira com a seção anterior", () => {
    const { container } = render(<Sobre />)

    const section = container.querySelector("section")
    expect(section?.id).toBe("sobre")
    expect(section?.className).toMatch(/\bborder-t\b/)
    expect(section?.className).toMatch(/\bborder-foreground\/5\b/)
  })

  it("o grid usa 2 colunas em desktop (md:grid-cols-[7fr_13fr])", () => {
    const { container } = render(<Sobre />)

    const grid = container.querySelector(".grid")
    expect(grid?.className).toMatch(/md:grid-cols-\[7fr_13fr\]/)
  })

  it("a foto tem um teto de tamanho (max-w-[22rem]), não ocupa mais a coluna inteira", () => {
    render(<Sobre />)

    const image = screen.getByAltText("Advogado Helio Kleison")
    expect(image.className).toMatch(/max-w-\[22rem\]/)
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Sobre />)

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("SobreContent", () => {
  it("por padrão renderiza o título como <h2> (uso na Home)", () => {
    render(<SobreContent />)

    expect(
      screen.getByRole("heading", { level: 2, name: "Dr. Helio Kleison" })
    ).toBeInTheDocument()
  })

  it("com headingLevel='h1', renderiza o título como <h1> (página dedicada)", () => {
    render(<SobreContent headingLevel="h1" />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Dr. Helio Kleison" })
    ).toBeInTheDocument()
  })
})
