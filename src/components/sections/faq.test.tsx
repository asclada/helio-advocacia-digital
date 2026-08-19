import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { Faq } from "@/components/sections/faq"

const PERGUNTA_1 =
  "Posso cancelar um seguro que veio embutido no meu empréstimo sem que eu tenha autorizado?"
const RESPOSTA_1 = /Se o seguro foi imposto como condição/
const PERGUNTA_2 = "Descobri um empréstimo em meu nome que nunca contratei. O que fazer?"
const RESPOSTA_2 = /Reúna os extratos e comprovantes/

describe("Faq", () => {
  it("renderiza as 4 perguntas, todas fechadas por padrão", () => {
    render(<Faq />)

    expect(screen.getByRole("button", { name: new RegExp(PERGUNTA_1) })).toBeInTheDocument()
    expect(screen.queryByText(RESPOSTA_1)).not.toBeInTheDocument()
  })

  it("clicar numa pergunta abre a resposta correspondente", async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(screen.getByRole("button", { name: new RegExp(PERGUNTA_1) }))

    expect(screen.getByText(RESPOSTA_1)).toBeInTheDocument()
  })

  it("clicar de novo na mesma pergunta fecha a resposta", async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const trigger = screen.getByRole("button", { name: new RegExp(PERGUNTA_1) })
    await user.click(trigger)
    expect(screen.getByText(RESPOSTA_1)).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.queryByText(RESPOSTA_1)).not.toBeInTheDocument()
  })

  it("abrir uma pergunta fecha a que estava aberta antes (só 1 por vez)", async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(screen.getByRole("button", { name: new RegExp(PERGUNTA_1) }))
    expect(screen.getByText(RESPOSTA_1)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: new RegExp(PERGUNTA_2) }))
    expect(screen.getByText(RESPOSTA_2)).toBeInTheDocument()
    expect(screen.queryByText(RESPOSTA_1)).not.toBeInTheDocument()
  })

  it("não tem violações de acessibilidade com uma pergunta aberta", async () => {
    const user = userEvent.setup()
    const { container } = render(<Faq />)

    await user.click(screen.getByRole("button", { name: new RegExp(PERGUNTA_1) }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
