"use client"

import Link from "next/link"

import { Container } from "@/components/ui/container"
import { WhatsAppCta } from "@/components/ui/whatsapp-cta"
import { useActiveSection } from "@/hooks/use-active-section"
import { useScrolled } from "@/hooks/use-scrolled"
import { HEADER_HEIGHT_PX } from "@/lib/layout-tokens"
import { cn } from "@/lib/utils"

import { NAV_ANCHOR_IDS, NAV_ANCHORS } from "./nav-links"
import { NavDrawer } from "./nav-drawer"

const SCROLL_THRESHOLD_PX = 64

function Header() {
  const scrolled = useScrolled(SCROLL_THRESHOLD_PX)
  const activeId = useActiveSection(NAV_ANCHOR_IDS, {
    rootMargin: `-${HEADER_HEIGHT_PX}px 0px -60% 0px`,
  })

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-(--z-header) h-(--header-height) transition-colors duration-300",
        scrolled ? "bg-navy shadow-md shadow-black/20" : "bg-transparent"
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span aria-hidden="true" className="font-display text-lg text-gold">
            HK
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold text-foreground">
              Helio Kleison
            </span>
            <span className="text-xs tracking-widest text-muted-foreground">
              ADVOCACIA &amp; CONSULTORIA
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex">
          {NAV_ANCHORS.map((anchor) => {
            const isActive = activeId === anchor.id
            return (
              <Link
                key={anchor.id}
                href={anchor.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "text-base font-medium transition-colors",
                  isActive ? "text-gold-light" : "text-foreground hover:text-gold-light"
                )}
              >
                {anchor.headerLabel}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <WhatsAppCta size="lg" />
        </div>

        <NavDrawer />
      </Container>
    </header>
  )
}

export { Header }
