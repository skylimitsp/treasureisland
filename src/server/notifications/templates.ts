import type { Email } from '#/server/notifications/mailer'

type Template = Omit<Email, 'to' | 'replyTo'>

// Every interpolated value is guest-supplied, so it is escaped before entering HTML.
const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function layout(
  title: string,
  rows: Array<[string, unknown]>,
  intro: string,
  cta?: { label: string; url: string },
) {
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#4f6b70">${esc(k)}</td><td style="padding:6px 0;color:#173a40"><strong>${esc(v)}</strong></td></tr>`,
    )
    .join('')
  const button = cta
    ? `<p style="margin:24px 0"><a href="${esc(cta.url)}" style="background:#2f7f86;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">${esc(cta.label)}</a></p>`
    : ''
  const html = `<!doctype html><html><body style="margin:0;background:#f4f8f7;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
<p style="color:#2f7f86;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:0">Treasure Island Ada</p>
<h1 style="color:#173a40;font-size:22px;margin:8px 0 16px">${esc(title)}</h1>
<p style="color:#173a40;line-height:1.5">${esc(intro)}</p>
<table style="border-collapse:collapse;margin:16px 0">${table}</table>${button}
<p style="color:#4f6b70;font-size:12px;margin-top:32px">Treasure Island Ada · Ada Foah, Ghana · (+233) 055 270 1946</p>
</div></body></html>`
  const text = [
    title,
    '',
    intro,
    '',
    ...rows.map(([k, v]) => `${k}: ${v ?? ''}`),
    cta ? `\n${cta.label}: ${cta.url}` : '',
  ].join('\n')
  return { subject: title, html, text }
}

export const templates = {
  bookingReceived: (b: {
    id: string
    guestName: string
    roomName: string
    checkIn: string
    checkOut: string
    guests: number
    total: number
    currency: string
  }): Template =>
    layout(
      `Booking request received · ${b.id}`,
      [
        ['Reference', b.id],
        ['Room', b.roomName],
        ['Check-in', b.checkIn],
        ['Check-out', b.checkOut],
        ['Guests', b.guests],
        ['Estimated total', `${b.currency} ${b.total.toFixed(2)}`],
      ],
      `Thank you, ${b.guestName}. We have received your booking request and our reservations team will confirm it shortly.`,
    ),

  bookingStatus: (b: {
    id: string
    guestName: string
    roomName: string
    checkIn: string
    checkOut: string
    status: string
  }): Template =>
    layout(
      b.status === 'confirmed'
        ? `Your stay is confirmed · ${b.id}`
        : `Booking update · ${b.id}`,
      [
        ['Reference', b.id],
        ['Room', b.roomName],
        ['Check-in', b.checkIn],
        ['Check-out', b.checkOut],
        ['Status', b.status.replace('_', ' ')],
      ],
      b.status === 'confirmed'
        ? `Good news, ${b.guestName}: your booking is confirmed. We look forward to welcoming you.`
        : `Hello ${b.guestName}, the status of your booking has changed.`,
    ),

  staffNewBooking: (
    b: {
      id: string
      guestName: string
      email: string
      roomName: string
      checkIn: string
      checkOut: string
      guests: number
    },
    adminUrl: string,
  ): Template =>
    layout(
      `New booking request · ${b.id}`,
      [
        ['Guest', b.guestName],
        ['Email', b.email],
        ['Room', b.roomName],
        ['Dates', `${b.checkIn} → ${b.checkOut}`],
        ['Guests', b.guests],
      ],
      'A new booking request needs confirming.',
      { label: 'Open in dashboard', url: adminUrl },
    ),

  enquiryReceived: (e: {
    id: string
    name: string
    eventType: string
    date: string
    guests: number
  }): Template =>
    layout(
      `We received your enquiry · ${e.id}`,
      [
        ['Reference', e.id],
        ['Event', e.eventType],
        ['Preferred date', e.date],
        ['Guests', e.guests],
      ],
      `Thank you, ${e.name}. Our event consultants will get in touch to understand your requirements.`,
    ),

  staffNewEnquiry: (
    e: {
      id: string
      name: string
      email: string
      phone: string
      eventType: string
      date: string
      guests: number
      message: string
    },
    adminUrl: string,
  ): Template =>
    layout(
      `New event enquiry · ${e.id}`,
      [
        ['Name', e.name],
        ['Email', e.email],
        ['Phone', e.phone],
        ['Event', e.eventType],
        ['Date', e.date],
        ['Guests', e.guests],
        ['Message', e.message],
      ],
      'A new event enquiry has arrived.',
      { label: 'Open in dashboard', url: adminUrl },
    ),

  slotReceived: (s: {
    id: string
    name: string
    amenityName: string
    date: string
    slot: string
    partySize: number
  }): Template =>
    layout(
      `Reservation request received · ${s.id}`,
      [
        ['Reference', s.id],
        ['Experience', s.amenityName],
        ['Date', s.date],
        ['Time', s.slot],
        ['Party size', s.partySize],
      ],
      `Thank you, ${s.name}. We will confirm your reservation shortly.`,
    ),

  staffNewSlot: (
    s: {
      id: string
      name: string
      email: string
      amenityName: string
      date: string
      slot: string
      partySize: number
    },
    adminUrl: string,
  ): Template =>
    layout(
      `New reservation request · ${s.id}`,
      [
        ['Name', s.name],
        ['Email', s.email],
        ['Experience', s.amenityName],
        ['When', `${s.date} · ${s.slot}`],
        ['Party size', s.partySize],
      ],
      'A guest has requested an experience slot.',
      { label: 'Open in dashboard', url: adminUrl },
    ),

  slotStatus: (s: {
    id: string
    name: string
    amenityName: string
    date: string
    slot: string
    status: string
  }): Template =>
    layout(
      `Reservation ${s.status} · ${s.id}`,
      [
        ['Experience', s.amenityName],
        ['When', `${s.date} · ${s.slot}`],
        ['Status', s.status],
      ],
      s.status === 'confirmed'
        ? `Hello ${s.name}, your reservation is confirmed.`
        : `Hello ${s.name}, unfortunately we cannot accommodate this request. Please contact us for alternatives.`,
    ),

  newsletterConfirm: (confirmUrl: string): Template =>
    layout(
      'Confirm your subscription',
      [],
      'Please confirm you would like to receive news and offers from Treasure Island Ada.',
      { label: 'Confirm subscription', url: confirmUrl },
    ),

  staffInvite: (role: string, acceptUrl: string): Template =>
    layout(
      'You have been invited to the Treasure Island dashboard',
      [['Role', role]],
      'Set your name and password to activate your staff account. This link expires in 72 hours.',
      { label: 'Accept invite', url: acceptUrl },
    ),

  passwordReset: (name: string, resetUrl: string): Template =>
    layout(
      'Reset your password',
      [],
      `Hello ${name}, use the link below to choose a new password. It expires in 2 hours. If you did not ask for this, ignore this email.`,
      { label: 'Reset password', url: resetUrl },
    ),
}
