/**
 * Reusable scroll/motion patterns (see docs/animation-guide.md). Each takes a
 * scope root and is meant to run inside a `useGsap` context. All respect
 * `prefers-reduced-motion`.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { gsap, ScrollTrigger } from '#/lib/gsap'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// reveal-stagger: `[data-reveal]` elements rise + fade in, batched on scroll.
// Elements already in (or above) the viewport are shown at once — only those
// below the fold are pre-hidden, so nothing can get stuck invisible.
export function revealStagger(root: HTMLElement) {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
  if (!els.length) return
  if (prefersReduced()) {
    gsap.set(els, { opacity: 1, y: 0 })
    return
  }
  const vh = window.innerHeight
  const below = els.filter((el) => el.getBoundingClientRect().top > vh * 0.9)
  const shown = els.filter((el) => !below.includes(el))
  gsap.set(shown, { opacity: 1, y: 0 })
  if (!below.length) return
  gsap.set(below, { opacity: 0, y: 28 })
  ScrollTrigger.batch(below, {
    start: 'top 90%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      }),
  })
}

// parallax-layer: `[data-speed]` elements drift as they scroll through view.
export function parallaxLayers(root: HTMLElement) {
  if (prefersReduced()) return
  gsap.utils.toArray<HTMLElement>('[data-speed]', root).forEach((el) => {
    const speed = Number(el.dataset.speed) || 1
    gsap.to(el, {
      yPercent: (speed - 1) * 18,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
}

// count-up: `[data-count]` animates 0 → value on enter (once).
export function countUp(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-count]', root).forEach((el) => {
    const target = Number(el.dataset.count) || 0
    const suffix = el.dataset.countSuffix ?? ''
    const decimals = Number(el.dataset.countDecimals ?? 0)
    const render = (v: number) =>
      (el.textContent = v.toFixed(decimals) + suffix)
    if (prefersReduced()) {
      render(target)
      return
    }
    const obj = { v: 0 }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => render(obj.v),
        }),
    })
  })
}

// header-shrink: toggles `is-scrolled` on an element once the page scrolls.
export function headerShrink(header: HTMLElement, after = 60) {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) =>
      header.classList.toggle('is-scrolled', self.scroll() > after),
  })
}

// Applies a fixed-attachment class only on pointer-fine desktops (see guide §4).
export function enableFixedBands(root: HTMLElement) {
  gsap.matchMedia().add('(min-width: 1024px) and (pointer: fine)', () => {
    root
      .querySelectorAll<HTMLElement>('[data-fixed-band]')
      .forEach((el) => el.classList.add('bg-fixed'))
  })
}
