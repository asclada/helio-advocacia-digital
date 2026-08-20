"use client"

import { useState } from "react"

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
