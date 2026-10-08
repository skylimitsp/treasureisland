const DAY_MS = 24 * 60 * 60 * 1000

// Stay dates are date-only strings (YYYY-MM-DD) in resort time (Africa/Accra = UTC).
export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms =
    Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)
  return Math.round(ms / DAY_MS)
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addHours(hours: number, from = new Date()): string {
  return new Date(from.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export function addDays(days: number, from = new Date()): string {
  return addHours(days * 24, from)
}
