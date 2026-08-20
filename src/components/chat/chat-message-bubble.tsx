import type { ChatMessage } from "@/components/chat/use-chat-conversation"
import { cn } from "@/lib/utils"

function formatarHorario(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * O agente do n8n é o mesmo que atendia via WhatsApp, então ainda formata
 * ênfase no padrão de lá (`*texto*`), que aqui apareceria como asterisco
 * literal. Converte para `<strong>` em vez de mudar o system message do
 * agente — é formatação de apresentação, responsabilidade da UI.
 */
function renderizarEnfase(texto: string) {
  return texto.split(/(\*[^*\n]+\*)/g).map((parte, indice) =>
    parte.startsWith("*") && parte.endsWith("*") && parte.length > 2 ? (
      <strong key={indice} className="font-semibold">
        {parte.slice(1, -1)}
      </strong>
    ) : (
      parte
    )
  )
}

function ChatMessageBubble({ mensagem }: { mensagem: ChatMessage }) {
  const isUsuario = mensagem.role === "user"

  return (
    <div className={cn("flex flex-col gap-1", isUsuario ? "items-end" : "items-start")}>
      {/*
        `whitespace-pre-wrap` preserva as quebras de linha que o agente
        envia (listas numeradas, parágrafos) — sem isso o HTML colapsa
        todos os `\n` e a resposta vira um bloco único ilegível, como
        apareceu no teste real em celular (ver handoff da Fase 8).
      */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
          isUsuario
            ? "bg-gold text-primary-foreground"
            : "bg-navy-line text-foreground"
        )}
      >
        {renderizarEnfase(mensagem.texto)}
      </div>
      <span className="px-1 text-[11px] text-muted-foreground">
        {formatarHorario(mensagem.timestamp)}
      </span>
    </div>
  )
}

export { ChatMessageBubble }
