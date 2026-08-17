import { fireEvent, render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renderiza os children passados", () => {
    render(<Button>Falar com advogado</Button>)

    expect(screen.getByText("Falar com advogado")).toBeInTheDocument()
  })

  it("renderiza como <button> por padrão", () => {
    render(<Button>Enviar</Button>)

    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument()
  })

  it("cada variant aplica um conjunto de classes de cor diferente das demais", () => {
    const { rerender, container } = render(<Button variant="primary">a</Button>)
    const colorClassesOf = (cls: string) =>
      new Set(cls.match(/\b(bg|border|text)-\S+/g) ?? [])

    const primaryClasses = colorClassesOf(
      (container.firstElementChild as HTMLElement).className
    )

    rerender(<Button variant="secondary">a</Button>)
    const secondaryClasses = colorClassesOf(
      (container.firstElementChild as HTMLElement).className
    )

    rerender(<Button variant="ghost">a</Button>)
    const ghostClasses = colorClassesOf(
      (container.firstElementChild as HTMLElement).className
    )

    expect(primaryClasses.size).toBeGreaterThan(0)
    expect(secondaryClasses.size).toBeGreaterThan(0)
    expect(ghostClasses.size).toBeGreaterThan(0)

    const asSorted = (set: Set<string>) => [...set].sort().join(" ")
    const all = [primaryClasses, secondaryClasses, ghostClasses].map(asSorted)
    expect(new Set(all).size).toBe(3)
  })

  it("aplica classe de foco visível em todas as variantes", () => {
    const { rerender, container } = render(<Button variant="primary">a</Button>)
    let el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/focus-visible:ring/)

    rerender(<Button variant="secondary">a</Button>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/focus-visible:ring/)

    rerender(<Button variant="ghost">a</Button>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/focus-visible:ring/)
  })

  it("estado disabled aplica opacidade reduzida e desabilita o elemento", () => {
    render(<Button disabled>Enviar</Button>)

    const el = screen.getByRole("button", { name: "Enviar" })
    expect(el).toBeDisabled()
    expect(el.className).toMatch(/disabled:opacity-50/)
  })

  it("suporta o prop render do Base UI para trocar o elemento renderizado", () => {
    render(
      <Button render={<a href="#areas-atuacao" />}>Ver áreas de atuação</Button>
    )

    const link = screen.getByRole("link", { name: "Ver áreas de atuação" })
    expect(link).toHaveAttribute("href", "#areas-atuacao")
  })

  it("mescla className extra sem remover as classes base", () => {
    render(<Button className="minha-classe">a</Button>)

    const el = screen.getByRole("button")
    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bbg-primary\b/)
  })

  it("repassa props nativas como onClick e type", () => {
    const handleClick = vi.fn()
    render(
      <Button type="submit" onClick={handleClick}>
        Enviar
      </Button>
    )

    const el = screen.getByRole("button", { name: "Enviar" })
    expect(el).toHaveAttribute("type", "submit")

    fireEvent.click(el)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("aplica hover:scale-105 em todas as variantes, a partir da base compartilhada", () => {
    const { rerender, container } = render(<Button variant="primary">a</Button>)
    let el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bhover:scale-105\b/)

    rerender(<Button variant="secondary">a</Button>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bhover:scale-105\b/)

    rerender(<Button variant="ghost">a</Button>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bhover:scale-105\b/)
  })

  it("secondary intensifica a borda para gold no hover, em vez de sumir", () => {
    render(<Button variant="secondary">a</Button>)

    const el = screen.getByRole("button")
    expect(el.className).toMatch(/\bhover:border-gold\b/)
    expect(el.className).toMatch(/\bhover:bg-gold\/5\b/)
    expect(el.className).not.toMatch(/\bhover:border-transparent\b/)
  })

  it("ghost ganha borda sutil apenas no hover", () => {
    render(<Button variant="ghost">a</Button>)

    const el = screen.getByRole("button")
    expect(el.className).toMatch(/\bhover:border-gold\/30\b/)
  })

  it("não tem violações de acessibilidade em nenhuma variante", async () => {
    const { rerender, container } = render(<Button variant="primary">a</Button>)
    expect(await axe(container)).toHaveNoViolations()

    rerender(<Button variant="secondary">a</Button>)
    expect(await axe(container)).toHaveNoViolations()

    rerender(<Button variant="ghost">a</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot de cada variante", () => {
    const { container: primaryContainer } = render(
      <Button variant="primary">a</Button>
    )
    const { container: secondaryContainer } = render(
      <Button variant="secondary">a</Button>
    )
    const { container: ghostContainer } = render(<Button variant="ghost">a</Button>)

    expect(primaryContainer.firstElementChild).toMatchSnapshot("variant-primary")
    expect(secondaryContainer.firstElementChild).toMatchSnapshot("variant-secondary")
    expect(ghostContainer.firstElementChild).toMatchSnapshot("variant-ghost")
  })
})
