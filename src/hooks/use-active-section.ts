"use client"

import { useEffect, useState } from "react"

interface UseActiveSectionOptions {
  rootMargin?: string
}

export function useActiveSection(
  sectionIds: string[],
  options?: UseActiveSectionOptions
) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const rootMargin = options?.rootMargin

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting)
        if (intersecting) {
          setActiveId(intersecting.target.id)
        }
      },
      { rootMargin, threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds, rootMargin])

  return activeId
}
