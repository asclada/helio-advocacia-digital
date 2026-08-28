"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT_PX = 640

/**
 * Altura (em px) do teclado virtual cobrindo a viewport, calculada via
 * `visualViewport` em vez de depender só de `100dvh` +
 * `interactiveWidget: "resizes-content"` (meta viewport em layout.tsx).
 * Esse meta é suporte recente do Chromium e alguns in-app browsers de
 * campanha (ex: navegador embutido do Facebook Ads) não o respeitam — a
 * página não encolhe quando o teclado abre, e o teclado cobre o campo de
 * digitação e o botão de enviar. `visualViewport` tem suporte bem mais
 * amplo (inclusive nesses in-app browsers), então usamos ele pra empurrar
 * o painel do chat pra cima manualmente enquanto o teclado estiver aberto.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    function atualizar() {
      if (window.innerWidth >= MOBILE_BREAKPOINT_PX) {
        setInset(0)
        return
      }
      const proximoInset = window.innerHeight - viewport!.height - viewport!.offsetTop
      setInset(Math.max(0, Math.round(proximoInset)))
    }

    atualizar()
    viewport.addEventListener("resize", atualizar)
    viewport.addEventListener("scroll", atualizar)
    return () => {
      viewport.removeEventListener("resize", atualizar)
      viewport.removeEventListener("scroll", atualizar)
    }
  }, [])

  return inset
}
