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

const MOBILE_BREAKPOINT_PX = 640

/**
 * Só o navegador embutido do Instagram/Facebook Ads não dá nenhum sinal
 * utilizável sobre o teclado virtual (ver comentário de `handleInputFocus`
 * abaixo). Navegadores mobile normais (Chrome/Safari) já encolhem a
 * viewport sozinhos via `interactiveWidget: "resizes-content"` (ver
 * `layout.tsx`), então o campo fica ancorado no rodapé e desce
 * naturalmente acima do teclado sem precisar de nenhum ajuste manual. Sem
 * essa checagem de user agent, o hack de pular pro topo do painel disparava
 * em QUALQUER tela estreita, inclusive nos navegadores que já funcionavam
 * bem sozinhos.
 */
function precisaDeFallbackDeTeclado(): boolean {
  if (typeof navigator === "undefined") return false
  return /Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent)
}

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
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollBurstRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [campoFocado, setCampoFocado] = useState(false)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ block: "end" })
  }, [mensagens.length, loading])

  /**
   * `blur()` explícito no envio: fecha o teclado virtual no mobile depois
   * de mandar a mensagem, senão o teclado cobre a resposta do agente.
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const mensagemLimpa = texto.trim()
    if (!mensagemLimpa) return
    inputRef.current?.blur()
    onSendMessage(mensagemLimpa)
    setTexto("")
  }

  /**
   * O navegador embutido do Instagram/Facebook Ads não dá NENHUM sinal
   * utilizável sobre o teclado virtual: `visualViewport` existe mas nunca
   * dispara `resize`/`scroll` quando o teclado abre (confirmado com
   * diagnóstico ao vivo em `/debug-viewport`, 2026-08-28), e nem um campo
   * comum (fora de `position:fixed`) recebe o scroll-into-view nativo que
   * a maioria dos navegadores mobile faz sozinha. Só duas coisas se
   * provaram confiáveis nesse navegador: o evento `focus` do próprio
   * campo (sempre dispara) e
   * forçar `scrollTo(0,0)` repetidamente por ~1s (uma tentativa isolada
   * não bastou — o navegador parece corrigir a posição de rolagem sozinho
   * de forma atrasada/inconsistente, sobrescrevendo uma correção única).
   * Combinado com mover o campo pro topo do painel via `order` (abaixo),
   * isso garante que o campo fique visível mesmo sem saber a altura do
   * teclado.
   */
  function handleInputFocus() {
    if (document.documentElement.clientWidth >= MOBILE_BREAKPOINT_PX) return
    if (!precisaDeFallbackDeTeclado()) return
    setCampoFocado(true)

    if (scrollBurstRef.current) clearInterval(scrollBurstRef.current)
    let tentativas = 0
    scrollBurstRef.current = setInterval(() => {
      tentativas += 1
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      if (tentativas >= 10 && scrollBurstRef.current) {
        clearInterval(scrollBurstRef.current)
        scrollBurstRef.current = null
      }
    }, 100)
  }

  function handleInputBlur() {
    setCampoFocado(false)
    if (scrollBurstRef.current) {
      clearInterval(scrollBurstRef.current)
      scrollBurstRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (scrollBurstRef.current) clearInterval(scrollBurstRef.current)
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Popup
          className={cn(
            "fixed inset-x-0 top-(--header-height) bottom-0 z-(--z-chat-widget)",
            "flex w-full flex-col bg-navy-surface",
            "sm:inset-auto sm:top-auto sm:right-6 sm:bottom-24",
            "sm:h-[32rem] sm:max-h-[calc(100dvh-6rem)] sm:w-96",
            "sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl"
          )}
        >
          <div className="order-1 flex items-center gap-3 border-b border-border px-4 py-3">
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

          <div
            className={cn(
              "flex-1 space-y-4 overflow-y-auto px-4 py-4",
              campoFocado ? "order-3 sm:order-2" : "order-2"
            )}
          >
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

          {/*
            `order-2 sm:order-3` quando focado: no mobile (abaixo do
            breakpoint `sm`), o formulário pula pro topo do painel (logo
            abaixo do cabeçalho) em vez de ficar no rodapé — ver comentário
            de `handleInputFocus` acima. `sm:order-3` mantém o desktop
            sempre normal, mesmo com o campo focado (lá não tem teclado
            virtual cobrindo nada). Sem isso, no navegador embutido do
            Instagram/Facebook Ads o teclado cobre o rodapé inteiro e o
            campo/botão de enviar ficam invisíveis.
          */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex items-center gap-2 p-3",
              campoFocado ? "order-2 border-b border-border sm:order-3 sm:border-t sm:border-b-0" : "order-3 border-t border-border"
            )}
          >
            <Input
              ref={inputRef}
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Digite sua mensagem"
              aria-label="Mensagem"
              className="h-11"
            />
            <button
              type="submit"
              disabled={loading || !texto.trim()}
              aria-label="Enviar mensagem"
              /*
               * `onMouseDown` com `preventDefault`: sem isso, o navegador
               * move o foco pro botão no mousedown (antes do clique
               * completar), o que dispara o `onBlur` do campo e reordena o
               * layout (ver `campoFocado` acima) com o dedo/mouse ainda
               * pressionado — o botão literalmente muda de lugar no meio
               * do gesto e o clique não registra, exigindo um segundo
               * toque. Impedir o foco de sair do campo aqui mantém o botão
               * parado durante o clique.
               */
              onMouseDown={(event) => event.preventDefault()}
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
