import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it, vi } from "vitest"

import { Textarea } from "@/components/ui/textarea"

describe("Textarea", () => {
  it("renderiza como <textarea>", () => {
    render(<Textarea aria-label="Mensagem" />)

    expect(screen.getByLabelText("Mensagem").tagName).toBe("TEXTAREA")
  })

  it("aceita placeholder", () => {
    render(<Textarea aria-label="Mensagem" placeholder="Conte brevemente sobre o seu caso" />)

    expect(screen.getByLabelText("Mensagem")).toHaveAttribute(
      "placeholder",
      "Conte brevemente sobre o seu caso"
    )
  })

  it("aplica as classes fixas de estado de repouso, com altura mínima em vez de fixa", () => {
    render(<Textarea aria-label="Mensagem" />)
    const el = screen.getByLabelText("Mensagem")

    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
    expect(el.className).toMatch(/\bw-full\b/)
    expect(el.className).toMatch(/\bmin-h-24\b/)
    expect(el.className).toMatch(/\brounded-lg\b/)
    expect(el.className).not.toMatch(/\bh-9\b/)
  })

  it("aplica classe de foco visível", () => {
    render(<Textarea aria-label="Mensagem" />)

    expect(screen.getByLabelText("Mensagem").className).toMatch(/focus-visible:ring/)
  })

  it("aplica classes de estado inválido via aria-invalid", () => {
    render(<Textarea aria-label="Mensagem" />)

    expect(screen.getByLabelText("Mensagem").className).toMatch(
      /\baria-invalid:border-destructive\b/
    )
  })

  it("estado disabled aplica opacidade reduzida e desabilita o elemento", () => {
    render(<Textarea aria-label="Mensagem" disabled />)
    const el = screen.getByLabelText("Mensagem")

    expect(el).toBeDisabled()
    expect(el.className).toMatch(/disabled:opacity-50/)
  })

  it("mescla className extra sem remover as classes base", () => {
    render(<Textarea aria-label="Mensagem" className="minha-classe" />)
    const el = screen.getByLabelText("Mensagem")

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
  })

  it("repassa props nativas como id e aceita digitação via onChange", async () => {
    const handleChange = vi.fn()
    render(<Textarea aria-label="Mensagem" id="mensagem" onChange={handleChange} />)

    const el = screen.getByLabelText("Mensagem")
    expect(el).toHaveAttribute("id", "mensagem")

    await userEvent.type(el, "Olá")
    expect(handleChange).toHaveBeenCalled()
    expect(el).toHaveValue("Olá")
  })

  it("não tem violações de acessibilidade quando tem nome acessível próprio", async () => {
    const { container } = render(<Textarea aria-label="Mensagem" />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
