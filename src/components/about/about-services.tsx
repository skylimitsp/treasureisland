import { Link } from '@tanstack/react-router'
import { Mail, Phone } from 'lucide-react'

import { SectionKicker } from '#/components/shared/section-kicker'
import { CONTACT } from '#/constants/site'

// "Our Services" (official home-page copy) with the 24/7 welcome and contacts.
export function AboutServices({ services }: { services: string }) {
  return (
    <section className="page-wrap mt-28" aria-labelledby="our-services-title">
      <div
        data-reveal
        className="island-shell rounded-md px-6 py-10 text-center md:px-16"
      >
        <SectionKicker className="justify-center">
          The best destination resort · Hidden treasure
        </SectionKicker>
        <h2
          id="our-services-title"
          className="display-title mt-3 text-3xl md:text-4xl"
        >
          Our Services
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-sea-ink-soft">{services}</p>
        <p className="mx-auto mt-4 max-w-3xl text-sea-ink">
          Visit us any day, Monday through Sunday, 24/7, to experience our
          various types of services and amenities. A warm welcome awaits you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={CONTACT.phoneHref} className="btn btn-primary no-underline">
            <Phone size={16} aria-hidden /> {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="btn btn-ghost no-underline"
          >
            <Mail size={16} aria-hidden /> Email reservations
          </a>
          <Link to="/amenities" className="btn btn-ghost no-underline">
            See amenities
          </Link>
        </div>
      </div>
    </section>
  )
}
