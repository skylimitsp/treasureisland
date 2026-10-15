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
          src="/photos/luxury-first-dance.webp"
          alt="A couple’s first dance beneath a chandelier canopy"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <ResponsiveImage
          sizes="(min-width: 768px) 25vw, 50vw"
          src="/photos/luxury-cake-cutting.webp"
          alt="A wedding party gathered for the cake cutting"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <figure data-reveal className="img-frame overflow-hidden">
        <ResponsiveImage
          sizes="(min-width: 768px) 25vw, 50vw"
          src="/photos/luxury-pool-loungers.webp"
          alt="Guests relaxing on in-pool loungers"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
    </div>
  )
}
