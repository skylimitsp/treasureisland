import { integer, text } from 'drizzle-orm/sqlite-core'

// Shared column helpers: ISO timestamps as text, booleans as 0/1 integers.
export const createdAt = () =>
  text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())

export const updatedAt = () =>
  text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString())

export const bool = (name: string) => integer(name, { mode: 'boolean' })

export const json = <T>(name: string) => text(name, { mode: 'json' }).$type<T>()

export const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
