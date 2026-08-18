import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it, vi } from "vitest"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renderiza como <input>", () => {
    render(<Input aria-label="Nome completo" />)

    expect(screen.getByLabelText("Nome completo").tagName).toBe("INPUT")
  })

  it("type default é text", () => {
    render(<Input aria-label="Nome completo" />)

    expect(screen.getByLabelText<HTMLInputElement>("Nome completo").type).toBe("text")
  })

  it("aceita type e placeholder", () => {
    render(<Input aria-label="E-mail" type="email" placeholder="voce@exemplo.com" />)

    const el = screen.getByLabelText("E-mail")
    expect(el).toHaveAttribute("type", "email")
    expect(el).toHaveAttribute("placeholder", "voce@exemplo.com")
  })

  it("aplica as classes fixas de estado de repouso", () => {
    render(<Input aria-label="Nome completo" />)
    const el = screen.getByLabelText("Nome completo")

    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
    expect(el.className).toMatch(/\bw-full\b/)
    expect(el.className).toMatch(/\bh-9\b/)
    expect(el.className).toMatch(/\brounded-lg\b/)
  })

  it("aplica classe de foco visível", () => {
    render(<Input aria-label="Nome completo" />)
    const el = screen.getByLabelText("Nome completo")

    expect(el.className).toMatch(/focus-visible:ring/)
  })

  it("aplica classes de estado inválido via aria-invalid", () => {
    render(<Input aria-label="Nome completo" />)
    const el = screen.getByLabelText("Nome completo")

    expect(el.className).toMatch(/\baria-invalid:border-destructive\b/)
  })

  it("estado disabled aplica opacidade reduzida e desabilita o elemento", () => {
    render(<Input aria-label="Nome completo" disabled />)
    const el = screen.getByLabelText("Nome completo")

    expect(el).toBeDisabled()
    expect(el.className).toMatch(/disabled:opacity-50/)
  })

  it("mescla className extra sem remover as classes base", () => {
    render(<Input aria-label="Nome completo" className="minha-classe" />)
    const el = screen.getByLabelText("Nome completo")

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
  })

  it("repassa props nativas como id e aceita digitação via onChange", async () => {
    const handleChange = vi.fn()
    render(<Input aria-label="Nome completo" id="nome" onChange={handleChange} />)

    const el = screen.getByLabelText("Nome completo")
    expect(el).toHaveAttribute("id", "nome")

    await userEvent.type(el, "Hélio")
    expect(handleChange).toHaveBeenCalled()
    expect(el).toHaveValue("Hélio")
  })

  it("não tem violações de acessibilidade quando tem nome acessível próprio", async () => {
    const { container } = render(<Input aria-label="Nome completo" />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot", () => {
    const { container } = render(<Input aria-label="Nome completo" />)

    expect(container.firstElementChild).toMatchSnapshot()
  })
})
