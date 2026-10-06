import { formatPrice } from '#/lib/format'
import type { MenuItem } from '#/types'

// A printed-menu line: dish name over what's in it, price on the right.
export function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex items-baseline gap-4 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-[1.05rem] leading-snug font-semibold text-sea-ink">
          {item.name}
        </p>
        <p className="text-sm leading-snug text-sea-ink-soft">
          {item.description}
        </p>
      </div>
      <p className="shrink-0 text-[1.05rem] font-semibold text-sea-ink tabular-nums">
        {formatPrice(item.price)}
      </p>
    </li>
  )
}
