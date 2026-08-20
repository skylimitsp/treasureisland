/**
 * Runs GSAP inside a ref-scoped `gsap.context` that is reverted on unmount, so
 * route changes never leak ScrollTriggers. Setup runs client-side only.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { useEffect, useRef } from 'react'
import { gsap } from '#/lib/gsap'

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (self: T) => void,
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Added post-hydration (not at import) so it never causes an SSR mismatch;
    // gates the CSS that hides `[data-reveal]` until JS can animate them.
    document.documentElement.classList.add('gsap-ready')
    const ctx = gsap.context(() => setup(el), el)
    return () => ctx.revert()
  }, [])
  return ref
}
