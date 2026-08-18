import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

describe("Card", () => {
  it("renderiza os children passados", () => {
    render(<Card>Conteúdo do card</Card>)

    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument()
  })

  it("renderiza como <div data-slot='card'> por padrão", () => {
    const { container } = render(<Card>Conteúdo</Card>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("DIV")
    expect(el).toHaveAttribute("data-slot", "card")
  })

  it("aplica as classes fixas de estilo", () => {
    const { container } = render(<Card>Conteúdo</Card>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bbg-card\b/)
    expect(el.className).toMatch(/\bborder-border\b/)
    expect(el.className).toMatch(/\brounded-lg\b/)
  })

  it("ocupa a altura total da célula do grid (h-full flex flex-col)", () => {
    const { container } = render(<Card>Conteúdo</Card>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bh-full\b/)
    expect(el.className).toMatch(/\bflex\b/)
    expect(el.className).toMatch(/\bflex-col\b/)
  })

  it("mescla className extra sem remover as classes base", () => {
    const { container } = render(<Card className="minha-classe">Conteúdo</Card>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bbg-card\b/)
  })

  it("repassa props nativas como aria-label e id", () => {
    render(
      <Card id="card-teste" aria-label="Card de teste">
        Conteúdo
      </Card>
    )

    const el = screen.getByLabelText("Card de teste")
    expect(el).toHaveAttribute("id", "card-teste")
  })
})

describe("CardHeader", () => {
  it("renderiza children como <div data-slot='card-header'>", () => {
    const { container } = render(<CardHeader>Cabeçalho</CardHeader>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("DIV")
    expect(el).toHaveAttribute("data-slot", "card-header")
    expect(screen.getByText("Cabeçalho")).toBeInTheDocument()
  })
})

describe("CardContent", () => {
  it("renderiza children como <div data-slot='card-content'>", () => {
    const { container } = render(<CardContent>Corpo</CardContent>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("DIV")
    expect(el).toHaveAttribute("data-slot", "card-content")
    expect(screen.getByText("Corpo")).toBeInTheDocument()
  })
})

describe("CardFooter", () => {
  it("renderiza children como <div data-slot='card-footer'>", () => {
    const { container } = render(<CardFooter>Rodapé</CardFooter>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("DIV")
    expect(el).toHaveAttribute("data-slot", "card-footer")
    expect(screen.getByText("Rodapé")).toBeInTheDocument()
  })

  it("aplica mt-auto para ficar sempre na base do card, independente da altura do conteúdo acima", () => {
    const { container } = render(<CardFooter>Rodapé</CardFooter>)
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bmt-auto\b/)
  })
})

describe("CardTitle", () => {
  it("renderiza como <h3> por padrão", () => {
    const { container } = render(<CardTitle>Direito Civil</CardTitle>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("H3")
    expect(el).toHaveAttribute("data-slot", "card-title")
  })

  it("com as='h2' renderiza como <h2>", () => {
    const { container } = render(<CardTitle as="h2">Direito Civil</CardTitle>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("H2")
  })

  it("mescla className extra sem remover as classes base", () => {
    const { container } = render(
      <CardTitle className="minha-classe">Direito Civil</CardTitle>
    )
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bfont-display\b/)
  })
})

describe("CardDescription", () => {
  it("renderiza como <p> com text-muted-foreground", () => {
    const { container } = render(
      <CardDescription>Contratos, indenizações e mais.</CardDescription>
    )
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("P")
    expect(el.className).toMatch(/\btext-muted-foreground\b/)
  })
})

describe("Card — composição completa", () => {
  function AreaDeAtuacaoCard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Direito Civil</CardTitle>
          <CardDescription>
            Contratos, indenizações e responsabilidade civil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Atuação completa em processos cíveis, do consultivo ao contencioso.</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost">Saiba mais</Button>
        </CardFooter>
      </Card>
    )
  }

  it("renderiza a árvore completa com título, descrição, corpo e botão", () => {
    render(<AreaDeAtuacaoCard />)

    expect(screen.getByRole("heading", { name: "Direito Civil" })).toBeInTheDocument()
    expect(
      screen.getByText("Contratos, indenizações e responsabilidade civil.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Atuação completa em processos cíveis, do consultivo ao contencioso.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Saiba mais" })).toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<AreaDeAtuacaoCard />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot", () => {
    const { container } = render(<AreaDeAtuacaoCard />)

    expect(container.firstElementChild).toMatchSnapshot()
  })
})
