import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { AreasAtuacao, AreasAtuacaoContent } from "@/components/sections/areas-atuacao"

describe("AreasAtuacao", () => {
  it("usa o SectionHeading com o eyebrow e o título corretos", () => {
    render(<AreasAtuacao />)

    expect(screen.getByText("Áreas de Atuação")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Direito Bancário e do Consumidor, com foco em:",
      })
    ).toBeInTheDocument()
  })

  it("renderiza os 3 cards com título e texto corretos, sem o prefixo 'Art. Nº'", () => {
    render(<AreasAtuacao />)

    expect(
      screen.getByRole("heading", { level: 3, name: "Venda Casada de Seguro" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Contratação de seguro ou produto não solicitado/)
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { level: 3, name: "Empréstimo Fraudado" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Idade adulterada no contrato/)
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Consignado a Menor de Idade (INSS)",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Crédito consignado liberado por representante legal/)
    ).toBeInTheDocument()

    expect(screen.queryByText(/Art\.\s*\d/)).not.toBeInTheDocument()
  })

  it("cada card tem o hover de elevação + moldura dourada replicado do site atual", () => {
    render(<AreasAtuacao />)

    const title = screen.getByRole("heading", { level: 3, name: "Venda Casada de Seguro" })
    const card = title.closest('[data-slot="card"]')
    expect(card?.className).toMatch(/\bhover:-translate-y-1\.5\b/)
    expect(card?.className).toMatch(/\bhover:border-gold\b/)
  })

  it("a seção tem id='atuacao', alvo do anchor do Header/Footer/CTA do Hero", () => {
    const { container } = render(<AreasAtuacao />)

    const section = container.querySelector("section")
    expect(section?.id).toBe("atuacao")
  })

  it("tem uma linha sutil no topo, separando visualmente do Hero (mesmo fundo navy dos dois)", () => {
    const { container } = render(<AreasAtuacao />)

    const section = container.querySelector("section")
    expect(section?.className).toMatch(/\bborder-t\b/)
    expect(section?.className).toMatch(/\bborder-foreground\/5\b/)
  })

  it("o grid usa 3 colunas em desktop (md:grid-cols-3)", () => {
    const { container } = render(<AreasAtuacao />)

    const grid = container.querySelector(".grid")
    expect(grid?.className).toMatch(/\bmd:grid-cols-3\b/)
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<AreasAtuacao />)

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("AreasAtuacaoContent", () => {
  it("por padrão renderiza o título como <h2> (uso na Home)", () => {
    render(<AreasAtuacaoContent />)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Direito Bancário e do Consumidor, com foco em:",
      })
    ).toBeInTheDocument()
  })

  it("com headingLevel='h1', renderiza o título como <h1> e os cards descem pra <h2> (hierarquia sequencial)", () => {
    render(<AreasAtuacaoContent headingLevel="h1" />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Direito Bancário e do Consumidor, com foco em:",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Venda Casada de Seguro" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { level: 3 })
    ).not.toBeInTheDocument()
  })
})
