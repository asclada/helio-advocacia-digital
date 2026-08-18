"use client"

import { useEffect, useState } from "react"

export function useScrolled(thresholdPx: number) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > thresholdPx
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > thresholdPx)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [thresholdPx])

  return scrolled
}
