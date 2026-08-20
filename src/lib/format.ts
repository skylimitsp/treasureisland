// Shared date and currency formatting for the whole resort app.

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatStayDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

// e.g. "Sat, 12 Apr → Wed, 16 Apr"
export function formatStayRange(checkIn: string, checkOut: string): string {
  return `${formatStayDate(checkIn)} → ${formatStayDate(checkOut)}`
}

export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}

// Nightly rate label, e.g. "$920 / night".
export function formatNightlyRate(price: number): string {
  return `${formatPrice(price)} / night`
}

// Abbreviates large counts (1.2k) for review and stat tiles.
export function formatCount(value: number): string {
  if (value < 1000) return `${value}`
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
