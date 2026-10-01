/**
 * CSS background helpers for the optimized photo set (AVIF + WebP pairs).
 * @author Joseph Nartey
 * @github devjoemedia
 */

// Every /photos and /rooms WebP ships with an AVIF twin; others fall back to url().
const HAS_AVIF = /^\/(photos|rooms)\/.+\.webp$/

export function bgImage(src: string): string {
  if (!HAS_AVIF.test(src)) return `url('${src}')`
  const avif = src.replace(/\.webp$/, '.avif')
  return `image-set(url('${avif}') type('image/avif'), url('${src}') type('image/webp'))`
}
