import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import { NavDrawer } from "@/components/layout/nav-drawer"
import { NAV_ANCHORS } from "@/components/layout/nav-links"

describe("NavDrawer", () => {
  it("começa fechado, sem o dialog no documento", () => {
    render(<NavDrawer />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("abre ao clicar no botão hambúrguer, mostrando os 3 links e o CTA", async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)

    await user.click(screen.getByRole("button", { name: /abrir menu/i }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    for (const anchor of NAV_ANCHORS) {
      expect(
        screen.getByRole("link", { name: anchor.headerLabel })
      ).toHaveAttribute("href", anchor.href)
    }
    expect(screen.getByRole("link", { name: /fale conosco/i })).toBeInTheDocument()
  })

  it("fecha ao pressionar Esc e devolve o foco ao hambúrguer", async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)

    const trigger = screen.getByRole("button", { name: /abrir menu/i })
    await user.click(trigger)
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.keyboard("{Escape}")

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("fecha ao clicar no botão de fechar (✕)", async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)

    await user.click(screen.getByRole("button", { name: /abrir menu/i }))
    await user.click(screen.getByRole("button", { name: /fechar menu/i }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("fecha ao clicar no overlay/backdrop", async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)

    await user.click(screen.getByRole("button", { name: /abrir menu/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByTestId("nav-drawer-backdrop"))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("fecha ao clicar em um link de navegação", async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)

    await user.click(screen.getByRole("button", { name: /abrir menu/i }))
    await user.click(screen.getByRole("link", { name: NAV_ANCHORS[0].headerLabel }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("não tem violações de acessibilidade com o drawer aberto", async () => {
    const user = userEvent.setup()
    const { baseElement } = render(<NavDrawer />)

    await user.click(screen.getByRole("button", { name: /abrir menu/i }))

    expect(await axe(baseElement)).toHaveNoViolations()
  })
})
