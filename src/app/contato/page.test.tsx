import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import ContatoPage from "@/app/contato/page"

describe("ContatoPage", () => {
  it("renderiza exatamente 1 <h1> ('Fale com o escritório'), FAQ como <h2>", () => {
    render(<ContatoPage />)

    const headings1 = screen.getAllByRole("heading", { level: 1 })
    expect(headings1).toHaveLength(1)
    expect(headings1[0]).toHaveTextContent("Fale com o escritório")

    expect(
      screen.getByRole("heading", { level: 2, name: "Perguntas comuns" })
    ).toBeInTheDocument()
  })

  it("renderiza o formulário de contato e o accordion de FAQ", () => {
    render(<ContatoPage />)

    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: /Posso cancelar um seguro que veio embutido/,
      })
    ).toBeInTheDocument()
  })

  it("a coluna do FAQ tem id='faq' (âncora /contato#faq do nav)", () => {
    const { container } = render(<ContatoPage />)

    expect(container.querySelector("#faq")).not.toBeNull()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<ContatoPage />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
