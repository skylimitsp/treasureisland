import { SectionKicker } from '#/components/shared/section-kicker'
import { GalleryTile } from '#/components/events/gallery-tile'
import { useGsap } from '#/hooks/use-gsap'
import { gsap, ScrollTrigger } from '#/lib/gsap'

// Curated grid of past celebrations with a clip-path image-reveal per tile.
const TILES = [
  {
    image: '/wedding.webp',
    alt: 'A beachfront wedding ceremony',
    featured: true,
  },
  {
    image: '/weddding.webp',
    alt: 'A styled reception table setting',
  },
  { image: '/events/poolside.jpg', alt: 'A poolside birthday celebration' },
  {
    image: '/wedding_-1024x768.webp',
    alt: 'An evening reception in the dining hall',
    featured: true,
  },
  { image: '/events/family.jpg', alt: 'A family gathering by the sea' },
  { image: '/events/terrace.jpg', alt: 'Cocktails on the ocean terrace' },
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
        <SectionKicker>Past celebrations</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Moments we have <em>hosted</em>.
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
