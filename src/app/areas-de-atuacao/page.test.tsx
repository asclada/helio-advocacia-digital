import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import AreasDeAtuacaoPage from "@/app/areas-de-atuacao/page"

describe("AreasDeAtuacaoPage", () => {
  it("renderiza exatamente 1 <h1>, com o conteúdo das áreas de atuação", () => {
    render(<AreasDeAtuacaoPage />)

    const headings1 = screen.getAllByRole("heading", { level: 1 })
    expect(headings1).toHaveLength(1)
    expect(headings1[0]).toHaveTextContent("Direito Bancário e do Consumidor, com foco em:")

    expect(
      screen.getByRole("heading", { level: 2, name: "Venda Casada de Seguro" })
    ).toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<AreasDeAtuacaoPage />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
