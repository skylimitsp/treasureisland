import { MenuItemRow } from '#/components/menu/menu-item-row'
import type { MenuItem, MenuSection } from '#/types'

// One heading from the printed menu (Breakfast, Cocktails…) with its serving note and items.
export function MenuSectionBlock({
  section,
  items,
}: {
  section: MenuSection
  items: Array<MenuItem>
}) {
  const headingId = `${section.id}-title`
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="mb-12 scroll-mt-60 break-inside-avoid"
    >
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-sea-ink pb-1">
        <h2
          id={headingId}
          className="display-title text-3xl font-semibold text-sea-ink"
        >
          {section.title}
        </h2>
        {section.tagline && (
          <p className="text-right text-sm text-palm italic">
            {section.tagline}
          </p>
        )}
      </div>
      <ul className="mt-1">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}
