import { Check } from 'lucide-react'

// Checklist of what a package tier includes.
export function InclusionList({ items }: { items: Array<string> }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-sea-ink">
          <Check
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-palm"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
