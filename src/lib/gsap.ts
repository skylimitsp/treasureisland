/**
 * SSR-safe GSAP singleton. Registers ScrollTrigger once on the client only —
 * GSAP touches `window`, which is absent in the Workers SSR runtime.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
