import { useRef, useState } from 'react'

import { BackgroundVideo } from '#/components/shared/background-video'
import { SectionKicker } from '#/components/shared/section-kicker'
import { cn } from '#/lib/utils'

// Start/end seconds of each clip inside /videos/activities-reel (one stitched,
// seamlessly looping file), so the list can follow what is on screen.
const CLIPS = [
  {
    name: 'Pool & mermaid swim',
    body: 'Fins on and laps across the resort pool.',
    start: 0,
    end: 10.4,
  },
  {
    name: 'Padel under the lights',
    body: 'Floodlit games on the court once the sun goes down.',
    start: 10.4,
    end: 20.1,
  },
  {
    name: 'Padel at golden hour',
    body: 'Rally on the blue court as the evening cools.',
    start: 20.1,
    end: 31.3,
  },
  {
    name: 'Fishing trips',
    body: 'Head out by boat and bring back the catch of the day.',
    start: 31.3,
    end: 39.5,
  },
]

// Activities band: copy and a synced clip list beside a portrait video reel.
export function ActivitiesReel({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const active = Math.max(
    0,
    CLIPS.findIndex((clip) => time >= clip.start && time < clip.end),
  )

  // Jump the reel to the start of a clip.
  function seek(start: number) {
    const video = frame.current?.querySelector('video')
    if (!video) return
    video.currentTime = start + 0.05
    setTime(start)
  }

  return (
    <section
      className={cn(
        'page-wrap grid items-center gap-10 md:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16',
        className,
      )}
    >
      <div data-reveal>
        <SectionKicker>Activities</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Play all <em>day</em>.
        </h2>
        <p className="mt-4 max-w-prose text-sea-ink-soft">
          From the pool to the padel court, there’s always something on at
          Treasure Island — for guests, families and event parties alike.
        </p>

        <ol className="mt-8 grid gap-2">
          {CLIPS.map((clip, i) => {
            const isActive = i === active
            const progress = isActive
              ? Math.min(1, (time - clip.start) / (clip.end - clip.start))
              : 0
            return (
              <li key={clip.name}>
                <button
                  type="button"
                  onClick={() => seek(clip.start)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex min-h-11 w-full items-start gap-4 overflow-hidden rounded-md border p-4 text-left transition-colors',
                    isActive
                      ? 'border-lagoon-deep/40 bg-foam'
                      : 'border-line hover:border-lagoon-deep/30',
                  )}
                >
                  <span
                    className={cn(
                      'display-title text-xl tabular-nums',
                      isActive ? 'text-lagoon-deep' : 'text-sea-ink-soft/60',
                    )}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-semibold text-sea-ink">
                      {clip.name}
                    </span>
                    <span className="mt-1 block text-sm text-sea-ink-soft">
                      {clip.body}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 bg-lagoon-deep',
                      isActive && 'transition-[width] duration-300 ease-linear',
                    )}
                    style={{ width: `${progress * 100}%` }}
                    aria-hidden
                  />
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div
        ref={frame}
        data-reveal
        className="relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-md bg-footer"
      >
        <BackgroundVideo
          src="/videos/activities-reel"
          onTimeUpdate={setTime}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              'linear-gradient(to top, color-mix(in oklab, var(--footer-bg) 85%, transparent), transparent)',
          }}
          aria-hidden
        />
        <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-footer">
          Ada Foah
        </span>
        <p
          className="absolute inset-x-0 bottom-0 p-5 text-white"
          aria-live="off"
        >
          <span className="island-kicker block !text-white/75">
            Now playing
          </span>
          <span className="display-title mt-1 block text-xl text-white">
            {CLIPS[active].name}
          </span>
        </p>
      </div>
    </section>
  )
}
