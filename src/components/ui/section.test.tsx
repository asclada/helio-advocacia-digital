import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Section } from "@/components/ui/section"

describe("Section", () => {
  it("renderiza os children passados", () => {
    render(<Section>conteúdo</Section>)

    expect(screen.getByText("conteúdo")).toBeInTheDocument()
  })

  it("renderiza um <section> por padrão", () => {
    const { container } = render(<Section>a</Section>)

    expect(container.firstElementChild?.tagName).toBe("SECTION")
  })

  it("renderiza a tag correta com as='div'", () => {
    const { container } = render(<Section as="div">a</Section>)

    expect(container.firstElementChild?.tagName).toBe("DIV")
  })

  it("aplica uma classe de padding vertical diferente para cada spacing", () => {
    const { rerender, container } = render(<Section spacing="default">a</Section>)
    const defaultClass = (container.firstElementChild as HTMLElement).className

    rerender(<Section spacing="compact">a</Section>)
    const compactClass = (container.firstElementChild as HTMLElement).className

    rerender(<Section spacing="spacious">a</Section>)
    const spaciousClass = (container.firstElementChild as HTMLElement).className

    const pyOf = (cls: string) => cls.match(/\bpy-\S+/)?.[0]

    expect(pyOf(defaultClass)).toBeTruthy()
    expect(pyOf(compactClass)).toBeTruthy()
    expect(pyOf(spaciousClass)).toBeTruthy()
    expect(new Set([pyOf(defaultClass), pyOf(compactClass), pyOf(spaciousClass)]).size).toBe(3)
  })

  it("envolve os children em um Container por padrão", () => {
    const { container } = render(<Section>conteúdo</Section>)
    const section = container.firstElementChild as HTMLElement
    const wrapper = section.firstElementChild as HTMLElement

    expect(wrapper.className).toMatch(/\bmx-auto\b/)
    expect(wrapper.textContent).toBe("conteúdo")
  })

  it("com container={false}, renderiza children direto, sem o wrapper de Container", () => {
    const { container } = render(<Section container={false}>conteúdo</Section>)
    const section = container.firstElementChild as HTMLElement

    expect(section.firstElementChild).toBeNull()
    expect(section.textContent).toBe("conteúdo")
  })

  it("repassa id, aria-label, aria-labelledby e className para o elemento raiz", () => {
    const { container } = render(
      <Section id="areas-atuacao" aria-label="Áreas de atuação" className="minha-classe">
        a
      </Section>
    )
    const section = container.firstElementChild as HTMLElement

    expect(section.id).toBe("areas-atuacao")
    expect(section.getAttribute("aria-label")).toBe("Áreas de atuação")
    expect(section.className).toMatch(/\bminha-classe\b/)
  })

  it("não tem violações de acessibilidade com aria-label definido", async () => {
    const { container } = render(<Section aria-label="Seção de teste">conteúdo</Section>)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot de combinações de spacing e container", () => {
    const { container: withContainer } = render(<Section spacing="spacious">a</Section>)
    const { container: withoutContainer } = render(
      <Section spacing="compact" container={false}>
        a
      </Section>
    )

    expect(withContainer.firstElementChild).toMatchSnapshot("spacing-spacious-with-container")
    expect(withoutContainer.firstElementChild).toMatchSnapshot("spacing-compact-without-container")
  })
})
