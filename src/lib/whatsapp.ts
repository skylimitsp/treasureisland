import { CONTACT } from '#/constants/site'

// Opens a chat with the resort's WhatsApp line, pre-filled with the guest's selection.
export function whatsappUrl(lines: Array<string | false | null | undefined>) {
  const text = lines.filter(Boolean).join('\n')
  return `${CONTACT.whatsappHref}?text=${encodeURIComponent(text)}`
}

// Human dates for the message, e.g. "Thu 10 Dec 2026".
export function waDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
