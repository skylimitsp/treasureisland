import { BackgroundVideo } from '#/components/shared/background-video'
import { ResponsiveImage } from '#/components/shared/responsive-image'
import { cn } from '#/lib/utils'

// One framed gallery image or muted video loop; the wipe/scale is driven by
// the parent's useGsap through [data-gallery].
export function GalleryTile({
  image,
  video,
  alt,
  featured = false,
}: {
  image: string
  video?: string
  alt: string
  featured?: boolean
}) {
  const shape = featured ? 'aspect-[3/4] sm:h-full' : 'aspect-[4/3]'

  return (
    <figure
      className={cn(
        'img-frame relative overflow-hidden rounded-md border border-line',
        featured && 'sm:row-span-2',
      )}
    >
      {video ? (
        <div
          data-gallery
          role="img"
          aria-label={alt}
          className={cn('relative w-full bg-footer', shape)}
        >
          <BackgroundVideo src={video} className="absolute inset-0 size-full" />
        </div>
      ) : (
        <ResponsiveImage
          data-gallery
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn('h-full w-full object-cover', shape)}
        />
      )}
    </figure>
  )
}
