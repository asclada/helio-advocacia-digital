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

/**
 * Mesmo bloqueio de storage que pode afetar `garantirConversaId` (ver
 * use-chat-conversation.ts) pode afetar sessionStorage aqui. Se falhar, a
 * origem simplesmente não é registrada — o payload ao n8n sai sem o campo
 * `origem`, como já acontece hoje para tráfego orgânico.
 */
export function registrarOrigem(origem: string): void {
  try {
    sessionStorage.setItem(ORIGEM_STORAGE_KEY, origem)
  } catch {
    // Storage bloqueado: segue sem registrar, sem travar o widget.
  }
}

/**
 * sessionStorage (não localStorage, diferente do conversa_id): a origem da
 * campanha vale só pra aba/sessão que veio do anúncio — evita atribuir uma
 * visita orgânica futura (mesmo navegador, dias depois) à campanha antiga.
 */
export function getOrigem(): string | null {
  try {
    return sessionStorage.getItem(ORIGEM_STORAGE_KEY)
  } catch {
    return null
  }
}
