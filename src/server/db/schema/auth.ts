import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { bool, createdAt, id } from '#/server/db/schema/columns'

export const users = sqliteTable('users', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'concierge'] }).notNull(),
  avatar: text('avatar'),
  passwordHash: text('password_hash'),
  active: bool('active').notNull().default(true),
  lastLoginAt: text('last_login_at'),
  createdAt: createdAt(),
})

// Session ids are SHA-256 hashes of the cookie token, never the token itself.
export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: text('expires_at').notNull(),
    userAgent: text('user_agent'),
    createdAt: createdAt(),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
)

// One-time tokens for staff invites and password resets (looked up by hash, like sessions).
// `linkToken` keeps a pending invite's raw token so admins can copy the link; wiped once used.
export const authTokens = sqliteTable('auth_tokens', {
  id: text('id').primaryKey(),
  kind: text('kind', { enum: ['invite', 'reset'] }).notNull(),
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'concierge'] }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdBy: text('created_by'),
  expiresAt: text('expires_at').notNull(),
  usedAt: text('used_at'),
  linkToken: text('link_token'),
  createdAt: createdAt(),
})
