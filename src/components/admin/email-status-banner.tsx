import { useEmailStatusQuery } from '#/hooks/queries/campaigns.query'

// Explains, up front, whether campaigns will really be delivered.
export function EmailStatusBanner() {
  const status = useEmailStatusQuery()
  const mode = status.data?.mode
  if (!mode || mode === 'live') return null
  return (
    <div
      role="status"
      className={`mb-6 rounded-md border p-4 text-sm ${
        mode === 'off'
          ? 'border-sunset/40 bg-sunset/10 text-sea-ink'
          : 'border-lagoon/40 bg-lagoon/10 text-sea-ink'
      }`}
    >
      {mode === 'off' ? (
        <>
          <strong>Email sending isn't set up yet.</strong> You can write and
          save campaigns, but sending is blocked until the Resend email key is
          added to the website (Cloudflare → Worker → Settings → Variables and
          Secrets → <code>RESEND_API_KEY</code>).
        </>
      ) : (
        <>
          <strong>Test mode:</strong> this is a local copy of the site, so
          emails are written to the server log instead of being delivered.
        </>
      )}
    </div>
  )
}
