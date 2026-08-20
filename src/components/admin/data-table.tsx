import { useState } from 'react'
import { flexRender } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
} from '@tanstack/react-table/legacy'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { RowData, SortingState } from '@tanstack/react-table'
import type { LegacyColumnDef, LegacyTable } from '@tanstack/react-table/legacy'
import type { ReactNode } from 'react'

// Re-export the v8-style column type so admin pages have one import source.
export type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy'

interface DataTableProps<TData extends RowData> {
  columns: Array<LegacyColumnDef<TData>>
  data: Array<TData>
  searchPlaceholder?: string
  toolbar?: (table: LegacyTable<TData>) => ReactNode
  emptyState?: ReactNode
  pageSize?: number
}

// Generic TanStack Table: sorting, global filter, pagination, sticky header.
export function DataTable<TData extends RowData>({
  columns,
  data,
  searchPlaceholder = 'Search…',
  toolbar,
  emptyState,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useLegacyTable<TData>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  })

  const rows = table.getRowModel().rows

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[220px]">
          <span className="sr-only">Search table</span>
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sea-ink-soft"
          />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-line bg-[color:var(--surface)] py-2 pl-9 pr-3 text-sm text-sea-ink outline-none focus:border-lagoon"
          />
        </label>
        {toolbar ? toolbar(table) : null}
      </div>

      <div className="island-shell overflow-hidden rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-[color:var(--surface-strong)]">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} className="border-b border-line text-left">
                  {group.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const dir = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 font-semibold text-sea-ink-soft"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1 hover:text-sea-ink"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {dir === 'asc' ? (
                              <ChevronUp size={14} aria-hidden />
                            ) : dir === 'desc' ? (
                              <ChevronDown size={14} aria-hidden />
                            ) : null}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10">
                    {emptyState ?? (
                      <p className="text-center text-sea-ink-soft">
                        No results.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-line/60 last:border-0 hover:bg-black/[0.03]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sea-ink">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-sea-ink-soft">
        <span aria-live="polite">
          {rows.length} of {table.getFilteredRowModel().rows.length} shown
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost px-3 py-1.5"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {Math.max(1, table.getPageCount())}
          </span>
          <button
            type="button"
            className="btn btn-ghost px-3 py-1.5"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
