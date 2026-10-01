import { CalendarDays, CheckCircle2, Users } from 'lucide-react'

// Illustrative mini "Booking confirmed" card mirroring the real booking panel.
export function BookingPreviewCard() {
  return (
    <div
      role="img"
      aria-label="Example booking: Suite With Balcony, 3 nights, 2 guests, confirmed"
      className="w-full max-w-[15rem] -rotate-3 rounded-md bg-white p-4 text-left text-footer shadow-xl"
    >
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-footer">
        <CheckCircle2 size={14} aria-hidden /> Booking confirmed
      </p>
      <p className="display-title mt-2 text-lg font-semibold">
        Suite With Balcony
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} aria-hidden />
          <dt className="sr-only">Stay</dt>
          <dd>Fri 12 – Mon 15 · 3 nights</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} aria-hidden />
          <dt className="sr-only">Guests</dt>
          <dd>2 guests</dd>
        </div>
      </dl>
    </div>
  )
}
