import { Link } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'

import { cn } from '#/lib/utils'
import type { MenuGroup, MenuSection } from '#/types'

const TABS: ReadonlyArray<{ id: MenuGroup; label: string }> = [
  { id: 'food', label: 'Food' },
  { id: 'drinks', label: 'Drinks' },
]

interface Props {
  group: MenuGroup
  sections: Array<MenuSection>
  activeId?: string
  query: string
  onQuery: (value: string) => void
}

// Smooth-scrolls to a section (instant under reduced motion) and keeps the hash shareable.
function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

// Sticky under the header: Food/Drinks (kept in the URL), search, and section jump links.
export function MenuToolbar({
  group,
  sections,
  activeId,
  query,
  onQuery,
}: Props) {
  const searching = query.trim().length > 0
  const activeTab = searching ? -1 : TABS.findIndex((t) => t.id === group)

  return (
    <div className="sticky top-20 z-30 mt-8 border-b border-line bg-foam/95 backdrop-blur md:top-[5.5rem]">
      <div className="page-wrap flex items-center gap-2 py-3 sm:gap-3">
        <nav
          aria-label="Menu pages"
          className="relative grid shrink-0 grid-cols-2 gap-1 rounded-md border border-line bg-sand p-1"
        >
          {/* One indicator slides between the two equal columns (column width + the 0.25rem gap). */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-md bg-sea-ink transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none',
              activeTab === 1 && 'translate-x-[calc(100%+0.25rem)]',
              activeTab === -1 && 'opacity-0',
            )}
          />
          {TABS.map((tab) => {
            const current = group === tab.id && !searching
            return (
              <Link
                key={tab.id}
                to="/menu"
                search={{ tab: tab.id }}
                replace
                resetScroll={false}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-bold no-underline transition-colors duration-300 sm:px-6 sm:text-base',
                  current
                    ? 'text-foam hover:text-foam'
                    : 'text-sea-ink hover:bg-foam/70 hover:text-sea-ink',
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        <div role="search" className="relative min-w-0 flex-1">
          <label htmlFor="menu-search" className="sr-only">
            Search the menu
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-sea-ink-soft"
          />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search"
            autoComplete="off"
            className="min-h-11 w-full rounded-md border border-line bg-foam pr-12 pl-10 text-base text-sea-ink outline-none placeholder:text-sea-ink-soft/80 focus-visible:border-lagoon-deep focus-visible:ring-2 focus-visible:ring-lagoon/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {searching && (
            <button
              type="button"
              onClick={() => onQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-full text-sea-ink hover:bg-sand"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {!searching && (
        <nav aria-label="Jump to a section" className="page-wrap">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    jumpTo(s.id)
                  }}
                  aria-current={activeId === s.id ? 'location' : undefined}
                  className={cn(
                    'inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-semibold whitespace-nowrap no-underline',
                    activeId === s.id
                      ? 'border-sea-ink bg-sea-ink text-foam hover:text-foam'
                      : 'border-line text-sea-ink-soft hover:border-sea-ink hover:text-sea-ink',
                  )}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
