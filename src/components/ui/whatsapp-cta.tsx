import type { ReactNode } from "react"

import { buttonVariants } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { cn } from "@/lib/utils"

const WHATSAPP_NUMBER = "5584994776673"
const DEFAULT_MESSAGE = "Olá, vim pelo site e gostaria de mais informações."

interface WhatsAppCtaProps {
  message?: string
  size?: "default" | "lg"
  className?: string
  children?: ReactNode
}

/**
 * Reaproveita o estilo do `Button` (`buttonVariants`) num `<a>` nativo, em
 * vez do primitivo `Button` do Base UI. Este CTA é uma navegação de verdade
 * (abre o wa.me em nova aba) — usar `Button` com `render={<a />}` força uma
 * escolha entre um aviso do Base UI (`nativeButton` inconsistente) ou
 * `role="button"` sobrescrevendo a semântica de link nativa do `<a>`, que é
 * a role correta aqui (WAI-ARIA: link para navegação, button para ação sem
 * navegação). Um `<a href>` puro já tem essa semântica e o suporte de
 * teclado completo de graça.
 *
 * `size="lg"`: usado onde o CTA precisa ser o elemento de maior destaque
 * visual (Header, drawer mobile) — o `Button` da Fase 2 não tem variante de
 * tamanho, só de cor, então o ajuste é local a este componente.
 */
function WhatsAppCta({
  message = DEFAULT_MESSAGE,
  size = "default",
  className,
  children,
}: WhatsAppCtaProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "primary" }),
        size === "lg" && "h-10 gap-2 px-4 text-base",
        className
      )}
    >
      <WhatsAppIcon className={cn("size-4", size === "lg" && "size-5")} />
      {children ?? "Fale Conosco"}
    </a>
  )
}

export { WhatsAppCta }
