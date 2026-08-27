"use client"

import { useRef, useState } from "react"

import { getOrigem } from "@/components/chat/chat-campaign"

export interface ChatMessage {
  id: string
  role: "user" | "agent"
  texto: string
  timestamp: number
}

const CONVERSA_ID_STORAGE_KEY = "helio-chat-conversa-id"
const MENSAGEM_ERRO_GENERICA =
  "Não foi possível enviar sua mensagem agora. Tente novamente em instantes."

/**
 * `crypto.randomUUID()` só existe em contexto seguro (HTTPS ou localhost) —
 * fica `undefined` ao acessar o site por IP puro em HTTP (ex: testando pelo
 * celular via rede local em desenvolvimento). Fallback via
 * `crypto.getRandomValues` (não exige contexto seguro) gera um UUID v4
 * equivalente sem depender dessa API restrita.
 */
function gerarId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function criarMensagem(role: ChatMessage["role"], texto: string): ChatMessage {
  return { id: gerarId(), role, texto, timestamp: Date.now() }
}

export function useChatConversation() {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const conversaIdRef = useRef<string | null>(null)

  /**
   * Alguns in-app browsers (ex: webview do Instagram/Facebook) bloqueiam ou
   * lançam exceção ao acessar localStorage. Se isso acontecer, cai para um
   * id só em memória (via conversaIdRef) em vez de travar o widget — o
   * conversa_id simplesmente não sobrevive a um reload da página nesse caso.
   */
  function garantirConversaId(): string {
    if (conversaIdRef.current) return conversaIdRef.current

    let id: string
    try {
      const existente = localStorage.getItem(CONVERSA_ID_STORAGE_KEY)
      id = existente ?? gerarId()
      if (!existente) localStorage.setItem(CONVERSA_ID_STORAGE_KEY, id)
    } catch {
      id = gerarId()
    }

    conversaIdRef.current = id
    return id
  }

  async function sendMessage(texto: string) {
    const conversaId = garantirConversaId()

    setMensagens((prev) => [...prev, criarMensagem("user", texto)])
    setLoading(true)
    setError(false)

    try {
      const origem = getOrigem()
      const payload = origem
        ? { conversa_id: conversaId, mensagem: texto, origem }
        : { conversa_id: conversaId, mensagem: texto }

      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!resposta.ok) throw new Error("Resposta não-2xx do proxy de chat")

      const dados = await resposta.json()
      if (!Array.isArray(dados?.respostas)) {
        throw new Error("Formato inesperado: 'respostas' ausente ou não é array")
      }

      setMensagens((prev) => [
        ...prev,
        ...dados.respostas.map((texto: string) => criarMensagem("agent", texto)),
      ])
    } catch {
      setError(true)
      setMensagens((prev) => [...prev, criarMensagem("agent", MENSAGEM_ERRO_GENERICA)])
    } finally {
      setLoading(false)
    }
  }

  return { mensagens, loading, error, sendMessage, garantirConversaId }
}
