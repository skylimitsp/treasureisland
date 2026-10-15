import { BackgroundVideo } from '#/components/shared/background-video'
import { bgImage } from '#/lib/media'

// Full-bleed, text-free band playing the events hero's night aerial loop.
export function EventsVideoBand() {
  return (
    <div
      className="relative mt-24 min-h-[60vh] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: bgImage('/photos/infinity-lounge.webp') }}
      aria-hidden
    >
      <BackgroundVideo
        src="/videos/hero-aerial-night"
        mobileSrc="/videos/hero-aerial-night-720"
        className="absolute inset-0 size-full"
      />
    </div>
  )
}
