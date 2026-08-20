import { createFileRoute } from '@tanstack/react-router'

import { seo } from '#/lib/seo'
import { useRoomAvailabilityQuery } from '#/hooks/queries/availability.query'
import { AdminPageHeader } from '#/components/admin/admin-page-header'
import { AvailabilityRow } from '#/components/admin/availability-row'

export const Route = createFileRoute('/admin/availability')({
  head: () => seo({ title: 'Availability', noindex: true }),
  component: AvailabilityPage,
})

function AvailabilityPage() {
  const availability = useRoomAvailabilityQuery()

  return (
    <div>
      <AdminPageHeader
        title="Availability & rates"
        description="Control what the public site can sell — open or block each room and note held nights."
      />

      {availability.isPending ? (
        <p className="text-sm text-sea-ink-soft">Loading availability…</p>
      ) : availability.isError ? (
        <div className="island-shell rounded-md p-6 text-center">
          <p className="text-sea-ink-soft">{availability.error.message}</p>
          <button
            className="btn btn-ghost mt-4"
            onClick={() => availability.refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {availability.data.map((item) => (
            <AvailabilityRow key={item.roomId} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
