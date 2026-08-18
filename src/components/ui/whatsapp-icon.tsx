import type { SVGProps } from "react"

/**
 * Glyph oficial do WhatsApp como SVG inline, estilizado via `currentColor` em
 * vez do verde de marca — o CTA usa a cor `gold` do design system (ver
 * docs/specs/fase3-header-nav-footer.md, 2.2), mantendo só a forma
 * reconhecível do ícone. Inline em vez de uma dependência nova: nenhuma
 * biblioteca já instalada (lucide-react) tem esse glyph de marca.
 */
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.44 5.13L2 22l5.11-1.53a9.87 9.87 0 0 0 4.93 1.31h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 17.9h-.01a8.5 8.5 0 0 1-4.31-1.18l-.31-.18-3.03.9.91-2.95-.2-.31a8.44 8.44 0 0 1-1.3-4.5c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.48a8.4 8.4 0 0 1 2.47 5.97c0 4.66-3.79 8.45-8.45 8.45Z" />
    </svg>
  )
}

export { WhatsAppIcon }
