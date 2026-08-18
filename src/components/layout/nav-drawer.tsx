"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { WhatsAppCta } from "@/components/ui/whatsapp-cta"

import { NAV_ANCHORS } from "./nav-links"

function NavDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Abrir menu"
        className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:text-gold-light md:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop
          data-testid="nav-drawer-backdrop"
          className="fixed inset-0 z-(--z-drawer) bg-navy-deep/70"
        />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-(--z-drawer) flex w-full max-w-xs flex-col gap-8 bg-navy-surface p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg text-gold-light">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fechar menu"
              className="rounded-lg p-2 text-foreground transition-colors hover:text-gold-light"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav aria-label="Navegação mobile" className="flex flex-col gap-6">
            {NAV_ANCHORS.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                onClick={() => setOpen(false)}
                className="text-lg text-foreground transition-colors hover:text-gold-light"
              >
                {anchor.headerLabel}
              </a>
            ))}
          </nav>

          <WhatsAppCta size="lg" className="mt-auto w-full" />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { NavDrawer }
