import { Link } from '@tanstack/react-router'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { FooterLinkColumn } from '#/components/layout/footer-link-column'
import type { FooterLink } from '#/components/layout/footer-link-column'
import { FooterNewsletter } from '#/components/layout/footer-newsletter'
import { FooterWordmark } from '#/components/layout/footer-wordmark'
import { CONTACT, SITE } from '#/constants/site'

const EXPLORE: ReadonlyArray<FooterLink> = [
  { label: 'Home', to: '/' },
  { label: 'Rooms & suites', to: '/rooms' },
  { label: 'Amenities', to: '/amenities' },
  { label: 'Restaurant', to: '/menu' },
  { label: 'About us', to: '/about' },
]

const EXPERIENCES: ReadonlyArray<FooterLink> = [
  {
    label: 'Restaurant & bar',
    to: '/amenities/$slug',
    params: { slug: 'restaurant' },
  },
  {
    label: 'Jacuzzi bath',
    to: '/amenities/$slug',
    params: { slug: 'jacuzzi' },
  },
  {
    label: 'Boat cruise',
    to: '/amenities/$slug',
    params: { slug: 'boat-cruise' },
  },
  { label: 'Events & meetings', to: '/events' },
]

// Full-bleed footer: newsletter band, link grid, legal bar, bleeding wordmark.
export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-footer text-white">
      <div className="page-wrap--wide pt-20">
        <FooterNewsletter />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-14 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr_auto]">
          <div className="col-span-2 lg:col-span-1">
            <p className="display-title text-2xl text-white">{SITE.name}</p>
            <p className="mt-3 text-sm text-white/70">
              Definition of luxury, hospitality and serendipity.
            </p>
          </div>

          <FooterLinkColumn title="Explore" links={EXPLORE} />
          <FooterLinkColumn title="Experiences" links={EXPERIENCES} />

          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-white">Contact us</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a
                  href={CONTACT.phoneHref}
                  className="text-white/70 no-underline hover:text-white"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle
                  size={15}
                  className="mt-0.5 shrink-0"
                  aria-hidden
                />
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 no-underline hover:text-white"
                >
                  WhatsApp {CONTACT.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all text-white/70 no-underline hover:text-white"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  {CONTACT.locality} - {CONTACT.region}, {CONTACT.country}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>Open {CONTACT.hours}</span>
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
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/70">
            Mobile Money: {CONTACT.mobileMoney}
          </p>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  )
}
