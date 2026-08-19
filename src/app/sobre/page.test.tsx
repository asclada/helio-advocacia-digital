import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import SobrePage from "@/app/sobre/page"

describe("SobrePage", () => {
  it("renderiza exatamente 1 <h1>, com o conteúdo do Sobre", () => {
    render(<SobrePage />)

    const headings1 = screen.getAllByRole("heading", { level: 1 })
    expect(headings1).toHaveLength(1)
    expect(headings1[0]).toHaveTextContent("Dr. Helio Kleison")

    expect(screen.getByText("OAB/RN sob o nº 20.357")).toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<SobrePage />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
