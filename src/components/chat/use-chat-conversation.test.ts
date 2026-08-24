import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { registrarOrigem } from "@/components/chat/chat-campaign"
import { useChatConversation } from "@/components/chat/use-chat-conversation"

const STORAGE_KEY = "helio-chat-conversa-id"

function mockFetchResolvedOnce(response: { ok: boolean; json: () => Promise<unknown> }) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response as Response))
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useChatConversation", () => {
  describe("garantirConversaId", () => {
    it("gera um novo conversa_id e persiste no localStorage na primeira chamada", () => {
      const { result } = renderHook(() => useChatConversation())

      let id = ""
      act(() => {
        id = result.current.garantirConversaId()
      })

      expect(id).toMatch(/^[0-9a-f-]{36}$/)
      expect(localStorage.getItem(STORAGE_KEY)).toBe(id)
    })

    it("retorna o mesmo id em chamadas seguintes, sem gravar de novo no localStorage", () => {
      const { result } = renderHook(() => useChatConversation())
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem")

      let first = ""
      let second = ""
      act(() => {
        first = result.current.garantirConversaId()
        second = result.current.garantirConversaId()
      })

      expect(second).toBe(first)
      expect(setItemSpy).toHaveBeenCalledTimes(1)
      setItemSpy.mockRestore()
    })

    it("reaproveita um conversa_id já existente no localStorage (reabertura em nova instância do hook)", () => {
      localStorage.setItem(STORAGE_KEY, "id-existente")
      const { result } = renderHook(() => useChatConversation())

      let id = ""
      act(() => {
        id = result.current.garantirConversaId()
      })

      expect(id).toBe("id-existente")
    })
  })

  describe("sendMessage", () => {
    it("adiciona a bolha do usuário de forma otimista e liga o loading antes do fetch resolver", async () => {
      mockFetchResolvedOnce({ ok: true, json: async () => ({ respostas: ["Olá!"] }) })

      const { result } = renderHook(() => useChatConversation())

      let pending: Promise<void> | undefined
      act(() => {
        pending = result.current.sendMessage("Oi")
      })

      expect(result.current.mensagens).toHaveLength(1)
      expect(result.current.mensagens[0]).toMatchObject({ role: "user", texto: "Oi" })
      expect(result.current.loading).toBe(true)

      await act(async () => {
        await pending
      })
    })

    it("caminho feliz: cada item de respostas vira uma bolha separada do agente, loading volta a false", async () => {
      mockFetchResolvedOnce({
        ok: true,
        json: async () => ({ respostas: ["Parte 1", "Parte 2"] }),
      })

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      expect(result.current.mensagens).toHaveLength(3)
      expect(result.current.mensagens[1]).toMatchObject({ role: "agent", texto: "Parte 1" })
      expect(result.current.mensagens[2]).toMatchObject({ role: "agent", texto: "Parte 2" })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(false)
    })

    it("inclui origem no body quando há valor registrado via registrarOrigem", async () => {
      registrarOrigem("facebook_ads")
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ respostas: ["ok"] }) } as Response)
      vi.stubGlobal("fetch", fetchMock)

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      const body = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(body.origem).toBe("facebook_ads")
    })

    it("omite a chave origem do body quando não há valor registrado (tráfego orgânico)", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ respostas: ["ok"] }) } as Response)
      vi.stubGlobal("fetch", fetchMock)

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      const body = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect("origem" in body).toBe(false)
    })

    it("reusa o mesmo conversa_id em várias chamadas de sendMessage", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ respostas: ["ok"] }) } as Response)
      vi.stubGlobal("fetch", fetchMock)

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("primeira")
      })
      await act(async () => {
        await result.current.sendMessage("segunda")
      })

      const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body)
      expect(secondBody.conversa_id).toBe(firstBody.conversa_id)
    })

    it("falha de rede: bolha de erro genérica, error marcado, loading limpo, não relança", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("network")))

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(true)
      expect(result.current.mensagens).toHaveLength(2)
      expect(result.current.mensagens[1].role).toBe("agent")
    })

    it("resposta não-2xx: mesmo tratamento de erro genérico", async () => {
      mockFetchResolvedOnce({ ok: false, json: async () => ({}) })

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      expect(result.current.error).toBe(true)
      expect(result.current.mensagens).toHaveLength(2)
    })

    it("formato inesperado (respostas ausente ou não é array): mesmo tratamento de erro genérico", async () => {
      mockFetchResolvedOnce({ ok: true, json: async () => ({}) })

      const { result } = renderHook(() => useChatConversation())

      await act(async () => {
        await result.current.sendMessage("Oi")
      })

      expect(result.current.error).toBe(true)
      expect(result.current.mensagens).toHaveLength(2)
    })
  })
})
