import { CONTACT } from '#/constants/site'

// The printed menu's sign-off: a rule broken by the logo, with the location and opening hours either side.
export function MenuFooterMark() {
  return (
    <div className="page-wrap pt-6">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="h-0.5 flex-1 bg-sea-ink" />
        <img
          src="/media/logo.webp"
          alt="Treasure Island"
          width={320}
          height={243}
          loading="lazy"
          decoding="async"
          className="h-16 w-auto dark:brightness-0 dark:invert sm:h-20"
        />
        <span aria-hidden="true" className="h-0.5 flex-1 bg-sea-ink" />
      </div>
      <div className="mt-3 flex justify-between gap-4 text-xs text-sea-ink-soft sm:text-sm">
        <span>
          {CONTACT.locality}, {CONTACT.region}, {CONTACT.country}
        </span>
        <span className="text-right">Open {CONTACT.hours}</span>
      </div>
    </div>
  )
}
