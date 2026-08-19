import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it, vi } from "vitest"

import { ContatoForm } from "@/components/sections/contato-form"

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nome completo"), "Maria Silva")
  await user.type(screen.getByLabelText("WhatsApp"), "(84) 90000-0000")
  await user.type(screen.getByLabelText("E-mail"), "maria@exemplo.com")
  await user.selectOptions(screen.getByLabelText("Assunto"), "Empréstimo Fraudado")
  await user.type(
    screen.getByLabelText("Mensagem"),
    "Preciso de ajuda com um seguro embutido no meu empréstimo."
  )
}

describe("ContatoForm", () => {
  it("renderiza os 5 campos e o botão de envio", () => {
    render(<ContatoForm />)

    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument()
    expect(screen.getByLabelText("WhatsApp")).toBeInTheDocument()
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument()
    expect(screen.getByLabelText("Assunto")).toBeInTheDocument()
    expect(screen.getByLabelText("Mensagem")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeInTheDocument()
  })

  it("o campo Assunto tem as 4 opções reais + o placeholder, sem nenhuma pré-selecionada", () => {
    render(<ContatoForm />)

    const select = screen.getByLabelText<HTMLSelectElement>("Assunto")
    const labels = [...select.options].map((o) => o.textContent)

    expect(labels).toEqual([
      "Selecione o assunto",
      "Venda Casada de Seguro",
      "Empréstimo Fraudado",
      "Consignado a Menor de Idade (INSS)",
      "Outro assunto",
    ])
    expect(select.value).toBe("")
  })

  it("não selecionar nenhum assunto bloqueia o envio, mesmo com o resto preenchido", async () => {
    const handleValidSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ContatoForm onValidSubmit={handleValidSubmit} />)

    await user.type(screen.getByLabelText("Nome completo"), "Maria Silva")
    await user.type(screen.getByLabelText("WhatsApp"), "(84) 90000-0000")
    await user.type(screen.getByLabelText("E-mail"), "maria@exemplo.com")
    await user.type(
      screen.getByLabelText("Mensagem"),
      "Preciso de ajuda com um seguro embutido no meu empréstimo."
    )
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(handleValidSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText("Assunto")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByText("Selecione um assunto.")).toBeInTheDocument()
  })

  it("submeter vazio mostra erros de validação e não chama o onSubmit", async () => {
    const handleValidSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ContatoForm onValidSubmit={handleValidSubmit} />)

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(handleValidSubmit).not.toHaveBeenCalled()
    const nome = screen.getByLabelText("Nome completo")
    expect(nome).toHaveAttribute("aria-invalid", "true")
  })

  it("e-mail com formato inválido bloqueia o envio", async () => {
    const handleValidSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ContatoForm onValidSubmit={handleValidSubmit} />)

    await user.type(screen.getByLabelText("Nome completo"), "Maria Silva")
    await user.type(screen.getByLabelText("WhatsApp"), "(84) 90000-0000")
    await user.type(screen.getByLabelText("E-mail"), "nao-e-um-email")
    await user.type(
      screen.getByLabelText("Mensagem"),
      "Preciso de ajuda com um seguro embutido no meu empréstimo."
    )
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(handleValidSubmit).not.toHaveBeenCalled()
  })

  it("preencher tudo corretamente e enviar chama onValidSubmit, sem mensagem de sucesso", async () => {
    const handleValidSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ContatoForm onValidSubmit={handleValidSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(handleValidSubmit).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/sucesso/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/mensagem enviada/i)).not.toBeInTheDocument()
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<ContatoForm />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
