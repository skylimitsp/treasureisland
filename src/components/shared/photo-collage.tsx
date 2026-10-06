import { ResponsiveImage } from '#/components/shared/responsive-image'

// Bento layout: tall arched lead photo, two stacked frames.
export function PhotoCollage() {
  return (
    <div className="relative grid h-[30rem] grid-cols-[1.15fr_1fr] grid-rows-2 gap-4 md:h-[36rem]">
      <figure
        data-reveal
        className="img-frame img-arch row-span-2 overflow-hidden"
      >
        <ResponsiveImage
          sizes="(min-width: 768px) 25vw, 50vw"
          src="/photos/infinity-lounge.webp"
          alt="Rooftop terrace and suites at dusk"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <ResponsiveImage
          sizes="(min-width: 768px) 25vw, 50vw"
          src="/photos/palm-pool-aerial.webp"
          alt="The pool and water slide from above"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <ResponsiveImage
          sizes="(min-width: 768px) 25vw, 50vw"
          src="/photos/ocean-deck-dining.webp"
          alt="Group dining on the lagoon-side deck"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
    </div>
  )
}
