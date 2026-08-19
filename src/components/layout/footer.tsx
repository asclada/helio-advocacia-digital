import { Mail, MapPin, Scale } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { getWhatsAppUrl } from "@/components/ui/whatsapp-cta"

import { NAV_ANCHORS } from "./nav-links"

function Footer() {
  return (
    <footer className="border-t border-border bg-navy-surface">
      <Container className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="font-display text-lg font-semibold text-gold-light">
            Helio Kleison
          </span>
          <p className="max-w-xs text-sm text-muted-foreground">
            Advocacia especializada em Direito Bancário, atendimento
            presencial em Natal/RN e online para todo o Brasil.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé" className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-widest text-gold-light">
            Navegação
          </span>
          {NAV_ANCHORS.map((anchor) => (
            <a
              key={anchor.id}
              href={anchor.href}
              className="text-sm text-muted-foreground transition-colors hover:text-gold-light"
            >
              {anchor.footerLabel}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-widest text-gold-light">
            Contato
          </span>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-light"
          >
            <WhatsAppIcon className="size-4 text-gold" />
            (84) 99477-6673
          </a>
          <a
            href="https://instagram.com/heliokleison.advocacia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-light"
          >
            <InstagramIcon className="size-4 text-gold" />
            @heliokleison.advocacia
          </a>
          <a
            href="https://www.facebook.com/heliokleison.advocacia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-light"
          >
            <FacebookIcon className="size-4 text-gold" />
            Helio Kleison Advogado
          </a>
          <a
            href="mailto:heliokleison.advocacia@gmail.com"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-light"
          >
            <Mail className="size-4 text-gold" aria-hidden="true" />
            heliokleison.advocacia@gmail.com
          </a>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            Natal/RN
          </span>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale className="size-4 text-gold" aria-hidden="true" />
            OAB/RN 20.357
          </span>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-4 py-5 text-xs text-muted-foreground">
          <p>
            © Helio Kleison Advocacia e Consultoria Jurídica. Todos os
            direitos reservados.
          </p>
          <p className="max-w-3xl">
            Este site tem caráter exclusivamente informativo, em
            conformidade com o Provimento nº 205/2021 do Conselho Federal
            da OAB. As informações aqui apresentadas não configuram
            publicidade irregular, tampouco constituem promessa ou
            garantia de resultado — todo atendimento jurídico depende de
            avaliação individual do caso.
          </p>
        </Container>
      </div>

      {/*
        Reserva de espaço/z-index para o widget de chat AI da Fase 8 (ver
        docs/specs/fase3-header-nav-footer.md, 3.2). Nenhuma lógica ou
        conteúdo é implementado aqui — só o token de posição/z-index.
      */}
      <div
        data-slot="chat-widget-reserve"
        aria-hidden="true"
        className="fixed right-6 bottom-6 z-(--z-chat-widget)"
      />
    </footer>
  )
}

export { Footer }
