import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { useBackgroundVideo } from '#/hooks/use-background-video'

const AV1 = 'video/webm; codecs="av01.0.08M.08"'

// Dark full-bleed band: a portrait event film (muted until asked) beside copy.
export function EventFilm() {
  const ref = useBackgroundVideo()
  const [muted, setMuted] = useState(true)

  // Unmuting also starts the film for visitors whose motion setting paused it.
  function toggleSound() {
    const video = ref.current
    if (!video) return
    video.muted = !muted
    setMuted(!muted)
    if (video.paused) video.play().catch(() => {})
  }

  return (
    <section className="mt-24 bg-footer py-20 text-white">
      <div className="page-wrap grid items-center gap-12 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
        <div
          data-reveal
          className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-md bg-black"
        >
          <video
            ref={ref}
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="none"
            poster="/videos/event-film-poster.webp"
            aria-label="Highlights film from a celebration at Treasure Island"
            className="absolute inset-0 size-full object-cover"
          >
            <source src="/videos/event-film.webm" type={AV1} />
            <source src="/videos/event-film.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
          >
            {muted ? (
              <VolumeX size={18} aria-hidden />
            ) : (
              <Volume2 size={18} aria-hidden />
            )}
          </button>
        </div>

        <div data-reveal>
          <SectionKicker className="!text-white/75">Event Film</SectionKicker>
          <h2 className="display-title mt-2 text-3xl text-white md:text-5xl">
            A night on the <em style={{ color: 'var(--sunset)' }}>island</em>.
          </h2>
          <p className="mt-5 max-w-prose text-white/80 md:text-lg">
            From the first welcome drinks to fire dancers after dark — a look at
            one celebration at Treasure Island Ada Foah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn btn-primary no-underline">
              Plan your celebration
            </a>
            <a
              href="#venues"
              className="btn btn-ghost !border-white/70 !text-white no-underline"
            >
              See our spaces
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
