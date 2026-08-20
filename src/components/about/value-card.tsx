import { Leaf, Palmtree, Users } from 'lucide-react'

import type { AboutValue } from '#/types/about'

const ICONS = { leaf: Leaf, users: Users, palm: Palmtree }

// One resort-value card (icon, title, one-line body).
export function ValueCard({ value }: { value: AboutValue }) {
  const Icon = ICONS[value.icon]
  return (
    <div data-reveal className="feature-card rounded-md border border-line p-6">
      <span className="flex size-11 items-center justify-center rounded-full bg-lagoon-deep/10 text-lagoon-deep">
        <Icon size={20} strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className="display-title mt-4 text-xl">{value.title}</h3>
      <p className="mt-2 text-sm text-sea-ink-soft">{value.body}</p>
    </div>
  )
}
