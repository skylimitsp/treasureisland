// Client-side checks for guest forms; PHONE_RE matches the API's `phone` schema.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PHONE_RE = /^[+\d][\d\s()-]{6,20}$/

export const isPhone = (value: string) => PHONE_RE.test(value.trim())
