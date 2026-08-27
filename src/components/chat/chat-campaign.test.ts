import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  CHAT_OPEN_PARAM,
  CHAT_OPEN_VALUE,
  ORIGEM_PARAM,
  getOrigem,
  parseChatCampaignParams,
  registrarOrigem,
} from "@/components/chat/chat-campaign"

const STORAGE_KEY = "helio-chat-origem"

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  sessionStorage.clear()
})

describe("parseChatCampaignParams", () => {
  it("retorna shouldAutoOpen=false e origem=null quando nenhum param está presente", () => {
    expect(parseChatCampaignParams("")).toEqual({ shouldAutoOpen: false, origem: null })
  })

  it(`retorna shouldAutoOpen=true quando ${CHAT_OPEN_PARAM}=${CHAT_OPEN_VALUE}`, () => {
    const resultado = parseChatCampaignParams(`?${CHAT_OPEN_PARAM}=${CHAT_OPEN_VALUE}`)
    expect(resultado.shouldAutoOpen).toBe(true)
    expect(resultado.origem).toBeNull()
  })

  it("retorna shouldAutoOpen=false para um valor de chat não reconhecido", () => {
    const resultado = parseChatCampaignParams(`?${CHAT_OPEN_PARAM}=closed`)
    expect(resultado.shouldAutoOpen).toBe(false)
  })

  it(`captura ${ORIGEM_PARAM} quando presente, sem exigir ${CHAT_OPEN_PARAM}`, () => {
    const resultado = parseChatCampaignParams(`?${ORIGEM_PARAM}=facebook_ads`)
    expect(resultado.origem).toBe("facebook_ads")
    expect(resultado.shouldAutoOpen).toBe(false)
  })

  it("trata origem vazia (?origem=) como ausente", () => {
    const resultado = parseChatCampaignParams(`?${ORIGEM_PARAM}=`)
    expect(resultado.origem).toBeNull()
  })

  it("captura os dois params juntos, como no link real do anúncio", () => {
    const resultado = parseChatCampaignParams(
      `?${CHAT_OPEN_PARAM}=${CHAT_OPEN_VALUE}&${ORIGEM_PARAM}=instagram_ads`
    )
    expect(resultado).toEqual({ shouldAutoOpen: true, origem: "instagram_ads" })
  })

  it("trunca origem em 100 caracteres para não propagar lixo arbitrário adiante", () => {
    const origemGigante = "a".repeat(200)
    const resultado = parseChatCampaignParams(`?${ORIGEM_PARAM}=${origemGigante}`)
    expect(resultado.origem).toHaveLength(100)
    expect(resultado.origem).toBe("a".repeat(100))
  })
})

describe("registrarOrigem / getOrigem", () => {
  it("getOrigem retorna null quando nada foi registrado", () => {
    expect(getOrigem()).toBeNull()
  })

  it("registrarOrigem persiste no sessionStorage e getOrigem lê de volta", () => {
    registrarOrigem("facebook_ads")

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("facebook_ads")
    expect(getOrigem()).toBe("facebook_ads")
  })

  describe("quando sessionStorage lança exceção (ex: in-app browser do Instagram/Facebook bloqueando storage)", () => {
    it("registrarOrigem não lança, apenas deixa de persistir", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("Storage bloqueado", "SecurityError")
      })

      expect(() => registrarOrigem("facebook_ads")).not.toThrow()

      setItemSpy.mockRestore()
    })

    it("getOrigem retorna null em vez de lançar", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("Storage bloqueado", "SecurityError")
      })

      expect(() => getOrigem()).not.toThrow()
      expect(getOrigem()).toBeNull()

      getItemSpy.mockRestore()
    })
  })
})
