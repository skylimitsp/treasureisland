/**
 * Seeds D1 from the src/data mocks. Usage: pnpm db:seed [--remote] [--demo]
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

import { buildSeedSql } from './seed-sql.ts'

const remote = process.argv.includes('--remote')
const demo = process.argv.includes('--demo')

mkdirSync('.wrangler', { recursive: true })
const file = '.wrangler/seed.sql'
writeFileSync(file, buildSeedSql({ demo }))
console.log(`Wrote ${file}${demo ? ' (with demo data)' : ''}`)

execFileSync(
  'pnpm',
  [
    'exec',
    'wrangler',
    'd1',
    'execute',
    'treasureislandghana',
    remote ? '--remote' : '--local',
    '--file',
    file,
    '--yes',
  ],
  { stdio: 'inherit' },
)
