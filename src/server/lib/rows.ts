// `.returning()` yields [] when nothing matched; this keeps that case in the type.
export const first = <T>(rows: Array<T>): T | undefined => rows[0]
