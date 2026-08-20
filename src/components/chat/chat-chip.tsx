import { MessageCircle } from "lucide-react"

interface ChatChipProps {
  onClick: () => void
}

function ChatChip({ onClick }: ChatChipProps) {
  return (
    <div className="relative">
      {/*
        Anel pulsante + brilho permanente: o chip precisa se anunciar como
        clicável o tempo todo — inclusive depois de o balão de notificação
        ser dispensado, quando ele fica sozinho na tela (pedido do Lucas
        após o teste real). `animation-duration` alongado deixa a pulsação
        discreta em vez do `animate-ping` padrão, que é agressivo demais
        para um elemento permanente. `motion-reduce:animate-none` respeita
        quem configurou o sistema para reduzir animações — o brilho
        estático continua valendo nesse caso.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.8s] motion-reduce:animate-none"
      />
      <button
        type="button"
        onClick={onClick}
        aria-label="Abrir chat com o Dr. Helio"
        className="relative flex size-14 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg shadow-gold/50 ring-2 ring-gold-light/40 transition-transform hover:scale-105 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </button>
    </div>
  )
}

export { ChatChip }
