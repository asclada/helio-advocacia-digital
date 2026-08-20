"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Send, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { ChatMessageBubble } from "@/components/chat/chat-message-bubble"
import type { ChatMessage } from "@/components/chat/use-chat-conversation"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const SAUDACAO_INICIAL =
  "Olá! Sou o assistente virtual do escritório do Dr. Helio Kleison. Como posso te ajudar hoje?"

interface ChatPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mensagens: ChatMessage[]
  loading: boolean
  onSendMessage: (texto: string) => void
}

function ChatPanel({ open, onOpenChange, mensagens, loading, onSendMessage }: ChatPanelProps) {
  const [texto, setTexto] = useState("")
  const [saudacaoTimestamp] = useState(() => Date.now())
  const fimDaListaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ block: "end" })
  }, [mensagens.length, loading])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const mensagemLimpa = texto.trim()
    if (!mensagemLimpa) return
    onSendMessage(mensagemLimpa)
    setTexto("")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Popup
          className={cn(
            "fixed inset-x-0 top-(--header-height) bottom-0 z-(--z-chat-widget)",
            "flex h-[calc(100dvh-var(--header-height))] w-full flex-col bg-navy-surface",
            "sm:inset-auto sm:top-auto sm:right-6 sm:bottom-24",
            "sm:h-[32rem] sm:max-h-[calc(100dvh-6rem)] sm:w-96",
            "sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl"
          )}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Image
              src="/images/dr-helio-sobre.png"
              alt=""
              width={96}
              height={96}
              className="size-10 rounded-full object-cover"
            />
            <Dialog.Title className="flex-1 font-display text-base text-gold-light">
              Dr. Helio Kleison
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fechar chat"
              className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-gold-light"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <ChatMessageBubble
              mensagem={{
                id: "saudacao-inicial",
                role: "agent",
                texto: SAUDACAO_INICIAL,
                timestamp: saudacaoTimestamp,
              }}
            />
            {mensagens.map((mensagem) => (
              <ChatMessageBubble key={mensagem.id} mensagem={mensagem} />
            ))}
            {loading && (
              <p className="text-xs text-muted-foreground">Enviando...</p>
            )}
            <div ref={fimDaListaRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Digite sua mensagem"
              aria-label="Mensagem"
              className="h-11"
            />
            <button
              type="submit"
              disabled={loading || !texto.trim()}
              aria-label="Enviar mensagem"
              className={cn(buttonVariants({ variant: "primary" }), "size-11 shrink-0 rounded-full p-0")}
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ChatPanel }
