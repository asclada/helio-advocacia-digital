import { X } from "lucide-react"

interface ChatNotificationBubbleProps {
  onOpenChat: () => void
  onDismiss: () => void
}

function ChatNotificationBubble({ onOpenChat, onDismiss }: ChatNotificationBubbleProps) {
  return (
    <div className="relative max-w-64 rounded-2xl border border-border bg-card py-3 pr-9 pl-4 shadow-lg">
      <button
        type="button"
        onClick={onOpenChat}
        className="text-left text-sm text-foreground"
      >
        Olá, posso te ajudar?
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="absolute top-1 right-1 flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-gold-light"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export { ChatNotificationBubble }
