// Overlapping photo cluster with slight rotation + parallax drift.
const TILES = [
  {
    src: '/amenities/collage-ocean.webp',
    alt: 'Ocean deck at the resort',
    className: 'col-span-2 -rotate-2',
    speed: 1.1,
  },
  {
    src: '/amenities/collage-pool.webp',
    alt: 'Infinity pool',
    className: 'mt-6 rotate-2',
    speed: 0.9,
  },
  {
    src: '/amenities/collage-dinner.webp',
    alt: 'Beachfront dining',
    className: '-mt-4 rotate-1',
    speed: 1.05,
  },
]

export function PhotoCollage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {TILES.map((tile) => (
        <figure
          key={tile.src}
          data-speed={tile.speed}
          className={`img-frame img-arch aspect-[3/4] ${tile.className}`}
        >
          <img
            src={tile.src}
            alt={tile.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </figure>
      ))}
    </div>
  )
}
