import { ArrowRight } from 'lucide-react'

import { BackgroundVideo } from '#/components/shared/background-video'
import { ResponsiveImage } from '#/components/shared/responsive-image'

// Tall photo card fading into deep sea ink: tag, kicker, title, copy, CTA.
// Wrap it in a `group` link to get the hover zoom and arrow nudge.
export function OverlayCard({
  image,
  video,
  tag,
  kicker,
  title,
  body,
  cta,
}: {
  image: string
  video?: string
  tag: string
  kicker: string
  title: string
  body: string
  cta?: string
}) {
  return (
    <div className="relative flex aspect-[13/20] flex-col justify-end overflow-hidden rounded-md bg-footer text-white sm:aspect-[3/4] md:aspect-[13/20]">
      {video ? (
        <BackgroundVideo
          src={video}
          className="absolute inset-0 h-[78%] w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <ResponsiveImage
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[78%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 28%, color-mix(in oklab, var(--footer-bg) 70%, transparent) 52%, var(--footer-bg) 74%)',
        }}
        aria-hidden
      />

      <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-footer">
        {tag}
      </span>

      <div className="relative p-6">
        <p className="island-kicker !text-white/75">{kicker}</p>
        <h3 className="display-title mt-2 text-2xl text-white">{title}</h3>
        <p className="mt-3 text-sm text-white/80">{body}</p>
        {cta ? (
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
            {cta}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        ) : null}
      </div>
    </div>
  )
}
