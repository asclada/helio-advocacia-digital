import { act, render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it } from "vitest"

import { Header } from "@/components/layout/header"
import { NAV_ANCHORS } from "@/components/layout/nav-links"
import { getLastIntersectionObserver } from "@/test/intersection-observer-mock"

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, writable: true, configurable: true })
}

function appendSection(id: string) {
  const section = document.createElement("section")
  section.id = id
  document.body.appendChild(section)
  return section
}

afterEach(() => {
  setScrollY(0)
  document.body.innerHTML = ""
})

describe("Header", () => {
  it("renderiza o logo (monograma, nome e tagline)", () => {
    render(<Header />)

    const monograma = screen.getByRole("banner").querySelector("img")
    expect(monograma).toHaveAttribute("src", expect.stringContaining("submarca-hk"))
    expect(screen.getByText("Helio Kleison")).toBeInTheDocument()
    expect(screen.getByText(/advocacia.*consultoria/i)).toBeInTheDocument()
  })

  it("o logo (HK + nome) é um link para a Home", () => {
    render(<Header />)

    const logo = screen.getByText("Helio Kleison").closest("a")
    expect(logo).toHaveAttribute("href", "/")
  })

  it("renderiza os 3 links do nav com os hrefs corretos", () => {
    render(<Header />)

    for (const anchor of NAV_ANCHORS) {
      expect(
        screen.getByRole("link", { name: anchor.headerLabel })
      ).toHaveAttribute("href", anchor.href)
    }
  })

  it("renderiza o CTA Fale Conosco", () => {
    render(<Header />)

    expect(screen.getByRole("link", { name: /fale conosco/i })).toBeInTheDocument()
  })

  it("nasce sem fundo sólido", () => {
    setScrollY(0)
    render(<Header />)

    expect(screen.getByRole("banner").className).not.toMatch(/\bbg-navy\b/)
  })

  it("ganha fundo sólido depois de rolar acima do threshold", () => {
    render(<Header />)

    act(() => {
      setScrollY(100)
      window.dispatchEvent(new Event("scroll"))
    })

    expect(screen.getByRole("banner").className).toMatch(/\bbg-navy\b/)
  })

  it("destaca o link da seção ativa via IntersectionObserver", () => {
    const sobre = appendSection("sobre")
    render(<Header />)

    const observer = getLastIntersectionObserver()
    act(() => {
      observer.trigger([{ target: sobre, isIntersecting: true }])
    })

    const activeLink = screen.getByRole("link", { name: "Sobre mim" })
    expect(activeLink).toHaveAttribute("aria-current", "true")
    expect(activeLink.className).toMatch(/\btext-gold-light\b/)

    const inactiveLink = screen.getByRole("link", { name: "FAQ/Contato" })
    expect(inactiveLink).not.toHaveAttribute("aria-current")
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Header />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
