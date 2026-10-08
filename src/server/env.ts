import type { Database } from '#/server/db/client'
import type { SessionUser } from '#/server/services/auth.service'

// Bindings from wrangler.jsonc plus secrets, which are optional so local dev works without them.
// MEDIA (R2) is optional while file uploads are switched off.
export type Bindings = Omit<Env, 'MEDIA'> & {
  MEDIA?: R2Bucket
  RESEND_API_KEY?: string
  TURNSTILE_SECRET?: string
}

export type AppEnv = {
  Bindings: Bindings
  Variables: {
    db: Database
    user: SessionUser | null
  }
}
