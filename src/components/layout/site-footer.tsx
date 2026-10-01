import { Link } from '@tanstack/react-router'
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'

import { FooterLinkColumn } from '#/components/layout/footer-link-column'
import type { FooterLink } from '#/components/layout/footer-link-column'
import { FooterNewsletter } from '#/components/layout/footer-newsletter'
import { FooterWordmark } from '#/components/layout/footer-wordmark'

const EXPLORE: ReadonlyArray<FooterLink> = [
  { label: 'Home', to: '/' },
  { label: 'Rooms & villas', to: '/rooms' },
  { label: 'Amenities', to: '/amenities' },
  { label: 'About us', to: '/about' },
]

const EXPERIENCES: ReadonlyArray<FooterLink> = [
  {
    label: 'Ocean-view dining',
    to: '/amenities/$slug',
    params: { slug: 'restaurant' },
  },
  {
    label: 'Jacuzzi & spa',
    to: '/amenities/$slug',
    params: { slug: 'jacuzzi' },
  },
  {
    label: 'Boat cruise',
    to: '/amenities/$slug',
    params: { slug: 'boat-cruise' },
  },
  { label: 'Weddings & events', to: '/events' },
]

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter (X)', href: 'https://x.com', icon: Twitter },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
] as const

// Full-bleed footer: newsletter band, link grid, legal bar, bleeding wordmark.
export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-footer text-white">
      <div className="page-wrap--wide pt-20">
        <FooterNewsletter />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-14 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr_auto]">
          <div className="col-span-2 lg:col-span-1">
            <p className="display-title text-2xl text-white">Treasure Island</p>
            <p className="mt-3 text-sm text-white/70">Stay. Dine. Unwind.</p>
          </div>

          <FooterLinkColumn title="Explore" links={EXPLORE} />
          <FooterLinkColumn title="Experiences" links={EXPERIENCES} />

          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-white">Contact us</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a
                  href="tel:+15550123456"
                  className="text-white/70 no-underline hover:text-white"
                >
                  +1 (555) 012-3456
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>Treasure Island, Indian Ocean</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a
                  href="mailto:stay@treasureisland.example"
                  className="text-white/70 no-underline hover:text-white"
                >
                  stay@treasureisland.example
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <Link to="/rooms" className="btn btn-primary no-underline">
              Book your stay
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/70">
            © 2026 Treasure Island. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-white/70 no-underline hover:text-white"
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  )
}
