import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Badge } from "@/components/ui/badge"

describe("Badge", () => {
  it("renderiza os children passados", () => {
    render(<Badge>OAB/RN ativo</Badge>)

    expect(screen.getByText("OAB/RN ativo")).toBeInTheDocument()
  })

  it("renderiza como <span> por padrão", () => {
    const { container } = render(<Badge>OAB/RN ativo</Badge>)

    expect((container.firstElementChild as HTMLElement).tagName).toBe("SPAN")
  })

  it("aplica as classes fixas de estilo", () => {
    const { container } = render(<Badge>OAB/RN ativo</Badge>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bborder-gold\b/)
    expect(el.className).toMatch(/\bbg-gold\/5\b/)
    expect(el.className).toMatch(/\btext-gold-light\b/)
    expect(el.className).toMatch(/\brounded-full\b/)
  })

  it("não é focável via teclado", () => {
    const { container } = render(<Badge>OAB/RN ativo</Badge>)
    const el = container.firstElementChild as HTMLElement

    expect(el).not.toHaveAttribute("tabindex")
    expect(el).not.toHaveAttribute("role")
  })

  it("mescla className extra sem remover as classes base", () => {
    const { container } = render(
      <Badge className="minha-classe">OAB/RN ativo</Badge>
    )
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bborder-gold\b/)
  })

  it("repassa props nativas como aria-label e id", () => {
    render(
      <Badge id="badge-oab" aria-label="OAB/RN ativo, registro verificado">
        OAB/RN ativo
      </Badge>
    )

    const el = screen.getByLabelText("OAB/RN ativo, registro verificado")
    expect(el).toHaveAttribute("id", "badge-oab")
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Badge>OAB/RN ativo</Badge>)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot", () => {
    const { container } = render(<Badge>OAB/RN ativo</Badge>)

    expect(container.firstElementChild).toMatchSnapshot()
  })
})
