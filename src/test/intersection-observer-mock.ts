type MockEntry = { target: Element; isIntersecting: boolean }

export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly root: Element | Document | null = null
  readonly rootMargin: string
  readonly thresholds: ReadonlyArray<number> = []
  observed: Element[] = []

  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.rootMargin = options?.rootMargin ?? ""
    MockIntersectionObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve(target: Element) {
    this.observed = this.observed.filter((el) => el !== target)
  }

  disconnect() {
    this.observed = []
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(entries: MockEntry[]) {
    const fullEntries = entries.map(
      (entry) =>
        ({
          target: entry.target,
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.isIntersecting ? 1 : 0,
        }) as IntersectionObserverEntry
    )
    this.callback(fullEntries, this)
  }
}

export function getLastIntersectionObserver(): MockIntersectionObserver {
  const instance = MockIntersectionObserver.instances.at(-1)
  if (!instance) {
    throw new Error(
      "Nenhum IntersectionObserver foi instanciado ainda — renderize o componente antes de chamar getLastIntersectionObserver()."
    )
  }
  return instance
}
