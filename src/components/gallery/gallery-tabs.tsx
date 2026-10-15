import { cn } from '#/lib/utils'

export type GalleryTab = 'all' | 'photos' | 'videos'

const TABS: Array<{ id: GalleryTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'photos', label: 'Photos' },
  { id: 'videos', label: 'Videos' },
]

// Segmented All / Photos / Videos switch with item counts.
export function GalleryTabs({
  value,
  counts,
  onChange,
}: {
  value: GalleryTab
  counts: Record<GalleryTab, number>
  onChange: (tab: GalleryTab) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter the gallery"
      className="inline-flex rounded-full border border-line bg-white/70 p-1 backdrop-blur"
    >
      {TABS.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`gallery-tab-${tab.id}`}
            aria-selected={active}
            aria-controls="gallery-panel"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors',
              active
                ? 'bg-lagoon-deep text-white'
                : 'text-sea-ink-soft hover:text-sea-ink',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'tabular-nums text-xs',
                active ? 'text-white/75' : 'text-sea-ink-soft/60',
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
