import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

describe("Field", () => {
  it("renderiza children como <div data-slot='field'>", () => {
    const { container } = render(<Field>Conteúdo</Field>)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe("DIV")
    expect(el).toHaveAttribute("data-slot", "field")
    expect(screen.getByText("Conteúdo")).toBeInTheDocument()
  })
})

describe("FieldLabel + Input — associação automática", () => {
  it("getByLabelText encontra o Input sem htmlFor/id declarados manualmente", () => {
    render(
      <Field>
        <FieldLabel>Nome completo</FieldLabel>
        <Input />
      </Field>
    )

    expect(screen.getByLabelText("Nome completo").tagName).toBe("INPUT")
  })
})

describe("FieldControl — ponte pra elementos nativos sem primitivo Base UI", () => {
  it("associa id/aria-labelledby a um <textarea> nativo via render", () => {
    render(
      <Field>
        <FieldLabel>Mensagem</FieldLabel>
        <FieldControl render={<textarea />} />
      </Field>
    )

    expect(screen.getByLabelText("Mensagem").tagName).toBe("TEXTAREA")
  })

  it("associa id/aria-labelledby a um <select> nativo via render", () => {
    render(
      <Field>
        <FieldLabel>Assunto</FieldLabel>
        <FieldControl render={<select><option>Opção</option></select>} />
      </Field>
    )

    expect(screen.getByLabelText("Assunto").tagName).toBe("SELECT")
  })
})

describe("FieldDescription", () => {
  it("renderiza como <p> com text-muted-foreground", () => {
    // Field.Description depende do contexto do Field.Root — não existe fora de um Field.
    render(
      <Field>
        <FieldDescription>Texto de apoio.</FieldDescription>
      </Field>
    )
    const el = screen.getByText("Texto de apoio.")

    expect(el.tagName).toBe("P")
    expect(el.className).toMatch(/\btext-muted-foreground\b/)
  })
})

describe("FieldError", () => {
  it("usa text-foreground, não text-destructive (contraste AA)", async () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>Nome completo</FieldLabel>
        <Input required />
        <FieldError match="valueMissing">Campo obrigatório.</FieldError>
      </Field>
    )

    // O Field só marca "valueMissing" como erro depois que o campo foi alterado
    // pelo menos uma vez (comportamento intencional da Base UI, pra não mostrar
    // "obrigatório" num campo que o usuário nunca tocou) — digitar e apagar
    // deixa o campo "sujo" antes do blur que dispara a validação.
    const input = screen.getByLabelText("Nome completo")
    await userEvent.type(input, "a")
    await userEvent.clear(input)
    await userEvent.tab()

    const error = screen.getByText("Campo obrigatório.")
    expect(error.className).toMatch(/\btext-foreground\b/)
    expect(error.className).not.toMatch(/\btext-destructive\b/)
  })
})

describe("Validação de campo obrigatório vazio", () => {
  it("não mostra erro antes do campo ser tocado", () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>Nome completo</FieldLabel>
        <Input required />
        <FieldError match="valueMissing">Campo obrigatório.</FieldError>
      </Field>
    )

    expect(screen.queryByText("Campo obrigatório.")).not.toBeInTheDocument()
  })

  it("ao sair do campo vazio, aplica aria-invalid e mostra a mensagem de erro", async () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>Nome completo</FieldLabel>
        <Input required />
        <FieldError match="valueMissing">Campo obrigatório.</FieldError>
      </Field>
    )

    const input = screen.getByLabelText("Nome completo")
    await userEvent.type(input, "a")
    await userEvent.clear(input)
    await userEvent.tab()

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByText("Campo obrigatório.")).toBeInTheDocument()
  })
})

describe("Validação de formato de e-mail", () => {
  it("e-mail com formato inválido mostra a mensagem de typeMismatch ao sair do campo", async () => {
    render(
      <Field validationMode="onBlur">
        <FieldLabel>E-mail</FieldLabel>
        <Input type="email" required />
        <FieldError match="valueMissing">Campo obrigatório.</FieldError>
        <FieldError match="typeMismatch">Formato de e-mail inválido.</FieldError>
      </Field>
    )

    const input = screen.getByLabelText("E-mail")
    await userEvent.type(input, "não-é-um-email")
    await userEvent.tab()

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByText("Formato de e-mail inválido.")).toBeInTheDocument()
    expect(screen.queryByText("Campo obrigatório.")).not.toBeInTheDocument()
  })
})

describe("Field — composição completa", () => {
  function CampoNome() {
    return (
      <Field validationMode="onBlur">
        <FieldLabel>Nome completo</FieldLabel>
        <Input required placeholder="Seu nome" />
        <FieldDescription>Como consta no seu documento.</FieldDescription>
        <FieldError match="valueMissing">Campo obrigatório.</FieldError>
      </Field>
    )
  }

  it("renderiza a árvore completa com label, input e descrição", () => {
    render(<CampoNome />)

    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument()
    expect(screen.getByText("Como consta no seu documento.")).toBeInTheDocument()
  })

  it("não tem violações de acessibilidade no estado válido", async () => {
    const { container } = render(<CampoNome />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("não tem violações de acessibilidade no estado inválido", async () => {
    const { container } = render(<CampoNome />)

    const input = screen.getByLabelText("Nome completo")
    await userEvent.type(input, "a")
    await userEvent.clear(input)
    await userEvent.tab()

    expect(screen.getByText("Campo obrigatório.")).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("snapshot no estado padrão", () => {
    const { container } = render(<CampoNome />)

    expect(container.firstElementChild).toMatchSnapshot("estado-padrao")
  })

  it("snapshot no estado inválido", async () => {
    const { container } = render(<CampoNome />)

    const input = screen.getByLabelText("Nome completo")
    await userEvent.type(input, "a")
    await userEvent.clear(input)
    await userEvent.tab()

    expect(screen.getByText("Campo obrigatório.")).toBeInTheDocument()
    expect(container.firstElementChild).toMatchSnapshot("estado-invalido")
  })
})
