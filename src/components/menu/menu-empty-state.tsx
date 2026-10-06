import { Phone } from 'lucide-react'

import { CONTACT } from '#/constants/site'

// Shown until a real menu is published; points guests to the official phone line.
export function MenuEmptyState() {
  return (
    <div className="island-shell mx-auto max-w-xl rounded-md p-8 text-center md:p-10">
      <p className="display-title text-2xl text-sea-ink md:text-3xl">
        Our full menu is coming soon.
      </p>
      <p className="mt-3 text-sea-ink-soft">
        For today’s menu, call{' '}
        <a href={CONTACT.phoneHref} className="font-semibold underline">
          {CONTACT.phone}
        </a>
        .
      </p>
      <a
        href={CONTACT.phoneHref}
        className="btn btn-primary mt-6 inline-flex items-center gap-2 no-underline"
      >
        <Phone size={16} aria-hidden />
        Call the restaurant
      </a>
    </div>
  )
}
