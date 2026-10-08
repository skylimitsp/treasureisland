/**
 * Creates (or resets) a staff admin. Usage:
 *   ADMIN_PASSWORD='…' pnpm db:create-admin <email> "<Full Name>" [--remote]
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { execFileSync } from 'node:child_process'

import { hashPassword } from '../src/server/lib/crypto.ts'

const [email, name] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const remote = process.argv.includes('--remote')
const password = process.env.ADMIN_PASSWORD

if (!email || !name || !password || password.length < 10) {
  console.error(
    'Usage: ADMIN_PASSWORD=<10+ chars> pnpm db:create-admin <email> "<Full Name>" [--remote]',
  )
  process.exit(1)
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const hash = await hashPassword(password)
const sql =
  `INSERT INTO users (id, name, email, role, password_hash, active, created_at) ` +
  `VALUES (${q(crypto.randomUUID())}, ${q(name)}, ${q(email.toLowerCase())}, 'admin', ${q(hash)}, 1, ${q(new Date().toISOString())}) ` +
  `ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin', active = 1;`

execFileSync(
  'pnpm',
  [
    'exec',
    'wrangler',
    'd1',
    'execute',
    'treasureislandghana',
    remote ? '--remote' : '--local',
    '--command',
    sql,
    '--yes',
  ],
  { stdio: 'inherit' },
)
console.log(`Admin ready: ${email.toLowerCase()}`)
