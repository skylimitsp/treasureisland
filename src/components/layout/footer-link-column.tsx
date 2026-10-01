import { Link } from '@tanstack/react-router'

import type { LinkProps } from '@tanstack/react-router'

export type FooterLink = {
  label: string
  to: LinkProps['to']
  params?: Record<string, string>
}

// One titled column of footer navigation links.
export function FooterLinkColumn({
  title,
  links,
}: {
  title: string
  links: ReadonlyArray<FooterLink>
}) {
  return (
    <nav aria-label={title}>
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              params={l.params as never}
              className="text-sm text-white/70 no-underline hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
