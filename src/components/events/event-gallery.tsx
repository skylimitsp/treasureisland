import { SectionKicker } from '#/components/shared/section-kicker'
import { GalleryTile } from '#/components/events/gallery-tile'
import { useGsap } from '#/hooks/use-gsap'
import { gsap, ScrollTrigger } from '#/lib/gsap'

// Curated photo grid with a clip-path image-reveal per tile.
const TILES = [
  {
    image: '/events/wedding-carriage.webp',
    alt: 'Newlyweds in a horse-drawn carriage',
    featured: true,
  },
  {
    image: '/events/wedding-ceremony.webp',
    alt: 'A couple at their wedding ceremony',
  },
  {
    image: '/photos/pool-loungers.webp',
    alt: 'The pool and loungers from above',
  },
  {
    image: '/events/wedding-carriage-wide.webp',
    alt: 'A carriage arrival on the wedding day',
    featured: true,
  },
  {
    image: '/photos/beach-hero.webp',
    alt: 'The resort, pool and beach from above',
  },
  {
    image: '/photos/lantern-terrace.webp',
    alt: 'The lantern-lit garden terrace',
  },
]

export function EventGallery() {
  const ref = useGsap<HTMLElement>((self) => {
    const tiles = gsap.utils.toArray<HTMLElement>('[data-gallery]', self)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    tiles.forEach((tile) => {
      gsap.fromTo(
        tile,
        { clipPath: 'inset(0 100% 0 0)', scale: 1.08 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: tile, start: 'top 80%' },
        },
      )
    })
    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    })
  })

  return (
    <section ref={ref} className="page-wrap--wide mt-24">
      <div className="max-w-2xl">
        <SectionKicker>Gallery</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Treasure Island <em>Ada</em>.
        </h2>
      </div>
      <div className="mt-10 grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => (
          <GalleryTile
            key={tile.image}
            image={tile.image}
            alt={tile.alt}
            featured={tile.featured}
          />
        ))}
      </div>
    </section>
  )
}
