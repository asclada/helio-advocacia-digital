import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useScrolled } from "@/hooks/use-scrolled"

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, writable: true, configurable: true })
}

afterEach(() => {
  setScrollY(0)
})

describe("useScrolled", () => {
  it("começa false quando o scroll atual já está abaixo do threshold", () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled(64))

    expect(result.current).toBe(false)
  })

  it("começa true quando o scroll atual já está acima do threshold (ex: usuário recarrega a página no meio do scroll)", () => {
    setScrollY(100)
    const { result } = renderHook(() => useScrolled(64))

    expect(result.current).toBe(true)
  })

  it("passa a true depois de um evento de scroll que cruza o threshold", () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled(64))
    expect(result.current).toBe(false)

    act(() => {
      setScrollY(100)
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(true)
  })

  it("volta a false quando o scroll retorna abaixo do threshold", () => {
    setScrollY(100)
    const { result } = renderHook(() => useScrolled(64))
    expect(result.current).toBe(true)

    act(() => {
      setScrollY(0)
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(false)
  })

  it("remove o listener de scroll ao desmontar", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener")
    const { unmount } = renderHook(() => useScrolled(64))

    unmount()

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function))
    removeSpy.mockRestore()
  })
})
