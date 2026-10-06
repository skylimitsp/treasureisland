/**
 * Plays a muted background video only while it is on screen, and never when the
 * visitor prefers reduced motion (the poster stays up instead).
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { useEffect, useRef } from 'react'

export function useBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // React doesn't SSR the `muted` attribute, and autoplay requires it.
    video.muted = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.15 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return ref
}
