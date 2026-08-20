import type { GalleryImage } from '#/types/about'

// Masonry-ish gallery of resort life; images lazy-load and lift on hover.
export function AboutGallery({ images }: { images: Array<GalleryImage> }) {
  return (
    <section className="page-wrap--wide mt-28">
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <figure
            key={img.src}
            data-reveal
            className={`img-frame group block break-inside-avoid ${
              i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
