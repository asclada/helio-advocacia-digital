"use client"

import { useEffect, useRef, useState } from "react"

import {
  CHAT_OPEN_PARAM,
  ORIGEM_PARAM,
  parseChatCampaignParams,
  registrarOrigem,
} from "@/components/chat/chat-campaign"
import { ChatChip } from "@/components/chat/chat-chip"
import { ChatNotificationBubble } from "@/components/chat/chat-notification-bubble"
import { ChatPanel } from "@/components/chat/chat-panel"
import { useChatConversation } from "@/components/chat/use-chat-conversation"

function ChatWidget() {
  const [aberto, setAberto] = useState(false)
  const [notificacaoVisivel, setNotificacaoVisivel] = useState(true)
  const { mensagens, loading, sendMessage, garantirConversaId } = useChatConversation()

  function abrirPainel() {
    garantirConversaId()
    setNotificacaoVisivel(false)
    setAberto(true)
  }

  const shouldAutoOpenRef = useRef(false)

  /**
   * Deep link de campanha (ex: ?chat=open&origem=facebook_ads) — só roda no
   * mount inicial, nunca de novo em navegação client-side dentro do site
   * (ChatWidget vive no layout raiz e não remonta entre páginas).
   *
   * `shouldAutoOpenRef` existe só pra satisfazer a regra
   * react-hooks/set-state-in-effect: ela só permite setState síncrono
   * dentro de um efeito quando a condição que o guarda vem de um ref — por
   * isso o resultado do parse é gravado no ref antes de decidir se abre o
   * painel, em vez de testar a variável local diretamente.
   */
  useEffect(() => {
    const { shouldAutoOpen, origem } = parseChatCampaignParams(window.location.search)
    if (!shouldAutoOpen && !origem) return

    if (origem) registrarOrigem(origem)

    const url = new URL(window.location.href)
    url.searchParams.delete(CHAT_OPEN_PARAM)
    url.searchParams.delete(ORIGEM_PARAM)
    // Preserva o history.state atual (em vez de null): o AppRouter do Next
    // guarda estado interno ali para navegação voltar/avançar, e o efeito
    // deste componente pode rodar antes do patch de history do router ser
    // instalado no mount inicial.
    window.history.replaceState(window.history.state, "", url)

    shouldAutoOpenRef.current = shouldAutoOpen
    if (shouldAutoOpenRef.current) {
      abrirPainel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="fixed right-6 bottom-6 z-(--z-chat-widget) flex flex-col items-end gap-3">
        {notificacaoVisivel && (
          <ChatNotificationBubble
            onOpenChat={abrirPainel}
            onDismiss={() => setNotificacaoVisivel(false)}
          />
        )}
        <ChatChip onClick={abrirPainel} />
      </div>

      <ChatPanel
        open={aberto}
        onOpenChange={setAberto}
        mensagens={mensagens}
        loading={loading}
        onSendMessage={sendMessage}
      />
    </>
  )
}

export { ChatWidget }
