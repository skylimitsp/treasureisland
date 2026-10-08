import { useEffect, useRef, useState } from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'

// Read-only link with Copy and WhatsApp share; selects the text if the clipboard is blocked.
export function CopyLinkField({
  link,
  shareText,
}: {
  link: string
  shareText: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle')

  useEffect(() => {
    if (status !== 'copied') return
    const t = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(t)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setStatus('copied')
    } catch {
      inputRef.current?.select()
      setStatus('manual')
    }
  }

  const share = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${link}`)}`

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          readOnly
          value={link}
          aria-label="Invite link"
          onFocus={(e) => e.currentTarget.select()}
          className="min-h-11 w-full min-w-0 flex-1 rounded-md border border-line bg-[color:var(--surface)] px-3 py-2 font-mono text-xs text-sea-ink outline-none focus:border-lagoon"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {status === 'copied' ? (
              <Check size={16} aria-hidden />
            ) : (
              <Copy size={16} aria-hidden />
            )}
            {status === 'copied' ? 'Copied' : 'Copy link'}
          </button>
          <a
            href={share}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost flex-1 sm:flex-none"
          >
            <MessageCircle size={16} aria-hidden />
            WhatsApp
          </a>
        </div>
      </div>
      <p aria-live="polite" className="mt-1 min-h-4 text-xs text-sea-ink-soft">
        {status === 'manual'
          ? 'Copying was blocked; the link is selected, press Ctrl+C (⌘C on Mac).'
          : null}
      </p>
    </div>
  )
}
