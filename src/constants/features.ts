// Feature flags: flip a value to switch a section of the site on or off.
// A disabled page redirects away and drops out of the header and footer nav.

export const FEATURES = {
  /** The online restaurant menu at /menu. Off until the official menu is published. */
  menu: false,
} as const

export type Feature = keyof typeof FEATURES

export function isEnabled(feature: Feature): boolean {
  return FEATURES[feature]
}
