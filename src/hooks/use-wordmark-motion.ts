/**
 * Footer wordmark motion: letters rise on every entry, then roll on extra scrolls at the bottom.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { useEffect, useRef, useState } from 'react'

// Matches the CSS: each letter's rise and the gap before the next, the lagoon sweep's time per
// letter once the word is up, and one roll (which ends with its own 600ms fill).
const RISE_MS = 1100
const STAGGER_MS = 160
const SWEEP_MS = 320
const ROLL_MS = 1000 + 600
// How much scrolling past the bottom it takes to roll one letter.
const WHEEL_THRESHOLD = 120
const SWIPE_THRESHOLD = 60

export function useWordmarkMotion<T extends HTMLElement>(letters: number) {
  const ref = useRef<T>(null)
  const [reduced, setReduced] = useState(false)
  const [shown, setShown] = useState(false)
  const [rolling, setRolling] = useState<number | null>(null)
  const settled = useRef(false)
  const rollingRef = useRef<number | null>(null)
  const nextLetter = useRef(0)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Rise in on every entry; drop back out of sight on exit so the next visit replays it.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer)
        setShown(entry.isIntersecting)
        settled.current = false
        if (entry.isIntersecting)
          timer = setTimeout(
            () => (settled.current = true),
            RISE_MS + (letters - 1) * STAGGER_MS + letters * SWEEP_MS,
          )
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [letters])

  useEffect(() => {
    if (!shown || reduced) return
    const atBottom = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    // Ends on a timer, not animationend, which never comes while a tab is paused.
    let rollEnd: ReturnType<typeof setTimeout> | undefined
    const roll = () => {
      if (!settled.current || rollingRef.current !== null) return
      rollingRef.current = nextLetter.current
      setRolling(nextLetter.current)
      nextLetter.current = (nextLetter.current + 1) % letters
      rollEnd = setTimeout(() => {
        rollingRef.current = null
        setRolling(null)
      }, ROLL_MS + 50)
    }

    let wheelTotal = 0
    let wheelReset: ReturnType<typeof setTimeout> | undefined
    const onWheel = (event: WheelEvent) => {
      if (!atBottom() || event.deltaY <= 0) {
        wheelTotal = 0
        return
      }
      wheelTotal += event.deltaY
      clearTimeout(wheelReset)
      wheelReset = setTimeout(() => (wheelTotal = 0), 200)
      if (wheelTotal > WHEEL_THRESHOLD) {
        wheelTotal = 0
        roll()
      }
    }

    let touchY: number | null = null
    const onTouchStart = (event: TouchEvent) =>
      (touchY = event.touches[0].clientY)
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0].clientY
      if (touchY === null || !atBottom()) return
      if (touchY - y > SWIPE_THRESHOLD) {
        touchY = y
        roll()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      clearTimeout(wheelReset)
      clearTimeout(rollEnd)
      rollingRef.current = null
      setRolling(null)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [shown, reduced, letters])

  return { ref, shown: shown || reduced, rolling }
}
