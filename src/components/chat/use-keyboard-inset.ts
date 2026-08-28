"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT_PX = 640

/**
 * Altura (em px) do teclado virtual cobrindo a viewport, calculada via
 * `visualViewport` em vez de depender só de `100dvh` +
 * `interactiveWidget: "resizes-content"` (meta viewport em layout.tsx).
 * Esse meta é suporte recente do Chromium e alguns in-app browsers de
 * campanha (ex: navegador embutido do Instagram/Facebook Ads) não o
 * respeitam — a página não encolhe quando o teclado abre, e o teclado
 * cobre o campo de digitação e o botão de enviar. `visualViewport` tem
 * suporte bem mais amplo (inclusive nesses in-app browsers), então usamos
 * ele pra empurrar o painel do chat pra cima manualmente enquanto o
 * teclado estiver aberto.
 *
 * IMPORTANTE: a base de comparação é `document.documentElement.clientWidth
 * /clientHeight`, nunca `window.innerWidth/innerHeight` — testado ao vivo
 * no navegador embutido do Instagram (print de diagnóstico, 2026-08-28) e
 * `window.innerWidth/innerHeight` reportava valores fora de escala (ex.:
 * innerWidth 469 vs a largura real de 375, medida por
 * `visualViewport.width` e `clientWidth`). Usar `window.innerHeight` ali
 * gerava um "teclado" de ~182px inventado, encolhendo o painel além do
 * necessário e cortando o campo de digitação/botão de enviar — pior do
 * que não ter a correção nenhuma. `clientHeight` já é, nesse mesmo
 * navegador, a fonte real usada por unidades de viewport/`position:fixed`,
 * então comparar contra ele é sempre consistente, e naturalmente cai pra
 * ~0 quando o navegador já encolhe a página sozinho.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    function atualizar() {
      const root = document.documentElement
      if (root.clientWidth >= MOBILE_BREAKPOINT_PX) {
        setInset(0)
        return
      }
      const proximoInset = root.clientHeight - viewport!.height - viewport!.offsetTop
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
