import { useState } from 'react'
import { Minus, Plus, SlidersHorizontal, X } from 'lucide-react'

import type { RoomCategory, RoomView } from '#/types'
import type { RoomFilters } from '#/lib/rooms-filter'
import {
  PRICE_BANDS,
  ROOM_CATEGORY_LABELS,
  ROOM_VIEWS,
  hasActiveFilters,
  priceBandValue,
} from '#/lib/rooms-filter'

const CATEGORIES: Array<{ value: RoomCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'double', label: ROOM_CATEGORY_LABELS.double },
  { value: 'family', label: ROOM_CATEGORY_LABELS.family },
  { value: 'deluxe', label: ROOM_CATEGORY_LABELS.deluxe },
]

// Count of active refinements (drives the mobile "Filters" badge).
function activeCount(v: RoomFilters): number {
  return [
    v.guests,
    v.view,
    v.priceMin || v.priceMax,
    v.sort && v.sort !== 'rec',
  ].filter(Boolean).length
}

// URL-driven filter bar; parent owns the state via value/onChange.
export function RoomFiltersBar({
  value,
  count,
  onChange,
  onClear,
}: {
  value: RoomFilters
  count: number
  onChange: (next: Partial<RoomFilters>) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  const category = value.category ?? 'all'
  const guests = value.guests ?? 0
  const active = activeCount(value)

  const setBand = (band: string) => {
    const b = PRICE_BANDS.find((x) => x.value === band)
    onChange({ priceMin: b?.min, priceMax: b?.max })
  }

  return (
    <div className="island-shell sticky top-20 z-20 mt-8 rounded-md p-3 md:p-4">
      <div className="flex items-center gap-3">
        {/* Category segmented tabs (scroll horizontally on small screens). */}
        <div
          className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-0.5"
          role="tablist"
          aria-label="Room type"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={category === cat.value}
              onClick={() => onChange({ category: cat.value })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === cat.value
                  ? 'bg-lagoon-deep text-white'
                  : 'border border-line text-sea-ink-soft hover:text-sea-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile: toggle the refinements panel. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold text-sea-ink md:hidden"
        >
          <SlidersHorizontal size={15} aria-hidden /> Filters
          {active ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-lagoon-deep text-xs text-white">
              {active}
            </span>
          ) : null}
        </button>
      </div>

      {/* Refinements — stacked drawer on mobile, inline row on desktop. */}
      <div
        className={`${open ? 'flex' : 'hidden'} mt-3 flex-col gap-3 border-t border-line pt-3 md:mt-3 md:flex md:flex-row md:flex-wrap md:items-center md:gap-3`}
      >
        <div className="flex w-full items-center justify-between gap-2 rounded-md border border-line px-3 py-2 md:w-auto md:justify-start">
          <span className="island-kicker">Guests</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={guests === 0}
              onClick={() =>
                onChange({ guests: guests <= 1 ? undefined : guests - 1 })
              }
              className="flex size-7 items-center justify-center rounded-full border border-line disabled:opacity-40"
            >
              <Minus size={14} aria-hidden />
            </button>
            <span className="w-9 text-center text-sm font-semibold">
              {guests === 0 ? 'Any' : guests}
            </span>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => onChange({ guests: Math.min(6, guests + 1) })}
              className="flex size-7 items-center justify-center rounded-full border border-line"
            >
              <Plus size={14} aria-hidden />
            </button>
          </div>
        </div>

        <label className="flex w-full items-center justify-between gap-2 rounded-md border border-line px-3 py-2.5 md:w-auto md:justify-start md:py-2">
          <span className="island-kicker">Price</span>
          <select
            value={priceBandValue(value)}
            onChange={(e) => setBand(e.target.value)}
            className="bg-transparent text-sm font-semibold text-sea-ink outline-none"
          >
            {PRICE_BANDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex w-full items-center justify-between gap-2 rounded-md border border-line px-3 py-2.5 md:w-auto md:justify-start md:py-2">
          <span className="island-kicker">View</span>
          <select
            value={value.view ?? 'any'}
            onChange={(e) =>
              onChange({
                view:
                  e.target.value === 'any'
                    ? undefined
                    : (e.target.value as RoomView),
              })
            }
            className="bg-transparent text-sm font-semibold text-sea-ink outline-none"
          >
            <option value="any">Any view</option>
            {ROOM_VIEWS.map((v) => (
              <option key={v} value={v}>
                {v} view
              </option>
            ))}
          </select>
        </label>

        <div className="flex w-full items-center gap-3 md:ms-auto md:w-auto">
          <span
            className="hidden text-sm text-sea-ink-soft md:inline"
            aria-hidden
          >
            {count} {count === 1 ? 'stay' : 'stays'}
          </span>
          <label className="flex flex-1 items-center justify-between gap-2 rounded-md border border-line px-3 py-2.5 md:flex-none md:justify-start md:py-2">
            <span className="island-kicker">Sort</span>
            <select
              value={value.sort ?? 'rec'}
              onChange={(e) =>
                onChange({ sort: e.target.value as RoomFilters['sort'] })
              }
              className="bg-transparent text-sm font-semibold text-sea-ink outline-none"
            >
              <option value="rec">Recommended</option>
              <option value="asc">Price · low to high</option>
              <option value="desc">Price · high to low</option>
            </select>
          </label>

          {hasActiveFilters(value) ? (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-sea-ink-soft hover:text-sea-ink"
            >
              <X size={15} aria-hidden /> Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
