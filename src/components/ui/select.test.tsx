import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Select } from "@/components/ui/select"

const OPTIONS = [
  { label: "Venda Casada de Seguro", value: "venda-casada-de-seguro" },
  { label: "Empréstimo Fraudado", value: "emprestimo-fraudado" },
  { label: "Consignado a Menor de Idade (INSS)", value: "consignado-menor" },
  { label: "Outro assunto", value: "outro" },
]

describe("Select", () => {
  it("renderiza como <select> com as opções corretas", () => {
    render(<Select aria-label="Assunto" options={OPTIONS} />)

    const el = screen.getByLabelText<HTMLSelectElement>("Assunto")
    expect(el.tagName).toBe("SELECT")
    expect(el.options).toHaveLength(4)
    expect(el.options[0].textContent).toBe("Venda Casada de Seguro")
    expect(el.options[3].textContent).toBe("Outro assunto")
  })

  it("com placeholder, renderiza uma opção inicial desabilitada e sem nenhuma opção real selecionada", () => {
    render(
      <Select
        aria-label="Assunto"
        options={OPTIONS}
        placeholder="Selecione o assunto"
        defaultValue=""
      />
    )

    const el = screen.getByLabelText<HTMLSelectElement>("Assunto")
    expect(el.options).toHaveLength(5)
    expect(el.options[0].textContent).toBe("Selecione o assunto")
    expect(el.options[0].disabled).toBe(true)
    expect(el.value).toBe("")
  })

  it("todas as options têm fundo escuro explícito (evita texto claro sobre fundo claro do navegador)", () => {
    render(
      <Select
        aria-label="Assunto"
        options={OPTIONS}
        placeholder="Selecione o assunto"
        defaultValue=""
      />
    )

    const el = screen.getByLabelText<HTMLSelectElement>("Assunto")
    for (const option of el.options) {
      expect(option.className).toMatch(/\bbg-navy\b/)
    }
  })

  it("aplica as mesmas classes-base visuais do Input", () => {
    render(<Select aria-label="Assunto" options={OPTIONS} />)
    const el = screen.getByLabelText("Assunto")

    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
    expect(el.className).toMatch(/\bw-full\b/)
    expect(el.className).toMatch(/\brounded-lg\b/)
  })

  it("permite trocar de opção via seleção do usuário", async () => {
    const user = userEvent.setup()
    render(<Select aria-label="Assunto" options={OPTIONS} />)

    const el = screen.getByLabelText<HTMLSelectElement>("Assunto")
    await user.selectOptions(el, "outro")

    expect(el.value).toBe("outro")
  })

  it("estado disabled desabilita o elemento", () => {
    render(<Select aria-label="Assunto" options={OPTIONS} disabled />)

    expect(screen.getByLabelText("Assunto")).toBeDisabled()
  })

  it("mescla className extra sem remover as classes base", () => {
    render(<Select aria-label="Assunto" options={OPTIONS} className="minha-classe" />)
    const el = screen.getByLabelText("Assunto")

    expect(el.className).toMatch(/\bminha-classe\b/)
    expect(el.className).toMatch(/\bborder-muted-foreground\b/)
  })

  it("não tem violações de acessibilidade quando tem nome acessível próprio", async () => {
    const { container } = render(<Select aria-label="Assunto" options={OPTIONS} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
