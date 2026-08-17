import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Container } from "@/components/ui/container"

describe("Container", () => {
  it("renderiza os children passados", () => {
    render(<Container>conteúdo</Container>)

    expect(screen.getByText("conteúdo")).toBeInTheDocument()
  })

  it("aplica mx-auto, w-full e padding horizontal responsivo em qualquer size", () => {
    const { rerender, container } = render(<Container>a</Container>)
    let el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bmx-auto\b/)
    expect(el.className).toMatch(/\bw-full\b/)
    expect(el.className).toMatch(/\bpx-4\b/)
    expect(el.className).toMatch(/\bsm:px-6\b/)
    expect(el.className).toMatch(/\blg:px-8\b/)

    rerender(<Container size="narrow">a</Container>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bmx-auto\b/)

    rerender(<Container size="wide">a</Container>)
    el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/\bmx-auto\b/)
  })

  it("aplica uma classe de max-width diferente para cada size", () => {
    const { rerender, container } = render(<Container size="default">a</Container>)
    const defaultClass = (container.firstElementChild as HTMLElement).className

    rerender(<Container size="narrow">a</Container>)
    const narrowClass = (container.firstElementChild as HTMLElement).className

    rerender(<Container size="wide">a</Container>)
    const wideClass = (container.firstElementChild as HTMLElement).className

    const maxWidthOf = (cls: string) => cls.match(/max-w-\S+/)?.[0]

    expect(maxWidthOf(defaultClass)).toBeTruthy()
    expect(maxWidthOf(narrowClass)).toBeTruthy()
    expect(maxWidthOf(wideClass)).toBeTruthy()
    expect(new Set([maxWidthOf(defaultClass), maxWidthOf(narrowClass), maxWidthOf(wideClass)]).size).toBe(3)
  })

  it("renderiza a tag correta conforme a prop as", () => {
    const { rerender, container } = render(<Container>a</Container>)
    expect(container.firstElementChild?.tagName).toBe("DIV")

    rerender(<Container as="header">a</Container>)
    expect(container.firstElementChild?.tagName).toBe("HEADER")

    rerender(<Container as="main">a</Container>)
    expect(container.firstElementChild?.tagName).toBe("MAIN")

    rerender(<Container as="footer">a</Container>)
    expect(container.firstElementChild?.tagName).toBe("FOOTER")
  })

  it("mescla className extra sem remover as classes base", () => {
    const { container } = render(<Container className="minha-classe">a</Container>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bmx-auto\b/)
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Container>conteúdo acessível</Container>)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot de cada variante de size", () => {
    const { container: defaultContainer } = render(<Container size="default">a</Container>)
    const { container: narrowContainer } = render(<Container size="narrow">a</Container>)
    const { container: wideContainer } = render(<Container size="wide">a</Container>)

    expect(defaultContainer.firstElementChild).toMatchSnapshot("size-default")
    expect(narrowContainer.firstElementChild).toMatchSnapshot("size-narrow")
    expect(wideContainer.firstElementChild).toMatchSnapshot("size-wide")
  })
})
