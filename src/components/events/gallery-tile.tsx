import { ResponsiveImage } from '#/components/shared/responsive-image'

// One framed gallery image; the wipe/scale is driven by the parent's useGsap.
export function GalleryTile({
  image,
  alt,
  featured = false,
}: {
  image: string
  alt: string
  featured?: boolean
}) {
  return (
    <figure
      className={`img-frame relative overflow-hidden rounded-md border border-line ${
        featured ? 'sm:row-span-2' : ''
      }`}
    >
      <ResponsiveImage
        data-gallery
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${featured ? 'aspect-[3/4] sm:h-full' : 'aspect-[4/3]'}`}
      />
    </figure>
  )
}
