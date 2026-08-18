import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { useActiveSection } from "@/hooks/use-active-section"
import { getLastIntersectionObserver } from "@/test/intersection-observer-mock"

function appendSection(id: string) {
  const section = document.createElement("section")
  section.id = id
  document.body.appendChild(section)
  return section
}

afterEach(() => {
  document.body.innerHTML = ""
})

describe("useActiveSection", () => {
  it("retorna null quando nenhuma das seções existe no DOM", () => {
    const { result } = renderHook(() => useActiveSection(["atuacao", "sobre"]))

    expect(result.current).toBeNull()
  })

  it("observa cada elemento correspondente aos ids passados", () => {
    const sobre = appendSection("sobre")
    const faq = appendSection("faq")

    renderHook(() => useActiveSection(["sobre", "faq"]))

    const observer = getLastIntersectionObserver()
    expect(observer.observed).toEqual([sobre, faq])
  })

  it("atualiza para o id da seção que a entry marca como intersecting", () => {
    appendSection("atuacao")
    const sobre = appendSection("sobre")

    const { result } = renderHook(() => useActiveSection(["atuacao", "sobre"]))
    const observer = getLastIntersectionObserver()

    act(() => {
      observer.trigger([{ target: sobre, isIntersecting: true }])
    })

    expect(result.current).toBe("sobre")
  })

  it("aplica o rootMargin customizado passado nas options", () => {
    appendSection("contato")

    renderHook(() =>
      useActiveSection(["contato"], { rootMargin: "-72px 0px -60% 0px" })
    )

    const observer = getLastIntersectionObserver()
    expect(observer.rootMargin).toBe("-72px 0px -60% 0px")
  })

  it("desconecta o observer ao desmontar", () => {
    const sobre = appendSection("sobre")
    const { unmount } = renderHook(() => useActiveSection(["sobre"]))
    const observer = getLastIntersectionObserver()

    unmount()

    expect(observer.observed).not.toContain(sobre)
  })
})
