"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Página de diagnóstico temporária — NÃO faz parte do produto. Existe só
 * pra ler, ao vivo, o que o navegador embutido do Facebook Ads realmente
 * reporta sobre teclado virtual/viewport (window.innerHeight,
 * visualViewport), já que isso não é simulável fora de um celular de
 * verdade. Pode ser apagada depois de diagnosticar o bug do chat mobile.
 */
export default function DebugViewportPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [log, setLog] = useState<string[]>([])
  const [dados, setDados] = useState<Record<string, string>>({})
  const [caixa, setCaixa] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [campoFocado, setCampoFocado] = useState(false)

  useEffect(() => {
    function ler() {
      const vv = window.visualViewport
      const novo: Record<string, string> = {
        "window.innerWidth": String(window.innerWidth),
        "window.innerHeight": String(window.innerHeight),
        "document.documentElement.clientWidth": String(document.documentElement.clientWidth),
        "document.documentElement.clientHeight": String(document.documentElement.clientHeight),
        "window.visualViewport existe?": vv ? "SIM" : "NÃO",
      }
      if (vv) {
        novo["visualViewport.height"] = String(vv.height)
        novo["visualViewport.width"] = String(vv.width)
        novo["visualViewport.offsetTop"] = String(vv.offsetTop)
        novo["visualViewport.offsetLeft"] = String(vv.offsetLeft)
        novo["visualViewport.scale"] = String(vv.scale)
        setCaixa({ top: vv.offsetTop, left: vv.offsetLeft, width: vv.width, height: vv.height })
      }
      novo["document.activeElement"] = document.activeElement?.tagName ?? "?"
      novo["timestamp"] = new Date().toLocaleTimeString("pt-BR")
      setDados(novo)
    }

    ler()
    const onResizeWindow = () => {
      setLog((l) => [`window resize @ ${new Date().toLocaleTimeString("pt-BR")}`, ...l].slice(0, 20))
      ler()
    }
    window.addEventListener("resize", onResizeWindow)

    const vv = window.visualViewport
    const onResizeVV = () => {
      setLog((l) => [`visualViewport resize @ ${new Date().toLocaleTimeString("pt-BR")}`, ...l].slice(0, 20))
      ler()
    }
    const onScrollVV = () => {
      setLog((l) => [`visualViewport scroll @ ${new Date().toLocaleTimeString("pt-BR")}`, ...l].slice(0, 20))
      ler()
    }
    vv?.addEventListener("resize", onResizeVV)
    vv?.addEventListener("scroll", onScrollVV)

    const interval = setInterval(ler, 1000)

    return () => {
      window.removeEventListener("resize", onResizeWindow)
      vv?.removeEventListener("resize", onResizeVV)
      vv?.removeEventListener("scroll", onScrollVV)
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={{ padding: 16, fontFamily: "monospace", fontSize: 13, background: "#111", color: "#0f0", minHeight: "100dvh" }}>
      <h1 style={{ fontSize: 16, marginBottom: 12 }}>Diagnóstico de viewport / teclado</h1>
      <p style={{ marginBottom: 12, color: "#fff" }}>
        Toque no campo abaixo pra abrir o teclado, e veja os números mudando (ou não) em tempo real.
      </p>
      <input
        ref={inputRef}
        type="text"
        placeholder="Toque aqui pra abrir o teclado"
        style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 16, boxSizing: "border-box" }}
      />
      {caixa && (
        <div
          style={{
            position: "fixed",
            top: caixa.top,
            left: caixa.left,
            width: caixa.width,
            height: caixa.height,
            border: "4px solid red",
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              pointerEvents: "auto",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Campo DENTRO da caixa vermelha (fixada no visualViewport)"
              style={{ flex: 1, padding: 10, fontSize: 16, boxSizing: "border-box", background: "yellow", color: "#000" }}
            />
          </div>
          <div style={{ position: "absolute", top: 4, left: 4, color: "red", background: "#fff", padding: "2px 6px", fontSize: 11 }}>
            caixa vermelha = visualViewport (deve ficar sempre acima do teclado)
          </div>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <tbody>
          {Object.entries(dados).map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: "4px 8px", borderBottom: "1px solid #333", color: "#8f8" }}>{k}</td>
              <td style={{ padding: "4px 8px", borderBottom: "1px solid #333" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ fontSize: 14, marginBottom: 8 }}>Eventos capturados (mais recente primeiro):</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 24 }}>
        {log.length === 0 && <li style={{ color: "#666" }}>(nenhum evento ainda)</li>}
        {log.map((l, i) => (
          <li key={i} style={{ padding: "2px 0", borderBottom: "1px solid #222" }}>
            {l}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 14, marginBottom: 8, color: "#fff" }}>
        Teste 3: campo NORMAL (sem position:fixed), lá embaixo da página
      </h2>
      <p style={{ marginBottom: 12, color: "#fff" }}>
        Role a página até o campo azul no final e toque nele. Se o navegador
        rolar sozinho pra mostrar o campo acima do teclado, o comportamento
        nativo funciona pra elementos normais (não fixos) — aí a correção é
        tirar o chat de position:fixed enquanto o teclado estiver aberto.
      </p>
      <div style={{ height: "80vh", border: "1px dashed #444", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
        (espaço vazio de propósito — role a página)
      </div>
      <input
        type="text"
        placeholder="Campo NORMAL no fim da página (sem fixed)"
        style={{ width: "100%", padding: 10, fontSize: 16, boxSizing: "border-box", background: "#00f", color: "#fff", marginBottom: 40 }}
      />

      <h2 style={{ fontSize: 14, marginBottom: 8, color: "#fff" }}>
        Teste 4: painel fixo (igual o chat) que move o campo pro TOPO quando foca
      </h2>
      <p style={{ marginBottom: 12, color: "#fff" }}>
        Toque no campo laranja dentro da caixa roxa abaixo. Sem medir nada do
        teclado, ele deve pular pro topo da caixa (perto do cabeçalho) assim
        que ganha foco — então deve continuar visível mesmo com o teclado
        aberto.
      </p>
      <div
        style={{
          position: "fixed",
          top: 60,
          left: 12,
          right: 12,
          bottom: 12,
          border: "4px solid purple",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          zIndex: 9998,
        }}
      >
        <div style={{ padding: 8, borderBottom: "1px solid purple", color: "purple", fontWeight: "bold", order: 0 }}>
          cabeçalho (fixo)
        </div>
        <div style={{ flex: 1, overflowY: "auto", color: "#0f0", padding: 8, order: 2 }}>
          (área de mensagens — encolhe quando o campo está focado)
        </div>
        <input
          onFocus={() => setCampoFocado(true)}
          onBlur={() => setCampoFocado(false)}
          type="text"
          placeholder="Campo LARANJA (toque aqui)"
          style={{
            padding: 10,
            fontSize: 16,
            boxSizing: "border-box",
            background: "orange",
            color: "#000",
            margin: 8,
            order: campoFocado ? 1 : 3,
          }}
        />
      </div>
    </div>
  )
}
