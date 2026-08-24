const ORIGEM_STORAGE_KEY = "helio-chat-origem"
const ORIGEM_MAX_LENGTH = 100

export const CHAT_OPEN_PARAM = "chat"
export const CHAT_OPEN_VALUE = "open"
export const ORIGEM_PARAM = "origem"

export interface ChatCampaignParams {
  shouldAutoOpen: boolean
  origem: string | null
}

export function parseChatCampaignParams(search: string): ChatCampaignParams {
  const params = new URLSearchParams(search)
  const origemBruta = params.get(ORIGEM_PARAM)

  return {
    shouldAutoOpen: params.get(CHAT_OPEN_PARAM) === CHAT_OPEN_VALUE,
    origem: origemBruta ? origemBruta.slice(0, ORIGEM_MAX_LENGTH) : null,
  }
}

export function registrarOrigem(origem: string): void {
  sessionStorage.setItem(ORIGEM_STORAGE_KEY, origem)
}

/**
 * sessionStorage (não localStorage, diferente do conversa_id): a origem da
 * campanha vale só pra aba/sessão que veio do anúncio — evita atribuir uma
 * visita orgânica futura (mesmo navegador, dias depois) à campanha antiga.
 */
export function getOrigem(): string | null {
  return sessionStorage.getItem(ORIGEM_STORAGE_KEY)
}
