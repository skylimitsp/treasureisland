import { useMemo, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { isEnabled } from '#/constants/features'
import { seo } from '#/lib/seo'
import { menuLd } from '#/lib/structured-data'
import { matchesQuery } from '#/lib/menu-search'
import {
  menuQueryOptions,
  menuSectionsQueryOptions,
  useMenuQuery,
  useMenuSectionsQuery,
} from '#/hooks/queries/menu.query'
import { useScrollSpy } from '#/hooks/use-scroll-spy'
import { MenuMasthead } from '#/components/menu/menu-masthead'
import { MenuToolbar } from '#/components/menu/menu-toolbar'
import { MenuSectionBlock } from '#/components/menu/menu-section-block'
import { MenuFooterMark } from '#/components/menu/menu-footer-mark'
import { MenuEmptyState } from '#/components/menu/menu-empty-state'
import type { MenuGroup } from '#/types'

// The printed menu, online: ?tab=food|drinks mirrors its two pages so either can be shared.
// No official menu is published yet, so an empty list shows a call-us state.
export const Route = createFileRoute('/menu')({
  validateSearch: (search: Record<string, unknown>): { tab?: MenuGroup } =>
    search.tab === 'food' || search.tab === 'drinks' ? { tab: search.tab } : {},
  // While the menu flag is off, send visitors to the restaurant amenity instead.
  beforeLoad: () => {
    if (!isEnabled('menu')) {
      throw redirect({
        to: '/amenities/$slug',
        params: { slug: 'restaurant' },
        replace: true,
      })
    }
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(menuQueryOptions()),
      context.queryClient.ensureQueryData(menuSectionsQueryOptions()),
    ]),
  head: ({ loaderData }) =>
    seo({
      title: 'Menu',
      description:
        'The hotel restaurant at Treasure Island Ada offers you high quality ' +
        'services and facilities. Call (+233)-055-270-1946 for today’s menu.',
      path: '/menu',
      image: '/photos/ocean-deck-dining.webp',
      imageAlt: 'Dining at Treasure Island Ada',
      // Only describe a menu in structured data once real dishes exist.
      jsonLd: loaderData?.[0].length
        ? menuLd(loaderData[0], loaderData[1])
        : undefined,
    }),
  component: MenuPage,
})

function MenuPage() {
  const group: MenuGroup = Route.useSearch().tab ?? 'food'
  const [query, setQuery] = useState('')
  const menu = useMenuQuery()
  const sections = useMenuSectionsQuery()
  const searching = query.trim().length > 0

  // Searching looks across food and drinks; otherwise show the chosen page in printed order.
  const blocks = useMemo(() => {
    const items = (menu.data ?? []).filter(
      (m) => m.available && matchesQuery(m, query),
    )
    return (sections.data ?? [])
      .filter((s) => searching || s.group === group)
      .map((s) => ({
        section: s,
        items: items.filter((i) => i.category === s.id),
      }))
      .filter((b) => b.items.length > 0)
  }, [menu.data, sections.data, query, searching, group])

  const pageSections = (sections.data ?? []).filter((s) => s.group === group)
  const activeId = useScrollSpy(pageSections.map((s) => s.id))
  const matchCount = blocks.reduce((n, b) => n + b.items.length, 0)
  const error = menu.error ?? sections.error
  const pending = menu.isPending || sections.isPending
  const empty = !pending && !error && (menu.data ?? []).length === 0

  return (
    <main>
      <MenuMasthead />
      {empty ? null : (
        <MenuToolbar
          group={group}
          sections={pageSections}
          activeId={activeId}
          query={query}
          onQuery={setQuery}
        />
      )}

      <div className="page-wrap pt-8" aria-busy={pending}>
        {error ? (
          <div className="island-shell rounded-md p-8 text-center">
            <p className="text-sea-ink-soft">{error.message}</p>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => (menu.refetch(), sections.refetch())}
            >
              Try again
            </button>
          </div>
        ) : empty ? (
          <div className="py-8">
            <MenuEmptyState />
          </div>
        ) : pending ? (
          <div className="gap-16 lg:columns-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="mb-12 animate-pulse break-inside-avoid"
              >
                <div className="h-8 w-40 rounded-md bg-sand" />
                {Array.from({ length: 4 }, (__, j) => (
                  <div key={j} className="mt-4 h-10 rounded-md bg-sand" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <p role="status" className="mb-6 text-sm text-sea-ink-soft">
              {searching
                ? matchCount > 0
                  ? `${matchCount} ${matchCount === 1 ? 'match' : 'matches'} for “${query.trim()}”`
                  : `Nothing matches “${query.trim()}”. Try a dish or drink, like jollof or mojito.`
                : null}
            </p>
            {searching && matchCount === 0 ? (
              <button
                type="button"
                className="btn btn-ghost mb-12"
                onClick={() => setQuery('')}
              >
                Clear search
              </button>
            ) : (
              <div className="gap-16 lg:columns-2 lg:[column-rule:1px_solid_var(--line)]">
                {blocks.map((b) => (
                  <MenuSectionBlock
                    key={b.section.id}
                    section={b.section}
                    items={b.items}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <MenuFooterMark />
    </main>
  )
}
