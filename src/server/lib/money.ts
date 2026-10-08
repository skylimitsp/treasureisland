// The database stores minor units; the API speaks major units like the existing types.
export const toMinor = (major: number) => Math.round(major * 100)

export const toMajor = (minor: number) => minor / 100
