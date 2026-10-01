import { Link } from '@tanstack/react-router'

import type { LinkProps } from '@tanstack/react-router'

import { bgImage } from '#/lib/media'

// Full-bleed fixed-background band with one centered line + optional CTA.
// `bg-fixed` is toggled on pointer-fine desktops by enableFixedBands().
export function FixedDivider({
  image,
  kicker,
  title,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaLabel2,
  ctaTo2,
  variant = 'ghost',
}: {
  image: string
  kicker?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaTo?: LinkProps['to']
  ctaLabel2?: string
  ctaTo2?: LinkProps['to']
  variant?: 'ghost' | 'warm'
}) {
  return (
    <section
      data-fixed-band
      className="relative my-24 flex last:mb-0 min-h-[60vh] items-center justify-center overflow-hidden bg-cover bg-center px-6 py-24 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(23,58,64,.42), rgba(23,58,64,.42)), ${bgImage(image)}`,
      }}
    >
      <div data-reveal className="max-w-2xl text-white">
        {kicker ? (
          <p
            className="island-kicker"
            style={{ color: 'rgba(255,255,255,.85)' }}
          >
            {kicker}
          </p>
        ) : null}
        <h2 className="display-title mt-3 text-4xl text-white md:text-5xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-md text-white/85">{subtitle}</p>
        ) : null}
        {(ctaLabel && ctaTo) || (ctaLabel2 && ctaTo2) ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ctaLabel && ctaTo ? (
              <Link
                to={ctaTo}
                className={`no-underline ${
                  variant === 'warm' ? 'btn btn-warm' : 'btn btn-primary'
                }`}
              >
                {ctaLabel}
              </Link>
            ) : null}
            {ctaLabel2 && ctaTo2 ? (
              <Link
                to={ctaTo2}
                className="btn btn-ghost !border-white/70 !text-white no-underline"
              >
                {ctaLabel2}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
