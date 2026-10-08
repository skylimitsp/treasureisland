import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { app } from '#/server/app'

// Forwards every /api/v1/* request to the Hono app with the Worker bindings.
const handle = ({ request }: { request: Request }) => app.fetch(request, env)

export const Route = createFileRoute('/api/v1/$')({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
      OPTIONS: handle,
    },
  },
})
