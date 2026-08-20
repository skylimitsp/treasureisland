import { Link } from '@tanstack/react-router'
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react'

import { Newsletter } from '#/components/shared/newsletter'

const LINKS = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
] as const

// Colour-blocked footer card with contact, links, socials, and newsletter.
export function SiteFooter() {
  return (
    <footer className="page-wrap--wide mb-8 mt-28">
      <div
        data-reveal
        className="grid gap-10 rounded-md p-8 text-white md:grid-cols-[1.2fr_0.8fr_1.2fr] md:p-12"
        style={{
          background:
            'linear-gradient(165deg, var(--lagoon-deep), var(--sea-ink))',
        }}
      >
        <div>
          <p className="display-title text-2xl">Treasure Island</p>
          <p className="mt-3 max-w-xs text-sm text-white/80">
            An intimate luxury beach resort on a private island — barefoot
            luxury, crafted for every stay.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <MapPin size={15} aria-hidden /> Treasure Island, Indian Ocean
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} aria-hidden /> +1 (555) 012-3456
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} aria-hidden /> stay@treasureisland.example
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white no-underline"
            >
              <Instagram size={18} aria-hidden />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white no-underline"
            >
              <Facebook size={18} aria-hidden />
            </a>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="island-kicker !text-white/70">Explore</p>
          <ul className="mt-3 space-y-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-white/85 no-underline hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <Newsletter source="footer" variant="footer" />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-sea-ink-soft">
        © 2026 Treasure Island. All rights reserved.
      </p>
    </footer>
  )
}
