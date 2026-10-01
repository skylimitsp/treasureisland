/**
 * Prev/next paging for a native scroll-snap track; tracks which ends are reached.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export function useCarousel<T extends HTMLElement>(itemCount: number) {
  const trackRef = useRef<T>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update, itemCount])

  // Page by one card (its width + the flex gap) so snapping stays aligned.
  const go = useCallback((dir: 1 | -1) => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    el.scrollBy({
      left: dir * (first.offsetWidth + gap),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [])

  return { trackRef, canPrev, canNext, prev: () => go(-1), next: () => go(1) }
}
