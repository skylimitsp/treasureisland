import type { ComponentProps } from 'react'

import { IMAGE_MANIFEST } from '#/lib/image-manifest'

const DEFAULT_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

// <img> that serves AVIF → WebP and an 800w variant when /public has them;
// `sizes` tells the browser how wide the image renders so it picks the smallest.
export function ResponsiveImage({
  src,
  sizes = DEFAULT_SIZES,
  ...img
}: ComponentProps<'img'> & { src: string }) {
  const meta = IMAGE_MANIFEST[src]
  if (!meta) return <img src={src} {...img} />

  const base = src.replace(/\.webp$/, '')
  const set = (ext: string) =>
    [meta.sm ? `${base}-800.${ext} 800w` : null, `${base}.${ext} ${meta.w}w`]
      .filter(Boolean)
      .join(', ')

  return (
    <picture className="contents">
      {meta.avif ? (
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      ) : null}
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={src} width={meta.w} height={meta.h} {...img} />
    </picture>
  )
}
