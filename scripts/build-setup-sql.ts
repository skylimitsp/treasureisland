/**
 * One-paste production setup for the D1 dashboard console (no CLI needed):
 * schema + migration bookkeeping + content + a one-time first-admin invite.
 * Usage: pnpm tsx scripts/build-setup-sql.ts <admin-email> <site-url> <out-dir>
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { randomToken, sha256 } from '../src/server/lib/crypto.ts'
import { buildSeedSql } from './seed-sql.ts'

const [email, siteUrl, outDir] = process.argv.slice(2)
if (!email || !siteUrl || !outDir) {
  console.error(
    'Usage: tsx scripts/build-setup-sql.ts <admin-email> <site-url> <out-dir>',
  )
  process.exit(1)
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const files = readdirSync('drizzle')
  .filter((f) => f.endsWith('.sql'))
  .sort()

// Same table wrangler uses, so `wrangler d1 migrations apply` later skips these files.
const bookkeeping = [
  'CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);',
  ...files.map(
    (f) => `INSERT OR IGNORE INTO d1_migrations (name) VALUES (${q(f)});`,
  ),
]

// IF NOT EXISTS makes a re-run safe if the console stopped part-way.
const schema = files.map((f) =>
  readFileSync(join('drizzle', f), 'utf8')
    .replace(/--> statement-breakpoint/g, '')
    .replace(/CREATE TABLE `/g, 'CREATE TABLE IF NOT EXISTS `')
    .replace(/CREATE (UNIQUE )?INDEX `/g, 'CREATE $1INDEX IF NOT EXISTS `'),
)

const token = randomToken()
const now = new Date()
const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
const invite = `INSERT OR IGNORE INTO auth_tokens (id, kind, email, role, created_by, expires_at, created_at) VALUES (${q(await sha256(token))}, 'invite', ${q(email.toLowerCase())}, 'admin', 'setup', ${q(expires.toISOString())}, ${q(now.toISOString())});`

// The D1 console rejects empty statements, so drop comments and blank lines.
const clean = (parts: Array<string>) =>
  parts
    .join('\n')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('--'))
    .join('\n')

const parts = {
  '1-schema.sql': clean([...schema, ...bookkeeping]),
  '2-content.sql': clean([buildSeedSql()]),
  '3-admin-invite.sql': clean([invite]),
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'setup.sql'), clean(Object.values(parts)))
for (const [name, body] of Object.entries(parts))
  writeFileSync(join(outDir, name), body)
const link = `${siteUrl.replace(/\/$/, '')}/auth/invite?token=${token}`
writeFileSync(
  join(outDir, 'admin-invite-link.txt'),
  `One-time admin invite for ${email} (expires ${expires.toUTCString()}).\nOpen after setup.sql has run and the site is deployed:\n\n${link}\n`,
  { mode: 0o600 },
)
console.log(
  `Wrote setup.sql, its 3 parts (${files.length} migrations) and admin-invite-link.txt to ${outDir}`,
)
