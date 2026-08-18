import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { toHaveNoViolations } from "jest-axe"
import { afterEach, expect } from "vitest"

import { MockIntersectionObserver } from "./src/test/intersection-observer-mock"

expect.extend(toHaveNoViolations)

// jsdom não implementa IntersectionObserver — usado pelo scroll-spy da nav
// (ver src/hooks/use-active-section.ts). O mock guarda as instâncias criadas
// em MockIntersectionObserver.instances para os testes simularem entries.
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

afterEach(() => {
  cleanup()
  MockIntersectionObserver.instances = []
})
