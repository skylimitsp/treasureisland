/**
 * Media library on R2: validated uploads, registry rows, deletes.
 * @author Joseph Nartey
 * @github devjoemedia
 */
import { desc, eq } from 'drizzle-orm'

import { media } from '#/server/db/schema'
import { first } from '#/server/lib/rows'
import { ApiError, notFound } from '#/server/lib/errors'
import type { Database } from '#/server/db/client'

const ALLOWED = new Map([
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['application/pdf', 'pdf'],
])
// Uploads are off until an R2 bucket is bound; callers get a clear 404 meanwhile.
export function mediaBucket(env: { MEDIA?: R2Bucket }): R2Bucket {
  if (!env.MEDIA)
    throw new ApiError('NOT_FOUND', 'File uploads are not enabled')
  return env.MEDIA
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export async function uploadMedia(
  db: Database,
  bucket: R2Bucket,
  file: File,
  alt: string,
  uploadedBy: string,
) {
  const ext = ALLOWED.get(file.type)
  if (!ext)
    throw new ApiError(
      'VALIDATION',
      'Upload a WebP, AVIF, JPEG, PNG or PDF file',
    )
  if (file.size > MAX_UPLOAD_BYTES)
    throw new ApiError('VALIDATION', 'Files must be 10 MB or smaller')

  const key = `uploads/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  })
  const [row] = await db
    .insert(media)
    .values({ key, contentType: file.type, size: file.size, alt, uploadedBy })
    .returning()
  return { ...row, url: `/api/v1/media/${key}` }
}

export async function listMedia(db: Database) {
  const rows = await db.select().from(media).orderBy(desc(media.createdAt))
  return rows.map((r) => ({ ...r, url: `/api/v1/media/${r.key}` }))
}

export async function deleteMedia(db: Database, bucket: R2Bucket, id: string) {
  const row = first(await db.delete(media).where(eq(media.id, id)).returning())
  if (!row) throw notFound('File')
  await bucket.delete(row.key)
}
